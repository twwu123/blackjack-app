import { TestBed } from '@angular/core/testing';
import { Card } from '../../card';
import { BasicStrategyService } from './basic-strategy.service';

describe('BasicStrategyService', () => {
  let service: BasicStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should should return split action for double Ace hand', () => {
    const playerHand: Card[] = [
      { value: 1, suit: 'Spades', face: '1', img: 'assets/imgs/cards/AS.png' },
      { value: 1, suit: 'Hearts', face: '1', img: 'assets/imgs/cards/AH.png' }
    ];

    const dealerHand: Card[] = [
      { value: 5, suit: 'Hearts', face: '5', img: 'assets/imgs/cards/5H.png' },
      { value: 9, suit: 'Hearts', face: '5', img: 'assets/imgs/cards/6H.png' }
    ];
    expect(service.DecideBSAction(dealerHand, playerHand)).toEqual('Split');
  });

  it('should should return stand action for player total 13, dealer up card 6', () => {
    const playerHand: Card[] = [
      { value: 6, suit: 'Spades', face: '6', img: 'assets/imgs/cards/6S.png' },
      { value: 7, suit: 'Hearts', face: '7', img: 'assets/imgs/cards/7H.png' }
    ];

    const dealerHand: Card[] = [
      { value: 6, suit: 'Hearts', face: '6', img: 'assets/imgs/cards/6H.png' },
      { value: 10, suit: 'Hearts', face: '10', img: 'assets/imgs/cards/10H.png' }
    ];
    expect(service.DecideBSAction(dealerHand, playerHand)).toEqual('Stand');
  });

  it('should should return hit action for 3 card hard with two aces', () => {
    const playerHand: Card[] = [
      { value: 1, suit: 'Spades', face: '1', img: 'assets/imgs/cards/AS.png' },
      { value: 4, suit: 'Hearts', face: '4', img: 'assets/imgs/cards/AH.png' },
      { value: 1, suit: 'Hearts', face: '1', img: 'assets/imgs/cards/AH.png' }
    ];

    const dealerHand: Card[] = [
      { value: 5, suit: 'Hearts', face: '6', img: 'assets/imgs/cards/5H.png' },
      { value: 9, suit: 'Hearts', face: '5', img: 'assets/imgs/cards/6H.png' }
    ];
    expect(service.DecideBSAction(dealerHand, playerHand)).toEqual('Double if allowed, otherwise Hit');
  });

  it('should should return stand action for 7 card hard with two aces', () => {
    const playerHand: Card[] = [
      { value: 1, suit: 'Spades', face: '1', img: 'assets/imgs/cards/AS.png' },
      { value: 4, suit: 'Hearts', face: '4', img: 'assets/imgs/cards/4H.png' },
      { value: 1, suit: 'Hearts', face: '1', img: 'assets/imgs/cards/AH.png' },
      { value: 2, suit: 'Hearts', face: '2', img: 'assets/imgs/cards/2H.png' },
      { value: 3, suit: 'Hearts', face: '3', img: 'assets/imgs/cards/3H.png' },
      { value: 5, suit: 'Hearts', face: '4', img: 'assets/imgs/cards/5H.png' },
    ];

    const dealerHand: Card[] = [
      { value: 5, suit: 'Hearts', face: '6', img: 'assets/imgs/cards/5H.png' },
      { value: 9, suit: 'Hearts', face: '5', img: 'assets/imgs/cards/6H.png' }
    ];
    expect(service.DecideBSAction(dealerHand, playerHand)).toEqual('Stand');
  });

});
