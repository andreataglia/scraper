const fs = require('fs');
const puppeteer = require('puppeteer');
const sites = ['runtastic', 'garmin', 'strava', 'facebook'];

async function recognizeSite(url) {
  for (var site of sites) {
    if (url.indexOf(site) > -1) {
      return site;
    }
  }
  console.log("!!! url of unknown site: " + url);
  return null;
}

async function scrape(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--account-consistency']
  });
  try {
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
    // await page.waitFor(1000);
    const siteType = await recognizeSite(url);
    if (siteType == 'facebook') {
      //TODO login issues
      // items.push('fb here');
      // let elements = document.querySelectorAll('#js_20');
      // for (var el of elements) {
      //   console.log(el.innerText);
      // }
    } else {
      const result = await page.evaluate(siteType => {
        //data,km,ritmo,durata,dislivello positivo
        const items = [];
        try {
          if (siteType == 'runtastic') {
            //date
            let elements = document.querySelectorAll('h2');
            items.push(elements[1].innerText.replace(",", "."));
            //other data
            elements = document.querySelectorAll('h4');
            items.push(elements[0].innerText.replace(",", "."));
            items.push(elements[2].innerText);
            items.push(elements[1].innerText);
            items.push(elements[4].innerText);
          } else if (siteType == 'garmin') {
            //date
            let elements = document.querySelectorAll('.page-feature div');
            items.push(elements[0].innerText.slice(-24));
            //other data
            elements = document.querySelectorAll('.data-bit');
            items.push(elements[1].innerText.replace(",", "."));
            items.push(elements[3].innerText);
            items.push(elements[2].innerText);
            items.push(elements[4].innerText);
          } else if (siteType == 'strava') {
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
          }

        } catch (error) {
          console.log(error);
          console.log("failed to scrape a url of type: " + siteType);
          return 'failed';
        }

        return items;
      }, siteType);
    }


    browser.close();
    return result;
  } catch (error) {
    browser.close();
    throw new Error(`"${error.message}"`);
  }
}

// scrape('https://www.facebook.com/photo.php?fbid=1933392113338291&set=a.290544414289744.83087.100000025635366&type=3&theater').then((ret) => {
//   console.log(ret);
// });

module.exports.scrape = scrape;
