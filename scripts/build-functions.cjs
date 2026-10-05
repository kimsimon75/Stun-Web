const path = require('node:path');
const { build } = require('esbuild');

async function buildFunctions() {
    await build({
        entryPoints: [path.resolve('netlify/functions/unit-snapshots.mjs')],
        outdir: path.resolve('.functions-build'),
        outExtension: { '.js': '.mjs' },
        bundle: true,
        packages: 'bundle',
        platform: 'node',
        target: 'node22',
        format: 'esm',
        banner: { js: 'import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);' },
    });
    console.log('Netlify 유닛 스냅샷 함수를 빌드했습니다.');
}

if (require.main === module) buildFunctions().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { buildFunctions };
