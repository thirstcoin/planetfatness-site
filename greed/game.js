document.addEventListener("DOMContentLoaded", function () {
    console.log("Game Loaded");

    const BACKEND_URL = "https://planetfatness-backend.onrender.com";
    const DEFAULT_WAGER = 1000;

    const START_LOCK_MIN_MS = 1400;
    const PICK_COOLDOWN_MS = 450;
    const OVERLAY_DELAY_MS = 220;
    const HUB_FALLBACK_URL = "https://planetfatness.fit/";

    const TOKEN_KEY = "pf_token";
    const TG_KEY = "pf_tg";
    const ADDR_KEY = "pf_address";
    const ID_KIND = "pf_identity_kind";

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
    const poisonViewCardBtn = document.getElementById("poison-view-card-btn");
    const poisonResultLabel = document.getElementById("poison-result-label");
    const poisonResultMultiplier = document.getElementById("poison-result-multiplier");
    const poisonResultLoss = document.getElementById("poison-result-loss");

    const winOverlay = document.getElementById("win-overlay");
    const winVideo = document.getElementById("win-video");
    const winTitle = document.getElementById("win-title");
    const winSubtitle = document.getElementById("win-subtitle");
    const winMultiplier = document.getElementById("win-multiplier");
    const winPayout = document.getElementById("win-payout");
    const winNewRoundBtn = document.getElementById("win-new-round-btn");
    const winBackChatBtn = document.getElementById("win-back-chat-btn");
    const winViewCardBtn = document.getElementById("win-view-card-btn");

    const introOverlay = document.getElementById("intro-overlay");
    const introVideo = document.getElementById("intro-video");
    const startGameBtn = document.getElementById("start-game-btn");
    const cashoutButton = document.getElementById("cashout-button");

    const availableBalanceValue = document.getElementById("available-balance-value");
    const selectedWagerBalanceView = document.getElementById("selected-wager-balance-view");
    const balanceModeNote = document.getElementById("balance-mode-note");

    const fairnessCommitEl = document.getElementById("fairness-commit");
    const fairnessSeedEl = document.getElementById("fairness-seed");
    const fairnessNonceEl = document.getElementById("fairness-nonce");
    const fairnessPoisonEl = document.getElementById("fairness-poison");

    const poisonFairnessCommitEl = document.getElementById("poison-fairness-commit");
    const poisonFairnessSeedEl = document.getElementById("poison-fairness-seed");
    const poisonFairnessNonceEl = document.getElementById("poison-fairness-nonce");
    const poisonFairnessPoisonEl = document.getElementById("poison-fairness-poison");

    const winFairnessCommitEl = document.getElementById("win-fairness-commit");
    const winFairnessSeedEl = document.getElementById("win-fairness-seed");
    const winFairnessNonceEl = document.getElementById("win-fairness-nonce");
    const winFairnessPoisonEl = document.getElementById("win-fairness-poison");

    // Withdraw UI
    const openWithdrawBtn = document.getElementById("open-withdraw-btn");
    const withdrawModal = document.getElementById("withdraw-modal");
    const withdrawBackdrop = document.getElementById("withdraw-backdrop");
    const withdrawCancelBtn = document.getElementById("withdraw-cancel-btn");
    const withdrawSubmitBtn = document.getElementById("withdraw-submit-btn");
    const withdrawMaxBtn = document.getElementById("withdraw-max-btn");
    const withdrawAmountInput = document.getElementById("withdraw-amount-input");
    const withdrawWalletInput = document.getElementById("withdraw-wallet-input");
    const withdrawAvailable = document.getElementById("withdraw-available");
    const withdrawStatus = document.getElementById("withdraw-status");

    // Funding UI
    const fundingPanel = document.getElementById("funding-panel");
    const quickWagerButtons = Array.from(document.querySelectorAll(".quick-wager-btn"));
    const customWagerInput = document.getElementById("custom-wager-input");
    const selectedWagerValue = document.getElementById("selected-wager-value");
    const cancelIntentBtn = document.getElementById("cancel-intent-btn");
    const copyAmountBtn = document.getElementById("copy-amount-btn");
    const copyWalletBtn = document.getElementById("copy-wallet-btn");

    const intentStatusEl = document.getElementById("intent-status");
    const intentAmountEl = document.getElementById("intent-amount");
    const intentWalletEl = document.getElementById("intent-wallet");
    const intentTokenEl = document.getElementById("intent-token");
    const intentExpiryEl = document.getElementById("intent-expiry");
    const intentTxEl = document.getElementById("intent-tx");
    const fundingHelpEl = document.getElementById("funding-help");
    const fundingPollingNoteEl = document.getElementById("funding-polling-note");

    // Top buttons
    const openGlobalStatsBtn = document.getElementById("open-global-stats-btn");
    const openGreedCardBtn = document.getElementById("open-greed-card-btn");
    const openLeaderboardsBtn = document.getElementById("open-leaderboards-btn");

    // Global stats strip
    const gsWagered = document.getElementById("gs-wagered");
    const gsRounds = document.getElementById("gs-rounds");
    const gsPerfect = document.getElementById("gs-perfect");
    const gsSince = document.getElementById("gs-since");

    // Right rail
    const lbBigAppetites = document.getElementById("lb-big-appetites");
    const lbPhatStacks = document.getElementById("lb-phat-stacks");
    const lbPerfectRuns = document.getElementById("lb-perfect-runs");
    const lbGreedGods = document.getElementById("lb-greed-gods");

    // Greed Card modal
    const greedCardModal = document.getElementById("greed-card-modal");
    const greedCardBackdrop = document.getElementById("greed-card-backdrop");
    const closeGreedCardBtn = document.getElementById("close-greed-card-btn");
    const gcRefreshBtn = document.getElementById("gc-refresh-btn");
    const gcCloseBtn = document.getElementById("gc-close-btn");
    const greedCardUsername = document.getElementById("greed-card-username");

    const gcRank = document.getElementById("gc-rank");
    const gcTier = document.getElementById("gc-tier");
    const gcTotalWagered = document.getElementById("gc-total-wagered");
    const gcTotalRounds = document.getElementById("gc-total-rounds");
    const gcNetProfit = document.getElementById("gc-net-profit");
    const gcCashoutRate = document.getElementById("gc-cashout-rate");
    const gcPerfectRuns = document.getElementById("gc-perfect-runs");
    const gcTotalLost = document.getElementById("gc-total-lost");
    const gcBusts = document.getElementById("gc-busts");
    const gcBiggestCashout = document.getElementById("gc-biggest-cashout");
    const gcBestRunDepth = document.getElementById("gc-best-run-depth");
    const gcBiggestJackpot = document.getElementById("gc-biggest-jackpot");
    const gcGreedScore = document.getElementById("gc-greed-score");

    // Global stats modal
    const globalStatsModal = document.getElementById("global-stats-modal");
    const globalStatsBackdrop = document.getElementById("global-stats-backdrop");
    const closeGlobalStatsBtn = document.getElementById("close-global-stats-btn");
    const gsmRefreshBtn = document.getElementById("gsm-refresh-btn");
    const gsmCloseBtn = document.getElementById("gsm-close-btn");

    const gsmTotalWagered = document.getElementById("gsm-total-wagered");
    const gsmTotalRounds = document.getElementById("gsm-total-rounds");
    const gsmBustRate = document.getElementById("gsm-bust-rate");
    const gsmCashoutRate = document.getElementById("gsm-cashout-rate");
    const gsmPerfectRuns = document.getElementById("gsm-perfect-runs");
    const gsmCurrentJackpot = document.getElementById("gsm-current-jackpot");
    const gsmRoundsSinceJackpot = document.getElementById("gsm-rounds-since-jackpot");
    const gsmBiggestCashout = document.getElementById("gsm-biggest-cashout");

    // Leaderboards modal
    const leaderboardsModal = document.getElementById("leaderboards-modal");
    const leaderboardsBackdrop = document.getElementById("leaderboards-backdrop");
    const closeLeaderboardsBtn = document.getElementById("close-leaderboards-btn");
    const lbmRefreshBtn = document.getElementById("lbm-refresh-btn");
    const lbmCloseBtn = document.getElementById("lbm-close-btn");

    const lbmBigAppetites = document.getElementById("lbm-big-appetites");
    const lbmPhatStacks = document.getElementById("lbm-phat-stacks");
    const lbmGlazeDonors = document.getElementById("lbm-glaze-donors");
    const lbmPerfectRuns = document.getElementById("lbm-perfect-runs");
    const lbmJackpotButchers = document.getElementById("lbm-jackpot-butchers");
    const lbmGreedGods = document.getElementById("lbm-greed-gods");

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
        !winOverlay
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
    let currentRoundWager = 0;
    let commitHash = "";
    let fairnessNonce = "";
    let revealedServerSeed = "";
    let revealedPoisonIndices = [];
    let authToken = "";
    let lockingStatusInterval = null;
    let authReady = false;
    let authBootstrapPromise = null;

    let selectedWager = DEFAULT_WAGER;
    let currentIntent = null;
    let intentPollInterval = null;
    let intentBusy = false;
    let availableBalance = 0;
    let balanceCoversWager = false;

    let withdrawBusy = false;
    let greedCardBusy = false;
    let globalStatsBusy = false;
    let leaderboardsBusy = false;

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
        "Phil says keep stacking."
    ];

    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

    function shortHash(str) {
        if (!str) return "";
        return str.length > 16 ? `${str.slice(0, 16)}…` : str;
    }

    function formatNumber(n) {
        return Number(n || 0).toLocaleString("en-US");
    }

    function formatSignedPhat(n) {
        const num = Number(n || 0);
        const sign = num > 0 ? "+" : num < 0 ? "-" : "";
        const abs = Math.abs(num);
        return `${sign}${abs.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
        })} PHAT`;
    }

    function formatPhat(n) {
        const num = Number(n || 0);
        return `${num.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
        })} PHAT`;
    }

    function formatIntentAmount(n) {
        const num = Number(n || 0);
        if (!Number.isFinite(num) || num <= 0) return "—";
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        });
    }

    function formatBalance(n) {
        const num = Number(n || 0);
        if (!Number.isFinite(num)) return "0 PHAT";
        return `${num.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
        })} PHAT`;
    }

    function formatPct(n) {
        const num = Number(n || 0);
        if (!Number.isFinite(num)) return "0.0%";
        return `${num.toFixed(1)}%`;
    }

    function formatPoisonIndices(indices) {
        return Array.isArray(indices) && indices.length
            ? indices.map((n) => Number(n) + 1).join(", ")
            : "—";
    }

    function getRandomHypeLine() {
        return hypeLines[Math.floor(Math.random() * hypeLines.length)];
    }

    function fillText(el, value, formatter = null, fallback = "—") {
        if (!el) return;
        if (value == null || value === "") {
            el.textContent = fallback;
            return;
        }
        el.textContent = formatter ? formatter(value) : String(value);
    }

    function setFairnessPanel() {
        const poisonText = formatPoisonIndices(revealedPoisonIndices);

        fillText(fairnessCommitEl, commitHash || "—");
        fillText(fairnessSeedEl, revealedServerSeed || "—");
        fillText(fairnessNonceEl, fairnessNonce || "—");
        fillText(fairnessPoisonEl, poisonText);

        fillText(poisonFairnessCommitEl, commitHash || "—");
        fillText(poisonFairnessSeedEl, revealedServerSeed || "—");
        fillText(poisonFairnessNonceEl, fairnessNonce || "—");
        fillText(poisonFairnessPoisonEl, poisonText);

        fillText(winFairnessCommitEl, commitHash || "—");
        fillText(winFairnessSeedEl, revealedServerSeed || "—");
        fillText(winFairnessNonceEl, fairnessNonce || "—");
        fillText(winFairnessPoisonEl, poisonText);
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

    function playNomSound() { safePlaySound(nomSound); }
    function playStartSound() { safePlaySound(startSound); }
    function playPoisonSound() { safePlaySound(poisonSound); }
    function playBaseCashoutSound() { safePlaySound(cashoutSound); }
    function playJackpotCashoutSound() { safePlaySound(jackpotSound); }
    function playWowSound() { safePlaySound(wowSound); }

    function playCashoutTierSound() {
        if (safeFoundCount >= 10) {
            playJackpotCashoutSound();
            setTimeout(() => playWowSound(), 250);
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

    function getUrlToken() {
        try {
            const url = new URL(window.location.href);
            return url.searchParams.get("t") || "";
        } catch {
            return "";
        }
    }

    function getStoredToken() {
        try {
            return (
                localStorage.getItem(TOKEN_KEY) ||
                localStorage.getItem("authToken") ||
                ""
            ).trim();
        } catch {
            return "";
        }
    }

    function getAuthToken() {
        const tokenFromQuery = getUrlToken();
        if (tokenFromQuery) {
            try {
                localStorage.setItem(TOKEN_KEY, tokenFromQuery);
            } catch (e) {
                console.warn("Could not persist token:", e);
            }
            return tokenFromQuery;
        }
        return getStoredToken();
    }

    function clearStoredTokens() {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("authToken");
        } catch {}
        authToken = "";
    }

    function saveTelegramUser(user) {
        if (!user || !user.id) return;
        try {
            localStorage.setItem(TG_KEY, JSON.stringify(user));
            localStorage.setItem(ID_KIND, "tg");
            localStorage.setItem(ADDR_KEY, `tg:${user.id}`);
        } catch {}
    }

    function getTelegramUserFromWebApp() {
        const raw = tgWebApp?.initDataUnsafe?.user || null;
        if (!raw || !raw.id) return null;
        return {
            id: raw.id,
            username: (raw.username || "").trim(),
            name: [raw.first_name || "", raw.last_name || ""].join(" ").trim()
        };
    }

    async function bootstrapTelegramAuth() {
        try {
            if (!tgWebApp) return false;

            const initData = String(tgWebApp.initData || "").trim();
            const tgUser = getTelegramUserFromWebApp();
            if (tgUser) {
                saveTelegramUser(tgUser);
            }

            if (!initData || initData.length < 10) {
                console.warn("Missing Telegram initData");
                return false;
            }

            const res = await fetch(`${BACKEND_URL}/auth/telegram`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data?.token) {
                console.warn("Telegram auth failed:", data);
                return false;
            }

            authToken = String(data.token);

            try {
                localStorage.setItem(TOKEN_KEY, authToken);
            } catch (e) {
                console.warn("Could not persist Telegram token:", e);
            }

            const returnedTgUser = data?.telegram
                ? {
                    id: data.telegram.id,
                    username: (data.telegram.username || "").trim(),
                    name: [data.telegram.first_name || "", data.telegram.last_name || ""].join(" ").trim()
                }
                : null;

            if (returnedTgUser && returnedTgUser.id) {
                saveTelegramUser(returnedTgUser);
            }

            return true;
        } catch (err) {
            console.warn("Telegram bootstrap auth failed:", err);
            return false;
        }
    }

    async function ensureAuthReady(forceRefresh = false) {
        if (authBootstrapPromise && !forceRefresh) {
            return authBootstrapPromise;
        }

        authBootstrapPromise = (async () => {
            if (forceRefresh) {
                clearStoredTokens();
            }

            authToken = getAuthToken();

            if (authToken) {
                authReady = true;
                syncFundingButtons();
                syncStartButtonState();
                return true;
            }

            status.innerText = "Verifying session...";
            const tgAuthed = await bootstrapTelegramAuth();
            authToken = getAuthToken();

            if (tgAuthed && authToken) {
                authReady = true;
                syncFundingButtons();
                syncStartButtonState();
                return true;
            }

            authReady = false;
            syncFundingButtons();
            syncStartButtonState();
            status.innerText = tgWebApp
                ? "Session failed. Reopen from the bot."
                : "Launch from Telegram to play.";
            return false;
        })();

        try {
            return await authBootstrapPromise;
        } finally {
            authBootstrapPromise = null;
        }
    }

    async function apiFetch(path, options = {}, retrying = false) {
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
            if (res.status === 401 && !retrying) {
                clearStoredTokens();
                authReady = false;
                const reAuthed = await ensureAuthReady(true);
                if (reAuthed) {
                    return apiFetch(path, options, true);
                }
            }
            throw new Error(data?.error || `Request failed: ${res.status}`);
        }

        return data;
    }

    function formatExpiry(expiresAt) {
        if (!expiresAt) return "—";

        const d = new Date(expiresAt);
        if (Number.isNaN(d.getTime())) return "—";

        const diffMs = d.getTime() - Date.now();
        if (diffMs <= 0) return "Expired";

        const totalSec = Math.floor(diffMs / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;

        if (min <= 0) return `${sec}s`;
        return `${min}m ${sec}s`;
    }

    function highlightSelectedWagerButtons() {
        quickWagerButtons.forEach((btn) => {
            const amt = Number(btn.dataset.wager || 0);
            if (amt === Number(selectedWager || 0)) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });
    }

    function setSelectedWager(amount) {
        const next = Math.max(1000, Math.min(50000, Math.floor(Number(amount || DEFAULT_WAGER))));
        selectedWager = next;

        fillText(selectedWagerValue, `${formatNumber(next)} PHAT`);
        fillText(selectedWagerBalanceView, `${formatNumber(next)} PHAT`);

        if (customWagerInput && String(customWagerInput.value || "").trim() !== String(next)) {
            customWagerInput.value = String(next);
        }

        highlightSelectedWagerButtons();
        updateBalanceMode();
        syncStartButtonState();
        syncFundingButtons();
    }

    async function copyTextToClipboard(text, successMessage, failMessage) {
        const value = String(text || "").trim();
        if (!value || value === "—") return false;

        try {
            await navigator.clipboard.writeText(value);
            status.innerText = successMessage;
            return true;
        } catch (err) {
            console.warn("Clipboard copy failed:", err);
            status.innerText = failMessage;
            return false;
        }
    }

    async function copyWalletAddress() {
        if (!intentWalletEl) return;

        const ok = await copyTextToClipboard(
            intentWalletEl.textContent || "",
            "Wallet copied. Send the exact PHAT amount shown.",
            "Copy failed. Tap and hold the wallet address to copy."
        );

        if (ok && intentWalletEl) {
            intentWalletEl.classList.add("copied");
            setTimeout(() => {
                intentWalletEl.classList.remove("copied");
            }, 1200);
        }
    }

    async function copyIntentAmount() {
        if (!currentIntent?.exactAmount) return;

        await copyTextToClipboard(
            formatIntentAmount(currentIntent.exactAmount),
            "Amount copied. Send that exact PHAT amount.",
            "Copy failed. Copy the amount manually."
        );
    }

    function updateBalanceMode() {
        balanceCoversWager = Number(availableBalance || 0) >= Number(selectedWager || 0);

        fillText(availableBalanceValue, formatBalance(availableBalance));
        fillText(withdrawAvailable, formatBalance(availableBalance));
        fillText(selectedWagerBalanceView, `${formatNumber(selectedWager)} PHAT`);

        if (balanceModeNote) {
            if (!authReady) {
                balanceModeNote.textContent = "Authenticating...";
            } else if (balanceCoversWager) {
                balanceModeNote.textContent = "Balance covers this wager. You can start instantly.";
            } else {
                balanceModeNote.textContent = "Balance is below this wager. Funding intent will be used.";
            }
        }

        if (fundingPanel) {
            if (balanceCoversWager) {
                fundingPanel.classList.add("balance-covered");
            } else {
                fundingPanel.classList.remove("balance-covered");
            }
        }
    }

    async function refreshBalance(quiet = false) {
        if (!authReady) return 0;

        try {
            const data = await apiFetch("/wallet/balance", { method: "GET" });
            availableBalance = Number(data?.balance?.available_balance || 0);
            updateBalanceMode();
            return availableBalance;
        } catch (err) {
            console.warn("Balance fetch failed:", err);
            if (!quiet) {
                status.innerText = "Unable to load balance.";
            }
            availableBalance = 0;
            updateBalanceMode();
            return 0;
        }
    }

    function renderIntent(intent) {
        currentIntent = intent || null;

        if (intentStatusEl) {
            if (!currentIntent) {
                intentStatusEl.textContent = "NOT FUNDED";
            } else if (currentIntent.status === "pending") {
                intentStatusEl.textContent = "WAITING FOR DEPOSIT";
            } else if (currentIntent.status === "funded") {
                intentStatusEl.textContent = "DEPOSIT DETECTED";
            } else if (currentIntent.status === "expired") {
                intentStatusEl.textContent = "EXPIRED";
            } else if (currentIntent.status === "cancelled") {
                intentStatusEl.textContent = "CANCELLED";
            } else {
                intentStatusEl.textContent = String(currentIntent.status || "").toUpperCase();
            }
        }

        fillText(intentAmountEl, currentIntent?.exactAmount ? `${formatIntentAmount(currentIntent.exactAmount)} PHAT` : "—");
        fillText(intentWalletEl, currentIntent?.depositWallet || "—");
        fillText(intentTokenEl, currentIntent?.tokenMint || "PHAT");
        fillText(intentExpiryEl, currentIntent ? formatExpiry(currentIntent.expiresAt) : "—");

        if (intentTxEl) {
            intentTxEl.textContent = currentIntent?.txSignature ? shortHash(currentIntent.txSignature) : "—";
            intentTxEl.title = currentIntent?.txSignature || "";
        }

        if (fundingHelpEl) {
            if (balanceCoversWager) {
                fundingHelpEl.textContent = "Your internal balance covers this wager. Funding is not required.";
            } else if (!currentIntent) {
                fundingHelpEl.textContent = "Choose a wager to generate a funding amount.";
            } else if (currentIntent.status === "funded") {
                fundingHelpEl.textContent = "Deposit received. Your round is ready.";
            } else if (currentIntent.status === "pending") {
                fundingHelpEl.textContent = "Use Copy Amount and Copy Wallet, then send the exact PHAT amount shown.";
            } else if (currentIntent.status === "expired") {
                fundingHelpEl.textContent = "Funding expired. Pick a wager again.";
            } else if (currentIntent.status === "cancelled") {
                fundingHelpEl.textContent = "Funding cancelled.";
            } else {
                fundingHelpEl.textContent = "Round funding updated.";
            }
        }

        if (fundingPollingNoteEl) {
            if (balanceCoversWager) {
                fundingPollingNoteEl.textContent = "Using internal balance.";
            } else if (!currentIntent) {
                fundingPollingNoteEl.textContent = "Waiting for selection.";
            } else if (currentIntent.status === "funded") {
                fundingPollingNoteEl.textContent = "Deposit confirmed.";
            } else if (currentIntent.status === "pending") {
                fundingPollingNoteEl.textContent = "Waiting for deposit…";
            } else if (currentIntent.status === "expired") {
                fundingPollingNoteEl.textContent = "Funding expired.";
            } else if (currentIntent.status === "cancelled") {
                fundingPollingNoteEl.textContent = "Funding cancelled.";
            } else if (currentIntent.status === "consumed") {
                fundingPollingNoteEl.textContent = "Round funded.";
            } else {
                fundingPollingNoteEl.textContent = "Funding updated.";
            }
        }

        if (currentIntent?.requestedWager) {
            setSelectedWager(Number(currentIntent.requestedWager));
        }

        if (copyAmountBtn) {
            copyAmountBtn.disabled = !currentIntent?.exactAmount || balanceCoversWager;
        }

        if (copyWalletBtn) {
            copyWalletBtn.disabled = !currentIntent?.depositWallet || balanceCoversWager;
        }

        syncFundingButtons();
        syncStartButtonState();
    }

    function stopIntentPolling() {
        if (intentPollInterval) {
            clearInterval(intentPollInterval);
            intentPollInterval = null;
        }
    }

    function syncFundingButtons() {
        const hasIntent = !!currentIntent;
        const intentStatus = String(currentIntent?.status || "");
        const pendingOrFunded = intentStatus === "pending" || intentStatus === "funded";
        const shouldDisableFunding = balanceCoversWager;

        if (cancelIntentBtn) {
            cancelIntentBtn.disabled =
                !authReady ||
                intentBusy ||
                shouldDisableFunding ||
                !hasIntent ||
                !(intentStatus === "pending" || intentStatus === "funded");
        }

        if (customWagerInput) {
            customWagerInput.disabled = !authReady || intentBusy || hasStartedRound || roundStarting;
        }

        quickWagerButtons.forEach((btn) => {
            btn.disabled = !authReady || intentBusy || hasStartedRound || roundStarting;
        });

        if (copyWalletBtn) {
            copyWalletBtn.disabled = shouldDisableFunding || !pendingOrFunded || !currentIntent?.depositWallet;
        }

        if (copyAmountBtn) {
            copyAmountBtn.disabled = shouldDisableFunding || !pendingOrFunded || !currentIntent?.exactAmount;
        }

        if (openWithdrawBtn) {
            openWithdrawBtn.disabled = !authReady || hasStartedRound || roundStarting || withdrawBusy;
        }

        if (withdrawSubmitBtn) {
            withdrawSubmitBtn.disabled = withdrawBusy || !authReady;
        }

        if (withdrawMaxBtn) {
            withdrawMaxBtn.disabled = withdrawBusy || !authReady;
        }

        if (withdrawCancelBtn) {
            withdrawCancelBtn.disabled = withdrawBusy;
        }

        if (openGreedCardBtn) openGreedCardBtn.disabled = !authReady || greedCardBusy;
        if (openGlobalStatsBtn) openGlobalStatsBtn.disabled = globalStatsBusy;
        if (openLeaderboardsBtn) openLeaderboardsBtn.disabled = leaderboardsBusy;
        if (gcRefreshBtn) gcRefreshBtn.disabled = greedCardBusy;
        if (gsmRefreshBtn) gsmRefreshBtn.disabled = globalStatsBusy;
        if (lbmRefreshBtn) lbmRefreshBtn.disabled = leaderboardsBusy;
    }

    function syncStartButtonState() {
        if (!startGameBtn) return;

        if (!authReady) {
            startGameBtn.disabled = true;
            startGameBtn.textContent = "Open in Telegram";
            return;
        }

        if (roundStarting) {
            startGameBtn.disabled = true;
            startGameBtn.textContent = "Starting Round...";
            return;
        }

        if (hasStartedRound) {
            startGameBtn.disabled = true;
            startGameBtn.textContent = "Round Active";
            return;
        }

        if (balanceCoversWager) {
            startGameBtn.disabled = false;
            startGameBtn.textContent = "Play From Balance";
            return;
        }

        if (!currentIntent) {
            startGameBtn.disabled = true;
            startGameBtn.textContent = "Fund Wager First";
            return;
        }

        const intentStatus = String(currentIntent.status || "");
        if (intentStatus !== "funded") {
            startGameBtn.disabled = true;
            startGameBtn.textContent = intentStatus === "pending"
                ? "Waiting for Deposit"
                : "Fund Wager First";
            return;
        }

        startGameBtn.disabled = false;
        startGameBtn.textContent = "Start Round";
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

    async function loadOpenIntent(showStatus = false) {
        if (!authReady) return null;

        try {
            const data = await apiFetch("/greed/deposit-intent", { method: "GET" });
            const intent = data?.intent || null;
            renderIntent(intent);

            if (showStatus) {
                if (balanceCoversWager) {
                    status.innerText = "Balance covers this wager. Start when ready.";
                } else if (!intent) {
                    status.innerText = "Choose a wager to begin.";
                } else if (intent.status === "pending") {
                    status.innerText = "Waiting for your deposit.";
                } else if (intent.status === "funded") {
                    status.innerText = "Deposit received. Start your round.";
                } else {
                    status.innerText = "Choose a wager to begin.";
                }
            }

            if (!balanceCoversWager && intent && (intent.status === "pending" || intent.status === "funded")) {
                startIntentPolling();
            } else {
                stopIntentPolling();
            }

            return intent;
        } catch (err) {
            console.warn("Open intent fetch failed:", err);
            renderIntent(null);
            stopIntentPolling();
            if (showStatus) {
                status.innerText = "Unable to load funding state.";
            }
            return null;
        }
    }

    async function createDepositIntent() {
        if (!authReady || intentBusy || hasStartedRound || roundStarting || balanceCoversWager) return null;
        if (currentIntent && (currentIntent.status === "pending" || currentIntent.status === "funded")) {
            return currentIntent;
        }

        intentBusy = true;
        syncFundingButtons();
        syncStartButtonState();
        status.innerText = "Creating deposit request...";

        try {
            const data = await apiFetch("/greed/deposit-intent", {
                method: "POST",
                body: JSON.stringify({ wager: selectedWager })
            });

            renderIntent(data?.intent || null);

            if (currentIntent?.status === "pending") {
                status.innerText = "Waiting for your deposit...";
                startIntentPolling();
            } else if (currentIntent?.status === "funded") {
                status.innerText = "Deposit received. Start your round.";
                startIntentPolling();
            } else {
                status.innerText = "Round funding ready.";
            }

            return currentIntent;
        } catch (err) {
            console.warn("Create funding failed:", err);
            const msg = String(err?.message || "Funding failed");

            if (msg.toLowerCase().includes("invalid token") || msg.toLowerCase().includes("missing auth token")) {
                clearStoredTokens();
                authReady = false;
                renderIntent(null);
                status.innerText = "Session expired. Reopen from Telegram.";
            } else {
                status.innerText = msg;
            }

            return null;
        } finally {
            intentBusy = false;
            syncFundingButtons();
            syncStartButtonState();
        }
    }

    async function cancelDepositIntent(silent = false) {
        if (!authReady || intentBusy || !currentIntent?.id) return null;

        intentBusy = true;
        syncFundingButtons();
        syncStartButtonState();

        if (!silent) {
            status.innerText = "Cancelling funding...";
        }

        try {
            const data = await apiFetch(`/greed/deposit-intent/${currentIntent.id}/cancel`, {
                method: "POST",
                body: JSON.stringify({})
            });

            renderIntent(data?.intent || null);
            stopIntentPolling();

            if (!silent) {
                status.innerText = "Funding cancelled.";
            }

            return currentIntent;
        } catch (err) {
            console.warn("Cancel funding failed:", err);
            const msg = String(err?.message || "Cancel funding failed");

            if (!silent) {
                status.innerText = msg;
            }

            return null;
        } finally {
            intentBusy = false;
            syncFundingButtons();
            syncStartButtonState();
        }
    }

    async function replaceIntentForSelectedWager() {
        if (!authReady || intentBusy || hasStartedRound || roundStarting) return;

        await refreshBalance(true);

        if (balanceCoversWager) {
            stopIntentPolling();
            status.innerText = "Balance covers this wager. No funding needed.";
            renderIntent(null);
            return;
        }

        const existingStatus = String(currentIntent?.status || "");
        const existingWager = Number(currentIntent?.requestedWager || 0);

        if (currentIntent && (existingStatus === "pending" || existingStatus === "funded")) {
            if (existingWager === Number(selectedWager)) {
                if (existingStatus === "funded") {
                    status.innerText = "Deposit received. Start your round.";
                } else {
                    status.innerText = "Waiting for your deposit...";
                }
                return;
            }

            await cancelDepositIntent(true);
        }

        await createDepositIntent();
    }

    async function refreshIntentById(intentId, quiet = false) {
        if (!authReady || !intentId) return null;

        try {
            const data = await apiFetch(`/greed/deposit-intent/${intentId}`, { method: "GET" });
            const nextIntent = data?.intent || null;
            const previousStatus = String(currentIntent?.status || "");

            renderIntent(nextIntent);

            if (!quiet) {
                if (nextIntent?.status === "funded") {
                    status.innerText = "Deposit received. Start your round.";
                } else if (nextIntent?.status === "pending") {
                    status.innerText = "Waiting for your deposit...";
                } else if (nextIntent?.status === "expired") {
                    status.innerText = "Funding expired. Choose a wager to begin again.";
                } else if (nextIntent?.status === "cancelled") {
                    status.innerText = "Funding cancelled.";
                }
            }

            if (previousStatus !== "funded" && nextIntent?.status === "funded") {
                playStartSound();
            }

            if (!nextIntent || !["pending", "funded"].includes(String(nextIntent.status || ""))) {
                stopIntentPolling();
            }

            return nextIntent;
        } catch (err) {
            console.warn("Funding poll failed:", err);
            return null;
        }
    }

    function startIntentPolling() {
        stopIntentPolling();

        if (!currentIntent?.id) return;
        if (!["pending", "funded"].includes(String(currentIntent.status || ""))) return;

        intentPollInterval = setInterval(async () => {
            if (!currentIntent?.id || hasStartedRound || roundStarting || balanceCoversWager) return;

            await refreshIntentById(currentIntent.id, true);

            if (currentIntent?.status === "funded" && fundingPollingNoteEl) {
                fundingPollingNoteEl.textContent = "Deposit confirmed.";
            } else if (currentIntent?.status === "pending" && fundingPollingNoteEl) {
                fundingPollingNoteEl.textContent = "Waiting for deposit…";
            }

            if (intentExpiryEl && currentIntent?.expiresAt) {
                intentExpiryEl.textContent = formatExpiry(currentIntent.expiresAt);
            }
        }, 2500);
    }

    async function startBackendRound() {
        const token = authToken || getAuthToken();
        if (!token) {
            throw new Error("Missing auth token");
        }

        authToken = token;

        const wagerToUse = Number(selectedWager || DEFAULT_WAGER);

        const data = await apiFetch("/greed/start", {
            method: "POST",
            body: JSON.stringify({ wager: wagerToUse })
        });

        roundId = data.roundId;
        currentRoundWager = Number(data.fundedExactAmount || data.wager || wagerToUse || 0);
        commitHash = data?.provablyFair?.commitHash || "";
        fairnessNonce = String(data?.provablyFair?.nonce || "");
        revealedServerSeed = "";
        revealedPoisonIndices = [];
        setFairnessPanel();

        stopIntentPolling();
        renderIntent(null);

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
        if (winTitle) winTitle.innerText = isPerfect ? "PERFECT RUN" : "YOU FED THE GREED";

        if (winSubtitle) {
            if (commitHash && revealedServerSeed) {
                winSubtitle.innerText = isPerfect ? "Legendary Cash Out • Hash Revealed" : "Cashed Out • Hash Revealed";
            } else if (commitHash) {
                winSubtitle.innerText = isPerfect ? "Legendary Cash Out • Locked" : "Cashed Out • Locked";
            } else {
                winSubtitle.innerText = isPerfect ? "Legendary Cash Out" : "Cashed Out";
            }
        }

        if (winMultiplier) winMultiplier.innerText = `x${multiplier.toFixed(2)}`;
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

        if (provablyFair.commitHash) commitHash = provablyFair.commitHash;
        if (provablyFair.serverSeed) revealedServerSeed = provablyFair.serverSeed;
        if (provablyFair.nonce != null) fairnessNonce = String(provablyFair.nonce);
        if (Array.isArray(provablyFair.poisonIndices)) {
            revealedPoisonIndices = provablyFair.poisonIndices;
        }

        setFairnessPanel();
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

    function resetBoardVisuals() {
        const hitboxes = container.querySelectorAll(".donut-hitbox");
        hitboxes.forEach((hitbox) => {
            hitbox.dataset.clicked = "false";
            hitbox.classList.remove("selected", "revealed");
            hitbox.style.backgroundColor = "transparent";
            hitbox.style.pointerEvents = "none";
            hitbox.style.opacity = "1";
        });
    }

    function resetRoundStateForFreshStart() {
        stopLockingStatus();

        multiplier = 1.0;
        safeFoundCount = 0;
        isGameOver = false;
        hasStartedRound = false;
        roundStarting = false;
        roundId = null;
        currentRoundWager = 0;
        commitHash = "";
        fairnessNonce = "";
        revealedServerSeed = "";
        revealedPoisonIndices = [];
        pickInFlight = false;
        interactionLockedUntil = 0;

        multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
        updateLadder();
        updateCashoutButton();
        resetBoardVisuals();
        setFairnessPanel();

        syncFundingButtons();
        syncStartButtonState();
    }

    function openWithdrawModal() {
        if (!authReady || !withdrawModal) return;
        withdrawModal.classList.remove("hidden");
        fillText(withdrawAvailable, formatBalance(availableBalance));
        fillText(withdrawStatus, "Ready.");
        if (withdrawAmountInput) withdrawAmountInput.value = "";
        if (withdrawWalletInput) withdrawWalletInput.value = "";
        syncFundingButtons();
    }

    function closeWithdrawModal() {
        if (!withdrawModal) return;
        withdrawModal.classList.add("hidden");
        fillText(withdrawStatus, "Ready.");
        syncFundingButtons();
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.remove("hidden");
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.add("hidden");
    }

    function renderBoardList(targetEl, rows, type = "phat") {
        if (!targetEl) return;
        const list = Array.isArray(rows) ? rows : [];

        if (!list.length) {
            targetEl.innerHTML = `<div class="leaderboard-empty">No entries yet.</div>`;
            return;
        }

        targetEl.innerHTML = list.map((row, idx) => {
            const rank = Number(row.rank || idx + 1);
            const displayName = row.displayName || row.display_name || row.address || "Unknown";
            const rawValue =
                row.value ??
                row.greedScore ??
                row.greed_score ??
                row.totalWagered ??
                row.total_wagered ??
                row.netProfit ??
                row.net_profit ??
                row.perfectRuns ??
                row.perfect_runs ??
                row.biggestCashout ??
                row.biggest_cashout ??
                0;

            let formattedValue = "";
            if (type === "count") {
                formattedValue = formatNumber(rawValue);
            } else if (type === "score") {
                formattedValue = formatNumber(rawValue);
            } else {
                formattedValue = formatPhat(rawValue);
            }

            return `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">#${rank}</div>
                    <div class="leaderboard-name">${displayName}</div>
                    <div class="leaderboard-value">${formattedValue}</div>
                </div>
            `;
        }).join("");
    }

    async function submitWithdraw() {
        if (withdrawBusy || !authReady) return;

        const amount = Number(withdrawAmountInput?.value || 0);
        const destinationWallet = String(withdrawWalletInput?.value || "").trim();

        if (!Number.isFinite(amount) || amount <= 0) {
            fillText(withdrawStatus, "Enter a valid amount.");
            return;
        }

        if (amount > availableBalance) {
            fillText(withdrawStatus, "Amount exceeds available balance.");
            return;
        }

        withdrawBusy = true;
        syncFundingButtons();
        fillText(withdrawStatus, "Submitting withdrawal...");

        try {
            await apiFetch("/wallet/withdraw", {
                method: "POST",
                body: JSON.stringify({
                    amount,
                    destinationWallet: destinationWallet || undefined
                })
            });

            await refreshBalance(true);
            fillText(withdrawStatus, "Withdrawal request submitted.");

            setTimeout(() => {
                closeWithdrawModal();
            }, 900);
        } catch (err) {
            console.warn("Withdraw failed:", err);
            fillText(withdrawStatus, String(err?.message || "Withdrawal failed."));
        } finally {
            withdrawBusy = false;
            syncFundingButtons();
        }
    }

    async function refreshGreedGlobalStats() {
        if (globalStatsBusy) return null;
        globalStatsBusy = true;
        syncFundingButtons();

        try {
            const data = await apiFetch("/greed/global-stats", { method: "GET" });
            const stats = data?.stats || data || {};

            fillText(gsWagered, stats.total_wagered, formatPhat);
            fillText(gsRounds, stats.total_rounds, formatNumber);
            fillText(gsPerfect, stats.perfect_runs, formatNumber);
            fillText(gsSince, stats.rounds_since_jackpot, formatNumber);

            fillText(gsmTotalWagered, stats.total_wagered, formatPhat);
            fillText(gsmTotalRounds, stats.total_rounds, formatNumber);
            fillText(gsmBustRate, stats.bust_rate, formatPct);
            fillText(gsmCashoutRate, stats.cashout_rate, formatPct);
            fillText(gsmPerfectRuns, stats.perfect_runs, formatNumber);
            fillText(gsmCurrentJackpot, stats.current_jackpot, formatPhat);
            fillText(gsmRoundsSinceJackpot, stats.rounds_since_jackpot, formatNumber);
            fillText(gsmBiggestCashout, stats.biggest_cashout, formatPhat);

            return stats;
        } catch (err) {
            console.warn("Global stats fetch failed:", err);
            return null;
        } finally {
            globalStatsBusy = false;
            syncFundingButtons();
        }
    }

    async function refreshGreedCard() {
        if (!authReady || greedCardBusy) return null;

        greedCardBusy = true;
        syncFundingButtons();

        try {
            const data = await apiFetch("/greed/card", { method: "GET" });
            const card = data?.card || data || {};

            fillText(greedCardUsername, card.displayName || card.display_name || "@unknown");
            fillText(gcRank, card.greed_gods_rank != null ? `#${card.greed_gods_rank}` : "Unranked");
            fillText(gcTier, card.tier);
            fillText(gcTotalWagered, card.total_wagered, formatPhat);
            fillText(gcTotalRounds, card.total_rounds, formatNumber);
            fillText(gcNetProfit, card.net_profit, formatSignedPhat);
            fillText(gcCashoutRate, card.cashout_rate, formatPct);
            fillText(gcPerfectRuns, card.perfect_runs, formatNumber);
            fillText(gcTotalLost, card.total_lost, formatPhat);
            fillText(gcBusts, card.busts, formatNumber);
            fillText(gcBiggestCashout, card.biggest_cashout, formatPhat);
            fillText(gcBestRunDepth, card.best_run_depth, (v) => `${formatNumber(v)} / 10`);
            fillText(gcBiggestJackpot, card.biggest_jackpot, formatPhat);
            fillText(gcGreedScore, card.greed_score, formatNumber);

            return card;
        } catch (err) {
            console.warn("Greed card fetch failed:", err);
            status.innerText = String(err?.message || "Failed to load Greed Card.");
            return null;
        } finally {
            greedCardBusy = false;
            syncFundingButtons();
        }
    }

    async function refreshLeaderboards() {
        if (leaderboardsBusy) return null;

        leaderboardsBusy = true;
        syncFundingButtons();

        try {
            const data = await apiFetch(`/greed/leaderboards?window=lifetime&limit=10`, {
                method: "GET"
            });

            const boards = data?.boards || {};

            renderBoardList(lbBigAppetites, boards.mostWagered || boards.most_wagered || [], "phat");
            renderBoardList(lbPhatStacks, boards.mostWon || boards.most_won || [], "phat");
            renderBoardList(lbPerfectRuns, boards.perfectRuns || boards.perfect_runs || [], "count");

            renderBoardList(lbmBigAppetites, boards.mostWagered || boards.most_wagered || [], "phat");
            renderBoardList(lbmPhatStacks, boards.mostWon || boards.most_won || [], "phat");
            renderBoardList(lbmGlazeDonors, boards.topGlazeSacrifices || boards.top_glaze_sacrifices || [], "phat");
            renderBoardList(lbmPerfectRuns, boards.perfectRuns || boards.perfect_runs || [], "count");
            renderBoardList(lbmJackpotButchers, boards.biggestCashout || boards.biggest_cashout || [], "phat");

            const greedGodsFromBoards = boards.greedGods || boards.greed_gods || null;
            if (greedGodsFromBoards) {
                renderBoardList(lbGreedGods, greedGodsFromBoards, "score");
                renderBoardList(lbmGreedGods, greedGodsFromBoards, "score");
            } else {
                try {
                    const greedGodsData = await apiFetch(`/greed/gods?limit=10`, { method: "GET" });
                    const greedGodsRows = greedGodsData?.rows || greedGodsData?.leaderboard || greedGodsData || [];
                    renderBoardList(lbGreedGods, greedGodsRows, "score");
                    renderBoardList(lbmGreedGods, greedGodsRows, "score");
                } catch (innerErr) {
                    console.warn("Greed Gods fetch failed:", innerErr);
                    renderBoardList(lbGreedGods, [], "score");
                    renderBoardList(lbmGreedGods, [], "score");
                }
            }

            return boards;
        } catch (err) {
            console.warn("Leaderboards fetch failed:", err);
            return null;
        } finally {
            leaderboardsBusy = false;
            syncFundingButtons();
        }
    }

    async function beginRoundFromIntro() {
        if (!authReady) {
            status.innerText = "Session required. Reopen from Telegram.";
            return;
        }

        await refreshBalance(true);

        if (!balanceCoversWager && (!currentIntent || currentIntent.status !== "funded")) {
            status.innerText = "Fund your round first.";
            syncStartButtonState();
            return;
        }

        if (hasStartedRound || isGameOver || roundStarting) return;

        roundStarting = true;
        pickInFlight = true;
        setInteractionCooldown(START_LOCK_MIN_MS);
        setBoardPointerState("none");
        updateCashoutButton();

        startGameBtn.disabled = true;
        startGameBtn.textContent = "Starting Round...";

        playIntroSequence();
        startLockingStatus("Locking wager");

        const startTs = Date.now();

        try {
            await startBackendRound();
            await refreshBalance(true);
            await refreshGreedGlobalStats();
            await refreshLeaderboards();

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
            syncFundingButtons();
            syncStartButtonState();
        } catch (err) {
            console.warn("Backend round start failed:", err);

            roundStarting = false;
            pickInFlight = false;
            hasStartedRound = false;
            roundId = null;
            currentRoundWager = 0;
            commitHash = "";
            fairnessNonce = "";
            revealedServerSeed = "";
            revealedPoisonIndices = [];
            interactionLockedUntil = 0;
            setFairnessPanel();

            const msg = String(err?.message || "Round failed to start");
            stopLockingStatus(msg);

            if (msg.toLowerCase().includes("invalid token") || msg.toLowerCase().includes("missing auth token")) {
                clearStoredTokens();
                authReady = false;
                renderIntent(null);
                status.innerText = "Session expired. Reopen from Telegram.";
                syncFundingButtons();
                syncStartButtonState();
                return;
            }

            if (
                msg.toLowerCase().includes("funding_required") ||
                msg.toLowerCase().includes("intent") ||
                msg.toLowerCase().includes("funded")
            ) {
                await loadOpenIntent(false);
            }

            await refreshBalance(true);
            syncFundingButtons();
            syncStartButtonState();
            status.innerText = msg.includes("Insufficient")
                ? "Deposit PHAT and try again."
                : msg;
        }
    }

    async function startFreshRoundFromOverlay() {
        hideOverlays();
        resetRoundStateForFreshStart();
        showIntroOverlay();

        await ensureAuthReady(false);
        await refreshBalance(true);
        await loadOpenIntent(false);
        await refreshGreedGlobalStats();
        await refreshLeaderboards();

        playIntroSequence();

        if (balanceCoversWager) {
            status.innerText = "Balance covers this wager. Start your round.";
        } else if (currentIntent?.status === "funded") {
            status.innerText = "Deposit received. Start your round.";
        } else if (currentIntent?.status === "pending") {
            status.innerText = "Waiting for your deposit.";
        } else {
            status.innerText = authReady ? "Choose a wager to begin." : "Launch from Telegram to play.";
        }
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

        window.location.href = HUB_FALLBACK_URL;
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
                body: JSON.stringify({ roundId })
            });

            multiplier = Number(data.currentMultiplier || multiplier);
            safeFoundCount = Number(data.safeClicks || safeFoundCount);
            multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
            applyRevealData(data.provablyFair);
            updateLadder();
            await refreshJackpot();
            await refreshBalance(true);
            await refreshGreedGlobalStats();
            await refreshLeaderboards();

            fillText(winPayout, formatPhat(data.payout || 0));

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
                renderIntent(null);
                stopLockingStatus("Session expired. Reopen from Telegram.");
            } else {
                stopLockingStatus(msg);
            }

            endPickLock();
        }
    }

    function buildBoard() {
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
                    status.innerText = "Start a round first.";
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
                        await refreshBalance(true);
                        await refreshGreedGlobalStats();
                        await refreshLeaderboards();

                        fillText(poisonResultLabel, "Bust");
                        fillText(poisonResultMultiplier, `x${Number(data.currentMultiplier || 1).toFixed(2)}`);
                        fillText(poisonResultLoss, formatPhat(currentRoundWager || selectedWager || 0));

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
                        await refreshBalance(true);
                        await refreshGreedGlobalStats();
                        await refreshLeaderboards();

                        fillText(winPayout, formatPhat(data.payout || 0));
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

                    if (msg.toLowerCase().includes("invalid token") || msg.toLowerCase().includes("missing auth token")) {
                        clearStoredTokens();
                        authReady = false;
                        renderIntent(null);
                        stopLockingStatus("Session expired. Reopen from Telegram.");
                    } else {
                        stopLockingStatus(msg.includes("Donut already picked") ? "Donut already picked." : msg);
                    }

                    endPickLock();
                }
            };

            container.appendChild(hitbox);
        });
    }

    function applyPickedIndicesToBoard(pickedIndices) {
        const pickedSet = new Set((pickedIndices || []).map((n) => Number(n)));
        const hitboxes = container.querySelectorAll(".donut-hitbox");

        hitboxes.forEach((hitbox, idx) => {
            if (pickedSet.has(idx)) {
                hitbox.dataset.clicked = "true";
                hitbox.classList.add("selected", "revealed");
                hitbox.style.opacity = "0.72";
                hitbox.style.pointerEvents = "none";
            } else {
                hitbox.dataset.clicked = "false";
                hitbox.classList.remove("selected", "revealed");
                hitbox.style.opacity = "1";
                hitbox.style.backgroundColor = "transparent";
            }
        });
    }

    async function restoreActiveRoundIfAny() {
        if (!authReady) return false;

        try {
            const data = await apiFetch("/greed/active", { method: "GET" });
            if (!data?.active || !data?.round) {
                return false;
            }

            const round = data.round;
            roundId = Number(round.id);
            currentRoundWager = Number(round.wager || 0);
            hasStartedRound = true;
            roundStarting = false;
            isGameOver = false;
            pickInFlight = false;
            multiplier = Number(round.currentMultiplier || 1.0);
            safeFoundCount = Number(round.safeClicks || 0);
            commitHash = round?.provablyFair?.commitHash || "";
            fairnessNonce = String(round?.provablyFair?.nonce || "");
            revealedServerSeed = "";
            revealedPoisonIndices = [];
            setFairnessPanel();

            applyPickedIndicesToBoard(Array.isArray(round.pickedIndices) ? round.pickedIndices : []);
            multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
            updateLadder();
            updateCashoutButton();
            hideIntroOverlay();
            unlockBoard();

            status.innerText = safeFoundCount > 0 ? "Round restored." : "Choose wisely...";

            stopIntentPolling();
            renderIntent(null);
            return true;
        } catch (err) {
            console.warn("Restore active round failed:", err);
            return false;
        }
    }

    async function openGreedCardModal() {
        if (!authReady) {
            status.innerText = "Open from Telegram to view your Greed Card.";
            return;
        }
        openModal(greedCardModal);
        await refreshGreedCard();
    }

    async function openGlobalStatsModal() {
        openModal(globalStatsModal);
        await refreshGreedGlobalStats();
    }

    async function openLeaderboardsModal() {
        openModal(leaderboardsModal);
        await refreshLeaderboards();
    }

    quickWagerButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
            if (btn.disabled) return;
            const amount = Number(btn.dataset.wager || 0);
            if (amount > 0) {
                setSelectedWager(amount);
                await refreshBalance(true);

                if (balanceCoversWager) {
                    status.innerText = `Selected ${formatNumber(amount)} PHAT. Balance covers this wager.`;
                    renderIntent(null);
                    stopIntentPolling();
                } else {
                    status.innerText = `Selected ${formatNumber(amount)} PHAT. Creating deposit request...`;
                    await replaceIntentForSelectedWager();
                }
            }
        });
    });

    if (customWagerInput) {
        customWagerInput.addEventListener("change", async () => {
            if (customWagerInput.disabled) return;

            const raw = Number(customWagerInput.value || 0);
            if (!Number.isFinite(raw) || raw < 1000 || raw > 50000) {
                status.innerText = "Custom wager must be between 1,000 and 50,000 PHAT.";
                return;
            }

            setSelectedWager(raw);
            await refreshBalance(true);

            if (balanceCoversWager) {
                status.innerText = `Selected ${formatNumber(selectedWager)} PHAT. Balance covers this wager.`;
                renderIntent(null);
                stopIntentPolling();
            } else {
                status.innerText = `Selected ${formatNumber(selectedWager)} PHAT. Creating deposit request...`;
                await replaceIntentForSelectedWager();
            }
        });

        customWagerInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                customWagerInput.blur();
            }
        });
    }

    if (cancelIntentBtn) {
        cancelIntentBtn.addEventListener("click", () => cancelDepositIntent(false));
    }

    if (copyWalletBtn) {
        copyWalletBtn.addEventListener("click", copyWalletAddress);
    }

    if (copyAmountBtn) {
        copyAmountBtn.addEventListener("click", copyIntentAmount);
    }

    if (openWithdrawBtn) {
        openWithdrawBtn.addEventListener("click", openWithdrawModal);
    }

    if (withdrawCancelBtn) {
        withdrawCancelBtn.addEventListener("click", closeWithdrawModal);
    }

    if (withdrawBackdrop) {
        withdrawBackdrop.addEventListener("click", closeWithdrawModal);
    }

    if (withdrawMaxBtn) {
        withdrawMaxBtn.addEventListener("click", () => {
            if (withdrawAmountInput) {
                withdrawAmountInput.value = String(availableBalance || 0);
            }
        });
    }

    if (withdrawSubmitBtn) {
        withdrawSubmitBtn.addEventListener("click", submitWithdraw);
    }

    if (openGreedCardBtn) {
        openGreedCardBtn.addEventListener("click", openGreedCardModal);
    }

    if (openGlobalStatsBtn) {
        openGlobalStatsBtn.addEventListener("click", openGlobalStatsModal);
    }

    if (openLeaderboardsBtn) {
        openLeaderboardsBtn.addEventListener("click", openLeaderboardsModal);
    }

    if (closeGreedCardBtn) closeGreedCardBtn.addEventListener("click", () => closeModal(greedCardModal));
    if (greedCardBackdrop) greedCardBackdrop.addEventListener("click", () => closeModal(greedCardModal));
    if (gcRefreshBtn) gcRefreshBtn.addEventListener("click", refreshGreedCard);
    if (gcCloseBtn) gcCloseBtn.addEventListener("click", () => closeModal(greedCardModal));

    if (closeGlobalStatsBtn) closeGlobalStatsBtn.addEventListener("click", () => closeModal(globalStatsModal));
    if (globalStatsBackdrop) globalStatsBackdrop.addEventListener("click", () => closeModal(globalStatsModal));
    if (gsmRefreshBtn) gsmRefreshBtn.addEventListener("click", refreshGreedGlobalStats);
    if (gsmCloseBtn) gsmCloseBtn.addEventListener("click", () => closeModal(globalStatsModal));

    if (closeLeaderboardsBtn) closeLeaderboardsBtn.addEventListener("click", () => closeModal(leaderboardsModal));
    if (leaderboardsBackdrop) leaderboardsBackdrop.addEventListener("click", () => closeModal(leaderboardsModal));
    if (lbmRefreshBtn) lbmRefreshBtn.addEventListener("click", refreshLeaderboards);
    if (lbmCloseBtn) lbmCloseBtn.addEventListener("click", () => closeModal(leaderboardsModal));

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

    if (poisonViewCardBtn) {
        poisonViewCardBtn.addEventListener("click", openGreedCardModal);
    }

    if (winViewCardBtn) {
        winViewCardBtn.addEventListener("click", openGreedCardModal);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeWithdrawModal();
            closeModal(greedCardModal);
            closeModal(globalStatsModal);
            closeModal(leaderboardsModal);
        }
    });

    setSelectedWager(DEFAULT_WAGER);
    multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
    updateCashoutButton();
    updateLadder();
    setFairnessPanel();
    refreshJackpot();
    buildBoard();
    playIntroSequence();

    (async function init() {
        syncFundingButtons();
        syncStartButtonState();
        status.innerText = "Checking session...";

        await ensureAuthReady(false);
        if (!authReady) return;

        await refreshBalance(true);
        await refreshGreedGlobalStats();
        await refreshLeaderboards();

        const restored = await restoreActiveRoundIfAny();
        if (restored) return;

        if (balanceCoversWager) {
            renderIntent(null);
            stopIntentPolling();
            status.innerText = "Balance covers this wager. Start when ready.";
        } else {
            await loadOpenIntent(true);

            if (!currentIntent) {
                status.innerText = "Choose a wager to begin.";
            }
        }

        syncFundingButtons();
        syncStartButtonState();
    })();
});