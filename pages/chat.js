import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { messages, encrypted } = req.body;

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
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 80,
      temperature: 0.8,
    });

    const reply = completion.data.choices[0].text.trim();
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Oops! Aimi is a bit sleepy right now..." });
  }
}