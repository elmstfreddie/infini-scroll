export interface NewCard {
	():Card
}

export interface Card {
	element:HTMLElement,
	loadData:(number)=>PromiseLike<void>
}

export class InfiniScroll {
	newCard:NewCard;
	scrollContainer:HTMLElement;

	private cards:Card[] = [];
	private topPaddingEle:HTMLElement;
	private bottomPaddingEle:HTMLElement;
	private nextDataIndex = 0;
	private scrollTopBefore = 0;

	constructor(newCard, scrollContainer) {
		this.newCard = newCard;
		this.scrollContainer = scrollContainer;
	}

	init() {
		this.scrollContainer.addEventListener("scroll", this.handleScroll.bind(this));

		this.appendPaddingEles();
		this.addCards();
	}

	private getHeight(ele:HTMLElement, includeMargins:boolean):number {
		let computedStyle = window.getComputedStyle(ele);
		return parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom) + parseInt(computedStyle.height); 
	}

	private appendPaddingEles():void {
		this.topPaddingEle = document.createElement("div");
		this.topPaddingEle.style.paddingTop = "0";
		this.scrollContainer.appendChild(this.topPaddingEle);
		this.bottomPaddingEle = document.createElement("div");
		this.bottomPaddingEle.style.paddingTop = "0";
		this.scrollContainer.appendChild(this.bottomPaddingEle);
	}

	private handleLoad(dataIndex:number):void {
		//this.removeCards();
	}

	private addNewCard():void {
		let card = this.newCard();

		this.scrollContainer.insertBefore(card.element, this.bottomPaddingEle);

		this.cards.push(card);
		
		this.loadNextData(card);
	}

	private addCards():void {
		let builtHeight = this.scrollContainer.clientHeight;

		while (builtHeight <= this.scrollContainer.clientHeight) {
			let scrollHeightBefore = this.scrollContainer.scrollHeight;

			this.addNewCard();

			let scrollHeightAfter = this.scrollContainer.scrollHeight;
			builtHeight += scrollHeightAfter - scrollHeightBefore;
		}

		this.addNewCard();
	}

	private sendToBottom(card:Card):void {
		this.scrollContainer.insertBefore(card.element, this.bottomPaddingEle);

		this.cards.shift();
		this.cards.push(card);
	}

	private sendToTop(card:Card):void {
		this.scrollContainer.insertBefore(card.element, this.cards[0].element);

		this.cards.pop();
		this.cards.unshift(card);
	}

	private loadNextData(card:Card):void {
		card.loadData(this.nextDataIndex).then(this.handleLoad.bind(this, this.nextDataIndex));
		this.nextDataIndex++;
	}

	private getPreviousDataIndex():number {
		return this.nextDataIndex - this.cards.length - 1;
	}

	private hasPreviousData():boolean {
		return this.getPreviousDataIndex() >= 0;
	}

	private loadPreviousData(card:Card):void {
		let previousDataIndex = this.getPreviousDataIndex();

		this.scrollContainer.scrollTop = 0;

		card.loadData(previousDataIndex).then(this.handleLoad.bind(this, previousDataIndex));
		this.nextDataIndex--;	
	}

	private handleScrollDown():void {
		let topPadding = parseInt(this.topPaddingEle.style.paddingTop);

		while (this.scrollContainer.scrollTop > topPadding + this.cards[0].element.getBoundingClientRect().height) {
			let topCard = this.cards[0];

			let scrollHeightBefore = this.scrollContainer.scrollHeight;
			this.scrollContainer.removeChild(topCard.element);
			let scrollHeightAfter = this.scrollContainer.scrollHeight;

			topPadding += scrollHeightBefore - scrollHeightAfter;
			this.topPaddingEle.style.paddingTop = topPadding + "";

			this.loadNextData(topCard);
			
			this.sendToBottom(topCard);
		}
	}

	private handleScrollUp():void {
		let topPadding = parseInt(this.topPaddingEle.style.paddingTop);

		if (this.scrollContainer.scrollTop < topPadding) {
			if (this.hasPreviousData()) {
				let bottomCard = this.cards[this.cards.length - 1];

				let scrollHeightBefore = this.scrollContainer.scrollHeight;
				this.scrollContainer.removeChild(bottomCard.element);
				let scrollHeightAfter = this.scrollContainer.scrollHeight;

				topPadding -= scrollHeightBefore - scrollHeightAfter;
				this.topPaddingEle.style.paddingTop = topPadding + "";

				this.loadPreviousData(bottomCard);

				this.sendToTop(bottomCard);
			} else {
				topPadding = 0;
				this.topPaddingEle.style.paddingTop = topPadding + "";
				this.scrollContainer.scrollTop = 0;
			}
		}
	}

	private handleScroll(event):void {
		let scrollTopAfter = this.scrollContainer.scrollTop;

		if (scrollTopAfter > this.scrollTopBefore) {
			this.handleScrollDown();
		} else {
			this.handleScrollUp();
		}

		this.scrollTopBefore = scrollTopAfter;
	}
}