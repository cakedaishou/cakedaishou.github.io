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


/* ============================= */
/* TYPEWRITER */
/* ============================= */

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

    subtitleElement.classList.remove(
        "finished"
    );

    subtitleElement.classList.add(
        "typing"
    );

    subtitleElement.style.opacity = "1";

    let index = 0;


    function typeNextCharacter() {

        if (index >= text.length) {

            subtitleElement.classList.remove(
                "typing"
            );

            subtitleElement.classList.add(
                "finished"
            );

            return;
        }


        const character =
            text[index];


        subtitleElement.textContent +=
            character;


        index++;


        let speed = 58;


        if (
            character === "." ||
            character === "!" ||
            character === "?"
        ) {

            speed = 220;

        }


        setTimeout(
            typeNextCharacter,
            speed
        );

    }


    typeNextCharacter();

}


function startSubtitleAnimation() {

    if (!subtitleElement) return;


    subtitleElement.style.opacity = "0";

    subtitleElement.textContent = "";

    subtitleElement.classList.remove(
        "typing",
        "finished"
    );


    setTimeout(
        function () {

            const text =
                document.body.classList.contains(
                    "sets-page"
                )
                    ? "every fight and every score"
                    : getRandomSubtitle();


            typeSubtitle(text);

        },
        150
    );

}


/*
 * Start predictably instead of depending
 * on animationend firing.
 */

if (
    titleElement &&
    subtitleElement
) {

    setTimeout(
        startSubtitleAnimation,
        850
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


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

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

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* ============================= */
/* FETCH SETS */
/* ============================= */

async function fetchSets() {

    const {
        data,
        error
    } =
        await supabaseClient
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


    return {
        data: data || [],
        error: error || null
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
    } =
        await fetchSets();


    if (error) {

        console.error(
            "Failed to load homepage:",
            error
        );

        return;
    }


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


    sets.forEach(
        function (set) {

            playerRounds +=
                Number(
                    set.player_score || 0
                );


            opponentRounds +=
                Number(
                    set.opponent_score || 0
                );

        }
    );


    statSets.textContent =
        totalSets;


    const record =
        document.getElementById(
            "stat-record"
        );


    if (record) {

        record.textContent =
            `${wins} - ${losses}`;

    }


    const winrate =
        document.getElementById(
            "stat-winrate"
        );


    if (winrate) {

        winrate.textContent =
            totalSets === 0
                ? "—"
                : `${(
                    wins /
                    totalSets *
                    100
                ).toFixed(1)}%`;

    }


    const rounds =
        document.getElementById(
            "stat-rounds"
        );


    if (rounds) {

        rounds.textContent =
            `${playerRounds} - ${opponentRounds}`;

    }


    const recent =
        document.getElementById(
            "recent-activities"
        );


    if (
        recent &&
        sets.length > 0
    ) {

        recent.innerHTML =
            sets
                .slice(0, 3)
                .map(
                    function (set) {

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
                )
                .join("");

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


    const setDate =
        document.getElementById(
            "set-date"
        );


    let allSets = [];

    let currentFilter = "all";


    /* ============================= */
    /* EMPTY RESULT */
    /* ============================= */

    const noResults =
        document.createElement(
            "div"
        );


    noResults.className =
        "empty-state";


    noResults.innerHTML = `
        <div class="empty-icon">—</div>

        <h3>
            nothing here yet
        </h3>

        <p>
            no sets match what you're looking for.
        </p>
    `;


    noResults.style.display =
        "none";


    if (setsList) {

        setsList.appendChild(
            noResults
        );

    }


    /* ============================= */
    /* MODALS */
    /* ============================= */

    function openModal(modal) {

        if (!modal) return;

        modal.classList.add(
            "open"
        );

        document.body.classList.add(
            "modal-open"
        );

    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove(
            "open"
        );


        if (
            !document.querySelector(
                ".modal-backdrop.open"
            )
        ) {

            document.body.classList.remove(
                "modal-open"
            );

        }

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


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal-backdrop.open"
                    )
                    .forEach(
                        function (modal) {

                            closeModal(
                                modal
                            );

                        }
                    );

            }

        }
    );


    /* ============================= */
    /* AUTH UI */
    /* ============================= */

    function updateAuthUI(session) {

        const loggedIn =
            Boolean(session);


        if (loginButton) {

            loginButton.style.display =
                loggedIn
                    ? "none"
                    : "inline-flex";

        }


        if (ownerTools) {

            ownerTools.style.display =
                loggedIn
                    ? "flex"
                    : "none";

        }

    }


    /* ============================= */
    /* AUTH STATE */
    /* ============================= */

    supabaseClient.auth.onAuthStateChange(
        function (_event, session) {

            setTimeout(
                function () {

                    updateAuthUI(
                        session
                    );

                },
                0
            );

        }
    );


    async function loadAuthState() {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Auth error:",
                error
            );

            updateAuthUI(
                null
            );

            return;

        }


        updateAuthUI(
            data.session
        );

    }


    /* ============================= */
    /* RENDER SETS */
    /* ============================= */

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


        setsList
            .querySelectorAll(
                ".set-card"
            )
            .forEach(
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

                            <span>
                                vs
                            </span>

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

                        <span>
                            —
                        </span>

                        ${Number(
                            set.opponent_score || 0
                        )}

                    </div>


                    <div class="set-card-details">

                        <div class="set-detail">

                            <span>
                                format
                            </span>

                            <strong>
                                ${escapeHTML(
                                    set.format
                                )}
                            </strong>

                        </div>


                        <div class="set-detail">

                            <span>
                                character
                            </span>

                            <strong>
                                ${escapeHTML(
                                    set.character
                                )}
                            </strong>

                        </div>


                        <div class="set-detail">

                            <span>
                                date
                            </span>

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
            ).len
