export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;
    const r = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: { "Authorization": `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: prompt })
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: t });
    }
    const buf = await r.arrayBuffer();
    const b64 = Buffer.from(buf).toString('base64');
    return res.status(200).json({ image: `data:image/png;base64,${b64}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
