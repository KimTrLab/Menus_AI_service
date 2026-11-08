const API_URL = "http://127.0.0.1:8000/menus";

// 1. 전체 메뉴 조회
export async function getAllMenus() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("메뉴 조회 실패");
    }

    return await response.json();

  } catch (error) {
    console.log(error);
    alert("메뉴 조회 중 오류 발생");
    return [];
  }
}

// 2. 메뉴 검색
export async function searchMenus(keyword) {
  try {
    const response = await fetch(
      `${API_URL}/search?word=${encodeURIComponent(keyword)}`
    );

    if (!response.ok) {
      throw new Error("메뉴 검색 실패");
    }

    return await response.json();

  } catch (error) {
    console.log(error);
    alert("메뉴 검색 중 오류 발생");
    return [];
  }
}

// 3. 메뉴 한 개 조회
export async function getMenuOne(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("메뉴 조회 실패");
    }

    return await response.json();

  } catch (error) {
    console.log(error);
    alert("메뉴 조회 중 오류 발생");
    return null;
  }
}

// 4. 메뉴 등록
export async function addMenu(menuObject) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menuObject)
    });

    if (!response.ok) {
      throw new Error("메뉴 등록 실패");
    }

    return await response.json();

  } catch (error) {
    console.log(error);
    alert("메뉴 등록 중 오류 발생");
    return null;
  }
}

// 5. 메뉴 삭제
export async function deleteMenu(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("메뉴 삭제 실패");
    }

    return await response.json();

  } catch (error) {
    console.log(error);
    alert("메뉴 삭제 중 오류 발생");
    return null;
  }
}

// 6. 메뉴 수정
export async function updateMenu(menuObject) {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menuObject)
    });

    if (!response.ok) {
      throw new Error("메뉴 수정 실패");
    }

    return await response.json();

  } catch (error) {
    console.log(error);
    alert("메뉴 수정 중 오류 발생");
    return null;
  }
}