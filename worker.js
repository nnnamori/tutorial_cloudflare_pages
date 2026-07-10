export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. URLの末尾が /submit かつ POST送信のとき：D1に保存する
    if (url.pathname === "/submit" && request.method === "POST") {
      try {
        const data = await request.json();
        
        // Workersでは「env.MY_DB」でD1にアクセスします
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

    // 2. それ以外のアクセス：エラー（Workers単体では静的ファイルを配れないため、この設定が必要です）
    return new Response("Not Found", { status: 404 });
  }
};
