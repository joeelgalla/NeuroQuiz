---
paths: src/data.ts, src/Game.tsx, src/AdminPanel.tsx, vite.config.ts
description: Mandatory audit checklist before declaring any code change complete
---

# Audit Checklist (MANDATORY before declaring done)

After making changes, **always run these audits before saying you're done.** Do not report success while errors exist.

## The 5 Audits

1. **Run** `npx tsc --noEmit` — TypeScript must compile clean (zero errors).
2. **Verify** every image path in `data.ts` resolves to a real file in `public/`. Use a script — do not eyeball it.
3. **Check** that no two questions share the same `id`.
4. **Check** every question's `answer` is present in its `options` array.
5. **For multi-select questions**, verify every entry in `answers[]` is in `options[]`.

## Reference audit script

```bash
cd ~/NeuroQuiz && python3 << 'PYEOF'
import re, os
from collections import Counter

with open('src/data.ts') as f:
    content = f.read()

# Audit 2: image paths
paths = re.findall(r'image:\s*["\x27]([^"\x27]+)["\x27]', content)
real = [p for p in paths if p != 'placeholder']
missing = [p for p in real if not os.path.exists(os.path.join('public', p.lstrip('/')))]
print(f'Images: {len(real)} real, {len(paths)-len(real)} placeholder, {len(missing)} MISSING')
for m in missing: print(f'  X {m}')

# Audit 3: duplicate IDs
ids = re.findall(r'id:\s*["\x27]([^"\x27]+)["\x27]', content)
dupes = {k:v for k,v in Counter(ids).items() if v > 1}
print(f'IDs: {len(ids)} total, {len(set(ids))} unique')
if dupes: print(f'  X DUPLICATES: {dupes}')

# Audit 4 + 5: answer in options
issues = []
for line in content.split('\n'):
    if 'multiSelect: true' in line:
        ans_m = re.search(r'answers:\s*\[([^\]]+)\]', line)
        opt_m = re.search(r'options:\s*\[([^\]]+)\]', line)
        id_m = re.search(r'id:\s*["\x27]([^"\x27]+)["\x27]', line)
        if ans_m and opt_m and id_m:
            answers = re.findall(r"'([^']+)'", ans_m.group(1))
            opts = re.findall(r"'([^']+)'", opt_m.group(1))
            for a in answers:
                if a not in opts: issues.append(f'{id_m.group(1)}: \"{a}\" not in options')
    elif 'category:' in line and 'answer:' in line:
        ans_m = re.search(r'answer:\s*["\x27]([^"\x27]+)["\x27]', line)
        opt_m = re.search(r'options:\s*\[([^\]]+)\]', line)
        id_m = re.search(r'id:\s*["\x27]([^"\x27]+)["\x27]', line)
        if ans_m and opt_m and id_m:
            opts = re.findall(r"'([^']+)'", opt_m.group(1))
            if ans_m.group(1) not in opts:
                issues.append(f'{id_m.group(1)}: \"{ans_m.group(1)}\" not in options')
print(f'Answer-in-options: {len(issues)} issues')
for i in issues: print(f'  X {i}')
PYEOF
```

## If any audit fails

**Fix it before declaring complete.** Do not report success while errors exist.
