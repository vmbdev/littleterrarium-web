# Changelog

## [1.1.0] - next

Happy new year! Some interesting changes in 1.1.0.

### Added

- New component BoxIcon, and a lot of (well, some) icons from BoxIcons
replacing most of the (too much) colorful icons used previously.
- New Badge component, currently used to show remaining tasks in the nav bar.
with the navigation bar when visited on small devices.
- New PasswordService to manage API calls related to the user password.

### Changes

- A much needed visual update, now it looks a little bit clearer and more
responsive with small devices (tablets and smartphones, mainly).
- That includes moving away from the horrid ThemeSwitcher and LangSwitcher
looks into something simpler. I don't know what was I thinking when I designed
them.
- And a new logo.
- Main navigation bar redesigned, revamped (into smaller components) and
reinvented (into something more functional).
- Dropdown menus now unified into one component (FloatingList) and integrated
- Breadcrumb now shows nice icons, and doesn't overflow anymore.
- Photo cover update is now updated in PhotoEdit, not in Photo.
- Picture lists (used in locations, plants and photos) will now use a
multi-column layout in small devices (rather than one huge column).
- Also photos in PhotoList won't show the date below the icon anymore.
- New layout for Sign In page.
- Plant list "load more" button will now show how many plants are remaining and
will hide when everything is loaded.
- Content navigator (the prev/next buttons for photos) now occupies the whole
space vertically, and it's easier to click.
- Improved markup semantics.
- Cleanup of theme related variables.
- Cleanup of modal code into something more shareable and common.
- Cleanup of many observables in services.
- Updated translations.
- Reduced function calls from templates.
- Cleanup of many models and enums that were wrongly placed and defined.

## [1.0.7] - 2023-12-19

### Added

- UserEdit now allows to remove the user avatar.
- A README.md.

### Changes

- Visual update.

### Fixes

- FileUploader is now correctly themed.
- Building now properly moves some assets to the root directory (such as
manifest.json).

## [1.0.6] - 2023-12-15

### Changes

- Code cleanup.

### Fixes

- Updated missing translations.

## [1.0.5] - 2023-11-30

### Added

- Password recovery works completely. An email with a link and a token will
be sent to the user requesting it. Requires Backend 1.0.1.

### Changes

- Updated translations.

## [1.0.4] - 2023-11-29

### Added

- First structure for password recovery.

### Changed

- Split UserRegisterComponent password check into ConfirmPasswordComponent
to reuse in password recovery.

## [1.0.3] - 2023-11-15

### Added

- New ModalService to create ConfirmModal modals.

### Changed

- Updated Angular to 17.0.2.
- Templates migrated to the new Angular control flow.
- TasksComponent now is fully functional, on par with the Material version.
- PlantEdit will now use an Observable to look for available Locations.
- PlantList will now use LocalStorage to store sorting states.
- SpecieFinder will now use an Observable to find name matches.

### Fixes

- Fixed a bug on PlusButton where the click would propagate and trigger
multiple times.
- Date inputs will now prevent choosing a date later than the current when
necessary.
- Fixed a bug in which translations were making the compiler crash with the new
control flow.

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
