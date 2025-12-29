//------------------------------------------------------------------------------
// Import options:
//
// sokol: {
//     backend: 'glcore' | 'gles3' | 'd3d11' | 'metal' | 'wgpu' | 'vulkan',
//     useEGL: boolean = false
// }
//
//  If not set, backend is selected automatically by target platform
//
// deno-lint-ignore no-unversioned-import
import { Configurer, Builder, log } from "jsr:@floooh/fibs";

type SokolBackend =
    | "glcore"
    | "gles3"
    | "d3d11"
    | "metal"
    | "wgpu"
    | "vulkan"
    | "dummy_backend";

type ImportOptions = {
    backend?: SokolBackend;
    useEGL?: boolean;
};

export function configure(c: Configurer) {
    c.addImport({
        name: "sokol",
        url: "https://github.com/floooh/sokol",
    });
}

export function build(b: Builder) {
    const importOptions = (b.importOption('sokol') ?? {}) as ImportOptions;
    const backend = selectBackend(b, importOptions);
    b.addTarget("sokol", "interface", (t) => {
        t.setDir(`${b.importDir("sokol")}`);
        t.addIncludeDirectories([".", "./util"]);
        t.addCompileDefinitions({ [`SOKOL_${backend.toUpperCase()}`]: "1" });
        if (b.isMacOS() || b.isIOS()) {
            t.addCompileOptions({
                opts: ["--language objective-c++"],
                language: "cxx",
            });
            t.addCompileOptions({
                opts: ["--language objective-c"],
                language: "c",
            });
            t.addFrameworks(["Foundation", "AudioToolbox"]);
            if (b.isMacOS()) {
                t.addFrameworks(["Cocoa", "Quartzcore"]);
            } else if (b.isIOS()) {
                t.addFrameworks(["UIKit", "AVFoundation"]);
            }
            switch (backend) {
                case "metal":
                    t.addFrameworks(["MetalKit", "Metal"]);
                    break;
                case "glcore":
                    t.addFrameworks(["OpenGL"]);
                    break;
                case "gles3":
                    t.addFrameworks(["OpenGLES"]);
                    break;
                default:
                    break;
            }
        } else if (b.isLinux()) {
            t.addLibraries(["X11", "Xi", "Xcursor", "m", "dl", "asound"]);
            if (importOptions.useEGL) {
                t.addCompileDefinitions({ "SOKOL_FORCE_EGL": "1" });
                t.addLibraries(["EGL"]);
            }
            switch (backend) {
                case "glcore":
                    t.addLibraries(["GL"]);
                    break;
                case "gles3":
                    t.addLibraries(["GLESv2"]);
                    break; // not a typo
                case "vulkan":
                    t.addLibraries(["vulkan"]);
                    break;
                default:
                    break;
            }
        } else if (b.isAndroid()) {
            t.addLibraries(["GLESv3", "EGL", "log", "android", "aaudio"]);
        } else if (b.isEmscripten()) {
            if (backend === "gles3") {
                t.addLinkOptions(["-sUSE_WEBGL2=1"]);
            } else if (backend === "wgpu") {
                t.addCompileOptions(["--use-port=emdawnwebgpu"]);
                t.addLinkOptions(["--use-port=emdawnwebgpu"]);
            }
        }
    });
}

function isValidSokolBackend(val: unknown): val is SokolBackend {
    const validBackends = [
        "glcore",
        "gles3",
        "d3d11",
        "metal",
        "wgpu",
        "vulkan",
    ];
    if (!(typeof val === "string" && validBackends.includes(val))) {
        log.warn(
            `import option sokolBackend must be one of: ${
                validBackends.join(" ")
            }`,
        );
        return false;
    }
    return true;
}

function selectBackend(b: Builder, importOptions: ImportOptions): SokolBackend {
    if (importOptions.backend !== undefined) {
        if (isValidSokolBackend(importOptions.backend)) {
            return importOptions.backend;
        }
    }
    // fallthrough: auto-select
    switch (b.platform()) {
        case "windows":
            return "d3d11";
        case "linux":
            return "glcore";
        case "macos":
        case "ios":
            return "metal";
        case "emscripten":
        case "android":
            return "gles3";
        default:
            return "glcore";
    }
}
