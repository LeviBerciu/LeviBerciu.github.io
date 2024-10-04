
// TABS ----------

document.addEventListener("DOMContentLoaded", function() {
    const tabLinks = document.querySelectorAll('.tourTabs li');
    const tabs = document.querySelectorAll('.tourTabContent');

    tabLinks.forEach((tabLink) => {
        tabLink.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all tabs and tab contents
            tabLinks.forEach(link => link.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));

            // Add active class to the clicked tab and the corresponding content
            const target = this.querySelector('a').getAttribute('href');
            this.classList.add('active');
            document.querySelector(target).classList.add('active');
        });
    });
});

// MAP ----------

// Initialize Panzoom on the image
const elem = document.getElementById('mapImage');
const panzoom = Panzoom(elem, {
    maxScale: 5, // Maximum zoom level
    contain: 'outside', // Allow panning outside the initial container bounds
    step: 1,
});

// Enable mousewheel zoom
elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

// AUDIO PLAYER ----------

const tourAudio = document.getElementById('tourAudio');
const tourChapterTitle = document.getElementById('tourChapterTitle');
const tourProgressSlider = document.getElementById('tourProgressSlider');
const tourCurrentTimeEl = document.getElementById('tourCurrentTimeEl');
const tourTotalTimeEl = document.getElementById('tourTotalTimeEl');

const tourPrevChapterButton = document.getElementById('tourPrevChapterButton');
const tourBack10Button = document.getElementById('tourBack10Button');
const tourPlayPauseButton = document.getElementById('tourPlayPauseButton');
const tourForward10Button = document.getElementById('tourForward10Button');
const tourNextChapterButton = document.getElementById('tourNextChapterButton');

const playPauseIcon = tourPlayPauseButton.querySelector('img'); // Access the <img> tag

// Set the path to your play and pause icons
const playIconSrc = 'assets/play_icon.svg';
const pauseIconSrc = 'assets/pause_icon.svg';


// Data for chapters (start times in seconds)
const chapters = [
    { title: 'Chapter 1: Introduction', start: 0 },
    { title: 'Chapter 2: History', start: 60 },
    { title: 'Chapter 3: Technology', start: 120 }
];

let currentChapter = 0;

tourPlayPauseButton.addEventListener('click', () => {
    if (tourAudio.paused) {
        tourAudio.play();
        playPauseIcon.src = pauseIconSrc;
    } else {
        tourAudio.pause();
        playPauseIcon.src = playIconSrc;
    }
});

// Update chapter based on current time
function updateChapter(currentTime) {
    for (let i = 0; i < chapters.length; i++) {
        if (currentTime >= chapters[i].start && (i === chapters.length - 1 || currentTime < chapters[i + 1].start)) {
            if (i !== currentChapter) {  // Only update if chapter changes
                currentChapter = i;
                tourChapterTitle.textContent = chapters[i].title;
            }
            break;
        }
    }
}

tourAudio.addEventListener('timeupdate', () => {
    const currentTime = tourAudio.currentTime;
    const duration = tourAudio.duration;

    // Update progress percentage
    const progressPercent = (currentTime / duration) * 100;
  
    // Update the passed time bar and slider thumb position
    tourProgressSlider.style.setProperty('--progress', progressPercent + '%');
    tourProgressSlider.value = progressPercent;
  
    // Update time display
    tourCurrentTimeEl.textContent = formatTime(currentTime);
    tourTotalTimeEl.textContent = formatTime(duration);

    // Check if the chapter needs to be updated
    updateChapter(currentTime);
});

// Format time in minutes:seconds
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Handle slider input (seek)
tourProgressSlider.addEventListener('input', () => {
    const duration = tourAudio.duration;
    const seekTime = (tourProgressSlider.value / 100) * duration;
    tourAudio.currentTime = seekTime;

    // Check if the chapter needs to be updated when seeking
    updateChapter(seekTime);
});

// Next/Previous Chapter Buttons
tourNextChapterButton.addEventListener('click', () => {
    if (currentChapter < chapters.length - 1) {
        currentChapter++;
        loadChapter(currentChapter);
    }
});
  
tourPrevChapterButton.addEventListener('click', () => {
    if (currentChapter > 0) {
        currentChapter--;
        loadChapter(currentChapter);
    }
});

// Function to load a chapter by index
function loadChapter(index) {
    const chapter = chapters[index];
    tourAudio.currentTime = chapter.start;
    tourChapterTitle.textContent = chapter.title;
}

// Skip Forward/Backward 10 Seconds
tourForward10Button.addEventListener('click', () => {
    tourAudio.currentTime += 10;
});
  
tourBack10Button.addEventListener('click', () => {
    tourAudio.currentTime -= 10;
});

tourAudio.addEventListener('ended', () => {
    playPauseIcon.src = playIconSrc; // Revert to play icon when the audio finishes
});