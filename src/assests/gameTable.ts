/*global */
/*eslint no-debugger: "off"*/

import { templateEngine } from '../scripts/template_engine';
import { CardMatchApp } from './cardMatch';
import cardBackImg from '../img/cardback.svg';
import diamondsIcon from '../img/diamonds.svg';
import heartsIcon from '../img/hearts.svg';
import spadesIcon from '../img/spades.svg';
import clubsIcon from '../img/clubs.svg';
export { GameTable };

interface LayoutTree {
    tag: string;
    cls?: string | string[];
    attrs?: {
        [key: string]: string;
    };
    content?: string | LayoutTree[] | undefined | null;
}

type Card = string[];

class GameTable {
    plateContainer: HTMLElement;
    master: CardMatchApp;
    gameTable: HTMLDivElement;
    stopwatchWindow: HTMLDivElement;
    goBackButton: HTMLButtonElement;
    cardsGrid: HTMLDivElement;
    interval: NodeJS.Timer;
    cards: Card[];
    cardsInGame: Card[];
    pickedCard: Card | undefined;
    card: HTMLElement | DocumentFragment | Text | undefined;
    cardBacks: NodeListOf<HTMLElement>;
    hideDelay: NodeJS.Timeout;
    static temeplate: LayoutTree;
    static cardTemeplate: { tag: string; cls: string };
    static cardFaceTemeplate:
        | string
        | string[]
        | LayoutTree
        | LayoutTree[]
        | null
        | undefined;
    static cardBackTemeplate:
        | string
        | string[]
        | LayoutTree
        | LayoutTree[]
        | null
        | undefined;

    constructor(container: HTMLElement, master: CardMatchApp) {
        this.plateContainer = container; // cardMatchApp.appScreen
        this.master = master;
        this.render(GameTable.temeplate);

        this.gameTable = this.plateContainer.querySelector(
            '.game-table'
        ) as HTMLDivElement;
        this.stopwatchWindow = this.gameTable.querySelector(
            '.stopwatch__time'
        ) as HTMLDivElement;
        this.goBackButton = this.gameTable.querySelector(
            '.game-table__go-back-button'
        ) as HTMLButtonElement;
        this.cardsGrid = this.gameTable.querySelector(
            '.game-table__cards'
        ) as HTMLDivElement;
        this.applyTableGrid();

        this.stopwatch = this.stopwatch.bind(this);
        this.hideCards = this.hideCards.bind(this);
        this.cardClickHandler = this.cardClickHandler.bind(this);
        this.goBackClickHandler = this.goBackClickHandler.bind(this);

        this.interval = setInterval(this.stopwatch, 1000);
        this.cards = [];
        ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map((value) => {
            ['h', 'd', 'c', 's'].forEach((suit) => {
                const card: Card = [value, suit];
                this.cards.push(card);
            });
        });
        this.cardsInGame = this.tossCards(
            this.getCardsByLevel(this.master.state.difficultyLevel)
        );
        this.pickedCard = undefined;

        // adding cards on table
        this.cardsInGame.forEach((card) => {
            this.card = templateEngine(GameTable.cardTemeplate);
            this.card.appendChild(this.drawCardFace(card));
            this.card.appendChild(this.drawCardBack());

            this.cardsGrid.appendChild(this.card);
        });

        // hiding cards, dealing with clicks
        this.cardBacks = this.cardsGrid.querySelectorAll('.card-back');
        this.hideDelay = setTimeout(this.hideCards, 5000);
        this.cardBacks.forEach((card) => {
            card.addEventListener('click', this.cardClickHandler);
        });

        this.goBackButton.addEventListener('click', this.goBackClickHandler);
    }

    render(widgetAsObject: LayoutTree) {
        this.plateContainer.appendChild(templateEngine(widgetAsObject));
    }

    stopwatch() {
        this.master.state.spentTime++;

        this.stopwatchWindow.innerText = this.formatTime(
            this.master.state.spentTime
        );
    }

    formatTime(secconds: number) {
        let mins: string | number = Math.floor(secconds / 60);
        let secs: string | number = secconds % 60;

        if (mins < 10) mins = '0' + mins;
        if (secs < 10) secs = '0' + secs;
        return `${mins}.${secs}`;
    }

