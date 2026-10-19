import { expect, test } from "@playwright/test";

const giphyResponse = {
	data: {
		images: {
			downsized_small: { mp4: "https://media.giphy.com/test.mp4" },
			"480w_still": { url: "https://media.giphy.com/test.jpg" },
		},
	},
};

test.describe("The Web App", () => {
	test("successfully selected a gif", async ({ page }) => {
		await page.route(/\/\.netlify\/functions\/gif/, (route) =>
			route.fulfill({ json: giphyResponse }),
		);
		await page.goto("/");
		await page.locator("table button").first().click();
		await page.locator('input[type="text"]').fill("pizza");
		await page.locator("form").press("Enter");
		await expect(page.locator("video")).toBeVisible();
	});

	test("plays saved GIFs that are on screen", async ({ page }) => {
		await page.route(/\/\.netlify\/functions\/gif/, (route) =>
			route.fulfill({ json: giphyResponse }),
		);
		await page.goto("/");
		const firstDay = page.locator("table button").first();
		await firstDay.click();
		await page.getByLabel("Search GIFs").fill("pizza");
		await page.getByLabel("Search GIFs").press("Enter");
		await page.getByRole("button", { name: "Save GIF" }).click();
		await firstDay.blur();
		await page.mouse.move(0, 0);
		await expect(firstDay.locator("video")).toBeAttached();
	});

	test("shows the still with reduced motion and plays it on hover", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.route(/\/\.netlify\/functions\/gif/, (route) =>
			route.fulfill({ json: giphyResponse }),
		);
		await page.goto("/");
		const firstDay = page.locator("table button").first();
		await firstDay.click();
		await page.getByLabel("Search GIFs").fill("pizza");
		await page.getByLabel("Search GIFs").press("Enter");
		await page.getByRole("button", { name: "Save GIF" }).click();
		await firstDay.blur();
		await page.mouse.move(0, 0);
		await expect(firstDay.locator("img")).toBeAttached();
		await expect(firstDay.locator("video")).toHaveCount(0);
		await firstDay.hover();
		await expect(firstDay.locator("video")).toBeAttached();
	});
});
