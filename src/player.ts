import { Hand } from './hand';

export class Player {
  PlayerMoney: number;
  PlayerOriginalBet: number; // Since doubling actually changes bet numbers, we track their original bet value
  PlayerBets: number[]; // Players can have multiple hands where they can double, so there can be multiple bets
  PlayerHands: Hand[]; // Players can have multiple hands when they split
  currentHandIndex: number; // This tracks which hand they're currently playing
  constructor(money: number, bet: number, hands: Hand[], index = 0) {
    this.PlayerMoney = money;
    this.PlayerOriginalBet = bet;
    this.PlayerBets = [bet];
    this.PlayerHands = hands;
    this.currentHandIndex = index;
}
}
