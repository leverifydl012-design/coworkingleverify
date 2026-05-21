import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923000000000?text=Hi%20Nexus%2C%20I'd%20like%20to%20book%20a%20tour"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-[oklch(0.72_0.17_150)] animate-ping opacity-30" />
      <span className="relative inline-flex items-center justify-center size-14 rounded-full bg-[oklch(0.72_0.17_150)] text-white shadow-elegant hover:scale-110 transition-transform">
        <MessageCircle className="size-6" />
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition pointer-events-none">
        Chat on WhatsApp
      </span>
    </a>
  );
}
