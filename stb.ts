// deno-lint-ignore no-unversioned-import
import { Configurer, Builder } from 'jsr:@floooh/fibs';

export function configure(c: Configurer) {
  c.addImport({
    name: 'stb',
    url: 'https://github.com/nothings/stb',
  });
}

export function build(b: Builder) {
  b.addTarget('stb', 'interface', (t) => {
    t.setDir(`${b.importDir('stb')}`);
    t.addIncludeDirectories(['.']);
    if (b.compiler() === 'msvc') {
      // conversion from 'x' to 'y'
      t.addCompileOptions([ '/wd4244' ]);
    } else {
      t.addCompileOptions(['-Wno-sign-conversion', '-Wno-unused-function']);
    }
  });
}
