class gameTable {
    constructor(container, master) {
        this.plateContainer = container; // cardMatchApp.appScreen

        this.render(gameTable.temeplate);
    }

    render(widgetAsObject) {
        this.plateContainer.appendChild(templateEngine(widgetAsObject));
    }

}

// TEMPLATES
gameTable.temeplate = {
    tag: "div",
    cls: "game",
    content: "Game Table"
};