

///////////// Import the dependencies/////////////////////////////////////////////////////////////
const http = require('http');
const fs = require("fs");
const cheerio = require("cheerio")
const rp = require('request-promise');
const request = require('request');


const domain = "http://shirts4mike.com/"
const shirtURLs =[];
const shirts = [];
const myArray = [1,2,3,4];

/////////////////////////// function used to format Title //////////////////////////////////////////////

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
//////////////////////////////////////////////////////////////problem area //////////////////////////////////////
rp(getURLs)
    .then(function ($) {
      $('.products li a').each(function (i, elem) {
      let URL = $(this).attr('href');
      shirtURLs.push(URL);
      });
      return(shirtURLs)
    })
    .then((function () {
      console.log('here')
      let a = shirtURLs.map(scrapeURL);
      console.log(a)

    }
    ))
.then(function (b) {
////////////////////////////////////////////////////////////////problem area //////////////////////////////////////
console.log(b)

})
.catch(function (err){
  if (err.statusCode === 404){
    console.log(`Error ${err.statusCode}: There was a problem connecting to ${domain}`)
  }
  else {
    console.log(err)
  }
});

function scrapeURL(element) {

        shirt ={
          title: '123',
          price : element
          };

          return shirt
        }



    //////////////////////////////////////////////////////////////////////////////////
