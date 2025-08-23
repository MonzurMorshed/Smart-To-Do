const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // store in .env
  dangerouslyAllowBrowser: true, // ⚠️ only for demo/dev — better to proxy via backend
});

export async function suggestTaskTitle(prompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant for task management." },
      { role: "user", content: `Suggest a clear, actionable task title and priority for: ${prompt}` },
    ],
  });

  return completion.choices[0].message.content;
}