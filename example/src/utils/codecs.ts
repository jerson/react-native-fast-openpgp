import base64 from "./base64";

export function base64Encode(uint8Array:Uint8Array) {
    let binary = '';
    uint8Array.forEach(byte => {
        binary += String.fromCharCode(byte);
    });
    return base64.encode(binary);
}

export function stringToUint8Array(str:string) {
    return new global.TextEncoder().encode(str);
}

export function uint8ArrayToString(str:Uint8Array) {
    return new global.TextDecoder().decode(str);
}
