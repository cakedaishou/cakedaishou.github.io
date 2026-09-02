const SUPABASE_URL = "https://vokvtguinvrcignimxnz.supabase.co";
const SUPABASE_KEY = "sb_publishable_unLqx7_o_zlF0bTWtfOgZg_qqJ55uNb";

let supabaseClient = null;

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

let statTimers = {
    sets: null,
    wl: null
};

let lastStats = {
    sets: null,
    wins: null,
    losses: null,
    roundsWon: null,
    roundsLost: null
};

window.allSets = [];


/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", () => {
    startApp();
});

async function startApp() {
    setupTypewriter();
    setupModals();
    setupFilters();
    setupSearch();
    setupAddSetForm();
    setupDateInput();

    if (!window.supabase) {
        console.error("Supabase library failed to load.");
        showLoadingError("supabase failed to load");
        return;
    }

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    setupAuth();

    await updateAuthUI();
    await loadSets();
}


/* =========================
   TYPEWRITER
========================= */

function setupTypewriter() {
    const element = document.getElementById("random-subtitle");

    if (!element) {
        return;
    }

    const isSetsPage =
        document.body.classList.contains("sets-page");

    const text = isSetsPage
        ? "every fight and every score"
        : subtitles[
            Math.floor(Math.random() * subtitles.length)
        ];

    element.textContent = "";
    element.style.opacity = "1";

    let index = 0;

    function typeNextCharacter() {
        if (index >= text.length) {
            return;
        }

        element.textContent += text[index];
        index++;

        setTimeout(typeNextCharacter, 38);
    }

    setTimeout(typeNextCharacter, 450);
}


/* =========================
   MODALS
========================= */

function setupModals() {
    const loginButton =
        document.getElementById("login-button");

    const addSetButton =
        document.getElementById("add-set-button");

    if (loginButton) {
        loginButton.addEventListener("click", () => {
            openModal("login-modal");
        });
    }

    if (addSetButton) {
        addSetButton.addEventListener("click", () => {
            openModal("add-set-modal");
        });
    }

    document
        .querySelectorAll("[data-close-modal]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const modal =
                    button.closest(".modal-backdrop");

                if (modal) {
                    closeModal(modal.id);
                }
            });
        });

    document
        .querySelectorAll(".modal-backdrop")
        .forEach((backdrop) => {
            backdrop.addEventListener("click", (event) => {
                if (event.target === backdrop) {
                    closeModal(backdrop.id);
                }
            });
        });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        document
            .querySelectorAll(".modal-backdrop.open")
            .forEach((modal) => {
                closeModal(modal.id);
            });
    });
}

function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
        console.error(`Modal not found: ${id}`);
        return;
    }

    modal.classList.add("open");
    document.body.classList.add("modal-open");
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
        return;
    }

    modal.classList.remove("open");

    if (!document.querySelector(".modal-backdrop.open")) {
        document.body.classList.remove("modal-open");
    }
}


/* =========================
   AUTH
========================= */

function setupAuth() {
    const loginForm =
        document.getElementById("login-form");

    const logoutButton =
        document.getElementById("logout-button");

    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            handleLogin
        );
    }

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            handleLogout
        );
    }

    if (!supabaseClient) {
        return;
    }

    supabaseClient.auth.onAuthStateChange(() => {
        setTimeout(() => {
            updateAuthUI();
            loadSets();
        }, 0);
    });
}

async function updateAuthUI() {
    if (!supabaseClient) {
        return;
    }

    const loginButton =
        document.getElementById("login-button");

    const ownerTools =
        document.getElementById("owner-tools");

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(
            "Could not get session:",
            error
        );
        return;
    }

    if (session) {
        if (loginButton) {
            loginButton.style.display = "none";
        }

        if (ownerTools) {
            ownerTools.style.display = "flex";
        }
    } else {
        if (loginButton) {
            loginButton.style.display = "inline-flex";
        }

        if (ownerTools) {
            ownerTools.style.display = "none";
        }
    }
}

async function handleLogin(event) {
    event.preventDefault();

    if (!supabaseClient) {
        return;
    }

    const emailInput =
        document.getElementById("login-email");

    const passwordInput =
        document.getElementById("login-password");

    const errorElement =
        document.getElementById("login-error");

    const submitButton =
        event.submitter;

    if (!emailInput || !passwordInput) {
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (errorElement) {
        errorElement.textContent = "";
    }

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "signing in...";
    }

    const { error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        console.error(
            "Login failed:",
            error
        );

        if (errorElement) {
            errorElement.textContent =
                error.message;
        }

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "sign in";
        }

        return;
    }

    document
        .getElementById("login-form")
        ?.reset();

    closeModal("login-modal");

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "sign in";
    }
}

