

// Import the dependencies
var http = require('http');
const fs = require("fs");
const cheerio = require("cheerio")
const rp = require('request-promise');
var request = require('request');


const URLprefix = "http://shirts4mike.com/"
const shirtURLs =[];
const shirts = [];

////////////////////////////////////////////////

function formatTitle(Title){
var result = Title.slice(4)
return result;
}

////////////////////////////////////////////////////



try{

  let d = new Date();
  let fileName = d.toISOString().split('T')[0];
  const directory = './data'

  function makeDir(directory){
  fs.mkdirSync(directory);
  return true;
  };

  function makeFile(directory, fileName){
  fs.writeFileSync(`${directory}/${fileName}.csv`);
  };

  if (fs.existsSync(directory)) {
      console.log('directory exists')//comment out
      makeFile(directory, fileName)
  } else {
  makeDir(directory);
  makeFile(directory, fileName);
  }
} catch (err){
  console.log(`There was an error creating the file: ${err.message}`);
}

///////////////////////////////////////////////////////


var getURLs = {
    uri: `${URLprefix}shirts.php`,
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(getURLs)
    .then(function ($) {
      $('.products li a').each(function (i, elem) {
      let URL = $(this).attr('href');
      shirtURLs.push(URL);
      });
    })
    .then(function () {
      shirtURLs.forEach(function(i) {
    scrapeURL(`${URLprefix}${i}`)
});
})
.then(function () {
 console.log('shirt')
})
.catch(function (err){
  if (err.statusCode === 404){
    console.log(`Error ${err.statusCode}: There was a problem connecting to ${URLprefix}`)
  }
});

    //////////////////////////////////////////////////////////////////////////////////

    function scrapeURL(url) {
          request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              const $ = cheerio.load(body);


              let Title = $('.shirt-details h1').text();
               $title = formatTitle(Title);
               $price = $('.price').text();
               $imgURL =  $('.shirt-picture img').attr('src');
               $url = url;
               $time = new Date().toUTCString();

               var shirt = {
                title: $title,
                price : $price,
                image : $imgURL,
                url: url,
                time: $time,
              };
              console.log(shirt)
            }///put in error
          })
        };

  /////////////////////////////////////////////////////////////////////////////////
