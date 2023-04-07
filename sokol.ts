import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
    imports: {
        sokol: {
            url: 'https://github.com/floooh/sokol',
            project: {
                targets: {
                    // only the header search path setup
                    'sokol-includes': {
                        type: 'interface',
                        includeDirectories: {
                            interface: [ '.', './util' ]
                        },
                    },
                    // fully autoconfigured based on target platform
                    'sokol-autoconfig': {
                        type: 'interface',
                        includeDirectories: {
                            interface: [ '.', './util' ]
                        },
                        compileDefinitions: {
                            interface: (context) => {
                                switch (context.config.platform) {
                                    case 'windows':
                                        return [ 'SOKOL_D3D11' ];
                                    case 'macos':
                                    case 'ios':
                                        return [ 'SOKOL_METAL' ];
                                    case 'emscripten':
                                    case 'android':
                                        return [ 'SOKOL_GLES3' ];
                                    default:
                                        return [ 'SOKOL_GLCORE33' ];
                                }
                            }
                        },
                        compileOptions: {
                            interface: (context) => {
                                switch (context.config.platform) {
                                    case 'macos': case 'ios':
                                        return ['--language', 'objective-c'];
                                    case 'linux':
                                        return ['-pthread'];
                                    default:
                                        return [];
                                }
                            }
                        },
                        linkOptions: {
                            interface: (context) => {
                                switch (context.config.platform) {
                                    case 'emscripten':
                                        return [ '-sUSE_WEBGL2=1', "-sMALLOC='emmalloc'" ];
                                    case 'linux':
                                        return [ '-pthread', '-lpthread' ];
                                    default:
                                        return [];
                                }
                            }
                        },
                        libs: (context) => {
                            switch (context.config.platform) {
                                case 'macos':
                                    return [
                                        '-framework Foundation',
                                        '-framework Cocoa',
                                        '-framework QuartzCore',
                                        '-framework Metal',
                                        '-framework MetalKit',
                                        '-framework AudioToolbox',
                                    ];
                                case 'linux':
                                    return [ 'X11', 'Xi', 'Xcursor', 'GL', 'asound' ];
                                default:
                                    return [];
                            }
                        }
                    }
                }
            }
        }
    }
}
