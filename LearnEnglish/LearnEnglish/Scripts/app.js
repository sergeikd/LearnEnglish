var player = videojs("myAudio", {
    blob: {},
    controls: true,
    width: 720,
    height: 300,
    fluid: false,
    plugins: {
        wavesurfer: {
            src: "live",
            waveColor: "#36393b",
            progressColor: "#black",
            debug: true,
            cursorWidth: 1,
            msDisplayMax: 10,
            hideScrollbar: true
        },
        record: {
            audio: true,
            video: false,
            maxLength: 10,
            debug: true,
            audioSampleRate: 22050,
            audioChannels: 1
        }
    }
}, function() {
    // print version information at startup
    videojs.log('Using video.js', videojs.VERSION,
        'with videojs-record', videojs.getPluginVersion('record'),
        '+ videojs-wavesurfer', videojs.getPluginVersion('wavesurfer'),
        'and recordrtc', RecordRTC.version);
});
// error handling
player.on('deviceError', function() {
    console.log('device error:', player.deviceErrorCode);
});
player.on('error', function(error) {
    console.log('error:', error);
});
// user clicked the record button and started recording
player.on('startRecord', function() {
    console.log('started recording!');
});
// user completed recording and stream is available
player.on('finishRecord', function() {
    // the blob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.
    blob = player.recordedData;
    console.log('finished recording: ', blob);

});

function savefile() {
    //player.record().saveAs({ 'audio': 'fileFront.webm' });
    var data = new FormData();
    data.append('file', blob);

    $.ajax({
        url: "Student/Upload",
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
            alert("id = " + data);
        },
        error: function () {
            alert("failed");
        }
    });
};