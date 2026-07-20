export default function manifest() {
  return {
    name: "Prism - Decision Workspace",
    short_name: "Prism",
    description: "Explore the assumptions, trade-offs, and uncertainties behind important decisions.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafd",
    theme_color: "#4f46e5",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }]
  };
}
