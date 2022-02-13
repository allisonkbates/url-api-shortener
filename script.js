let hamburgerIcon = document.getElementById('hamburger-icon');
let hamburgerMenu = document.getElementById('hamburger-menu');
let heroImageMobile = document.getElementById('hero-image--mobile');
let form = document.getElementById('form');
let shortcodeCta = document.getElementById('shortcode-cta');
let inputUrl = document.getElementById('input-url');
let errorMsg = document.getElementById('error-msg');
let resultsContainer = document.getElementById('results-container');
let copyButton;

function toggleHamburgerMenu() {
  hamburgerMenu.classList.toggle('hide-on-load');
  heroImageMobile.classList.toggle('hide');
}

function getShortCodeData(e) {
  
  /* Prevents the form from reloading the page */
  e.preventDefault(); 

  /* Gets the url value from the input */
  let url = inputUrl.value; 
  
  /* Fetch the shortened url via fetch API */
  fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.error) {
        console.log(`Error: ${data.error}`);
        showError(data);
      }
      else {
        console.log(`Result: ${data.result}`);
        hideError();
        showResults(data);
        saveResults(data);
      }
    });
  
  /* Resets the form */
  form.reset();
}

function showError(data) {
  
  if (data.error_code === 1) {
    errorMsg.textContent = "Please add a link."
  } else if (data.error_code === 2) {
    errorMsg.textContent = "Please enter a valid url.";
  } else {
    errorMsg.textContent = "Please try again.";
  }

  errorMsg.classList.add('error-msg')
  inputUrl.classList.add('error');
}

function hideError() {

  /* Remove Error Formatting */
  errorMsg.classList.remove('error-msg');
  inputUrl.classList.remove('error');
  errorMsg.textContent = "";
}

function showResults(data) {
  /* Builds the html & css for each result */

  /* Creates Div Container */
  let resultContainer = document.createElement('div');
  resultContainer.classList.add('result-container');

  /* Container for Showing Original Url */ 
  let oldResult = document.createElement('div');
  oldResult.classList.add('old-result-container');
  
  /* Show Original Url */
  let oldUrlDisplay = document.createElement('p');
  oldUrlDisplay.classList.add('result__old-url');
  oldUrlDisplay.textContent = data.result.original_link;
  oldResult.append(oldUrlDisplay);

  /* Container for Showing New Url */ 
  let newResult = document.createElement('div');
  newResult.classList.add('new-result-container');
  
  /* Show New Url */
  let newUrlDisplay = document.createElement('p');
  newUrlDisplay.classList.add('result__new-url');
  newUrlDisplay.textContent = data.result.full_short_link;
  newResult.append(newUrlDisplay);

  /* Show Copy Button */
  copyButton = document.createElement('button');
  copyButton.classList.add('btn', 'result__btn');
  copyButton.id = `copy-button-${data.result.code}`; /* using code as a unique key */
  copyButton.dataset.code = data.result.full_short_link;
  newResult.append(copyButton);
  
  /* Add Div Container to HTML */
  resultsContainer.append(resultContainer);
  resultContainer.append(oldResult);
  resultContainer.append(newResult);
  copyButton.addEventListener('click', copyUrl); 
}

function saveResults(data) {
  /* Set local storage, using unique code to create unique keys */
  window.localStorage.setItem(`result-${data.result.code}`, JSON.stringify(data));
}

function getLocalStorageResults() {
  /* Check if localStorage exists. If it exists, loop through local storage and build each result using showData function*/
  if (localStorage.length) {
    for (var i = 0; i < localStorage.length; i++) {
      showResults(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
  } else {
    console.log('no local storage');
  }
  
}

function copyUrl(e) {
  
  /* Get the text in a variable */
  let copyText= copyButton.dataset.code; 
  
  /* Use the write text method with Clipboard API */
  navigator.clipboard.writeText(copyText).then(function( ){
    console.log('copied');
  });
}

form.addEventListener('submit', getShortCodeData);
hamburgerIcon.addEventListener('click', toggleHamburgerMenu);
getLocalStorageResults();

/* JS Bugs */
// - If a user enters the same url twice, it will show in the results. If the user refreshes the page, it will de-dupe the results. (Bug or a feature? 🤷‍♀️)
