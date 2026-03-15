import { Configurer, Builder } from 'jsr:@floooh/fibs@^1';

export function configure(c: Configurer) {
  c.addImport({
    name: 'stb',
    url: 'https://github.com/nothings/stb',
  });
}

export function build(b: Builder) {
  b.addTarget('stb', 'interface', (t) => {
    t.setDir(b.importDir('stb'));
    t.addIncludeDirectories(['.']);
    if (b.compiler() === 'msvc') {
      // conversion from 'x' to 'y'
      t.addCompileOptions({
        scope: 'interface',
        opts: [ '/wd4244' ],
      });
    } else {
      t.addCompileOptions({
        scope: 'interface',
        opts: ['-Wno-sign-conversion', '-Wno-unused-function']
      });
    }
    if (b.isLinux()) {
      t.addLibraries(['m']);
    }
  });
}
