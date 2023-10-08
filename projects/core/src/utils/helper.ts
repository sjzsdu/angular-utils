export function doCopy(text: string) {
    const win = window as any;
    if (win.copy) {
        win.copy(text);
    } else if (win.navigator?.clipboard?.writeText) {
        win.navigator?.clipboard?.writeText(text);
    } else {
        copyToClipboard(text);
    }
}

export function copyToClipboard(text: string) {
    const textEle = document.createElement('textarea');
    textEle.style.position = 'absolute';
    textEle.style.left = '-9999px';
    textEle.style.top = '-9999px';
    document.body.appendChild(textEle);
    textEle.value = text;
    textEle.select();
    document.execCommand('copy');
    document.body.removeChild(textEle);
}

function generateRandomHex(length: number): string {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function generateUUID(): string {
    return `${generateRandomHex(8)}-${generateRandomHex(4)}-${generateRandomHex(4)}-${generateRandomHex(
        4
    )}-${generateRandomHex(12)}`;
}