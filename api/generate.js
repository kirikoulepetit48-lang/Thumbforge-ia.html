export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt vide' });

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&enhance=true`;
    
    const imgRes = await fetch(url);
    if (!imgRes.ok) throw new Error(`Image API error ${imgRes.status}`);
    
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
      }
