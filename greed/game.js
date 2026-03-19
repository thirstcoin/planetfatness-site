document.addEventListener("DOMContentLoaded", function () {
    console.log("Game Loaded");

    const BACKEND_URL = "https://planetfatness-backend.onrender.com";
    const DEFAULT_WAGER = 1000;

    const START_LOCK_MIN_MS = 1400;
    const PICK_COOLDOWN_MS = 450;
    const OVERLAY_DELAY_MS = 220;
    const HUB_FALLBACK_URL = "https://planetfatness.fit/";
    const GREED_FALLBACK_URL = "https://planetfatness.fit/greed";

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

    if (
        !container ||
        !status ||
        !multiplierDisplay ||
        !multiplierLadder ||
        !ladderStepLabel ||
        !ladderNextLabel ||
        !jackpotAmount ||
        !introOverlay ||
        !startGameBtn ||
        !cashoutButton ||
        !poisonOverlay ||
        !winOverlay ||
        !winTitle ||
        !winSubtitle ||
        !winMultiplier
    ) {
        console.error("Missing required game elements.");
        return;
    }

    const tgWebApp = window.Telegram?.WebApp || null;

    if (tgWebApp) {
        try {
            tgWebApp.ready();
            tgWebApp.expand();
        } catch (err) {
            console.warn("Telegram WebApp init failed:", err);
        }
    }

    // Audio
    const nomSound = new Audio("/assets/greed/nom.mp3");
    nomSound.preload = "auto";
    nomSound.volume = 0.65;

    const startSound = new Audio("/assets/greed/start.mp3");
    startSound.preload = "auto";
    startSound.volume = 0.85;

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

    const multipliers = [1.02, 1.07, 1.15, 1.30, 1.48, 1.70, 1.98, 2.28, 2.70, 3.50];

    let multiplier = 1.0;
    let safeFoundCount = 0;
    let isGameOver = false;
    let hasStartedRound = false;
    let roundStarting = false;
    let pickInFlight = false;
    let interactionLockedUntil = 0;

    let roundId = null;
    let commitHash = "";
    let revealedServerSeed = "";
    let revealedPoisonIndices = [];
    let authToken = "";
    let lockingStatusInterval = null;
    let authReady = false;

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
    fairnessBadge.innerText = "Ready to verify wager";
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

    function startLockingStatus(message = "Locking round") {
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

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function setInteractionCooldown(ms) {
        interactionLockedUntil = Date.now() + Math.max(0, ms);
    }

    function interactionCooldownActive() {
        return Date.now() < interactionLockedUntil;
    }

    async function waitForCooldownIfNeeded() {
        const remaining = interactionLockedUntil - Date.now();
        if (remaining > 0) {
            await sleep(remaining);
        }
    }

    function animateJackpotPop() {
        jackpotAmount.classList.remove("jackpot-pop");
        void jackpotAmount.offsetWidth;
        jackpotAmount.classList.add("jackpot-pop");
    }

    function markClickedDonut(hitbox) {
        if (!hitbox) return;
        hitbox.style.opacity = "0.72";
    }

    function shakeGameContainer() {
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

    function playIntroSequence() {
        if (!introVideo) return;

        try {
            introVideo.pause();
            introVideo.currentTime = 0;
        } catch (err) {
            console.warn("Intro reset error:", err);
        }

        playStartSound();

        try {
            const playPromise = introVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Intro autoplay failed:", err);
                });
            }
        } catch (err) {
            console.warn("Intro video error:", err);
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

    function clearStoredTokens() {
        try {
            localStorage.removeItem("pf_token");
            localStorage.removeItem("authToken");
        } catch {}
        authToken = "";
    }

    async function bootstrapTelegramAuth() {
        try {
            if (!tgWebApp) return false;

            const initData = String(tgWebApp.initData || "").trim();
            if (!initData || initData.length < 10) {
                console.warn("Missing Telegram initData");
                return false;
            }

            const res = await fetch(`${BACKEND_URL}/auth/telegram`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ initData })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data?.token) {
                console.warn("Telegram auth failed:", data);
                return false;
            }

            authToken = String(data.token);

            try {
                localStorage.setItem("pf_token", authToken);
            } catch (e) {
                console.warn("Could not persist Telegram token:", e);
            }

            return true;
        } catch (err) {
            console.warn("Telegram bootstrap auth failed:", err);
            return false;
        }
    }

    async function ensureAuthReady() {
        authToken = getAuthToken();

        if (authToken) {
            authReady = true;
            setFairnessBadge("Provably Fair • Ready to lock round");
            startGameBtn.disabled = false;
            status.innerText = "Lock your round to begin.";
            return true;
        }

        setFairnessBadge("Authenticating...");
        status.innerText = "Verifying Telegram session...";

        const tgAuthed = await bootstrapTelegramAuth();
        authToken = getAuthToken();

        if (tgAuthed && authToken) {
            authReady = true;
            setFairnessBadge("Provably Fair • Ready to lock round");
            startGameBtn.disabled = false;
            status.innerText = "Lock your round to begin.";
            return true;
        }

        authReady = false;
        setFairnessBadge("Auth required");
        startGameBtn.disabled = true;
        status.innerText = tgWebApp
            ? "Telegram auth failed. Reopen from the bot."
            : "Launch from Telegram to play.";
        return false;
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
            if (res.status === 401) {
                clearStoredTokens();
            }
            throw new Error(data?.error || `Request failed: ${res.status}`);
        }

        return data;
    }

    async function refreshJackpot() {
        try {
            const data = await fetch(`${BACKEND_URL}/greed/jackpot`, { method: "GET" }).then(async (res) => {
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`);
                return json;
            });

            const currentAmount =
                Number(data?.jackpot?.currentAmount) ||
                Number(data?.jackpot?.current_amount) ||
                0;

            jackpotAmount.textContent = `${formatNumber(currentAmount || 5000)} PHAT`;
            animateJackpotPop();
        } catch (err) {
            console.warn("Jackpot fetch failed:", err);
            if (!jackpotAmount.textContent.trim()) {
                jackpotAmount.textContent = "5,000 PHAT";
            }
        }
    }

    async function startBackendRound() {
        const token = authToken || getAuthToken();
        if (!token) {
            throw new Error("Missing auth token");
        }

        authToken = token;

        const data = await apiFetch("/greed/start", {
            method: "POST",
            body: JSON.stringify({
                wager: DEFAULT_WAGER
            })
        });

        roundId = data.roundId;
        commitHash = data?.provablyFair?.commitHash || "";
        revealedServerSeed = "";
        revealedPoisonIndices = [];

        setFairnessBadge(commitHash ? `Provably Fair • ${shortHash(commitHash)}` : "Provably Fair • Round locked");

        const jackpotCurrent =
            Number(data?.jackpot?.currentAmount) ||
            Number(data?.jackpot?.current_amount) ||
            0;

        if (jackpotCurrent > 0) {
            jackpotAmount.textContent = `${formatNumber(jackpotCurrent)} PHAT`;
            animateJackpotPop();
        }

        return data;
    }

    function updateCashoutButton() {
        if (safeFoundCount > 0 && !isGameOver && !pickInFlight && !interactionCooldownActive()) {
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
            cashoutButton.textContent = safeFoundCount > 0 ? `Cash Out x${multiplier.toFixed(2)}` : "Cash Out";
        }
    }

    function popMultiplier() {
        multiplierDisplay.classList.remove("multiplier-pop");
        void multiplierDisplay.offsetWidth;
        multiplierDisplay.classList.add("multiplier-pop");
    }

    function updateLadder() {
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

    function setBoardPointerState(mode) {
        const hitboxes = container.querySelectorAll(".donut-hitbox");
        hitboxes.forEach((hitbox) => {
            if (mode === "none") {
                hitbox.style.pointerEvents = "none";
                return;
            }

            if (mode === "active") {
                if (!isGameOver && hasStartedRound && !pickInFlight && !interactionCooldownActive() && hitbox.dataset.clicked !== "true") {
                    hitbox.style.pointerEvents = "auto";
                } else {
                    hitbox.style.pointerEvents = "none";
                }
            }
        });
    }

    function lockBoard() {
        isGameOver = true;
        setBoardPointerState("none");
        updateCashoutButton();
        updateLadder();
    }

    function unlockBoard() {
        if (isGameOver || !hasStartedRound || pickInFlight || interactionCooldownActive()) return;
        setBoardPointerState("active");
    }

    function beginPickLock() {
        pickInFlight = true;
        setBoardPointerState("none");
        updateCashoutButton();
    }

    function endPickLock() {
        pickInFlight = false;
        updateCashoutButton();
        unlockBoard();
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
        const isPerfect = safeFoundCount >= 10;
        winTitle.innerText = isPerfect ? "PERFECT RUN" : "YOU FED THE GREED";

        if (commitHash && revealedServerSeed) {
            winSubtitle.innerText = isPerfect ? "Legendary Cash Out • Hash Revealed" : "Cashed Out • Hash Revealed";
        } else if (commitHash) {
            winSubtitle.innerText = isPerfect ? "Legendary Cash Out • Locked" : "Cashed Out • Locked";
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
        poisonOverlay.style.display = "none";
        winOverlay.style.display = "none";
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
            setFairnessBadge(`Revealed • ${shortHash(commitHash)} • Seed ${shortHash(revealedServerSeed)}`);
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

        introOverlay.classList.add("hidden");
    }

    function showIntroOverlay() {
        introOverlay.classList.remove("hidden");
    }

    function resetRoundStateForFreshStart() {
        stopLockingStatus();

        multiplier = 1.0;
        safeFoundCount = 0;
        isGameOver = false;
        hasStartedRound = false;
        roundStarting = false;
        roundId = null;
        commitHash = "";
        revealedServerSeed = "";
        revealedPoisonIndices = [];
        pickInFlight = false;
        interactionLockedUntil = 0;

        multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
        updateLadder();
        updateCashoutButton();
        setFairnessBadge(authReady ? "Provably Fair • Ready to lock round" : "Auth required");

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
        if (!authReady) {
            status.innerText = "Auth required. Reopen from Telegram.";
            return;
        }

        if (hasStartedRound || isGameOver || roundStarting) return;

        roundStarting = true;
        pickInFlight = true;
        setInteractionCooldown(START_LOCK_MIN_MS);
        setBoardPointerState("none");
        updateCashoutButton();

        startGameBtn.disabled = true;
        startGameBtn.textContent = "Verifying Wager...";

        playIntroSequence();
        startLockingStatus("Verifying wager");
        setFairnessBadge("Locking new round...");

        const startTs = Date.now();

        try {
            await startBackendRound();

            const elapsed = Date.now() - startTs;
            const remaining = Math.max(0, START_LOCK_MIN_MS - elapsed);
            if (remaining > 0) {
                await sleep(remaining);
            }

            hasStartedRound = true;
            roundStarting = false;
            pickInFlight = false;

            hideIntroOverlay();
            multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
            updateLadder();
            updateCashoutButton();

            stopLockingStatus("Choose wisely...");
            unlockBoard();
        } catch (err) {
            console.warn("Backend round start failed:", err);

            roundStarting = false;
            pickInFlight = false;
            hasStartedRound = false;
            roundId = null;
            commitHash = "";
            revealedServerSeed = "";
            revealedPoisonIndices = [];
            interactionLockedUntil = 0;

            const msg = String(err?.message || "Round failed to lock");
            stopLockingStatus(msg);
            setFairnessBadge("Round not locked");

            startGameBtn.disabled = !authReady;
            startGameBtn.textContent = "Lock Wager & Start Round";

            if (msg.toLowerCase().includes("invalid token") || msg.toLowerCase().includes("missing auth token")) {
                clearStoredTokens();
                authReady = false;
                setFairnessBadge("Session expired");
                status.innerText = "Session expired. Reopen from Telegram.";
                startGameBtn.disabled = true;
                return;
            }

            status.innerText = msg.includes("Insufficient")
                ? "Deposit PHAT and try again."
                : msg;
        }
    }

    async function startFreshRoundFromOverlay() {
        hideOverlays();
        resetRoundStateForFreshStart();
        showIntroOverlay();

        startGameBtn.disabled = !authReady;
        startGameBtn.textContent = "Lock Wager & Start Round";

        playIntroSequence();
        status.innerText = authReady ? "Lock your round to begin." : "Launch from Telegram to play.";
    }

    function backToChat() {
        try {
            if (tgWebApp) {
                try {
                    tgWebApp.HapticFeedback?.impactOccurred?.("light");
                } catch {}

                try {
                    tgWebApp.close();
                    return;
                } catch (err) {
                    console.warn("Telegram close failed:", err);
                }
            }
        } catch (err) {
            console.warn("Telegram close wrapper failed:", err);
        }

        try {
            if (document.referrer && document.referrer.length > 0 && document.referrer !== window.location.href) {
                window.location.href = document.referrer;
                return;
            }
        } catch {}

        if (window.location.pathname.includes("/greed")) {
            window.location.href = HUB_FALLBACK_URL;
            return;
        }

        window.location.href = GREED_FALLBACK_URL;
    }

    async function cashOutNow() {
        if (isGameOver || safeFoundCount < 1 || !hasStartedRound || pickInFlight || interactionCooldownActive()) return;
        if (!roundId) {
            status.innerText = "No active round found.";
            return;
        }

        beginPickLock();
        startLockingStatus("Securing cashout");

        try {
            const data = await apiFetch("/greed/cashout", {
                method: "POST",
                body: JSON.stringify({
                    roundId
                })
            });

            multiplier = Number(data.currentMultiplier || multiplier);
            safeFoundCount = Number(data.safeClicks || safeFoundCount);
            multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
            applyRevealData(data.provablyFair);
            updateLadder();
            await refreshJackpot();

            lockBoard();
            playCashoutTierSound();
            stopLockingStatus("Greed fed. Cash locked in.");
            showWinOverlay();
            pickInFlight = false;
            updateCashoutButton();
        } catch (err) {
            console.warn("Backend cashout failed:", err);
            const msg = String(err?.message || "Cashout failed. Try again.");
            if (msg.toLowerCase().includes("invalid token")) {
                clearStoredTokens();
                authReady = false;
                startGameBtn.disabled = true;
                setFairnessBadge("Session expired");
                stopLockingStatus("Session expired. Reopen from Telegram.");
            } else {
                stopLockingStatus("Cashout failed. Try again.");
            }
            endPickLock();
        }
    }

    startGameBtn.addEventListener("click", beginRoundFromIntro);
    cashoutButton.addEventListener("click", cashOutNow);

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

    multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
    updateCashoutButton();
    updateLadder();
    refreshJackpot();

    container.innerHTML = "";

    positions.forEach((pos, index) => {
        const hitbox = document.createElement("div");
        hitbox.className = "donut-hitbox";

        hitbox.style.position = "absolute";
        hitbox.style.left = pos.x + "%";
        hitbox.style.top = pos.y + "%";
        hitbox.style.transform = "translate(-50%, -50%)";
        hitbox.style.pointerEvents = "none";
        hitbox.dataset.clicked = "false";

        hitbox.onclick = async function () {
            if (
                isGameOver ||
                pickInFlight ||
                interactionCooldownActive() ||
                this.dataset.clicked === "true"
            ) {
                return;
            }

            if (!hasStartedRound) {
                status.innerText = "Lock a round first.";
                return;
            }

            if (!roundId) {
                status.innerText = "Round not found. Start again.";
                return;
            }

            beginPickLock();
            startLockingStatus("Submitting pick");

            this.dataset.clicked = "true";
            this.classList.add("selected", "revealed");
            markClickedDonut(this);

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
                    stopLockingStatus("POISON! Game Over.");
                    shakeGameContainer();
                    lockBoard();
                    pickInFlight = false;
                    updateCashoutButton();
                    await refreshJackpot();
                    setTimeout(() => {
                        showPoisonOverlay();
                    }, OVERLAY_DELAY_MS);
                    return;
                }

                playNomSound();
                updateCashoutButton();

                if (data.result === "perfect" || safeFoundCount >= 10) {
                    lockBoard();
                    playCashoutTierSound();
                    stopLockingStatus("PERFECT RUN!");
                    pickInFlight = false;
                    updateCashoutButton();
                    await refreshJackpot();
                    showWinOverlay();
                    return;
                }

                if (data.finalDonutLive || safeFoundCount === 9) {
                    stopLockingStatus("FINAL DONUT • 33% shot at x3.50");
                } else {
                    stopLockingStatus(getRandomHypeLine());
                }

                setInteractionCooldown(PICK_COOLDOWN_MS);
                await waitForCooldownIfNeeded();
                endPickLock();
            } catch (err) {
                console.warn("Backend pick failed:", err);
                const msg = String(err?.message || "Pick failed. Try again.");

                this.dataset.clicked = "false";
                this.classList.remove("selected", "revealed");
                this.style.opacity = "1";
                this.style.backgroundColor = "transparent";

                if (msg.toLowerCase().includes("invalid token")) {
                    clearStoredTokens();
                    authReady = false;
                    startGameBtn.disabled = true;
                    setFairnessBadge("Session expired");
                    stopLockingStatus("Session expired. Reopen from Telegram.");
                } else {
                    stopLockingStatus(msg.includes("Donut already picked") ? "Donut already picked." : "Pick failed. Try again.");
                }

                endPickLock();
            }
        };

        container.appendChild(hitbox);
    });

    playIntroSequence();

    (async function init() {
        startGameBtn.disabled = true;
        status.innerText = "Checking session...";
        await ensureAuthReady();
    })();
});