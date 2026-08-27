/** DNS prefetch + preconnect for the R2/CDN image host (faster first image load). */

export default function CdnResourceHints() {
  const cdn = process.env.NEXT_PUBLIC_GALLERY_CDN_BASE?.replace(/\/$/, "");
  if (!cdn) return null;

  return (
    <>
      <link rel="dns-prefetch" href={cdn} />
      <link rel="preconnect" href={cdn} crossOrigin="anonymous" />
    </>
  );
}
