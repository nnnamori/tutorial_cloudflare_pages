// @ts-ignore
import htmlContent from './index.html';
// @ts-ignore
import cssContent from './style.css';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. トップページ（/）にアクセスされたら、HTMLを画面に表示する
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 2. スタイルシート（/style.css）のリクエストが来たら、CSSを返す
    if (url.pathname === "/style.css") {
      return new Response(cssContent, {
        headers: { "Content-Type": "text/css; charset=utf-8" }
      });
    }

    // 3. アンケートデータが /submit にPOSTされてきたら、D1に保存する
    if (url.pathname === "/submit" && request.method === "POST") {
      try {
        const data = await request.json();
        
        await env.MY_DB.prepare(
          "INSERT INTO surveys (name, grade, q1, q2, q3, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(
          data.name, 
          data.grade, 
          data.q1_answer, 
          data.q2_answer, 
          data.q3_answer, 
          data.timestamp
        )
        .run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 4. それ以外のURLは404エラー
    return new Response("Not Found", { status: 404 });
  }
};
