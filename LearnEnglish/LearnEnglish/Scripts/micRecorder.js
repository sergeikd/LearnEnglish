var recordedBlob = {};
var micRecorder = videojs("micRecorder", {
    controls: true,
    width: 600,
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
}, function () {
    // print version information at startup
    videojs.log('Using video.js', videojs.VERSION,
        'with videojs-record', videojs.getPluginVersion('record'),
        '+ videojs-wavesurfer', videojs.getPluginVersion('wavesurfer'),
        'and recordrtc', RecordRTC.version);
});
// error handling
micRecorder.on('deviceError', function () {
    console.log('device error:', micRecorder.deviceErrorCode);
});
micRecorder.on('error', function (error) {
    console.log('error:', error);
});
// user clicked the record button and started recording
micRecorder.on('startRecord', function () {
    console.log('started recording!');
});
// user completed recording and stream is available
micRecorder.on('finishRecord', function () {
    // the recordedBlob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.
    recordedBlob = micRecorder.recordedData;
    console.log('finished recording: ', recordedBlob);

});