import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, type Locale } from "../../config/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  if (!locales.includes(typedLocale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${typedLocale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={typedLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
