const subtitles = [
    "la peace man",
    "we ball",
    "taking it easy",
    "nothing serious",
    "we moving",
    "putting in work",
    "by the 9 we tweaking",
    "for the archives",
    "whats up yo..",
    "what is this shit even",
    "probably should be training",
    "what am i doing bro",
    "could've been worse",
    "don't ask",
    "i fw furries",
    "just keeping track",
    "another one for the books",
    "tsb activities",
    "numbers unfortunately",
    "yeah we did this",
    "professional keyboard masher",
    "fishnets>>thigh socks"
];

const subtitleElement = document.getElementById("random-subtitle");
const titleElement = document.querySelector(".brand h1");

function getRandomSubtitle() {
    return subtitles[Math.floor(Math.random() * subtitles.length)];
}

function typeSubtitle(text) {
    if (!subtitleElement) return;

    subtitleElement.textContent = "";
    subtitleElement.classList.remove("finished");
    subtitleElement.classList.add("typing");

    let index = 0;

    const typingSpeed = 42;

    function typeNextCharacter() {
        if (index < text.length) {
            subtitleElement.textContent += text[index];
            index++;

            setTimeout(typeNextCharacter, typingSpeed);
        } else {
            subtitleElement.classList.remove("typing");
            subtitleElement.classList.add("finished");
        }
    }

    typeNextCharacter();
}

function startSubtitleAnimation() {
    if (!subtitleElement) return;

    const randomSubtitle = getRandomSubtitle();

    subtitleElement.style.opacity = "1";

    typeSubtitle(randomSubtitle);
}


/*
 * Wait until "Cake's Feats" finishes fading in.
 * The randomized subtitle starts immediately afterward.
 */

if (titleElement && subtitleElement) {
    titleElement.addEventListener(
        "animationend",
        (event) => {
            if (event.animationName === "titleFadeIn") {
                startSubtitleAnimation();
            }
        },
        { once: true }
    );
} else if (subtitleElement) {
    startSubtitleAnimation();
}
