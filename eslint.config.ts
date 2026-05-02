import { base, boundaries } from '@enxoval/quality';

export default [
  ...base(),
  ...boundaries([
    { name: 'diplomat', pattern: ['src/diplomat/**'], allow: ['controllers', 'wire', 'model', 'db'] },
    { name: 'controllers', pattern: ['src/controllers/**'], allow: ['logic', 'model', 'db', 'wire'] },
    { name: 'logic', pattern: ['src/logic/**'], allow: ['model'] },
    { name: 'adapters', pattern: ['src/adapters/**'], allow: ['model', 'db-wire'] },
    { name: 'db', pattern: ['src/db/*.ts'], allow: ['db-wire', 'model', 'adapters'] },
    { name: 'db-wire', pattern: ['src/db/wire/**'], allow: [] },
    { name: 'model', pattern: ['src/model/**'], allow: [] },
    { name: 'wire', pattern: ['src/wire/**'], allow: [] },
  ]),
];
