"use strict";

var sound;
var tracks;
var count = 0;
$(document).ready(function(){
    $('.shuffle').on('click touchstart', function() {
        hitRandom(tracks);
     });

    $('#playbackSpeed').on('click touchstart', function() {
       updateControls();
    });
    $('#revTime').on('click touchstart', function() {
        updateControls();
     });
     $('#revDecay').on('click touchstart', function() {
        updateControls();
     });
     $('#revMix').on('click touchstart', function() {
        updateControls();
     });

     $('#playPause').on('click', function() {
         let savedTime = sound.sourceNode.context.currentTime;
        if(sound.playing){
                $('#play-button').removeClass('fa-pause');
                $('#play-button').addClass('fa-play');
                sound.pause();            
            } else {
                $('#play-button').removeClass('fa-play');
                $('#play-button').addClass('fa-pause');
                sound.play();
                sound.offsetTime = savedTime;
                sound.sourceNode.playbackRate.value = getPlaybackSpeedSetting();

            }
     });
     onLoad();


});

function onLoad(){
    $.get("/getTracks", function(data){
        tracks = JSON.parse(data);
        var playlist = randomPlaylist(tracks);
        startPlayer(tracks);
    });
}

function hitPause(){
    sound.pause();
}

function hitRandom (x){
    sound.stop();
     startPlayer(x);
}

function startPlayer(tracks){
    var songNum = getRandomTrack(tracks);
    sound = new Pizzicato.Sound({
        source: 'file',
        options: { path: '/audio/'+tracks[songNum].srcpath }
    }, function() {
        $('.songTitle').html(JSON.stringify(tracks[songNum].title));
        $('.songArtist').html(JSON.stringify(tracks[songNum].artist));

        !sound.effects[0] ? firstAddEffect() : updateControls();
        
        sound.play();

        if(sound.playing){
            $('#play-button').toggleClass('fa-pause');
            setOnEnd(tracks);
        }
        sound.sourceNode.playbackRate.value = getPlaybackSpeedSetting();

        count++;
        console.log(count+" | "+tracks[songNum].title+" by : "+tracks[songNum].artist);
    });
}

function firstAddEffect(){
    var reverb = new Pizzicato.Effects.Reverb({
        time: $('#revTime').val()*1,
        decay:$('#revDecay').val()*1,
        reverse: false,
        mix: $('#revMix').val()*.01
    });

    sound.addEffect(reverb);

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
        if($('#play-button').hasClass('fa-pause')){
            startPlayer(tracks);
        } else {
            sound.pause();
        }
    };
}