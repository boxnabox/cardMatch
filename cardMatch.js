/*global templateEngine, difficultyLevelPlate, gameTable, resultPlate */

// APP
class cardMatchApp {
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
        this.render(cardMatchApp.appScreenTemeplate);
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
                this.appStartStage = new difficultyLevelPlate(
                    this.appScreen,
                    this
                );
                break;

            case status === 'game':
                this.appScreen.innerHTML = '';
                this.appGameStage = new gameTable(this.appScreen, this);
                break;

            case status === 'win' || status === 'lose':
                this.appResultStage = new resultPlate(this.appScreen, this);
                break;
        }
    }
}

// TEMPLATES
cardMatchApp.appScreenTemeplate = {
    tag: 'div',
    cls: 'app-screen',
};
