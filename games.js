'use strict';

// class Game {
//   constructor(playersArray) {
//     this.players = playersArray;
//   }

//   shuffle(unshuffledArray) {
//     // return shuffledArray;
//   }

//   turn(time, takeTurnCallback) {
//     setTimeout(takeTurnCallback, time);
//     // timeOut utilize state to render turn component until timeout changes state
//     // if turn is complete before timeout, clear timeout after turn functions are complete
//     // decide mechanism for next turn
//     // - could use a return to indicate game state for other actions
//     // - could trigger inernally, but game needs knowledge of this higher up
//     // - could be integrated into higher order flow, single function here most likely best option
//   }
// }

// CREATE GAME DECK FUNCTIONS

function createStandardCards() {
  const standardCards = [];
  const suits = ['H', 'S', 'C', 'D'];
  for (let value = 1; value < 14; value++) {
    for (let suit of suits) {
      standardCards.push({suit, value});
    }
  }
  return standardCards;
}

function createPlayNineCards() {
  const playNineCards = [-5,-5,-5,-5];
  for (let value = 0; value < 13; value++) {
    for (let cards = 0; cards < 8; cards++) {
      playNineCards.push(value);
    }
  }
  return playNineCards;
}



// PLAYER CLASS

class Player {
  constructor(name) {
    this.name = name;
  }
}

class PokerPlayer extends Player {
  constructor(name) {
    super(name);
    this.hand = [];
    this.chips = 0;
    // currentBet, in/pending/fold, blind/dealer
  }
}

class PlayNinePlayer extends Player {
  constructor(name) {
    super(name);
    this.cards = [];
    this.blanks = 0;
    this.hand = null;
    this.discardFromHand = false;
    this.scorecard = []
  }
}



// GAME CLASS

class Game {
  constructor(createCards = createStandardCards) {    
    this.players = [];
    this.playerOrder = [];
    
    this.cards = createCards();
    this.deck = [];
  }
  
  // GAME -- GENERAL METHODS
  
  shuffle(itemsArray) {
    const shuffledItems = [];
    const items = [...itemsArray];
    
    while (items.length) {
      const selectedItem = items.splice(Math.floor(Math.random() * items.length), 1);
      shuffledItems.push(...selectedItem);
    }

    return shuffledItems;
  }
  
  // GAME -- PLAYER METHODS
  
  addPlayer(playerName) {
    const newPlayer = new PlayNinePlayer(playerName);  // CHANGE TO GAME SELECT PLAYER TYPE
    this.players.push(newPlayer);
  }
  
  shufflePlayerOrder() {
    this.playerOrder = this.shuffle(this.players);
  }
  
  // GAME -- DECK METHODS
  
  shuffleDeck() {
    this.deck = this.shuffle(this.cards);
  }
  
  dealFromDeck() {
    const selectedCard = this.deck.splice(Math.floor(Math.random() * this.deck.length), 1)[0];
    return selectedCard;
  }
}



// PLAY NINE GAME CLASS

class PlayNineGame extends Game {
  constructor(createCards = createPlayNineCards) {
    super(createCards);
    this.round = 0;
    this.turn = 1;
    this.discardPile = [];
    this.finalTurnIndex = -1;
  }
  
  // PLAYNINE -- PLAYER METHODS
  
  returnCurrentPlayerIndex() {
    const currentPlayerIndex = (this.round + this.turn) % this.playerOrder.length;
    return currentPlayerIndex;
  }
  
  replaceCard(card, cardPosition) {
    let previousCard = this.playerOrder[this.returnCurrentPlayerIndex()].cards[cardPosition];
    this.playerOrder[this.returnCurrentPlayerIndex()].cards[cardPosition] = card;
    
    if (previousCard === 'blank') {
      this.playerOrder[this.returnCurrentPlayerIndex()].blanks--;
      previousCard = this.dealFromDeck();
    }
    return previousCard;
  }
  
  dealCardToHand(card) {
    this.playerOrder[this.returnCurrentPlayerIndex()].hand = card;
  }
  
  dealCardFromHand() {
    const handCard = this.playerOrder[this.returnCurrentPlayerIndex()].hand;
    this.playerOrder[this.returnCurrentPlayerIndex()].hand = null;
    return handCard;
  }
  
