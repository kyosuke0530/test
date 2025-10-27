// components/Chat.js
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "こんにちは！ご用件は何ですか？" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
  
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessages,
        }),
      });
  
      // エラー対応
      if (res.status === 429) {
        const errorText = await res.text();
        console.error("429エラー内容:", errorText);
        alert("リクエストが多すぎます。詳細はコンソールを確認してください。");
        return;
      }
  
      const data = await res.json();
      const reply = data?.choices?.[0]?.message;
  
      if (!reply) {
        console.error("choices[0].message が取得できませんでした");
        alert("AIからの返答が取得できませんでした。");
        return;
      }
  
      setMessages((prev) => [...newMessages, reply]);
    } catch (err) {
      console.error("通信に失敗しました", err);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ height: 400, overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <strong>{msg.role === "user" ? "あなた" : "AI"}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="メッセージを入力"
        style={{ width: "100%", padding: "10px" }}
      />
    </div>
  );
}
