"use client";

import { useState } from "react";

interface Props {
  onSearch: (keyword: string) => void;
}

export default function MenuSearch({
  onSearch
}: Props) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form
      className="search-box"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="메뉴 이름 또는 설명 검색..."
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />

      <button type="submit">
        검색
      </button>
    </form>
  );
}