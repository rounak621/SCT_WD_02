class Stopwatch {
    constructor() {
        // Initialize time variables
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.laps = [];
        this.lastLapTime = 0;

        // DOM elements
        this.timeDisplay = document.querySelector('.time-display');
        this.startStopButton = document.getElementById('startStop');
        this.lapButton = document.getElementById('lap');
        this.resetButton = document.getElementById('reset');
        this.lapTimesContainer = document.getElementById('lapTimes');

        // Bind event listeners
        this.startStopButton.addEventListener('click', () => this.toggleStartStop());
        this.lapButton.addEventListener('click', () => this.recordLap());
        this.resetButton.addEventListener('click', () => this.reset());

        // Initial button states
        this.lapButton.disabled = true;
        this.resetButton.disabled = true;

        // Set initial display to zeros
        this.timeDisplay.textContent = "00:00:00.00";
    }

    toggleStartStop() {
        if (this.isRunning) {
            this.pause();
            this.startStopButton.textContent = 'Start';
            this.startStopButton.classList.remove('active');
        } else {
            this.start();
            this.startStopButton.textContent = 'Stop';
            this.startStopButton.classList.add('active');
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.intervalId = setInterval(() => this.updateDisplay(), 10);
            this.lapButton.disabled = false;
            this.resetButton.disabled = false;
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.elapsedTime = Date.now() - this.startTime;
        }
    }

    reset() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.laps = [];
        this.lastLapTime = 0;
        this.timeDisplay.textContent = "00:00:00.00";
        this.clearLaps();
        this.startStopButton.textContent = 'Start';
        this.startStopButton.classList.remove('active');
        this.lapButton.disabled = true;
        this.resetButton.disabled = true;
    }

    updateDisplay() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        const formattedTime = this.formatTime(this.elapsedTime);
        this.timeDisplay.textContent = formattedTime;
    }

    formatTime(time) {
        const hours = Math.floor(time / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    recordLap() {
        const currentTime = this.elapsedTime;
        const lapTime = currentTime - this.lastLapTime;
        this.lastLapTime = currentTime;

        const lapNumber = this.laps.length + 1;
        const totalTimeFormatted = this.formatTime(currentTime);
        const lapTimeFormatted = this.formatTime(lapTime);

        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span>Lap ${lapNumber}</span>
            <span>${lapTimeFormatted}</span>
            <span>${totalTimeFormatted}</span>
        `;

        this.lapTimesContainer.insertBefore(lapItem, this.lapTimesContainer.firstChild);
        this.laps.push({ lapTime, totalTime: currentTime });
    }

    clearLaps() {
        while (this.lapTimesContainer.firstChild) {
            this.lapTimesContainer.removeChild(this.lapTimesContainer.firstChild);
        }
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});
