import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sebelasdecor.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/simulasi"],
        disallow: ["/dashboard/", "/api/", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
