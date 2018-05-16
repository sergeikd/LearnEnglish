var player;
var recordedBlob;
var isDrow = false;
var checkModel = {};
var viewModel = {
    exerciseList: ko.observableArray(),
    comment: ko.observable(),
    mistakeList: ko.observableArray()
};
ko.applyBindings(viewModel);

window.onload = getList();

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
            getList();
            showNotification("alert-success", "Success!", "top", "center", "" , "" , 2000);
        },
        error: function () {
            showNotification("alert-danger", "Failed!", "top", "center", "" , "" , 2000);
        }
    });
}

function getList() {
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

function showModal(role, exercise) {
    $("#myModal").modal("show");
    if (role === "student" && exercise.IsChecked && !exercise.IsViewed) {
        $.ajax({
            url: "App/View",
            type: "POST",
            data: JSON.stringify(exercise.Id),
            contentType: "application/json",
            processData: false,
            success: function () {
                getList();
                console.log("Viewed status updated succesfully");
            },
            error: function () {
                showNotification("alert-danger", "Failed!", "top", "center", "", "", 2000);
                return;
            }
        });
    }
    var url = "App/GetAudio/" + exercise.Id;
    if (player) {
        clearMarks();
        player.wavesurfer().load(url);
    }
    else {
        var width = $("#myModal .modal-content").width();
        player = videojs("myPlayback", {
            controls: true,
            width: width - 30,
            height: 150,
            fluid: false,
            plugins: {
                wavesurfer: {
                    src: url,
                    msDisplayMax: 10,
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
    viewModel.mistakeList.removeAll();
    for (var i = 0; i < checkModel.MarkArray.length; i++) {
        viewModel.mistakeList.push(checkModel.MarkArray[i]);
    }
    setModal(role);
    player.on("waveReady", function () {
        if (!isDrow) {
            console.log("new event test");
            isDrow = true;
            var canvas = $("#myPlayback canvas")[1];
            var height = canvas.clientHeight;
            var width = canvas.clientWidth;
            var duration = Math.round(player.wavesurfer().getDuration() * 100) / 100;
            for (var i = 0; i < checkModel.MarkArray.length; i++) {
                var position = width / duration * checkModel.MarkArray[i].Time;
                var div = document.createElement("div");
                div.style.width = 10 + "px";
                div.style.height = height + "px";
                div.style.opacity = 0.5;
                div.style.background = getColor(checkModel.MarkArray[i].Type);
                div.style.marginLeft = position + "px";
                div.setAttribute("class", "vjs-bug mark");
                div.setAttribute("id", "mark" + i);
                $("#myPlayback").prepend(div);
            }
        }
    });
}

function createRecord() {
    $("#recordModal").modal("show");
    var width = $("#recordModal .modal-content").width();
    var micRecorder = videojs("micRecorder", {
        controls: true,
        width: width - 30,
        height: 150,
        fluid: false,
        plugins: {
            wavesurfer: {
                src: "live",
                waveColor: "#36393b",
                progressColor: "#black",
                debug: true,
                cursorWidth: 1,
                msDisplayMax: 2,
                hideScrollbar: true
            },
            record: {
                audio: true,
                video: false,
                maxLength: 120,
                debug: true,
                audioSampleRate: 22050,
                audioChannels: 1
            }
        },
        controlBar: {
            fullscreenToggle: false
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
}

function addBug(type) {
    var time = player.wavesurfer().getCurrentTime();
    time -= 0.5;
    if (time < 0) {
        time = 0;
    }
    time = time.toFixed(2);
    var mark = {
        Time: time,
        Type: type
    }
    checkModel.MarkArray.push(mark);
    viewModel.mistakeList.push(mark);
    console.log(viewModel.mistakeList());
    var duration = Math.round(player.wavesurfer().getDuration() * 100) / 100;
    var canvas = $("#myPlayback canvas")[0];
    var height = canvas.clientHeight;
    var width = canvas.clientWidth;
    var position = width / duration * time;
    var div = document.createElement("div");
    div.style.width = 10 + "px";
    div.style.height = height + "px";
    div.style.opacity = 0.5;
    div.style.background = getColor(type);
    div.style.marginLeft = position + "px";
    div.setAttribute("class", "vjs-bug mark");
    div.setAttribute("id", "mark" + (viewModel.mistakeList().length - 1));
    $("#myPlayback").prepend(div);
    console.log("marks:", document.getElementsByClassName("mark"));
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
            getList();
            showNotification("alert-success", "Success!", "top", "center", "", "", 2000);
        },
        error: function () {
            showNotification("alert-danger", "Failed!", "top", "center", "" , "" , 2000);
        }
    });
}

function clearMarks() {
    checkModel.MarkArray.length = 0;
    viewModel.mistakeList.removeAll();
    viewModel.comment(null);
    var marks = document.getElementsByClassName("mark");
    while (marks.length > 0) {
        marks[0].remove();
    }
    marks = document.getElementsByClassName("mark");
}

function remove() {
    $.ajax({
        url: "App/Remove",
        type: "Get",
        data: null,
        contentType: false,
        processData: false,
        success: function () {
            getList();
            console.log("Viewed status updated succesfully");
        },
        error: function () {
            showNotification("alert-danger", "Failed!", "top", "center", "", "", 2000);
            return;
        }
    });
}

function getColor(type) {
    switch (type) {
    case 1:
        return "red";
    case 2:
        return "yellow";
    case 3:
        return "green";
    case 4:
        return "blue";
    default:
        return "gray";
    }
}

function setModal(role) {
    switch (role) {
    case "teacher":
        $("#mistakeButtons").show();
        $("#teacherComment").show();
        $("#studentComment").hide();
        $("#actionButtons").show();
        break;
    case "student":
        $("#mistakeButtons").hide();
        $("#teacherComment").hide();
        $("#studentComment").show();
        $("#actionButtons").hide();
        break;
    }
}

$('#myModal').on('hidden.bs.modal', function () {
    console.log("modal closed");
    isDrow = false;
    //player.wavesurfer().destroy();
})