import * as log from 'loglevel';

const toMb = (size) => size / (1024 * 1024); // size in MB

function humanFileSize(bytes: number) {
    const thresh = 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

function dataURLtoFile(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

function compressImg(source, quality, outputFormat) {
    const cvs = document.createElement('canvas');
    cvs.width = source.naturalWidth;
    cvs.height = source.naturalHeight;

    cvs.getContext("2d").drawImage(source, 0, 0);
    return dataURLtoFile(cvs.toDataURL(outputFormat, quality / 100));
}

function compressToQuality(file, quality, callback) {

    if (quality <= 40 || quality >= 100) {
        log.info('Skipping compression');
        callback(file);
        return;
    }


    const image = new Image();

    image.onload = function () {
        let out;

        try {
            log.info('Compressing file');
            out = compressImg(image, quality, file.type);
            out = out.size > file.size ? file : out;

            log.info('File compressed. New size', humanFileSize(out.size));
            callback(out);
        }
        catch (err) {
            log.info('Error while compressing file', err);
            callback(file);
        }
    };

    image.src = URL.createObjectURL(file);
}

export function compress(file, callback) {
    const size = toMb(file.size);
    let quality: number;

    if (size <= 1) {
        quality = 100;
    } else {
        quality = 50;
    }

    log.info('File', file.name, 'has size', humanFileSize(file.size), '. Setting quality to', quality + '%');
    compressToQuality(file, quality, callback);
}

