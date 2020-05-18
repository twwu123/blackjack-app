import { Injectable } from '@angular/core';
import {BasicStrategyData} from 'src/app/models/BasicStrategyData';
import { Card } from '../../card';

@Injectable({
  providedIn: 'root'
})
export class BasicStrategyService {
  private basicStrategyData: BasicStrategyData = new BasicStrategyData();
  constructor() { }

  DecideBSAction(DealerDeck: Card[], PlayerDeck: Card[]): string {
    let containsAce = false;
    const playerAction = '';
    console.log(this.basicStrategyData.getHardTotalData());
    if (PlayerDeck.length === 2 ){  // check if player hand is a duplicate, in which case check if we should split
      const x = new Set(PlayerDeck);
      if (x.keys.length === 1){
        return this.SplitDecision(DealerDeck, x[0]);
      }
    }
    const PlayerDeckWithoutAces: Card[] = [];
    PlayerDeck.forEach(element => {
      if (element.value === 1) {
         containsAce = true;
      }else{
        PlayerDeckWithoutAces.push(element);
      }
    });
    if (containsAce){
      return this.SoftTotalAction(DealerDeck, PlayerDeckWithoutAces);
    }else{
      return this.HardTotalAction(DealerDeck, PlayerDeck);
    }
  }

  HardTotalAction(DealerDeck: Card[], PlayerDeck: Card[]): string{
    return this.basicStrategyData.getHardTotalData()[this.calculateHandvalue(PlayerDeck) - 1][this.calculateHandvalue(DealerDeck) - 1];
  }

  SoftTotalAction(DealerDeck: Card[], PlayerDeck: Card[]): string{
    return this.basicStrategyData.getSoftTotalData()[this.calculateHandvalue(PlayerDeck) - 1][this.calculateHandvalue(DealerDeck) - 1];
  }

  SplitDecision(DealerDeck: Card[], playerCardValue: number): string{
    return this.basicStrategyData.getPairSplitData()[playerCardValue - 1][this.calculateHandvalue(DealerDeck) - 1];

  }

  calculateHandvalue(hand: Card[]): number {
    let totalHandValue = 0;
    hand.forEach(element => {
      totalHandValue += element.value;
    });
    return totalHandValue;
  }
}
