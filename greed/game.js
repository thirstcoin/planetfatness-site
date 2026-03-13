document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const poisonOverlay = document.getElementById('poison-overlay');
    const startScreen = document.getElementById('start-screen');
    const openingVideo = document.getElementById('opening-video');
    const poisonVideo = document.getElementById('poison-video');
    
    // --- GAME STATE ---
    let multiplier = 1.0;
    const multipliers = [1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7, 3.0];
    let goldFoundCount = 0;
    let poisonIndices = [];
    let isGameOver = false;

    // Randomly assign 2 poison indices
    while (poisonIndices.length < 2) {
        let rand = Math.floor(Math.random() * 12);
        if (!poisonIndices.includes(rand)) poisonIndices.push(rand);
    }

    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

    // --- START LOGIC ---
    startScreen.addEventListener('click', () => {
        startScreen.style.display = 'none';
        
        // Ensure video is loaded into memory before playback
        openingVideo.load();
        openingVideo.style.display = 'block';
        
        // Attempt playback with fallback
        openingVideo.play().then(() => {
            console.log("Video started successfully");
        }).catch(e => {
            console.error("Playback blocked:", e);
            // If the video stays black or fails, force move to game
            openingVideo.style.display = 'none';
            container.style.display = 'block';
        });
    });

    openingVideo.onended = () => {
        openingVideo.style.display = 'none';
        container.style.display = 'block';
    };

    // --- HITBOX GENERATION ---
    container.innerHTML = '';
    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        Object.assign(hitbox.style, {
            position: 'absolute', left: pos.x + '%', top: pos.y + '%',
            transform: 'translate(-50%, -50%)', width: '7%', height: '7%',
            cursor: 'pointer', zIndex: '100',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid white', borderRadius: '50%'
        });

        hitbox.onclick = () => {
            if (isGameOver || hitbox.dataset.clicked === "true") return;
            hitbox.dataset.clicked = "true";
            hitbox.classList.add('chosen');

            if (poisonIndices.includes(index)) {
                isGameOver = true;
                hitbox.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                status.innerText = "POISON! Game Over.";
                
                // Trigger Poison Video
                container.style.display = 'none';
                poisonVideo.style.display = 'block';
                poisonVideo.play();
                
                poisonVideo.onended = () => {
                    poisonVideo.style.display = 'none';
                    poisonOverlay.style.display = 'flex';
                };
            } else {
                multiplier = multipliers[goldFoundCount] || 3.0;
                goldFoundCount++;
                multiplierDisplay.innerText = `x${multiplier.toFixed(1)}`;
                status.innerText = `Gold Found!`;
            }
        };
        container.appendChild(hitbox);
    });
});
