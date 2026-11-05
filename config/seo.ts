import type { HtmlTagDescriptor, Plugin } from 'vite';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGES,
  type Language,
} from '../src/globals/constants.ts';
import { SITE_URL, SITE_URL_PLACEHOLDER } from './site.ts';

interface LanguageAlternate {
  hreflang: string;
  href: string;
}

export const pageUrl = (siteUrl: string, language: Language) =>
  `${siteUrl}${LANGUAGE_OPTIONS[language].path}`;

/** Uma URL por idioma, mais o x-default para quem não usa nenhum dos dois. */
export function languageAlternates(siteUrl: string): LanguageAlternate[] {
  return [
    ...LANGUAGES.map((language) => ({
      hreflang: LANGUAGE_OPTIONS[language].tag,
      href: pageUrl(siteUrl, language),
    })),
    { hreflang: 'x-default', href: pageUrl(siteUrl, DEFAULT_LANGUAGE) },
  ];
}

export function robotsTxt(siteUrl: string): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');
}

// Em XML, & e < quebram o arquivo. As URLs de hoje não têm esses caracteres; um parâmetro novo teria.
const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function sitemapXml(siteUrl: string): string {
  const alternates = languageAlternates(siteUrl)
    .map(
      ({ hreflang, href }) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`,
    )
    .join('\n');
  const urls = LANGUAGES.map(
    (language) =>
      `  <url>\n    <loc>${escapeXml(pageUrl(siteUrl, language))}</loc>\n${alternates}\n  </url>`,
  ).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

/** Troca o marcador do endereço no index.html. */
export const fillSiteUrl = (html: string, siteUrl: string) =>
  html.replaceAll(SITE_URL_PLACEHOLDER, siteUrl);

/** Endereço nas meta tags, links de idioma no <head>, e robots.txt e sitemap.xml no build. */
export function seo(siteUrl: string = SITE_URL): Plugin {
  return {
    name: 'seo',
    transformIndexHtml: (html) => ({
      html: fillSiteUrl(html, siteUrl),
      tags: languageAlternates(siteUrl).map(({ hreflang, href }): HtmlTagDescriptor => ({
        tag: 'link',
        attrs: { rel: 'alternate', hreflang, href },
        injectTo: 'head',
      })),
    }),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(siteUrl) });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl) });
    },
  };
}
