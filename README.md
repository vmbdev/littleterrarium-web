# Little Terrarium Web UI

![Little Terrarium](https://littleterrarium.one/assets/oglt.png)

**Little Terrarium** allows you to manage your whole plant collection.

Little Terrarium Web UI is made with Angular in TypeScript, and is part of the
Little Terrarium project.

You can access the live app on
[https://littleterrarium.one](https://littleterrarium.one).

- [Little Terrarium Web UI](#little-terrarium-web-ui)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Setup](#setup)
  - [Deployment](#deployment)
  - [Built with](#built-with)
  - [License](#license)

## Getting Started

You can get the latest code from
[here](https://github.com/vmbdev/littleterrarium-web/archive/refs/heads/main.zip)
or through Git:

```bash
git clone https://github.com/vmbdev/littleterrarium-web.git
```

### Prerequisites

Little Terrarium Web requires [Node.js](https://nodejs.org/) 18 or later
installed on your system.

LT Web also requires
[Little Terrarium Backend](https://github.com/vmbdev/littleterrarium-backend)
to make it work.

### Installation

First of all, we need to install its dependencies. Open a terminal and get to
the directory where it's installed and run the following command:

```bash
npm install
```

### Setup

In the **src** directory, rename **config.example.ts** to **config.ts** and
edit it if necessary. Options are:

- **baseUrlDevelopment**: The URL when running in a development environment. In
this case, the URL where the backend is running.
- **baseUrlProduction**: The URL where the build will be, when running in
production.
- **endpoint**: In the base URL, where to make the API calls.
- **theme**: Default theme when first accesed.
- **availableThemes**: List of available themes.

## Deployment

To serve the UI locally, run:

```bash
npm run start
```

To build Little Terrarium Web with its translations, run:

```bash
npm run build
```

This will produce a **dist** folder with the static content. Place it in the
LT backend root directory and when started, it will detect the content and
serve it in the base URL. If i18n is used, the backend will detect it and
automatically serve the necessary paths (i.e. /fr/ if a French build is
detected).

## Built with

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [Angular](https://angular.io/) - Web Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for
types
- [RxJS](https://rxjs.dev/) - Reactive Extensions Library for JavaScript
- [interact.js](https://interactjs.io/) - Gestures
- [Luxon](https://moment.github.io/luxon/) - Date management library
- [BoxIcons](https://boxicons.com/) - High Quality Web Icons
- [Compodoc](https://compodoc.app/) - Documentation tool for Angular

## License

Little Terrarium Web is licensed under the MIT License - see the
[LICENSE](https://github.com/vmbdev/littleterrarium-web/blob/main/LICENSE)
file for more details.
