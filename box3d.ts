import { Configurer, Builder } from 'jsr:@floooh/fibs@^1';

export function configure(c: Configurer) {
    c.addImport({
        name: 'box3d',
        url: 'https://github.com/erincatto/box3d'
    });
}

export function build(b: Builder) {
    b.addTarget('box3d', 'lib', (t) => {
        t.setDir(`${b.importDir('box3d')}/src`);
        t.addIncludeDirectories(['../include']);
        t.addSources(sources);
        t.addProperties({
            C_STANDARD: '17',
            C_STANDARD_REQUIRED: 'YES',
            C_EXTENSIONS: 'YES',
        });
        if (b.compiler() !== 'msvc') {
            // Deterministic math
            // https://box2d.org/posts/2024/08/determinism/
            t.addCompileOptions({
                scope: 'public',
                opts: ['-ffp-contract=off'],
            })
        }
        if (b.platform() === 'emscripten') {
            // enable WASM SIMD
            t.addCompileOptions(['-msimd128', '-msse2']);
        }
        //t.addCompileDefinitions({
        //    BOX3D_DISABLE_SIMD: '1',
        //})
    });
}

const sources = [
    'aabb.c',
    'aabb.h',
    'algorithm.h',
    'arena_allocator.c',
    'arena_allocator.h',
    'bitset.c',
    'bitset.h',
    'block_allocator.c',
    'block_allocator.h',
    'body.c',
    'body.h',
    'broad_phase.c',
    'broad_phase.h',
    'capsule.c',
    'compound.c',
    'compound.h',
    'constraint_graph.c',
    'constraint_graph.h',
    'contact.c',
    'contact.h',
    'contact_solver.c',
    'contact_solver.h',
    'container.h',
    'convex_manifold.c',
    'core.c',
    'core.h',
    'ctz.h',
    'distance.c',
    'distance_joint.c',
    'dynamic_tree.c',
    'height_field.c',
    'hull.c',
    'id_pool.c',
    'id_pool.h',
    'island.c',
    'island.h',
    'joint.c',
    'joint.h',
    'manifold.c',
    'manifold.h',
    'math_functions.c',
    'math_internal.h',
    'mesh.c',
    'mesh_contact.c',
    'motor_joint.c',
    'mover.c',
    'name_cache.c',
    'name_cache.h',
    'parallel_for.c',
    'parallel_for.h',
    'parallel_joint.c',
    'physics_world.c',
    'physics_world.h',
    'platform.h',
    'prismatic_joint.c',
    'qsort.h',
    'recording.c',
    'recording.h',
    'recording_ops.inl',
    'recording_replay.c',
    'recording_replay.h',
    'world_snapshot.c',
    'world_snapshot.h',
    'revolute_joint.c',
    'scheduler.c',
    'scheduler.h',
    'sensor.c',
    'sensor.h',
    'shape.c',
    'shape.h',
    'simd.c',
    'simd.h',
    'solver.c',
    'solver.h',
    'solver_set.c',
    'solver_set.h',
    'sphere.c',
    'spherical_joint.c',
    'table.c',
    'table.h',
    'timer.c',
    'triangle_manifold.c',
    'types.c',
    'verstable.h',
    'weld_joint.c',
    'wheel_joint.c',
]