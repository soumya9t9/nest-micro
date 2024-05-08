const fs = require("fs");
const path = require('path');

function readStream() {
  const readerStream = fs.createReadStream("./data/stream.txt");

  readerStream.on("data", function (chunk) {
    console.log(chunk.toString());
  });

  readerStream.on("end", function () {
    console.log("Stream Ended");
  });

  readerStream.on("error", function (err) {
    console.log(err.stack);
  });
}

function writeStream() {
  const filePath = path.join(__dirname, `../data/newFile.txt`);
  const writer = fs.createWriteStream("./data/newFile.txt");
  console.log(filePath);
  for (let i = 0; i <= 5000; i++) {
    writer.write("Displaying index " + i + "\n");
  }
}

writeStream();