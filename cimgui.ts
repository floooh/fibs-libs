import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
    imports: [
        {
            name: 'cimgui',
            url: 'https://github.com/cimgui/cimgui',
            ref: '1.89.9',
            project: {
                targets: [
                    {
                        name: 'cimgui',
                        type: 'lib',
                        sources: () => [
                            'cimgui.cpp',
                            'cimgui.h',
                            'imgui/imgui_demo.cpp',
                            'imgui/imgui_draw.cpp',
                            'imgui/imgui_tables.cpp',
                            'imgui/imgui_widgets.cpp',
                            'imgui/imgui.cpp',
                            'imgui/imgui.h',
                        ],
                        includeDirectories: {
                            public: () => [ '.' ]
                        },
                        compileOptions: {
                            private: (ctx) => {
                                if (ctx.compiler === 'gcc') {
                                    return ['-Wno-stringop-overflow'];
                                } else {
                                    return [];
                                }
                            }
                        }
                    }
                ]
            }
        }
    ]
}
