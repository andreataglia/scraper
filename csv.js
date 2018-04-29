var fs = require('fs');
var csv = require("fast-csv");

function generateCsv(inputFile, outputFile) {
  var stream = fs.createReadStream(inputFile);
  var scraper = require('./scraper.js');
  let c = 0;
  //start fresh csv file
  fs.writeFile(outputFile, '', function(err) {
    if (err) throw err;
  });

  csv
    .fromStream(stream)
    .on("data", function(data) {
      if (c == 0) {
        c++;
        fs.appendFile(outputFile, data + '\n', function(err) {
          if (err) throw err;
        });
      } else {
        setTimeout(function() {

          //data[2] always cointeins the url to scrape from
          console.log(data[2]);
          const currentData = data[0] + ',' + data[1] + ',' + data[2] + ',';
          scraper.scrape(data[2]).then(function(items) {
            console.log("ciao");
            fs.appendFile(outputFile, currentData + items + '\n', function(err) {
              if (err) throw err;
            });
          });
        }, c * 2 * 1000)
      }
    })
    .on("end", function() {
      console.log("done");
    });
}

exports.generateCsv = generateCsv;
