import { Component, OnInit } from '@angular/core';
import { DECK } from '../../deck';
import { Card } from '../../card';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  Decks: Card[];
  numberOfDecks = 4;
  Dealer: Card[];
  Hand: Card[];
  message: string;
  runningGame = false;
  money = 1000;
  PlayerMoney = 1000;
  PlayerBet = 50;
  initialiseDecks(numberOfDecks: number): void {
    this.Decks = [];
    for (let i = 0; i < numberOfDecks; i++) {
      this.Decks = this.Decks.concat(DECK);
    }
  }
  shuffle(Decks: Card[]): void {
    for (let i = Decks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = Decks[i];
      Decks[i] = Decks[j];
      Decks[j] = temp;
    }
  }
  initGame(): void {
    if (!this.runningGame) {
      this.message = '';
      if (this.Decks.length > 3) {
        this.Dealer = [];
        this.Hand = [];
        this.runningGame = true;
        const card1: Card = this.Decks.pop();
        const card2: Card = this.Decks.pop();
        const card3: Card = this.Decks.pop();
        this.Dealer.push(card1);
        this.Hand.push(card2);
        this.Hand.push(card3);
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    } else {
      this.message = 'Game already in play';
    }
  }
  stand(): void {
    this.runningGame = false;
    let dealerScore = this.calcScore(this.Dealer);
    while (dealerScore < 17) {
      const card = this.Decks.pop();
      this.Dealer.push(card);
      dealerScore = this.calcScore(this.Dealer);
    }
    this.PlayerMoney = this.PlayerMoney + this.calculateWinnings(this.Hand, this.Dealer);
  }
  hit(): void {
    if (this.Decks.length > 0 && this.Hand.length > 0) {
      const card: Card = this.Decks.pop();
      this.Hand.push(card);
      const playerScore = this.calcScore(this.Hand);
      if (playerScore > 21) {
        this.runningGame = false;
        this.PlayerMoney = this.PlayerMoney - this.PlayerBet;
      }
    } else {
      if (this.Hand.length === 0) {
        this.message = 'Please Start the game first';
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    }
  }
  double(): void {
    console.log('double');
  }
  split(): void {
    console.log('split');
  }
  calcScore(hand: Card[]): number {
    let score = 0;
    let ace = 0;
    for (const c of hand) {
      if (c.value !== 1) {
        score = score + c.value;
      } else {
        ace++;
      }
    }
    for (let i = 0; i < ace; i++) {
      if (score + 11 > 21) {
        score = score + 1;
      } else {
        score = score + 11;
      }
    }
    return score;
  }
  calculateWinnings(playerHand: Card[], dealerHand: Card[]): number {
    const dealerScore = this.calcScore(dealerHand);
    const playerScore = this.calcScore(playerHand);
    if (dealerScore > 21) {
      if (playerHand.length === 2 && playerScore === 21) {
        return Math.floor(1.5 * this.PlayerBet);
      } else {
        return this.PlayerBet;
      }
    } else {
      if (21 - playerScore < 21 - dealerScore) {
        if (playerHand.length === 2 && playerScore === 21) {
          return Math.floor(1.5 * this.PlayerBet);
        } else {
          return this.PlayerBet;
        }
      } else {
        if (playerScore === dealerScore) {
          if (playerHand.length === 2 && playerScore === 21 && dealerHand.length > 2) {
            return Math.floor(1.5 * this.PlayerBet);
          } else {
            return 0;
          }
        } else {
          return -this.PlayerBet;
        }
      }
    }
  } //
  setMoney(amount: number): void {
    this.PlayerMoney = amount;
  }
  addBet(amount: number): void {
    this.PlayerBet = this.PlayerBet + amount;
  }
  minusBet(amount: number): void {
    if (this.PlayerBet > 50) {
      this.PlayerBet = this.PlayerBet - amount;
    }
  }
  resetBet(): void {
    this.PlayerBet = 50;
  }

  constructor() { }

  ngOnInit(): void {
    this.initialiseDecks(this.numberOfDecks);
    this.shuffle(this.Decks);
  }

}
