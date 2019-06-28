import * as log from 'loglevel';
import { trackEvent } from '../utils/tracker';
// @ts-ignore
const windvane = window.WindVane;

export const enum Host {
    IOS_WEBVIEW = "iOS-Webview",
    ANDROID_WEBVIEW = "Android-Webview",
    WEB = "Web"
}

export function getHostEnvironment(): Promise<Host> {
    return windvane.call('Base', 'isWindVaneSDK', {}).then((response: any) => {
        if (response.os === 'ios') {
            return Host.IOS_WEBVIEW;
        } else {
            return Host.ANDROID_WEBVIEW
        }
    }).catch((err: any) => Host.WEB);
}

export function isInWebView(): Promise<boolean> {
    return getHostEnvironment().then(host => host !== Host.WEB);
}

export function showToast(message: string, duration: number = 5) {
    isInWebView().then(yes => {
        yes && windvane.call('WVUIToast', 'toast', { message, duration });
    })
}

export function openBrowser(url: string) {
    isInWebView().then(yes => {
        yes && windvane.call('Base', 'openBrowser', { url });
    })
}

export function initiateLogin(onSuccess?: () => void, onFailure?: () => void) {
    isInWebView().then(yes => {
        yes && windvane.call('LAWVUserInfo', 'login', {}).then((response: any) => {
            if (response.success === "true") {
                log.info('User login successful')
                onSuccess && onSuccess();
            } else {
                log.info('User login failed');
                onFailure && onFailure();
            }
        });
    });
}

export function isWindVandAvailable(): boolean {
    // @ts-ignore
    return window.lib.windvane.isAvailable;
}

export function takePhoto(callback: (url: string) => void) {
    getHostEnvironment().then(host => {
        if (host === Host.WEB) {
            log.warn('User is not in windvane env. Aborting.');
            return;
        }

        const param = {
            type: '1',
            v: '2.0',
            mode: 'both',
            bizCode: 'lazada-im-sg'
        };

        windvane.call('WVCamera', 'takePhoto', param).then((response: any) => {
                
            log.info('User has selected an image on iOS', response);
            callback(response.resourceURL);

            trackEvent('Attachment', 'upload', 'host', host);

        }).catch((err: any) => {

            log.warn('User has cancelled image selection on iOS', err);
            callback(null);

            trackEvent('Attachment', 'failure', 'host', host);
            
        });

    });

}
