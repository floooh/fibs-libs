//------------------------------------------------------------------------------
// Import options:
//
// 'sokolBackend': 'glcore' | 'gles3' | 'd3d11' | 'metal' | 'wgpu' | 'vulkan'
// 'useEGL': boolean
//
//  If not set, backend is selected automatically by target platform
//
// deno-lint-ignore no-unversioned-import
import * as fibs from 'jsr:@floooh/fibs';

type SokolBackend = 'glcore' | 'gles3' | 'd3d11' | 'metal' | 'wgpu' | 'vulkan' | 'dummy_backend';

export function configure(c: fibs.Configurer) {
    c.addImport({
        name: 'sokol',
        url: 'https://github.com/floooh/sokol',
    });
}

export function build(b: fibs.Builder) {
    const backend = selectBackend(b);
    b.addTarget('sokol', 'interface', (t: fibs.TargetBuilder) => {
        t.setDir(`${b.importDir('sokol')}`);
        t.addIncludeDirectories({ dirs: ['.', './util'], scope: 'interface' });
        t.addCompileDefinitions({ defs: { [`SOKOL_${backend.toUpperCase()}`]: '1' }, scope: 'interface' });
        if (b.isMacOS() || b.isIOS()) {
            t.addCompileOptions({ opts: ['--language objective-c++'], language: 'cxx', scope: 'interface' });
            t.addCompileOptions({ opts: ['--language objective-c'], language: 'c', scope: 'interface' });
            t.addFrameworks(['Foundation', 'AudioToolbox']);
            if (b.isMacOS()) {
                t.addFrameworks(['Cocoa', 'Quartzcore']);
            } else if (b.isIOS()) {
                t.addFrameworks(['UIKit', 'AVFoundation']);
            }
            switch (backend) {
                case 'metal': t.addFrameworks(['MetalKit', 'Metal']); break;
                case 'glcore': t.addFrameworks(['OpenGL']); break;
                case 'gles3': t.addFrameworks(['OpenGLES']); break;
                default: break;
            }
        } else if (b.isLinux()) {
            t.addLibraries(['X11', 'Xi', 'Xcursor', 'm', 'dl', 'asound']);
            if (b.importOption('useEGL')) {
                t.addCompileDefinitions({ defs: { 'SOKOL_FORCE_EGL': '1' }, scope: 'interface' });
                t.addLibraries(['EGL']);
            }
            switch (backend) {
                case 'glcore': t.addLibraries(['GL']); break;
                case 'gles3': t.addLibraries(['GLESv2']); break; // not a typo
                case 'vulkan': t.addLibraries(['vulkan']); break;
                default: break;
            }
        } else if (b.isAndroid()) {
            t.addLibraries(['GLESv3', 'EGL', 'log', 'android', 'aaudio']);
        } else if (b.isEmscripten()) {
            // FIXME: make configurable
            t.addLinkOptions({ opts: ['-sNO_FILESYSTEM=1', `-sMALLOC='emmalloc'`], scope: 'interface' });
            t.addLinkOptions({ opts: ['--closure 1'], scope: 'interface', buildMode: 'release'});
            if (backend === 'gles3') {
                t.addLinkOptions({ opts: ['-sUSE_WEBGL2=1'], scope: 'interface' });
            } else if (backend === 'wgpu') {
                t.addCompileOptions({ opts: ['--use-port=emdawnwebgpu'], scope: 'interface'});
                t.addLinkOptions({ opts: ['--use-port=emdawnwebgpu'], scope: 'interface'});
            }
        }
    });
}

function isValidSokolBackend(val: unknown): val is SokolBackend {
    const validBackends = ['glcore', 'gles3', 'd3d11', 'metal', 'wgpu', 'vulkan'];
    if (!(typeof val === 'string' && validBackends.includes(val))) {
        fibs.log.warn(`import option sokolBackend must be one of: ${validBackends.join(' ')}`);
        return false;
    }
    return true;
}

function selectBackend(b: fibs.Builder): SokolBackend {
    if (b.importOption('sokolBackend') !== undefined) {
        const backend = b.importOption('sokolBackend');
        if (isValidSokolBackend(backend)) {
            return backend;
        }
    }
    // fallthrough: auto-select
    switch (b.platform()) {
        case 'windows': return 'd3d11';
        case 'linux': return 'glcore';
        case 'macos': case 'ios': return 'metal';
        case 'emscripten': case 'android': return 'gles3';
        default: return 'glcore';
    }
}
