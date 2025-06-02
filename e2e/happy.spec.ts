import { expect, test } from "@playwright/test";

test.describe("The Web App", () => {
	test("successfully selected a gif", async ({ page }) => {
		await page.goto("/");
		await page.locator("button").first().click();
		await page.locator('input[type="text"]').fill("pizza");
		await page.locator("form").press("Enter");
		await expect(page.locator("video")).toBeVisible();
	});

	test.skip("successfully show the gif on hover an img", async ({ page }) => {
		await page.goto("/");
		await page.locator('[class*="StyledDay"]').first().click();
		await page.locator('input[type="text"]').fill("pizza");
		await page.locator("form").press("Enter");
		await page.locator('[class*="StyledOk"]').click();
		await expect(
			page.locator('[class*="StyledMonth"] video'),
		).not.toBeVisible();
		await expect(page.locator('[class*="StyledMonth"] img')).toBeVisible();
		await page.locator('[class*="StyledDay"]').first().hover();
		await expect(page.locator('[class*="StyledMonth"] video')).toBeVisible();
		await expect(page.locator('[class*="StyledMonth"] img')).not.toBeVisible();
	});
});
