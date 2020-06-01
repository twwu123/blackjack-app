import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BasicStrategyService } from '../services/basic-strategy.service';
import { Player } from '../../player';
import { CardCountingStrategyData } from '../models/CardCountingStrategyData';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit, OnDestroy {

  constructor(private basicStrategyService: BasicStrategyService, private gameService: GameService) { }
  @Input() player: Player;
  currentPlayer: Player;
  BasicStrategySuggestion = '';
  CardCountingValue = 0;
  CardCountingStrategy = 'HiLo';
  cardCountingData = new CardCountingStrategyData();


  public lastCardSubscription = this.gameService.lastDealtCard$.subscribe(card => {
    this.CardCountingValue += this.cardCountingData.getCardCountingValue(card.value, this.CardCountingStrategy);
    if (this.player.PlayerHands && this.gameService.runningGame) {
      this.BasicStrategySuggestion = this.basicStrategyService.DecideBSAction(this.gameService.DealerHand.cards,
        this.player.PlayerHands[this.player.currentHandIndex].cards);
    }
  });

  public currentPlayerSubscription = this.gameService.currentPlayer$.subscribe(player => {
    this.currentPlayer = player;
  });

  public initDeckSubscription = this.gameService.initDeckObs$.subscribe(num => {
    this.CardCountingValue = num;
  });

  getStrategy(strategy): string {
    if (this.currentPlayer === this.player) {
      if (this.player.PlayerHands[this.player.currentHandIndex].cards.length === 1) {
        return 'Hit';
      } else {
        return strategy;
      }
    } else {
      return '';
    }
  }

  getTrueCount(): number {
    return Math.round(this.CardCountingValue / Math.round(this.gameService.Decks.length / 52));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.lastCardSubscription.unsubscribe();
    this.initDeckSubscription.unsubscribe();
    this.currentPlayerSubscription.unsubscribe();
  }
}
