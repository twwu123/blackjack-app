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

  public lastCardSubscription = this.gameService.lastDealtCard$.subscribe(card => {
    if (this.player.PlayerHands) {
      this.BasicStrategySuggestion = this.basicStrategyService.DecideBSAction(this.gameService.DealerHand.cards,
        this.player.PlayerHands[this.player.currentHandIndex].cards);
    }
  });

  public currentPlayerSubscription = this.gameService.currentPlayer$.subscribe(player => {
    this.currentPlayer = player;
  });

  getStrategy(strategy): string {
    if (this.gameService.runningGame) {
      if (this.player.PlayerHands[this.player.currentHandIndex].cards.length === 1) {
        return 'Hit';
      } else {
        return strategy;
      }
    } else {
      return '';
    }
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.lastCardSubscription.unsubscribe();
    this.currentPlayerSubscription.unsubscribe();
  }
}
