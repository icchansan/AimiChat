// Placeholder chat API
export default function handler(req, res) {
  const reply = { reply: req.body.encrypted ? req.body.messages.slice(-1)[0].text : "Hi!" };
  res.status(200).json(reply);
}