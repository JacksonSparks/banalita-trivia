/*const inputField = document.getElementById("guess-player-input");
const resultsUl = document.getElementById("guess-prompt-container-bottom-half");
const hiddenAnswers = document.querySelectorAll('.hidden-answer');
const pointsText = document.getElementById("points-text");
const guessButton = document.getElementById("button-guess");
const gameOverButton = document.getElementById("button-game-over");
const strikeSvgs = document.querySelectorAll('#main-header-scoreboard-strikes-svgs svg');
const previousGuessesUL = document.getElementById("previous-guesses-list-ul");
const hiddenAnswerXs = document.querySelectorAll('.hidden-answer-x');

let points = 0;
let strikes = 0;
let guessCount = 0;
const totalPlayers = 20; // Total number of players to guess

    inputField.addEventListener('input', function () {
        const currentInput = inputField.value;
        resultsUl.classList.remove("flex");

        // Make an AJAX request to the Python server
        fetch('http://localhost:5000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({search_string: currentInput})
        })
            .then(response => response.json())
            .then(data => {
                // Clear previous results
                resultsUl.innerHTML = '';

                // Create an <li> element for each player and append to <ul>
                data.forEach(player => {
                    const li = document.createElement('li');
                    li.classList.add('player-item');

                    const playerNameSpan = document.createElement('span');
                    playerNameSpan.textContent = player.name;
                    playerNameSpan.classList.add('player-item-name');

                    const playerPositionSpan = document.createElement('span');
                    playerPositionSpan.textContent = player.position;
                    playerPositionSpan.classList.add('player-item-position');

                    li.appendChild(playerNameSpan);
                    li.appendChild(playerPositionSpan);

                    // Add click event listener to the li element
                    li.addEventListener('click', function () {
                        inputField.value = ''; // Clear the input field
                        resultsUl.innerHTML = ''; // Clear the dropdown list

                        // Check if clicked player name matches any hidden answer
                        let matched = false;
                        hiddenAnswers.forEach(answer => {
                            if (answer.textContent.trim() === player.name) {
                                answer.classList.remove('display-none');
                                answer.classList.add('hidden-answer-correct');

                                // Find the corresponding checkmark image
                                const parentDiv = answer.closest('.flex');
                                const checkmarkImg = parentDiv.querySelector('.hidden-answer-checkmark');
                                checkmarkImg.classList.remove('display-none');

                                // Increment points and update scoreboard
                                points++;
                                pointsText.textContent = points;
                                matched = true;
                            }
                        });

                        // Create the previous guess list item
                        guessCount++;
                        const prevGuessLi = document.createElement('li');
                        prevGuessLi.classList.add('prevguess-list-li');

                        const guessNumberDiv = document.createElement('div');
                        guessNumberDiv.classList.add('prevguess-number');
                        guessNumberDiv.textContent = `#${guessCount}`;

                        const guessNameDiv = document.createElement('div');
                        guessNameDiv.classList.add('prevguess-name');
                        guessNameDiv.textContent = player.name;

                        const guessPositionDiv = document.createElement('div');
                        guessPositionDiv.classList.add('prevguess-position');
                        guessPositionDiv.textContent = player.position;

                        const guessAccuracyDiv = document.createElement('div');
                        guessAccuracyDiv.classList.add('prevguess-accuracy');

                        const accuracySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        accuracySvg.setAttribute('viewBox', '0 0 448 512');
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

                        if (matched) {
                            accuracySvg.classList.add('prevguess-accuracy-svg-correct');
                            path.setAttribute('d', 'M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z');
                        } else {
                            accuracySvg.classList.add('prevguess-accuracy-svg-incorrect');
                            path.setAttribute('d', 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z');
                        }

                        accuracySvg.appendChild(path);
                        guessAccuracyDiv.appendChild(accuracySvg);

                        prevGuessLi.appendChild(guessNumberDiv);
                        prevGuessLi.appendChild(guessNameDiv);
                        prevGuessLi.appendChild(guessPositionDiv);
                        prevGuessLi.appendChild(guessAccuracyDiv);

                        previousGuessesUL.appendChild(prevGuessLi);

                        if (matched) {
                            // Check if all players have been guessed correctly
                            if (points === totalPlayers) {
                                guessButton.classList.add('display-none');
                                gameOverButton.classList.remove('display-none');
                                document.body.style.overflow = "hidden";
                            }
                        } else {
                            strikes++;

                            // Update the strike SVGs
                            for (let i = 0; i < strikes; i++) {
                                if (strikeSvgs[i]) {
                                    strikeSvgs[i].classList.add('strike-svg');
                                }
                            }

                            // Check if the user has 5 strikes
                            if (strikes === 5) {
                                guessButton.classList.add('display-none');
                                gameOverButton.classList.remove('display-none');

                                // Add 'hidden-answer-incorrect' class to remaining hidden answers
                                hiddenAnswers.forEach(answer => {
                                    if (!answer.classList.contains('hidden-answer-correct')) {
                                        answer.classList.remove('display-none');
                                        answer.classList.add('hidden-answer-incorrect');

                                        // Find the corresponding X image
                                        const parentDiv = answer.closest('.flex');
                                        const xImg = parentDiv.querySelector('.hidden-answer-x');
                                        xImg.classList.remove('display-none');
                                    }
                                });
                            }
                        }
                    });

                    resultsUl.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });*/
