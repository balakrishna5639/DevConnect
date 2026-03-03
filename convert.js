import fs from 'fs';
import path from 'path';

function convertToOrFromEsModules(extPath) {
    if (!fs.existsSync(extPath)) { return; }

    const fileStat = fs.statSync(extPath);
    if (fileStat.isDirectory()) {
        const entries = fs.readdirSync(extPath);
        for (const _entry of entries) {
            convertToOrFromEsModules(path.join(extPath, _entry));
        }
    } else if (extPath.endsWith('.js')) {
        let code = fs.readFileSync(extPath, { encoding: 'utf-8' });
        code = code.replace(/const\s+([a-zA-Z0-9_{}\s,]+)\s+=\s+require\(['"]([^'"]+)['"]\);/g, 'import $1 from "$2";');
        code = code.replace(/module\.exports\s+=\s+([^;]+);/g, 'export default $1;');
        fs.writeFileSync(extPath, code);
    }
}

const target = process.argv[2]
convertToOrFromEsModules(target);
