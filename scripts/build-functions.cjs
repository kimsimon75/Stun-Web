const path = require('node:path');
const { build } = require('esbuild');

async function buildFunctions() {
    const result = await build({
        entryPoints: [path.resolve('netlify/functions/unit-snapshots.mjs')],
        outdir: path.resolve('.functions-build'),
        outExtension: { '.js': '.mjs' },
        bundle: true,
        packages: 'bundle',
        platform: 'node',
        target: 'node22',
        format: 'esm',
        banner: { js: 'import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);' },
        metafile: true,
    });
    const external = Object.values(result.metafile.outputs).flatMap(output => output.imports)
        .filter(item => item.external && !item.path.startsWith('node:') && !require('node:module').builtinModules.includes(item.path));
    if(external.length) throw new Error('Unbundled function dependencies: '+external.map(item=>item.path).join(', '));
    console.log('Standalone Netlify function built (Blobs SDK + unit catalogs included).');
}
if(require.main === module) buildFunctions().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={buildFunctions};
