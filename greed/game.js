let currentRoundId = null;

async function startNewGame(wagerAmount) {
    const response = await fetch('https://your-backend.render.com/greed/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify({ wager: wagerAmount, mode: 'classic' })
    });
    const data = await response.json();
    currentRoundId = data.roundId;
}

async function bite(donutIndex) {
    if (!currentRoundId) return alert("Place a bet first!");
    
    const response = await fetch('https://your-backend.render.com/greed/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify({ roundId: currentRoundId, choice: donutIndex })
    });
    
    const result = await response.json();
    if (result.status === 'lost') {
        triggerNauseousPhil(); // Show the green screen effect
    } else {
        updateMultiplier(result.multiplier);
    }
}
