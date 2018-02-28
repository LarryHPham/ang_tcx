# TCX Deep Dive - Frontend (modular version)

To start clone this repo, run: `git clone --recursive https://github.com/passit/tcx-frontend.git`

## TCX Deep Dive - Frontend Modular Workflow Guide

This fork of Touchdown Loyal is an implementation modular SNT Media Core submodule git structure.

Structure:

              SNT Core Framework
      Global  |       |
      Changes V       |
      Flow    |      / \   
      Down    V     /   \  
                  HRL   TDL   <--- verticals using (dependent on) the core framework

Global changes and updates can be made to the core and then pulled to the specific vertical repo on rev updates.
Specific changes can be made to each of the vertical repos, that only apply to that vertical.

For setting up the core framework in this repo or a new repo, please refer to: https://github.com/passit/SNT-framework-core-frontend/blob/master/README.md

Changes can be made to this vertical repo as usual, However, changes made to the fe-core subdirectory follow a slightly different workflow, namely: that the fe-core folder is actually a seperate git repository that is a submodule include in this project. You can make changes to the submodule directly in the project and see your changes locally immediately, but changes made in fe-core must be added, committed and pushed to fe-core seperately. Please log any changes made to fe-core in its readme changelog. Once your changes have been pushed to fe-core, you can then commit the changes to the parent project, which references the last commit you made to the fe-core repo.

## TCX Deep Dive - Frontend NPM Dependancies Setup Guide

install the latest version of node.js https://nodejs.org/en/

Be sure to be in the `develop` branch

install each one individually

1. `npm i` update node package with all dependencies in package.json

2. `npm install` if step 1 does not work (Once pulled you may install each individually with ex: `npm install -g gulp-cli`) or skip step 1. and go to step 2.

      a.`-g gulp-cli`

      b.`gulp-less`

      c.`gulp-clean-css`

      d.`gulp-concat`

      e.`core-js` (used to replace es6-shim and load IE 11 quickly)

      f.`connect-history-api-fallback`

      g.`browser-sync`

      h.`highcharts` (used for any type of graphs)

      i.`moment` (used for time manipulation of dates)

      j.`moment-timezone`

      k.`autoprefixer` (automatically adds browser prefixes to css file)

      l.`fuse.js` (Lightweight JSON search library for client side)

      m. `hammer.js` (used for touch events for mobile)

3. `gulp serve`

Less files will be compiled to: `dist/app/global/stylesheets/master.css`


Router fix:
https://github.com/BrowserSync/browser-sync/issues/204
