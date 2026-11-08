import { apiRequest } from "@/lib/api-client";

import {
  Menu,
  MenuCreateRequest
} from "../types/menu";

const API_URL = "/api/menus";
// 기존 data_api.js를 이 파일로 변경합니다.
// 이 파일에는 메뉴 서버 통신 기능만 존재합니다.
// 전체 메뉴 조회
export async function getAllMenus(): Promise<Menu[]> {
  return apiRequest<Menu[]>(API_URL);
}

// 검색
export async function searchMenus(
  keyword: string
): Promise<Menu[]> {
  return apiRequest<Menu[]>(
    `${API_URL}/search?word=${encodeURIComponent(keyword)}`
  );
}

// 메뉴 한 개 조회
export async function getMenuOne(
  id: number
): Promise<Menu> {
  return apiRequest<Menu>(`${API_URL}/${id}`);
}

// 메뉴 등록
export async function addMenu(
  menu: MenuCreateRequest
): Promise<Menu> {
  return apiRequest<Menu>(API_URL, {
    method: "POST",
    body: JSON.stringify(menu)
  });
}

// 메뉴 삭제
export async function deleteMenu(
  id: number
): Promise<void> {
  return apiRequest<void>(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}

// 메뉴 수정
export async function updateMenu(
  menu: Menu
): Promise<Menu> {
  return apiRequest<Menu>(API_URL, {
    method: "PUT",
    body: JSON.stringify(menu)
  });
}