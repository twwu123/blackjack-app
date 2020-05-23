import { Component, OnInit } from '@angular/core';
import { Hand } from '../../hand';
import { Player } from '../../player';
import {BasicStrategyService} from 'src/app/services/basic-strategy.service';
import {PlayersService} from 'src/app/services/players.service';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  numberOfDecks = 4;
  money = 1000;
  bet = 50;
  User: Player = new Player(this.money, this.bet, [new Hand()]); // Initialise User as a new player

  constructor(private basicStrategyService: BasicStrategyService, public readonly playersService: PlayersService,
              public readonly gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.initialiseDecks(this.numberOfDecks);
    this.gameService.shuffle(this.gameService.Decks);
    this.gameService.addPlayerToPlay(this.User);
  }
}
