"use client";

import { useEffect, useState } from "react";
import { Menu } from "@/features/menus/types/menu";

interface Props {
  menus: Menu[];
  loading: boolean;
}
export default function MenuHome({
  menus,
  loading
}: Props) {
  const [recommended, setRecommended] = useState<Menu[]>([]);

//   useEffect(() => {
//     onLoad();
//   }, [onLoad]);

  useEffect(() => {
    const shuffled = [...menus].sort(
      () => Math.random() - 0.5
    );

    setRecommended(shuffled.slice(0, 3));
  }, [menus]);

  if (loading) {
    return <p>메뉴를 불러오는 중입니다...</p>;
  }

  return (
    <section>
      <h2>오늘의 추천 메뉴 (랜덤 3선)</h2>

      <div className="recommend-list">
        {recommended.map(food => (
          <article className="card" key={food.id}>
            <h3>{food.name}</h3>

            <p>
              <strong>칼로리:</strong>
              {" "}{food.calories} kcal
            </p>

            <p>
              <strong>설명:</strong>
              {" "}{food.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}