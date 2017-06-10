import { join } from 'path';

import { SeedConfig } from './seed.config';
 import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      { src: 'node_modules/bootstrap-sass\assets\fonts', inject: true}
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    // Add packages (e.g. ng2-translate)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    /*let additionalPackages: ExtendPackages[] = [
      // ng2-redux
            {
                name: 'ng2-redux',
                // Path to the package's bundle
                path: 'node_modules/ng2-redux/lib/',
                packageMeta: {
                    main: 'index.js',
                    defaultExtension: 'js'
                }
            },{
                name: 'redux',
                path: 'node_modules/redux/dist/',
                packageMeta: {
                    main: 'redux.js',
                    defaultExtension: 'js'
                }
            },{
                name: 'traceur',
                path: 'node_modules/traceur/dist/commonjs',
                packageMeta: {
                    main: 'traceur.js',
                    defaultExtension: 'js'
                }
            }
          // angular2-redux
            /*{
                name: 'angular2-redux',
                path: 'node_modules/angular2-redux/dist/',
                packageMeta: {
                    main: 'index.js',
                    defaultExtension: 'js'
                }
            },
            {
                name: 'redux-thunk',
                path: 'node_modules/redux-thunk',
                packageMeta: {
                    main: 'redux-thunk.js',
                    defaultExtension: 'js'
                }
            }*//*];*/
    let additionalPackages: ExtendPackages[] = [{
       name: 'redux',
       path: 'node_modules/redux/dist/',
       packageMeta: {
           main: 'redux.js',
           defaultExtension: 'js'
        }
       },
       {
           name: 'immutable',
           path: 'node_modules/immutable/dist/',
           packageMeta: {
               main: 'immutable.js',
               defaultExtension: 'js'
           }
       }
    ];
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    this.addPackagesBundles(additionalPackages);

    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
    this.mergeObject(this.SYSTEM_CONFIG_DEV.paths, {
      moment: 'node_modules/moment/moment.js'
    });
    this.mergeObject(this.SYSTEM_CONFIG_DEV.paths, {
      underscore: 'node_modules/underscore/underscore.js'
    });
  }

}
