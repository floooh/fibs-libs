import { Configurer, Builder } from 'jsr:@floooh/fibs@^1';

export function configure(c: Configurer) {
    c.addImport({
        name: 'microui',
        url: 'https://github.com/rxi/microui',
    });
}

export function build(b: Builder) {
    b.addTarget('microui', 'lib', (t) => {
        t.setDir(`${b.importDir('microui')}/src`);
        t.addSources(['microui.c', 'microui.h']);
        t.addIncludeDirectories(['.']);
        if (b.isMsvc()) {
            t.addCompileOptions({
                scope: 'private',
                opts: ['/wd4267', '/wd4244', '/wd4996']
            });
        } else {
            t.addCompileOptions({
                scope: 'private',
                opts: ['-Wno-sign-conversion', '-Wno-shorten-64-to-32'],
            });
        }
    });
}
