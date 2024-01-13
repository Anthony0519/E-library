const axios = require('axios');

// Replace spaces in the title with '+'
const title = 'Supervolcano: Things Fall Apart (A Supervolcano Novel)';
const formattedTitle = title.replace(/ /g, '+');

// Construct the API URL
const apiUrl = `https://openlibrary.org/search.json?title=${formattedTitle}`;

// Use Axios to make a GET request to the Open Library API
axios.get(apiUrl)
  .then(response => {
    const work = response.data.docs[0]; // Assuming there is a matching work
    if (work && work.ebook_count_i > 0 && work.ebook_access !== 'no_ebook' && work.has_fulltext) {
      // Construct the URL based on the Internet Archive identifier (ia)
      const iaIdentifier = work.ia[0]; // Assuming there is at least one identifier
      const internetArchiveUrl = `https://archive.org/details/${iaIdentifier}`;
      console.log(`You can access the ebook here: ${internetArchiveUrl}`);
    } else {
      console.log('Sorry, the ebook is not available or cannot be accessed.');
    }
  })
  .catch(error => {
    // Handle any errors that may occur during the request
    console.error(error);
  });