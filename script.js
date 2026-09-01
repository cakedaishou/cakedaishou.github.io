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

const randomSubtitle =
    subtitles[Math.floor(Math.random() * subtitles.length)];

const subtitleElement = document.getElementById("random-subtitle");

if (subtitleElement) {
    subtitleElement.textContent = randomSubtitle;
}
