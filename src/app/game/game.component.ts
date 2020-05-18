import { Component, OnInit } from '@angular/core';
import { DECK } from '../../deck';
import { Card } from '../../card';
import { Hand } from '../../hand';
import {BasicStrategyService} from 'src/app/services/basic-strategy.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  Decks: Card[];
  numberOfDecks = 4;
  DealerHand: Hand = new Hand();
  PlayerHand: Hand = new Hand();
  PlayerSecondHand: Hand = new Hand();
  currentHand: Hand = this.PlayerHand;
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
        this.DealerHand.cards = [];
        this.PlayerHand.cards = [];
        this.PlayerSecondHand.cards = [];
        this.currentHand = this.PlayerHand;
        this.runningGame = true;
        this.DealCard(this.DealerHand, 2);
        this.DealCard(this.PlayerHand, 2);
        if (this.PlayerHand.score() === 21) {
          this.stand(this.PlayerHand);
        }
        console.log(this.basicStrategyService.DecideBSAction(this.DealerHand.cards, this.PlayerHand.cards));
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    } else {
      this.message = 'Game already in play';
    }
  }
  DealCard(hand: Hand, amount: number = 1): void{
    for (let x = 0; x < amount; x++){
      const card: Card = this.Decks.pop();
      hand.addCard(card);
    }
  }
  stand(playingHand: Hand): void {
    if (this.PlayerSecondHand.cards.length === 0) {
      this.runningGame = false;
      while (this.DealerHand.score() < 17) {
        this.DealCard(this.DealerHand);
      }
      this.PlayerMoney = this.PlayerMoney + this.calculateWinnings(playingHand, this.DealerHand);
    } else {
      if (this.currentHand === this.PlayerHand) {
        this.currentHand = this.PlayerSecondHand;
      } else {
        this.runningGame = false;
        while (this.DealerHand.score() < 17) {
          this.DealCard(this.DealerHand);
        }
        this.PlayerMoney = this.PlayerMoney + this.calculateWinnings(this.PlayerHand, this.DealerHand);
        this.PlayerMoney = this.PlayerMoney + this.calculateWinnings(this.PlayerSecondHand, this.DealerHand);
      }
    }
  }
  hit(playingHand: Hand): void {
    if (this.Decks.length > 0 && playingHand.cards.length > 0) {
      this.DealCard(playingHand);
      if (playingHand.score() > 21) {
        if (playingHand === this.PlayerHand && this.PlayerSecondHand.cards.length === 0) {
          this.runningGame = false;
          this.PlayerMoney = this.PlayerMoney - this.PlayerBet;
        } else {
          if (playingHand === this.PlayerSecondHand) {
            this.runningGame = false;
            this.PlayerMoney = this.PlayerMoney - this.PlayerBet;
          } else {
            this.currentHand = this.PlayerSecondHand;
          }
        }
      }
      console.log(this.basicStrategyService.DecideBSAction(this.DealerHand.cards, this.PlayerHand.cards));
    } else {
      if (playingHand.cards.length === 0) {
        this.message = 'Please Start the game first';
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    }
  }
  double(playingHand: Hand): void {
    if (this.Decks.length > 0 && this.PlayerHand.cards.length > 0) {
      this.DealCard(playingHand);
      this.addBet(this.PlayerBet);
      if (playingHand.score() > 21) {
        this.runningGame = false;
        this.PlayerMoney = this.PlayerMoney - this.PlayerBet;
        this.PlayerBet = Math.floor(this.PlayerBet / 2);
      }else{
        this.stand(playingHand);
        this.PlayerBet = Math.floor(this.PlayerBet / 2);
      }
    } else {
      if (this.PlayerHand.cards.length === 0) {
        this.message = 'Please Start the game first';
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    }
  }
  split(): void {
    const card: Card = this.PlayerHand.popCard();
    this.PlayerSecondHand.addCard(card);
  }

  calculateWinnings(playerHand: Hand, dealerHand: Hand): number {
    if (dealerHand.score() > 21) {
      if (playerHand.cards.length === 2 && playerHand.score() === 21) {
        return Math.floor(1.5 * this.PlayerBet);
      } else {
        return this.PlayerBet;
      }
    } else {
      if (21 - playerHand.score() < 21 - dealerHand.score()) {
        if (playerHand.cards.length === 2 && playerHand.score() === 21) {
          return Math.floor(1.5 * this.PlayerBet);
        } else {
          return this.PlayerBet;
        }
      } else {
        if (playerHand.score() === dealerHand.score()) {
          if (playerHand.cards.length === 2 && playerHand.score() === 21 && dealerHand.cards.length > 2) {
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
  resetBet(amount: number): void {
    this.PlayerBet = amount;
  }
  checkDuplicates(hand: Hand): boolean {
    if (hand.cards.length === 2) {
      return (hand.cards[0].value === hand.cards[1].value);
    } else {
      return false;
    }
  }
  ngOnInit(): void {
    this.initialiseDecks(this.numberOfDecks);
    this.shuffle(this.Decks);
  }



}
