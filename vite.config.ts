import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';

function adminApiPlugin(): Plugin {
  let adminPassword = '';
  let projectRoot = '';

  return {
    name: 'admin-api',
    configureServer(server) {
      const env = loadEnv('development', '.', '');
      adminPassword = env.ADMIN_PASSWORD || 'neuro2026';
      projectRoot = server.config.root;

      // Auth check helper
      const checkAuth = (req: any, res: any): boolean => {
        const pw = req.headers['x-admin-password'];
        if (pw !== adminPassword) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return false;
        }
        return true;
      };

      // Helper to read body
      const readBody = (req: any): Promise<string> => {
        return new Promise((resolve, reject) => {
          let body = '';
          req.on('data', (chunk: string) => { body += chunk; });
          req.on('end', () => resolve(body));
          req.on('error', reject);
        });
      };

      server.middlewares.use(async (req, res, next) => {
        // ─── GET /api/list-images ───
        if (req.url === '/api/list-images' && req.method === 'GET') {
          try {
            const drawingsDir = path.join(projectRoot, 'public', 'drawings');
            const result: Record<string, string[]> = {};

            const walkDir = (dir: string, prefix: string) => {
              if (!fs.existsSync(dir)) return;
              const entries = fs.readdirSync(dir, { withFileTypes: true });
              for (const entry of entries) {
                if (entry.name.startsWith('.')) continue;
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                  walkDir(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name);
                } else if (/\.(png|jpg|jpeg|webp|gif)$/i.test(entry.name)) {
                  const key = prefix || 'root';
                  if (!result[key]) result[key] = [];
                  result[key].push(`/drawings/${prefix ? prefix + '/' : ''}${entry.name}`);
                }
              }
            };

            walkDir(drawingsDir, '');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // ─── POST /api/upload-image ───
        if (req.url === '/api/upload-image' && req.method === 'POST') {
          if (!checkAuth(req, res)) return;
          try {
            const body = JSON.parse(await readBody(req));
            const { base64, filename, subfolder } = body;

            if (!base64 || !filename) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing base64 or filename' }));
              return;
            }

            // Validate extension
            const ext = path.extname(filename).toLowerCase();
            if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Only PNG, JPG, and WebP files are allowed' }));
              return;
            }

            // Strip data URL prefix if present
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            // Validate size (5MB)
            if (buffer.length > 5 * 1024 * 1024) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'File too large (max 5MB)' }));
              return;
            }

            // Build target path
            const targetDir = path.join(projectRoot, 'public', 'drawings', subfolder || 'Uploaded');
            fs.mkdirSync(targetDir, { recursive: true });

            // Sanitize filename
            const safeName = filename.replace(/[^a-zA-Z0-9._()-\s]/g, '_');
            const targetPath = path.join(targetDir, safeName);
            fs.writeFileSync(targetPath, buffer);

            const publicPath = `/drawings/${subfolder ? subfolder + '/' : 'Uploaded/'}${safeName}`;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ path: publicPath }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // ─── POST /api/save-data ───
        if (req.url === '/api/save-data' && req.method === 'POST') {
          if (!checkAuth(req, res)) return;
          try {
            const body = JSON.parse(await readBody(req));
            const { questions } = body;

            if (!Array.isArray(questions)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid questions array' }));
              return;
            }

            const dataPath = path.join(projectRoot, 'src', 'data.ts');
            const backupPath = path.join(projectRoot, 'src', 'data.backup.ts');

            // Backup current file
            if (fs.existsSync(dataPath)) {
              fs.copyFileSync(dataPath, backupPath);
            }

            // Build new data.ts content
            const questionsJson = questions.map((q: any) => {
              const parts: string[] = [
                `  { id: '${q.id}'`,
                `category: '${q.category}'`,
                `prompt: ${JSON.stringify(q.prompt)}`,
                `answer: ${JSON.stringify(q.answer)}`,
                `options: ${JSON.stringify(q.options)}`,
              ];
              if (q.image) {
                parts.push(`image: ${JSON.stringify(q.image)}`);
              }
              if (q.answers) {
                parts.push(`answers: ${JSON.stringify(q.answers)}`);
              }
              if (q.multiSelect) {
                parts.push(`multiSelect: true`);
              }
              if (q.directionLock) {
                parts.push(`directionLock: '${q.directionLock}'`);
              }
              if (q.studyDirection) {
                parts.push(`studyDirection: '${q.studyDirection}'`);
              }
              if (q.reverseGroup) {
                parts.push(`reverseGroup: '${q.reverseGroup}'`);
              }
              if (q.explanation) {
                parts.push(`explanation: ${JSON.stringify(q.explanation)}`);
              }
              return parts.join(', ') + ' }';
            }).join(',\n');

            const fileContent = `export type Category = 'Myotome' | 'Dermatome' | 'Brain Region' | 'Nerve Root';

export interface Question {
  id: string;
  category: Category;
  prompt: string;
  answer: string;
  options: string[];
  image?: string;
  // Multi-select support (nerve motor questions)
  answers?: string[];
  multiSelect?: boolean;
  directionLock?: 'forward' | 'reverse';
  studyDirection?: 'forward' | 'reverse';
  reverseGroup?: string;
  explanation?: string;
}

export const questions: Question[] = [
${questionsJson}
];

// Helper to shuffle array
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
`;

            fs.writeFileSync(dataPath, fileContent, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, backup: 'src/data.backup.ts' }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // ─── POST /api/delete-image ───
        if (req.url === '/api/delete-image' && req.method === 'POST') {
          if (!checkAuth(req, res)) return;
          try {
            const body = JSON.parse(await readBody(req));
            const { imagePath } = body;

            if (!imagePath || !imagePath.startsWith('/drawings/')) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid image path' }));
              return;
            }

            // Prevent path traversal
            const resolved = path.resolve(projectRoot, 'public', imagePath.slice(1));
            const drawingsRoot = path.resolve(projectRoot, 'public', 'drawings');
            if (!resolved.startsWith(drawingsRoot)) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Path traversal rejected' }));
              return;
            }

            if (fs.existsSync(resolved)) {
              fs.unlinkSync(resolved);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), adminApiPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
