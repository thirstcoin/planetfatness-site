// These are the coordinates for the donuts in your image
const positions = [
    { x: 17, y: 34 }, { x: 38, y: 34 }, { x: 60, y: 34 }, { x: 81, y: 34 }, // Row 1
    { x: 17, y: 54 }, { x: 38, y: 54 }, { x: 60, y: 54 }, { x: 81, y: 54 }, // Row 2
    { x: 17, y: 74 }, { x: 38, y: 74 }, { x: 60, y: 74 }, { x: 81, y: 74 }  // Row 3
];

const container = document.getElementById('game-container');

// Clear existing items in case of a refresh
container.innerHTML = ''; 

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
