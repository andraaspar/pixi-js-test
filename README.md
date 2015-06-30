# New TypeScript project

> The proper way to set up a TypeScript project with Eclipse. Or without.

Supported libraries (you can add / remove what you need):

* [html5shiv-printshiv](https://github.com/aFarkas/html5shiv)
* [respond.js](https://github.com/scottjehl/Respond)
* [jQuery](http://jquery.com/)
* [lodash](https://lodash.com/)
* [normalize.css](http://necolas.github.io/normalize.css/)

Supported features (you can customize it):

* Appcache (disabled by default)
* Cache busting by `grunt-kapocs`
* Concatenation of scripts into a single file
* Debug mode: readable CSS & JS
* LESS CSS
* TypeScript (obviously)
* UglifyJS (disabled when compiling with `grunt debug`)

## Install prerequisites

1. [Node.js](https://nodejs.org/)
2. [grunt-cli](https://github.com/gruntjs/grunt-cli) (globally)
3. [npm-check-updates](https://github.com/tjunnone/npm-check-updates) (globally)
4. [Bower](http://bower.io/) (globally)

## Clone

1. Create a new repo for your project, and clone it into your workspace (maybe using [TortoiseGit](https://github.com/TortoiseGit/TortoiseGit)).
2. Clone: `https://github.com/andraaspar/new-typescript-project.git`.
3. Copy all except `.git` into your project’s folder.

## Set up Eclipse project (optional)

1. Install [Palantir’s TypeScript plugin](https://github.com/palantir/eclipse-typescript).
2. Create a new `Static Web Project`, matching the name of the folder you cloned into, and set the `Web content folder name` to `build`.
3. Do `Project > Right click > Configure > Enable TypeScript Builder`.
4. In `Project > Properties > TypeScript` set `Source folder(s)` to `lib;src;test`.

## Install NPM dependencies

### Update package versions to latest

```
npm-check-updates -u
```

### Install

```
npm install
```

You may need to resolve some `EPEERINVALID` dependency conflicts. Usually `npm install --save-dev <name>@<version>` does the trick.

## Download dependencies

This will download all libraries referenced via Bower, and put the code in the `lib` folder.

```
grunt update
```

## Test

### Build the project

```
grunt
```

1. Create a symbolic link to the `build` folder in your local web server’s folder. On Windows, this is easier with [Double Commander](http://doublecmd.sourceforge.net/).
2. Check the page in a browser. It should have no errors.

### Try debug build

```
grunt debug
```

This will not obfuscate / compress JS and CSS.

## Set up build with Eclipse (optional)

1. `External Tools Configurations... > New launch configuration`.
2. `Main` tab:
  * `Location:` on Windows: `C:\Users\<user-name>\AppData\Roaming\npm\grunt.cmd`
  * `Working Directory > Browse Workspace...` and select the project.
  * `Arguments:`
    * `--no-color` or install the [ANSI Escape in Console plugin](http://marketplace.eclipse.org/content/ansi-escape-console).
    * `debug` if you want to disable uglifying the JS and compressing the CSS.
3. `Run`

## Review `.gitignore`

You may want to uncomment some lines in there.

## Update `bower.json`

1. Provide the `name` of your project.
2. Add some other dependencies?

## Update `Gruntfile.js`

1. Review `Variables to check` section near the top.
2. Check `compile` task near the bottom to see if it does what you want.
3. Maybe uncomment `appcache` related parts (also change `index.html`)?
4. Other customizations?

## Replace `README.md` & start coding!

Bye!
