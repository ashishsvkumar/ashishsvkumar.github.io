
export function isEmptyString(str: any): boolean {
    return str === null || (typeof str !== 'string') || str.trim().length === 0;
}

export function isEmptyArray(obj: any): boolean {
    return obj === null || !(typeof obj === 'object') || !(obj instanceof Array) || (obj.length === 0) || (obj.every(entry => isEmptyString(entry) && isEmptyObject(entry)));
}

export function isEmptyObject(obj: any): boolean {
    return obj === null || !(typeof obj === 'object') || Object.keys(obj).length === 0;
}

export function decode(str: string): string {
    return decodeURIComponent(str).replace(/%20/g, ' ').replace(/\+/g, ' ').replace(/\-/g, ' ');
}

export function encodeSpace(str: string): string {
    return encodeURIComponent(str).replace(/%20/g, '+');
}

export function refresh(): void {
    location.reload();
}

export function random(min: number,  max: number){ 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}