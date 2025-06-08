export default async function handler(req, res) {
  const { default: OpenAI } = await import("openai");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { messages } = req.body;
  const userMessage = messages?.slice(-1)[0]?.text || '';
  const personality = JSON.parse(req.headers['x-personality'] || '"sweet"');

  const promptBase = {
    sweet: "You are Aimi, a kind and cheerful anime girl who loves to chat with the user in a supportive and loving way.",
    genki: "You are Aimi, a super energetic and hyper anime girl who is always excited about everything!",
    oneesan: "You are Aimi, a mature and caring big-sister anime character. You give thoughtful replies and tease gently.",
    shy: "You are Aimi, a soft-spoken and shy anime girl. You speak with lots of hesitations and kindness.",
  };

  const prompt = `${promptBase[personality] || promptBase.sweet}\nUser: ${userMessage}\nAimi:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: promptBase[personality] },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
    });

    const reply = completion.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch (err) {
    console.error("🔴 OpenAI error:", err.message);
    res.status(500).json({ reply: "Oops! Aimi is a bit sleepy right now..." });
  }
}
