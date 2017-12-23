/* jshint esversion:6 */
"use strict";
const express = require('express');
const app = express();
const path = require('path');
const nodeID3 = require('node-id3');
const fs = require("fs");

    app.use(express.static(__dirname + '/'));
let counter = 0;


    const srcpath = './audio/';
    const tracks = fs.readdirSync(srcpath).filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    var tags = tracks.map((item)=>{
      var info =  nodeID3.read(srcpath+item);


      if(info){
        info.srcpath = item;
        delete info.raw.APIC;
        delete info.trackNumber;
        delete info.encodedBy;
        delete info.comment;
        delete info.performerInfo;
        delete info.textWriter;
        delete info.image;
        delete info.imageBuffer;
        delete info.partOfSet;
        delete info.composer;
        delete info.genre;
        delete info.year;
        delete info.publisher;
        delete info.bpm;
        delete info.raw;

        if(!info.title){
          info.title = info.srcpath;
          info.artists = "????";
          console.log(info);
        } else {
          info.title = info.title.replace(/\\\//g, "/");
          info.title = info.title.replace(/\\\//g, "/");

          console.log(info);
        }

        counter++;
        return info;   
      } else {
        info.title = info.srcpath;
        info.artists = "????";
      }
    });

    tags = JSON.stringify(tags);

    function writeSongData(filePath, songData){
      fs.writeFileSync(filePath,songData);
      console.log('wrote '+counter+' songs to: '+filePath);
    }
    writeSongData('./staging.json',tags);

    app.get('/getTracks', (req, res) => {
      var data = JSON.stringify(tracks);
      res.send(data);
    });
//
// app.listen(8080, function () {
//   console.log('app listening on port 8080!');
// });
