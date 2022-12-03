import { templateEngine } from '../scripts/template_engine.js';
import { DifficultyLevelPlate } from './difficultyLvlPlate.js';
import { GameTable } from './gameTable.js';
import { ResultPlate } from './resultPlate.js';

// APP
export class CardMatchApp {
    constructor(container) {
        // GLOBAL APP STATE
        this.state = {
            difficultyLevel: undefined, // low|med|high
            gameStatus: 'start', // start<default>|game|result
            spentTime: 0,
            pickedCards: [],
        };

        this.showCurrentGameStage = this.showCurrentGameStage.bind(this);
        this.appContainer = container; // document.body
        this.render(CardMatchApp.appScreenTemeplate);
        this.appScreen = this.appContainer.querySelector('.app-screen');
        this.showCurrentGameStage(this.state.gameStatus);
    }

    render(widgetAsObject) {
        this.appContainer.appendChild(templateEngine(widgetAsObject));
    }

    showCurrentGameStage(status) {
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