    getCardsByLevel(level: string | undefined /*low|med|high*/): Card[] {
        const result: Card[] = [];
        let iterator = 3;
        level === 'med' && (iterator = 6);
        level === 'high' && (iterator = 10);
        const proxyCards = this.cards;

        for (let i = iterator; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * proxyCards.length);

            result.push(proxyCards[randomIndex]);
            result.push(proxyCards.splice(randomIndex, 1).flat());
        }
        return result;
    }

    tossCards(deck: Card[]) {
        const result = [];

        while (deck.length) {
            result.push(
                deck.splice(Math.floor(Math.random() * deck.length), 1)
            );
        }
        return result.flat();
    }

    applyTableGrid() {
        switch (this.master.state.difficultyLevel) {
            case 'low':
                this.cardsGrid.classList.add('game-table__cards_low');
                break;

            case 'med':
                this.cardsGrid.classList.add('game-table__cards_med');
                break;

            case 'high':
                this.cardsGrid.classList.add('game-table__cards_high');
                break;
        }
    }

    drawCardFace(cardCode: Card) {
        const cardRank = cardCode[0];
        const cardSuit = cardCode[1];

        let cardSuitLink = '';
        switch (cardSuit) {
            case 'h':
                cardSuitLink = heartsIcon;
                break;
            case 's':
                cardSuitLink = spadesIcon;
                break;
            case 'd':
                cardSuitLink = diamondsIcon;
                break;
            case 'c':
                cardSuitLink = clubsIcon;
                break;
        }

        const cardFace = templateEngine(GameTable.cardFaceTemeplate);
        if (!(cardFace instanceof Text)) {
            const cardRankSlots: NodeListOf<HTMLDivElement> =
                cardFace.querySelectorAll('.card-face__rank');
            const cardSuitSlots = cardFace.querySelectorAll('.card-face__suit');

            cardRankSlots.forEach((slot) => {
                slot.innerText = cardRank;
            });

            cardSuitSlots.forEach((slot) => {
                slot.setAttribute('src', cardSuitLink);
            });
        }

        return cardFace;
    }

    drawCardBack() {
        const cardBack = templateEngine(GameTable.cardBackTemeplate);
        const cardBackLink = cardBackImg;
        if (!(cardBack instanceof Text)) {
            const cardBackSlot = cardBack.querySelector('.card-back__img');
            cardBackSlot && cardBackSlot.setAttribute('src', cardBackLink);
        }

        return cardBack;
    }

    hideCards() {
        this.cardBacks.forEach((cardBack) => {
            cardBack.classList.add('cover');
        });
    }

    cardClickHandler(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        target.classList.remove('cover');
        const cardsParent = target.closest(
            '.game-table__cards'
        ) as HTMLDivElement;
        const cardsArray = cardsParent.querySelectorAll(
            '.card-back'
        ) as NodeListOf<HTMLDivElement>;
        let cardIndex: number | undefined = undefined;

        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i] === target) {
                cardIndex = i;
                break;
            }
        }

        if (!this.pickedCard) {
            this.master.state.pickedCards.push(this.cardsInGame[cardIndex!]);
            this.pickedCard = this.cardsInGame[cardIndex!];
            return;
        }

        if (
            this.pickedCard!.toString() ===
            this.cardsInGame[cardIndex!].toString()
        ) {
            this.master.state.pickedCards.push(this.cardsInGame[cardIndex!]);
            this.pickedCard = undefined;

            if (
                this.master.state.pickedCards.length === this.cardsInGame.length
            ) {
                clearInterval(this.interval);
                this.master.state.gameStatus = 'win';
                this.master.showCurrentGameStage(this.master.state.gameStatus);
            }
        } else {
            clearInterval(this.interval);
            this.master.state.gameStatus = 'lose';
            this.master.showCurrentGameStage(this.master.state.gameStatus);
        }
    }

    goBackClickHandler() {
        this.master.state.gameStatus = 'start';
        this.master.state.spentTime = 0;
        this.master.state.difficultyLevel = undefined;
        this.master.state.pickedCards = [];

        this.master.showCurrentGameStage(this.master.state.gameStatus);
    }
}

// TEMPLATES
GameTable.temeplate = {
    tag: 'div',
    cls: 'game-table',
    content: [
        {
            tag: 'header',
            cls: 'game-table__header',
            content: [
                {
                    tag: 'div',
                    cls: ['game-table__stopwatch', 'stopwatch'],
                    content: [
                        {
                            tag: 'div',
                            cls: 'stopwatch__units',
                            content: [
                                {
                                    tag: 'div',
                                    cls: 'stopwatch__minute-unit',
                                    content: 'min',
                                },
                                {
                                    tag: 'div',
                                    cls: 'stopwatch__second-unit',
                                    content: 'sec',
                                },
                            ],
                        },
                        {
                            tag: 'div',
                            cls: 'stopwatch__time',
                            content: '00.00',
                        },
                    ],
                },
                {
                    tag: 'button',
                    cls: ['game-table__go-back-button', 'button'],
                    attrs: {
                        type: 'button',
                    },
                    content: 'Начать заново',
                },
            ],
        },
        {
            tag: 'div',
            cls: 'game-table__cards',
        },
    ],
};

GameTable.cardTemeplate = {
    tag: 'div',
    cls: 'card',
};

GameTable.cardFaceTemeplate = {
    tag: 'div',
    cls: 'card-face',
    content: [
        {
            tag: 'div',
            cls: 'card-face__desc',
            content: [
                {
                    tag: 'div',
                    cls: 'card-face__rank',
                    content: 'A',
                },
                {
                    tag: 'img',
                    cls: 'card-face__suit',
                    attrs: {
                        alt: "Card's suit image",
                    },
                },
            ],
        },
        {
            tag: 'img',
            cls: ['card-face__suit', 'card-face__suit_main'],
            attrs: {
                alt: "Card's suit image",
            },
        },
        {
            tag: 'div',
            cls: ['card-face__desc', 'card-face__desc_reverse'],
            content: [
                {
                    tag: 'div',
                    cls: 'card-face__rank',
                    content: 'A',
                },
                {
                    tag: 'img',
                    cls: 'card-face__suit',
                    attrs: {
                        alt: "Card's suit image",
                    },
                },
            ],
        },
    ],
};

GameTable.cardBackTemeplate = {
    tag: 'div',
    cls: 'card-back',
    content: [
        {
            tag: 'img',
            cls: 'card-back__img',
            attrs: {
                alt: "Card's back image",
            },
        },
    ],
};
