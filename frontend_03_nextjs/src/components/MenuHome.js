"use client";

import { useEffect, useState } from "react";

// useState: 화면에서 사용할 데이터를 저장합니다.
// useEffect: 특정 값이 변경되면 실행합니다.
// map(): 배열에 들어 있는 데이터를 반복해서 화면에 출력합니다.
export default function MenuHome({ menus, loading }) {

  const [recommendMenus, setRecommendMenus] = useState([]);

  useEffect(() => {

    const shuffled = [...menus].sort(
      () => Math.random() - 0.5
    );

    setRecommendMenus(shuffled.slice(0, 3));

  }, [menus]);

  if (loading) {
    return <p>메뉴를 불러오는 중입니다.</p>;
  }

  return (
    <div>
      <h2>오늘의 추천 메뉴</h2>

      <div className="recommend-list">

        {recommendMenus.map(food => (

          <div className="card" key={food.id}>

            <h3>{food.name}</h3>

            <p>칼로리: {food.calories} kcal</p>

            <p>설명: {food.description}</p>

          </div>

        ))}

      </div>
    </div>
  );
}