import { Configurer, Builder } from 'jsr:@floooh/fibs@^1';

export function configure(c: Configurer) {
    c.addImport({
        name: 'glfw3',
        url: 'https://github.com/glfw/glfw',
        ref: '3.3.8',
    });
}

export function build(b: Builder) {
    if (!(b.isMacOS() || b.isWindows() || b.isLinux())) {
        return;
    }
    b.addTarget('glfw3', 'lib', (t) => {
        t.setDir(`${b.importDir('glfw3')}/src`);
        t.addIncludeDirectories(['../include']);
        t.addSources([
            'context.c',
            'init.c',
            'input.c',
            'monitor.c',
            'window.c',
            'vulkan.c',
            'egl_context.c',
            'osmesa_context.c',
        ]);
        if (b.isMacOS()) {
            t.addSources([
                'cocoa_init.m',
                'cocoa_joystick.m',
                'cocoa_monitor.m',
                'cocoa_window.m',
                'cocoa_time.c',
                'nsgl_context.m',
                'posix_thread.c',
            ]);
            t.addFrameworks([
                'Cocoa',
                'CoreVideo',
                'OpenGL',
                'Carbon',
                'IOKit',
            ]);
            t.addCompileDefinitions({
                scope: 'private',
                defs: { _GLFW_COCOA: '1', _GLFW_NSGL: '1' },
            });
        } else if (b.isWindows()) {
            t.addSources([
                'win32_init.c',
                'win32_monitor.c',
                'win32_time.c',
                'win32_thread.c',
                'win32_window.c',
                'win32_joystick.c',
                'wgl_context.c',
            ]);
            t.addLibraries(['opengl32']);
            t.addCompileDefinitions({
                scope: 'private',
                defs: { _GLFW_WIN32: '1', _GFLW_WGL: '1' },
            });
        } else if (b.isLinux()) {
            t.addSources([
                'x11_init.c',
                'x11_monitor.c',
                'x11_window.c',
                'glx_context.c',
                'posix_time.c',
                'posix_thread.c',
                'xkb_unicode.c',
                'linux_joystick.c',
            ]);
            t.addLibraries(['X11', 'Xrandr', 'Xi', 'Xinerama', 'Xxf86vm', 'Xcursor', 'GL', 'm']);
            t.addCompileDefinitions({
                scope: 'private',
                defs: { _GLFW_X11: '1', _GLFW_GLX: '1' },
            });
        }
        if (b.isMsvc()) {
            t.addCompileOptions({
                scope: 'private',
                opts: ['/wd4152', '/wd4204', '/wd4242', '/wd4244', '/wd4668', '/wd4996', '/wd4100', '/wd4706'],
            });
        } else {
            t.addCompileOptions({
                scope: 'private',
                opts: ['-Wno-unused-parameter', '-Wno-sign-compare', '-Wno-missing-field-initializers'],
            });
        }
    });
}
