const fs = require('fs');
const puppeteer = require('puppeteer');

function extractItems() {
  const extractedElements = document.querySelectorAll('h4');
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  items = await page.evaluate(extractItems);
  return items;
}

(async () => {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the demo page.
  await page.goto('https://www.runtastic.com/en/users/6c8b62cd-297b-9f69-484f-d9e583ef5051/sport-sessions/56a69ef8-a4a6-4a15-a950-536619949c25?sharing_token=5acbc7afddc30fef8dd3b574&utm_campaign=user_generated_sharing&utm_content=session.runtastic.running&utm_medium=gplus.android&utm_source=runtastic.lite');
  page.on('load', () => console.log("Loaded: " + page.url()));

  // Scroll and extract items from the page.
  const items = await scrapeInfiniteScrollItems(page, extractItems, 100);
  console.log(items);

  // Save extracted items to a file.
  // fs.writeFileSync('./items.txt', items.join('\n') + '\n');

  // Close the browser.
  await browser.close();
})();
