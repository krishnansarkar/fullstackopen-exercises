sequenceDiagram
    participant Browser
    participant Server

    Note right of Browser: browser executes the form.onsubmit callback function which redraws the notes with the new note added, then posts to server

    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa