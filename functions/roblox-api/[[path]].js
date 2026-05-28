// Pages Function — proxies /roblox-api/* to https://apis.roblox.com/*
// Mirrors the Vite dev-server proxy in vite.config.js so the frontend
// can use the same relative URLs in dev and prod.

export async function onRequest({ request, params }) {
  const path = (params.path || []).join('/')
  const search = new URL(request.url).search
  const target = `https://apis.roblox.com/${path}${search}`

  const init = {
    method: request.method,
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; EclipseProxy/1.0)',
    },
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer()
    const contentType = request.headers.get('content-type')
    if (contentType) init.headers['Content-Type'] = contentType
  }

  const upstream = await fetch(target, init)

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') || 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
