import { Component, OnInit, OnDestroy, ComponentRef} from '@angular/core';
import {BasicStrategyService} from '../services/basic-strategy.service';
import {PlayersService} from '../services/players.service';
import {GameService} from '../services/game.service';
import {Player} from '../../player';
import { Hand } from '../../hand';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent implements OnInit, OnDestroy {

  ref: ComponentRef<any>;
  constructor(private basicStrategyService: BasicStrategyService, public readonly playersService: PlayersService,
              public readonly gameService: GameService ) { }

  botPlayer: Player = new Player(1000, 50, [new Hand()]);

  public currentPlayerSubscription = this.gameService.currentPlayer$.subscribe(player => {
    if (player === this.botPlayer) {
      this.botPlay();
    }
  });

  botPlay(): void {
    while (this.botPlayer.PlayerHands[this.botPlayer.currentHandIndex].score() < 17) {
      this.playersService.hit(this.botPlayer);
    }
    this.playersService.stand(this.botPlayer);
  }

  removeBot() {
    this.ref.destroy();
  }

  ngOnInit(): void {
    this.gameService.addPlayerToBoard(this.botPlayer);
  }

  ngOnDestroy() {
    this.gameService.removePlayerFromBoard(this.botPlayer);
    this.currentPlayerSubscription.unsubscribe();
  }
}
