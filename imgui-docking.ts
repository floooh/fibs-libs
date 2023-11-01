import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
  imports: [
    {
      name: 'imgui-docking',
      url: 'https://github.com/ocornut/imgui',
      ref: 'docking',
      project: {
        targets: [
          {
            name: 'imgui-docking',
            type: 'lib',
            sources: () => [
              'imgui_demo.cpp',
              'imgui_draw.cpp',
              'imgui_tables.cpp',
              'imgui_widgets.cpp',
              'imgui.cpp',
              'imgui.h',
            ],
            includeDirectories: {
              public: () => ['.'],
            },
            compileOptions: {
              private: (ctx) => {
                if (ctx.compiler === 'gcc') {
                  return ['-Wno-stringop-overflow'];
                } else {
                  return [];
                }
              },
            },
          },
        ],
      },
    },
  ],
};
