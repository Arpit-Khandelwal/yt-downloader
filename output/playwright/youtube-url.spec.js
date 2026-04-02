const { test, expect } = require("@playwright/test");

const APP_URL = process.env.APP_URL || "http://127.0.0.1:3000";
const VIDEO_URL = "https://www.youtube.com/watch?v=Zs7nGKD4vbI";

test("fetches metadata for the provided YouTube URL", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

  const acceptPolicyButton = page.getByRole("button", { name: "I understand" });
  if (await acceptPolicyButton.isVisible().catch(() => false)) {
    await acceptPolicyButton.click();
  }

  await page.getByPlaceholder("Enter YouTube video URL").fill(VIDEO_URL);
  await page.getByRole("button", { name: "Fetch" }).click();

  const thumbnail = page.locator('img[alt="Video thumbnail"]');
  const errorHint = page.locator("text=/Failed|Unable|forbidden|quota|unavailable|Sign in/i").first();

  let outcome = "timeout";
  let errorText = "";
  const timeoutAt = Date.now() + 45000;
  while (Date.now() < timeoutAt) {
    if (await thumbnail.isVisible().catch(() => false)) {
      outcome = "success";
      break;
    }

    if (await errorHint.isVisible().catch(() => false)) {
      outcome = "error";
      errorText = ((await errorHint.textContent()) || "").trim();
      break;
    }

    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: "output/playwright/youtube-url-test.png", fullPage: true });

  if (outcome !== "success") {
    throw new Error(`Expected video metadata to load. outcome=${outcome}${errorText ? ` error=\"${errorText}\"` : ""}`);
  }

  await expect(thumbnail).toBeVisible();
});
