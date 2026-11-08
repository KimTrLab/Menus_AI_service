"use client";

import { Menu, MenuFormData } from "@/features/menus/types/menu";
import MenuForm from "./MenuForm";

interface Props {
  open: boolean;
  menu: Menu | null;
  onSave: (data: MenuFormData) => Promise<void>;
  onClose: () => void;
}

export default function MenuEditDialog({
  open,
  menu,
  onSave,
  onClose
}: Props) {
  if (!open || !menu) return null;

  return (
    <div
      className="modal-overlay active"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
      >
        <h2 id="edit-title">메뉴 수정</h2>

        <MenuForm
          initialData={menu}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}