export class BasicStrategyData {
    Action = {
        H: 'Hit',
        S: 'Stand',
        D: 'Double if allowed, otherwise Hit',
        Ds: 'Double if allowed, otherwise Stand',
        Y: 'Split',
        N: 'Do not split',
    };

    private HardTotalData: string[][] = [
        // Dealer hand  A,2,3,4,5,6,7,8,9,10 : player hand total
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 2
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 3
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 3
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 4
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 5
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 6
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 7
        ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 8
        ['H', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H'], // 9
        ['H', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'], // 10
        ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'], // 11
        ['H', 'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 12
        ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 13
        ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 14
        ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 15
        ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 16
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 17
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 18
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 19
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] // 20
    ];

    private SoftTotalData: string[][] = [
        ['H', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H'], // 2
        ['H', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H'], // 3
        ['H', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H'], // 4
        ['H', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H'], // 5
        ['H', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H'], // 6
        ['H', 'Ds', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H'], // 7
        ['S', 'S', 'S', 'S', 'S', 'Ds', 'S', 'S', 'S', 'S'], // 8
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 9
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 10
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 12
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 12
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 13
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 14
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 15
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 16
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 17
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 18
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 19
        ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] // 20
    ];

    private PairSplitData: string[][] = [
        ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'], // A
        ['N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N'], // 2
        ['N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N'], // 3
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'], // 4
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'], // 5
        ['N', 'N', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N', 'N'], // 6
        ['N', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N'], // 7
        ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'], // 8
        ['N', 'Y', 'Y', 'Y', 'Y', 'Y', 'N', 'Y', 'Y', 'N'], // 9
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'] // 10
    ];

    public getHardTotalData(
        playerHandIndex: number,
        dealerHandIndex: number
    ): string {
        return this.Action[this.HardTotalData[playerHandIndex][dealerHandIndex]];
    }
    public getSoftTotalData(
        playerHandIndex: number,
        dealerHandIndex: number
    ): string {
        return this.Action[this.SoftTotalData[playerHandIndex][dealerHandIndex]];
    }
    public getPairSplitData(
        playerHandIndex: number,
        dealerHandIndex: number
    ): string {
        return this.Action[this.PairSplitData[playerHandIndex][dealerHandIndex]];
    }
}
