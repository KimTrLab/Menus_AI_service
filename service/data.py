import json
import os

# 현재 data.py 파일이 있는 service 폴더 경로
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# # service 폴더의 상위 폴더인 backend3 경로
# ROOT_DIR = os.path.dirname(BASE_DIR)

# # storage 폴더 안의 menus.json 경로
# JSON_PATH = os.path.join(ROOT_DIR, "storage", "menus.json")

# JSON_PATH = "./storage/menus.json"
JSON_PATH = "./storage/menus_recommendation.json"

# JSON 파일 읽기
def load_menus():
    with open(JSON_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


# JSON 파일 저장
def save_menus():
    with open(JSON_PATH, "w", encoding="utf-8") as file:
        json.dump(menus, file, ensure_ascii=False, indent=4)


# 메뉴 데이터 불러오기
menus = load_menus()

next_id = max((menu["id"] for menu in menus), default=0) + 1

def get_all():
    return menus


def search_Word(word):
    result = [];
    for m in menus:
        if(word in m['name']):
            result.append(m)
    return result 

#데이터 추가하는 함수
def add_menu(menu):   ## 객체를 받은 것.
   
    menu = menu.model_dump()    ## 객체를 딕셔너리 변경

    ## 전역변수에 있는 next_id 변수를 이 함수 내부에서 사용할께요. 코딩 추가
    global next_id   ## 이 코드는 전역변수에 있는 next_id 변수를 이 함수에서 사용하겠다.
    ##print("11", menu)
    new_menu = {
        "id": next_id,
        "name":menu["name"],
        "calories":menu["calories"],
        "description":menu["description"],
        "recommendation":0
    }
    ##print('22')
    menus.append(new_menu)
    ##print('33')
    next_id += 1

    save_menus()  # JSON 파일에 저장

    return new_menu


# id 로 데이터 삭제하는 함수
def delete_menu(menu_id):                       #enumerate 이 함수를 사용하면 인덱스와 값을 가져올 수 있다.
    for index, menu in enumerate(menus):  # 삭제할 데이터를 찾을 때는 id로 찾고
                                          # 리스트에서 지울 때는 인덱스 번호로 지운다.. 
                                          # 그래서 리스트이 번호와 메뉴의 정보인 값이 모두 필요함
        if menu["id"]== menu_id:  #  삭제할 메뉴..
            menus.pop(index)
            save_menus()  # JSON 파일에 저장
            return menu_id       #삭제가 되었다면  삭제한 아이디를 리턴
    return None   #삭제한 데이터가 없다면   None 리턴됨
    

# id로 데이터를 검색하는 하수
def get_one(id):
    for menu in menus:
        if(menu["id"] == id):
            return menu
    return None

# 클라이언트가 보낸 수정할 데이트로 실제 데이터를 수정하는 코드
def update_one(menudata):  #객체를 받는다.
    for menu in menus:
        #print(menu, '에서 찾아보자')
        #menu변수는 딕셔너리이고,  menudata는 클래스 객체라서 변수 접근 방식이 다름.
        if(menu["id"]==menudata.id):
            #print(menudata,'data 수정')
            menu["name"]=menudata.name
            menu["calories"]=menudata.calories
            menu["description"]=menudata.description
            save_menus()  # JSON 파일에 저장
            return menu
    return None


# 추천수 증가
def update_recommend(id):
    for menu in menus:
        if(menu["id"]==id):
            menu["recommendation"] += 1 
            save_menus()  # JSON 파일에 저장
            print('추천되었습니다.')
            return 
    return None


