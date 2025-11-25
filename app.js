let gamesList = []; // Store fetched games

document.querySelector('#loadBtn').addEventListener('click', () => {
    //set our default values but allow user to input their own
    const username = document.querySelector('#username').value || 'stealth0418';
    const year = document.querySelector('#year').value || '2025';
    const month = document.querySelector('#month').value || '11';

    //fetch games  from chess.com using their api
    const url = `https://api.chess.com/pub/player/${username}/games/${year}/${month.toString().padStart(2,'0')}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.games || data.games.length == 0) {
                document.querySelector('#status').innerText = "No games found.";
                document.querySelector('#gameSelect').innerHTML = '<option value="">-- No games --</option>';
                return;
            }

            gamesList = data.games;

            //populate dropdown with games
            const select = document.querySelector('#gameSelect');
            if (gamesList.length == 1) {
                //only one game, display directly
                const game = gamesList[0];
                PGNV.pgnView('board', { pgn: game.pgn, pieceStyle: 'merida', boardSize: 600 });
                document.getElementById('status').innerText =
                    `Showing game: ${game.white.username} vs ${game.black.username}`;
                select.style.display = 'none';
            } else {
                //multiple games,populate dropdown
                select.style.display = 'inline';
                select.innerHTML = ''; 
                gamesList.forEach((game, index) => {
                    const white = game.white.username;
                    const black = game.black.username;
                    const result = game.white.result === 'win' ? '1-0' :
                                   game.black.result === 'win' ? '0-1' : '½-½';
                    const option = document.createElement('option');
                    option.value = index;
                    option.text = `${white} vs ${black} (${result})`;
                    select.appendChild(option);
                });
                document.querySelector('#status').innerText = `Select a game to view for ${username}`;
            }
        })
        .catch(err => {
            console.error(err);
            document.querySelector('#status').innerText = "Error retrieving data.";
        });
});

// When user selects a game from dropdown
document.querySelector('#gameSelect').addEventListener('change', (e) => {
    const index = e.target.value;
    if (index == '') return;

    const selectedGame = gamesList[index];
    PGNV.pgnView('board', {
        pgn: selectedGame.pgn,
        pieceStyle: 'merida',
        boardSize: 600
    });

    document.querySelector('#status').innerText =
        `Showing game: White: ${selectedGame.white.username} vs Black: ${selectedGame.black.username}`;
});
