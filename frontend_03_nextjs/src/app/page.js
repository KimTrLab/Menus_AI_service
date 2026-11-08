"use client";

import { useEffect, useState } from "react";

import Navigation from "@/components/Navigation";
import MenuHome from "@/components/MenuHome";
import MenuList from "@/components/MenuList";
import MenuAdd from "@/components/MenuAdd";
import MenuEdit from "@/components/MenuEdit";

import Chat from "@/components/Chat";
import {
  getAllMenus,
  searchMenus,
  getMenuOne,
  addMenu,
  deleteMenu,
  updateMenu
} from "@/services/menuService";

export default function Home() {
  // 현재 보여줄 화면  1번
  const [currentView, setCurrentView] = useState("home");
  // 서버에서 가져온 메뉴 목록
  const [menus, setMenus] = useState([]);
  // 수정할 메뉴 한 개
  const [selectedMenu, setSelectedMenu] = useState(null);
  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 전체 메뉴 조회
  async function loadMenus() {
    setLoading(true);
    const data = await getAllMenus();
    setMenus(data);
    setLoading(false);
  }

  // 처음 실행될 때 메뉴 조회
  useEffect(() => {
    loadMenus();
  }, []);


  // 전체 메뉴 화면으로 이동
  async function showAllMenus() {
    setCurrentView("list");
    await loadMenus();
  }

  // 메뉴 검색
  async function handleSearch(keyword) {
    setLoading(true);
    const data = keyword.trim()
      ? await searchMenus(keyword)
      : await getAllMenus();
    setMenus(data);
    setLoading(false);
  }

  // 메뉴 등록
  async function handleAdd(menuObject) {
    const result = await addMenu(menuObject);
    if (!result) return;
    alert("메뉴가 등록되었습니다.");
    await loadMenus();
    setCurrentView("list");
  }

  // 메뉴 삭제
  async function handleDelete(id) {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    const result = await deleteMenu(id);
    if (!result) return;
    alert("삭제되었습니다.");
    await loadMenus();
  }


  // 수정할 메뉴 한 개 가져오기
  async function handleEdit(id) {
    const data = await getMenuOne(id);
    if (!data) return;
    setSelectedMenu(data);
  }


  // 메뉴 수정
  async function handleUpdate(menuObject) {
    const result = await updateMenu(menuObject);
    if (!result) return;
    alert("수정되었습니다.");
    setSelectedMenu(null);
    await loadMenus();
  }


  // 수정 취소
  function closeEdit() {
    setSelectedMenu(null);
  }


  return (
    <div className="app-layout">

      {/* 왼쪽 AI 채팅 */}
      <Chat />


      {/* 오른쪽 메뉴 관리 */}
      <main className="main-area">
        <h1>음식 메뉴 관리 시스템</h1>

        {/* 메뉴 네비게이션 */}
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {/* 홈 화면 */}
        {currentView === "home" && (
          <MenuHome
            menus={menus}
            loading={loading}
          />
        )}

        {/* 전체 메뉴 화면 */}
        {currentView === "list" && (
          <MenuList
            menus={menus}
            onSearch={handleSearch}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* 메뉴 등록 화면 */}
        {currentView === "add" && (
          <MenuAdd
            onAdd={handleAdd}
          />
        )}

        {/* 메뉴 수정 화면 */}
        {selectedMenu && (
          <MenuEdit
            menu={selectedMenu}
            onSave={handleUpdate}
            onClose={closeEdit}
          />
        )}
      </main>
    </div>

  );
}