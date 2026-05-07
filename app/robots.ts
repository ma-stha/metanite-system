export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/onboarding"],
    },
    sitemap: "https://metaleveling.online/sitemap.xml",
  };
}
