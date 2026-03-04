import puppeteerCore from "puppeteer-core";

async function getBrowser() {
  // Local dev: point PUPPETEER_EXECUTABLE_PATH to your local Chrome/Chromium
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return puppeteerCore.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  // Production (Vercel serverless): use @sparticuz/chromium
  const chromium = (await import("@sparticuz/chromium")).default;
  return puppeteerCore.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

export async function generatePdfFromHtml(html: string) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error(
      "[PDF Generator] Failed to launch browser or generate PDF:",
      error,
    );
    throw error;
  }
}
