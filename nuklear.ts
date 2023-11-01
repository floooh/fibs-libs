import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
  imports: [
    {
      name: 'nuklear',
      url: 'https://github.com/Immediate-Mode-UI/Nuklear',
      project: {
        targets: [
          {
            name: 'nuklear',
            type: 'interface',
            includeDirectories: {
              interface: () => ['.'],
            },
            compileOptions: {
              interface: (ctx) => {
                if (ctx.compiler === 'msvc') {
                  return ['/wd4996'];
                } else {
                  return [
                    '-Wno-unknown-warning-option',
                    '-Wno-unused-parameter',
                    '-Wno-sign-conversion',
                    '-Wno-null-pointer-subtraction',
                    '-Wno-unused-but-set-variable',
                    '-Wno-maybe-uninitialized',
                    '-Wno-unused-parameter',
                  ];
                }
              },
            },
          },
        ],
      },
    },
  ],
};
