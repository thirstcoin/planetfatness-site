document.addEventListener("DOMContentLoaded", function() {
    console.log("Game Loaded");
    
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const poisonOverlay = document.getElementById('poison-overlay');
    const poisonVideo = document.getElementById('poison-video');
    
    if (!container) return;

    // Try to warm the video into memory for smoother mobile playback
    if (poisonVideo) {
        poisonVideo.load();
    }

    // --- Phat Phrase Library ---
    const phatPhrases = [
        "Phat donut secured!",
        "Deliciously gluttonous!",
        "Feed your greed!",
        "Calories approved!",
        "Phil says: Take another bite!",
        "Sugar rush activated!",
        "Donut demolished!",
        "Leveling up the gains!",
        "Pure glaze heaven!"
    ];

    let multiplier = 1.0;
    const multipliers = [1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7, 3.0];
    let goldFoundCount = 0;
    let poisonIndices = [];
    let isGameOver = false;

    while (poisonIndices.length < 2) {
        let rand = Math.floor(Math.random() * 12);
        if (!poisonIndices.includes(rand)) poisonIndices.push(rand);
    }

    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

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

            this.classList.add('selected');

            if (poisonIndices.includes(index)) {
                this.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                isGameOver = true;
                status.innerText = "POISON! Game Over.";
                showPoisonOverlay();
            } else {
                const randomPhrase = phatPhrases[Math.floor(Math.random() * phatPhrases.length)];
                status.innerText = randomPhrase;
                
                multiplier = multipliers[goldFoundCount] || 3.0;
                goldFoundCount++;
                multiplierDisplay.innerText = `x${multiplier.toFixed(1)}`;
            }
        };

        container.appendChild(hitbox);
    });
});