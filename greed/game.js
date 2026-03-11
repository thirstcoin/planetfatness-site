// These are the coordinates for the donuts in your image
const positions = [
    { x: 17, y: 34 }, { x: 38, y: 34 }, { x: 60, y: 34 }, { x: 81, y: 34 },
    { x: 15, y: 54 }, { x: 38, y: 54 }, { x: 61, y: 54 }, { x: 83, y: 54 },
    { x: 13, y: 74 }, { x: 37, y: 74 }, { x: 62, y: 74 }, { x: 86, y: 74 }
];

const container = document.getElementById('game-container');

// This creates the invisible buttons over the board
positions.forEach((pos, index) => {
    const hitbox = document.createElement('div');
    hitbox.className = 'donut-hitbox';
    hitbox.style.width = '12%'; 
    hitbox.style.height = '15%';
    hitbox.style.left = pos.x + '%';
    hitbox.style.top = pos.y + '%';
    hitbox.onclick = () => bite(index);
    container.appendChild(hitbox);
});

function bite(id) {
    console.log("Player bit donut at index:", id);
    document.getElementById('status').innerText = "Biting donut #" + id + "...";
}
