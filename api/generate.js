const response = await fetch("https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.HF_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ inputs: prompt })
});
