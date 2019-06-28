import axios from 'axios';
import fetch from 'cross-fetch';
import { supportBase } from '../config/endpoints';
const CancelToken = axios.CancelToken;
import * as log from 'loglevel';
import { Ticket } from '../store/ticket/types';
import { compress } from './compress';
import { getHostEnvironment, Host } from './windvane';
import { isMobile } from '../config/environment';
import { trackEvent } from '../utils/tracker';

function getUploadUrl(): Promise<String> {
    return fetch(`${supportBase}/ticket/attachment`).then((response: any) => {
        if (response.status === 200) {
            const url = response.text();
            log.info('Fetched upload url', url)
            return url
        }
        return null;
    }).catch(err => null);
}

export function uploadFile(name: string, fileUncompressed: File,
    onProgress: (name: string, done: number, total: number) => void,
    cancel: (name: string, callback: Function) => void,
    callback: (url: string) => void
) {
    compress(fileUncompressed, (file) => {
        const url = `${supportBase}/ticket/attachment?originalSize=${fileUncompressed.size}`;

        const config: any = {
            // headers: {
            //     'Content-Type': 'file/image',
            //     'Content-Disposition': 'inline'
            // },
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel(name, c);
            }),
            onUploadProgress: (event: any) => onProgress(name, event.loaded, event.total)
        };

        const data = new FormData();
        data.append('file', file);

        axios.post(url, data, config).then(response => {
            if (response.status === 201) {
                log.info('File uploaded', response.statusText);
                callback(response.data.token);
                trackEvent('Attachment', 'upload', 'host', isMobile() ? 'mobile-web' : 'desktop-web');
            } else {
                log.error('File uploade failed', response);
                callback(null);
                trackEvent('Attachment', 'failure', 'host', isMobile() ? 'mobile-web' : 'desktop-web');
            }
        }).catch(err => {
            log.error('Error while uploading the file', err);
            callback('NA');
        })
    });
}

export function ticketCreate(ticket: Ticket) {

    return getHostEnvironment().then(host => {

        switch (host) {
            case Host.ANDROID_WEBVIEW: {
                ticket.tags = ['mode:lz_android_app'];
                break;
            }
            case Host.IOS_WEBVIEW: {
                ticket.tags = ['mode:lz_ios_app'];
                break;
            }
            default: {
                ticket.tags = [`mode:${isMobile() ? 'lz_msite' : 'lz_pc'}`];
            }
        }

        return fetch(
            `${supportBase}/ticket`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ticket: ticket })
            }
        )
    });
}


