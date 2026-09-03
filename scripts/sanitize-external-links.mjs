import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const disabledHref = '#external-links-disabled';
const localThumbnail = '/creator_fansite/avatars/creator-a.svg';
const remoteThumbnailUrl = /https:\/\/videoimg\.sooplive\.co\.kr\/[^"<\\\s]+/gi;
const blockedPlatformUrl = /https:\/\/(?:www\.|vod\.)?(?:sooplive\.co\.kr|youtube\.com|x\.com)(?:\/[^"<\\\s]*)?/gi;
const hiddenLinkStyle = '<style id="disable-external-profile-links">a[href="#external-links-disabled"]{display:none!important}</style>';
const legacyHiddenLinkStyle = '<style id="disable-external-member-links">a[href="#external-links-disabled"]{display:none!important}</style>';

const memberRoot = path.join(repoRoot, 'member');
const members = await fs.readdir(memberRoot, { withFileTypes: true });
const memberFiles = members
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) => ['index.html', 'index.txt'].map((name) => path.join(memberRoot, entry.name, name)));
const targets = [
  path.join(repoRoot, 'index.html'),
  path.join(repoRoot, 'index.txt'),
  path.join(repoRoot, 'recap', 'index.html'),
  path.join(repoRoot, 'recap', 'index.txt'),
  path.join(repoRoot, 'api', 'clips', 'top'),
  ...memberFiles,
];

let replacementCount = 0;
for (const target of targets) {
  let text = await fs.readFile(target, 'utf8');
  text = text.replace(remoteThumbnailUrl, () => {
    replacementCount += 1;
    return localThumbnail;
  });
  text = text.replace(blockedPlatformUrl, () => {
    replacementCount += 1;
    return disabledHref;
  });
  text = text.replace(legacyHiddenLinkStyle, '');
  if (target.endsWith('.html') && text.includes(disabledHref) && !text.includes('id="disable-external-profile-links"')) {
    text = text.replace('</head>', `${hiddenLinkStyle}</head>`);
  }
  await fs.writeFile(target, text, 'utf8');
}

const remaining = [];
for (const target of targets) {
  const text = await fs.readFile(target, 'utf8');
  if (remoteThumbnailUrl.test(text) || blockedPlatformUrl.test(text)) remaining.push(path.relative(repoRoot, target));
  remoteThumbnailUrl.lastIndex = 0;
  blockedPlatformUrl.lastIndex = 0;
}

if (remaining.length) {
  throw new Error(`External platform URLs remain in: ${remaining.join(', ')}`);
}

console.log(JSON.stringify({ files: targets.length, replacementCount, status: 'PASS' }));
