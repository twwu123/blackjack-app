import { Injectable } from '@angular/core';
import {DECK} from '../../deck';
import {Card} from '../../card';
import {Hand} from '../../hand';
import {Player} from '../../player';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor() { }
  Decks: Card[];
  runningGame = false;
  DealerHand: Hand = new Hand();
  message: string;
  PlayersInPlay: Player[] = []; // Track who is playing
  PlayersWithoutBlackjack: Player[] = []; // Track who doesn't have blackjack, players with blackjack shouldn't make moves
  currentPlayerIndex = 0; // This will track which player can make moves
  CardBack: Card = {value: 0, suit: 'NA', face: 'NA', img: 'assets/imgs/cards/cardback.png'};

  public currentPlayer = new Subject<Player>();
  public currentPlayer$ = this.currentPlayer.asObservable();

  public lastDealtCard = new Subject<Card>();
  public lastDealtCard$ = this.lastDealtCard.asObservable();

  public initDeckObs = new Subject<number>();
  public initDeckObs$ = this.initDeckObs.asObservable();

  public updateLastDealtCard(newCard: Card) {
    this.lastDealtCard.next(newCard);
  }

  public updateCurrentPlayer(newPlayer: Player) {
    this.currentPlayer.next(newPlayer);
  }

  shuffle(Decks: Card[]): void {
    for (let i = Decks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = Decks[i];
      Decks[i] = Decks[j];
      Decks[j] = temp;
    }
  }

  initialiseDecks(numberOfDecks: number): void {
    this.Decks = [];
    this.initDeckObs.next(0);
    for (let i = 0; i < numberOfDecks; i++) {
      this.Decks = this.Decks.concat(DECK);
    }
  }

  addPlayerToPlay(player: Player): void {
    if (this.PlayersInPlay.indexOf(player) === -1) {
      this.PlayersInPlay.push(player);
    }
  }

  removePlayerFromPlay(player: Player): void {
    const playerIndex = this.PlayersInPlay.indexOf(player);
    if (playerIndex > -1) {
      this.PlayersInPlay.splice(playerIndex, 1);
    }
  }

  // Deal cards will start a new game, so we should reset certain variables
  dealCards(): void {
    if (this.Decks.length > 20) {
      if (!this.runningGame) {
        this.message = '';
        this.runningGame = true; // Starts an ended game
        this.currentPlayerIndex = 0; // Reset current player tracker
        this.DealerHand.cards = []; // Reset Dealer Hand
        this.PlayersWithoutBlackjack = []; // Reset players with blackjack
        this.DealCard(this.DealerHand, 2);
        // Loop through all players, reset their hand and bets
        for (const player of this.PlayersInPlay) {
          player.currentHandIndex = 0;
          player.PlayerHands = [new Hand()];
          player.PlayerBets = [player.PlayerOriginalBet];
          this.DealCard(player.PlayerHands[0], 2);
          if (player.PlayerHands[0].score() !== 21) {
            this.PlayersWithoutBlackjack.push(player);
          }
          if (this.PlayersWithoutBlackjack.length === 0) {
            this.endGame(this.PlayersInPlay);
          }
        }
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
      this.updateLastDealtCard(card);
    }
  }

  endGame(players: Player[], dealerHand = this.DealerHand) {
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
        this.DealCard(dealerHand);
      }
    }
    for (const player of players) {
      for (let i = 0; i < player.PlayerHands.length; i++) {
        player.PlayerMoney += this.calculateWinnings(player.PlayerHands[i], player.PlayerBets[i]);
      }
    }
  }

  // Calculate winnings based on hand vs dealer's hand, can be negative if the hand loses.
  // It implements 1.5x winnings if player wins with a blackjack (ace and a value 10 card)
  // Player wins on a blackjack even if Dealer has a score of 21, as long as dealer doesn't also have a blackjack
  calculateWinnings(playerHand: Hand, bet: number, dealerHand = this.DealerHand): number {
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

  // player.currentHandIndex === player.PlayerHands.length - 1 checks if they are making decisions for their last hand
  // If it is their last hand, then we move onto the next player, if there is no next player, then we end the game and calculate winnings
  // If the player isn't making decisions for their last hand, then we move onto their next hand (this means they have split)
  moveToNextHandOrPlayer(player: Player): void {
    if (player.currentHandIndex === player.PlayerHands.length - 1) {
      if (player === this.PlayersWithoutBlackjack[this.PlayersWithoutBlackjack.length - 1]) {
        this.endGame(this.PlayersInPlay);
        this.updateCurrentPlayer(this.PlayersInPlay[0]);
      } else {
        this.currentPlayerIndex++;
        this.updateCurrentPlayer(this.PlayersWithoutBlackjack[this.currentPlayerIndex]);
      }
    } else {
      player.currentHandIndex++;
    }
  }
}
