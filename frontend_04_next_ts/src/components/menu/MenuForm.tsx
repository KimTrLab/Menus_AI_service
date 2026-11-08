"use client";

import { useEffect, useState } from "react";

import {
  Menu,
  MenuFormData
} from "@/features/menus/types/menu";

interface Props {
  initialData?: Menu | null;
  onSubmit: (data: MenuFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function MenuForm({
  initialData,
  onSubmit,
  onCancel
}: Props) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialData?.name ?? "");
    setCalories(
      initialData ? String(initialData.calories) : ""
    );
    setDescription(initialData?.description ?? "");
  }, [initialData]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim() || !calories || !description.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const calorieValue = Number(calories);

    if (!Number.isFinite(calorieValue) || calorieValue < 0) {
      alert("올바른 칼로리를 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        calories: calorieValue,
        description: description.trim()
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "처리에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>이름</label>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>칼로리 (kcal)</label>

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
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting
          ? "처리 중..."
          : initialData
            ? "수정하기"
            : "등록하기"}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn"
        >
          취소
        </button>
      )}
    </form>
  );
}