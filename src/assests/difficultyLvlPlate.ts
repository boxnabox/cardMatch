/*global */
import { templateEngine } from '../scripts/template_engine';
import { Notyf } from 'notyf';
import { CardMatchApp } from './cardMatch';
export { DifficultyLevelPlate };

class DifficultyLevelPlate {
    plateContainer: HTMLElement;
    levelPlate: HTMLDivElement;
    optionForm: HTMLFormElement;
    optionInput: HTMLInputElement;
    optionsWrapper: HTMLDivElement;
    options: NodeListOf<HTMLButtonElement>;
    submitButton: HTMLButtonElement;
    static temeplate: LayoutTree;
    static errorKeys: (keyof ValidityState)[];
    static ERRORS: ErrorsType = {
        'level-nput': {
            valueMissing: 'Уровень сложности не выбран',
        },
    };

    constructor(container: HTMLElement, master: CardMatchApp) {
        this.plateContainer = container; // cardMatchApp.appScreen
        this.render(DifficultyLevelPlate.temeplate);

        this.levelPlate = this.plateContainer.querySelector(
            '.difficulty-level'
        ) as HTMLDivElement;
        this.optionForm = this.levelPlate.querySelector(
            '.difficulty-level__form'
        ) as HTMLFormElement;
        this.optionInput = this.optionForm.querySelector(
            '.form__difficulty-level-input'
        ) as HTMLInputElement;
        this.optionsWrapper = this.optionForm.querySelector(
            '.form__difficulty-level-options'
        ) as HTMLDivElement;
        this.options = this.optionForm.querySelectorAll(
            '.form__difficulty-level-option'
        );
        this.submitButton = this.optionForm.querySelector(
            '.form__submit-button'
        ) as HTMLButtonElement;

        this.optionClickHandler = this.optionClickHandler.bind(this);

        this.options.forEach((option) => {
            option.addEventListener('click', this.optionClickHandler);
        });
        this.optionForm.addEventListener('submit', (event) => {
            this.formSubmitHandler(event, master);
        });
    }

    render(widgetAsObject: LayoutTree) {
        this.plateContainer.appendChild(templateEngine(widgetAsObject));
    }

    optionClickHandler(event: MouseEvent) {
        const target = event.target as HTMLInputElement;
        this.optionInput.value = target.value;

        this.options.forEach((button) => {
            button === target
                ? button.classList.remove('not-selected')
                : button.classList.add('not-selected');
        });
    }

    formSubmitHandler(event: SubmitEvent, master: CardMatchApp) {
        event.preventDefault();

        if (this.optionInput.validity.valid) {
            master.state.difficultyLevel = this.optionInput
                .value as DifficultyLevel;
            master.state.gameStatus = 'game';
            master.showCurrentGameStage(master.state.gameStatus);

            return;
        }

        for (const errorType of DifficultyLevelPlate.errorKeys) {
            if (!this.optionInput.validity[errorType]) continue;

            const errorMessage =
                DifficultyLevelPlate.ERRORS[this.optionInput.name][errorType];
            let x = this.optionInput.name;
            let y = errorType;
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
DifficultyLevelPlate.errorKeys = Object.keys(ValidityState.prototype) as Array<
    keyof typeof ValidityState.prototype
>;

// TEMPLATES
DifficultyLevelPlate.temeplate = {
    tag: 'div',
    cls: 'difficulty-level',
    content: [
        {
            tag: 'h3',
            cls: ['difficulty-level__title', 'title'],
            content: 'Выбери сложность',
        },
        {
            tag: 'form',
            cls: ['difficulty-level__form', 'form'],
            attrs: {
                action: '#',
                novalidate: '',
            },
            content: [
                {
                    tag: 'input',
                    cls: ['form__difficulty-level-input', 'visually-hidden'],
                    attrs: {
                        type: 'text',
                        name: 'level-nput',
                        required: '',
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
                    content: 'Старт',
                },
            ],
        },
    ],
};
