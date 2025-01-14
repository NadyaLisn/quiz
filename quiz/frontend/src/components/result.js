import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";


export class Result {


    constructor() {
        this.routeParams = UrlManager.getQueryParams()
        this.userResult = [];
        this.init();
        this.click();
    }

    async init() {

        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id +
                    '/result?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                }
            } catch (error) {
                console.log(error)
            }

            return
        }
        location.href = '#/';
    }


    async complete() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        if (userInfo) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    location.href = '#/answers?id=' + this.routeParams.id;
                }
            } catch (error) {
                console.log(error)
            }
        }

    }

    click() {
        const that = this
        document.getElementById('correct').onclick = function (event) {
            that.complete(this);
        }
    }

}


