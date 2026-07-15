import Image, { ImageProps } from "next/image";

/**
 * DocImage - A wrapper for next/image that fallback to plain <img> 
 * when rendering in a restricted server environment (like PDF generation).
 * 
 * Next.js 'next/image' is a client component and can throw 
 * "Cannot access Image.prototype on the server" when used with 
 * renderToStaticMarkup in API routes.
 */
export function DocImage(props: ImageProps) {
  const isPdfMode = typeof window === "undefined" && (global as any).IS_PDF_MODE;

  if (isPdfMode) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={props.src as string}
        alt={props.alt}
        className={props.className}
        style={{
          objectFit: props.fill ? "cover" : undefined,
          width: props.fill ? "100%" : props.width,
          height: props.fill ? "100%" : props.height,
          borderRadius: props.className?.includes("rounded-full") ? "9999px" : undefined,
          ...props.style,
        }}
      />
    );
  }

  return <Image {...props} />;
}
