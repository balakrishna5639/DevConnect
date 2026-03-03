const fs = require('fs');
const path = require('path');

function replaceClassNames(dir) {
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceClassNames(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            const originalContent = content;

            // Backgrounds
            content = content.replace(/bg-gray-900/g, 'bg-gray-50');
            content = content.replace(/bg-gray-800/g, 'bg-white');
            content = content.replace(/bg-gray-700/g, 'bg-gray-100');

            // Text
            content = content.replace(/text-white/g, 'text-gray-900');
            content = content.replace(/text-gray-400/g, 'text-gray-600');
            content = content.replace(/text-gray-300/g, 'text-gray-700');
            content = content.replace(/text-gray-200/g, 'text-gray-800');

            // Borders & Dividers
            content = content.replace(/border-gray-800/g, 'border-gray-200');
            content = content.replace(/border-gray-700/g, 'border-gray-300');
            content = content.replace(/border-gray-600/g, 'border-gray-300');
            content = content.replace(/divide-gray-800/g, 'divide-gray-200');
            content = content.replace(/divide-gray-700/g, 'divide-gray-300');

            // Inputs/Placeholders
            content = content.replace(/placeholder-gray-400/g, 'placeholder-gray-500');
            content = content.replace(/placeholder-gray-500/g, 'placeholder-gray-400');

            // Buttons / Hovers - Ensure interactive contrast stands out in light mode!
            content = content.replace(/hover:bg-gray-700/g, 'hover:bg-gray-50');
            content = content.replace(/hover:bg-gray-800/g, 'hover:bg-gray-100');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated theme classes in: ${fullPath}`);
            }
        }
    }
}

replaceClassNames('./src');
console.log('Theme conversion complete!');
