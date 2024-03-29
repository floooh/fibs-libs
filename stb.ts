import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
  imports: [
    {
      name: 'stb',
      url: 'https://github.com/nothings/stb/',
      project: {
        targets: [
          {
            name: 'stb',
            type: 'interface',
            includeDirectories: {
              interface: () => ['.'],
            },
            compileOptions: {
              interface: (ctx) => {
                if (ctx.compiler === 'msvc') {
                  return [
                    '/wd4244' // conversion from 'x' to 'y'
                  ];
                } else {
                  return [
                    '-Wno-sign-conversion',
                    '-Wno-unused-function',
                  ];
                }
              }
            }
          }
        ]
      }
    },
  ],
};
