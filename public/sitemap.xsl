<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap | Dreweb Agency</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #18181b;
            background-color: #fafafa;
            margin: 0;
            padding: 32px 16px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e4e4e7;
            border-radius: 16px;
            padding: 24px 32px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          }
          h1 {
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 8px 0;
            color: #09090b;
          }
          p.desc {
            color: #71717a;
            font-size: 14px;
            margin: 0 0 24px 0;
          }
          .badge {
            display: inline-block;
            background: #C6FF00;
            color: #000000;
            padding: 4px 10px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            text-align: left;
            padding: 12px 14px;
            background: #f4f4f5;
            color: #52525b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 11px;
            border-bottom: 1px solid #e4e4e7;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #f4f4f5;
            word-break: break-all;
          }
          tr:hover td {
            background-color: #fafafa;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority {
            font-family: monospace;
            font-weight: 700;
            color: #18181b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">Dynamic Index</span>
          <h1>Dreweb XML Sitemap</h1>
          <p class="desc">
            This XML sitemap is dynamically generated from the PostgreSQL database for search engines and answer engines (Googlebot, Bingbot, Perplexity, GPTBot).
            Total Indexed URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
          </p>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL</th>
                <th style="width: 15%;">Priority</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 15%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td class="priority">
                    <xsl:value-of select="sitemap:priority"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td style="color: #71717a;">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
