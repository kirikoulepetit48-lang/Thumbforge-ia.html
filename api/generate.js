export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { prompt, style } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt vide' });

    const finalPrompt = `${style || ''}, ${prompt}, ultra detailed, 8k, cinematic lighting, viral youtube thumbnail, high contrast, sharp focus`;

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1280&height=720&nologo=true&enhance=true&model=flux`;
    
    const imgRes = await fetch(url);
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
