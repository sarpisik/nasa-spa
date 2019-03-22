import getElement from '../selector'
import searchHistory from '../searchHistory'
import mediaLayout from '../mediaLayout'
import smoothScroll from '../scroll'
import alertBox from '../alertBox'

// Get Elements
const intro = getElement('.intro')

// Resolver
const resolver = (res, text, form) => {
  // Fetched data
  const items = res.collection.items

  // If the data is not empty keep process.
  // Else, print an error
  if (items.length > 0) {
    // Save this search
    searchHistory[text] = { text: text, data: items }
    searchHistory.lastSearch = text

    // Update DOM
    mediaLayout(items, form)
  } else {
    // Stop loading indicator
    form.classList.remove('loading')

    // Alert the not founded text
    alertBox(text, 'strong')
  }
}

export default (form, text) => {
  // Show loading indicator
  form.classList.add('loading')

  // If this is not the repeat of the previous search, fetch data.
  // Else if this one of the previous search, get the data from searchHistory object and update the DOM.
  // Else, jump to results
  if (!searchHistory[text]) {
    fetch(`https://images-api.nasa.gov/search?q=${text}`)
      .then(res => res.json())
      .then(res => resolver(res, text, form))
      .catch(error => {
        // Stop loading indicator
        form.classList.remove('loading')
        // Display error
        alertBox(error)
      })
  } else if (text !== searchHistory.lastSearch && searchHistory[text]) {
    // Save search text to avoid update DOM if user submit search again without any text change
    searchHistory.lastSearch = text

    // Update DOM
    mediaLayout(searchHistory[text].data, form, searchHistory[text].text)
  } else {
    // Stop loading indicator
    form.classList.remove('loading')

    // jump to results
    smoothScroll(intro, 500)
  }
}
