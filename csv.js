var fs = require('fs');
var csv = require("fast-csv");

function generateCsv(inputFile, outputFile) {
  var stream = fs.createReadStream(inputFile);
  var scraper = require('./scraper.js');
  let c = -1;
  //start fresh csv file
  fs.writeFile(outputFile, '', function(err) {
    if (err) throw err;
  });

  csv
    .fromStream(stream)
    .on("data", function(data) {
      c++;
      if (c == 0) {
        fs.appendFile(outputFile, data + '\n', function(err) {
          if (err) throw err;
        });
      } else {
        setTimeout(function() {
          console.log("#" + c + " scraping started..");
          //data[2] always cointains the url to scrape from
          const currentData = data[0] + ',' + data[1] + ',' + data[2] + ',';
          scraper.scrape(data[2]).then(function(items) {
            fs.appendFile(outputFile, currentData + items + '\n', function(err) {
              if (err) throw err;
            });
          });
        }, c * 2 * 1000)
      }
    })
    .on("end", function() {
      console.log("finished processing csv lines. Waiting for the scraper...");
    });
}

exports.generateCsv = generateCsv;
