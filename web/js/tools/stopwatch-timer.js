document.addEventListener('DOMContentLoaded', () => {
    // Stopwatch elements
    const stopwatchDisplay = document.getElementById('stopwatch-display');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
    const stopwatchStartBtn = document.getElementById('stopwatch-start');
    const stopwatchStopBtn = document.getElementById('stopwatch-stop');
    const stopwatchLapBtn = document.getElementById('stopwatch-lap');
    const stopwatchResetBtn = document.getElementById('stopwatch-reset');
    const stopwatchLaps = document.getElementById('stopwatch-laps');

    let stopwatchInterval;
    let stopwatchRunning = false;
    let stopwatchStartTime;
    let stopwatchElapsedTime = 0;
    let lapCounter = 0;

    function formatTime(ms) {
        const date = new Date(ms);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    function updateStopwatchDisplay() {
        const currentTime = Date.now();
        stopwatchElapsedTime = currentTime - stopwatchStartTime;
        stopwatchDisplay.textContent = formatTime(stopwatchElapsedTime);
    }

    stopwatchStartBtn.addEventListener('click', () => {
        if (!stopwatchRunning) {
            stopwatchStartTime = Date.now() - stopwatchElapsedTime;
            stopwatchInterval = setInterval(updateStopwatchDisplay, 10);
            stopwatchRunning = true;
            stopwatchStartBtn.disabled = true;
            stopwatchStopBtn.disabled = false;
            stopwatchLapBtn.disabled = false;
            stopwatchResetBtn.disabled = false;
        }
    });

    stopwatchStopBtn.addEventListener('click', () => {
        if (stopwatchRunning) {
            clearInterval(stopwatchInterval);
            stopwatchRunning = false;
            stopwatchStartBtn.disabled = false;
            stopwatchStopBtn.disabled = true;
            stopwatchLapBtn.disabled = true;
        }
    });

    stopwatchLapBtn.addEventListener('click', () => {
        if (stopwatchRunning) {
            lapCounter++;
            const lapTime = formatTime(stopwatchElapsedTime);
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'lap-item');
            listItem.innerHTML = `<span>Vuelta ${lapCounter}</span><span>${lapTime}</span>`;
            stopwatchLaps.prepend(listItem);
        }
    });

    stopwatchResetBtn.addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchElapsedTime = 0;
        lapCounter = 0;
        stopwatchDisplay.textContent = '00:00:00.000';
        stopwatchLaps.innerHTML = '';
        stopwatchStartBtn.disabled = false;
        stopwatchStopBtn.disabled = true;
        stopwatchLapBtn.disabled = true;
        stopwatchResetBtn.disabled = true;
    });

    // Timer elements
    const timerDisplay = document.getElementById('timer-display');
    const timerHoursInput = document.getElementById('timer-hours');
    const timerMinutesInput = document.getElementById('timer-minutes');
    const timerSecondsInput = document.getElementById('timer-seconds');
    const timerStartBtn = document.getElementById('timer-start');
    const timerPauseBtn = document.getElementById('timer-pause');
    const timerResetBtn = document.getElementById('timer-reset');
    const timerAlarm = document.getElementById('timer-alarm');

    let timerInterval;
    let timerRunning = false;
    let timerEndTime;
    let timerRemainingTime = 0;

    function formatTimerTime(ms) {
        const totalSeconds = Math.round(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function updateTimerDisplay() {
        const currentTime = Date.now();
        timerRemainingTime = timerEndTime - currentTime;

        if (timerRemainingTime <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            timerDisplay.textContent = '00:00:00';
            timerAlarm.play();
            timerStartBtn.disabled = false;
            timerPauseBtn.disabled = true;
            timerResetBtn.disabled = true;
            alert('¡Tiempo terminado!');
            return;
        }
        timerDisplay.textContent = formatTimerTime(timerRemainingTime);
    }

    function setTimerDuration() {
        const hours = parseInt(timerHoursInput.value) || 0;
        const minutes = parseInt(timerMinutesInput.value) || 0;
        const seconds = parseInt(timerSecondsInput.value) || 0;
        timerRemainingTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        timerDisplay.textContent = formatTimerTime(timerRemainingTime);
    }

    timerHoursInput.addEventListener('input', setTimerDuration);
    timerMinutesInput.addEventListener('input', setTimerDuration);
    timerSecondsInput.addEventListener('input', setTimerDuration);

    timerStartBtn.addEventListener('click', () => {
        if (!timerRunning) {
            if (timerRemainingTime <= 0) {
                setTimerDuration(); // Set duration if not already set or reset
                if (timerRemainingTime <= 0) {
                    alert('Por favor, establece una duración para el temporizador.');
                    return;
                }
            }
            timerEndTime = Date.now() + timerRemainingTime;
            timerInterval = setInterval(updateTimerDisplay, 1000);
            timerRunning = true;
            timerStartBtn.disabled = true;
            timerPauseBtn.disabled = false;
            timerResetBtn.disabled = false;
            timerAlarm.pause();
            timerAlarm.currentTime = 0;
        }
    });

    timerPauseBtn.addEventListener('click', () => {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
            timerStartBtn.disabled = false;
            timerPauseBtn.disabled = true;
        }
    });

    timerResetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerRunning = false;
        timerRemainingTime = 0;
        timerDisplay.textContent = '00:00:00';
        timerHoursInput.value = 0;
        timerMinutesInput.value = 0;
        timerSecondsInput.value = 0;
        timerStartBtn.disabled = false;
        timerPauseBtn.disabled = true;
        timerResetBtn.disabled = true;
        timerAlarm.pause();
        timerAlarm.currentTime = 0;
    });

    // Initial display setup
    setTimerDuration();
});