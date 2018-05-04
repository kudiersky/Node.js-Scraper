///////////// Import the dependencies///////////////////////////////////////////
const http = require('http');
const fs = require("fs");
const cheerio = require("cheerio")
const rp = require('request-promise');
const request = require('request');


const domain = "http://shirts4mike.com/"
const shirtURLs =[];
const shirts = [];

/////////////////////////// function used to format Title //////////////////////

function formatTitle(Title){
var result = Title.slice(4)
return result;
}

////////////////////////////////////////////////////////////////////////////////



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

////////////////////////////////////////////////////////////////////////////////

var getURLs = {
    uri: `${domain}shirts.php`,
    transform: function (body) {
        return cheerio.load(body);
    }
};
//////////////////////////////////////////////////////////////problem area /////
rp(getURLs)
    .then(function ($) {
      $('.products li a').each(function (i, elem) {
      let URL = domain+$(this).attr('href');
      shirtURLs.push(URL);
      });
      return(shirtURLs)
    })
    .then((function (shirtURLs) {  //unlike the function above. the shirs.push(shirt) doesnt act as expected as the subsequent
                                  //.then() says shirt.length = 0.

      shirtURLs.forEach(scrapeURL)

      return shirts;

    }))
    .then(function(){console.log(shirts.length)})
.catch(function (err){
  if (err.statusCode === 404){
    console.log(`Error ${err.statusCode}: There was a problem connecting to ${domain}`)
  }
  else {
    console.log(err)
  }
});

function scrapeURL(element) {
      request(element, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(body);


          let Title = $('.shirt-details h1').text();
           $title = formatTitle(Title);
           $price = $('.price').text();
           $imgURL =  $('.shirt-picture img').attr('src');
           $time = new Date().toUTCString();

           var shirt = {
            title: $title,
            price : $price,
            image : $imgURL,
            time: $time,
          };
          shirts.push(shirt)
        }///put in error
      })
    };
