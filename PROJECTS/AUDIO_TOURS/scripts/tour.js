
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


// AUDIO PLAYER ----------

// Retrieve DOM elements for the audio player, progress bar, and time display
const tourAudio = document.getElementById('tourAudio');
const tourChapterTitle = document.getElementById('tourChapterTitle');
const tourProgressSlider = document.getElementById('tourProgressSlider');
const tourCurrentTimeEl = document.getElementById('tourCurrentTimeEl');
const tourTotalTimeEl = document.getElementById('tourTotalTimeEl');

const tourChaptersList = document.getElementById('tourChaptersList');

// Retrieve DOM elements for playback controls
const tourPrevChapterButton = document.getElementById('tourPrevChapterButton');
const tourBack10Button = document.getElementById('tourBack10Button');
const tourPlayPauseButton = document.getElementById('tourPlayPauseButton');
const tourForward10Button = document.getElementById('tourForward10Button');
const tourNextChapterButton = document.getElementById('tourNextChapterButton');

// Access the <img> tag inside the play/pause button
const playPauseIcon = tourPlayPauseButton.querySelector('img');

// Paths to play and pause icons
const playIconSrc = 'assets/play_icon.svg';
const pauseIconSrc = 'assets/pause_icon.svg';

// Extract chapters data from HTML data attribute
const chapters = JSON.parse(tourChaptersList.dataset.chapters);

// Track the current chapter index
let currentChapter = 0;

// Get all chapter card elements
const chapterCards = document.querySelectorAll('.tourChaptersCard');

// Function to update chapter based on current audio time
function updateChapter(currentTime) {
    for (let i = 0; i < chapters.length; i++) {
        // Check if current time is within the range of a chapter
        if (currentTime >= chapters[i].start && (i === chapters.length - 1 || currentTime < chapters[i + 1].start)) {
            if (i !== currentChapter) {  // Only update if chapter changes
                currentChapter = i;
                tourChapterTitle.textContent = chapters[i].title;  // Update chapter title

                // Reset all chapter icons to inactive
                chapterCards.forEach((card) => {
                    const chapterIcon = card.querySelector('img');
                    chapterIcon.src = 'assets/chapter_inactive_icon.svg';  // Set to inactive icon
                });

                // Set the active icon for the current chapter
                const activeIcon = chapterCards[i].querySelector('img');
                activeIcon.src = 'assets/chapter_active_icon.svg';  // Set to active icon

                // Scroll the active chapter card into view
                chapterCards[i].scrollIntoView({ behavior: 'smooth', block: 'center' }); // Smooth scrolling
            }
            break;
        }
    }
}

// Function to format time as minutes:seconds
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to load a chapter by index
function loadChapter(index) {
    // Reset all chapter icons to inactive
    chapterCards.forEach((card) => {
        const chapterIcon = card.querySelector('img');
        chapterIcon.src = 'assets/chapter_inactive_icon.svg';  // Set inactive icon
    });

    // Set active icon for the selected chapter
    const activeIcon = chapterCards[index].querySelector('img');
    activeIcon.src = 'assets/chapter_active_icon.svg';  // Set active icon

    // Set audio to start at the chapter's start time
    const chapter = chapters[index];
    tourAudio.currentTime = chapter.start;
    tourChapterTitle.textContent = chapter.title;  // Update chapter title display
    currentChapter = index;  // Update current chapter index

    // Scroll the active chapter card into view
    chapterCards[index].scrollIntoView({ behavior: 'smooth', block: 'center' }); // Smooth scrolling
}

// Add click event listeners to each chapter card
chapterCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        loadChapter(index);  // Load the corresponding chapter on click
    });
});

// Toggle play/pause functionality
tourPlayPauseButton.addEventListener('click', () => {
    if (tourAudio.paused) {
        tourAudio.play();
    } else {
        tourAudio.pause();
    }
});

