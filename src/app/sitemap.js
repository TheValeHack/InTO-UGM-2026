export default function sitemap() {
    const baseUrl = "https://intougm2026.com";

    // Public routes
    const routes = [
        "",
        "/#about",
        "/#event",
        "/#paket",
        "/#testi",
        "/#map",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.8,
    }));

    return [...routes];
}
