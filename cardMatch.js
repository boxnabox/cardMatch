// APP
class cardMatchApp {
    constructor(container) {

        // GLOBAL APP STATE
        this.state = {
            difficultyLevel: undefined, // low|med|high
            gameStatus: "start", // start<default>|game|result
            spentTime: undefined,
            pickedCards: undefined
        }
        // this.state = new Proxy(this.state, {

        //     set(target, property, value) {

        //         if (target.gameStatus !== value) {

        //             target.gameStatus = value;
        //             return true;

        //         } else {
        //             return false;
        //         }
        //     }
        // });

        this.showCurrentGameStage = this.showCurrentGameStage.bind(this);

        this.appContainer = container; // document.body
        this.render(cardMatchApp.appScreenTemeplate);

        this.appScreen = this.appContainer.querySelector(".app-screen");

        this.showCurrentGameStage(this.state.gameStatus)
    }

    render(widgetAsObject) {
        this.appContainer.appendChild(templateEngine(widgetAsObject));
    }

    showCurrentGameStage(status) {
        this.appScreen.innerHTML = "";

        switch (true) {
            case status === "start":
                this.appStartStage = new difficultyLevelPlate(this.appScreen, this);
                break;

            case status === "game":
                this.appGameStage = new gameTable(this.appScreen, this);
                break;

            case status === "result":
                this.appResultStage = new resultPlate(this.appScreen, this);
                break;
        }
    }

}

// TEMPLATES
cardMatchApp.appScreenTemeplate = {
    tag: "div",
    cls: "app-screen"
};