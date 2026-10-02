const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://yardcompute.com/</loc></url>
  <url><loc>https://yardcompute.com/about/</loc></url>
  <url><loc>https://yardcompute.com/contact/</loc></url>
  <url><loc>https://yardcompute.com/privacy-policy/</loc></url>
  <url><loc>https://yardcompute.com/terms/</loc></url>
  <url><loc>https://yardcompute.com/disclaimer/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-post-spacing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/fence-calculators/fence-post-concrete-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-board-calculator/</loc></url>
  <url><loc>https://yardcompute.com/deck-calculators/deck-board-spacing-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/concrete-calculator/</loc></url>
  <url><loc>https://yardcompute.com/concrete-calculators/post-hole-concrete-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/gravel-calculator/</loc></url>
  <url><loc>https://yardcompute.com/gravel-calculators/driveway-gravel-calculator/</loc></url>
  <url><loc>https://yardcompute.com/landscaping-calculators/mulch-calculator/</loc></url>
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
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'; base-uri 'self';");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
