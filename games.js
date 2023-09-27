'use strict';

class Game {
  constructor(playersArray) {
    this.players = playersArray;
  }

  shuffle(unshuffledArray) {
    // return shuffledArray;
  }

  turn(time, takeTurnCallback) {
    setTimeout(takeTurnCallback, time);
    // timeOut utilize state to render turn component until timeout changes state
    // if turn is complete before timeout, clear timeout after turn functions are complete
    // decide mechanism for next turn
    // - could use a return to indicate game state for other actions
    // - could trigger inernally, but game needs knowledge of this higher up
    // - could be integrated into higher order flow, single function here most likely best option
  }
}
