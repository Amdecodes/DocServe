import puppeteerCore from "puppeteer-core";
import path from "path";

async function getBrowser() {
  // Local dev: point PUPPETEER_EXECUTABLE_PATH to your local Chrome/Chromium
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return puppeteerCore.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  // Production (Vercel serverless): use @sparticuz/chromium.
  // Must pass the bin directory explicitly — pnpm installs via symlinks so
  // @sparticuz/chromium's internal __dirname resolves to the .pnpm/ realpath
  // which Vercel doesn't deploy. The actual binary is deployed at the hoisted
  // node_modules path, constructed here from process.cwd().
  const chromium = (await import("@sparticuz/chromium")).default;
  const chromiumBinPath = path.join(
    process.cwd(),
    "node_modules",
    "@sparticuz",
    "chromium",
    "bin",
  );
  return puppeteerCore.launch({
    args: [...chromium.args, "--disable-dev-shm-usage"],
    executablePath: await chromium.executablePath(chromiumBinPath),
    headless: true,
  });
}

export async function generatePdfFromHtml(html: string) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
      timeout: 30000,
    });

    // Give the Tailwind CDN script time to execute and inject styles
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
