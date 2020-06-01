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
import { PlayersService } from 'src/app/services/players.service';
import { GameService } from '../services/game.service';
import { BotComponent } from '../bot/bot.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StrategyDialogComponent } from '../strategy-dialog/strategy-dialog.component';

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

  constructor(public readonly playersService: PlayersService, public readonly gameService: GameService,
    private resolver: ComponentFactoryResolver, public dialog: MatDialog) { }

  @ViewChild('appendHere', { static: false, read: ViewContainerRef }) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  public currentPlayerSubscription = this.gameService.currentPlayer$.subscribe(player => {
    this.currentActivePlayer = player;
  });

  addBot(num: number): void {
    for (let i = 0; i < num; i++) {
      if (this.gameService.PlayersInPlay.length < 4) {
        const childComponent = this.resolver.resolveComponentFactory(BotComponent);
        this.componentRef = this.target.createComponent(childComponent);
        this.componentRef.instance.ref = this.componentRef;
      }
    }
  }

  ngOnInit(): void {
    this.gameService.initialiseDecks(this.numberOfDecks);
    this.gameService.shuffle(this.gameService.Decks);
    this.gameService.addPlayerToPlay(this.User);
    this.gameService.updateCurrentPlayer(this.User);
  }

  ngOnDestroy(): void {
    this.currentPlayerSubscription.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(StrategyDialogComponent, {
      autoFocus: false,
      width: "65%"
    });
  }
}
