/*global templateEngine */

class resultPlate {
    constructor(container, master) {
        this.plateContainer = container; // cardMatchApp.appScreen

        this.render(resultPlate.temeplate);
    }

    render(widgetAsObject) {
        this.plateContainer.appendChild(templateEngine(widgetAsObject));
    }
}

// TEMPLATES
resultPlate.temeplate = {
    tag: 'div',
    cls: 'result',
    content: 'Result Plate',
};
