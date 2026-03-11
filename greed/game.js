// Keep the alert to confirm the file loaded
alert("JS is running!");

function setupGame() {
    let container = document.getElementById('game-container');
    
    // If the HTML div is missing for some reason, this creates it
    if (!container) {
        container = document.createElement('div');
        container.id = 'game-container';
        document.body.prepend(container);
    }

    // FORCE CSS via JS (Overriding the CSS file)
    container.style.position = 'relative';
    container.style.width = '100vw';
    container.style.height = '66.6vw'; // Maintains the 1536/1024 ratio
    container.style.backgroundImage = "url('../assets/greed/board.png')";
    container.style.backgroundSize = 'contain';
    container.style.backgroundRepeat = 'no-repeat';
    container.style.border = '5px solid yellow'; 

    const positions = [
        { x: 17, y: 34 }, { x: 38, y: 34 }, { x: 60, y: 34 }, { x: 81, y: 34 },
        { x: 17, y: 54 }, { x: 38, y: 54 }, { x: 61, y: 54 }, { x: 83, y: 54 },
        { x: 17, y: 74 }, { x: 38, y: 74 }, { x: 62, y: 74 }, { x: 86, y: 74 }
    ];

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Force styles so we can see them
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            width: '12%',
            height: '15%',
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            border: '2px solid white',
            borderRadius: '50%',
            zIndex: '9999',
            display: 'block'
        });

        hitbox.onclick = () => {
            alert("You bit donut " + (index + 1));
        };

        container.appendChild(hitbox);
    });
}

// Try to run it every 500ms until the body is found
const checkExist = setInterval(function() {
   if (document.body) {
      setupGame();
      clearInterval(checkExist);
   }
}, 500);
