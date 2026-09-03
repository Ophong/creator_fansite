import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicFiles = [
  'index.html',
  'index.txt',
  'recap/index.html',
  'recap/index.txt',
  'api/clips/top',
  'member/aengduwoo/index.html',
  'member/aengduwoo/index.txt',
  'member/bbungchi/index.html',
  'member/bbungchi/index.txt',
  'member/cocomizzang/index.html',
  'member/cocomizzang/index.txt',
  'member/inorisama/index.html',
  'member/inorisama/index.txt',
];
const blockedUrl = /https:\/\/[^"<\\\s]*(?:sooplive\.co\.kr|youtube\.com|x\.com)/i;

const failures = [];
for (const relativePath of publicFiles) {
  const text = await fs.readFile(path.join(repoRoot, relativePath), 'utf8');
  if (blockedUrl.test(text)) failures.push(`${relativePath}: external platform URL remains`);
  if (relativePath.startsWith('member/') && relativePath.endsWith('.html')) {
    if (!text.includes('id="disable-external-profile-links"')) failures.push(`${relativePath}: disabled-link style is missing`);
    if (!text.includes('href="/creator_fansite/"')) failures.push(`${relativePath}: internal main-page link is missing`);
  }
}

if (failures.length) throw new Error(failures.join('\n'));
console.log(JSON.stringify({ filesChecked: publicFiles.length, memberPagesChecked: 4, status: 'PASS' }));
