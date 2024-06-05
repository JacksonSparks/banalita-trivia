//PromptHowTo
const howtoButton = document.getElementById("button-howto");
const howtoPrompt = document.getElementById("main-body-howto-prompt");
const howtoPromptDialog = document.getElementById("howto-prompt-dialog");
const howtoPromptOverlay = document.getElementById("howto-overlay");
const howtoPromptTrigger = document.getElementById("howto-prompt-trigger");

//PromptGuess
const guessButton = document.getElementById("button-guess");
const guessPrompt = document.getElementById("main-body-guess-prompt");
const guessPromptDialog = document.getElementById("guess-dialog");
const guessPromptOverlay = document.getElementById("guess-prompt-overlay");
const guessPromptTrigger = document.getElementById("guess-prompt-trigger")

//PromptRules
const rulesButton = document.getElementById("button-rules");
const rulesPrompt = document.getElementById("main-body-rules-prompt");
const rulesPromptDialog = document.getElementById("rules-prompt-dialog");
const rulesPromptOverlay = document.getElementById("rules-overlay");
const rulesPromptTrigger = document.getElementById("rules-prompt-trigger");

//PromptPreviousGuesses
const previousGuessesButton = document.getElementById("button-previous-guesses");
const previousGuessesPrompt = document.getElementById("main-body-previous-guesses-prompt");
const previousGuessesPromptDialog = document.getElementById("previous-guesses-dialog");
const previousGuessesPromptOverlay = document.getElementById("previous-guesses-overlay");
const previousGuessesPromptTrigger = document.getElementById("previous-guesses-prompt-trigger");




document.addEventListener("DOMContentLoaded", function () {


//PromptHowTo
    howtoButton.addEventListener("click", function() {
        howtoPrompt.classList.remove("display-none");
        howtoPromptDialog.showModal();
        howtoPromptOverlay.classList.remove("display-none");
        document.body.style.overflow = "hidden";
    });

    howtoPrompt.addEventListener("click", function(e) {
        if (!howtoPromptTrigger.contains(e.target)) {
            howtoPromptDialog.close();
            howtoPrompt.classList.add("display-none");
            howtoPromptOverlay.classList.add("display-none");
            document.body.style.overflow = "";
        }
    });

//PromptGuess
    guessButton.addEventListener("click", function() {
        guessPrompt.classList.remove("display-none");
        guessPromptDialog.showModal();
        guessPromptOverlay.classList.remove("display-none");
        document.body.style.overflow = "hidden";
    });

    guessPrompt.addEventListener("click", function(e) {
        if (!guessPromptTrigger.contains(e.target)) {
            guessPromptDialog.close();
            guessPrompt.classList.add("display-none");
            guessPromptOverlay.classList.add("display-none"); // Hide the overlay
            document.body.style.overflow = "";
        }
    });

//PromptRules
    rulesButton.addEventListener("click", function() {
        rulesPrompt.classList.remove("display-none");
        rulesPromptDialog.showModal();
        rulesPromptOverlay.classList.remove("display-none");
        document.body.style.overflow = "hidden";
    });

    rulesPrompt.addEventListener("click", function(e) {
        if (!rulesPromptTrigger.contains(e.target)) {
            rulesPromptDialog.close();
            rulesPrompt.classList.add("display-none");
            rulesPromptOverlay.classList.add("display-none");
            document.body.style.overflow = "";
        }
    });

//PromptPreviousGuesses
    previousGuessesButton.addEventListener("click", function() {
        previousGuessesPrompt.classList.remove("display-none");
        previousGuessesPromptDialog.showModal();
        previousGuessesPromptOverlay.classList.remove("display-none");
        document.body.style.overflow = "hidden";
    });

    previousGuessesPrompt.addEventListener("click", function(e) {
        if (!previousGuessesPromptTrigger.contains(e.target)) {
            previousGuessesPromptDialog.close();
            previousGuessesPrompt.classList.add("display-none");
            previousGuessesPromptOverlay.classList.add("display-none");
            document.body.style.overflow = "";
        }
    });


    const inputField = document.getElementById("guess-player-input");
    const resultsUl = document.getElementById("guess-prompt-container-bottom-half");
    const hiddenAnswers = document.querySelectorAll('.hidden-answer');
    const pointsText = document.getElementById("points-text");
    const gameOverButton = document.getElementById("button-game-over");
    const strikeSvgs = document.querySelectorAll('#main-header-scoreboard-strikes-svgs svg');
    const previousGuessesUL = document.getElementById("previous-guesses-list-ul");

    let points = 0;
    let strikes = 0;
    let guessCount = 0;
    const totalPlayers = 20; // Total number of players to guess
    // Initialize a Set to keep track of guessed players
    const guessedPlayers = new Set();

    pointsText.textContent = `${points}`;

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

                        if (guessedPlayers.has(player.name)) {
                            // Player already guessed, do nothing
                            return;
                        }
                        guessedPlayers.add(player.name);

                        // Check if clicked player name matches any hidden answer
                        let matched = false;
                        hiddenAnswers.forEach(answer => {
                            if (answer.textContent.trim() === player.name) {
                                answer.classList.remove('display-none');
                                answer.classList.add('hidden-answer-correct');

                                // Increment points and update scoreboard
                                points++;
                                pointsText.textContent = `${points}`;
                                matched = true;
                            }
                        });

                        // Create the previous guess list item
                        guessCount++;
                        const prevGuessLi = document.createElement('li');
                        prevGuessLi.classList.add('previous-guesses-list-li');

                        const guessNumberDiv = document.createElement('div');
                        guessNumberDiv.classList.add('previous-guesses-number');
                        guessNumberDiv.textContent = `#${guessCount}`;

                        const guessNameDiv = document.createElement('div');
                        guessNameDiv.classList.add('previous-guesses-name');
                        guessNameDiv.textContent = player.name;

                        const guessPositionDiv = document.createElement('div');
                        guessPositionDiv.classList.add('previous-guesses-position');
                        guessPositionDiv.textContent = player.position;

                        const guessAccuracyDiv = document.createElement('div');
                        guessAccuracyDiv.classList.add('previous-guesses-accuracy');

                        const accuracySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        accuracySvg.setAttribute('viewBox', '0 0 448 512');
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

                        if (matched) {
                            accuracySvg.classList.add('previous-guesses-accuracy-svg-correct');
                            path.setAttribute('d', 'M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z');
                        } else {
                            accuracySvg.classList.add('previous-guesses-accuracy-svg-incorrect');
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
                                    }
                                });

                                shareButton.disabled = false;
                            }
                        }
                    });

                    resultsUl.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    function formatScore(points, strikes, totalPlayers, quizNumber) {
        const circles = '🔴'.repeat(strikes);
        return `Banalita #${quizNumber} | ${points}/${totalPlayers} | ${circles}`;
    }

    // Event listener for the share button
    const shareButton = document.getElementById("button-share");

    shareButton.addEventListener("click", function() {
        const quizNumber = 1; // Example quiz number, you should replace it with the actual value
        const formattedScore = formatScore(points, strikes, totalPlayers, quizNumber);

        navigator.clipboard.writeText(formattedScore).then(function() {
            alert("Score copied to clipboard: " + formattedScore);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });

});