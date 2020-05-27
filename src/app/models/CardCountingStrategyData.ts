export class CardCountingStrategyData {
    private HiLoCardValues = {
        // Card value: card counting value
        1: -1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 0,
        8: 0,
        9: 0,
        10: -1
    };
    private OmegaIICardValues = {
        // Card value: card counting value
        1: 0,
        2: 1,
        3: 1,
        4: 2,
        5: 2,
        6: 2,
        7: 1,
        8: 0,
        9: -1,
        10: -2
    };
    private HalvesCardValues = {
        // Card value: card counting value
        1: 0,
        2: 0.5,
        3: 1,
        4: 1,
        5: 1.5,
        6: 1,
        7: 0.5,
        8: 0,
        9: -0.5,
        10: -1
    };
    public getCardCountingValue(cardValue: number, strategy: string): number {
        if (strategy === 'Halves'){
            return this.HalvesCardValues[cardValue];
        }else if (strategy  === 'OmegaII'){
            return this.OmegaIICardValues[cardValue];
        }else{
            return this.HiLoCardValues[cardValue];
        }
    }
}
