// Strict mode is important to use because it prevents our code from having random errors that we might not catch until it makes its way to production and can cause data deletion errors or bugs that will be difficult to detect. It helps prevent leaked global variables that can make our code confusing, and it also makes sure we don't try to declare a variable using a keyword that JS is planning on using for the future, in the same sort of way where we cannot declare a variable with the name "let" or "const"
'use strict'

// Read existing notes from localStorage
// The following function checks to see if we have anything already saved, and returns it if we do
// We start by creating a variable to hold the value returned from reading our saved 'notes'
// The part below checks to see if a value was returned from checking 'notes'
// If there is a value there (as opposed to no value which returns null), we return the parsed version of our data, giving us an object to work with
// If there is no data already saved- null- then we return an empty bracket, allowing us to have a blank canvas to submit data into!
// A new feature we added to this function is the try-catch conditional to allow us to still run our program if the data in localStorage is invalid. If everything goes smoothly, we either parse the data in notesJSON (our data in localStorage) or return an empty bracket. If we do have an error, we want to return an empty bracket anyway, so it can allow us to start with fresh data even if there is an error in localStorage
const getSavedNotes = () => {
    const notesJSON = localStorage.getItem('notes')

    try {
        return notesJSON ? JSON.parse(notesJSON) : []
    } catch (e) {
        return []
    }
}

// Save the notes to localStorage
// This is a function that uses localStorage to save the "notes"
// The first argument for setItem is the key, which is "notes", and the second is the value, which is the stringified version of our notes
const saveNotes = (notes) => {
    localStorage.setItem('notes', JSON.stringify(notes))
}

// Remove a note from the list using its id
// This function will find the index of the notes (its position in our list starting with 0). Once found, we return when the id passed in matches an existing id
// If the index is greater than -1 (all indexes are, so if we have a match then it will be), we splice it out using its index number
const removeNote = (id) => {
    const noteIndex = notes.findIndex((note) => note.id === id)

    if (noteIndex > -1) {
        notes.splice(noteIndex, 1)
    }
}

// Generate the DOM structure for a note
// This creates a function that creates a paragraph and establishes its text as whatever is in "note", then it returns it
// p is created as a variable that holds the value of the created element, which is a paragraph. textContent is used to make the text content of the paragraph equivalent to the value of the "text" of a "note", then we return it
// To make it easier to attach our checkbox and button to each text element, we create a div to contain everything in one package- checkbox, text, and button all under one div
// setAttribute is a specific way to set up a checkbox that was given to me by the instructor
// noteEl is our div that contains everything- text, button, and checkbox
// We use span to make it so the text is on the same line as everything else, then later we change it to anchor so that it can contain our link to another page
// We set up our checkbox as an input first, and update it later with setAttribute
// Then we just append everything to our container div and return it and voila!
// When our button is clicked, it runs the code in removeNote function to remove the note, then saves and renders the list
// We use setAttribute on textEl (our text for the note title) to make its attribute href (which creates a hyperlink), and the place we send it to is /edit.html including the note id. This way, when the user clicks on the title, it takes them to the edit page for that specific id
const generateNoteDOM = (note) => {
    const noteEl = document.createElement('a')
    const textEl = document.createElement('p')
    const statusEl = document.createElement('p')

    // Setup the note title text
    if (note.title.length > 0) {
        textEl.textContent = note.title
    } else {
        textEl.textContent = 'Unnamed Note'
    }
    textEl.classList.add('list-item__title')
    noteEl.appendChild(textEl)

    // Setup the link
    noteEl.setAttribute('href', `/edit.html#${note.id}`)
    noteEl.classList.add('list-item')

    // Setup the status message
    statusEl.textContent = generateLastEdited(note.updatedAt)
    statusEl.classList.add('list-item__subtitle')
    noteEl.appendChild(statusEl)

    return noteEl
}

// Sort your notes by one of three ways
// This function is going to allow us to sort our notes
// When we run this function, it uses an if else statement to determine the order
// When sorting byEdited, we use a.updatedAt and b.updatedAt so that the statement is judging the order based on the updatedAt property for the note it is examining
// We repeat these steps with createdAt and alphabetical to wire up those sorting selections as well
const sortNotes = (notes, sortBy) => {
    if (sortBy === 'byEdited') {
        return notes.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
                return -1
            } else if (a.updatedAt < b.updatedAt) {
                return 1
            } else {
                return 0
            }
        })
    } else if (sortBy === 'byCreated') {
        return notes.sort((a, b) => {
            if (a.createdAt > b.createdAt) {
                return -1
            } else if (a.createdAt < b.createdAt) {
                return 1
            } else {
                return notes
            }
        })
    } else if (sortBy === 'alphabetical') {
        return notes.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return -1
            } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1
            } else {
                return 0
            }
        })
    }
}

// Render application notes
// We set up a variable to store the filtered note data. The filter function here returns when we have a match between an existing note title and the text put into the search text bu the user
// innerHTML clears the input field after we search
// We use forEach on filteredNotes to store the value returned from generateNoteDOM in noteEl, which we then append to our notes div
// Remember, generateNoteDOM is a function that creates our note div. Our note div contains our title text and our button
// We start by setting notes equal to the function sortNotes. sortNotes takes in the notes array as well as the sortBy filter to organize our notes depending on the filter the user selects
const renderNotes = (notes, filters) => {
    const notesEl = document.querySelector('#notes')
    notes = sortNotes(notes, filters.sortBy)
    const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(filters.searchText.toLowerCase()))

    notesEl.innerHTML = ''

    if (filteredNotes.length > 0) {
        filteredNotes.forEach((note) => {
            const noteEl = generateNoteDOM(note)
            notesEl.appendChild(noteEl)
        })
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No notes to show. Create a note!'
        emptyMessage.classList.add('empty-message')
        notesEl.appendChild(emptyMessage)
    }
}

// Generate the Last Edited message
// This is a simple function. It generates a statement about when the last time the note was edited was
// The argument it takes is our timestamp, which is going to be note.updatedAt. This gives us the value our note holds on when the last time it was updated was. fromNow is used to show how long it has been since that occurred
const generateLastEdited = (timestamp) => `Last edited ${moment(timestamp).fromNow()}`