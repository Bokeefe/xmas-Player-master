/* jshint esversion:6 */
"use strict";
const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
const tracks = require('./tracks.json');
let vistitorCount = 0;

    app.use(express.static(__dirname + '/'));

    app.get('/', function (req, res) {
      res.sendFile(__dirname + './index.html');
      vistitorCount++;
      console.log('Visitor: ',vistitorCount);
    });    
    
    app.get('/getTracks', (req, res) => {
      var data = JSON.stringify(tracks);
      res.send(data);
    });

app.listen(8080, function () {
  console.log('app listening on port 8080!');
});
