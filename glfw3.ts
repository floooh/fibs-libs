import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
    imports: {
        glfw3: {
            url: 'https://github.com/glfw/glfw',
            ref: '3.3.8',
            project: {
                targets: {
                    glfw3: {
                        type: 'lib',
                        enabled: (ctx) => ['macos', 'windows', 'linux'].includes(ctx.config.platform),
                        dir: 'src',
                        includeDirectories: {
                            public: () => [ '../include' ],
                        },
                        sources: (ctx) => {
                            let sources = [
                                'context.c',
                                'init.c',
                                'input.c',
                                'monitor.c',
                                'window.c',
                                'vulkan.c',
                                'egl_context.c',
                                'osmesa_context.c',
                            ];
                            if (ctx.config.platform === 'macos') {
                                sources = [ ...sources,
                                    'cocoa_init.m',
                                    'cocoa_joystick.m',
                                    'cocoa_monitor.m',
                                    'cocoa_window.m',
                                    'cocoa_time.c',
                                    'nsgl_context.m',
                                    'posix_thread.c',
                                ];
                            } else if (ctx.config.platform === 'windows') {
                                sources = [ ...sources,
                                    'win32_init.c',
                                    'win32_monitor.c',
                                    'win32_time.c',
                                    'win32_thread.c',
                                    'win32_window.c',
                                    'win32_joystick.c',
                                    'wgl_context.c',
                                ];
                            } else {
                                sources = [ ...sources,
                                    'x11_init.c',
                                    'x11_monitor.c',
                                    'x11_window.c',
                                    'glx_context.c',
                                    'posix_time.c',
                                    'posix_thread.c',
                                    'xkb_unicode.c',
                                    'linux_joystick.c',
                                ];
                            }
                            return sources;
                        },
                        libs: (ctx) => {
                            if (ctx.config.platform === 'macos') {
                                return [
                                    '-framework Cocoa',
                                    '-framework CoreVideo',
                                    '-framework OpenGL',
                                    '-framework Carbon',
                                    '-framework IOKit'
                                ];
                            } else if (ctx.config.platform === 'windows') {
                                return [ 'opengl32' ];
                            } else {
                                return [ 'X11', 'Xrandr', 'Xi', 'Xinerama', 'Xxf86vm' , 'Xcursor', 'GL', 'm' ];
                            }
                        },
                        compileDefinitions: {
                            private: (ctx) => {
                                switch (ctx.config.platform) {
                                    case 'macos':   return [ '_GLFW_COCOA=1', '_GLFW_NSGL=1' ];
                                    case 'windows': return [ '_GLFW_WIN32=1', '_GFLW_WGL=1' ];
                                    default:        return [ '_GLFW_X11=1', '_GLFW_GLX=1' ];
                                }
                            }
                        },
                        compileOptions: {
                            public: (ctx) => {
                                if (ctx.config.platform === 'linux') {
                                    return ['-pthread'];
                                } else {
                                    return [];
                                }
                            },
                            private: (ctx) => {
                                switch (ctx.compiler) {
                                    case 'msvc':
                                        return [ '/wd4152', '/wd4204', '/wd4242', '/wd4244', '/wd4668', '/wd4996', '/wd4100', '/wd4706' ];
                                    default:
                                        return [ '-Wno-unused-parameter', '-Wno-sign-compare', '-Wno-missing-field-initializers' ];
                                }
                            }
                        },
                        linkOptions: {
                            public: (ctx) => {
                                if (ctx.config.platform === 'linux') {
                                    return [ '-pthread', '-lpthread' ];
                                } else {
                                    return [];
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