  dealInitialCards(cardPosition1, cardPosition2) {
    const initialCards = new Array(8).fill('blank');
    initialCards[cardPosition1] = this.dealFromDeck();
    initialCards[cardPosition2] = this.dealFromDeck();
    this.playerOrder[this.returnCurrentPlayerIndex()].cards = initialCards;
    this.playerOrder[this.returnCurrentPlayerIndex()].blanks = 6;
  }
  
  dealToBlankCards() {
    const playerCards = this.playerOrder[this.returnCurrentPlayerIndex()].cards;
    
    for (let i = 0; i < 8; i++) {
      playerCards[i] = playerCards[i] === 'blank' ? this.dealFromDeck() : playerCards[i];
    }
  }
  
  scoreRound() {
    const playerCards = this.playerOrder[this.returnCurrentPlayerIndex()].cards;
    const currentPairs = {};
    let score = 0;
    
    for (let i = 0; i < 8; i+= 2) {
      const topCard = playerCards[i];
      const bottomCard = playerCards[i + 1];
      
      if (topCard === bottomCard && topCard > -1) {
        if (!currentPairs[topCard.toString()]) {
          currentPairs[topCard.toString()] = 0;
        }
        currentPairs[topCard.toString()]++;
      } else {
        score+= topCard + bottomCard;
      }
    }
    
    for (let pair in currentPairs) {
      if (currentPairs[pair] > 1) {
        score += (-5 * currentPairs[pair])
      }
    }
    
    this.playerOrder[this.returnCurrentPlayerIndex()].scorecard.push(score);
  }
  
  
  // PLAYNINE -- ROUND METHODS
  
  nextRound() {
    this.round++;
  }
  
  // PLAYNINE -- TURN METHODS
  
  nextTurn() {
    this.turn++;
  }
  
  // PLAYNINE -- DISCARD PILE METHODS
  
  dealToDiscard(card) {
    this.discardPile.push(card);
  }
  
  dealFromDiscard() {
    const discardPileTopCard = this.discardPile.pop();
    return discardPileTopCard;
  }
}



// RUN GAME

const here = new PlayNineGame(createPlayNineCards);
// console.log(here);

const playersNamesArr = ['Blake', 'Adam', 'Anders'];

playersNamesArr.forEach(player => here.addPlayer(player));

// GAME
// create game
// add players
// shuffle players

// ROUND
// round < 9
// shuffle deck
// deal initial cards
// round 0
// turn = 0
// finalTurnIndex < 0

// TURN
// check finalTurnIndex < 0
// deal from deck(discardFromHand = true)/discardPile to hand
// choose discard(discardFromHand) or replace
// --discard from hand to discardPile && discardFromHand
// -->> require replace deal to blank if blanks > 1
// --replace to discardPile
// check blanks > 0 for finalTurnIndex
// nextTurn

// FINAL TURNS
// turnIndex !== finalTurnIndex
// Turn
// dealToBlankCards
// nextTurn

// END ROUND
// scoreRound Loop
// nextRound

// END GAME
// allow score export to api or user
// allow start replay/leave/add players

// console.log(here);
here.shufflePlayerOrder();
here.shuffleDeck();
// console.log(here);
here.dealInitialCards(7,2);
console.log(here.playerOrder, 1);
here.nextTurn();
here.dealInitialCards(7,2);
console.log(here.playerOrder, 2);
here.nextTurn();
here.dealInitialCards(7,2);
console.log(here.playerOrder, 3);
console.log(here.deck.length);
const dealtCard = here.dealFromDeck();
here.dealCardToHand(dealtCard);
console.log(here.playerOrder, 4);
const fromHand = here.replaceCard(here.dealCardFromHand(), 6)
console.log(here.playerOrder, 4, fromHand);
console.log(here.deck.length);
here.nextTurn();
here.dealToBlankCards();
here.scoreRound();
console.log(here.playerOrder, 'yo');
here.nextTurn();
here.dealToBlankCards();
here.scoreRound();
console.log(here.playerOrder, 'yo');
here.nextTurn();
here.dealToBlankCards();
here.scoreRound();
console.log(here.playerOrder, 'yo');

