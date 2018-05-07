var player;
var recordedBlob;
var viewModel = {
    exerciseList: ko.observableArray([]),
    checkModel: ko.observable({}),
    comment: ko.observable()
};
ko.applyBindings(viewModel);

function savefile() {
    //micRecorder.record().saveAs({ 'audio': 'fileFront.webm' });
    var data = new FormData();
    data.append("file", recordedBlob);
    $.ajax({
        url: "App/Upload",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
            showNotification("alert-success", "Success!", "top", "center", "" , "" , 2000);
        },
        error: function () {
            showNotification("alert-danger", "Failed!", "top", "center", "" , "" , 2000);
        }
    });
}

function getTeacherData() {
    $.ajax({
        url: "App/GetList",
        type: "GET",
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            viewModel.exerciseList.removeAll();
            for (var i = 0; i < data.length; i++) {
                viewModel.exerciseList.push({
                    Id: data[i].Id,
                    FileArray: data[i].FileArray,
                    DateTime: data[i].DateTime,
                    IsChecked: data[i].IsChecked,
                    IsViewed: data[i].IsViewed,
                    MarkArray: data[i].MarkArray,
                    Comment: data[i].Comment
                });
            }
        },
        error: function () {
            showNotification("alert-danger", "Failed!", "top", "center", "" , "" , 2000);
        }
    });
}

function check(exercise) {
    var url = "App/GetAudio/" + exercise.Id;
    if (player) {
        clearMarks();
        player.wavesurfer().load(url);
    }
    else {
        player = videojs("myPlayback", {
            controls: true,
            width: 600,
            height: 200,
            fluid: false,
            plugins: {
                wavesurfer: {
                    src: url,
                    msDisplayMax: 1,
                    debug: true,
                    waveColor: "#36393b",
                    progressColor: "black",
                    cursorColor: 'black',
                    hideScrollbar: true
                }
            },
            controlBar: {
                fullscreenToggle: false
            }
        }, function () {
            videojs.log('Using video.js', videojs.VERSION,
                'with videojs-wavesurfer', videojs.getPluginVersion('wavesurfer'));
        });
    }
    player.on('error', function (error) {
        console.log('error:', error);
    });

    checkModel = $.extend(true, {}, exercise);
    viewModel.comment(checkModel.Comment);
    $("#checkModal").modal("show");
    player.on("waveReady", function () {
        var canvas = $("#myPlayback canvas")[0];
        var height = canvas.clientHeight;
        var width = canvas.clientWidth;
        var duration = Math.round(player.wavesurfer().getDuration() * 100) / 100;
        for (var i = 0; i < checkModel.MarkArray.length; i++) {
            var position = width / duration * checkModel.MarkArray[i].Time;
            player.bug({
                height: height + 'px',
                opacity: 0.5,
                padding: position + 'px',
                width: 10 + "px",
                color: getColor(checkModel.MarkArray[i].Type)
            });
        }
    });
    console.log("after check action:", viewModel.comment());
}

function addBug(type) {
    var time = Math.round(player.wavesurfer().getCurrentTime() * 100) / 100;
    time -= 0.1;
    if (time < 0) {
        time = 0;
    }
    checkModel.MarkArray.push({ Time: time, Type: type});
    var duration = Math.round(player.wavesurfer().getDuration() * 100) / 100;
    var canvas = $("#myPlayback canvas")[0];
    var height = canvas.clientHeight;
    var width = canvas.clientWidth;
    var position = width / duration * time;
    player.bug({
        height: height + 'px',
        opacity: 0.5,
        padding: position + 'px',
        width: 10 + "px",
        color: getColor(type)
    });
}

function saveChecked() {
    checkModel.Comment = viewModel.comment();
    var data = JSON.stringify(checkModel);
    $.ajax({
        url: "App/Save",
        type: "POST",
        data: data, 
        contentType: "application/json",
        processData: false,
        success: function (data) {
            getTeacherData();
            showNotification("alert-success", "Success!", "top", "center", "", "", 2000);
        },
        error: function () {
            showNotification("alert-danger", "Failed!", "top", "center", "" , "" , 2000);
        }
    });
    console.log("To save", viewModel.exerciseList(), checkModel.Id);
}

function clearMarks() {
    checkModel.MarkArray.length = 0;
    viewModel.comment(null);
    var marks = document.getElementsByClassName("mark");
    while (marks.length > 0) {
        marks[0].remove();
    }
}

function getColor(type) {
    switch (type) {
    case 0:
        return "red";
    case 1:
        return "yellow";
    case 2:
        return "green";
    case 3:
        return "blue";
    default:
        return "gray";
    }
}