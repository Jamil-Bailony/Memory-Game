
// define all the variables
let cardOpenedNum = 0;
let toggledCards = [], clickedCard;
let moves = 0, winCounter = 0;


// Create a list that holds all of your cards
let cards = document.getElementsByClassName('card');

// select the deck element
let deck = document.querySelector('.deck');

shuffleCards(cards);


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


deck.addEventListener('click', function cardClicked(evt) {

    if (evt.target.classList.contains('card')) {
        oldCard = clickedCard;
        clickedCard = evt.target;

        if (isClickedCardValid(clickedCard)) {
            showHideCard(clickedCard);
            addToggledCard(clickedCard, toggledCards);

            if (toggledCards.length === 2) {
                isCardsMatched(toggledCards[0], toggledCards[1]);
                addMoves();
                ScoreCheck();
            }
        }

    }
});

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
    return (clickedCard.classList.contains('card') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickedCard) &&
        !clickedCard.classList.contains('match'));
}

function addMoves() {
    const moveElm = document.querySelector('.moves');

    moves++;
    moveElm.textContent = moves;
}

function ScoreCheck() {
    if (moves === 14 || moves === 20) {
        hideStare();
    }
}

function hideStare() {
    let stars = document.querySelectorAll('.stars > li');

    // reverse the array to hide the last star first
    for(let i = 2; i >= 0; i--){
        if(!stars[i].classList.contains('hidden')){
            stars[i].classList.add('hidden');
            break;
        }
    }
}