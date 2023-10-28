import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

describe("Calculator App", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      // pipe: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        // '--single-process',
        "--disable-features=site-per-process",
      ],
      slowMo: 100,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  afterEach(async () => {
    await page.close();
    page = null as any;
  });

  afterAll(async () => {
    await browser.close();
    browser = null as any;
  });

  it('should have the title "Calculator App"', async () => {
    await expect(page.title()).resolves.toEqual("Calculator App");
  });

  it('should display 2 when "1 + 1 = " is clicked', async () => {
    await ((await page.$(".key-1")) as ElementHandle<Element>).click();
    await ((await page.$(".key-add")) as ElementHandle<Element>).click();
    await ((await page.$(".key-1")) as ElementHandle<Element>).click();

    await ((await page.$(".key-equals")) as ElementHandle<Element>).click();

    const displayValue: string = (await (
      await (
        (await page.$(".calculator-display")) as ElementHandle<Element>
      ).getProperty("textContent")
    ).jsonValue()) as string;
    expect(displayValue).toEqual("2");
  });

  it.todo('should display 0 when "1 - 1 = " is clicked');

  it.todo('should display 4 when "2 * 2 = " is clicked');

  it.todo('should display 2 when "4 / 2 = " is clicked');

  it.todo('should display div 0 error when "1 / 0 = " is clicked');

  it.todo('should display 15 when "1 + 2 * 7 = " is clicked');

  it.todo('should display 0 when "1 + 2 - 3 = " is clicked');

  it.todo('should display 2 when "1 + 2 / 2 - 3 * 0 = " is clicked');

  it.todo('should display 0 when "1 + 2" is clicked and then "C" is clicked');
});
