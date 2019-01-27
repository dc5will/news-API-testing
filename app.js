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

/* ============ EXAMPLE IF USER INPUTS TESLA ==============
if const params = {
    q: 'tesla'
    language: 'en'
}
const queryItems = Object.keys(params) // [q, language]
    .map(key => `${key}=${params[key]}`) // ['q=tesla', 'language=em']
  return queryItems.join('&'); // 'q=tesla&language=en'
*/

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
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults)) // console.log(responseJson
    .catch(err => {
      $('#js-error-message').text('Something went wrong: ${err.message}');
    });
}


// function for displaying results
function displayResults(responseJson, maxResults) {
  // clear out any results in the '#results-list'
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.articles.length & i < maxResults; i++) {
    // for each video object in the article array, add a list item to the results with article title, source, autho, description, and image
    $('#results-list').append(
      `<li><h3><a href='${responseJson.articles[i].url}'>${responseJson.articles[i].title}</a></h3>
            <p>${responseJson.articles[i].source.name}</p>
            <p>By ${responseJson.articles[i].author}</p>
            <p>${responseJson.articles[i].urlToImage}'>
            <img src='${responseJson.articles[i].urlToImage}'>
            </li>`
    );
  }
  $('#results').removeClass('hidden');
}
// this function takes ONE argument (responseJson) that's returned as part of our GET request. If there are any results form a previous search, we clear those first using the empty() method.




// watch for the form submission
function watchForm() {
  $('form').submit(event => { // waits for form to get submitted
    event.preventDefault(); 
    // capture the value of the user's input
    const searchTerm = $('#js-search-term').val(); // extracts value provided in search term input
    const maxResults = $('#js-max-results').val(); // extracts maximum results input
    getNews(searchTerm, maxResults); // passes these values into getNews function
  });
}

// run getNews function when page loads. Should return JSON object with information
$(watchForm);
    
