import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { questions } from '../src/data.ts';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'ios', 'Shared');
const outputPath = path.join(outputDir, 'quiz-data.json');

const categoryCounts = questions.reduce<Record<string, number>>((counts, question) => {
  counts[question.category] = (counts[question.category] ?? 0) + 1;
  return counts;
}, {});

const exported = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: 'src/data.ts',
  counts: {
    total: questions.length,
    byCategory: categoryCounts,
    realImages: questions.filter(q => q.image && q.image !== 'placeholder').length,
    placeholderImages: questions.filter(q => q.image === 'placeholder').length,
    multiSelect: questions.filter(q => q.multiSelect).length,
  },
  questions: questions.map(question => ({
    ...question,
    image: question.image === 'placeholder' ? null : question.image ?? null,
  })),
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(exported, null, 2)}\n`);

console.log(`Exported ${questions.length} questions to ${path.relative(rootDir, outputPath)}`);

