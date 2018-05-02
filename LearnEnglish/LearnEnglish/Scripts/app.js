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

var player;
var recordedBlob;

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
        url: "Student/GetList",
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
    var url = "Student/GetAudio/" + exercise.id;
    if (player) {
        var bugs = document.getElementsByClassName("vjs-bug");
        for (var i = 0; i < bugs.length; i++) {
            bugs[i].innerHTML = "";
        }
        console.log(player);
        player.wavesurfer().load(url);
    }
    else {
        player = videojs("myPlayback", {
            controls: true,
            width: 600,
            height: 300,
            fluid: false,
            plugins: {
                wavesurfer: {
                    src: url,
                    msDisplayMax: 10,
                    debug: true,
                    waveColor: '#F2E68A',
                    progressColor: 'black',
                    cursorColor: 'black',
                    hideScrollbar: true
                }
            }
        }, function () {
            videojs.log('Using video.js', videojs.VERSION,
                'with videojs-wavesurfer', videojs.getPluginVersion('wavesurfer'));
        });
    }
    player.on('error', function (error) {
        console.log('error:', error);
    });

    viewModel.checkModel(exercise);

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

function addBug() {
    var time = Math.round(player.wavesurfer().getCurrentTime() * 100) / 100;
    console.log("time = " + time);
    player.bug({
        height: 50,
        imgSrc: 'http://cdn.teamcococdn.com/image/frame:1/teamcoco_twitter_128x128.png',
        opacity: 0.5,
        padding: '8px',
        position: 'tl',
        width: 50
    });
}