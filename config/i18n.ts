export const locales = ["en", "am"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