// Update audio progress and chapter as the audio plays
tourAudio.addEventListener('timeupdate', () => {
    const currentTime = tourAudio.currentTime;
    const duration = tourAudio.duration;

    // Calculate and update the progress percentage
    const progressPercent = (currentTime / duration) * 100;
    tourProgressSlider.style.setProperty('--progress', `${progressPercent}%`);
    tourProgressSlider.value = progressPercent;

    // Update current time and total duration display
    tourCurrentTimeEl.textContent = formatTime(currentTime);
    tourTotalTimeEl.textContent = formatTime(duration);

    // Update the active chapter
    updateChapter(currentTime);
});

// Ensure the total time and current time are displayed as soon as metadata is loaded
tourAudio.addEventListener('loadedmetadata', () => {
    // Set the initial current time and total duration
    const duration = tourAudio.duration;
    tourCurrentTimeEl.textContent = formatTime(0); // Set current time to 0:00
    tourTotalTimeEl.textContent = formatTime(duration); // Set the total time
});

// Load the first chapter by default when the page loads
window.addEventListener('load', () => {
    loadChapter(0); // Load the first chapter
});

// Handle progress bar interaction (seeking)
tourProgressSlider.addEventListener('input', () => {
    const duration = tourAudio.duration;
    const seekTime = (tourProgressSlider.value / 100) * duration;
    tourAudio.currentTime = seekTime;  // Seek to new time

    // Update chapter based on seek time
    updateChapter(seekTime);
});

// Next Chapter Button functionality
tourNextChapterButton.addEventListener('click', () => {
    if (currentChapter < chapters.length - 1) {
        currentChapter++;
        loadChapter(currentChapter);
    }
});

// Previous Chapter Button functionality
tourPrevChapterButton.addEventListener('click', () => {
    if (currentChapter > 0) {
        currentChapter--;
        loadChapter(currentChapter);
    }
});

// Skip Forward/Backward 10 Seconds functionality
tourForward10Button.addEventListener('click', () => {
    tourAudio.currentTime += 10;  // Skip forward 10 seconds
});

tourBack10Button.addEventListener('click', () => {
    tourAudio.currentTime -= 10;  // Skip backward 10 seconds
});

// Event listener for when audio playback ends
tourAudio.addEventListener('ended', () => {
    playPauseIcon.src = playIconSrc;  // Revert to play icon when audio finishes
});

// Listen for when the audio starts playing
tourAudio.addEventListener('playing', () => {
    playPauseIcon.src = pauseIconSrc;  // Update icon to pause when audio plays
});

// Listen for when the audio is paused (including external pause actions)
tourAudio.addEventListener('pause', () => {
    playPauseIcon.src = playIconSrc;  // Update icon to play when audio pauses
});


// MAP ----------

// Initialize Panzoom on the image
const elem = document.getElementById('mapContent');
const panzoom = Panzoom(elem, {
    maxScale: 5, // Maximum zoom level
    contain: 'outside', // Allow panning outside the initial container bounds
    step: 1,
});

// Enable mousewheel zoom
elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);


// SCRIPT ----------

// Load DOCX ----------
 function loadDocx() {
    const docxContent = document.getElementById('docxContent');
    
    if (docxContent && docxContent.dataset.docx) {
        const docxFile = docxContent.dataset.docx;
        fetch(docxFile)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                // Convert the DOCX to HTML using Mammoth
                mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                    .then(result => {
                        let html = result.value;
                        
                        // Add a <br> after each <p> tag to ensure a break after each paragraph
                        html = addLineBreakAfterParagraphs(html);
                        
                        // Set the processed HTML into the content element
                        docxContent.innerHTML = html;
                    })
                    .catch(err => console.error("Error during docx conversion:", err));
            })
            .catch(err => console.error("Error fetching docx file:", err));
    }
}

// Function to add a <br> after each <p> tag
function addLineBreakAfterParagraphs(html) {
    // Use a regular expression to match closing </p> tags and append a <br> after each
    return html.replace(/<\/p>/g, '</p><br>');
}

// Load the DOCX file when the page loads
window.onload = loadDocx;