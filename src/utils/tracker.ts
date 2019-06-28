import * as log from 'loglevel';
import { isWindVandAvailable } from '../api/windvane';
import { currentEnvironment, Environments } from '../config/environment';

function getGA() {
    if (currentEnvironment === Environments.preLive) {
        return (...args) => log.info('Mock GA:', args);
    }

    // @ts-ignore
    const ga = window && window.ga;
    return ga;
}

export function trackPageView(url: string = sanitizePath(location.pathname)) {
    try {
        const ga = getGA();

        ga("set", "page", url);
        ga("send", "pageview", url);

        if (isWindVandAvailable()) {
            ga('send', 'screenview', { screenName: url, appName: 'RedMart Helpcenter' });
        }
    }
    catch (err) {
        log.error('Error for GA view', err);
    }
}

export function trackEvent(category: string, action: string, label?: string, value?: string) {
    try {
        const ga = getGA();
        ga("send", "event", category, action, label, value, { nonInteraction: false });
    }
    catch (err) {
        log.error('Error for GA event', err);
    }
}

function sanitizePath(path: string) {
    let out = path.trim();

    if (out !== '/') {
        out = out.replace(/\/$/, '');
    }

    return out;
}