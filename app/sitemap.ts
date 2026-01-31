import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://senedx.com";
  const routes = ["", "/resumes/templates", "/prices"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        en: `${baseUrl}/en${route}`,
        am: `${baseUrl}/am${route}`,
      },
    },
  }));
}
