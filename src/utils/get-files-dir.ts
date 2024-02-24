import path from 'path';
import * as fs from 'fs';

export default function GetFilesDir(diretory: string, filesIgnore: string[]): string[] {
  let files: string[] = [];
  try {
    const data = fs.readdirSync(path.resolve(diretory));
    for (const contents of data) {
      const dirname = path.resolve(diretory, contents);
      const isDirectory = fs.lstatSync(dirname).isDirectory();
      const shouldIgnore = filesIgnore.includes(dirname);
      files = [...files, ...(isDirectory ? GetFilesDir(dirname, filesIgnore) : shouldIgnore ? [] : [dirname])];
    }
  } catch (error) {}
  return files;
}
