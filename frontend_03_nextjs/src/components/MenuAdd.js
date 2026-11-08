"use client";

import { useState } from "react";

export default function MenuAdd({ onAdd }) {

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const menuObject = {
      id: 0,
      name: name,
      calories: Number(calories),
      description: description
    };

    await onAdd(menuObject);

    setName("");
    setCalories("");
    setDescription("");
  }

  return (
    <div>

      <h2>새 메뉴 등록</h2>

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

        <button type="submit">등록하기</button>

      </form>

    </div>
  );
}