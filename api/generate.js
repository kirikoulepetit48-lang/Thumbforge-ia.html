export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  try {
    const { prompt, image } = req.body;
    if (!prompt) return res.status(400).json({error: 'Prompt manquant'});

    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) return res.status(500).json({error: 'HF_TOKEN manquant sur Vercel'});

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (response.status === 503) {
      return res.status(503).json({error: 'HF charge le modèle, réessaie 30s'});
    }

    if (!response.ok) {
      const txt = await response.text();
      return res.status(500).json({error: `HF error: ${txt}`});
    }

    const blob = await response.arrayBuffer();
    const base64 = Buffer.from(blob).toString('base64');
    
    return res.status(200).json({ 
      image: `data:image/png;base64,${base64}` 
    });

  } catch (e) {
    return res.status(500).json({error: e.message});
  }
}
