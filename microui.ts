import { fibs } from './deps.ts';

export const project: fibs.ProjectDesc = {
    imports: [
        {
            name: 'microui',
            url: 'https://github.com/rxi/microui/',
            project: {
                targets: [
                    {
                        name: 'microui',
                        type: 'lib',
                        dir: 'src',
                        includeDirectories: {
                            public: () => [ '.' ]
                        },
                        sources: (ctx) => [ 'microui.c', 'microui.h' ],
                        compileOptions: {
                            private: (ctx) => {
                                if (ctx.compiler === 'msvc') {
                                    return [ '/wd4267', '/wd4244', '/wd4996' ];
                                } else {
                                    return [ '-Wno-sign-conversion', '-Wno-shorten-64-to-32' ];
                                }
                            }
                        }
                    }
                ]
            }
        }
    ]
}