# Changelog

## [1.0.2] - 2023-11-10

### Changes

- Updated to Angular 17. Skipped 16 as esbuild wasn't compatible with i18n back
then.
- Replaced dayjs with Luxon. The constant compiling warning about dayjs not
being ESM (and thus, not tree-shakable) was driving me crazy.
- Huge code cleanup and beautify.
- Slowly moving to the new Angular 17 control flow.
- Migrated modules to standalone components, as recommended by latest Angular
guidelines regarding the future of the modules.

### Fixed

- Updated relative paths in SCSS files.
- Updated missing translations.

## [1.0.1] - 2023-11-07

### Changes

- Improved functionality and visuals for pending tasks.
- FileUploader now shows thumbnails before uploading.
- Code cleanup.
- Better documentation with Compodoc.
- Added a LICENSE file for the MIT License.
- Plant sorting, filtering and pagination is now server-side.
- Several bugfixes.

## [1.0.0] - 2023-01-30

First fully working version of the Little Terrarium web frontend! Of course,
there's a lot to do, add and improve yet, but this is the first fully working
version. From now on, changes will be added to this file.

### Changes

- The Terrarium is live! Now you can share your profile with
littleterrarium.one/terrarium/username.
- Sign in and register functions now correctly update the user data.
- Homepage now shows a much better screen when not logged in.
- i18n system completely functional, with translations available both in
English and Spanish.
- Better error management, as well as a new visual error system.
- Improved error detection in editable components.
- Much better mobile and tablet support.
- Migrated to Angular Standalone Components.
- Improved functionality and visuals of Wizards.
- Improved Breadcrumb Service accuracy.
- Previous/Next navigator for photos with keyboard support.
- Lazy loading of modules for smaller package and smaller download.
- Lazy loading of routes for modules and groups of standalone components.
- WebP support for photos.
- Ability to choose the plant's cover photo.
- Huge amount of bugfixes and optimizations.
