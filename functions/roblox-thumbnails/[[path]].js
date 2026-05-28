// Pages Function — proxies /roblox-thumbnails/* to https://thumbnails.roblox.com/*

export async function onRequest({ request, params }) {
  const path = (params.path || []).join('/')
  const search = new URL(request.url).search
  const target = `https://thumbnails.roblox.com/${path}${search}`

  const upstream = await fetch(target, {
    method: request.method,
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; EclipseProxy/1.0)',
    },
  })

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') || 'application/json',
      // Thumbnails change rarely — cache aggressively at the edge.
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
