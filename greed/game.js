document.addEventListener("DOMContentLoaded", function () {
    console.log("Game Loaded");

    const BACKEND_URL = "https://planetfatness-backend.onrender.com";
    const DEFAULT_TEST_WAGER = 1000;

    const container = document.getElementById("game-container");
    const status = document.getElementById("status");
    const multiplierDisplay = document.getElementById("multiplier-display");
    const multiplierLadder = document.getElementById("multiplier-ladder");
    const ladderStepLabel = document.getElementById("ladder-step-label");
    const ladderNextLabel = document.getElementById("ladder-next-label");
    const jackpotAmount = document.getElementById("jackpot-amount");

    const poisonOverlay = document.getElementById("poison-overlay");
    const poisonVideo = document.getElementById("poison-video");
    const poisonNewRoundBtn = document.getElementById("poison-new-round-btn");
    const poisonBackChatBtn = document.getElementById("poison-back-chat-btn");

    const winOverlay = document.getElementById("win-overlay");
    const winVideo = document.getElementById("win-video");
    const winTitle = document.getElementById("win-title");
    const winSubtitle = document.getElementById("win-subtitle");
    const winMultiplier = document.getElementById("win-multiplier");
    const winNewRoundBtn = document.getElementById("win-new-round-btn");
    const winBackChatBtn = document.getElementById("win-back-chat-btn");

    const introOverlay = document.getElementById("intro-overlay");
    const introVideo = document.getElementById("intro-video");
    const startGameBtn = document.getElementById("start-game-btn");

    const cashoutButton = document.getElementById("cashout-button");

    if (!container) return;

    // Audio
    const nomSound = new Audio("/assets/greed/nom.mp3");
    nomSound.preload = "auto";
    nomSound.volume = 0.65;

    const startSound = new Audio("/assets/greed/start.mp3");
    startSound.preload = "auto";
    startSound.volume = 0.7;

    const poisonSound = new Audio("/assets/greed/poison.mp3");
    poisonSound.preload = "auto";
    poisonSound.volume = 0.8;

    const cashoutSound = new Audio("/assets/greed/cashout.mp3");
    cashoutSound.preload = "auto";
    cashoutSound.volume = 0.75;

    const jackpotSound = new Audio("/assets/greed/jackpot.mp3");
    jackpotSound.preload = "auto";
    jackpotSound.volume = 0.8;

    const wowSound = new Audio("/assets/greed/wow.mp3");
    wowSound.preload = "auto";
    wowSound.volume = 0.65;

    if (poisonVideo) poisonVideo.load();
    if (introVideo) introVideo.load();
    if (winVideo) winVideo.load();

    let multiplier = 1.0;
    const multipliers = [1.02, 1.07, 1.15, 1.30, 1.48, 1.70, 1.98, 2.28, 2.70, 3.50];
    let safeFoundCount = 0;
    let poisonIndices = [];
    let isGameOver = false;
    let hasStartedRound = false;
    let roundStarting = false;

    let usingBackend = true;
    let usingLocalFallback = false;
    let roundId = null;
    let commitHash = "";
    let revealedServerSeed = "";
    let revealedPoisonIndices = [];
    let authToken = "";
    let lockingStatusInterval = null;

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
    fairnessBadge.style.top = "18.9%";
    fairnessBadge.style.left = "50%";
    fairnessBadge.style.transform = "translateX(-50%)";
    fairnessBadge.style.zIndex = "540";
    fairnessBadge.style.padding = "4px 9px";
    fairnessBadge.style.borderRadius = "999px";
    fairnessBadge.style.background = "rgba(0,0,0,0.22)";
    fairnessBadge.style.color = "rgba(255,255,255,0.93)";
    fairnessBadge.style.fontSize = "10px";
    fairnessBadge.style.fontWeight = "700";
    fairnessBadge.style.letterSpacing = "0.15px";
    fairnessBadge.style.textShadow = "0 1px 5px rgba(0,0,0,0.75)";
    fairnessBadge.style.pointerEvents = "none";
    fairnessBadge.style.maxWidth = "58vw";
    fairnessBadge.style.whiteSpace = "nowrap";
    fairnessBadge.style.overflow = "hidden";
    fairnessBadge.style.textOverflow = "ellipsis";
    fairnessBadge.style.opacity = "0.88";
    fairnessBadge.innerText = "Waiting to lock round...";
    document.body.appendChild(fairnessBadge);

    function shortHash(str) {
        if (!str) return "";
        return str.length > 12 ? `${str.slice(0, 10)}…` : str;
    }

    function formatNumber(n) {
        return Number(n || 0).toLocaleString("en-US");
    }

    function getRandomHypeLine() {
        return hypeLines[Math.floor(Math.random() * hypeLines.length)];
    }

    function setFairnessBadge(text) {
        fairnessBadge.innerText = text;
    }

    function startLockingStatus(message = "Locking in your donuts") {
        stopLockingStatus();
        let dots = 0;
        status.innerText = message;
        lockingStatusInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            status.innerText = message + ".".repeat(dots);
        }, 300);
    }

    function stopLockingStatus(finalText = "") {
        if (lockingStatusInterval) {
            clearInterval(lockingStatusInterval);
            lockingStatusInterval = null;
        }
        if (finalText) {
            status.innerText = finalText;
        }
    }

    function animateJackpotPop() {
        if (!jackpotAmount) return;
        jackpotAmount.classList.remove("jackpot-pop");
        void jackpotAmount.offsetWidth;
        jackpotAmount.classList.add("jackpot-pop");
    }

    function markClickedDonut(hitbox) {
        if (!hitbox) return;
        hitbox.style.opacity = "0.72";
    }

    function shakeGameContainer() {
        if (!container) return;
        container.classList.remove("poison-shake");
        void container.offsetWidth;
        container.classList.add("poison-shake");
    }

    function safePlaySound(audio, reset = true) {
        try {
            audio.pause();
            if (reset) audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Audio play blocked:", err);
                });
            }
        } catch (err) {
            console.warn("Audio play failed:", err);
        }
    }

    function playNomSound() {
        safePlaySound(nomSound);
    }

    function playStartSound() {
        safePlaySound(startSound);
    }

    function playPoisonSound() {
        safePlaySound(poisonSound);
    }

    function playBaseCashoutSound() {
        safePlaySound(cashoutSound);
    }

    function playJackpotCashoutSound() {
        safePlaySound(jackpotSound);
    }

    function playWowSound() {
        safePlaySound(wowSound);
    }

    function playCashoutTierSound() {
        if (safeFoundCount >= 10) {
            playJackpotCashoutSound();
            setTimeout(() => {
                playWowSound();
            }, 250);
        } else if (multiplier >= 2.0) {
            playJackpotCashoutSound();
        } else {
            playBaseCashoutSound();
        }
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

    async function refreshJackpot() {
        try {
            const data = await apiFetch("/greed/jackpot", { method: "GET" });
            const currentAmount =
                Number(data?.jackpot?.currentAmount) ||
                Number(data?.jackpot?.current_amount) ||
                Number(data?.jackpot?.current_amount || 0);

            if (jackpotAmount) {
                jackpotAmount.textContent = `${formatNumber(currentAmount || 5000)} PHAT`;
                animateJackpotPop();
            }
        } catch (err) {
            console.warn("Jackpot fetch failed:", err);
            if (jackpotAmount && !jackpotAmount.textContent.trim()) {
                jackpotAmount.textContent = "5,000 PHAT";
            }
        }
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

            const jackpotCurrent =
                Number(data?.jackpot?.currentAmount) ||
                Number(data?.jackpot?.current_amount) ||
                0;

            if (jackpotAmount && jackpotCurrent > 0) {
                jackpotAmount.textContent = `${formatNumber(jackpotCurrent)} PHAT`;
                animateJackpotPop();
            }

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

    function updateLadder() {
        if (!multiplierLadder || !ladderStepLabel || !ladderNextLabel) return;

        multiplierLadder.innerHTML = "";

        const verticalSteps = [...multipliers].reverse();

        verticalSteps.forEach((value) => {
            const originalIndex = multipliers.indexOf(value);
            const step = document.createElement("div");
            step.className = "ladder-step";
            step.textContent = `x${value.toFixed(2)}`;

            if (originalIndex === multipliers.length - 1) {
                step.classList.add("final-step");
            }

            if (safeFoundCount >= 10) {
                step.classList.add("done");
                if (originalIndex === multipliers.length - 1) step.classList.add("current");
            } else if (safeFoundCount === 0) {
                if (originalIndex === 0) step.classList.add("next");
            } else {
                if (originalIndex < safeFoundCount - 1) step.classList.add("done");
                if (originalIndex === safeFoundCount - 1) step.classList.add("current");
                if (originalIndex === safeFoundCount) step.classList.add("next");
            }

            multiplierLadder.appendChild(step);
        });

        if (safeFoundCount >= 10) {
            ladderStepLabel.textContent = "Step 10 of 10";
            ladderNextLabel.textContent = "Jackpot cleared";
        } else if (safeFoundCount === 9) {
            ladderStepLabel.textContent = "Step 9 of 10";
            ladderNextLabel.textContent = "Top step live";
        } else if (safeFoundCount > 0) {
            ladderStepLabel.textContent = `Step ${safeFoundCount} of 10`;
            ladderNextLabel.textContent = `Next x${multipliers[safeFoundCount].toFixed(2)}`;
        } else {
            ladderStepLabel.textContent = "Step 0 of 10";
            ladderNextLabel.textContent = `Next x${multipliers[0].toFixed(2)}`;
        }
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
        updateLadder();
    }

    function unlockBoard() {
        const hitboxes = container.querySelectorAll(".donut-hitbox");
        hitboxes.forEach((hitbox) => {
            hitbox.style.pointerEvents = "auto";
        });
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

    function hideOverlays() {
        if (poisonOverlay) poisonOverlay.style.display = "none";
        if (winOverlay) winOverlay.style.display = "none";
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

    function hideIntroOverlay() {
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

    function resetRoundStateForFreshStart() {
        stopLockingStatus();

        multiplier = 1.0;
        safeFoundCount = 0;
        poisonIndices = [];
        isGameOver = false;
        hasStartedRound = false;
        roundStarting = false;
        roundId = null;
        commitHash = "";
        revealedServerSeed = "";
        revealedPoisonIndices = [];

        multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
        updateLadder();
        updateCashoutButton();

        const hitboxes = container.querySelectorAll(".donut-hitbox");
        hitboxes.forEach((hitbox) => {
            hitbox.dataset.clicked = "false";
            hitbox.classList.remove("selected", "revealed");
            hitbox.style.backgroundColor = "transparent";
            hitbox.style.pointerEvents = "none";
            hitbox.style.opacity = "1";
        });
    }

    async function beginRoundFromIntro() {
        if (hasStartedRound || isGameOver || roundStarting) return;

        roundStarting = true;
        playStartSound();

        if (startGameBtn) {
            startGameBtn.disabled = true;
            startGameBtn.textContent = "Starting Round...";
        }

        startLockingStatus("Locking in your donuts");
        setFairnessBadge("Locking new round...");

        if (usingBackend && !usingLocalFallback) {
            const started = await startBackendRound();

            if (!started && !usingLocalFallback) {
                stopLockingStatus("Could not lock round.");
                roundStarting = false;
                if (startGameBtn) {
                    startGameBtn.disabled = false;
                    startGameBtn.textContent = "Lock Wager & Start Round";
                }
                return;
            }
        }

        if (usingLocalFallback) {
            seedLocalFallbackPoisons();
        }

        hasStartedRound = true;
        roundStarting = false;
        unlockBoard();
        hideIntroOverlay();
        updateLadder();
        updateCashoutButton();

        if (usingLocalFallback) {
            stopLockingStatus("Demo mode live. Pick a donut.");
        } else {
            stopLockingStatus("Choose wisely...");
        }
    }

    async function startFreshRoundFromOverlay() {
        hideOverlays();
        resetRoundStateForFreshStart();

        if (introOverlay) {
            introOverlay.classList.remove("hidden");
        }

        if (startGameBtn) {
            startGameBtn.disabled = false;
            startGameBtn.textContent = "Lock Wager & Start Round";
        }

        status.innerText = usingLocalFallback
            ? "Demo mode ready. Lock round to begin."
            : "Lock your round to begin.";

        await beginRoundFromIntro();
    }

    function backToChat() {
        try {
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.close();
                return;
            }
        } catch (err) {
            console.warn("Telegram close failed:", err);
        }

        if (document.referrer && document.referrer.length > 0) {
            window.history.back();
        } else {
            window.location.href = "/";
        }
    }

    async function cashOutNow() {
        if (isGameOver || safeFoundCount < 1 || !hasStartedRound) return;

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
                updateLadder();
                await refreshJackpot();

                lockBoard();
                playCashoutTierSound();
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
        playCashoutTierSound();
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
            /* keep overlay visible until round is explicitly locked */
        });
    }

    if (startGameBtn) {
        startGameBtn.addEventListener("click", beginRoundFromIntro);
    }

    if (cashoutButton) {
        cashoutButton.addEventListener("click", cashOutNow);
    }

    if (poisonNewRoundBtn) {
        poisonNewRoundBtn.addEventListener("click", startFreshRoundFromOverlay);
    }

    if (winNewRoundBtn) {
        winNewRoundBtn.addEventListener("click", startFreshRoundFromOverlay);
    }

    if (poisonBackChatBtn) {
        poisonBackChatBtn.addEventListener("click", backToChat);
    }

    if (winBackChatBtn) {
        winBackChatBtn.addEventListener("click", backToChat);
    }

    authToken = getAuthToken();
    if (authToken) {
        setFairnessBadge("Provably Fair • Ready to lock round");
    } else {
        switchToLocalFallback("No token");
    }

    multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
    updateCashoutButton();
    updateLadder();
    refreshJackpot();

    status.innerText = usingLocalFallback
        ? "Demo mode ready. Lock round to begin."
        : "Lock your round to begin.";

    container.innerHTML = "";

    positions.forEach((pos, index) => {
        const hitbox = document.createElement("div");
        hitbox.className = "donut-hitbox";

        hitbox.style.position = "absolute";
        hitbox.style.left = pos.x + "%";
        hitbox.style.top = pos.y + "%";
        hitbox.style.transform = "translate(-50%, -50%)";
        hitbox.style.pointerEvents = "none";

        hitbox.onclick = async function () {
            if (isGameOver || this.dataset.clicked === "true") return;

            if (!hasStartedRound) {
                status.innerText = "Lock a round first.";
                return;
            }

            this.dataset.clicked = "true";
            this.classList.add("selected", "revealed");
            markClickedDonut(this);

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
                    updateLadder();

                    if (data.provablyFair) {
                        applyRevealData(data.provablyFair);
                    }

                    if (data.result === "poison") {
                        playPoisonSound();
                        this.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
                        status.innerText = "POISON! Game Over.";
                        shakeGameContainer();
                        lockBoard();
                        await refreshJackpot();
                        setTimeout(() => {
                            showPoisonOverlay();
                        }, 220);
                        return;
                    }

                    playNomSound();
                    updateCashoutButton();

                    if (data.result === "perfect" || safeFoundCount >= 10) {
                        lockBoard();
                        playCashoutTierSound();
                        status.innerText = "PERFECT RUN!";
                        await refreshJackpot();
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
                    this.style.opacity = "1";
                    return;
                }
            }

            if (poisonIndices.includes(index)) {
                playPoisonSound();
                this.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
                status.innerText = "POISON! Game Over.";
                shakeGameContainer();
                lockBoard();
                setTimeout(() => {
                    showPoisonOverlay();
                }, 220);
            } else {
                multiplier = multipliers[safeFoundCount] || 3.50;
                safeFoundCount++;
                multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
                popMultiplier();
                playNomSound();
                updateLadder();
                updateCashoutButton();

                if (safeFoundCount >= 10) {
                    lockBoard();
                    playCashoutTierSound();
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