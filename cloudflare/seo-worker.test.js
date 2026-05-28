/**
 * Tests for Eclipse SEO Cloudflare Worker
 *
 * Run with: npx vitest run cloudflare/seo-worker.test.js
 *
 * Tests cover:
 * - Bot detection (serve pre-rendered HTML)
 * - Regular user passthrough
 * - Static asset passthrough
 * - Dynamic sitemap generation
 * - Script page HTML generation
 * - Hub page HTML generation
 * - Cache behavior
 * - Error fallbacks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock Setup ───

// We test the worker's logic by importing its handler and simulating requests.
// Since the worker uses `fetch()` and `caches.default`, we mock those.

const mockCacheStore = new Map();
const mockCache = {
  match: vi.fn((key) => {
    const cached = mockCacheStore.get(key.url || key.toString());
    return Promise.resolve(cached || undefined);
  }),
  put: vi.fn((key, response) => {
    mockCacheStore.set(key.url || key.toString(), response);
    return Promise.resolve();
  }),
};

// Mock globalThis.caches
vi.stubGlobal('caches', { default: mockCache });

// Mock fetch for passthrough + API calls
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Import the worker module
const worker = await import('./seo-worker.js');

// ─── Helpers ───

function makeRequest(url, userAgent = 'Mozilla/5.0 Chrome/120') {
  return new Request(url, {
    headers: { 'user-agent': userAgent },
  });
}

const mockEnv = {
  API_URL: 'https://api.eclipserblx.com',
  BASE_URL: 'https://eclipserblx.com',
};

const mockScript = {
  id: 'auto-farm-blox',
  title: 'Auto-Farm',
  targetGame: 'Blox Fruits',
  description: 'Automated farming with customizable routes',
  hubName: 'Eclipse Core',
  imageUrl: '/assets/scripts/auto-farm.png',
};

const mockHub = {
  id: 'eclipse-core',
  name: 'Eclipse Core',
  description: 'Flagship executor with auto-inject',
  status: 'online',
  imageUrl: '/assets/hubs/eclipse-core.png',
};

const mockHubs = [
  { id: 'eclipse-core', slug: 'eclipse-core', updatedAt: '2026-05-20T00:00:00Z' },
  { id: 'nova-hub', slug: 'nova-hub', updatedAt: '2026-05-15T00:00:00Z' },
];

const mockScripts = [
  { id: 'auto-farm-blox', slug: 'auto-farm-blox', updatedAt: '2026-05-18T00:00:00Z' },
  { id: 'esp-universal', slug: 'esp-universal', updatedAt: '2026-05-19T00:00:00Z' },
];

const mockShowcases = [
  { id: 'showcase-1', slug: 'showcase-1' },
];

// ─── Tests ───

beforeEach(() => {
  vi.clearAllMocks();
  mockCacheStore.clear();
  mockFetch.mockReset();
});

describe('Static Asset Passthrough', () => {
  it('should pass through .js files without bot detection', async () => {
    const passthroughResponse = new Response('console.log("hi")', { status: 200 });
    mockFetch.mockResolvedValueOnce(passthroughResponse);

    const req = makeRequest('https://eclipserblx.com/assets/index.js', 'Googlebot');
    const res = await worker.default.fetch(req, mockEnv);

    expect(mockFetch).toHaveBeenCalledWith(req);
    expect(res.status).toBe(200);
  });

  it('should pass through .png files', async () => {
    const passthroughResponse = new Response('PNG data', { status: 200 });
    mockFetch.mockResolvedValueOnce(passthroughResponse);

    const req = makeRequest('https://eclipserblx.com/eclipse-logo.png');
    await worker.default.fetch(req, mockEnv);

    expect(mockFetch).toHaveBeenCalledWith(req);
  });

  it('should pass through .woff2 font files', async () => {
    mockFetch.mockResolvedValueOnce(new Response('font data'));

    const req = makeRequest('https://eclipserblx.com/assets/inter.woff2');
    await worker.default.fetch(req, mockEnv);

    expect(mockFetch).toHaveBeenCalledWith(req);
  });
});

describe('Regular User Passthrough', () => {
  it('should pass through script pages for regular users', async () => {
    mockFetch.mockResolvedValueOnce(new Response('<html>SPA</html>'));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Mozilla/5.0 Chrome/120');
    await worker.default.fetch(req, mockEnv);

    expect(mockFetch).toHaveBeenCalledWith(req);
  });

  it('should pass through hub pages for regular users', async () => {
    mockFetch.mockResolvedValueOnce(new Response('<html>SPA</html>'));

    const req = makeRequest('https://eclipserblx.com/hubs/eclipse-core', 'Mozilla/5.0 Firefox/120');
    await worker.default.fetch(req, mockEnv);

    expect(mockFetch).toHaveBeenCalledWith(req);
  });

  it('should pass through non-target pages even for bots', async () => {
    mockFetch.mockResolvedValueOnce(new Response('<html>SPA</html>'));

    const req = makeRequest('https://eclipserblx.com/showcases', 'Googlebot');
    await worker.default.fetch(req, mockEnv);

    expect(mockFetch).toHaveBeenCalledWith(req);
  });
});

describe('Bot Detection — Script Pages', () => {
  it('should generate HTML for Googlebot on script pages', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScript), {
      headers: { 'Content-Type': 'application/json' },
    }));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Googlebot/2.1');
    const res = await worker.default.fetch(req, mockEnv);

    expect(res.headers.get('Content-Type')).toContain('text/html');
    expect(res.headers.get('X-Rendered-By')).toBe('Cloudflare-Worker');

    const html = await res.clone().text();
    expect(html).toContain('<title>Auto-Farm — Blox Fruits | Eclipse</title>');
    expect(html).toContain('og:title');
    expect(html).toContain('Automated farming');
    expect(html).toContain('SoftwareApplication');
    expect(html).toContain('Eclipse Core');
  });

  it('should generate HTML for Bingbot', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScript)));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'bingbot/2.0');
    const res = await worker.default.fetch(req, mockEnv);

    const html = await res.clone().text();
    expect(html).toContain('Auto-Farm');
  });

  it('should generate HTML for Discord bot', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScript)));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Discordbot/2.0');
    const res = await worker.default.fetch(req, mockEnv);

    const html = await res.clone().text();
    expect(html).toContain('og:image');
  });

  it('should generate HTML for Twitter bot', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScript)));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Twitterbot/1.0');
    const res = await worker.default.fetch(req, mockEnv);

    const html = await res.clone().text();
    expect(html).toContain('twitter:card');
  });
});

describe('Bot Detection — Hub Pages', () => {
  it('should generate HTML for bots on hub pages', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockHub)));

    const req = makeRequest('https://eclipserblx.com/hubs/eclipse-core', 'Googlebot/2.1');
    const res = await worker.default.fetch(req, mockEnv);

    const html = await res.clone().text();
    expect(html).toContain('<title>Eclipse Core | Eclipse</title>');
    expect(html).toContain('og:title');
    expect(html).toContain('Flagship executor');
    expect(html).toContain('Status: online');
  });
});

describe('HTML Content Quality', () => {
  it('should escape HTML entities in titles', async () => {
    const scriptWithSpecialChars = {
      ...mockScript,
      title: 'Auto<script>alert("xss")</script>Farm',
    };
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(scriptWithSpecialChars)));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Googlebot');
    const res = await worker.default.fetch(req, mockEnv);

    const html = await res.clone().text();
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
  });

  it('should include canonical URL', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScript)));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Googlebot');
    const res = await worker.default.fetch(req, mockEnv);

    const html = await res.clone().text();
    expect(html).toContain('<link rel="canonical" href="https://eclipserblx.com/scripts/auto-farm-blox">');
  });

  it('should include JSON-LD structured data', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScript)));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Googlebot');
    const res = await worker.default.fetch(req, mockEnv);

    const html = await res.clone().text();
    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@context": "https://schema.org"');
    expect(html).toContain('"@type": "SoftwareApplication"');
  });
});

describe('Dynamic Sitemap', () => {
  it('should generate sitemap XML from API data', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockHubs)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockScripts)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockShowcases)));

    const req = makeRequest('https://eclipserblx.com/sitemap.xml');
    const res = await worker.default.fetch(req, mockEnv);

    expect(res.headers.get('Content-Type')).toContain('application/xml');

    const xml = await res.clone().text();
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('https://eclipserblx.com/hubs/eclipse-core');
    expect(xml).toContain('https://eclipserblx.com/hubs/nova-hub');
    expect(xml).toContain('https://eclipserblx.com/scripts/auto-farm-blox');
    expect(xml).toContain('https://eclipserblx.com/scripts/esp-universal');
  });

  it('should include static pages in sitemap', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(new Response(JSON.stringify([])));

    const req = makeRequest('https://eclipserblx.com/sitemap.xml');
    const res = await worker.default.fetch(req, mockEnv);

    const xml = await res.clone().text();
    expect(xml).toContain('https://eclipserblx.com</loc>');
    expect(xml).toContain('https://eclipserblx.com/hubs</loc>');
    expect(xml).toContain('https://eclipserblx.com/scripts</loc>');
    expect(xml).toContain('https://eclipserblx.com/showcases</loc>');
  });

  it('should include lastmod from updatedAt', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockHubs)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockScripts)))
      .mockResolvedValueOnce(new Response(JSON.stringify([])));

    const req = makeRequest('https://eclipserblx.com/sitemap.xml');
    const res = await worker.default.fetch(req, mockEnv);

    const xml = await res.clone().text();
    expect(xml).toContain('<lastmod>');
    expect(xml).toContain('2026-05-20');
  });

  it('should cache sitemap for 2 hours', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(new Response(JSON.stringify([])));

    const req = makeRequest('https://eclipserblx.com/sitemap.xml');
    const res = await worker.default.fetch(req, mockEnv);

    expect(res.headers.get('Cache-Control')).toContain('max-age=7200');
    expect(mockCache.put).toHaveBeenCalled();
  });

  it('should return empty sitemap on API error', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('API down'))
      .mockRejectedValueOnce(new Error('API down'))
      .mockRejectedValueOnce(new Error('API down'));

    const req = makeRequest('https://eclipserblx.com/sitemap.xml');
    const res = await worker.default.fetch(req, mockEnv);

    expect(res.status).toBe(500);
    const xml = await res.text();
    expect(xml).toContain('<urlset');
  });

  it('should handle paginated API responses (items array)', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: mockHubs })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: mockScripts })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: mockShowcases })));

    const req = makeRequest('https://eclipserblx.com/sitemap.xml');
    const res = await worker.default.fetch(req, mockEnv);

    const xml = await res.clone().text();
    expect(xml).toContain('eclipse-core');
    expect(xml).toContain('auto-farm-blox');
  });
});

describe('Caching Behavior', () => {
  it('should serve cached response on second bot request', async () => {
    // First request — generate + cache
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScript)));

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Googlebot');
    const res1 = await worker.default.fetch(req, mockEnv);

    expect(mockCache.put).toHaveBeenCalled();

    // Simulate cache hit
    const cachedHtml = await res1.clone().text();
    mockCache.match.mockResolvedValueOnce(
      new Response(cachedHtml, { headers: { 'Content-Type': 'text/html' } })
    );

    // Second request — should come from cache
    const req2 = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Googlebot');
    const res2 = await worker.default.fetch(req2, mockEnv);

    const html2 = await res2.text();
    expect(html2).toContain('Auto-Farm');
  });
});

describe('Error Handling', () => {
  it('should fall back to SPA on API error for script pages', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('API timeout')) // API fetch fails
      .mockResolvedValueOnce(new Response('<html>SPA Fallback</html>')); // Fallback fetch

    const req = makeRequest('https://eclipserblx.com/scripts/auto-farm-blox', 'Googlebot');
    const res = await worker.default.fetch(req, mockEnv);

    expect(res.status).toBe(200);
  });
});
