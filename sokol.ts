import { fibs } from './deps.ts';

const includeDirectories = {
    interface: () => [ '.', './util' ]
};

const macosFrameworks = [ '-framework Foundation', '-framework Cocoa', '-framework QuartzCore', '-framework AudioToolbox' ];
const metalFrameworks = [ '-framework Metal', '-framework MetalKit' ];
const glFrameworks    = [ '-framework OpenGL' ];
const linuxLibs       = [ 'X11', 'Xi', 'Xcursor', 'GL', 'm', 'dl', 'asound'] ;
const appleCompileOptions = (ctx: fibs.Context) => {
    if (ctx.language === 'cxx') {
        return [ '--language', 'objective-c++' ];
    } else {
        return [ '--language', 'objective-c' ];
    }
};
const linuxCompileOptions = [ '-pthread' ];

const emscLinkOptions  = [ '-sUSE_WEBGL2=1', "-sMALLOC='emmalloc'" ];
const linuxLinkOptions = [ '-pthread', '-lpthread' ];

export const project: fibs.ProjectDesc = {
    imports: {
        sokol: {
            url: 'https://github.com/floooh/sokol',
            project: {
                targets: {
                    // only the header search path setup
                    'sokol-includes': {
                        type: 'interface',
                        includeDirectories,
                    },
                    // configured based on compileDefinitions in build config
                    'sokol-config': {
                        type: 'interface',
                        includeDirectories,
                        compileOptions: {
                            interface: (ctx) => {
                                switch (ctx.config.platform) {
                                    case 'macos': case 'ios':
                                        if (ctx.language === 'c') {
                                            return appleCompileOptions(ctx);
                                        } else if (ctx.language = 'cxx') {
                                            return [ '--language', 'objective-c++' ];
                                        }
                                    case 'linux': return linuxCompileOptions;
                                    default: return [];
                                }
                            }
                        },
                        linkOptions: {
                            interface: (ctx) => {
                                switch (ctx.config.platform) {
                                    case 'emscripten': return emscLinkOptions;
                                    case 'linux':      return linuxLinkOptions;
                                    default:           return [];
                                }
                            }
                        },
                        libs: (ctx) => {
                            switch (ctx.config.platform) {
                                case 'macos':
                                    if (ctx.config.compileDefinitions.SOKOL_METAL) {
                                        return [ ...macosFrameworks, ...metalFrameworks ];
                                    } else if (ctx.config.compileDefinitions.SOKOL_GLCORE33) {
                                        return [ ...macosFrameworks, ...glFrameworks ];
                                    }
                                    break;
                                case 'linux':
                                    if (ctx.config.compileDefinitions.SOKOL_GLCORE33) {
                                        return linuxLibs;
                                    }
                                    break;
                            }
                            return [];
                        },
                    },
                    // fully autoconfigured based on target platform
                    'sokol-autoconfig': {
                        type: 'interface',
                        includeDirectories,
                        compileDefinitions: {
                            interface: (ctx) => {
                                switch (ctx.config.platform) {
                                    case 'windows':                     return { SOKOL_D3D11: '1' };
                                    case 'macos': case 'ios':           return { SOKOL_METAL: '1' };
                                    case 'emscripten': case 'android':  return { SOKOL_GLES3: '1' };
                                    default:                            return { SOKOL_GLCORE33: '1' };
                                }
                            }
                        },
                        compileOptions: {
                            interface: (ctx) => {
                                switch (ctx.config.platform) {
                                    case 'macos': case 'ios': return appleCompileOptions(ctx);
                                    case 'linux': return linuxCompileOptions;
                                    default: return [];
                                }
                            }
                        },
                        linkOptions: {
                            interface: (ctx) => {
                                switch (ctx.config.platform) {
                                    case 'emscripten':  return emscLinkOptions;
                                    case 'linux':       return linuxLinkOptions;
                                    default:            return [];
                                }
                            }
                        },
                        libs: (ctx) => {
                            switch (ctx.config.platform) {
                                case 'macos': return [ ...macosFrameworks, ...metalFrameworks ];
                                case 'linux': return linuxLibs;
                                default:      return [];
                            }
                        }
                    }
                }
            }
        }
    }
}
