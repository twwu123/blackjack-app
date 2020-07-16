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
import { BasicStrategyService } from 'src/app/services/basic-strategy.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StrategyDialogComponent } from '../strategy-dialog/strategy-dialog.component';
import { CardCountingStrategyData } from '../models/CardCountingStrategyData';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  numberOfDecks = 8;
  money = 1000;
  bet = 50;
  User: Player = new Player(this.money, this.bet, [new Hand()]); // Initialise User as a new player
  numberOfBots = 0;
  strategyOn = true;
  currentActivePlayer: Player;

  constructor(private basicStrategyService: BasicStrategyService, public readonly playersService: PlayersService,
              public readonly gameService: GameService, private resolver: ComponentFactoryResolver, public dialog: MatDialog) { }

  @ViewChild('appendHere', { static: false, read: ViewContainerRef }) target: ViewContainerRef;

  public currentPlayerSubscription = this.gameService.currentPlayer$.subscribe(player => {
    this.currentActivePlayer = player;
  });

  setDecks(num: number): void {
    this.numberOfDecks = num;
  }

  setBot(num: number): void {
    this.numberOfBots = num;
  }

  ngOnInit(): void {
    this.gameService.initialiseDecks(this.numberOfDecks);
    this.gameService.shuffle(this.gameService.Decks);
    this.gameService.addPlayerToPlay(this.User);
    this.gameService.updateCurrentPlayer(this.User);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(StrategyDialogComponent, {
      autoFocus: false,
      width: '65%'
    });
  }

  ngOnDestroy(): void {
    this.currentPlayerSubscription.unsubscribe();
  }
}
