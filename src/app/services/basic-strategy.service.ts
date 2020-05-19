import { Injectable } from '@angular/core';
import { BasicStrategyData } from 'src/app/models/BasicStrategyData';
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
    let dealerUpCard: Card = DealerDeck[0];
    if (PlayerDeck.length === 2) {  // check if player hand is a duplicate, in which case check if we should split
      if (PlayerDeck[0].value === PlayerDeck[1].value) {
        return this.SplitDecision(dealerUpCard, PlayerDeck[0].value);
      }
    }
    const PlayerDeckWithoutFirstAce: Card[] = [];
    PlayerDeck.forEach(element => {
      if (element.value === 1) {
        if (containsAce) {
          PlayerDeckWithoutFirstAce.push(element);
        }
        containsAce = true;
      } else {
        PlayerDeckWithoutFirstAce.push(element);
      }
    });
    if (containsAce) {
      return this.SoftTotalAction(dealerUpCard, PlayerDeckWithoutFirstAce);
    } else {
      return this.HardTotalAction(dealerUpCard, PlayerDeck);
    }
  }

  HardTotalAction(DealerCard: Card, PlayerDeck: Card[]): string {
    return this.basicStrategyData.getHardTotalData(this.calculateHandvalue(PlayerDeck) - 1, DealerCard.value - 1);
  }

  SoftTotalAction(DealerCard: Card, PlayerDeck: Card[]): string {
    return this.basicStrategyData.getSoftTotalData(this.calculateHandvalue(PlayerDeck) - 1, DealerCard.value - 1);
  }

  SplitDecision(DealerCard: Card, playerCardValue: number): string {
    return this.basicStrategyData.getPairSplitData(playerCardValue - 1, DealerCard.value - 1);
  }

  calculateHandvalue(hand: Card[]): number {
    let totalHandValue = 0;
    hand.forEach(element => {
      totalHandValue += element.value;
    });
    return totalHandValue;
  }
}
