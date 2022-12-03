/*global */
import { templateEngine } from '../scripts/template_engine.js';
import loseIcon from '../img/lose.svg';
import winIcon from '../img/win.svg';
export { ResultPlate };

class ResultPlate {
    constructor(container, master) {
        this.plateContainer = container; // cardMatchApp.appScreen
        this.master = master;
        // this.render(ResultPlate.temeplate);
        this.resultScreen = templateEngine(ResultPlate.temeplate);

        this.resultPlate = this.resultScreen.querySelector('.result-plate');
        this.resultImage = this.resultPlate.querySelector(
            '.result-plate__image'
        );
        this.resultTitle = this.resultPlate.querySelector(
            '.result-plate__title'
        );
        this.resultTime = this.resultPlate.querySelector('.result-plate__time');
        this.playAgainButtom = this.resultPlate.querySelector(
            '.result-plate__again-button'
        );

        this.goBackClickHandler = this.goBackClickHandler.bind(this);
        this.playAgainButtom.addEventListener('click', this.goBackClickHandler);

        if (this.master.state.gameStatus === 'win') {
            this.resultImage.setAttribute('src', winIcon);
            this.resultTitle.innerText = 'Вы выиграли!';
        } else {
            this.resultTitle.innerText = 'Вы проиграли!';
            this.resultImage.setAttribute('src', loseIcon);
        }
        this.resultTime.innerText = this.formatTime(
            this.master.state.spentTime
        );

        this.plateContainer.appendChild(this.resultScreen);
    }

    formatTime(secconds) {
        let mins = Math.floor(secconds / 60);
        let secs = secconds % 60;

        if (mins < 10) mins = '0' + mins;
        if (secs < 10) secs = '0' + secs;
        return `${mins}.${secs}`;
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
ResultPlate.temeplate = {
    tag: 'div',
    cls: 'result-plate__canvas',
    content: [
        {
            tag: 'div',
            cls: ['result-plate'],
            content: [
                {
                    tag: 'img',
                    cls: 'result-plate__image',
                },
                {
                    tag: 'h3',
                    cls: ['result-plate__title', 'title'],
                    content: 'Ошибка',
                },
                {
                    tag: 'div',
                    cls: 'result-plate__time-wrapper',
                    content: [
                        {
                            tag: 'p',
                            cls: 'result-plate__time-label',
                            content: 'Затраченое время:',
                        },
                        {
                            tag: 'div',
                            cls: 'result-plate__time',
                            content: '00.00',
                        },
                    ],
                },
                {
                    tag: 'button',
                    cls: ['result-plate__again-button', 'button'],
                    attrs: {
                        type: 'button',
                    },
                    content: 'Играть снова',
                },
            ],
        },
    ],
};
