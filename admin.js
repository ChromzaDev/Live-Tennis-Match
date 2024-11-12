let timer;
let elapsedTime = 0;
let matchInProgress = false;
let liveMatches = JSON.parse(localStorage.getItem('liveMatches')) || [];

// Fonction pour démarrer le timer
function startTimer() {
    const timerDisplay = document.getElementById("timer-display");
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        elapsedTime++;
        const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// Fonction pour réinitialiser le timer
function resetTimer() {
    clearInterval(timer);
    elapsedTime = 0;
    document.getElementById("timer-display").textContent = "00:00:00";
}

// Fonction pour créer un nouveau match
function createMatch() {
    const matchName = document.getElementById("match-name").value;
    const matchDate = document.getElementById("match-date").value;
    const player1 = document.getElementById('player1-name').value;
    const player2 = document.getElementById('player2-name').value;
    const adminMessage = document.getElementById("admin-message");

    if (matchName && matchDate && player1 && player2) {
        const newMatch = {
            id: `match${liveMatches.length + 1}`,
            name: matchName,
            players: `${player1} vs ${player2}`,
            date: matchDate,
            score: "0 - 0",
            timerId: `timer${liveMatches.length + 1}`,
            elapsedTime: 0
        };

        liveMatches.push(newMatch);
        localStorage.setItem('liveMatches', JSON.stringify(liveMatches));
        displayMatch(newMatch);
        adminMessage.textContent = `Le match "${matchName}" a été programmé pour le ${matchDate}.`;
        adminMessage.style.color = "green";
    } else {
        adminMessage.textContent = "Veuillez remplir tous les champs.";
        adminMessage.style.color = "red";
    }
}

// Fonction pour lancer le match
function startMatch() {
    if (!matchInProgress) {
        matchInProgress = true;
        alert("Le match a commencé !");
    } else {
        alert("Un match est déjà en cours.");
    }
}

// Fonction pour mettre à jour le score
function updateScore(matchId, player) {
    const match = liveMatches.find(m => m.id === matchId);
    if (match) {
        let scores = match.score.split(' - ').map(Number);
        if (player === 1) {
            scores[0] += 1;
        } else if (player === 2) {
            scores[1] += 1;
        }
        match.score = `${scores[0]} - ${scores[1]}`;
        document.getElementById(`${matchId}-score`).textContent = `Score: ${match.score}`;
        localStorage.setItem('liveMatches', JSON.stringify(liveMatches));
    }
}

// Fonction pour terminer le match
function endMatch() {
    if (matchInProgress) {
        matchInProgress = false;
        alert("Le match est terminé.");
        resetTimer();
        document.getElementById("live-score").textContent = "Score actuel : 0 - 0";
    } else {
        alert("Aucun match en cours.");
    }
}

// Fonction pour supprimer un match
function deleteMatch(matchId) {
    liveMatches = liveMatches.filter(m => m.id !== matchId);
    localStorage.setItem('liveMatches', JSON.stringify(liveMatches));
    document.getElementById('live-match-list').innerHTML = '';
    document.getElementById('admin-match-list').innerHTML = '';
    liveMatches.forEach(displayMatch);
    liveMatches.forEach(displayAdminMatch);
}

// Fonction pour afficher un match dans la liste des matchs en direct
function displayMatch(match) {
    const matchList = document.getElementById('live-match-list');
    const matchCard = document.createElement('div');
    matchCard.classList.add('match-card');
    matchCard.innerHTML = `
        <div class="match-info">
            <h3>${match.players}</h3>
            <p id="${match.id}-score">Score: ${match.score}</p>
        </div>
        <div class="match-timer">
            <p>Temps écoulé: <span id="${match.timerId}">00:00:00</span></p>
        </div>
    `;
    matchList.appendChild(matchCard);

    let elapsedTime = match.elapsedTime;
    setInterval(() => {
        elapsedTime++;
        match.elapsedTime = elapsedTime;
        const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');
        document.getElementById(match.timerId).textContent = `${hours}:${minutes}:${seconds}`;
        localStorage.setItem('liveMatches', JSON.stringify(liveMatches));
    }, 1000);
}

// Fonction pour afficher un match dans l'interface admin
function displayAdminMatch(match) {
    const adminMatchList = document.getElementById('admin-match-list');
    const matchCard = document.createElement('div');
    matchCard.classList.add('match-card');
    matchCard.innerHTML = `
        <div class="match-info">
            <h3>${match.players}</h3>
            <p id="${match.id}-score">Score: ${match.score}</p>
        </div>
        <div class="score-update">
            <button onclick="updateScore('${match.id}', 1)">+1 Joueur 1</button>
            <button onclick="updateScore('${match.id}', 2)">+1 Joueur 2</button>
            <button onclick="deleteMatch('${match.id}')">Supprimer le Match</button>
        </div>
    `;
    adminMatchList.appendChild(matchCard);
}

// Initialisation - Charger les matchs sauvegardés et les afficher
document.addEventListener('DOMContentLoaded', function () {
    liveMatches.forEach(displayMatch);
    liveMatches.forEach(displayAdminMatch);
});