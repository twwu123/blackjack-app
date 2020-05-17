import { Component, OnInit } from '@angular/core';
import { DECK } from '../../deck';
import { Card } from '../../card';
import {BasicStrategyService} from 'src/app/services/basic-strategy.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  Decks: Card[];
  numberOfDecks = 4;
  Dealer: Card[];
  PlayerHand: Card[];
  message: string;
  runningGame = false;
  money = 1000;
  PlayerMoney = 1000;
  PlayerBet = 50;
  CardBack: Card = {value: 0, suit: 'NA', face: 'NA', img: 'assets/imgs/cards/cardback.png'};
  
  constructor(private basicStrategyService: BasicStrategyService) { }
 
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
  dealCards(): void {
    if (!this.runningGame) {
      this.message = '';
      if (this.Decks.length > 3) {
        this.Dealer = [];
        this.PlayerHand = [];
        this.runningGame = true;
        this.DealCard(this.Dealer);
        this.Dealer.push(this.CardBack);
        this.DealCard(this.PlayerHand, 2);
        if (this.calcScore(this.PlayerHand) === 21) {
          this.stand();
        }
        console.log(this.basicStrategyService.DecideBSAction(this.Dealer, this.PlayerHand));
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    } else {
      this.message = 'Game already in play';
    }
  }
  DealCard(hand: Card[], amount: number = 1): void{
    for (let x = 0; x < amount; x++){
      const card: Card = this.Decks.pop();
      hand.push(card);
    }
  }
  stand(): void {
    this.runningGame = false;
    let dealerScore = this.calcScore(this.Dealer);
    this.Dealer.pop(); // popping off card back
    while (dealerScore < 17) {
      this.DealCard(this.Dealer);
      dealerScore = this.calcScore(this.Dealer);
    }
    this.PlayerMoney = this.PlayerMoney + this.calculateWinnings(this.PlayerHand, this.Dealer);
  }
  hit(): void {
    if (this.Decks.length > 0 && this.PlayerHand.length > 0) {
      this.DealCard(this.PlayerHand);
      const playerScore = this.calcScore(this.PlayerHand);
      if (playerScore > 21) {
        this.runningGame = false;
        this.PlayerMoney = this.PlayerMoney - this.PlayerBet;
      }
      console.log(this.basicStrategyService.DecideBSAction(this.Dealer, this.PlayerHand));
    } else {
      if (this.PlayerHand.length === 0) {
        this.message = 'Please Start the game first';
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    }
  }
  double(): void {
    if (this.Decks.length > 0 && this.PlayerHand.length > 0) {
      this.DealCard(this.PlayerHand);
      this.addBet(this.PlayerBet);
      const playerScore = this.calcScore(this.PlayerHand);
      if (playerScore > 21) {
        this.runningGame = false;
        this.PlayerMoney = this.PlayerMoney - this.PlayerBet;
        this.PlayerBet = Math.floor(this.PlayerBet / 2);
      }else{
        this.stand();
        this.PlayerBet = Math.floor(this.PlayerBet / 2);
      }
    } else {
      if (this.PlayerHand.length === 0) {
        this.message = 'Please Start the game first';
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    }
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
  }
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

  ngOnInit(): void {
    this.initialiseDecks(this.numberOfDecks);
    this.shuffle(this.Decks);
  }



}
