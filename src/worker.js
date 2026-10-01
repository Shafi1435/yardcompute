export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

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

    return env.ASSETS.fetch(new Request(url, request));
  },
};
