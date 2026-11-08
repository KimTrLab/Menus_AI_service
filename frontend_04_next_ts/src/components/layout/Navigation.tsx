"use client";

type View = "home" | "list" | "add";

interface Props {
  currentView: View;
  onChange: (view: View) => void;
}

export default function Navigation({
  currentView,
  onChange
}: Props) {
  const menus = [
    { id: "home", label: "홈으로" },
    { id: "list", label: "전체 메뉴 보기" },
    { id: "add", label: "메뉴 등록" }
  ] as const;

  return (
    <nav className="navigation">
      {menus.map(menu => (
        <button
          key={menu.id}
          className={
            currentView === menu.id ? "active" : ""
          }
          onClick={() => onChange(menu.id)}
        >
          {menu.label}
        </button>
      ))}
    </nav>
  );
}