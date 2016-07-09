"use strict";
var InfiniScroll = (function () {
    function InfiniScroll(newCard, scrollContainer) {
        this.cards = [];
        this.nextDataIndex = 0;
        this.scrollTopBefore = 0;
        this.newCard = newCard;
        this.scrollContainer = scrollContainer;
    }
    InfiniScroll.prototype.init = function () {
        this.scrollContainer.addEventListener("scroll", this.handleScroll.bind(this));
        this.appendPaddingEles();
        this.addCards();
    };
    InfiniScroll.prototype.getHeight = function (ele, includeMargins) {
        var computedStyle = window.getComputedStyle(ele);
        return parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom) + parseInt(computedStyle.height);
    };
    InfiniScroll.prototype.appendPaddingEles = function () {
        this.topPaddingEle = document.createElement("div");
        this.topPaddingEle.style.paddingTop = "0";
        this.scrollContainer.appendChild(this.topPaddingEle);
        this.bottomPaddingEle = document.createElement("div");
        this.bottomPaddingEle.style.paddingTop = "0";
        this.scrollContainer.appendChild(this.bottomPaddingEle);
    };
    InfiniScroll.prototype.handleLoad = function (dataIndex) {
        //this.removeCards();
    };
    InfiniScroll.prototype.addNewCard = function () {
        var card = this.newCard();
        this.scrollContainer.insertBefore(card.element, this.bottomPaddingEle);
        this.cards.push(card);
        this.loadNextData(card);
    };
    InfiniScroll.prototype.addCards = function () {
        var builtHeight = this.scrollContainer.clientHeight;
        while (builtHeight <= this.scrollContainer.clientHeight) {
            var scrollHeightBefore = this.scrollContainer.scrollHeight;
            this.addNewCard();
            var scrollHeightAfter = this.scrollContainer.scrollHeight;
            builtHeight += scrollHeightAfter - scrollHeightBefore;
        }
        this.addNewCard();
    };
    InfiniScroll.prototype.sendToBottom = function (card) {
        this.scrollContainer.insertBefore(card.element, this.bottomPaddingEle);
        this.cards.shift();
        this.cards.push(card);
    };
    InfiniScroll.prototype.sendToTop = function (card) {
        this.scrollContainer.insertBefore(card.element, this.cards[0].element);
        this.cards.pop();
        this.cards.unshift(card);
    };
    InfiniScroll.prototype.loadNextData = function (card) {
        card.loadData(this.nextDataIndex).then(this.handleLoad.bind(this, this.nextDataIndex));
        this.nextDataIndex++;
    };
    InfiniScroll.prototype.getPreviousDataIndex = function () {
        return this.nextDataIndex - this.cards.length - 1;
    };
    InfiniScroll.prototype.hasPreviousData = function () {
        return this.getPreviousDataIndex() >= 0;
    };
    InfiniScroll.prototype.loadPreviousData = function (card) {
        var previousDataIndex = this.getPreviousDataIndex();
        this.scrollContainer.scrollTop = 0;
        card.loadData(previousDataIndex).then(this.handleLoad.bind(this, previousDataIndex));
        this.nextDataIndex--;
    };
    InfiniScroll.prototype.handleScrollDown = function () {
        var topPadding = parseInt(this.topPaddingEle.style.paddingTop);
        while (this.scrollContainer.scrollTop > topPadding + this.cards[0].element.getBoundingClientRect().height) {
            var topCard = this.cards[0];
            var scrollHeightBefore = this.scrollContainer.scrollHeight;
            this.scrollContainer.removeChild(topCard.element);
            var scrollHeightAfter = this.scrollContainer.scrollHeight;
            topPadding += scrollHeightBefore - scrollHeightAfter;
            this.topPaddingEle.style.paddingTop = topPadding + "";
            this.loadNextData(topCard);
            this.sendToBottom(topCard);
        }
    };
    InfiniScroll.prototype.handleScrollUp = function () {
        var topPadding = parseInt(this.topPaddingEle.style.paddingTop);
        if (this.scrollContainer.scrollTop < topPadding) {
            if (this.hasPreviousData()) {
                var bottomCard = this.cards[this.cards.length - 1];
                var scrollHeightBefore = this.scrollContainer.scrollHeight;
                this.scrollContainer.removeChild(bottomCard.element);
                var scrollHeightAfter = this.scrollContainer.scrollHeight;
                topPadding -= scrollHeightBefore - scrollHeightAfter;
                this.topPaddingEle.style.paddingTop = topPadding + "";
                this.loadPreviousData(bottomCard);
                this.sendToTop(bottomCard);
            }
            else {
                topPadding = 0;
                this.topPaddingEle.style.paddingTop = topPadding + "";
                this.scrollContainer.scrollTop = 0;
            }
        }
    };
    InfiniScroll.prototype.handleScroll = function (event) {
        var scrollTopAfter = this.scrollContainer.scrollTop;
        if (scrollTopAfter > this.scrollTopBefore) {
            this.handleScrollDown();
        }
        else {
            this.handleScrollUp();
        }
        this.scrollTopBefore = scrollTopAfter;
    };
    return InfiniScroll;
}());
exports.InfiniScroll = InfiniScroll;
