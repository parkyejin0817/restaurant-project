"use client";

import { useState, useEffect } from "react";

interface Restaurant {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  review: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    rating: 5,
    review: "",
  });

  // 목록 조회
  const fetchRestaurants = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("http://43.201.26.159:8080/api/restaurants");
      
      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }
      
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error("맛집 목록 조회 실패:", err);
      setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드시 목록 불러오기
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 맛집 등록
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("http://43.201.26.159:8080/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      setForm({ name: "", category: "", location: "", rating: 5, review: "" });
      await fetchRestaurants();
    } catch (err) {
      console.error("맛집 등록 실패:", err);
      setError("맛집 등록에 실패했습니다. 서버가 실행 중인지 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          나의 맛집 리스트
        </h1>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-white border border-red-300 rounded-lg p-4 mb-6 shadow-sm">
            <p className="font-semibold mb-2 text-red-600">연결 오류</p>
            <p className="text-sm text-gray-700 mb-3">{error}</p>
            <button
              onClick={fetchRestaurants}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 등록 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">맛집 등록</h2>
          
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="가게 이름"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              required
            />
            
            <input
              type="text"
              name="category"
              placeholder="카테고리 (한식, 중식, 양식...)"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              required
            />
            
            <input
              type="text"
              name="location"
              placeholder="위치"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              required
            />
            
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5점)</option>
              <option value={4}>⭐⭐⭐⭐ (4점)</option>
              <option value={3}>⭐⭐⭐ (3점)</option>
              <option value={2}>⭐⭐ (2점)</option>
              <option value={1}>⭐ (1점)</option>
            </select>
            
            <input
              type="text"
              name="review"
              placeholder="한줄평"
              value={form.review}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "처리 중..." : "등록하기"}
            </button>
          </div>
        </form>

        {/* 맛집 목록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">맛집 목록</h2>
          
          {loading && restaurants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">로딩 중...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">아직 등록된 맛집이 없어요!</p>
            </div>
          ) : (
            restaurants.map((r) => (
              <div 
                key={r.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{r.name}</h3>
                  <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200 font-medium">
                    {r.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{r.location}</p>
                <p className="text-yellow-500 mb-2">{"⭐".repeat(r.rating)}</p>
                <p className="text-gray-700">{r.review}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
