// blackjack

//Card variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let values = [
  "Ace",
  "King",
  "Queen",
  "Jack",
  "Ten",
  "Nine",
  "Eight",
  "Seven",
  "Six",
  "Five",
  "Four",
  "Three",
  "Two"
];

//DOM variables

let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-btn");
let hitButton = document.getElementById("hit-btn");
let stayButton = document.getElementById("stay-btn");

let gameStarted = false,
  gameOver = false,
  playerWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";
showStatus();

newGameButton.addEventListener("click", function() {
  textArea.classList.remove("animated", "flash", "infinite");

  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck();
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  newGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  showStatus();
});

hitButton.addEventListener("click", function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener("click", function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  return card.value + " of " + card.suit;
}

function getCardNumericValue(card) {
  switch (card.value) {
    case "Ace":
      return 1;
    case "Two":
      return 2;
    case "Three":
      return 3;
    case "Four":
      return 4;
    case "Five":
      return 5;
    case "Six":
      return 6;
    case "Seven":
      return 7;
    case "Eight":
      return 9;
    case "Nine":
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === "Ace") {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
  updateScores();

  if (gameOver) {
    // let dealer take cards
    while (
      dealerScore < playerScore &&
      playerScore <= 21 &&
      dealerScore <= 21
    ) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
    } else {
      playerWon = false;
    }
  }
}

function showStatus() {
  if (!gameStarted) {
    textArea.innerText =
      "May the odds be ever in your favor." + "\n" + "\n" + "Let's play.";
    return;
  }

  let dealerCardString = "";
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + "\n";
  }

  let playerCardString = "";
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + "\n";
  }

  updateScores();

  textArea.innerText =
    "Dealer has: \n" +
    dealerCardString +
    "(score: " +
    dealerScore +
    ")\n\n" +
    "You have: \n" +
    playerCardString +
    "(score: " +
    playerScore +
    ")\n\n";

  if (gameOver) {
    if (playerScore === 21 && dealerScore != 21) {
      drop();
      textArea.classList.add("animated", "flash", "infinite");
      textArea.innerText += "BLACKJACK!!" + "\n";
    }
    if (playerWon) {
      textArea.innerText += "YOU WIN!";
    } else {
      textArea.innerText += "DEALER WINS";
    }
    newGameButton.style.display = "inline";
    hitButton.style.display = "none";
    stayButton.style.display = "none";
  }
}

//for (var i = 0; i < deck.length; i++){
//textArea.innerText += '\n' + getCardString(deck[i]);
//}

function getNextCard() {
  return deck.shift();
}

console.log("Welcome to Blackjack!");

// confetti

function drop() {
  // 5 seconds
  var end = Date.now() + 5 * 1000;

  // left and right confetti function
  (function frame() {
    // launch a few confetti from the left edge
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    // and launch a few from the right edge
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  // fireworks confetti

  // var interval = setInterval(function() {
  //   if (Date.now() > end) {
  //     return clearInterval(interval);
  //   }

  //   confetti({
  //     startVelocity: 30,
  //     spread: 360,
  //     ticks: 60,
  //     origin: {
  //       x: Math.random(),
  //       // since they fall down, start a bit higher than random
  //       y: Math.random() - 0.2
  //     }
  //   });
  // }, 100);
}
