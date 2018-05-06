const inputFile = 'dati_corsa.csv';
const outputFile = 'new.csv';
const scrapersDelay = 3; //seconds in between the scrapings

var csv = require('./csv.js');

csv.generateCsv(inputFile, outputFile, scrapersDelay);
