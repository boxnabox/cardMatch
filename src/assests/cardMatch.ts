import { templateEngine } from '../scripts/template_engine';
import { DifficultyLevelPlate } from './difficultyLvlPlate';
import { GameTable } from './gameTable';
import { ResultPlate } from './resultPlate';

// APP
export class CardMatchApp {
    state: {
        difficultyLevel: DifficultyLevel; // string | undefined;
        gameStatus: GameStatus;
        spentTime: number;
        pickedCards: Card[];
    };
    appContainer: HTMLBodyElement;
    appScreen: HTMLElement | null;
    static appScreenTemeplate: LayoutTree;
    appStartStage?: DifficultyLevelPlate;
    appGameStage?: GameTable;
    appResultStage?: ResultPlate;

    constructor(container: HTMLBodyElement) {
        // GLOBAL APP STATE
        this.state = {
            difficultyLevel: 'no-lvl',
            gameStatus: 'start',
            spentTime: 0,
            pickedCards: [],
        };

        this.showCurrentGameStage = this.showCurrentGameStage.bind(this);
        this.appContainer = container; // document.body
        this.render(CardMatchApp.appScreenTemeplate);
        this.appScreen = this.appContainer.querySelector('.app-screen');
        this.showCurrentGameStage(this.state.gameStatus);
    }

    render(widgetAsObject: LayoutTree) {
        this.appContainer.appendChild(templateEngine(widgetAsObject));
    }

    showCurrentGameStage(status: typeof this.state.gameStatus) {
        if (this.appScreen === null) {
            return;
        }

        switch (true) {
            case status === 'start':
                this.appScreen.innerHTML = '';
                this.appStartStage = new DifficultyLevelPlate(
                    this.appScreen,
                    this
                );
                break;

            case status === 'game':
                this.appScreen.innerHTML = '';
                this.appGameStage = new GameTable(this.appScreen, this);
                break;

            case status === 'win' || status === 'lose':
                this.appResultStage = new ResultPlate(this.appScreen, this);
                break;
        }
    }
}

// TEMPLATES
CardMatchApp.appScreenTemeplate = {
    tag: 'div',
    cls: 'app-screen',
};
