//$(document).ready(function () {
//    $('#success-alert').hide();
//});

var viewModel = {
    exerciseList: ko.observableArray([new Exercise()]),
    checkModel: ko.observable({})
};
ko.applyBindings(viewModel);

function Exercise(id, fileArray, dateTime, isViewed, isChecked, markArray ) {
    this.Id = id;
    this.FileArray = fileArray;
    this.DateTime = dateTime;
    this.IsChecked = isChecked;
    this.IsViewed = isViewed;
    this.MarkArray = markArray;
}

var player;
var recordedBlob;

function savefile() {
    var data = new FormData();
    data.append("file", recordedBlob);

    $.ajax({
        url: "App/Upload",
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
        url: "App/GetList",
        type: "GET",
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            viewModel.exerciseList.removeAll();
            for (var i = 0; i < data.length; i++) {
                viewModel.exerciseList.push(new Exercise(
                    data[i].Id,
                    data[i].FileArray,
                    data[i].DateTime,
                    data[i].IsChecked,
                    data[i].IsViewed,
                    data[i].MarkArray));
            }
        },
        error: function () {
            alert("failed");
        }
    });
}

function check(exercise) {
    $('#success-msg').hide();
    $('#danger-msg').hide();
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

    viewModel.checkModel(exercise);

    $("#checkModal").modal("show");
    console.log(viewModel.checkModel());
}

function savefile() {
    //micRecorder.record().saveAs({ 'audio': 'fileFront.webm' });
    var data = new FormData();
    data.append('file', recordedBlob);

    $.ajax({
        url: "App/Upload",
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        success: function () {
            console.log("saved successfully");
        },
        error: function () {
            console.log("failed");
        }
    });
}

function addBug(type) {
    var time = Math.round(player.wavesurfer().getCurrentTime() * 100) / 100;
    time -= 0.1;
    if (time < 0) {
        time = 0;
    }
    viewModel.checkModel().MarkArray.push({ Time: time, Type: type});
    var duration = Math.round(player.wavesurfer().getDuration() * 100) / 100;

    var canvas = $("#myPlayback canvas")[0];
    var height = canvas.clientHeight;
    var width = canvas.clientWidth;
    var position = width / duration * time;
    var color;
    switch  (type)
    {
        case 0:
            color = "red";
            break;
        case 1:
            color = "yellow";
            break;
        case 2:
            color = "green";
            break;
        case 3:
            color = "blue";
            break;
        default:
            color = "gray";
    }
    player.bug({
        height: height + 'px',
        imgSrc: 'http://cdn.teamcococdn.com/image/frame:1/teamcoco_twitter_128x128.png',
        opacity: 0.5,
        padding: position + 'px',
        width: 10 + "px",
        color: color
    });
}

function saveChecked() {
    var data = JSON.stringify(viewModel.checkModel());
    //var data = new FormData();
    //data.append('exercise', viewModel.checkModel().id);
    $.ajax({
        url: "App/Save",
        type: "POST",
        data: data, 
        contentType: "application/json",
        processData: false,
        success: function (data) {
            $("#success-msg").show();
            window.setTimeout(function () {
                $("#success-msg").hide();
            }, 3000);
        },
        error: function () {
            $("#danger-msg").show();
            window.setTimeout(function () {
                $("#danger-msg").hide();
            }, 3000);
        }
    });
}

function clearMarks() {
    viewModel.checkModel().MarkArray.length = 0;
    var marks = document.getElementsByClassName("mark");
    while (marks.length > 0) {
        marks[0].remove();
    }
}