import { Injectable } from '@angular/core';
import { Card } from '../../card';
import { Player } from '../../player';
import {Hand} from '../../hand';
import {GameService} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  constructor(private gameService: GameService) { }

  setMoney(player: Player, amount: number): void {
    player.PlayerMoney = amount;
  }

  addBet(player: Player, amount: number): void {
    if (player.PlayerOriginalBet < 1000) {
      player.PlayerOriginalBet += amount;
    }
  }

  minusBet(player: Player, amount: number): void {
    if (player.PlayerOriginalBet > 50) {
      player.PlayerOriginalBet -= amount;
    }
  }

  resetBet(player: Player, amount: number): void {
    player.PlayerOriginalBet = amount;
  }

  stand(player: Player): void {
    if (this.gameService.PlayersWithoutBlackjack[this.gameService.currentPlayerIndex] === player) {
      this.gameService.moveToNextHandOrPlayer(player);
    }
  }

  // Add an extra card to the current hand of the player, if it goes bust, move onto the next hand if there is one
  // Otherwise we move onto the next player
  // If it doesn't go bust, we do nothing unless we set standAfterHit to true which we do for double
  hit(player: Player, standAfterHit = false): void {
    if (this.gameService.PlayersWithoutBlackjack[this.gameService.currentPlayerIndex] === player) {
     const handInPlay = player.PlayerHands[player.currentHandIndex];
     if (this.gameService.Decks.length > 0) {
         this.gameService.DealCard(handInPlay);
         if (handInPlay.score() === 21) { // If score is 21, stand for player automatically
         this.stand(player);
       } else {
       if (handInPlay.score() > 21) {
          this.gameService.moveToNextHandOrPlayer(player);
         } else if (standAfterHit) {
           this.stand(player);
         }
       }
     } else {
        if (handInPlay.cards.length === 0) {
         this.gameService.message = 'Please Start the game first';
       } else {
          this.gameService.message = 'Deck has to few cards left to play, please reset the deck';
        }
      }
    }
  }

  double(player: Player): void {
    if (this.gameService.PlayersWithoutBlackjack[this.gameService.currentPlayerIndex] === player) {
      player.PlayerBets[player.currentHandIndex] *= 2;
      this.hit(player, true);
    }
  }

  // Same implementation as hit with doubling the current hand's bet, but if it doesn't bust, then we stand straight away
  split(player: Player): void {
    if (this.gameService.PlayersWithoutBlackjack[this.gameService.currentPlayerIndex] === player) {
      if (this.checkDuplicates(player.PlayerHands[player.currentHandIndex])) {
        const card: Card = player.PlayerHands[player.currentHandIndex].popCard();
        player.PlayerHands.push(new Hand());
        player.PlayerHands[player.PlayerHands.length - 1].addCard(card);
        player.PlayerBets.push(player.PlayerOriginalBet);
      }
    }
  }

  checkDuplicates(hand: Hand): boolean {
    if (hand.cards.length === 2) {
      return (hand.cards[0].value === hand.cards[1].value);
    } else {
      return false;
    }
  }
}
