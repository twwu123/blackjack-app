import { Hand } from './hand';

export class Player {
  PlayerMoney: number;
  PlayerOriginalBet: number;
  PlayerBets: number[];
  PlayerHands: Hand[];
  currentHandIndex: number;
  constructor(money: number, bet: number, hands: Hand[], index = 0) {
    this.PlayerMoney = money;
    this.PlayerOriginalBet = bet;
    this.PlayerBets = [bet];
    this.PlayerHands = hands;
    this.currentHandIndex = index;
}
}
