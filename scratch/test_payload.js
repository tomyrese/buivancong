const SYSTEM_PROMPT = `Bạn là Trợ lý Học tập AI chuyên biệt của lớp học Thầy Bùi Văn Công ôn luyện kỳ thi Đánh giá Năng lực (ĐGNL) ĐHQG TP.HCM.`;

async function test() {
  const url = 'http://localhost:20128/v1/chat/completions';
  const apiKey = 'sk-86dacad2686013f2-4jtr4q-8928e1a1';
  const model = 'code';

  const payload = {
    model: model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'assistant', content: 'Chào bạn! Tôi là Trợ lý AI chuyên trách luyện thi ĐGNL lớp Thầy Bùi Văn Công.' },
      { role: 'user', content: 'thầy bùi văn công là ai' }
    ],
    temperature: 0.5,
    max_tokens: 150
  };

  console.log("Sending payload:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log(`Response Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Response Body:\n${text}`);
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

test();
