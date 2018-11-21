const express = require('express');

const app = new express();

app.use(express.static('demo'));

app.listen(8080, ()=>{ console.log('listening')});