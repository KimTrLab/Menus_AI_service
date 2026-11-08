"use client";

import { Menu } from "@/features/menus/types/menu";
import MenuSearch from "./MenuSearch";

interface Props {
  menus: Menu[];
  loading: boolean;
  onSearch: (keyword: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function MenuList({
  menus,
  loading,
  onSearch,
  onEdit,
  onDelete
}: Props) {
  return (
    <section>
      <h2>전체 메뉴 목록</h2>

      <MenuSearch onSearch={onSearch} />

      {loading && <p>불러오는 중입니다...</p>}

      {!loading && menus.length === 0 && (
        <p>검색 결과가 없거나 등록된 메뉴가 없습니다.</p>
      )}

      {!loading && menus.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>칼로리</th>
              <th>설명</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {menus.map(food => (
              <tr key={food.id}>
                <td>{food.id}</td>
                <td>{food.name}</td>
                <td>{food.calories} kcal</td>
                <td>{food.description}</td>

                <td className="action-btns">
                  <button
                    onClick={() => onEdit(food.id)}
                  >
                    수정
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(food.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}