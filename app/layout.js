import "./globals.css";
import "./polish.css";

export const metadata = {
  title: "Prism - Understand your decision",
  description: "A decision workspace for exploring perspectives, uncertainty, and trade-offs."
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
