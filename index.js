/*eslint no-unused-vars: "warn"*/
import './src/styles/style.css';
import './node_modules/notyf/notyf.min.css';
import { CardMatchApp } from './src/assests/cardMatch.js';

const body = document.querySelector('body');
const game = new CardMatchApp(body);
