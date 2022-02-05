let form = document.getElementById('form');
let shortcodeCta = document.getElementById('shortcode-cta');
let inputUrl = document.getElementById('input-url');
let errorMsg = document.getElementById('error-msg');
let resultsContainer = document.getElementById('results-container');

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
    inputUrl.classList.add('error');
  }

  function showData(data) {
    /* Remove error formatting */
    inputUrl.classList.remove('error');
    errorMsg.textContent = "";

    /* Show Data */
    
    /* Creates div container */
    let newResult = document.createElement('div');
    newResult.classList.add('result-container');
    /* Show Original Url */ 
    let oldUrlDisplay = document.createElement('p');
    oldUrlDisplay.classList.add('result__old-url');
    oldUrlDisplay.textContent = data.result.original_link;
    newResult.append(oldUrlDisplay);
    /* Show New Url */
    let newUrlDisplay = document.createElement('p');
    newUrlDisplay.classList.add('result__new-url');
    newUrlDisplay.textContent = data.result.full_short_link;
    newResult.append(newUrlDisplay);

    let copyButton = document.createElement('button');
    copyButton.classList.add('result__btn', 'btn');
    copyButton.textContent = "Copy";
    newResult.append(copyButton);
    
    /* Add Div Container to HTML */
    resultsContainer.append(newResult);
  }

/* Pseudo Code */
/* Function to show whether url is valid that should be done on change*/
/* On submit, check again to make sure url is valid*/

form.addEventListener('submit', getShortCode);
