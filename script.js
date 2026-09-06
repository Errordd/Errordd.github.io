const bgMusic = document.getElementById('bgMusic');
const midnightMusic = document.getElementById('midnightMusic');

function isMidnightHour() {
    return new Date().getHours() === 0;
}

function getExpectedAudio() {
    return isMidnightHour() ? midnightMusic : bgMusic;
}

let activeAudio = getExpectedAudio();

function tryPlay(audioEl) {
    audioEl.play().catch(() => {
        setTimeout(() => {
            const events = ['click', 'keydown', 'touchstart', 'mousemove', 'scroll', 'pointerdown'];
            const startAudio = () => {
                audioEl.play();
                events.forEach(evt => document.removeEventListener(evt, startAudio));
            };
            events.forEach(evt => document.addEventListener(evt, startAudio, { once: true, passive: true }));
        }, 1000);
    });
}

tryPlay(activeAudio);

function checkMidnightSwitch() {
    const expected = getExpectedAudio();
    if (expected !== activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio = expected;
        tryPlay(activeAudio);
    }
}

let use12Hour = true;

const digits = ['h1', 'h2', 'm1', 'm2', 's1', 's2'].map(id => document.getElementById(id));
const dateEl = document.getElementById('clockDate');

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});

function pad(n) {
    return n.toString().padStart(2, '0');
}

function updateClock() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    let displayHours = now.getHours();
    if (use12Hour) {
        displayHours = displayHours % 12;
        if (displayHours === 0) displayHours = 12;
    }

    const hStr = pad(displayHours);
    const mStr = pad(minutes);
    const sStr = pad(seconds);

    [...hStr, ...mStr, ...sStr].forEach((char, i) => digits[i].textContent = char);

    dateEl.textContent = dateFormatter.format(now);

    checkMidnightSwitch();
}

updateClock();
setInterval(updateClock, 1000);

document.getElementById('clockWidget').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    use12Hour = !use12Hour;
    updateClock();
});
