import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';
import {CardCountingStrategyData} from '../models/CardCountingStrategyData';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService) { }
  CardCountingValue = 0;
  CardCountingStrategy = 'HiLo';
  cardCountingData = new CardCountingStrategyData();

  public lastCardSubscription = this.gameService.lastDealtCard$.subscribe(card => {
    this.CardCountingValue += this.cardCountingData.getCardCountingValue(card.value, this.CardCountingStrategy);
  });

  public initDeckSubscription = this.gameService.initDeckObs$.subscribe(num => {
    this.CardCountingValue = num;
  });

  displayedCardCountingValue(count): number {
    if (this.gameService.runningGame) {
      console.log(this.gameService.DealerHand.cards[1]);
      return count - this.cardCountingData.getCardCountingValue(this.gameService.DealerHand.cards[1].value, this.CardCountingStrategy);
    } else {
      return count;
    }
  }

  getTrueCount(): number {
    return Math.round(this.displayedCardCountingValue(this.CardCountingValue) / Math.max(1,
      Math.round(this.gameService.Decks.length / 52)));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.lastCardSubscription.unsubscribe();
    this.initDeckSubscription.unsubscribe();
  }

}
