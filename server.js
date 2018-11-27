const express = require('express');

const app = new express();

app.use(express.static('docs'));

app.listen(8080, ()=>{ console.log('listening to port 8080')});