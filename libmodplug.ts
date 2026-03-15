import { Configurer, Builder } from 'jsr:@floooh/fibs@^1';

export function configure(c: Configurer) {
    c.addImport({
        name: 'libmodplug',
        url: 'https://github.com/Konstanty/libmodplug',
    })
}

export function build(b: Builder) {
    b.addTarget('libmodplug', 'lib', (t) => {
        t.setDir(`${b.importDir('libmodplug')}/src`);
        t.addSources([
            'fastmix.cpp',
            'load_669.cpp',
            'load_abc.cpp',
            'load_amf.cpp',
            'load_ams.cpp',
            'load_dbm.cpp',
            'load_dmf.cpp',
            'load_dsm.cpp',
            'load_far.cpp',
            'load_it.cpp',
            'load_j2b.cpp',
            'load_mdl.cpp',
            'load_med.cpp',
            'load_mid.cpp',
            'load_mod.cpp',
            'load_mt2.cpp',
            'load_mtm.cpp',
            'load_okt.cpp',
            'load_pat.cpp',
            'load_pat.h',
            'load_psm.cpp',
            'load_ptm.cpp',
            'load_s3m.cpp',
            'load_stm.cpp',
            'load_ult.cpp',
            'load_umx.cpp',
            'load_wav.cpp',
            'load_xm.cpp',
            'mmcmp.cpp',
            'modplug.cpp',
            'modplug.h',
            'snd_dsp.cpp',
            'snd_flt.cpp',
            'snd_fx.cpp',
            'sndfile.cpp',
            'sndmix.cpp',
            'tables.h',
        ]);
        t.addIncludeDirectories({
            scope: 'private',
            dirs: ['libmodplug'],
        });
        t.addIncludeDirectories({
            scope: 'interface',
            dirs: ['.'],
        });
        t.addCompileDefinitions({ MODPLUG_STATIC: '1' });
        if (b.isMsvc()) {
            t.addCompileDefinitions({
                scope: 'private',
                defs: { HAVE_SINF: '1', HAVE_STDINT_H: '1' },
            });
            t.addCompileOptions({
                scope: 'private',
                opts: [
                    '/wd4819',
                    '/wd4146',
                    '/wd4244',
                    '/wd4996',
                    '/wd4018',
                    '/wd4267',
                    '/wd4018',
                ],
            });
        } else {
            t.addCompileDefinitions({
                scope: 'private',
                defs: { HAVE_SINF: '1', HAVE_SETENV: '1', HAVE_STDINT_H: '1' },
            });
            if (b.isGcc()) {
                t.addCompileOptions({
                    scope: 'private',
                    opts: [
                        '-Wno-stringop-truncation',
                        '-Wno-unused-parameter',
                        '-Wno-restrict',
                        '-Wno-format-overflow',
                        '-Wno-implicit-fallthrough',
                        '-Wno-misleading-indentation',
                        '-Wno-unused-function',
                        '-Wno-missing-braces',
                        '-Wno-unused-value',
                        '-Wno-parentheses',
                        '-Wno-sign-compare',
                        '-Wno-unused-variable',
                        '-Wno-reorder',
                        '-Wno-delete-non-virtual-dtor',
                        '-Wno-maybe-uninitialized',
                        '-Wno-unused-but-set-variable',
                        '-Wno-unused-result',
                    ],
                });
            } else if (b.isClang()) {
                t.addCompileOptions({
                    scope: 'private',
                    opts: [
                        '-Wno-deprecated-declarations',
                        '-Wno-unknown-warning-option',
                        '-Wno-unused-but-set-variable',
                        '-Wno-shorten-64-to-32',
                        '-Wno-unused-parameter',
                        '-Wno-unused-function',
                        '-Wno-unused-private-field',
                        '-Wno-dangling-else',
                        '-Wno-missing-braces',
                        '-Wno-unused-value',
                        '-Wno-parentheses',
                        '-Wno-sign-compare',
                        '-Wno-unused-variable',
                        '-Wno-deprecated-register',
                        '-Wno-writable-strings',
                        '-Wno-reorder',
                        '-Wno-delete-non-virtual-dtor',
                        '-Wno-deprecated-register',
                        '-Wno-missing-braces',
                        '-Wno-unused-function',
                        '-Wno-unused-variable',
                    ]
                });
            }
        }
    });
}
