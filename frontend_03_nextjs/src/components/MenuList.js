"use client";

import { useState } from "react";

export default function MenuList({
  menus,
  onSearch,
  onEdit,
  onDelete
}) {

  const [keyword, setKeyword] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    onSearch(keyword);
  }

  return (
    <div>

      <h2>전체 메뉴 목록</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="메뉴 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button type="submit">검색</button>
      </form>

      {menus.length === 0 ? (

        <p>검색 결과가 없습니다.</p>

      ) : (

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

                <td>
                  <button onClick={() => onEdit(food.id)}>
                    수정
                  </button>

                  <button onClick={() => onDelete(food.id)}>
                    삭제
                  </button>
                </td>
              </tr>

            ))}

          </tbody>
        </table>

      )}

    </div>
  );
}