const { test, expect } = require("@playwright/test");

test.describe("Colombia OpenInfra User Group — smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#root > *", { timeout: 10_000 });
  });

  test("page title is set", async ({ page }) => {
    await expect(page).toHaveTitle(/Colombia OpenInfra/i);
  });

  test("nav renders with logo text", async ({ page }) => {
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("nav")).toContainText("Colombia OpenInfra");
  });

  test("hero section renders with CTA", async ({ page }) => {
    await expect(page.locator("#main-content")).toBeVisible();
    const ctaLinks = page.locator("a[href*='meetup.com']");
    await expect(ctaLinks.first()).toBeVisible();
  });

  test("about section is present", async ({ page }) => {
    await page.locator("#about").scrollIntoViewIfNeeded();
    await expect(page.locator("#about")).toBeVisible();
  });

  test("events section has past events", async ({ page }) => {
    await page.locator("#events").scrollIntoViewIfNeeded();
    await expect(page.locator("#events")).toBeVisible();
    await expect(page.locator("#events")).toContainText(/5t[oh]/i);
  });

  test("speakers section shows 6 speakers", async ({ page }) => {
    await page.locator("#speakers").scrollIntoViewIfNeeded();
    const cards = page.locator("#speakers .container > div > div");
    await expect(cards).toHaveCount(6);
  });

  test("all 4 social links resolve in join section", async ({ page }) => {
    await page.locator("#join").scrollIntoViewIfNeeded();
    const socials = ["meetup.com", "youtube.com", "linkedin.com", "instagram.com"];
    for (const s of socials) {
      const link = page.locator(`#join a[href*="${s}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test("footer has privacy and terms links", async ({ page }) => {
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.locator("footer a[href='privacy.html']")).toBeVisible();
    await expect(page.locator("footer a[href='terms.html']")).toBeVisible();
  });

  test("ES/EN language toggle works", async ({ page }) => {
    const toggleBtn = page.locator("button", { hasText: /^EN$/ });
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(page.locator("nav a", { hasText: /Events/i }).first()).toBeVisible();
    await page.locator("button", { hasText: /^ES$/ }).click();
    await expect(page.locator("nav a", { hasText: /Eventos/i }).first()).toBeVisible();
  });

  test("dark/light theme toggle works", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toHaveAttribute("data-theme", "dark");
    await page.locator("button[aria-label*='light']").click();
    await expect(body).toHaveAttribute("data-theme", "light");
  });

  test("no horizontal overflow", async ({ page }) => {
    const overflow = await page.evaluate(() =>
      document.body.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test("PDF slide links are present", async ({ page }) => {
    await page.locator("#speakers").scrollIntoViewIfNeeded();
    const pdfLinks = page.locator("#speakers a[href*='presentations/']");
    await expect(pdfLinks).toHaveCount(6);
  });
});
