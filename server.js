const express = require('express');

const app = new express();

app.use(express.static('docs'));
const port = 8081;
app.listen(port, ()=>{ console.log(`listening to port ${port}`)});