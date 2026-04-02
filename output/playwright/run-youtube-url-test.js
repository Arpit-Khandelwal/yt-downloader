const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const APP_URL = process.env.APP_URL || "http://127.0.0.1:3000";
const VIDEO_URL = "https://www.youtube.com/watch?v=Zs7nGKD4vbI";
const SCREENSHOT_PATH = "output/playwright/youtube-url-test.png";

function fallbackExecutablePath() {
  const home = process.env.HOME || "";
  return path.join(
    home,
    "Library",
    "Caches",
    "ms-playwright",
    "chromium_headless_shell-1208",
    "chrome-headless-shell-mac-arm64",
    "chrome-headless-shell"
  );
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const fallback = fallbackExecutablePath();
    if (message.includes("Executable doesn't exist") && fs.existsSync(fallback)) {
      return chromium.launch({ headless: true, executablePath: fallback });
    }
    throw error;
  }
}

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});

  const urlInput =
    (await page
      .getByPlaceholder("https://www.youtube.com/watch?v=...")
      .elementHandle()
      .then(() => page.getByPlaceholder("https://www.youtube.com/watch?v=..."))
      .catch(() => null)) ||
    (await page
      .getByLabel("YouTube video URL")
      .elementHandle()
      .then(() => page.getByLabel("YouTube video URL"))
      .catch(() => null)) ||
    page.locator('input[type="text"]').first();

  const hasUrlInput = await urlInput.isVisible().catch(() => false);
  if (!hasUrlInput) {
    await page.screenshot({ path: "output/playwright/youtube-url-initial-state.png", fullPage: true });
    const bodyText = (await page.locator("body").innerText().catch(() => "")).slice(0, 1000);
    await browser.close();
    throw new Error(
      `URL input not visible on initial page. Captured output/playwright/youtube-url-initial-state.png. Body excerpt: ${bodyText}`
    );
  }

  const policyButton = page.getByRole("button", { name: "I understand" });
  if (await policyButton.isVisible().catch(() => false)) {
    await policyButton.click();
  }

  await urlInput.fill(VIDEO_URL);
  const fetchButton =
    (await page
      .getByRole("button", { name: "Fetch formats" })
      .elementHandle()
      .then(() => page.getByRole("button", { name: "Fetch formats" }))
      .catch(() => null)) ||
    page.getByRole("button", { name: "Fetch" });

  await fetchButton.click();

  const thumbnail = page.locator('img[alt="Video thumbnail"]');
  const bestAudioButton = page.getByRole("button", { name: "Best audio" });
  const errorMessage = page
    .locator(
      "text=/Failed to fetch video details\\.|Unable to fetch video details\\.|Accept the usage policy before fetching metadata\\.|Please enter a YouTube URL\\.|invalid_request|invalid_url|extractor_failure/i"
    )
    .first();

  let outcome = "timeout";
  let errorText = "";
  const timeoutAt = Date.now() + 45000;
  while (Date.now() < timeoutAt) {
    if (
      (await thumbnail.isVisible().catch(() => false)) ||
      (await bestAudioButton.isVisible().catch(() => false))
    ) {
      outcome = "success";
      break;
    }
    if (await errorMessage.isVisible().catch(() => false)) {
      outcome = "error";
      errorText = ((await errorMessage.textContent()) || "").trim();
      break;
    }
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });

  const title = ((await page.locator("main, body").innerText().catch(() => "")) || "")
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.includes("Adaptive YouTube Downloader"));

  await browser.close();

  if (outcome !== "success") {
    throw new Error(
      `Metadata did not load for ${VIDEO_URL}. outcome=${outcome}${errorText ? ` error="${errorText}"` : ""}`
    );
  }

  console.log(`PASS outcome=${outcome}`);
  if (title) {
    console.log(`Observed text: ${title}`);
  }
  console.log(`Screenshot: ${SCREENSHOT_PATH}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
