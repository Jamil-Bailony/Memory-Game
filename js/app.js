
// define all the variables
let cardOpenedNum = 0;
let toggledCards = [], clickedCard;
let moves = 0, winCounter = 0;
let timerId = 0;
let isTimerOn = false;
let matchedPair = 0;
let displayTime;

// Constants
const TOTAL_PAIRS = 8;
const FIRST_LIMIT = 15, SECOND_LIMIT = 26;

// Create a list that holds all of the cards
let cards = document.getElementsByClassName('card');

// select the deck element
let deck = document.querySelector('.deck');

// select the go button in the welcom screen
const goButton = document.querySelector('.start--button');

// Select the body to prevent scrolling the add the event listener
const body = document.querySelector('body');

// Select the background screen
const background = document.querySelector('.background--screen');

body.addEventListener('click', cardClicked);

/*
 *
 * Functions declaration section
 *
 */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleCards(cardsToBeShuffled) {
    // convert the array-like cards to array
    let cardsArr = Array.from(cardsToBeShuffled);

    // shuffle the cardsArr elements
    cardsArr = shuffle(cardsArr);

    const fragment = document.createDocumentFragment();
    const deckElem = document.createElement('ul');
    deckElem.className = 'deck';
    fragment.appendChild(deckElem);

    for (let card of cardsArr) {
        // rearrange the elements
        deckElem.insertAdjacentElement('beforeend', card);
    }

    deck.remove();
    const scorePanel = document.querySelector('.score-panel');
    scorePanel.insertAdjacentElement('afterend', deckElem);

    deck = deckElem;
}

// This is an old function that it might have some performance issues

// function shuffleCardsOld(card) {
//     // convert the array-like cards to array
//     let cardsArr = Array.from(card);

//     // shuffle the cardsArr elements
//     cardsArr = shuffle(cardsArr);

//     for (let i = 0; i < cardsArr.length; i++) {
//         // rearrange the elements
//         deck.insertAdjacentElement('beforeend', cardsArr[i]);
//     }
// }

function showHideCard(cardTarget) {

    cardTarget.classList.toggle('open');
    cardTarget.classList.toggle('show');
}

function addToggledCard(cardToBeAdded, arrayTarget) {
    arrayTarget.push(cardToBeAdded);
}

function isCardsMatched(firstCard, secondCard) {
    if (
        firstCard.firstElementChild.className ===
        secondCard.firstElementChild.className
    ) {
        firstCard.classList.add('match');
        secondCard.classList.add('match');

        // encrement the number of matched cards
        matchedPair++;

        // empty the array
        toggledCards = [];
        return true;
    } else {
        setTimeout(function () {
            showHideCard(firstCard);
            showHideCard(secondCard);
            // empty the array
            toggledCards = [];
        }, 1000);

        return false;
    }
}

function isClickedCardValid(cardTarget) {
    return (clickedElement.classList.contains('card') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickedElement) &&
        !clickedElement.classList.contains('match'));
}

function addMoves() {
    const moveElm = document.querySelector('.moves');

    moves++;
    moveElm.textContent = moves;
}

function ScoreCheck() {
    if (moves === FIRST_LIMIT || moves === SECOND_LIMIT) {
        hideStare();
    }
}

function hideStare() {
    let stars = document.querySelectorAll('.stars > li');

    // reverse the array to hide the last star first
    for (let i = 2; i >= 0; i--) {
        if (!stars[i].classList.contains('hidden')) {
            stars[i].classList.add('hidden');
            break;
        }
    }
}


function startTimer() {
    let start = Date.now(),
        diff,
        minutes,
        seconds;
    const timeElem = document.querySelector('.time');

    function timer() {
        diff = ((Date.now() - start) / 1000) | 0;

        minutes = Math.floor(diff / 60);
        seconds = Math.floor(diff % 60);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        displayTime = `${minutes}:${seconds}`;

        timeElem.textContent = displayTime;

    }

    timer();
    timerId = setInterval(timer, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}

function showScreen(elementName, screenName) {
    elementName.classList.remove('hide');
    body.classList.add('overflow');

    switch (screenName) {
        case 'welcom':
            document.querySelector('.welcom--screen').classList.remove('hide');
            document.querySelector('.exit--screen').classList.add('hide');
            break;
        case 'exit':
            document.querySelector('.exit--screen').classList.remove('hide');
            document.querySelector('.welcom--screen').classList.add('hide');
            break;
    }
}

function hideScreen(elementName) {
    elementName.classList.add('hide');
    body.classList.remove('overflow');
}

function showSummery() {
    const stars = document.querySelector('.score-panel > .stars');
    const starsSummary = document.querySelector('.stars--summary');
    const movesSummary = document.querySelector('.moves--summary');
    const timerSummary = document.querySelector('.time--summary');

    starsSummary.innerHTML = stars.outerHTML;
    movesSummary.textContent = moves;
    timerSummary.textContent = displayTime;
}

function restartTheGame() {
    stopTimer();
    showScreen(background, 'welcom');

    // Hide cards and shuffled them again
    for (card of cards) {
        card.className = 'card';
    }
    shuffleCards(cards);
}

function resetVars() {
    // Reset variables
    moves = 0;
    displayTime = 0;
    matchedPair = 0;

    // update moves
    const moveElm = document.querySelector('.moves');
    moveElm.textContent = moves;
}

function showStars() {
    let stars = document.querySelectorAll('.stars > li');

    for(star of stars) {
        star.classList.remove('hidden');
    }
}

function startTheGame(){
    hideScreen(background);
    shuffleCards(cards);
    startTimer();
    resetVars();
    showStars();
}

function cardClicked(evt) {
    clickedElement = evt.target;

    if (isClickedCardValid(clickedElement)) {
        clickedCard = clickedElement;

        // Show the card and add it to the cards array
        showHideCard(clickedCard);
        addToggledCard(clickedCard, toggledCards);

        if (toggledCards.length === 2) { // tow cards were cliked
            isCardsMatched(toggledCards[0], toggledCards[1]); // Check if the cards matched
            addMoves();
            ScoreCheck();
        }

        if (matchedPair === TOTAL_PAIRS) { // The game is over
            stopTimer();
            showScreen(background, 'exit');
            showSummery();
        }
    } else if (clickedElement.classList.contains('start--button')) {
        startTheGame();
    } else if (clickedElement.classList.contains('restart') || clickedElement.classList.contains('fa-repeat')) {
        restartTheGame();
    }
    else if (clickedElement.classList.contains('exit--button')) {
        if (confirm('Do you want to exit?')) {
            window.close();
        }
    }

}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
