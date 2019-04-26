// blackjack

//Card variables
let suits = [
	'Hearts',
	'Clubs',
	'Diamonds',
	'Spades'
];
let values = [
	'Ace',
	'King',
	'Queen',
	'Jack',
	'Ten',
	'Nine',
	'Eight',
	'Seven',
	'Six',
	'Five',
	'Four',
	'Three',
	'Two'
];

//DOM variables

let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-btn');
let hitButton = document.getElementById('hit-btn');
let stayButton = document.getElementById('stay-btn');
let logo = document.getElementById('logo');

let gameStarted = false,
	gameOver = false,
	playerWon = false,
	dealerCards = [],
	playerCards = [],
	dealerScore = 0,
	playerScore = 0,
	deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

//remove logo animation
function removeLogoAni (){
	logo.classList.remove('animated', 'wobble');
	// logo.removeEventListener("animationend", handleAnimationEnd);
}

newGameButton.addEventListener('click', function (){
	textArea.classList.remove('animated', 'flash', 'infinite');
	logo.classList.add('animated', 'wobble');
	logo.addEventListener('animationend', function (){
		removeLogoAni();
	});

	gameStarted = true;
	gameOver = false;
	playerWon = false;

	deck = createDeck();
	shuffleDeck();
	dealerCards = [
		getNextCard(),
		getNextCard()
	];
	playerCards = [
		getNextCard(),
		getNextCard()
	];

	newGameButton.style.display = 'none';
	hitButton.style.display = 'inline';
	stayButton.style.display = 'inline';
	showStatus();
});

hitButton.addEventListener('click', function (){
	playerCards.push(getNextCard());
	checkForEndOfGame();
	showStatus();
});

function createImagePlayer (img){
	let image = document.createElement('img');
	image.setAttribute('src', `images/${img}.jpg`);
	image.setAttribute('style', 'height: 200px');
	document.getElementById('player').appendChild(image);
}

function createImageDealer (img){
	let image = document.createElement('img');
	image.setAttribute('src', `images/${img}.jpg`);
	image.setAttribute('style', 'height: 200px');
	document.getElementById('dealer').appendChild(image);
}

stayButton.addEventListener('click', function (){
	gameOver = true;
	checkForEndOfGame();
	showStatus();
});

function createDeck (){
	let deck = [];
	for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
		for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
			let card = {
				suit  : suits[suitIdx],
				value : values[valueIdx],
				image : getImageCharacter(values[valueIdx]) + suits[suitIdx].split('')[0]
			};
			deck.push(card);
		}
	}
	return deck;
}

function shuffleDeck (){
	for (let i = 0; i < deck.length; i++) {
		let swapIdx = Math.trunc(Math.random() * deck.length);
		let tmp = deck[swapIdx];
		deck[swapIdx] = deck[i];
		deck[i] = tmp;
	}
}

function getCardString (card){
	return card.value + ' of ' + card.suit;
}

function getImageCharacter (cardNum){
	switch (cardNum) {
		case 'Ace':
			return 'Ace';
		case 'Two':
			return '2';
		case 'Three':
			return '3';
		case 'Four':
			return '4';
		case 'Five':
			return '5';
		case 'Six':
			return '6';
		case 'Seven':
			return '7';
		case 'Eight':
			return '8';
		case 'Nine':
			return '9';
		case 'Ten':
			return '10';
		case 'Jack':
			return 'J';
		case 'Queen':
			return 'Q';
		case 'King':
			return 'K';
	}
}

function getCardNumericValue (card){
	switch (card.value) {
		case 'Ace':
			return 1;
		case 'Two':
			return 2;
		case 'Three':
			return 3;
		case 'Four':
			return 4;
		case 'Five':
			return 5;
		case 'Six':
			return 6;
		case 'Seven':
			return 7;
		case 'Eight':
			return 8;
		case 'Nine':
			return 9;
		default:
			return 10;
	}
}

function getScore (cardArray){
	let score = 0;
	let hasAce = false;
	for (let i = 0; i < cardArray.length; i++) {
		let card = cardArray[i];
		score += getCardNumericValue(card);
		if (card.value === 'Ace') {
			hasAce = true;
		}
	}
	if (hasAce && score + 10 <= 21) {
		return score + 10;
	}
	return score;
}

function updateScores (){
	dealerScore = getScore(dealerCards);
	playerScore = getScore(playerCards);
}

function checkForEndOfGame (){
	updateScores();

	if (gameOver) {
		// let dealer take cards
		while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21) {
			dealerCards.push(getNextCard());
			updateScores();
		}
	}

	if (playerScore > 21) {
		playerWon = false;
		gameOver = true;
	}
	else if (dealerScore > 21) {
		playerWon = true;
		gameOver = true;
	}
	else if (gameOver) {
		if (playerScore > dealerScore) {
			playerWon = true;
		}
		else {
			playerWon = false;
		}
	}
}

function showStatus (){
	if (!gameStarted) {
		textArea.innerText = 'May the odds be ever in your favor.' + '\n' + '\n' + "Let's play.";
		return;
	}

	updateScores();

	textArea.innerHTML = `
  <div>
    <div>
      <h5>Dealer has: <i><b style="color: green">${dealerScore}</b></i> </h5>
      <div id="dealer">
      <img style="height: 200px" src="images/${dealerCards[0].image}.jpg"/>
      <img style="height: 200px" src="images/${dealerCards[1].image}.jpg"/>
      </div>
    </div>
  
    <br>

    <div>
      <h5>You have: <i><b style="color: green">${playerScore}</b></i> </h5>
      <div id="player">
      <img style="height: 200px" src="images/${playerCards[0].image}.jpg"/>
      <img style="height: 200px" src="images/${playerCards[1].image}.jpg"/>
      </div>
    </div>
    
    <br>
  
    </div>`;

	if (playerCards.length < 12) {
		for (let i = 2; i < playerCards.length; i++) {
			createImagePlayer(playerCards[i].image);
		}
	}

	if (dealerCards.length < 12) {
		for (let i = 2; i < dealerCards.length; i++) {
			createImageDealer(dealerCards[i].image);
		}
	}

	if (gameOver) {
		if (playerScore === 21 && dealerScore != 21) {
			sideConfetti();
			textArea.classList.add('animated', 'flash', 'infinite');
			textArea.innerHTML += 'BLACKJACK!! ';
		}
		if (playerWon) {
			confetti();
			textArea.innerHTML += 'YOU WIN!';
		}
		else {
			textArea.innerHTML += 'DEALER WINS';
		}
		newGameButton.style.display = 'inline';
		hitButton.style.display = 'none';
		stayButton.style.display = 'none';
	}
}

function getNextCard (){
	return deck.shift();
}

console.log('Welcome to Blackjack!');

// confetti

function sideConfetti (){
	// 5 seconds
	var end = Date.now() + 5 * 1000;

	// left and right confetti function
	(function frame (){
		// launch a few confetti from the left edge
		confetti({
			particleCount : 7,
			angle         : 60,
			spread        : 55,
			origin        : {
				x : 0
			}
		});
		// and launch a few from the right edge
		confetti({
			particleCount : 7,
			angle         : 120,
			spread        : 55,
			origin        : {
				x : 1
			}
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
