///<reference path="../typings/index.d.ts"/>

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './ngModules/app.ngmodule';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
