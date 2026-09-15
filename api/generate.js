export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt vide' });

    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) return res.status(500).json({ error: 'HF_TOKEN manquant dans Vercel' });

    const hfRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!hfRes.ok) {
      const txt = await hfRes.text();
      return res.status(500).json({ error: `HF Error ${hfRes.status}: ${txt}` });
    }

    const arrayBuf = await hfRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString('base64');
    return res.status(200).json({ image: `data:image/png;base64,${base64}` });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
        }
