//the things that you are requiring
const express = require('express');
const fs = require('fs');
const path = require ('path');
const { v4: uuidv4 } = require('uuid');

//the port that you are requiring
const PORT = 3001;

//app pulling in an express
const app= express();

app.use(express.json());
app.use (express.urlencoded({extended: true}));

app.use(express.static('public'));

//get function to send the file public/index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//get function to send the file public/notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//get function to read the file db/db.json
app.get('/api/notes', (req, res) => {
    fs.readFile ('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(JSON.parse(data))
        }
    })
})

//posting the new note
app.post('/api/notes',(req, res)=> {
    const {title, text} = req.body;

    if(title&& text) {
        const newNote =  {
            id: uuidv4(),
            title,
            text
        }
    
//first need to read file
       fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
         if (err) {
           res.status(500).json(err);
         }  else {
//then you parse the data
             const parsedNotes = JSON.parse(data);
//pushes the new note to the array
             parsedNotes.push(newNote);
//writes the file with the new note
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) =>
                err
                ? res.status(500).json(err)
                : res.status(201).json('new note added to db.json')
            );
           }
          });

}
})
// to delete a note
app.delete ('/api/notes/:id', (req, res) => {
//first you have to read the file
    fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
        if (err) {
          res.status(500).json(err)
        }  else {
//then you have to take the data from the db.json file, parse it and filter by id
            const parsedNotes = JSON.parse(data);
//creates a new array of all the ones that do not match the id requested
            const filteredNotes = parsedNotes.filter(note => note.id !== req.params.id)
//writes a new file with the data
            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) =>
                err
                ? res.status(500).json(err)
                : res.status(200).json('db.json updated')
        );
        }
    })
})

//captures any unknown typing in the file path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

//allows listening at the PORT
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
)