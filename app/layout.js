import "./globals.css";
import "./polish.css";
import "./performance.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prism-decision.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prism - Understand your decision",
    template: "%s | Prism"
  },
  description: "A decision workspace for exploring perspectives, uncertainty, and trade-offs before you commit.",
  applicationName: "Prism",
  keywords: ["decision making", "reasoning workspace", "trade-offs", "scenario planning", "OpenAI hackathon"],
  authors: [{ name: "Prism contributors" }],
  creator: "Prism contributors",
  category: "Productivity",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Prism",
    title: "Prism - Understand your decision before you make it",
    description: "Explore the assumptions, trade-offs, and uncertainties behind an important decision.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prism decision workspace" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Prism - Understand your decision before you make it",
    description: "Explore the assumptions, trade-offs, and uncertainties behind an important decision.",
    images: ["/opengraph-image"]
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" }
};

export const viewport = {
  themeColor: "#4f46e5",
  colorScheme: "light"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
