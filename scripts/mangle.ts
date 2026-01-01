import fs from 'fs/promises';
import fg from 'fast-glob';
import { Context, cssHandler, jsHandler, htmlHandler } from '@tailwindcss-mangle/core';
import { createHash } from 'crypto';

function shouldExclude(className: string): boolean {
    return (
        className.startsWith('data-[') ||
        className.includes('aria-') ||
        className.includes('heroui') ||
        className.includes('nextui') ||
        className.startsWith('[data-') ||
        className.includes('group-') ||
        className.includes('peer-') ||
        className.includes('data-[') ||
        // className.includes('vain-') ||
        // /\bvain-\w+(?:\/\d+)?/.test(className) ||
        ['flex', 'flex-col', 'flex-row', 'grid', 'block', 'inline', 'inline-flex', 'inline-block', 'hidden'].includes(className) ||
        ['relative', 'absolute', 'fixed', 'sticky'].includes(className) ||
        ['inset-0', 'top-0', 'left-0', 'right-0', 'bottom-0'].includes(className) ||
        /^[mp][xytrbl]?-\d+(\.\d+)?$/.test(className) ||
        /^[wh]-\d+(\.\d+)?$/.test(className) ||
        /^[wh]-full$/.test(className) ||
        /^[wh]-auto$/.test(className) ||
        /^[wh]-fit$/.test(className) ||
        className.startsWith('border') ||
        className.startsWith('rounded') ||
        className.startsWith('bg-') ||
        /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/.test(className) ||
        /^font-(thin|light|normal|medium|semibold|bold|extrabold|black)$/.test(className) ||
        className.includes('hover:') ||
        className.includes('focus:') ||
        className.includes('active:') ||
        className.includes('disabled:') ||
        className.includes('group-hover:') ||
        className.includes('before:') ||
        className.includes('after:') ||
        className.includes('[') ||
        className.includes('--') ||
        className.startsWith('animate-')
        // className.includes('@keyframes') ||
        // className.includes('text-gradient') ||
        // className.includes('font-inter') ||
        // className.includes('no-scrollbar') ||
        // className.includes('touch-scroll') ||
        // className.includes('scrollbar-') ||
        // className.includes('discord-') ||
        // className.includes('animate-shine')
    );
} const customClassGenerator = (original: string) => {
    if (shouldExclude(original)) return original;
    const hash = createHash('sha256').update(original).digest('hex');
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let prefix = '';
    for (let i = 0; i < 6; i++) {
        prefix += chars[parseInt(hash.substr(i * 2, 2), 16) % chars.length];
    }
    return `${prefix}_${hash.substring(0, 32)}`;
};

const OUT_DIR = '.next';
const PATCH_FILE = '.tw-patch/tw-class-list.json';
const MAPPING_FILE = 'tw-mapping.json';

(async () => {
    const ctx = new Context();
    const classList = JSON.parse(await fs.readFile(PATCH_FILE, 'utf8'));
    ctx.loadClassSet(classList);
    await ctx.initConfig({
        classList,
        mangleOptions: {
            classGenerator: { customGenerate: customClassGenerator }
        }
    });

    const mapping = Object.fromEntries([...ctx.getReplaceMap()]);
    await fs.writeFile(MAPPING_FILE, JSON.stringify(mapping));

    const files = await fg([`${OUT_DIR}/**/*.{css,js,html}`], { dot: true });

    await Promise.all(files.map(async (file) => {
        const raw = await fs.readFile(file, 'utf8');
        const handler = file.endsWith('.css') ? cssHandler :
            file.endsWith('.js') ? jsHandler :
                htmlHandler;

        const result = await handler(raw, { ctx, id: file });
        await fs.writeFile(file, typeof result === 'string' ? result : result.code);
    }));

    console.log('Tailwind CSS classes mangled, mapping saved to', MAPPING_FILE);
})();
