"use client";

import { useEffect, useState } from "react";

export default function MenuEdit({
  menu,
  onSave,
  onClose
}) {

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setCalories(menu.calories);
      setDescription(menu.description);
    }
  }, [menu]);

  if (!menu) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    const modifyData = {
      id: menu.id,
      name,
      calories: Number(calories),
      description
    };

    await onSave(modifyData);
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>메뉴 수정</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>이름</label>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>칼로리</label>

            <input
              type="number"
              min="0"
              value={calories}
              onChange={e => setCalories(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>설명</label>

            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit">수정 저장</button>

          <button type="button" onClick={onClose}>
            취소
          </button>

        </form>

      </div>

    </div>
  );
}