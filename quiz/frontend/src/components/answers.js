import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";


export class Answers {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.quizQu = [];
        this.questionsTitleElement = null;
        this.currentQuestionsIndex = 1;
        this.answersElement = null;
        this.indexQuestion = 1;
        this.fullName = null;
        this.emailUser = null;
        this.init();
    }

    async init() {


        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id)
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.quizQu = result;
                }
            } catch (error) {
                console.log(error);
            }
        }
        this.startAnswers();

    }

    startAnswers() {

        const that = this
        this.fullName = Auth.getUserInfo().fullName;

        this.emailUser = localStorage.getItem('userEmail');
        this.questionsTitleElement = document.getElementById('answers-title');
        this.answersElement = document.getElementById('answers');

        document.getElementById('pre-title').innerText = this.quizQu.name;
        document.getElementById('pre-title').className = 'test-pre-title';
        document.getElementById('answers-name').innerText = this.fullName + ', ';
        document.getElementById('answers-email').innerText = this.emailUser;

        this.showQuestions();
        this.back();
    }
    showQuestions() {
        this.answersCorrect()
        this.quizQu.questions.forEach(qu => {
            const quElement = document.createElement('div');
            quElement.className = 'answers-item-title';
            quElement.innerHTML = '<span> Вопрос ' + this.indexQuestion++ + ':</span> ' + qu.question;
            this.answersElement.className = 'answers-item';
            this.answersElement.appendChild(quElement);
            const answerItem = document.createElement('div');
            answerItem.appendChild(quElement);
            answerItem.className = 'answers-item';
            qu.answers.forEach(answer => {
                const optionElement = document.createElement('div');
                optionElement.className = 'answer-version';

                const inputElement = document.createElement('input');
                inputElement.setAttribute('id', 'answer- ' + answer.id);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer');
                inputElement.setAttribute('value', 'answer' + answer.id);

                const labelElement = document.createElement('div');
                labelElement.className = 'answer-text';
                labelElement.innerText = answer.answer;

                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);
                answerItem.appendChild(optionElement);

                this.answersElement.appendChild(answerItem);

                qu.answers.find(item => {
                    if (answer.id === item.id) {
                        if (item.correct === true) {
                            inputElement.className = 'correct-answer'
                            labelElement.className = 'correct-answer'
                        } else if (item.correct === false) {
                            inputElement.className = 'not-correct-answer'
                            labelElement.className = 'not-correct-answer'
                        }
                    }
                })

            })
        })

    }

    back() {
        const correctAnswers = document.getElementById('back-result');
        correctAnswers.onclick = function () {
            history.back();
        }
    }

    async answersCorrect() {
        const userInfo = Auth.getUserInfo();

        if (!userInfo) {
            location.href = '#/';
        }
        if (userInfo) {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId)
                if (result) {
            try {

            } catch (error) {
                console.log(error)
            }
                }
        } else {
            location.href = '/#';
        }

    }

}


