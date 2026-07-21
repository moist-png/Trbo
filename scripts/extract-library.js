// Extracts the real LIBRARY array from src/App.jsx so planner scripts always
// test against the live workout data — never a copy that can drift. It slices
// the `const LIBRARY = [...]` block out of App.jsx and evaluates it with the
// same tiny helpers (iv / repeatIv) App.jsx defines.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export function loadLibrary() {
  const appPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'App.jsx');
  const src = readFileSync(appPath, 'utf8');
  const start = src.indexOf('const LIBRARY = [');
  if (start === -1) throw new Error('Could not find `const LIBRARY = [` in App.jsx');
  const end = src.indexOf('\n];', start);
  if (end === -1) throw new Error('Could not find the end of the LIBRARY array in App.jsx');
  const block = src.slice(start, end + 3);

  // Same shape as App.jsx's helpers; ids just need to be unique, not identical.
  let idCounter = 0;
  const iv = (label, duration, type, target) => ({ id: 'iv' + (idCounter++), label, duration, type, target });
  const repeatIv = (count, factory) => {
    const out = [];
    for (let i = 0; i < count; i++) out.push(...factory(i));
    return out;
  };

  // eslint-disable-next-line no-new-func
  const fn = new Function('iv', 'repeatIv', `${block}\nreturn LIBRARY;`);
  const library = fn(iv, repeatIv);
  if (!Array.isArray(library) || library.length < 50) {
    throw new Error(`Extracted LIBRARY looks wrong (length ${library && library.length})`);
  }
  return library;
}
