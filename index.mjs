#!/usr/bin/env node
import fs from 'fs/promises';
import glob from 'glob';
import { promisify } from 'util';

const globAsync = promisify(glob);

const [nodeExecutable, scriptPath, globPattern] = process.argv;

if (!globPattern) {
  console.error(`
    Usage: npx remove-utf8-bom <globPattern>
  `);

  process.exit(1);
}

const files = await globAsync(globPattern);

for (const file of files) {
  const buffer = await fs.readFile(file);

  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    const content = buffer.toString('utf8', 3);

    await fs.writeFile(file, content);
  }
}

console.log(files.join('\n'));
