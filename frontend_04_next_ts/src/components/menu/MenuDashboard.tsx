"use client";

import { useCallback, useEffect, useState } from "react";

import Navigation from "@/components/layout/Navigation";

import MenuHome from "./MenuHome";
import MenuList from "./MenuList";
import MenuForm from "./MenuForm";
import MenuEditDialog from "./MenuEditDialog";

import { useMenus } from "@/features/menus/hooks/useMenus";

import {
  Menu,
  MenuFormData
} from "@/features/menus/types/menu";

type View = "home" | "list" | "add";

export default function MenuDashboard() {
  const [currentView, setCurrentView] =
    useState<View>("home");

  const [selectedMenu, setSelectedMenu] =
    useState<Menu | null>(null);

  const [editOpen, setEditOpen] = useState(false);

  const {
    menus,
    loading,
    error,
    fetchMenus,
    search,
    getOne,
    create,
    update,
    remove
  } = useMenus();

  // 홈 또는 목록 화면 진입 시 데이터 조회
  useEffect(() => {
    if (currentView === "home" || currentView === "list") {
      fetchMenus();
    }
  }, [currentView, fetchMenus]);

  // 화면 이동
  const changeView = (view: View) => {
    setCurrentView(view);
  };

  // 메뉴 등록
  const handleAdd = async (data: MenuFormData) => {
    await create(data);

    alert("메뉴가 등록되었습니다.");

    setCurrentView("list");
  };

  // 메뉴 검색
  const handleSearch = async (keyword: string) => {
    await search(keyword);
  };

  // 메뉴 삭제
  const handleDelete = async (id: number) => {
    if (!confirm("정말 이 메뉴를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await remove(id);
      alert("메뉴가 삭제되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "메뉴 삭제에 실패했습니다."
      );
    }
  };

  // 수정할 메뉴 조회
  const handleEditOpen = async (id: number) => {
    try {
      const data = await getOne(id);

      setSelectedMenu(data);
      setEditOpen(true);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "메뉴를 가져오지 못했습니다."
      );
    }
  };

  // 수정 저장
  const handleUpdate = async (data: MenuFormData) => {
    if (!selectedMenu) return;

    await update({
      id: selectedMenu.id,
      ...data
    });

    setEditOpen(false);
    setSelectedMenu(null);

    alert("메뉴가 수정되었습니다.");
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelectedMenu(null);
  };

  return (
    <div className="main-area">

      <Navigation
        currentView={currentView}
        onChange={changeView}
      />

      {error && (
        <p className="error-message">{error}</p>
      )}

      {currentView === "home" && (
        <MenuHome
          menus={menus}
          loading={loading}
        />
      )}

      {currentView === "list" && (
        <MenuList
          menus={menus}
          loading={loading}
          onSearch={handleSearch}
          onEdit={handleEditOpen}
          onDelete={handleDelete}
        />
      )}

      {currentView === "add" && (
        <section>
          <h2>새 메뉴 등록</h2>

          <MenuForm
            onSubmit={handleAdd}
          />
        </section>
      )}

      <MenuEditDialog
        open={editOpen}
        menu={selectedMenu}
        onSave={handleUpdate}
        onClose={closeEdit}
      />

    </div>
  );
}