var recordedBlob = {};
var micRecorder = videojs("micRecorder", {
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
micRecorder.on('deviceError', function() {
    console.log('device error:', micRecorder.deviceErrorCode);
});
micRecorder.on('error', function(error) {
    console.log('error:', error);
});
// user clicked the record button and started recording
micRecorder.on('startRecord', function() {
    console.log('started recording!');
});
// user completed recording and stream is available
micRecorder.on('finishRecord', function() {
    // the recordedBlob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.
    recordedBlob = micRecorder.recordedData;
    console.log('finished recording: ', recordedBlob);

});
var viewModel = {
    exerciseList: ko.observableArray([new Exercise()]),
    checkModel: ko.observable({})
};
ko.applyBindings(viewModel);

function Exercise(id, fileArray, dateTime, isViewed, isChecked) {
    this.id = id;
    this.fileArray = fileArray;
    this.dateTime = dateTime;
    this.isChecked = isChecked;
    this.isViewed = isViewed;
}

function savefile() {
    var data = new FormData();
    data.append("file", recordedBlob);

    $.ajax({
        url: "Student/Upload",
        type: "POST",
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
}

function getTeacherData() {
    $.ajax({
        url: "Student/Get",
        type: "GET",
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            viewModel.exerciseList.removeAll();
            for (var i = 0; i < data.length; i++) {
                viewModel.exerciseList.push(new Exercise(data[i].Id, data[i].FileArray, data[i].DateTime, data[i].IsChecked, data[i].IsViewed));
            }
        },
        error: function () {
            alert("failed");
        }
    });
}

function check(exercise) {
    viewModel.checkModel(exercise);
    //viewModel.checkModel({
    //    //id: exercise.id,
    //    id: "111",
    //    fileArray: exercise.fileArray,
    //    dateTime: exercise.dateTime,
    //    isChecked: exercise.isChecked,
    //    isViewed: exercise.isViewed
    //});
    $("#checkModal").modal("show");
    console.log(viewModel.checkModel());
}

function savefile() {
    //micRecorder.record().saveAs({ 'audio': 'fileFront.webm' });
    var data = new FormData();
    data.append('file', recordedBlob);

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