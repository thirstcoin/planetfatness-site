document.addEventListener("DOMContentLoaded", function () {
    console.log("Game Loaded");

    const BACKEND_URL = "https://planetfatness-backend.onrender.com";
    const DEFAULT_TEST_WAGER = 1000;

    const container = document.getElementById("game-container");
    const status = document.getElementById("status");
    const multiplierDisplay = document.getElementById("multiplier-display");
    const poisonOverlay = document.getElementById("poison-overlay");
    const poisonVideo = document.getElementById("poison-video");

    const winOverlay = document.getElementById("win-overlay");
    const winVideo = document.getElementById("win-video");
    const winTitle = document.getElementById("win-title");
    const winSubtitle = document.getElementById("win-subtitle");
    const winMultiplier = document.getElementById("win-multiplier");

    const introOverlay = document.getElementById("intro-overlay");
    const introVideo = document.getElementById("intro-video");
    const startGameBtn = document.getElementById("start-game-btn");

    const cashoutButton = document.getElementById("cashout-button");

    if (!container) return;

    if (poisonVideo) poisonVideo.load();
    if (introVideo) introVideo.load();
    if (winVideo) winVideo.load();

    let multiplier = 1.0;
    const multipliers = [1.02, 1.07, 1.15, 1.30, 1.48, 1.70, 1.98, 2.28, 2.70, 3.50];
    let safeFoundCount = 0;
    let poisonIndices = [];
    let isGameOver = false;
    let hasStartedRound = false;

    let usingBackend = true;
    let usingLocalFallback = false;
    let roundId = null;
    let commitHash = "";
    let revealedServerSeed = "";
    let revealedPoisonIndices = [];
    let authToken = "";

    const hypeLines = [
        "Phil says: take another bite.",
        "Feed your greed.",
        "Phat donut secured.",
        "Calories activated.",
        "Glaze mode engaged.",
        "That one hit different.",
        "Greed is looking good on you.",
        "One more donut won't hurt.",
        "The box is paying respect.",
        "Bulk energy rising.",
        "Degen dessert unlocked.",
        "Phil is loving this run.",
        "Stack the glaze higher.",
        "This box wants action.",
        "You're cooking now.",
        "Phil approves this behavior.",
        "Glaze gods are watching.",
        "The kitchen is open.",
        "Greed rewards the bold.",
        "Phil says keep stacking.",
        "Calories printing today.",
        "Donut destiny activated.",
        "That glaze looks lucky.",
        "Bulk mode engaged.",
        "The box respects confidence.",
        "Phil is feeling generous.",
        "Donuts don't lie.",
        "That's a juicy one.",
        "Greed never tasted so good.",
        "Phil says send it.",
        "That donut had aura.",
        "The glaze is blessing this run.",
        "You're heating up now.",
        "Phil would go one more.",
        "That next donut looks friendly.",
        "The box likes you today.",
        "Donut power increasing.",
        "Phil says keep cooking.",
        "That's some premium glaze.",
        "The greed is building."
    ];

    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

    const fairnessBadge = document.createElement("div");
    fairnessBadge.id = "fairness-badge";
    fairnessBadge.style.position = "absolute";
    fairnessBadge.style.top = "17%";
    fairnessBadge.style.left = "50%";
    fairnessBadge.style.transform = "translateX(-50%)";
    fairnessBadge.style.zIndex = "550";
    fairnessBadge.style.padding = "6px 10px";
    fairnessBadge.style.borderRadius = "999px";
    fairnessBadge.style.background = "rgba(0,0,0,0.45)";
    fairnessBadge.style.color = "#fff";
    fairnessBadge.style.fontSize = "12px";
    fairnessBadge.style.fontWeight = "700";
    fairnessBadge.style.letterSpacing = "0.3px";
    fairnessBadge.style.textShadow = "0 1px 6px rgba(0,0,0,0.8)";
    fairnessBadge.style.pointerEvents = "none";
    fairnessBadge.style.maxWidth = "88vw";
    fairnessBadge.style.whiteSpace = "nowrap";
    fairnessBadge.style.overflow = "hidden";
    fairnessBadge.style.textOverflow = "ellipsis";
    fairnessBadge.innerText = "Preparing round...";
    document.body.appendChild(fairnessBadge);

    function shortHash(str) {
        if (!str) return "";
        return str.length > 12 ? `${str.slice(0, 10)}…` : str;
    }

    function getRandomHypeLine() {
        return hypeLines[Math.floor(Math.random() * hypeLines.length)];
    }

    function setFairnessBadge(text) {
        fairnessBadge.innerText = text;
    }

    function getAuthToken() {
        const url = new URL(window.location.href);
        const tokenFromQuery = url.searchParams.get("t");

        if (tokenFromQuery) {
            try {
                localStorage.setItem("pf_token", tokenFromQuery);
            } catch (e) {
                console.warn("Could not persist token:", e);
            }
            return tokenFromQuery;
        }

        try {
            return (
                localStorage.getItem("pf_token") ||
                localStorage.getItem("authToken") ||
                ""
            );
        } catch {
            return "";
        }
    }

    function seedLocalFallbackPoisons() {
        poisonIndices = [];
        while (poisonIndices.length < 2) {
            let rand = Math.floor(Math.random() * 12);
            if (!poisonIndices.includes(rand)) poisonIndices.push(rand);
        }
    }

    function switchToLocalFallback(reason = "") {
        if (usingLocalFallback) return;
        usingBackend = false;
        usingLocalFallback = true;
        roundId = null;
        commitHash = "";
        revealedServerSeed = "";
        revealedPoisonIndices = [];
        seedLocalFallbackPoisons();
        setFairnessBadge(reason ? `Demo Mode • ${reason}` : "Demo Mode • Local logic");
        console.warn("Switched to local fallback mode.", reason);
    }

    async function apiFetch(path, options = {}) {
        const token = authToken || getAuthToken();
        const headers = {
            "Content-Type": "application/json",
            ...(options.headers || {})
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${BACKEND_URL}${path}`, {
            ...options,
            headers
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data?.error || `Request failed: ${res.status}`);
        }

        return data;
    }

    async function startBackendRound() {
        const token = authToken || getAuthToken();
        if (!token) {
            switchToLocalFallback("No auth token");
            return false;
        }

        try {
            authToken = token;

            const data = await apiFetch("/greed/start", {
                method: "POST",
                body: JSON.stringify({
                    wager: DEFAULT_TEST_WAGER
                })
            });

            roundId = data.roundId;
            commitHash = data?.provablyFair?.commitHash || "";
            setFairnessBadge(`Provably Fair • ${shortHash(commitHash)}`);

            return true;
        } catch (err) {
            console.warn("Backend round start failed:", err);
            switchToLocalFallback("Backend unavailable");
            return false;
        }
    }

    function updateCashoutButton() {
        if (!cashoutButton) return;

        if (safeFoundCount > 0 && !isGameOver) {
            cashoutButton.disabled = false;
            cashoutButton.classList.add("active");
            cashoutButton.textContent = `Cash Out x${multiplier.toFixed(2)}`;

            if (safeFoundCount >= 9) {
                cashoutButton.classList.add("final-push");
            } else {
                cashoutButton.classList.remove("final-push");
            }
        } else {
            cashoutButton.disabled = true;
            cashoutButton.classList.remove("active", "final-push");
            cashoutButton.textContent = "Cash Out";
        }
    }

    function popMultiplier() {
        multiplierDisplay.classList.remove("multiplier-pop");
        void multiplierDisplay.offsetWidth;
        multiplierDisplay.classList.add("multiplier-pop");
    }

    function revealFinalPushHint() {
        if (safeFoundCount === 9) {
            status.innerText = "FINAL DONUT • 33% shot at x3.50";
        } else {
            status.innerText = getRandomHypeLine();
        }
    }

    function lockBoard() {
        isGameOver = true;
        const hitboxes = container.querySelectorAll(".donut-hitbox");
        hitboxes.forEach((hitbox) => {
            hitbox.style.pointerEvents = "none";
        });
        updateCashoutButton();
    }

    function showPoisonOverlay() {
        poisonOverlay.style.display = "flex";

        if (poisonVideo) {
            try {
                poisonVideo.pause();
                poisonVideo.currentTime = 0;

                const playPromise = poisonVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.warn("Poison video autoplay failed:", err);
                    });
                }
            } catch (err) {
                console.warn("Poison video error:", err);
            }
        }
    }

    function showWinOverlay() {
        if (!winOverlay) return;

        const isPerfect = safeFoundCount >= 10;
        winTitle.innerText = isPerfect ? "PERFECT RUN" : "YOU FED THE GREED";

        if (usingBackend && commitHash) {
            winSubtitle.innerText = isPerfect ? "Legendary Cash Out • Hash Revealed" : "Cashed Out • Hash Revealed";
        } else if (usingLocalFallback) {
            winSubtitle.innerText = isPerfect ? "Legendary Cash Out • Demo Mode" : "Cashed Out • Demo Mode";
        } else {
            winSubtitle.innerText = isPerfect ? "Legendary Cash Out" : "Cashed Out";
        }

        winMultiplier.innerText = `x${multiplier.toFixed(2)}`;

        winOverlay.style.display = "flex";

        if (winVideo) {
            try {
                winVideo.pause();
                winVideo.currentTime = 0;

                const playPromise = winVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.warn("Win video autoplay failed:", err);
                    });
                }
            } catch (err) {
                console.warn("Win video error:", err);
            }
        }
    }

    function applyRevealData(provablyFair) {
        if (!provablyFair) return;

        if (provablyFair.commitHash) {
            commitHash = provablyFair.commitHash;
        }

        if (provablyFair.serverSeed) {
            revealedServerSeed = provablyFair.serverSeed;
        }

        if (Array.isArray(provablyFair.poisonIndices)) {
            revealedPoisonIndices = provablyFair.poisonIndices;
        }

        if (revealedServerSeed && commitHash) {
            setFairnessBadge(
                `Revealed • ${shortHash(commitHash)} • Seed ${shortHash(revealedServerSeed)}`
            );
        } else if (commitHash) {
            setFairnessBadge(`Provably Fair • ${shortHash(commitHash)}`);
        }
    }

    function startGame() {
        if (introVideo) {
            try {
                introVideo.pause();
                introVideo.currentTime = 0;
            } catch (err) {
                console.warn("Intro video stop error:", err);
            }
        }

        if (introOverlay) {
            introOverlay.classList.add("hidden");
        }
    }

    async function cashOutNow() {
        if (isGameOver || safeFoundCount < 1) return;

        if (usingBackend && !usingLocalFallback && roundId) {
            try {
                const data = await apiFetch("/greed/cashout", {
                    method: "POST",
                    body: JSON.stringify({
                        roundId
                    })
                });

                multiplier = Number(data.currentMultiplier || multiplier);
                safeFoundCount = Number(data.safeClicks || safeFoundCount);
                applyRevealData(data.provablyFair);

                lockBoard();
                status.innerText = "Greed fed. Cash locked in.";
                showWinOverlay();
                return;
            } catch (err) {
                console.warn("Backend cashout failed:", err);
                status.innerText = "Cashout failed. Try again.";
                return;
            }
        }

        lockBoard();
        status.innerText = "Greed fed. Cash locked in.";
        showWinOverlay();
    }

    if (introVideo) {
        const playIntro = () => {
            try {
                introVideo.pause();
                introVideo.currentTime = 0;
                const playPromise = introVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.warn("Intro autoplay failed:", err);
                    });
                }
            } catch (err) {
                console.warn("Intro video error:", err);
            }
        };

        playIntro();

        introVideo.addEventListener("ended", function () {
            startGame();
        });
    }

    if (startGameBtn) {
        startGameBtn.addEventListener("click", startGame);
    }

    if (cashoutButton) {
        cashoutButton.addEventListener("click", cashOutNow);
    }

    authToken = getAuthToken();
    if (authToken) {
        setFairnessBadge("Provably Fair • Waiting to lock round");
    } else {
        switchToLocalFallback("No token");
    }

    multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
    updateCashoutButton();
    status.innerText = "Pick a donut to begin.";

    container.innerHTML = "";

    positions.forEach((pos, index) => {
        const hitbox = document.createElement("div");
        hitbox.className = "donut-hitbox";

        hitbox.style.position = "absolute";
        hitbox.style.left = pos.x + "%";
        hitbox.style.top = pos.y + "%";
        hitbox.style.transform = "translate(-50%, -50%)";

        hitbox.onclick = async function () {
            if (isGameOver || this.dataset.clicked === "true") return;

            if (!hasStartedRound) {
                hasStartedRound = true;

                if (usingBackend && !usingLocalFallback) {
                    const started = await startBackendRound();
                    if (!started && !usingLocalFallback) {
                        status.innerText = "Could not start round.";
                        return;
                    }
                }
            }

            this.dataset.clicked = "true";
            this.classList.add("selected", "revealed");

            if (usingBackend && !usingLocalFallback && roundId) {
                try {
                    const data = await apiFetch("/greed/pick", {
                        method: "POST",
                        body: JSON.stringify({
                            roundId,
                            pickedIndex: index
                        })
                    });

                    multiplier = Number(data.currentMultiplier || multiplier);
                    safeFoundCount = Number(data.safeClicks || safeFoundCount);
                    multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
                    popMultiplier();

                    if (data.provablyFair) {
                        applyRevealData(data.provablyFair);
                    }

                    if (data.result === "poison") {
                        this.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
                        status.innerText = "POISON! Game Over.";
                        lockBoard();
                        showPoisonOverlay();
                        return;
                    }

                    updateCashoutButton();

                    if (data.result === "perfect" || safeFoundCount >= 10) {
                        lockBoard();
                        status.innerText = "PERFECT RUN!";
                        showWinOverlay();
                        return;
                    }

                    if (data.finalDonutLive || safeFoundCount === 9) {
                        status.innerText = "FINAL DONUT • 33% shot at x3.50";
                    } else {
                        status.innerText = getRandomHypeLine();
                    }

                    return;
                } catch (err) {
                    console.warn("Backend pick failed:", err);
                    status.innerText = "Pick failed. Try again.";
                    this.dataset.clicked = "false";
                    this.classList.remove("selected", "revealed");
                    return;
                }
            }

            if (poisonIndices.includes(index)) {
                this.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
                status.innerText = "POISON! Game Over.";
                lockBoard();
                showPoisonOverlay();
            } else {
                multiplier = multipliers[safeFoundCount] || 3.50;
                safeFoundCount++;
                multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
                popMultiplier();
                updateCashoutButton();

                if (safeFoundCount >= 10) {
                    lockBoard();
                    status.innerText = "PERFECT RUN!";
                    showWinOverlay();
                    return;
                }

                revealFinalPushHint();
            }
        };

        container.appendChild(hitbox);
    });
});