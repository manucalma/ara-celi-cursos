import { NextResponse } from "next/server"
import { getContentData, flattenContenido } from "@/lib/content-utils"

export async function GET() {
  const data = await getContentData()
  const sitemap = []

  // Añadir la página principal
  sitemap.push({
    url: "https://ara-celi.org",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  })

  // Añadir las páginas de cursos
  for (const curso of data.cursos) {
    if (curso.publico) {
      sitemap.push({
        url: `https://ara-celi.org/cursos/${curso.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      })

      // Añadir las páginas de videos
      const allItems = flattenContenido(curso.contenido)
      for (const item of allItems) {
        if (item.activo && item.visible && item.videoUrl) {
          sitemap.push({
            url: `https://ara-celi.org/cursos/${curso.id}/${item.urlParam}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          })
        }
      }
    }
  }

  // Convertir el sitemap a XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemap.map(item => `
    <url>
      <loc>${item.url}</loc>
      <lastmod>${new Date(item.lastModified).toISOString()}</lastmod>
      <changefreq>${item.changeFrequency}</changefreq>
      <priority>${item.priority}</priority>
    </url>
  `).join('')}
</urlset>`
  
  // Devolver la respuesta como XML
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
