import { action } from "typesafe-actions";
import { ChatActionTypes, SnapEngageApi } from "./types";
import * as log from 'loglevel';
import { currentEnvironment, Environments } from "../../config/environment";
import { isEmpty } from 'lodash';

const initChat = () => action(ChatActionTypes.INIT);
const chatReady = (instance: SnapEngageApi) => action(ChatActionTypes.READY, instance);
const turnOffline = () => action(ChatActionTypes.OFFLINE);
const turnOnline = () => action(ChatActionTypes.ONLINE);

export function setup() {
    return function (dispatch: (param: any) => any) {

        log.info('Loading SnapEngage chat');
        dispatch(initChat())


        try {
            document.getElementById('webim-container').style.display = 'none';
        }
        catch (err) {
            // Do nothing
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = getSnapEngageScriptSource();

        let done = false;

        // @ts-ignore
        script.onload = script.onreadystatechange = function () {

            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                log.info('Loaded SnapEngage chat');
                // @ts-ignore
                const se: SnapEngageApi = window.SnapEngage;
                se.hideButton();
                se.allowChatSound(false);

                se.setCallback('Close', removeSnapEngageStyle);
                se.setCallback('Minimize', removeSnapEngageStyle);

                setupPing(se, dispatch);
                dispatch(chatReady(se));
            }
        }

        document.head.appendChild(script);
    }
}

function removeSnapEngageStyle() {
    const elements = document.getElementsByTagName('style');

    if (!isEmpty(elements)) {
        // getElementsByTagName returns a collection which cannot be iterated over. Converting it to an array.
        const styleElements = Array.prototype.slice.call(elements);

        styleElements.filter(element => !isEmpty(element.innerText))                // no point removing empty styles
            .filter(element => element.innerText.indexOf('designstudio') >= 0)      // only remove style element if it contains SnapEngage style
            .forEach(element => {
                document.head.appendChild(element);
                element.remove();
            });
    }
}

function getSnapEngageScriptSource() {
    if (currentEnvironment === Environments.production) {
        return '//storage.googleapis.com/code.snapengage.com/js/8b59b679-9d15-4cb4-aabe-cc9f568d063a.js';
    } else {
        return '//storage.googleapis.com/code.snapengage.com/js/e8b139d3-0051-4b76-81a4-dc61a4639da4.js';
    }
}

function setupPing(se: SnapEngageApi, dispatch: (param: any) => any) {
    ping(se, dispatch);
    setInterval(() => ping(se, dispatch), 60000);
}

function ping(se: SnapEngageApi, dispatch: (param: any) => any) {
    se.getAgentStatusAsync((isOnline: boolean) => {
        if (isOnline) {
            log.info('Agent(s) available. Enabling chat');
            dispatch(turnOnline());
        } else {
            log.warn('Agents not available. Disabling chat');
            dispatch(turnOffline());
        }
    });
}
