import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { questions, type Question } from '../src/data.ts';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validCategories = new Set(['Myotome', 'Dermatome', 'Brain Region', 'Nerve Root', 'Sensory Nerve']);

type Issue = {
  level: 'error' | 'warning';
  id?: string;
  message: string;
};

function imageExists(image: string): boolean {
  if (image === 'placeholder') return true;
  if (!image.startsWith('/drawings/')) return false;
  return fs.existsSync(path.join(rootDir, 'public', image.slice(1)));
}

function validateQuestion(q: Question, seenIds: Map<string, number>): Issue[] {
  const issues: Issue[] = [];
  const id = q.id || '(missing id)';

  if (!q.id.trim()) issues.push({ level: 'error', id, message: 'Missing id.' });
  seenIds.set(q.id, (seenIds.get(q.id) ?? 0) + 1);

  if (!validCategories.has(q.category)) {
    issues.push({ level: 'error', id, message: `Invalid category "${q.category}".` });
  }
  if (!q.prompt.trim()) issues.push({ level: 'error', id, message: 'Missing prompt.' });
  if (!q.answer.trim()) issues.push({ level: 'error', id, message: 'Missing answer.' });
  if (!Array.isArray(q.options) || q.options.length === 0) {
    issues.push({ level: 'error', id, message: 'Options must be a non-empty array.' });
  }

  const duplicateOptions = q.options.filter((option, index) => q.options.indexOf(option) !== index);
  if (duplicateOptions.length > 0) {
    issues.push({ level: 'warning', id, message: `Duplicate options: ${Array.from(new Set(duplicateOptions)).join(', ')}.` });
  }

  if (q.multiSelect) {
    if (!Array.isArray(q.answers) || q.answers.length === 0) {
      issues.push({ level: 'error', id, message: 'Multi-select question is missing answers[].' });
    } else {
      const missingAnswers = q.answers.filter(answer => !q.options.includes(answer));
      if (missingAnswers.length > 0) {
        issues.push({ level: 'error', id, message: `answers[] values missing from options[]: ${missingAnswers.join(', ')}.` });
      }
      if (q.answer !== q.answers.join(', ')) {
        issues.push({ level: 'warning', id, message: `answer display string differs from answers[] join: "${q.answer}" vs "${q.answers.join(', ')}".` });
      }
    }
  } else if (!q.options.includes(q.answer)) {
    issues.push({ level: 'error', id, message: `Answer "${q.answer}" is not present in options[].` });
  }

  if (q.image && !imageExists(q.image)) {
    issues.push({ level: 'error', id, message: `Image path does not resolve under public/: ${q.image}.` });
  }
  if (q.easyImage && !imageExists(q.easyImage)) {
    issues.push({ level: 'error', id, message: `easyImage path does not resolve under public/: ${q.easyImage}.` });
  }

  if (q.studyDirection && q.studyDirection !== 'forward' && q.studyDirection !== 'reverse') {
    issues.push({ level: 'error', id, message: `Invalid studyDirection "${q.studyDirection}".` });
  }

  if (q.directionLock && q.directionLock !== 'forward' && q.directionLock !== 'reverse') {
    issues.push({ level: 'error', id, message: `Invalid directionLock "${q.directionLock}".` });
  }

  return issues;
}

const seenIds = new Map<string, number>();
const issues = questions.flatMap(question => validateQuestion(question, seenIds));

for (const [id, count] of seenIds) {
  if (count > 1) {
    issues.push({ level: 'error', id, message: `Duplicate id appears ${count} times.` });
  }
}

// Reverse direction looks images up by prompt within a category, so duplicate prompts would be ambiguous.
const promptKeys = new Map<string, number>();
for (const q of questions) {
  const key = `${q.category} :: ${q.prompt}`;
  promptKeys.set(key, (promptKeys.get(key) ?? 0) + 1);
}
for (const [key, count] of promptKeys) {
  if (count > 1) {
    issues.push({ level: 'warning', message: `Prompt appears ${count} times in one category (ambiguous reverse lookup): ${key}.` });
  }
}

const errors = issues.filter(issue => issue.level === 'error');
const warnings = issues.filter(issue => issue.level === 'warning');
const realImages = questions.filter(q => q.image && q.image !== 'placeholder').length;
const placeholders = questions.filter(q => q.image === 'placeholder').length;

console.log(`Questions: ${questions.length}`);
console.log(`Images: ${realImages} real, ${placeholders} placeholder`);
console.log(`Issues: ${errors.length} errors, ${warnings.length} warnings`);

for (const issue of issues) {
  const prefix = issue.level === 'error' ? 'ERROR' : 'WARN';
  console.log(`${prefix}${issue.id ? ` ${issue.id}` : ''}: ${issue.message}`);
}

if (errors.length > 0) {
  process.exitCode = 1;
}

