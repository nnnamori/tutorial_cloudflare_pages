export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    await context.env.MY_DB.prepare(
      "INSERT INTO surveys (name, grade, q1, q2, q3, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(
      data.name, 
      data.grade, 
      data.q1_answers.join(","), 
      data.q2_answers.join(","), 
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
