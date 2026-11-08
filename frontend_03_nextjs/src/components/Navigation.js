"use client";

// React 개념은 Props, 부모 컴포넌트가 자식 컴포넌트에게 값을 전달
export default function Navigation({ currentView, setCurrentView }) {

  return (
    <nav>
      <button
        className={currentView === "home" ? "active" : ""}
        onClick={() => setCurrentView("home")}
      >
        홈으로
      </button>

      <button
        className={currentView === "list" ? "active" : ""}
        onClick={() => setCurrentView("list")}
      >
        전체 메뉴 보기
      </button>

      <button
        className={currentView === "add" ? "active" : ""}
        onClick={() => setCurrentView("add")}
      >
        메뉴 등록
      </button>
    </nav>
  );
}