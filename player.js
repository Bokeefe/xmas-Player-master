"use strict";
var sound;
var tracks;
var count = 0;
// $(window).load(function() { // better to use $(document).ready(function(){
//     $('.List li').on('click touchstart', function() {
//         $('.Div').slideDown('500');
//     });
// });
function onLoad(){
    $.get("/getTracks", function(data){
        tracks = JSON.parse(data);
        var playlist = randomPlaylist(tracks);
        startPlayer(tracks);
    });
}
onLoad();

function hitRandom (){
    $('.songTitle').html('Loading...');
    $('.songArtist').html('Loading...');
    sound.stop();
    onLoad();
}

function startPlayer(tracks){
    var songNum = getRandomTrack(tracks);
    sound = new Pizzicato.Sound({
        source: 'file',
        options: { path: '/audio/'+tracks[songNum].srcpath }
    }, function() {
        var reverb = new Pizzicato.Effects.Reverb({
            time: $('#revTime').val()*1,
            decay:$('#revDecay').val()*1,
            reverse: false,
            mix: $('#revMix').val()*.01
        });
        sound.addEffect(reverb);
        sound.play();
        
        sound.sourceNode.playbackRate.value = getPlaybackSpeedSetting();
        $('.songTitle').html(JSON.stringify(tracks[songNum].title));
        $('.songArtist').html(JSON.stringify(tracks[songNum].artist));
        if(sound.playing){
          setOnEnd(tracks);
        }
        count++;
        console.log(tracks[songNum].title,tracks[songNum].artist);
    });
}

function getRandomTrack(tracks) {
   return Math.floor(Math.random() * tracks.length);
}

function randomPlaylist(tracks){
    var arr = [];
    var playlist = [];
    while(arr.length < tracks.length){
        var randomnumber = Math.floor(Math.random()* tracks.length) + 1;
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
        playlist.push(tracks[randomnumber]);
    }
    return(playlist);
}

function getPlaybackSpeedSetting (){
  return $('#playbackSpeed').val()*.01;
}

function updateControls(){
  sound.effects["0"].decay = $('#revDecay').val()*1;
  sound.effects["0"].time = $('#revTime').val()*1;
  sound.effects["0"].mix = $('#revMix').val()*.01;
  sound.sourceNode.playbackRate.value = $('#playbackSpeed').val()*.01;
}

function setOnEnd(x){
  sound.sourceNode.onended = function() {
    startPlayer(tracks);
  }
}