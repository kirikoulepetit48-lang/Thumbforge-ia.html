export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  try {
    const HF_TOKEN = process.env.HF_TOKEN || "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";
    const { prompt } = req.body;
    
    if (!prompt) return res.status(400).json({error: 'Missing prompt'});

    const hfRes = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { 
          num_inference_steps: 8,
          guidance_scale: 3.5,
          width: 1024,
          height: 1820 
        }
      })
    });

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return res.status(hfRes.status).json({error: text});
    }

    const buffer = await hfRes.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(Buffer.from(buffer));

  } catch (e) {
    return res.status(500).json({error: e.message});
  }
        }
