const express = require('express');
const fs = require('fs');
const path = require ('path');
const notesFile= require ('./db/db.json');

const PORT = 3001;

const app= express();

app.use(express.json());
app.use (express.urlencoded({extended: true}));

app.use(express.static('public'));

//get function to retrieve and 
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.post('/api/notes',(req, res)=> {
    const {title, text} = req.body;

    if(title&& text) {
        const newNote =  {
            title,
            text
        }
    
     //first need to read file
       fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
         if (err) {
           console.err(err)
         }  else {
             const parsedNotes = JSON.parse(data);
   
             parsedNotes.push(newNote);
           
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) =>
                err
                ? console.error(err)
                : console.log(`New Note has been written to JSON file`)
            );
           }
          });

}
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
)