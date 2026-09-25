const MODEL = '@cf/meta/llama-3.2-1b-instruct';

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
    if (!env.APP_TOKEN || !(await secureEqual(req.headers.get('X-App-Token') || '', env.APP_TOKEN)))
      return json({ error: 'codigo de acceso incorrecto' }, 401, cors);

    let prompt;
    try { ({ prompt } = await req.json()); } catch { return json({ error: 'json invalido' }, 400, cors); }
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 3000)
      return json({ error: 'prompt invalido' }, 400, cors);
    if (!env.AI) return json({ error: 'Workers AI no disponible' }, 503, cors);

    try {
      const result = await env.AI.run(MODEL, {
        messages: [
          {
            role: 'system',
            content: 'Sos un asistente de redacción para un informe de calidad en planta. Respondé en español, conservá los hechos, no inventes datos y entregá solo el texto final.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.2
      });
      const text = typeof result?.response === 'string'
        ? result.response.trim()
        : typeof result?.choices?.[0]?.message?.content === 'string'
          ? result.choices[0].message.content.trim()
          : '';
      if (!text) throw new Error('respuesta vacia');
      return json({ text }, 200, cors);
    } catch (error) {
      console.error(JSON.stringify({
        message: 'Workers AI request failed',
        error: error instanceof Error ? error.message : String(error)
      }));
      return json({ error: 'error en Workers AI' }, 502, cors);
    }
  }
};

async function secureEqual(value, expected) {
  const encoder = new TextEncoder();
  const [valueHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(value)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected))
  ]);
  return crypto.subtle.timingSafeEqual(valueHash, expectedHash);
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}
