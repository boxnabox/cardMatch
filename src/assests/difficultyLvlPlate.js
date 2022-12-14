/*global */
import { templateEngine } from '../scripts/template_engine.js';
import { Notyf } from 'notyf';
export { DifficultyLevelPlate };

class DifficultyLevelPlate {
    constructor(container, master) {
        this.plateContainer = container; // cardMatchApp.appScreen
        this.render(DifficultyLevelPlate.temeplate);

        this.levelPlate =
            this.plateContainer.querySelector('.difficulty-level');
        this.optionForm = this.levelPlate.querySelector(
            '.difficulty-level__form'
        );
        this.optionInput = this.optionForm.querySelector(
            '.form__difficulty-level-otion'
        );
        this.optionsWrapper = this.optionForm.querySelector(
            '.form__difficulty-level-options'
        );
        this.options = this.optionForm.querySelectorAll(
            '.form__difficulty-level-option'
        );
        this.submitButton = this.optionForm.querySelector(
            '.form__submit-button'
        );

        this.optionClickHandler = this.optionClickHandler.bind(this);

        this.options.forEach((option) => {
            option.addEventListener('click', this.optionClickHandler);
        });
        this.optionForm.addEventListener('submit', (event) => {
            this.formSubmitHandler(event, master);
        });
    }

    render(widgetAsObject) {
        this.plateContainer.appendChild(templateEngine(widgetAsObject));
    }

    optionClickHandler(event) {
        const target = event.target;

        this.optionInput.value = target.value;

        this.options.forEach((button) => {
            button === target
                ? button.classList.remove('not-selected')
                : button.classList.add('not-selected');
        });
    }

    formSubmitHandler(event, master) {
        event.preventDefault();

        if (this.optionInput.validity.valid) {
            master.state.difficultyLevel = this.optionInput.value;
            master.state.gameStatus = 'game';
            master.showCurrentGameStage(master.state.gameStatus);

            return;
        }

        for (const errorType of DifficultyLevelPlate.errorKeys) {
            if (!this.optionInput.validity[errorType]) continue;

            const errorMessage =
                DifficultyLevelPlate.ERRORS[this.optionInput.name][errorType];
            const notyf = new Notyf();
            notyf.error({
                message: errorMessage,
                position: {
                    x: 'center',
                    y: 'top',
                },
            });
            break;
        }
    }
}

// ERRORS MGMT
DifficultyLevelPlate.errorKeys = Object.keys(ValidityState.prototype);
DifficultyLevelPlate.ERRORS = {
    'level-nput': {
        valueMissing: '?????????????? ?????????????????? ???? ????????????',
    },
};

// TEMPLATES
DifficultyLevelPlate.temeplate = {
    tag: 'div',
    cls: 'difficulty-level',
    content: [
        {
            tag: 'h3',
            cls: ['difficulty-level__title', 'title'],
            content: '???????????? ??????????????????',
        },
        {
            tag: 'form',
            cls: ['difficulty-level__form', 'form'],
            attrs: {
                action: '#',
                novalidate: true,
            },
            content: [
                {
                    tag: 'input',
                    cls: ['form__difficulty-level-otion', 'visually-hidden'],
                    attrs: {
                        type: 'text',
                        name: 'level-nput',
                        required: true,
                    },
                },
                {
                    tag: 'div',
                    cls: [
                        'form__difficulty-level-options',
                        'difficulty-level-options',
                    ],
                    content: [
                        {
                            tag: 'button',
                            cls: [
                                'form__difficulty-level-option',
                                'form__difficulty-level-option_low',
                            ],
                            attrs: {
                                type: 'button',
                                value: 'low',
                            },
                            content: '1',
                        },
                        {
                            tag: 'button',
                            cls: [
                                'form__difficulty-level-option',
                                'form__difficulty-level-option_med',
                            ],
                            attrs: {
                                type: 'button',
                                value: 'med',
                            },
                            content: '2',
                        },
                        {
                            tag: 'button',
                            cls: [
                                'form__difficulty-level-option',
                                'form__difficulty-level-option_high',
                            ],
                            attrs: {
                                type: 'button',
                                value: 'high',
                            },
                            content: '3',
                        },
                    ],
                },
                {
                    tag: 'button',
                    cls: ['form__submit-button', 'button'],
                    attrs: {
                        type: 'submit',
                    },
                    content: '??????????',
                },
            ],
        },
    ],
};
