// This runs as ESM (root package.json has type:module)
// It converts server/*.js files from ESM import/export to CJS require/module.exports
import fs from 'fs';
import path from 'path';

function convert(dir) {
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            convert(fullPath);
        } else if (file.endsWith('.js')) {
            let code = fs.readFileSync(fullPath, 'utf8');

            // import X from 'y'  =>  const X = require('y')
            code = code.replace(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/gm,
                (_, name, mod) => `const ${name} = require('${mod}');`);

            // import { a, b } from 'y'  =>  const { a, b } = require('y')
            code = code.replace(/^import\s+(\{[^}]+\})\s+from\s+['"]([^'"]+)['"]\s*;?/gm,
                (_, names, mod) => `const ${names} = require('${mod}');`);

            // import * as X from 'y'  =>  const X = require('y')
            code = code.replace(/^import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/gm,
                (_, name, mod) => `const ${name} = require('${mod}');`);

            // export default X  =>  module.exports = X
            code = code.replace(/^export\s+default\s+(\w+)\s*;?/gm,
                (_, name) => `module.exports = ${name};`);

            // Remove .js from relative require paths (CJS doesn't need them)
            code = code.replace(/require\('(\.[^']+)\.js'\)/g, "require('$1')");
            code = code.replace(/require\("(\.[^"]+)\.js"\)/g, 'require("$1")');

            fs.writeFileSync(fullPath, code, 'utf8');
            console.log('Converted:', fullPath);
        }
    }
}

convert('./server');
console.log('Done converting server to CommonJS!');
