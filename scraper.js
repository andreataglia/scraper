const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrape(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--account-consistency']
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1280,
    height: 926
  });
  await page.goto(url, {
    "waitUntil": "networkidle0"
  }).catch(e => {
    throw new Error(`"${e.message}"`);
  });;
  await page.waitFor(1000);
  var result;

  result = await page.evaluate(() => {
    //data,km,ritmo,durata,dislivello positivo
    const items = [];
    try {
      //date
      let elements = document.querySelectorAll('.timestamp');
      items.push(elements[0].innerText.replace(",", " "));
      //other data
      elements = document.querySelectorAll('.inline-stats li strong');
      items.push(elements[0].innerText);
      items.push(elements[2].innerText);
      items.push(elements[1].innerText);
      //dislivello not available
      items.push('0');

    } catch (error) {
      console.log(error);
      console.log("failed to scrape a url of type: " + siteType);
      return 'failed';
    } finally {

      browser.close();
    }

    return items;
  }, siteType);
}

scrape('https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_land_and_maritime_borders').then((ret) => {
  console.log(ret);
});

module.exports.scrape = scrape;