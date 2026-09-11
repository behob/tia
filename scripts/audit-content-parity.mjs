import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

const teamSource = readFileSync(join(process.cwd(), 'src', 'data', 'team.ts'), 'utf8');
const contentDir = join(process.cwd(), 'src', 'content', 'team');
const failures = [];

function readTeamContent() {
  if (!existsSync(contentDir)) {
    failures.push('src/content/team: missing team content directory');
    return [];
  }

  return readdirSync(contentDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const entry = JSON.parse(readFileSync(join(contentDir, file), 'utf8'));
      return { slug: basename(file, '.json'), ...entry };
    });
}

const contentEntries = readTeamContent();
const contentByName = new Map(contentEntries.map((entry) => [entry.name, entry]));
const moduleMemberMatches = [
  ...teamSource.matchAll(/\{\s*image:\s*'(?<image>[^']+)',\s*name:\s*'(?<name>[^']+)',\s*role:\s*'(?<role>[^']+)'\s*\}/g),
].map((match) => match.groups);

for (const member of moduleMemberMatches) {
  const content = contentByName.get(member.name);

  if (!content) {
    failures.push(`team content missing entry for ${member.name}`);
    continue;
  }

  for (const key of ['image', 'role']) {
    if (content[key] !== member[key]) {
      failures.push(`team content mismatch for ${member.name}: ${key} differs`);
    }
  }
}

for (const entry of contentEntries) {
  const isListMember = moduleMemberMatches.some((member) => member.name === entry.name);
  const isDetailMember = teamSource.includes(`name: '${entry.name}'`) && teamSource.includes(`image: '${entry.image}'`);

  if (!isListMember && !isDetailMember) {
    failures.push(`team content entry ${entry.slug} has no matching src/data/team.ts record`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Content parity audit passed for ${contentEntries.length} team entries.`);
