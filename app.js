var file = document.getElementById("thefile");
var audio = document.getElementById("audio");

var files, context, src, analyser, canvas, ctx, bufferLength, dataArray

file.onchange = function () {
    files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.controls = true;
    audio.load();
    audio.play();
    context = new AudioContext();
    src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();

    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 512;

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        _bufferLength = bufferLength;
        bufferLength = analyser.frequencyBinCount;
        if (bufferLength != _bufferLength) {
            console.log(bufferLength);
            barWidth = (WIDTH / bufferLength) * 2.5;
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
            barHeight = HEIGHT * dataArray[i] / 256;

            var r = barHeight + (25 * (i / bufferLength));
            var g = 250 * (i / bufferLength);
            var b = 50;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
    renderFrame();
};