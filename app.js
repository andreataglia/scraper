const inputFile = 'dati_corsa.csv';
const outputFile = 'new.csv';

var csv = require('./csv.js');

csv.generateCsv(inputFile, outputFile);
