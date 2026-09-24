// Cloudflare Worker: intermediario entre la PWA y la API de Anthropic.
// Variables necesarias (Settings > Variables and Secrets):
//   ANTHROPIC_API_KEY (secret)  ALLOWED_ORIGIN (texto)  APP_TOKEN (secret)
const MODEL = 'claude-haiku-4-5-20251001';

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin : (allowed[0] || 'null'),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-App-Token',
      'Vary': 'Origin'
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: 'metodo' }, 405, cors);
    if (!okOrigin) return json({ error: 'origen no permitido' }, 403, cors);
    if (!env.APP_TOKEN || req.headers.get('X-App-Token') !== env.APP_TOKEN)
      return json({ error: 'codigo de acceso incorrecto' }, 401, cors);

    let prompt;
    try { ({ prompt } = await req.json()); } catch { return json({ error: 'json invalido' }, 400, cors); }
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 3000)
      return json({ error: 'prompt invalido' }, 400, cors);

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, messages: [{ role: 'user', content: prompt }] })
    });
    if (!r.ok) return json({ error: 'error en la API', status: r.status }, 502, cors);
    const data = await r.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return json({ text }, 200, cors);
  }
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}