async function handleLogout() {
    if (!supabaseClient) {
        return;
    }

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        console.error(
            "Logout failed:",
            error
        );
        return;
    }

    await updateAuthUI();
    await loadSets();
}


/* =========================
   LOAD SETS
========================= */

async function loadSets() {
    if (!supabaseClient) {
        return;
    }

    const list =
        document.getElementById("sets-list");

    const { data, error } =
        await supabaseClient
            .from("sets")
            .select("*")
            .order("played_at", {
                ascending: false
            })
            .order("created_at", {
                ascending: false
            });

    if (error) {
        console.error(
            "Could not load sets:",
            error
        );

        if (list) {
            showLoadingError(
                "couldn't load the archive"
            );
        }

        return;
    }

    window.allSets = data || [];

    /*
        IMPORTANT:

        The homepage does not have a #sets-list,
        so stats must be updated regardless of
        which page we're currently on.
    */

    updateStats(window.allSets);

    if (list) {
        updateFilterCounts(window.allSets);
        renderSets();
    }
}


/* =========================
   RENDER SETS
========================= */

function renderSets() {
    const list =
        document.getElementById("sets-list");

    if (!list) {
        return;
    }

    const searchInput =
        document.querySelector(
            ".search-wrapper input"
        );

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    const activeFilter =
        document.querySelector(
            ".filter.active"
        )?.dataset.filter || "all";

    const allSets =
        window.allSets || [];

    let filtered = allSets;

    if (activeFilter !== "all") {
        filtered = filtered.filter(
            (set) =>
                set.result === activeFilter
        );
    }

    if (searchTerm) {
        filtered = filtered.filter((set) => {
            return [
                set.opponent,
                set.result,
                set.format,
                set.character,
                set.played_at
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchTerm)
                );
        });
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">—</div>
                <h3>
                    ${
                        allSets.length
                            ? "nothing found"
                            : "no sets yet"
                    }
                </h3>
                <p>
                    ${
                        allSets.length
                            ? "try another search or filter..."
                            : "the archive is empty for now..."
                    }
                </p>
            </div>
        `;

        updateSetCount(0);
        return;
    }

    list.innerHTML = filtered
        .map((set) => createSetCard(set))
        .join("");

    updateSetCount(
        filtered.length
    );
}

function createSetCard(set) {
    const opponent =
        escapeHtml(
            set.opponent || "unknown"
        );

    const result =
        escapeHtml(
            set.result || ""
        );

    const format =
        escapeHtml(
            set.format || "—"
        );

    const character =
        escapeHtml(
            set.character || "—"
        );

    const playerScore =
        Number.isFinite(
            Number(set.player_score)
        )
            ? Number(set.player_score)
            : 0;

    const opponentScore =
        Number.isFinite(
            Number(set.opponent_score)
        )
            ? Number(set.opponent_score)
            : 0;

    const playedAt =
        set.played_at
            ? formatDate(set.played_at)
            : "—";

    const resultLabel =
        result === "win"
            ? "win"
            : "loss";

    return `
        <article class="set-card">

            <div class="set-card-top">

                <div class="set-opponent">
                    <span>vs</span>
                    <strong>
                        ${opponent}
                    </strong>
                </div>

                <div class="set-result ${resultLabel}">
                    ${resultLabel}
                </div>

            </div>

            <div class="set-score">
                ${playerScore}
                <span>—</span>
                ${opponentScore}
            </div>

            <div class="set-card-details">

                <div class="set-detail">
                    <span>format</span>
                    <strong>${format}</strong>
                </div>

                <div class="set-detail">
                    <span>character</span>
                    <strong>${character}</strong>
                </div>

                <div class="set-detail">
                    <span>date</span>
                    <strong>${playedAt}</strong>
                </div>

            </div>

        </article>
    `;
}


/* =========================
   FILTERS
========================= */

function setupFilters() {
    document
        .querySelectorAll(".filter")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".filter")
                        .forEach((filter) => {
                            filter.classList.remove(
                                "active"
                            );
                        });

                    button.classList.add(
                        "active"
                    );

                    renderSets();
                }
            );

        });
}

function updateFilterCounts(sets) {
    const allButton =
        document.querySelector(
            '.filter[data-filter="all"] span'
        );

    const winButton =
        document.querySelector(
            '.filter[data-filter="win"] span'
        );

    const lossButton =
        document.querySelector(
            '.filter[data-filter="loss"] span'
        );

    if (allButton) {
        allButton.textContent =
            sets.length;
    }

    if (winButton) {
        winButton.textContent =
            sets.filter(
                (set) =>
                    set.result === "win"
            ).length;
    }

    if (lossButton) {
        lossButton.textContent =
            sets.filter(
                (set) =>
                    set.result === "loss"
            ).length;
    }
}


/* =========================
   SEARCH
========================= */

function setupSearch() {
    const input =
        document.querySelector(
            ".search-wrapper input"
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        () => {
            renderSets();
        }
    );
}


/* =========================
   ADD SET
========================= */

function setupAddSetForm() {
    const form =
        document.getElementById(
            "add-set-form"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        handleAddSet
    );
}

async function handleAddSet(event) {
    event.preventDefault();

    if (!supabaseClient) {
        return;
    }

    const errorElement =
        document.getElementById(
            "add-set-error"
        );

    const submitButton =
        event.submitter;

    const opponent =
        document
            .getElementById("set-opponent")
            ?.value.trim();

    const result =
        document
            .getElementById("set-result")
            ?.value;

    const format =
        document
            .getElementById("set-format")
            ?.value.trim();

    const playerScore =
        Number(
            document
                .getElementById(
                    "set-player-score"
                )
                ?.value
        );

    const opponentScore =
        Number(
            document
                .getElementById(
                    "set-opponent-score"
                )
                ?.value
        );

    const character =
        document
            .getElementById("set-character")
            ?.value.trim();

    const playedAt =
        document
            .getElementById("set-date")
            ?.value;

    if (errorElement) {
        errorElement.textContent = "";
    }

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
            "saving...";
    }

    const { error } =
        await supabaseClient
            .from("sets")
            .insert({
                opponent,
                result,
                player_score: playerScore,
                opponent_score: opponentScore,
                format,
                character,
                played_at: playedAt
            });

    if (error) {
        console.error(
            "Could not add set:",
            error
        );

        if (errorElement) {
            errorElement.textContent =
                error.message;
        }

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent =
                "save set";
        }

        return;
    }

    document
        .getElementById(
            "add-set-form"
        )
        ?.reset();

    setupDateInput();

    closeModal(
        "add-set-modal"
    );

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
            "save set";
    }

    await loadSets();
}


/* =========================
   HOME STATS
========================= */

function updateStats(sets) {
    const setsElement =
        document.getElementById(
            "stat-sets"
        );

    const wlElement =
        document.getElementById(
            "stat-record"
        );

    const winrateElement =
        document.getElementById(
            "stat-winrate"
        );

    const roundsElement =
        document.getElementById(
            "stat-rounds"
        );

    /*
        No home-page class required.
        We simply update whichever
        stat elements actually exist.
    */

    const wins =
        sets.filter(
            (set) =>
                set.result === "win"
        ).length;

    const losses =
        sets.filter(
            (set) =>
                set.result === "loss"
        ).length;

    const roundsWon =
        sets.reduce(
            (total, set) => {

                const score =
                    Number(
                        set.player_score
                    );

                return total + (
                    Number.isFinite(score)
                        ? score
                        : 0
                );
            },
            0
        );

    const roundsLost =
        sets.reduce(
            (total, set) => {

                const score =
                    Number(
                        set.opponent_score
                    );

                return total + (
                    Number.isFinite(score)
                        ? score
                        : 0
                );
            },
            0
        );


    /* =========================
       SETS
    ========================= */

    if (setsElement) {

        if (
            lastStats.sets !==
            sets.length
        ) {

            animateSetNumber(
                setsElement,
                sets.length
            );

            lastStats.sets =
                sets.length;
        }
    }


    /* =========================
       W / L
    ========================= */

    if (wlElement) {

        if (
            lastStats.wins !== wins ||
            lastStats.losses !== losses
        ) {

            typeStatistic(
                wlElement,
                `${wins} - ${losses}`
            );

            lastStats.wins = wins;
            lastStats.losses = losses;
        }
    }


    /* =========================
       WINRATE
    ========================= */

    if (winrateElement) {

        if (sets.length === 0) {

            winrateElement.textContent =
                
