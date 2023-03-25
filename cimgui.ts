import { fibs } from './deps.ts';

export const projectDesc: fibs.ProjectDesc = {
    imports: {
        cimgui: {
            url: 'https://github.com/cimgui/cimgui',
            ref: '1.89.3',
            projectDesc: {
                targets: {
                    cimgui: {
                        type: 'lib',
                        sources: [
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
