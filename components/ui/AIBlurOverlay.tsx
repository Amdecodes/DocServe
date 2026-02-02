/**
 * AI Content Blur Overlay Component
 * Shows placeholder for AI-generated content before payment
 */

interface AIBlurOverlayProps {
  children: React.ReactNode;
  isGenerated?: boolean;
  type: "summary" | "coverLetter" | "bullets";
}

export function AIBlurOverlay({
  children,
  isGenerated = false,
  type,
}: AIBlurOverlayProps) {
  if (isGenerated) {
    return <>{children}</>;
  }

  const messages = {
    summary: "Professional summary will be AI-generated after payment",
    coverLetter: "Cover letter will be AI-generated after payment",
    bullets: "Achievement bullets will be AI-optimized after payment",
  };

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="filter blur-sm select-none pointer-events-none opacity-40">
        {children}
      </div>

      {/* Overlay Message */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center p-6 max-w-sm">
          <p className="font-semibold text-gray-900 mb-2">
            AI-Generated Content
          </p>
          <p className="text-sm text-gray-600">{messages[type]}</p>
        </div>
      </div>
    </div>
  );
}
