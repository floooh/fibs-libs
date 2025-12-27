// deno-lint-ignore no-unversioned-import
import * as fibs from 'jsr:@floooh/fibs';

export function configure(c: fibs.Configurer) {
  c.addImport({
    name: 'stb',
    url: 'https://github.com/nothings/stb',
  });
}

export function build(b: fibs.Builder) {
  b.addTarget('stb', 'interface', (t) => {
    t.setDir(`${b.importDir('stb')}`);
    t.addIncludeDirectories({ dirs: ['.'], scope: 'interface' });
    if (b.compiler() === 'msvc') {
      // conversion from 'x' to 'y'
      t.addCompileOptions({opts: [ '/wd4244' ], scope: 'interface' });
    } else {
      t.addCompileOptions({ opts: ['-Wno-sign-conversion', '-Wno-unused-function'], scope: 'interface' });
    }
  });
}
