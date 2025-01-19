/**
 * Defines the types of file reading operations
 */
export type ReaderType = 'text' | 'url' | 'binary' | 'buffer';

/**
 * Converts a file to the specified data type
 * @param file The file to be converted
 * @param type The conversion type, defaults to 'text'
 * @returns A Promise that resolves with the converted result
 */
export function transferFile(file: File, type: ReaderType = 'text') {
  return new Promise((resolve, reject) => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const result = e.target.result;
        resolve(result);
      };

      const blob = file.slice();
      switch (type) {
        case 'text':
          fileReader.readAsText(blob);
          break;
        case 'url':
          fileReader.readAsDataURL(blob);
          break;
        case 'binary':
          // Note: readAsBinaryString method is deprecated
          fileReader.readAsBinaryString(blob);
          break;
        case 'buffer':
          fileReader.readAsArrayBuffer(blob);
          break;
        default:
          reject('Type is not right');
      }
    } else {
      reject('No file');
    }
  });
}

/**
 * Converts a string or object to a Uint8Array
 * @param str The string or object to convert
 * @returns A Uint8Array representation of the input, or undefined if input is falsy
 */
export function strToArrayBuffer(str: string | object): Uint8Array | undefined {
  if (!str) {
    return undefined;
  }
  if (typeof str !== 'string') {
    str = JSON.stringify(str);
  }
  const textEncoder = new TextEncoder();
  return textEncoder.encode(str as string);
}

/**
 * Downloads an ArrayBuffer as a file
 * @param arrayBuffer The ArrayBuffer to be downloaded
 * @param filename The name of the file to be created
 */
export function downloadArrayBufferAsFile(arrayBuffer: ArrayBuffer, filename: string) {
  const blob = new Blob([arrayBuffer]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a string as a file
 * @param str The string to be downloaded
 * @param filename The name of the file to be created
 * @returns void
 */
export function downloadStringAsFile(str: string, filename: string) {
  if (!str) {
    return;
  }
  const buffer = strToArrayBuffer(str) as ArrayBuffer;
  return downloadArrayBufferAsFile(buffer, filename);
}

/**
 * Downloads binary data as a file
 * @param binaryData The binary data to be downloaded (can be an array or object)
 * @param fileName The name of the file to be created
 */
export function downloadFile(binaryData: any, fileName: string) {
  if (!Array.isArray(binaryData)) {
    binaryData = new Uint8Array(Object.values(binaryData));
  }
  const blob = new Blob([binaryData], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
