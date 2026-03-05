function bite(id) {
    console.log("Biting donut:", id);
    const status = document.getElementById('status');
    // MOCK LOGIC: Simulate hitting a poison donut on the first try
    if (Math.random() > 0.8) {
        status.innerText = "NAUSEOUS PHIL! You lost.";
        document.body.style.backgroundColor = "green";
    } else {
        status.innerText = "Winner! Multiplier increasing...";
    }
}
