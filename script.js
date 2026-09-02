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


/* ============================= */
/* SET FILTERS + SEARCH */
/* ============================= */

if (document.body.classList.contains("sets-page")) {

    const filterButtons = document.querySelectorAll(".filter");
    const searchInput = document.querySelector(".search-wrapper input");
    const setCards = document.querySelectorAll(".set-card");

    const setCount = document.querySelector(".set-count span");

    const allFilter = document.querySelector(".filter:nth-child(1)");
    const winsFilter = document.querySelector(".filter:nth-child(2)");
    const lossesFilter = document.querySelector(".filter:nth-child(3)");

    const setsList = document.querySelector(".sets-list");


    let currentFilter = "all";


    /*
     * Empty state used when a filter/search
     * produces no results.
     */

    const noResults = document.createElement("div");

    noResults.className = "empty-state";
    noResults.innerHTML = `
        <div class="empty-icon">—</div>
        <h3>nothing here yet</h3>
        <p>no sets match what you're looking for.</p>
    `;

    noResults.style.display = "none";

    if (setsList) {
        setsList.appendChild(noResults);
    }


    function updateFilters() {

        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;
        let winCount = 0;
        let lossCount = 0;


        setCards.forEach(function (card) {

            const resultElement =
                card.querySelector(".set-result");

            const opponentElement =
                card.querySelector(".set-opponent strong");


            const result =
                resultElement
                    ? resultElement.textContent.trim().toLowerCase()
                    : "";

            const opponent =
                opponentElement
                    ? opponentElement.textContent.trim().toLowerCase()
                    : "";


            if (result === "win") {
                winCount++;
            }

            if (result === "loss") {
                lossCount++;
            }


            const matchesFilter =
                currentFilter === "all" ||
                result === currentFilter;


            const matchesSearch =
                !searchTerm ||
                opponent.includes(searchTerm);


            const shouldShow =
                matchesFilter && matchesSearch;


            card.style.display =
                shouldShow ? "" : "none";


            if (shouldShow) {
                visibleCount++;
            }

        });


        /*
         * Update filter numbers
         */

        if (allFilter) {
            const count = allFilter.querySelector("span");

            if (count) {
                count.textContent = setCards.length;
            }
        }

        if (winsFilter) {
            const count = winsFilter.querySelector("span");

            if (count) {
                count.textContent = winCount;
            }
        }

        if (lossesFilter) {
            const count = lossesFilter.querySelector("span");

            if (count) {
                count.textContent = lossCount;
            }
        }


        /*
         * Update set count
         */

        if (setCount) {

            setCount.textContent =
                visibleCount === 1
                    ? "1 set"
                    : `${visibleCount} sets`;

        }


        /*
         * Show empty state only when
         * nothing matches.
         */

        if (noResults) {

            noResults.style.display =
                visibleCount === 0
                    ? "flex"
                    : "none";

        }

    }


    /*
     * Filter buttons
     */

    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const text =
                    button.textContent
                        .trim()
                        .toLowerCase();

                currentFilter = text;


                filterButtons.forEach(
                    function (filter) {
                        filter.classList.remove("active");
                    }
                );

                button.classList.add("active");

                updateFilters();

            }
        );

    });


    /*
     * Search
     */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {
                updateFilters();
            }
        );

    }


    /*
     * Initial state
     */

    updateFilters();

}
