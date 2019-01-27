'use strict';
/* global $ */

// create variable for apiKey (required for News API)
const apiKey = 'a7991a78ed4243719a15137f31594e47';
const searchURL = 'https://newsapi.org/v2/everything';

function formatQueryParams(params) {
  // create an array of the keys in the 'params' object
  const queryItems = Object.keys(params)
  // for each of the keys in that array, create a string with the key and the va;ue in the 'params' object
    .map(key => `${key}=${params[key]}`);
    // return a string of the keys and values, separated by '&'
  return queryItems.join('&');
}


// add query parameter for search term
// language=en, tells the API we only want articles written in English.
// q=tesla, tells the API that we only want to get back articles related to Tesla
function getNews(query, maxResults = 10) {
  // create the query parameters
  const params = {
    q: query, // set the 'q' parameter equal to the value the user inputs
    language: 'en',
  };
  // createa a string with the original URL and the new parameters
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  // News API tells us that we can either pass our key through as a parameter or via a request header. Avoid exposing API key as a parameter and use headers when possible.
  const options = {     // create an options object, which we'll pass through as our second argument when we call fetch() below
    headers: new Headers({ // create new instance of Headers class.
      'X-Api-Key': apiKey}) // News API lets us authenticate our app via X-Api-Key HTTP header.
  };

  // call fetch and pass through 2 arguments above.
  fetch(url, options) 
    .then(response => response.json()) // format the response as JSON
    .then(responseJson => console.log(responseJson)); // log the response JSON to the console
}

// watch for the form submission
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    // capture the value of the user's input
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNews(searchTerm, maxResults);
  });
}




// run getNews function when code runs. Should return JSON object with information
$(watchForm);
    
