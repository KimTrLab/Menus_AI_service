import os
import json
import re
import hashlib

import chromadb

from dotenv import load_dotenv
from service import data

# LangChain
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_core.output_parsers import JsonOutputParser


# =========================
# 1. 환경 설정
# =========================

load_dotenv()

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

VECTOR_DIR = os.path.join(
    BASE_DIR,
    "rag",
    "vector_store"
)

os.makedirs(VECTOR_DIR, exist_ok=True)

EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4.1-mini"

COLLECTION_NAME = "food_menus"


# =========================
# 2. 모델 생성
# =========================

embeddings = OpenAIEmbeddings(
    model=EMBEDDING_MODEL
)

llm = ChatOpenAI(
    model=CHAT_MODEL,
    temperature=0
)

parser = JsonOutputParser()


# =========================
# 3. ChromaDB 연결
# =========================

vectorstore = Chroma(
    collection_name=COLLECTION_NAME,
    embedding_function=embeddings,
    persist_directory=VECTOR_DIR,
    collection_metadata={"hnsw:space": "cosine"}
)


# =========================
# 4. 메뉴 데이터 처리
# =========================

def get_menu_hash(menus):

    menu_json = json.dumps(
        menus,
        ensure_ascii=False,
        sort_keys=True
    )

    return hashlib.sha256(
        menu_json.encode("utf-8")
    ).hexdigest()


def menu_to_document(menu):

    return f"""
음식 이름: {menu['name']}

음식 ID: {menu['id']}

칼로리: {menu['calories']} kcal

음식 설명: {menu['description']}
"""


# =========================
# 5. Vector DB 동기화
# =========================

def sync_vector_db():

    menus = data.get_all()

    current_hash = get_menu_hash(menus)

    hash_path = os.path.join(
        VECTOR_DIR,
        "menu_hash.txt"
    )

    saved_hash = None

    if os.path.exists(hash_path):

        with open(hash_path, "r", encoding="utf-8") as file:
            saved_hash = file.read().strip()

    collection = vectorstore._collection

    if (
        saved_hash == current_hash
        and collection.count() == len(menus)
    ):
        return

    print("메뉴 데이터를 벡터 DB에 저장합니다.")

    # 기존 데이터 삭제
    if collection.count() > 0:

        collection.delete(
            ids=collection.get()["ids"]
        )

    if menus:

        documents = [
            Document(
                page_content=menu_to_document(menu),
                metadata={
                    "menu_id": menu["id"],
                    "name": menu["name"],
                    "calories": menu["calories"]
                }
            )
            for menu in menus
        ]

        vectorstore.add_documents(
            documents=documents,
            ids=[
                str(menu["id"])
                for menu in menus
            ]
        )

    with open(hash_path, "w", encoding="utf-8") as file:
        file.write(current_hash)

    print("벡터 DB 저장 완료!")
    print("저장된 메뉴 개수:", collection.count())


# =========================
# 6. Retrieval
# =========================

def retrieve_docs(query):

    # 벡터 DB 동기화
    sync_vector_db()

    # 칼로리 조건 검색
    calorie_result = search_calories(query)

    if calorie_result is not None:

        return [
            Document(
                page_content=menu_to_document(menu),
                metadata={
                    "menu_id": menu["id"],
                    "name": menu["name"],
                    "calories": menu["calories"]
                }
            )
            for menu in calorie_result[:100]
        ]

    # 일반 자연어 질문
    return vectorstore.similarity_search(
        query,
        k=6
    )


# =========================
# 7. 칼로리 숫자 조건 검색
# =========================

def search_calories(question):

    match = re.search(
        r"(\d+)\s*kcal\s*(이하|미만|이상|초과)|(\d+)\s*(이하|미만|이상|초과)",
        question,
        re.IGNORECASE
    )

    if not match:
        return None

    number = int(
        match.group(1) or match.group(3)
    )

    condition = (
        match.group(2) or match.group(4)
    )

    menus = data.get_all()

    if condition == "이하":

        return [
            m for m in menus
            if m["calories"] <= number
        ]

    elif condition == "미만":

        return [
            m for m in menus
            if m["calories"] < number
        ]

    elif condition == "이상":

        return [
            m for m in menus
            if m["calories"] >= number
        ]

    else:

        return [
            m for m in menus
            if m["calories"] > number
        ]


# =========================
# 8. Context 생성
# =========================

def format_docs(docs):

    return "\n\n".join(
        [doc.page_content for doc in docs]
    )


def format_history(history):

    if not history:
        return ""

    history_text = ""

    for item in history[-6:]:

        role = item.get("role")

        content = item.get("content", "")

        if role in ["user", "assistant"] and content:

            history_text += (
                f"\n{role}: {content[:2000]}"
            )

    return history_text


# =========================
# 9. Prompt
# =========================

prompt = ChatPromptTemplate.from_template("""
너는 음식 메뉴 전문 AI 도우미야.

반드시 아래 JSON 형식으로만 답변해.

{{
    "answer": "사용자에게 보여줄 답변",
    "sources": ["음식이름1", "음식이름2"]
}}

조건:
- 반드시 검색된 참고 정보만 근거로 답변할 것
- 검색 자료에 없는 칼로리나 음식 정보를 만들지 말 것
- 자료가 부족하면 자료가 부족하다고 답변할 것
- 칼로리는 kcal 단위로 표시할 것
- 음식 추천은 검색된 음식만 대상으로 할 것
- 친절한 한국어로 답변할 것
- sources에는 실제 참고한 음식 이름만 넣을 것
- JSON 이외의 설명이나 Markdown을 출력하지 말 것

[이전 대화]
{history}

[사용자 질문]
{query}

[참고 정보]
{context}
""")


# =========================
# 10. RAG Chain
# =========================

rag_chain = (

    # 1. Retrieval
    RunnableLambda(lambda x: {

        "docs": retrieve_docs(x["query"]),

        "query": x["query"],

        "history": x.get("history", [])

    })

    # 2. Context 생성
    | RunnableLambda(lambda x: {

        "docs": x["docs"],

        "query": x["query"],

        "history": format_history(x["history"]),

        "context": format_docs(x["docs"])

    })

    # 3. Prompt → LLM → JSON Parser
    | {

        "answer": (
            prompt
            | llm
            | parser
        ),

        "docs": lambda x: x["docs"]

    }

)


# =========================
# 11. RAG 실행 함수
# =========================

def chat_with_rag(question, history=None):

    result = rag_chain.invoke({

        "query": question,

        "history": history or []

    })

    return {

        "answer": result["answer"]["answer"],

        "sources": result["answer"].get(
            "sources",
            [
                doc.metadata.get("name")
                for doc in result["docs"]
            ]
        )

    }