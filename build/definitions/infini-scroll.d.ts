export interface NewCard {
    (): Card;
}
export interface Card {
    element: HTMLElement;
    loadData: (number) => PromiseLike<void>;
}
export declare class InfiniScroll {
    newCard: NewCard;
    scrollContainer: HTMLElement;
    private cards;
    private topPaddingEle;
    private bottomPaddingEle;
    private nextDataIndex;
    private scrollTopBefore;
    constructor(newCard: any, scrollContainer: any);
    init(): void;
    private getHeight(ele, includeMargins);
    private appendPaddingEles();
    private handleLoad(dataIndex);
    private addNewCard();
    private addCards();
    private sendToBottom(card);
    private sendToTop(card);
    private loadNextData(card);
    private getPreviousDataIndex();
    private hasPreviousData();
    private loadPreviousData(card);
    private handleScrollDown();
    private handleScrollUp();
    private handleScroll(event);
}
