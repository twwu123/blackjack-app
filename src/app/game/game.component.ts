import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy
} from '@angular/core';
import { Hand } from '../../hand';
import { Player } from '../../player';
import {BasicStrategyService} from 'src/app/services/basic-strategy.service';
import {PlayersService} from 'src/app/services/players.service';
import {GameService} from '../services/game.service';
import { BotComponent } from '../bot/bot.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  numberOfDecks = 4;
  money = 1000;
  bet = 50;
  User: Player = new Player(this.money, this.bet, [new Hand()]); // Initialise User as a new player
  botsToAdd = 1;
  currentActivePlayer: Player;

  constructor(private basicStrategyService: BasicStrategyService, public readonly playersService: PlayersService,
              public readonly gameService: GameService, private resolver: ComponentFactoryResolver) { }

  @ViewChild('appendHere', {static : false, read : ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  public currentPlayerSubscription = this.gameService.currentPlayer$.subscribe(player => {
    this.currentActivePlayer = player;
  });

  addBot(num: number): void {
      if (this.gameService.PlayersOnBoard.length < 4) {
        const childComponent = this.resolver.resolveComponentFactory(BotComponent);
        this.componentRef = this.target.createComponent(childComponent);
        this.componentRef.instance.ref = this.componentRef;
      }
  }

  ngOnInit(): void {
    this.gameService.initialiseDecks(this.numberOfDecks);
    this.gameService.shuffle(this.gameService.Decks);
    this.gameService.addPlayerToBoard(this.User);
    this.gameService.updateCurrentPlayer(this.User);
  }

  ngOnDestroy(): void {
    this.currentPlayerSubscription.unsubscribe();
  }
}
