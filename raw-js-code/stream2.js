// Load the necessary modules and define a port
const app = require('express')();
const fs = require('fs');
const path = require('path');
const port = 3006;

// Add a basic route to check if server's up
app.get('/', (req, res) => {
    // res.status(200).send(`Server up and running`);
    const relativePath = path.join(__dirname, '../data/stream.txt');
    console.log(relativePath);
    const readStream = fs.createReadStream(relativePath);

    // pass readable stream data, which are the content of data.txt, to the 
    // response object, which is a writeable stream
    readStream.pipe(res);
});

app.get('/chunk', (req, res) => {
    const relativePath = path.join(__dirname, '../data/newFile.txt');
    const readStream = fs.createReadStream(relativePath);
    const g =[]
    readStream.on('data', function(chunk) {
        g.push(chunk.toString());
      console.log('this is the data from file', chunk);
      res.write(chunk.toString());
    });
  
    readStream.pause();
    console.log('on pause: readable flowing', readStream.readableFlowing);
  
    readStream.resume();
    console.log('on resume: readable flowing', readStream.readableFlowing);
  
    readStream.on('close', () => {
        // res.json({'data': g})
        res.end();
    })
});

app.post('/', (req, res) => {
    const filePath = path.join(__dirname, `/image2.jpg`);
    const stream = fs.createWriteStream(filePath);

    stream.on('open', () => req.pipe(stream));
});

// Mount the app to a port
app.listen(port, () => {
    console.log('Server running at http://127.0.0.1:3006/');
});