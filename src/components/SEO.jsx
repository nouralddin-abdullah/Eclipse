import { Helmet } from 'react-helmet-async'

/**
 * Reusable SEO component — drops in unique meta tags per page.
 * When backend is ready, pass dynamic data (script title, hub name, etc.)
 *
 * Props:
 *   title       – Page title (appended with " | Eclipse")
 *   description – Meta description (max ~155 chars)
 *   path        – URL path for canonical (e.g. "/scripts/auto-farm")
 *   image       – Open Graph image URL (absolute)
 *   type        – og:type (default: "website")
 *   jsonLd      – Structured data object (JSON-LD)
 *   noIndex     – If true, adds noindex tag
 */
const SEO = ({
  title,
  description,
  path = '',
  image,
  type = 'website',
  jsonLd,
  noIndex = false,
}) => {
  const siteName = 'Eclipse'
  const domain = 'https://eclipserblx.com'
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Premium Roblox Script Hub`
  const fullUrl = `${domain}${path}`
  const defaultDescription =
    'Eclipse is the premium destination for high-quality Roblox scripts and hubs. Browse, discover, and execute scripts across all your favorite games.'
  const desc = description || defaultDescription
  const ogImage = image || `${domain}/og-image.png`

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}

export default SEO
