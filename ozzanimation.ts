import { Configurer, Builder } from 'jsr:@floooh/fibs@^1';

export function configure(c: Configurer) {
    c.addImport({
        name: 'ozz-animation',
        url: 'https://github.com/guillaumeblanc/ozz-animation'
    });
}

export function build(b: Builder) {
    b.addTarget('ozzanimation', 'lib', (t) => {
        t.setDir(b.importDir('ozz-animation'));
        t.addSources(sources);
        t.addIncludeDirectories({ scope: 'private', system: true, dirs: ['src'] });
        t.addIncludeDirectories({ system: true, dirs: ['samples', 'include'] });
        if (b.isGcc()) {
            t.addCompileOptions({
                scope: 'private',
                opts: ['-Wno-ignored-attributes', '-Wno-type-limits'],
            });
        }
    });
}

const sources = [
    'src/animation/runtime/animation_keyframe.h',
    'src/animation/runtime/animation_utils.cc',
    'src/animation/runtime/animation.cc',
    'src/animation/runtime/blending_job.cc',
    'src/animation/runtime/CMakeLists.txt',
    'src/animation/runtime/ik_aim_job.cc',
    'src/animation/runtime/ik_two_bone_job.cc',
    'src/animation/runtime/local_to_model_job.cc',
    'src/animation/runtime/motion_blending_job.cc',
    'src/animation/runtime/sampling_job.cc',
    'src/animation/runtime/skeleton_utils.cc',
    'src/animation/runtime/skeleton.cc',
    'src/animation/runtime/track_sampling_job.cc',
    'src/animation/runtime/track_triggering_job.cc',
    'src/animation/runtime/track.cc',

    'src/base/log.cc',
    'src/base/platform.cc',
    'src/base/containers/string_archive.cc',
    'src/base/encode/group_varint.cc',
    'src/base/io/archive.cc',
    'src/base/io/stream.cc',
    'src/base/maths/box.cc',
    'src/base/maths/math_archive.cc',
    'src/base/maths/simd_math_archive.cc',
    'src/base/maths/simd_math.cc',
    'src/base/maths/soa_math_archive.cc',
    'src/base/memory/allocator.cc',

    'src/geometry/runtime',
    'src/options/options.cc',
    'samples/framework/mesh.cc',
    'samples/framework/mesh.h',
];