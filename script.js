/* ============================= */
/* SUPABASE */
/* ============================= */

const SUPABASE_URL =
    "https://vokvtguinvrcignimxnz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_unLqx7_o_zlF0bTWtfOgZg_qqJ55uNb";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* ============================= */
/* SUBTITLES */
/* ============================= */

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


const subtitleElement =
    document.getElementById("random-subtitle");

const titleElement =
    document.querySelector(
        ".brand h1, .sets-title h1"
    );


function getRandomSubtitle() {

    return subtitles[
        Math.floor(
            Math.random() * subtitles.length
        )
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

            const character =
                text[index];

            subtitleElement.textContent +=
                character;

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

            subtitleElement.classList.remove(
                "typing"
            );

            subtitleElement.classList.add(
                "finished"
            );

        }

    }


    typeNextCharacter();

}


function startSubtitleAnimation() {

    if (!subtitleElement) return;


    if (
        document.body.classList.contains(
            "sets-page"
        )
    ) {

        subtitleElement.style.opacity = "1";

        typeSubtitle(
            "every fight and every score"
        );

        return;
    }


    subtitleElement.style.opacity = "1";

    typeSubtitle(
        getRandomSubtitle()
    );

}


if (titleElement && subtitleElement) {

    titleElement.addEventListener(
        "animationend",
        function (event) {

            if (
                event.animationName ===
                "titleFadeIn"
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
/* HELPERS */
/* ============================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function formatDate(dateString) {

    if (!dateString) return "—";

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function getToday() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ============================= */
/* LOAD ALL SETS */
/* ============================= */

async function fetchSets() {

    const {
        data,
        error
    } = await supabaseClient
        .from("sets")
        .select("*")
        .order(
            "played_at",
            {
                ascending: false
            }
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Failed to load sets:",
            error
        );

        return {
            data: [],
            error
        };

    }


    return {
        data: data || [],
        error: null
    };

}


/* ============================= */
/* HOME PAGE */
/* ============================= */

async function loadHomePage() {

    const statSets =
        document.getElementById(
            "stat-sets"
        );

    if (!statSets) return;


    const {
        data: sets,
        error
    } = await fetchSets();


    if (error) return;


    const totalSets =
        sets.length;


    const wins =
        sets.filter(
            set =>
                set.result === "win"
        ).length;


    const losses =
        sets.filter(
            set =>
                set.result === "loss"
        ).length;


    let playerRounds = 0;
    let opponentRounds = 0;


    sets.forEach(function (set) {

        playerRounds +=
            Number(
                set.player_score || 0
            );

        opponentRounds +=
            Number(
                set.opponent_score || 0
            );

    });


    statSets.textContent =
        totalSets;


    const recordElement =
        document.getElementById(
            "stat-record"
        );

    if (recordElement) {

        recordElement.textContent =
            `${wins} - ${losses}`;

    }


    const winrateElement =
        document.getElementById(
            "stat-winrate"
        );

    if (winrateElement) {

        winrateElement.textContent =
            totalSets === 0
                ? "—"
                : `${(
                    wins / totalSets * 100
                ).toFixed(1)}%`;

    }


    const roundsElement =
        document.getElementById(
            "stat-rounds"
        );

    if (roundsElement) {

        roundsElement.textContent =
            `${playerRounds} - ${opponentRounds}`;

    }


    const recentElement =
        document.getElementById(
            "recent-activities"
        );


    if (
        recentElement &&
        sets.length > 0
    ) {

        const recent =
            sets.slice(0, 3);


        recentElement.innerHTML =
            recent.map(
                function (set) {

                    const resultClass =
                        set.result === "win"
                            ? "win"
                            : "loss";


                    return `
                        <div class="recent-item">
                            <span>
                                ${escapeHTML(
                                    set.result
                                )}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    set.opponent
                                )}
                            </strong>

                            <b>
                                ${Number(
                                    set.player_score || 0
                                )}
                                —
                                ${Number(
                                    set.opponent_score || 0
                                )}
                            </b>

                            <small>
                                ${formatDate(
                                    set.played_at
                                )}
                            </small>
                        </div>
                    `;

                }
            ).join("");

    }

}


/* ============================= */
/* SETS PAGE */
/* ============================= */

if (
    document.body.classList.contains(
        "sets-page"
    )
) {

    const filterButtons =
        document.querySelectorAll(
            ".filter"
        );

    const searchInput =
        document.querySelector(
            ".search-wrapper input"
        );

    const setCount =
        document.querySelector(
            ".set-count span"
        );

    const allFilter =
        document.querySelector(
            '.filter[data-filter="all"]'
        );

    const winsFilter =
        document.querySelector(
            '.filter[data-filter="win"]'
        );

    const lossesFilter =
        document.querySelector(
            '.filter[data-filter="loss"]'
        );

    const setsList =
        document.getElementById(
            "sets-list"
        );

    const loadingState =
        document.getElementById(
            "sets-loading"
        );


    let allSets = [];

    let currentFilter = "all";


    const noResults =
        document.createElement(
            "div"
        );

    noResults.className =
        "empty-state";

    noResults.innerHTML = `
        <div class="empty-icon">—</div>
        <h3>nothing here yet</h3>
        <p>no sets match what you're looking for.</p>
    `;

    noResults.style.display =
        "none";


    if (setsList) {
        setsList.appendChild(
            noResults
        );
    }


    function renderSets() {

        if (!setsList) return;


        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const filteredSets =
            allSets.filter(
                function (set) {

                    const result =
                        String(
                            set.result || ""
                        ).toLowerCase();


                    const opponent =
                        String(
                            set.opponent || ""
                        ).toLowerCase();


                    const format =
                        String(
                            set.format || ""
                        ).toLowerCase();


                    const character =
                        String(
                            set.character || ""
                        ).toLowerCase();


                    const matchesFilter =
                        currentFilter === "all" ||
                        result === currentFilter;


                    const matchesSearch =
                        !searchTerm ||
                        opponent.includes(
                            searchTerm
                        ) ||
                        format.includes(
                            searchTerm
                        ) ||
                        character.includes(
                            searchTerm
                        );


                    return (
                        matchesFilter &&
                        matchesSearch
                    );

                }
            );


        const cards =
            setsList.querySelectorAll(
                ".set-card"
            );


        cards.forEach(
            function (card) {
                card.remove();
            }
        );


        filteredSets.forEach(
            function (set) {

                const result =
                    set.result === "win"
                        ? "win"
                        : "loss";


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "set-card";


                card.innerHTML = `
                    <div class="set-card-top">

                        <div class="set-opponent">
                            <span>vs</span>

                            <strong>
                                ${escapeHTML(
                                    set.opponent
                                )}
                            </strong>
                        </div>

                        <div class="set-result ${result}">
                            ${escapeHTML(
                                set.result
                            )}
                        </div>

                    </div>


                    <div class="set-score">

                        ${Number(
                            set.player_score || 0
                        )}

                        <span>—</span>

                        ${Number(
                            set.opponent_score || 0
                        )}

                    </div>


                    <div class="set-card-details">

                        <div class="set-detail">
                            <span>format</span>
                            <strong>
                                ${escapeHTML(
                                    set.format
                                )}
                            </strong>
                        </div>


                        <div class="set-detail">
                            <span>character</span>
                            <strong>
                                ${escapeHTML(
                                    set.character
                                )}
                            </strong>
                        </div>


                        <div class="set-detail">
                            <span>date</span>
                            <strong>
                                ${formatDate(
                                    set.played_at
                                )}
                            </strong>
                        </div>

                    </div>
                `;


                setsList.insertBefore(
                    card,
                    noResults
                );

            }
        );


        const wins =
            allSets.filter(
                set =>
                    set.result === "win"
            ).length;


        const losses =
            allSets.filter(
                set =>
                    set.result === "loss"
            ).length;


        if (allFilter) {

            allFilter
                .querySelector("span")
                .textContent =
                allSets.length;

        }


        if (winsFilter) {

            winsFilter
                .querySelector("span")
                .textContent =
                wins;

        }


        if (lossesFilter) {

            lossesFilter
                .querySelector("span")
                .textContent =
                losses;

        }


        if (setCount) {

            setCount.textContent =
                filteredSets.length === 1
                    ? "1 set"
                    : `${filteredSets.length} sets`;

        }


        noResults.style.display =
            filteredSets.length === 0
                ? "flex"
                : "none";

    }


    async function loadSetsPage() {

        const {
            data,
            error
        } = await fetchSets();


        if (loadingState) {
            loadingState.remove();
        }


        if (error) {

            noResults.innerHTML = `
                <div class="empty-icon">!</div>
                <h3>couldn't load sets</h3>
                <p>something went wrong talking to the archive.</p>
            `;

            noResults.style.display =
                "flex";

            return;

        }


        allSets =
            data || [];


        renderSets();

    }


    /* ============================= */
    /* FILTERS */
    /* ============================= */

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    filterButtons.forEach(
                        function (filter) {
                            filter.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    renderSets();

                }
            );

        }
    );


    /* ============================= */
    /* SEARCH */
    /* ============================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {
                renderSets();
            }
        );

    }


    /* ============================= */
    /* AUTH UI */
/* ============================= */

    const loginButton =
        document.getElementById(
            "login-button"
        );

    const ownerTools =
        document.getElementById(
            "owner-tools"
        );

    const addSetButton =
        document.getElementById(
            "add-set-button"
        );

    const logoutButton =
        document.getElementById(
            "logout-button"
        );


    const loginModal =
        document.getElementById(
            "login-modal"
        );

    const addSetModal =
        document.getElementById(
            "add-set-modal"
        );


    const loginForm =
        document.getElementById(
            "login-form"
        );

    const addSetForm =
        document.getElementById(
            "add-set-form"
        );


    const loginError =
        document.getElementById(
            "login-error"
        );

    const addSetError =
        document.getElementById(
            "add-set-error"
        );


    function openModal(modal) {

        if (!modal) return;

        modal.classList.add(
            "open"
        );

    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove(
            "open"
        );

    }


    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        closeModal(
                            button.closest(
                                ".modal-backdrop"
                            )
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".modal-backdrop"
        )
        .forEach(
            function (backdrop) {

                backdrop.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            backdrop
                        ) {

                            closeModal(
                                backdrop
                            );

                        }

                    }
                );

            }
        );


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            function () {

                if (loginError) {
                    loginError.textContent =
                        "";
                }

                openModal(
                    loginModal
                );

            }
        );

    }


    if (addSetButton) {

        addSetButton.addEventListener(
            "click",
            function () {

                if (addSetError) {
                    addSetError.text
