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
const titleElement = document.querySelector(".brand h1, .sets-title h1");


function getRandomSubtitle() {
    return subtitles[
        Math.floor(Math.random() * subtitles.length)
    ];
}


function typeSubtitle(text) {

    if (!subtitleElement) return;

    subtitleElement.textContent = "";

    subtitleElement.classList.remove("finished");
    subtitleElement.classList.add("typing");

    let index = 0;


    function typeNextCharacter() {

        if (index < text.length) {

            const character = text[index];

            subtitleElement.textContent += character;

            index++;


            let typingSpeed = 42;


            if (
                character === "." ||
                character === "!" ||
                character === "?"
            ) {
                typingSpeed = 180;
            }


            setTimeout(
                typeNextCharacter,
                typingSpeed
            );

        } else {

            subtitleElement.classList.remove("typing");
            subtitleElement.classList.add("finished");

        }
    }


    typeNextCharacter();
}


function startSubtitleAnimation() {

    if (!subtitleElement) return;


    /*
     * Sets page
     */

    if (
        document.body.classList.contains("sets-page")
    ) {

        subtitleElement.style.opacity = "1";

        typeSubtitle(
            "every fight and every score"
        );

        return;
    }


    /*
     * Home page
     */

    subtitleElement.style.opacity = "1";

    typeSubtitle(
        getRandomSubtitle()
    );
}


/*
 * Wait until the title finishes fading in.
 * Then begin typing the subtitle.
 */

if (titleElement && subtitleElement) {

    titleElement.addEventListener(
        "animationend",
        function (event) {

            if (
                event.animationName === "titleFadeIn"
            ) {

                startSubtitleAnimation();

            }

        },
        { once: true }
    );

} else if (subtitleElement) {

    startSubtitleAnimation();

}
