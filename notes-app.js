// Strict mode is important to use because it prevents our code from having random errors that we might not catch until it makes its way to production and can cause data deletion errors or bugs that will be difficult to detect. It helps prevent leaked global variables that can make our code confusing, and it also makes sure we don't try to declare a variable using a keyword that JS is planning on using for the future, in the same sort of way where we cannot declare a variable with the name "let" or "const"
'use strict'

let notes = getSavedNotes()

// In our filters object, we leave searchText blank so users can submit fresh input, and we set sortBy to byEdited, so that the notes are organized based on which one was edited last
const filters = {
    searchText: '',
    sortBy: 'byEdited'
}

// We always call the renderNotes function once outside of any function just to get things started
renderNotes(notes, filters)

// We are setting up our Create Note buton to push notes into our notes array. The id comes from a third-party-library used to generate ids for our notes
// We leave title and body blank so the user can add whatever information they want for these properties
// When the button is clicked, part of the function call also sends the user to edit.html, a different page, to edit their note. The id is injected with the location assignment so that the user is taken to that specific page
// We set the variable timestamp to contain the value from moment, which gives us the really long number in milliseconds. Then we create properties so that those are pushed into our note values
// An interesting note to make here is that we set up a variable labeled "id" to hold the uuidv4() that organizes our notes by id. We are doing this because our function is an event listener and does not give us access to note.id, so we need to create a variable that refers to the id if we want to use it
document.querySelector('#create-note').addEventListener('click', (e) => {
    const id = uuidv4()
    const timestamp = moment().valueOf()
    notes.push({
        id: id,
        title: '',
        body: '',
        createdAt: timestamp,
        updatedAt: timestamp
    })
    saveNotes(notes)
    location.assign(`/edit.html#${id}`)
})

// This event listener makes it so that our search text field sets our search text filter equal to e.target.value, which is whatever value is being typed in
document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value
    renderNotes(notes, filters)
})

document.querySelector('#filter-by').addEventListener('change', (e) => {
    filters.sortBy = e.target.value
    renderNotes(notes, filters)
})

window.addEventListener('storage', (e) => {
    if (e.key === 'notes') {
        notes = JSON.parse(e.newValue)
        renderNotes(notes, filters)
    }
})

// We are using the "moment" third-party library to get the moment function, which gives us a representation of the current point in time when the script runs
// const now = moment()
// now.subtract(1, 'week').subtract(20, 'days')
// console.log(now.format('MMMM Do YYYY'))
// console.log(now.fromNow())
// const nowTimestamp = now.valueOf()

// console.log(moment(nowTimestamp).toString())

// const birthday = moment()
// birthday.year(1989).month(11).date(29)
// console.log(birthday.format('MMM D, YYYY'))