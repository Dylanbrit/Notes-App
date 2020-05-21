// Strict mode is important to use because it prevents our code from having random errors that we might not catch until it makes its way to production and can cause data deletion errors or bugs that will be difficult to detect. It helps prevent leaked global variables that can make our code confusing, and it also makes sure we don't try to declare a variable using a keyword that JS is planning on using for the future, in the same sort of way where we cannot declare a variable with the name "let" or "const"
'use strict'

// We can create variables to store our DOM selectors
// We set up noteId to find the ID using location.hash.substring. We start at index of 1 because the index of 0 is the # symbol which we don't need
// We set up the notes variable to contain the value of getSavedNotes, storing our saved notes in this variable
// We set up the note variable to contain the value returned from searching our saved notes (through the notes variable with getSavedNotes) when the noteId matches an existing note's id
// In the offchance we do not get a match, we want the user returned to the home page, so they can try to select an actual note with an id, so we assign the location to index.html
const titleElement = document.querySelector('#note-title')
const bodyElement = document.querySelector('#note-body')
const removeElement = document.querySelector('#remove-note')
const dateElement = document.querySelector('#last-edited')
const noteId = location.hash.substring(1)
let notes = getSavedNotes()
let note = notes.find((note) => note.id === noteId)
if (!note) {
    location.assign('/index.html')
}

// We are setting the value of our input spaces to equal the title and body. What this means is that our input fields will pre-populate with the existing title and body once we enter that information
titleElement.value = note.title
bodyElement.value = note.body
dateElement.textContent = generateLastEdited(note.updatedAt)
// We are attaching input event listeners to our title, body, and button
// For title and body, the event listener sets the title/body to the respective text that the user is typing in by using e.target.value
// The text content of dateElement is set to the sentence that returns from our generateLastEdited function, which is a statement stating when the last time the note was edited was
// The argument we pass into our function call is note.updatedAt. The updatedAt property of our note contains timestamp, a variable that holds the valueOf the moment(), giving us the huge number of milliseconds that shows when it was last edited was
// Then we save notes
// The remove button just calls our existing functions in notes-functions that remove a note and then save our notes. We remove a note with the note.id passed through as an argument so that we are removing a specific note correctly. Then we set the location assignment to the home page, so that once the note is deleted the user is redirected home
titleElement.addEventListener('input', (e) => {
    note.title = e.target.value
    note.updatedAt = moment().valueOf()
    dateElement.textContent = generateLastEdited(note.updatedAt)
    saveNotes(notes)
})

bodyElement.addEventListener('input', (e) => {
    note.body = e.target.value
    note.updatedAt = moment().valueOf()
    dateElement.textContent = generateLastEdited(note.updatedAt)
    saveNotes(notes)
})
removeElement.addEventListener('click', (e) => {
    removeNote(note.id)
    saveNotes(notes)
    location.assign('/index.html')
})

// Some event listeners are not specific to any particular element, so we can attach them to "window" and still use it
// We are setting up this event listener so that if I have to tabs of the same note open and I edit one of them, the other one updates live without having to be refreshed. Just a kind of neat feature to be aware of
// This event listener has a function that fires whenever the data in localStorage changes. That's what the 'storage' argument does
// Remember- the storage event only fires on the page we don't have open, because the one we do have open is the one doing the manipulation and does not need to be updated
// All of this data lives on 'e'. There we can find the key, the newValue, and the oldValue
// Our if statement starts by checking to make sure the e value is changing the notes key. In this program we only have one key so far, which is notes, so there is nothing to worry about. But if we had multiple keys then we would want to make sure we are working with the right one
// If we are working in the right key, then we want to parse the string information contained in the e's newValue and store it in notes
// Change notes and note variables to let instead of const
// We use the same code from the top to search our notes. If the note doesn't exist we will redirect them and if it does we will set up the inputs
// For example, if the note got deleted on one page, you would get redirected to the home page on the other one. If it is still there and was altered, the changes would appear
window.addEventListener('storage', (e) => {
    if (e.key === 'notes') {
        notes = JSON.parse(e.newValue)
        note = notes.find((note) => note.id === noteId)
        if (!note) {
            location.assign('/index.html')
        }
        titleElement.value = note.title
        bodyElement.value = note.body
        dateElement.textContent = generateLastEdited(note.updatedAt)
    }
})