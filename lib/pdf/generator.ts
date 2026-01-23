import puppeteer from "puppeteer";

export async function generatePdfFromHtml(html: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Safe for most container envs
  });
  const page = await browser.newPage();

  // Set content and wait for network idle (to load Tailwind CDN/images)
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
}
