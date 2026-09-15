export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { prompt } = req.body;
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return res.status(200).json({ image: `data:image/png;base64,${base64}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  }
