import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import { Hand } from '../../hand';
import { Player } from '../../player';
import { PlayersService } from 'src/app/services/players.service';
import { GameService } from '../services/game.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StrategyDialogComponent } from '../strategy-dialog/strategy-dialog.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  money = 1000;
  bet = 50;
  User: Player = new Player(this.money, this.bet, [new Hand()]); // Initialise User as a new player
  numberOfBots = 0;
  strategyOn = true;
  currentActivePlayer: Player;
  runningGame: boolean;

  constructor(public readonly playersService: PlayersService, public readonly gameService: GameService, public dialog: MatDialog) { }

  @ViewChild('appendHere', { static: false, read: ViewContainerRef }) target: ViewContainerRef;

  public currentPlayerSubscription = this.gameService.currentPlayer$.subscribe(player => {
    this.currentActivePlayer = player;
  });

  public runningGameSubscription = this.gameService.runningGame$.subscribe( run => {
    this.runningGame = run;
    if (!run) {
      this.gameService.updateMessage('Hand 1: ' + this.gameService.calculateMessage(this.User.PlayerHands[0]));
      if (this.User.PlayerHands.length === 2) {
        this.gameService.updateMessage2('Hand 2: ' + this.gameService.calculateMessage(this.User.PlayerHands[1]));
      }
    }
  });

  setBot(num: number): void {
    this.numberOfBots = num;
  }

  ngOnInit(): void {
    this.gameService.initialiseDecks(this.gameService.numberOfDecks);
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
    this.runningGameSubscription.unsubscribe();
  }
}
