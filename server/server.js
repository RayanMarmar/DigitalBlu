const express = require('express');
const app = express();
const port = 8080;
const path = require('path');


app.get('/', (req, res) => {
  res.send('Hello World from Node.js server!');
});

app.use(express.static(path.join(__dirname, '../dist/digital-blu')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/digital-blu/browser/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
