const btnEl = document.getElementById('btn-el');
let context;

window.onload = function () {
    let audio = document.getElementById('audio');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    context = new AudioContext();

    let src = context.createMediaElementSource(audio);
    let analyser = context.createAnalyser();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    let barHeight,
        x = 0,
        bufferLength = analyser.frequencyBinCount,
        dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        x = 0;
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let barWidth = (canvas.width / bufferLength) * 2.5;
        let HEIGHT = canvas.height;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let r = barHeight + 25 * (i / bufferLength);
            let g = 250 * (i / bufferLength);
            let b = 50;

            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    // Play audio and start rendering on user interaction
    document.body.addEventListener('click', function () {
        if (context.state === 'suspended') {
            context.resume();
        }
        audio.play();
        renderFrame();
    });
};

btnEl.addEventListener('click', function () {
    context.resume().then(() => {
        console.log('Playback resumed successfully');
    });
});
