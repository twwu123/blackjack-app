import { Card } from './card';

export class Hand {
  cards: Card[];

  addCard(card: Card) {
    this.cards.push(card);
  }

  popCard() {
    return this.cards.pop();
  }

  score() {
    let score = 0;
    let ace = 0;
    for (const c of this.cards) {
      if (c.value !== 1) {
        score = score + c.value;
      } else {
        ace++;
      }
    }
    for (let i = 0; i < ace; i++) {
      if (score + 11 > 21) {
        score = score + 1;
      } else {
        score = score + 11;
      }
    }
    return score;
  }
}

