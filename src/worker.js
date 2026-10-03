const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://yardcompute.com/</loc></url>
  <url><loc>https://yardcompute.com/about/</loc></url>
  <url><loc>https://yardcompute.com/contact/</loc></url>
  <url><loc>https://yardcompute.com/privacy-policy/</loc></url>
  <url><loc>https://yardcompute.com/terms/</loc></url>
  <url><loc>https://yardcompute.com/disclaimer/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/</loc></url>
  <url><loc>https://yardcompute.com/paver-calculators/</loc></url>
  <url><loc>https://yardcompute.com/landscaping-calculators/</loc></url>
  <url><loc>https://yardcompute.com/guides/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-rail-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-picket-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-post-spacing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-post-concrete-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-material-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-board-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-joist-spacing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-joist-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-board-spacing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/concrete-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/concrete-bag-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/concrete-footing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/post-hole-concrete-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/gravel-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/gravel-bag-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/pea-gravel-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/driveway-gravel-calculator/</loc></url>
  <url><loc>https://yardcompute.com/paver-calculators/paver-calculator/</loc></url>
  <url><loc>https://yardcompute.com/paver-calculators/paver-edge-restraint-calculator/</loc></url>
  <url><loc>https://yardcompute.com/paver-calculators/paver-base-sand-calculator/</loc></url>
  <url><loc>https://yardcompute.com/landscaping-calculators/mulch-calculator/</loc></url>
  <url><loc>https://yardcompute.com/landscaping-calculators/sod-calculator/</loc></url>
  <url><loc>https://yardcompute.com/landscaping-calculators/topsoil-calculator/</loc></url>
  <url><loc>https://yardcompute.com/landscaping-calculators/mulch-bag-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-gate-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-picket-spacing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-panel-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-screw-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-footing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/concrete-patio-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/concrete-column-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/gravel-tonnage-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/river-rock-calculator/</loc></url>
  <url><loc>https://yardcompute.com/paver-calculators/paver-sand-calculator/</loc></url>
  <url><loc>https://yardcompute.com/landscaping-calculators/grass-seed-calculator/</loc></url>
  <url><loc>https://yardcompute.com/guides/fence-material-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/fence-post-spacing/</loc></url>
  <url><loc>https://yardcompute.com/guides/concrete-slab-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/driveway-gravel-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/gravel-depth-coverage/</loc></url>
  <url><loc>https://yardcompute.com/guides/deck-board-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/deck-board-linear-feet/</loc></url>
  <url><loc>https://yardcompute.com/guides/mulch-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/mulch-bags-vs-cubic-yards/</loc></url>
  <url><loc>https://yardcompute.com/guides/fence-post-concrete-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/post-hole-concrete-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/paver-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/paver-base-sand-calculation/</loc></url>
  <url><loc>https://yardcompute.com/guides/concrete-order-quantity/</loc></url>
</urlset>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Serve the sitemap directly so crawlers receive a stable XML response.
    if (pathname === "/sitemap.xml") {
      return new Response(SITEMAP, {
        headers: {
          "content-type": "application/xml; charset=UTF-8",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    // Keep clean trailing-slash URLs canonical.
    if (pathname !== "/" && !pathname.endsWith("/") && !pathname.includes(".")) {
      url.pathname = pathname + "/";
      return Response.redirect(url.toString(), 301);
    }

    // Map clean folder URLs to their index.html files.
    if (pathname === "/") {
      url.pathname = "/index.html";
    } else if (pathname.endsWith("/")) {
      url.pathname = pathname + "index.html";
    }

    const response = await env.ASSETS.fetch(new Request(url, request));
    const headers = new Headers(response.headers);
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'; base-uri 'self';");

    // Page HTML files already contain their own canonical tags.
    // Do not inject another one here, which would create duplicate canonicals.
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });;
  },
};
