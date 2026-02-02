// Shared Design Tokens
// These should match the values in app/globals.css

export const THEME = {
  colors: {
    primary: "#00897B", // Matches --color-primary
    primaryHover: "#00796B",
    secondary: "#D4AF37", // Matches --color-secondary (Gold)
    secondaryHover: "#B4941F",
    lightBg: "#F8F9FA",
    charcoal: "#333333",
    teal: {
        600: "#00897B" // Override tailwind teal-600 to match our primary if used
    }
  },
  fonts: {
    sans: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif'
  }
} as const;
