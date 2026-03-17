import { Configurer, Builder } from 'jsr:@floooh/fibs@^1';

export function configure(c: Configurer) {
    c.addImport({
        name: 'nuklear',
        url: 'https://github.com/Immediate-Mode-UI/Nuklear',
    });
}

export function build(b: Builder) {
    b.addTarget('nuklear', 'interface', (t) => {
        t.setDir(b.importDir('nuklear'));
        t.addIncludeDirectories({
            scope: 'interface',
            dirs: ['.'],
        });
        if (b.isMsvc()) {
            t.addCompileOptions({
                scope: 'interface',
                opts: [
                    '/wd5287', // operands are different enum types
                    '/wd4127', // conditional expression is constant
                    '/wd4244', // conversion from 'X' to 'Y', possible loss of data
                    '/wd4456', // declaration of 'X' hides previous local declaration
                    '/wd4701', // potentially uninitialized local variable 'X' used
                    '/wd4996', // deprecation warnings
                ],
            });
        } else {
            t.addCompileOptions({
                scope: 'interface',
                opts: [
                    '-Wno-unknown-warning-option',
                    '-Wno-unused-parameter',
                    '-Wno-sign-conversion',
                    '-Wno-null-pointer-subtraction',
                    '-Wno-unused-but-set-variable',
                    '-Wno-maybe-uninitialized',
                    '-Wno-unused-parameter',
                ],
            });
        }
    });
}
