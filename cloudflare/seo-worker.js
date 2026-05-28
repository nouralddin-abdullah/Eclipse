// Cloudflare Worker for SEO Bot Detection & Pre-rendering + Dynamic Sitemap
// Generates HTML with meta tags for bots, fetches data from Eclipse API
// Caches rendered HTML for 1 day (86400 seconds)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ─── Dynamic Sitemap Route ───
    if (url.pathname === '/sitemap.xml') {
      return handleSitemap(url, env);
    }

    // Handle static assets — pass through directly
    const isStaticAsset = /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot|json|xml|txt|mp4|webm)$/i.test(url.pathname);
    if (isStaticAsset) {
      return fetch(request);
    }

    // Only handle detail pages (hubs and scripts)
    const hubMatch = url.pathname.match(/^\/hubs\/([^/]+)$/);
    const scriptMatch = url.pathname.match(/^\/scripts\/([^/]+)$/);

    if (!hubMatch && !scriptMatch) {
      // Not a target page — proxy to Pages (SPA)
      return fetch(request);
    }

    // Check if request is from a search engine bot
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|discordbot|telegrambot|whatsapp|applebot|redditbot/i.test(userAgent);

    if (!isBot) {
      // Regular user — proxy to Pages (React app)
      return fetch(request);
    }

    // Bot detected — serve pre-rendered HTML
    console.log(`Bot detected: ${userAgent} for ${url.pathname}`);

    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    // Check cache first (1 day)
    let response = await cache.match(cacheKey);
    if (response) {
      console.log('Serving from cache');
      return response;
    }

    // Not in cache — generate HTML
    console.log('Generating fresh HTML');

    try {
      if (scriptMatch) {
        response = await generateScriptHTML(scriptMatch[1], url, env);
      } else if (hubMatch) {
        response = await generateHubHTML(hubMatch[1], url, env);
      }

      // Cache for 1 day
      const responseToCache = new Response(response.body, response);
      responseToCache.headers.set('Cache-Control', 'public, max-age=86400');
      responseToCache.headers.set('X-Robots-Tag', 'index, follow');

      await cache.put(cacheKey, responseToCache.clone());
      return responseToCache;
    } catch (error) {
      console.error('Error generating HTML:', error);
      // On error, fall back to SPA
      return fetch(request);
    }
  }
};

// ─── Script HTML Generation (for SEO bots) ───

async function generateScriptHTML(scriptId, url, env) {
  const apiUrl = env.API_URL || 'https://api.eclipserblx.com';
  const BASE_URL = env.BASE_URL || 'https://eclipserblx.com';

  // Fetch script data from API
  const script = await fetch(`${apiUrl}/api/scripts/${scriptId}`).then(r => r.json());

  const title = escapeHtml(script.title || 'Script');
  const game = escapeHtml(script.targetGame || '');
  const description = escapeHtml(script.description || `${title} script for ${game} on Roblox`);
  const hubName = escapeHtml(script.hubName || '');
  const imageUrl = script.imageUrl || `${BASE_URL}/eclipse-logo.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ${game} | Eclipse</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${BASE_URL}/scripts/${scriptId}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title} — ${game} | Eclipse">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${BASE_URL}/scripts/${scriptId}">
  <meta property="og:site_name" content="Eclipse">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} — ${game} | Eclipse">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${title}",
    "description": "${description}",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Roblox",
    "url": "${BASE_URL}/scripts/${scriptId}",
    "image": "${imageUrl}",
    "author": {
      "@type": "Organization",
      "name": "${hubName}"
    }
  }
  </script>
</head>
<body>
  <h1>${title}</h1>
  <p>Game: ${game}</p>
  <p>${description}</p>
  <p>Hub: ${hubName}</p>
  <noscript>
    <p>Please enable JavaScript to view the full content.</p>
  </noscript>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Rendered-By': 'Cloudflare-Worker',
    },
  });
}

// ─── Hub HTML Generation (for SEO bots) ───

async function generateHubHTML(hubId, url, env) {
  const apiUrl = env.API_URL || 'https://api.eclipserblx.com';
  const BASE_URL = env.BASE_URL || 'https://eclipserblx.com';

  const hub = await fetch(`${apiUrl}/api/hubs/${hubId}`).then(r => r.json());

  const name = escapeHtml(hub.name || 'Hub');
  const description = escapeHtml(hub.description || `${name} — Premium Roblox script hub on Eclipse`);
  const imageUrl = hub.imageUrl ? `${BASE_URL}${hub.imageUrl}` : `${BASE_URL}/eclipse-logo.png`;
  const status = escapeHtml(hub.status || 'online');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Eclipse</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${BASE_URL}/hubs/${hubId}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${name} | Eclipse">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${BASE_URL}/hubs/${hubId}">
  <meta property="og:site_name" content="Eclipse">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${name} | Eclipse">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${name}",
    "description": "${description}",
    "applicationCategory": "GameApplication",
    "url": "${BASE_URL}/hubs/${hubId}",
    "image": "${imageUrl}"
  }
  </script>
</head>
<body>
  <h1>${name}</h1>
  <p>Status: ${status}</p>
  <p>${description}</p>
  <noscript>
    <p>Please enable JavaScript to view the full content.</p>
  </noscript>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Rendered-By': 'Cloudflare-Worker',
    },
  });
}

// ─── Dynamic Sitemap Generation ───

async function handleSitemap(url, env) {
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const cache = caches.default;

  // Check cache first
  let cached = await cache.match(cacheKey);
  if (cached) {
    console.log('Serving sitemap from cache');
    return cached;
  }

  const apiUrl = env.API_URL || 'https://api.eclipserblx.com';
  const BASE_URL = env.BASE_URL || 'https://eclipserblx.com';

  try {
    // Fetch all resources from the API
    const [hubsRes, scriptsRes, showcasesRes] = await Promise.all([
      fetch(`${apiUrl}/api/hubs`).then(r => r.json()),
      fetch(`${apiUrl}/api/scripts`).then(r => r.json()),
      fetch(`${apiUrl}/api/showcases`).then(r => r.json()),
    ]);

    const hubs = Array.isArray(hubsRes) ? hubsRes : hubsRes.items || [];
    const scripts = Array.isArray(scriptsRes) ? scriptsRes : scriptsRes.items || [];
    const showcases = Array.isArray(showcasesRes) ? showcasesRes : showcasesRes.items || [];

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/hubs', priority: '0.9', changefreq: 'daily' },
      { url: '/scripts', priority: '0.9', changefreq: 'daily' },
      { url: '/showcases', priority: '0.7', changefreq: 'weekly' },
    ];

    const staticUrls = staticPages.map(page => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

    // Hub pages
    const hubUrls = hubs.map(hub => `
  <url>
    <loc>${BASE_URL}/hubs/${hub.id || hub.slug}</loc>
    ${hub.updatedAt ? `<lastmod>${new Date(hub.updatedAt).toISOString()}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    // Script pages
    const scriptUrls = scripts.map(script => `
  <url>
    <loc>${BASE_URL}/scripts/${script.id || script.slug}</loc>
    ${script.updatedAt ? `<lastmod>${new Date(script.updatedAt).toISOString()}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${hubUrls}
  ${scriptUrls}
</urlset>`;

    const res = new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=7200', // 2hr cache
        'X-Rendered-By': 'Cloudflare-Worker',
      },
    });

    await cache.put(cacheKey, res.clone());
    return res;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback: return empty sitemap
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        status: 500,
        headers: { 'Content-Type': 'application/xml' },
      }
    );
  }
}

// ─── Utilities ───

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
