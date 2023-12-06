const canvas = document.getElementById('canvas1');
const fileInput = document.getElementById('fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;
const audioContext = new AudioContext(); // Initialize AudioContext

// Function to setup and play audio
function setupAndPlayAudio(audioElement) {
    audioSource = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let isMusicPlaying = false;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        

    
        // Get the frequency data from the audio
        analyser.getByteFrequencyData(dataArray);
    
        // Determine the center of the canvas
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
    
        // Iterate over the frequency data and draw concentric circles
        for (let i = 0; i < bufferLength; i++) {
            const radius = dataArray[i] * 2.3; // Scale the radius based on frequency data
            const alpha = i / bufferLength; // Gradually change the transparency based on the index
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;  // Set the stroke style with varying transparency
            ctx.lineWidth = 2.5; // Set the line width
            ctx.stroke();
        }
        
    
        // Call this function again on the next animation frame
        requestAnimationFrame(animate);
    }
    
    

    animate();

    // Resume audio context if needed
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    audioElement.play();
}

function drawGrain() {
    const grainDensity = 0.05; // Adjust for more or less grain
    const grainSize = 2; // Size of the grain particles

    for (let i = 0; i < canvas.width * canvas.height * grainDensity; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const alpha = Math.random(); // Random transparency

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // Grain color
        ctx.fillRect(x, y, grainSize, grainSize);
    }
}


fileInput.addEventListener('change', function() {
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    audio1.src = URL.createObjectURL(files[0]);

    audio1.addEventListener('loadeddata', () => {
        setupAndPlayAudio(audio1);
    });
});


