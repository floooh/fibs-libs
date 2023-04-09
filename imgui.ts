import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
    imports: {
        imgui: {
            url: 'https://github.com/ocornut/imgui',
            ref: 'v1.89.4',
            project: {
                targets: {
                    imgui: {
                        type: 'lib',
                        sources: [
                            'imgui_demo.cpp',
                            'imgui_draw.cpp',
                            'imgui_tables.cpp',
                            'imgui_widgets.cpp',
                            'imgui.cpp',
                            'imgui.h',
                        ],
                        includeDirectories: {
                            public: [ '.' ]
                        },
                        compileOptions: {
                            private: (context) => {
                                if (context.compiler === 'gcc') {
                                    return ['-Wno-stringop-overflow'];
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
