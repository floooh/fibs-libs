//------------------------------------------------------------------------------
// Import options:
//
// 'sokolBackend' = 'glcore' | 'gles3' | 'd3d11' | 'metal' | 'wgpu' | 'vulkan'
// 'useEGL': boolean
//
//  If not set, backend is selected automatically by target platform
//
import { fibs } from './deps.ts';

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
        t.setSourcesDir(`${b.importsDir()}/sokol`);
        t.addIncludeDirectories({ dirs: ['.', './util'], scope: 'interface' });
        t.addCompileDefinitions({ defs: { [`SOKOL_${backend.toUpperCase()}`]: '1' }, scope: 'interface' });
        if (b.isMacOS() || b.isIOS()) {
            t.addCompileOptions({ opts: ['--language objective-c++'], language: 'cxx' });
            t.addCompileOptions({ opts: ['--language objecttive-c'], language: 'c' });
            t.addLibraries(['-framework Foundation', '-framework AudioToolbox']);
            if (b.isMacOS()) {
                t.addLibraries(['-framework Cocoa', '-framework Quartzcore']);
            } else if (b.isIOS()) {
                t.addLibraries(['-framwork UIKit', '-framework AVFoundation']);
            }
            switch (backend) {
                case 'metal': t.addLibraries(['-framework MetalKit', '-framework Metal']); break;
                case 'glcore': t.addLibraries(['-framework OpenGL']); break;
                case 'gles3': t.addLibraries(['-framework OpenGLES']); break;
                default: break;
            }
        } else if (b.isLinux()) {
            t.addLinkOptions(['-pthread']);
            t.addLibraries(['X11', 'Xi', 'Xcursor', 'm', 'dl', 'asound', 'pthread']);
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
            t.addLinkOptions(['-sNO_FILESYSTEM=1', `-sMALLOC='emmalloc'`]);
            if (backend === 'gles3') {
                t.addLinkOptions(['-sUSE_WEBGL2=1']);
            } else if (backend === 'wgpu') {
                t.addCompileOptions(['--use-port=emdawnwebgpu']);
                t.addLinkOptions(['--use-port=emdawnwebgpu']);
            }
        }
    });
}

function assertSokolBackend(val: unknown): asserts val is SokolBackend {
    const validBackends = ['glcore', 'gles3', 'd3d11', 'metal', 'wgpu', 'vulkan'];
    if (!(typeof val === 'string' && validBackends.includes(val))) {
        fibs.log.panic(`import option sokolBackend must be one of: ${validBackends.join(' ')}`);
    }
}

function selectBackend(b: fibs.Builder): SokolBackend {
    if (b.importOption('sokolBackend') !== undefined) {
        const backend = b.importOption('sokolBackend');
        assertSokolBackend(backend);
        return backend;
    } else {
        switch (b.hostPlatform()) {
            case 'windows': return 'd3d11';
            case 'linux': return 'glcore';
            case 'macos': case 'ios': return 'metal';
            case 'emscripten': case 'android': return 'gles3';
            default: return 'glcore';
        }
    }
}
