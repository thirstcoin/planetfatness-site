document.addEventListener("DOMContentLoaded", function() {
    console.log("Game Loaded");

    const container = document.getElementById('game-container');
    const status = document.getElementById('status');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const poisonOverlay = document.getElementById('poison-overlay');
    const poisonVideo = document.getElementById('poison-video');

    const winOverlay = document.getElementById('win-overlay');
    const winVideo = document.getElementById('win-video');
    const winTitle = document.getElementById('win-title');
    const winSubtitle = document.getElementById('win-subtitle');
    const winMultiplier = document.getElementById('win-multiplier');

    const introOverlay = document.getElementById('intro-overlay');
    const introVideo = document.getElementById('intro-video');
    const startGameBtn = document.getElementById('start-game-btn');

    const cashoutButton = document.getElementById('cashout-button');

    if (!container) return;

    if (poisonVideo) {
        poisonVideo.load();
    }

    if (introVideo) {
        introVideo.load();
    }

    if (winVideo) {
        winVideo.load();
    }

    let multiplier = 1.0;
    const multipliers = [1.02, 1.07, 1.15, 1.30, 1.48, 1.70, 1.98, 2.28, 2.70, 3.50];
    let safeFoundCount = 0;
    let poisonIndices = [];
    let isGameOver = false;
    let hasStartedRound = false;

    while (poisonIndices.length < 2) {
        let rand = Math.floor(Math.random() * 12);
        if (!poisonIndices.includes(rand)) poisonIndices.push(rand);
    }

    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

    function updateCashoutButton() {
        if (!cashoutButton) return;

        if (safeFoundCount > 0 && !isGameOver) {
            cashoutButton.disabled = false;
            cashoutButton.classList.add('active');
            cashoutButton.textContent = `Cash Out x${multiplier.toFixed(2)}`;

            if (safeFoundCount >= 9) {
                cashoutButton.classList.add('final-push');
            } else {
                cashoutButton.classList.remove('final-push');
            }
        } else {
            cashoutButton.disabled = true;
            cashoutButton.classList.remove('active', 'final-push');
            cashoutButton.textContent = 'Cash Out';
        }
    }

    function popMultiplier() {
        multiplierDisplay.classList.remove('multiplier-pop');
        void multiplierDisplay.offsetWidth;
        multiplierDisplay.classList.add('multiplier-pop');
    }

    function revealFinalPushHint() {
        if (safeFoundCount === 9) {
            status.innerText = "FINAL DONUT • 33% shot at x3.50";
        }
    }

    function lockBoard() {
        isGameOver = true;
        const hitboxes = container.querySelectorAll('.donut-hitbox');
        hitboxes.forEach((hitbox) => {
            hitbox.style.pointerEvents = 'none';
        });
        updateCashoutButton();
    }

    function showPoisonOverlay() {
        poisonOverlay.style.display = 'flex';

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
        winSubtitle.innerText = isPerfect ? "Legendary Cash Out" : "Cashed Out";
        winMultiplier.innerText = `x${multiplier.toFixed(2)}`;

        winOverlay.style.display = 'flex';

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
            introOverlay.classList.add('hidden');
        }
    }

    function cashOutNow() {
        if (isGameOver || safeFoundCount < 1) return;
        lockBoard();
        status.innerText = "Cash out locked in.";
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

        introVideo.addEventListener('ended', function() {
            startGame();
        });
    }

    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }

    if (cashoutButton) {
        cashoutButton.addEventListener('click', cashOutNow);
    }

    multiplierDisplay.innerText = `x${multiplier.toFixed(2)}`;
    updateCashoutButton();

    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';

        hitbox.style.position = 'absolute';
        hitbox.style.left = pos.x + '%';
        hitbox.style.top = pos.y + '%';
        hitbox.style.transform = 'translate(-50%, -50%)';

        hitbox.onclick = function() {
            if (isGameOver || this.dataset.clicked === "true") return;
            this.dataset.clicked = "true";
            this.classList.add('selected', 'revealed');

            if (!hasStartedRound) {
                hasStartedRound = true;
                status.innerText = "Choose carefully.";
            }

            if (poisonIndices.includes(index)) {
                this.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
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