# Week 8 End-To-End Testing Activity

In this activity, we will write some end-to-end tests for our Calculator App using jest and puppeteer.
By now, we are familiar with Jest, which is a JavaScript testing framework.
Puppeteer is an automation library which is helpful for UI testing.
From the official [docs](https://pptr.dev/): 
 - Puppeteer is a Node.js library which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. 
 - Puppeteer runs in headless mode by default, but can be configured to run in full ("headful") Chrome/Chromium.

## Pre-requisites

Since puppeteer is an API for Chrome/Chromium, we would need Chrome/Chromium installed on the system.
Please install Chrome if you don't have it installed already by following the instructions [here](https://support.google.com/chrome/answer/95346?hl=en&co=GENIE.Platform%3DDesktop).
Alternatively, you can also install Chromium.
On Windows, download the execute the installer.
On Linux and Mac, you can use your preferred package manager such as:
 - `sudo apt install chromium-browser`
 - `sudo snap install chromium`

*Note:* There may be many different ways to install these things. Google it and use your preferred way.

## The Task

The task for today is to write 10 meaningful end to end tests to validate the happy path test scenarios.
**IMPORTANT**: Before submitting to gradescope, turn the headless mode on by changing `headless: false,` to `headless: "new",` on line 11, and `slowMo: 100` to `slowMo: 0` on line 20 in `__tests__/calculator.e2e.ts`.

## Running the Tests

First, we need to install all the necessary dependencies.
 - Run `npm install`
To run the end-to-end tests, run the following command:
 - Run `npm run e2e`
This should open a chromium browser and perform `1 + 1 = 2` on it automatically.
The browser should then close automatically.

## About The Code

You will write your tests in `src/__tests__/calculator.e2e.ts`.
We already have a couple of tests present as a reference.

### Understanding The Setup

Jest provides us with 2 setup (beforeAll and beforeEach) and 2 teardown (afterAll and afterEach) functions.

- beforeAll: Runs once before *all* the tests (it/test blocks) in a given suite (describe block)

```typescript
beforeAll(async() => {
  browser = await puppeteer.launch({
    headless: false,
    // pipe: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      // '--single-process',
      '--disable-features=site-per-process'
    ],
    slowMo: 100
  })
});
```

We use the beforeAll block to use puppeteer and lauch an instance of the Chromium browser.
It returns a handle to the browser.

- BeforeEach: Runs before *every* test in a given suite.

```typescript
beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});
```

We use this to create a new tab for every test and navigate our Calculator App (localhost:3000).

- AfterEach: Runs after *test* in a given suite.

```typescript
afterEach(async () => {
  await page.close();
  page = null as any;
});
```

We use this to clean up things after a test.
Here, we close the browser tab we had created.
Used to ensure a fresh state for new tests (by clearning mocks etc) and avoiding memory leaks.

- AfterAll: Runs once after *all* tests in a given suite.

```typescript
afterAll(async () => {
  await browser.close();
  browser = null as any;
});
```

We use it to close the browser after all tests are executed.

### Understanding The Tests

As always, we divide our tests into 3 parts (Assemble, Act, Assert).
```typescript
it('should display 2 when "1 + 1 = " is clicked', async () => {

  // Assemble
  await (await page.$('.key-1') as ElementHandle<Element>).click();
  await (await page.$('.key-add') as ElementHandle<Element>).click();
  await (await page.$('.key-1') as ElementHandle<Element>).click();

  // Act
  await (await page.$('.key-equals') as ElementHandle<Element>).click();

  // Assert
  const displayValue: string = await (await (await page.$('.calculator-display') as ElementHandle<Element>).getProperty('textContent')).jsonValue() as string;
  expect(displayValue).toEqual('2');

});
```

The code might look a little complicated because of all the type casting and awaits, but it's really simple.
The puppeteer API provides the Page object which gives us access to the DOM.
We can select any element on the page using an ID or class or other attributes present on it.
For example, to select the "ONE" key, we can use the class on it `key-1` as follows:
`page.$('.key-1')`.
Since this returns a promise, we need to await it: `await page.$('.key-1')`.
Now since this returns an element of type `ElementHandle<Element>`, we can typecast it as follows:
`(await page.$('.key-1') as ElementHandle<Element>)`.
Finally, we can click on this button using the click method.
Since `click()` is also asynchronous, we need to await it:
`await (await page.$('.key-1') as ElementHandle<Element>).click();`

Similar to `click`, we can use the `.getProperty('textContent'))` method to obtain the contents of an HTML element such as display.

Finally, we can assert the contents using Jest's expect method.

### Selectors

You can use the below class names as selectors:

```typescript
<div className="function-keys">
  <CalculatorKey className="key-clear" label={ActionKeys.CLEAR} onPress={actionKeyPressHandler} />
  <CalculatorKey className="key-sign" label={ActionKeys.SIGN_FLIP} onPress={actionKeyPressHandler} />
  <CalculatorKey className="key-percent" label={OperatorKeys.SQRT} onPress={operatorKeyPressHandler} />
</div>
<div className="digit-keys">
  <CalculatorKey className="key-0" label={NumericKeys.ZERO} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-dot" label={ActionKeys.DOT} onPress={actionKeyPressHandler} />
  <CalculatorKey className="key-1" label={NumericKeys.ONE} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-2" label={NumericKeys.TWO} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-3" label={NumericKeys.THREE} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-4" label={NumericKeys.FOUR} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-5" label={NumericKeys.FIVE} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-6" label={NumericKeys.SIX} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-7" label={NumericKeys.SEVEN} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-8" label={NumericKeys.EIGHT} onPress={numericKeyPressHandler} />
  <CalculatorKey className="key-9" label={NumericKeys.NINE} onPress={numericKeyPressHandler} />
</div>
<div className="operator-keys">
  <CalculatorKey className="key-divide" label={OperatorKeys.DIV} onPress={operatorKeyPressHandler} />
  <CalculatorKey className="key-multiply" label={OperatorKeys.MULT} onPress={operatorKeyPressHandler} />
  <CalculatorKey className="key-subtract" label={OperatorKeys.MINUS} onPress={operatorKeyPressHandler} />
  <CalculatorKey className="key-add" label={OperatorKeys.PLUS} onPress={operatorKeyPressHandler} />
  <CalculatorKey className="key-equals" label={ActionKeys.EQUALS} onPress={actionKeyPressHandler} />
</div>
```

## Submission

**IMPORTANT**: Before submitting to gradescope, turn the headless mode on by changing `headless: false,` to `headless: "new",` on line 11 in `__tests__/calculator.e2e.ts`.

In the root directory, run the command `npm run zip`. 
This command will generate a zip file called `submission.zip`.
Upload the `submission.zip` file to Gradescope and tag your partner on Gradescope on the submission.

## Grading

The submission must contain a total of 10 e2e tests to receive full credit.
The starter contains 2 tests, so you need to write 8 more.
