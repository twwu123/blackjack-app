import { Component, OnInit } from '@angular/core';
import { DECK } from '../../deck';
import { Card } from '../../card';
import { Hand } from '../../hand';
import { Player } from '../../player';
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
  money = 1000;
  bet = 50;
  User: Player = new Player(this.money, this.bet, [new Hand()]);
  PlayersInPlay: Player[] = [this.User];
  currentPlayerIndex = 0;
  message: string;
  runningGame = false;
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
    if (this.Decks.length > 20) {
      if (!this.runningGame) {
        this.message = '';
        this.runningGame = true;
        this.currentPlayerIndex = 0;
        this.DealerHand.cards = [];
        this.DealCard(this.DealerHand, 2);
        for (const player of this.PlayersInPlay) {
          player.currentHandIndex = 0;
          player.PlayerHands = [new Hand()];
          player.PlayerBets = [player.PlayerOriginalBet];
          this.DealCard(player.PlayerHands[0], 2);
          if (player.PlayerHands[0].score() === 21) {
            this.stand(player);
          }
        }
        console.log(this.basicStrategyService.DecideBSAction(this.DealerHand.cards,
          this.User.PlayerHands[this.User.currentHandIndex].cards));
      } else {
        this.message = 'Game already in play';
      }
    } else {
      this.message = 'Deck has to few cards left to play, please reset the deck';
    }
  }
  DealCard(hand: Hand, amount: number = 1): void{
    for (let x = 0; x < amount; x++){
      const card: Card = this.Decks.pop();
      hand.addCard(card);
    }
  }
  stand(player: Player): void {
    if (player.currentHandIndex === player.PlayerHands.length - 1) {
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex >= this.PlayersInPlay.length) {
        this.endGame(this.DealerHand, this.PlayersInPlay);
      }
    } else {
        player.currentHandIndex++;
      }
    }
  hit(player: Player, standAfterHit = false): void {
    const handInPlay = player.PlayerHands[player.currentHandIndex];
    if (this.Decks.length > 0) {
      this.DealCard(handInPlay);
      if (handInPlay.score() > 21) {
        if (this.User.currentHandIndex === this.User.PlayerHands.length - 1) {
          this.currentPlayerIndex++;
          if (this.currentPlayerIndex >= this.PlayersInPlay.length) {
            this.endGame(this.DealerHand, this.PlayersInPlay);
          }
        } else {
            player.currentHandIndex++;
        }
      } else if (standAfterHit) {
        this.stand(player);
      }
      if (player === this.User) {
        console.log(this.basicStrategyService.DecideBSAction(this.DealerHand.cards, player.PlayerHands[player.currentHandIndex].cards));
      }
    } else {
      if (handInPlay.cards.length === 0) {
        this.message = 'Please Start the game first';
      } else {
        this.message = 'Deck has to few cards left to play, please reset the deck';
      }
    }
  }

  double(player: Player): void {
    this.User.PlayerBets[this.User.currentHandIndex] *= 2;
    this.hit(player, true);
  }
  split(player: Player): void {
    const card: Card = this.User.PlayerHands[this.User.currentHandIndex].popCard();
    this.User.PlayerHands.push(new Hand());
    this.User.PlayerHands[this.User.currentHandIndex + 1].addCard(card);
    this.User.PlayerBets.push(player.PlayerOriginalBet);
  }

  calculateWinnings(dealerHand: Hand, playerHand: Hand, bet: number): number {
    if (playerHand.score() > 21) {
      return -bet;
    } else {
      if (dealerHand.score() > 21) {
        if (playerHand.cards.length === 2 && playerHand.score() === 21) {
          return Math.floor(1.5 * bet);
        } else {
          return bet;
        }
      } else {
        if (21 - playerHand.score() < 21 - dealerHand.score()) {
          if (playerHand.cards.length === 2 && playerHand.score() === 21) {
            return Math.floor(1.5 * bet);
          } else {
            return bet;
          }
        } else {
          if (playerHand.score() === dealerHand.score()) {
            if (playerHand.cards.length === 2 && playerHand.score() === 21 && dealerHand.cards.length > 2) {
              return Math.floor(1.5 * bet);
            } else {
              return 0;
            }
          } else {
            return -bet;
          }
        }
      }
    }
  }
  endGame(dealerHand: Hand, players: Player[]) {
    this.runningGame = false;
    let dealerDeal = false;
    for (const player of players) {
      for (const hand of player.PlayerHands) {
        if (hand.score() <= 21) {
          dealerDeal = true;
        }
      }
    }
    if (dealerDeal) {
      while (this.DealerHand.score() < 17) {
        this.DealCard(this.DealerHand);
      }
    }
    for (const player of players) {
      for (let i = 0; i < player.PlayerHands.length; i++) {
        player.PlayerMoney += this.calculateWinnings(dealerHand, player.PlayerHands[i], player.PlayerBets[i]);
        console.log(this.calculateWinnings(dealerHand, player.PlayerHands[i], player.PlayerBets[i]));
        }
      }
    }
  setMoney(amount: number): void {
    this.User.PlayerMoney = amount;
  }
  addBet(amount: number): void {
    this.User.PlayerOriginalBet += amount;
  }
  minusBet(amount: number): void {
    if (this.User.PlayerOriginalBet > 50) {
      this.User.PlayerOriginalBet -= amount;
    }
  }
  resetBet(amount: number): void {
    this.User.PlayerOriginalBet = amount;
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
