let form = document.getElementById('form');
let shortcodeCta = document.getElementById('shortcode-cta');
let inputUrl = document.getElementById('input-url');
let errorMsg = document.getElementById('error-msg');
let resultsContainer = document.getElementById('results-container');
let copyButton;

function getShortCode(e) {
  e.preventDefault(); /* prevents the form from reloading the page */

  let url = inputUrl.value; /* gets the url value from the input */
  
  /* fetch the shortened url via fetch API */
  fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.error) {
        console.log(`Error: ${data.error}`);
        showError(data);
      }
      else {
        console.log(`Result: ${data.result}`)
        showData(data);
      }
    });

  form.reset(); /* resets the form */
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

function showData(data) {

  /* Remove error formatting */
  errorMsg.classList.remove('error-msg');
  inputUrl.classList.remove('error');
  errorMsg.textContent = "";

  /* Build Result Container */

  /* Creates Div Container */
  let resultContainer = document.createElement('div');
  resultContainer.classList.add('result-container');

  let oldResult = document.createElement('div');
  oldResult.classList.add('old-result-container');
  
  /* Show Original Url */ 
  let oldUrlDisplay = document.createElement('p');
  oldUrlDisplay.classList.add('result__old-url');
  oldUrlDisplay.textContent = data.result.original_link;
  oldResult.append(oldUrlDisplay);

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
  copyButton.id = `copy-button-${data.result.code}`;
  copyButton.dataset.code = data.result.full_short_link;
  newResult.append(copyButton);
  
  /* Add Div Container to HTML */
  resultsContainer.append(resultContainer);
  resultContainer.append(oldResult);
  resultContainer.append(newResult);
  copyButton.addEventListener('click', copyUrl);
}

function copyUrl(e) {
  
  /* get the text in a variable*/
  let copyText= copyButton.dataset.code; 
  
  /* use the write text method with Clipboard API */
  navigator.clipboard.writeText(copyText).then(function( ){
    // copyButton.classList.add('copied');
    console.log('copied');
  });
}

form.addEventListener('submit', getShortCode);
