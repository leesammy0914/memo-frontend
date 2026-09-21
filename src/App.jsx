import { useState, useEffect } from "react";

// 백엔드 API 주소.
// 로컬 개발: .env의 VITE_API_URL = http://localhost:8000
// 배포:      Vercel 환경변수 VITE_API_URL = https://<render주소>
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [memos, setMemos] = useState([]);   // 메모 목록 상태
  const [text, setText] = useState("");     // 입력창 상태
  const [error, setError] = useState("");   // 통신 실패 메시지
  const [loading, setLoading] = useState(true);

  // ── 1) 목록 조회: GET /memos ──────────────────────────
  // 화면이 처음 뜰 때 백엔드에서 메모 목록을 받아온다.
  const fetchMemos = async () => {
    try {
      const res = await fetch(`${API_URL}/memos`);
      if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
      setMemos(await res.json());
      setError("");
    } catch (e) {
      setError(`백엔드에 연결할 수 없습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  // ── 2) 추가: POST /memos ─────────────────────────────
  const addMemo = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${API_URL}/memos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
      const created = await res.json();   // 서버가 id를 붙여서 돌려준다
      setMemos([...memos, created]);
      setText("");
      setError("");
    } catch (e) {
      setError(`추가 실패: ${e.message}`);
    }
  };

  // ── 3) 삭제: DELETE /memos/{id} ──────────────────────
  const deleteMemo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/memos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
      setMemos(memos.filter((m) => m.id !== id));
      setError("");
    } catch (e) {
      setError(`삭제 실패: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>📝 메모장</h1>

      {/* 개인 소개 페이지로 가는 링크 (과제 요건: 두 페이지가 서로 접근 가능) */}
      <p style={{ marginTop: -8 }}>
        <a href="/about.html">← 만든 사람 소개</a>
      </p>

      <p style={{ fontSize: 12, color: "#666" }}>
        연결된 백엔드: <code>{API_URL}</code>
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addMemo()}
          placeholder="메모를 입력하세요"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addMemo}>추가</button>
      </div>

      {error && (
        <p style={{ color: "crimson", fontSize: 14 }}>⚠️ {error}</p>
      )}

      {loading ? (
        <p style={{ color: "#666" }}>불러오는 중…</p>
      ) : (
        <ul>
          {memos.map((m) => (
            <li key={m.id}>
              {m.content}
              <button onClick={() => deleteMemo(m.id)} style={{ marginLeft: 8 }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && memos.length === 0 && (
        <p style={{ color: "#666" }}>아직 메모가 없습니다.</p>
      )}
    </div>
  );
}
