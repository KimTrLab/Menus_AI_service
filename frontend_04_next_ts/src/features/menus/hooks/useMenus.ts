"use client";
// React의 커스텀 Hook을 사용합니다.
// 메뉴 조회, 검색, 등록, 수정, 삭제 기능과 관련된 상태를 한곳에서 관리합니다.
// 기존에는 각각의 HTML 이벤트에서 API 함수를 직접 호출했습니다.
// 이제는 다음처럼 사용하면 됩니다.
// typescript
// const {
//   menus,
//   loading,
//   fetchMenus,
//   search,
//   create,
//   update,
//   remove
// } = useMenus();

import { useCallback, useState } from "react";

import {
  getAllMenus,
  searchMenus,
  addMenu,
  updateMenu,
  deleteMenu,
  getMenuOne
} from "../api/menu-api";

import {
  Menu,
  MenuCreateRequest
} from "../types/menu";

export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 조회
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllMenus();
      setMenus(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "메뉴 조회 실패"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 검색
  const search = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = keyword.trim()
        ? await searchMenus(keyword.trim())
        : await getAllMenus();

      setMenus(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "검색 실패"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 단건 조회
  const getOne = async (id: number) => {
    return await getMenuOne(id);
  };

  // 등록
  const create = async (data: MenuCreateRequest) => {
    const result = await addMenu(data);
    await fetchMenus();
    return result;
  };

  // 수정
  const update = async (data: Menu) => {
    const result = await updateMenu(data);
    await fetchMenus();
    return result;
  };

  // 삭제
  const remove = async (id: number) => {
    await deleteMenu(id);
    await fetchMenus();
  };

  return {
    menus,
    loading,
    error,
    fetchMenus,
    search,
    getOne,
    create,
    update,
    remove
  };
}