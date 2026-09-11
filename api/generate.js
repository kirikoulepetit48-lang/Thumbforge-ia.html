export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt vide' });

    const HF_TOKEN = process.env.HF_TOKEN;
    const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
    
    const r = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (r.status === 503) {
      return res.status(503).json({ error: 'HF charge le modèle, attends 30s' });
    }

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: `HF error: ${t}` });
    }

    const buf = await r.arrayBuffer();
    const b64 = Buffer.from(buf).toString('base64');
    return res.status(200).json({ image: `data:image/png;base64,${b64}` });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
        }
