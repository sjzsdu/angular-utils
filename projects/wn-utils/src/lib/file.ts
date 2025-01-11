export type ReaderType = 'text' | 'url' | 'binary' | 'buffer';
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
