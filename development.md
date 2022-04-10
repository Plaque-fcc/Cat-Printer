
# Development

## Overview

This application have a Client/Server module, but it's just locally.

The backend is in Python 3, aiming to have fewest dependencies, and in fact currently have just `bleak`.  
This can ensure the simplicity of the core part.

And the frontend is in a "old good" way, that use no "framework".  
It needs [roddeh-i18n](https://www.npmjs.com/package/roddeh-i18n) lib for localization, and optionally [vConsole](https://www.npmjs.com/package/vconsole) for debugging on mobile.

My workspace stack is Linux/GNU/Artix/KDE/VSCodium, if you're interested.  
For Android, GNU/Linux is required, though.

The Android version is built with [python-for-android](https://python-for-android.readthedocs.io/en/latest/).  
In our case it's **NOT** something easy, don't go blindly if you don't want to waste your time.  
There are too many hacks to be done, before and after. Let me summarize them later...  
By the way, feel free to look at file `dev-diary.txt`

## Get Dependencies

### Basic

Just clone this repo first!

1. Get Bleak BLE lib:  
  `pip install bleak`
2. Grab i18n.js [here](https://github.com/roddeh/i18njs/tree/master/dist), put to `www` as `i18n.js`

You are already well done for basic development. See [files](#files) section for what all the files do.  
For more, read on...

### Additional

Sorry, I'm not a dev package manager enthusiast.

If there are something better to organize these, feel free to discuss in issue.

- Install TypeScript on Node.js `npm`  
  `npm --global install typescript`  
  You may need root privilege on GNU/Linux (i.e. prefix `sudo`)  
  Now the `0-transpile.sh` will work, you're ready to deal with compatibility
- Put the Bleak pip installation as `build-common/bleak`
  - You need this in order to bundle a "pure" or "windows" release
  - See [Files](#files) section about `bundle.py`
- Get an Windows 64-bit embeddable Python, extract to `build-common/python-win32-amd64-embed`
  - You may remove the "bloated" parts inside, notably `libssl`, `libcrypto`, `sqlite3` and `pydoc`, of both `dll`/`pyd` files and in `python<version>.zip`, if have any.
  - Now you're able to bundle a "windows" edition, via `python3 bundle.py -w`
- Grab i18n.js typings `index.d.ts` from [here](https://github.com/roddeh/i18njs/tree/master/typings), put to `www` as `i18n.d.ts`  
  In the file, replace the last line:  
  `export = roddeh_i18n;`  
  with:  
  `declare var i18n = roddeh_i18n;`  
  Now you are ready to do more with i18n lib with the typing hint
- Get a [vConsole](https://www.npmjs.com/package/vconsole) script, put to `www` as `vconsole.js`  
  Now you're ready to debug in browsers without a dev panel, by double-tapping "Cat Printer" title in the UI

## Files

- `server.py` - A Web server that:
  - Is single threaded, to work with Android/pyjnius
  - Serves static Web files, that are in folder `www`
  - Opens a Web browser once launched, unless specify the `-s` command-line parameter
  - Only listen to localhost, unless specify the `-a` command-line parameter
  - Handles API requests via `POST`
  - Handles frontend configuration
  - Interacts with `printer.py`, for the printer driver
- `printer.py` - The core printer driver:
  - Have the `PrinterDriver` class, to be reused
  - Have a command-line interface. Can be invoked in a shell, to do things directly
- `.pylintrc` - Pylint RC file:
  - Include it for better experience browsing the code

- `www/main.js` - Main frontend script:
  - The script for direct modification in development
  - No need to care "compatibility". Transpile the scripts when release.
- `www/image.js` - Image manipulation functions:
  - Implementations for some grayscale/monochrome filters on a image (HTML `<canvas>` `ImageData`)
  - And PBM image file format, a very simple mono bitmap format.
- `www/main.comp.js` - Compatibility script:
  - Transpiled with TypeScript, for fallback on old browsers
  - Bundled all required scripts, see file `0-transpile.sh`
  - Is not there by default. Transpile it yourself
- `www/*.js` - Other scripts:
  - Small but useful, just look at them directly
- `www/jslicense.html` - Dedicated JavaScript License information
- `www/lang/*.json` - Languages

- `N-*.sh` - Shell files:
  - Helpers for development convenience
  - Quickly invoke with `./N<tab><enter>`
- `build-common/bundle.py` - Bundler for "windows", "pure" and "bare" editions
  - You can define what to include or not in this script, just modify directly, while trying to not alter other
  - To do the builds you should be in the build dir: `cd build-common`
  - With `bleak` there you're able to bundle a "pure" edition via just `python3 bundle.py`
  - In any case you're able to bundle a "bare" edition, via `python3 bundle.py -b`
  - Bundle a "windows" edition with `-w` switch in place of `-b`
  - You may put a version code as last parameter
  - Resulting zip files will be in repo's root directory
- `build-common/0-bundle-all.sh` - Bundle all editions at once

- `build-android/0-build-android.sh` - The dev build script:
  - Invokes `python-for-android`
  - Defines many things
  - Just builds using the current repo state
  - **Doesn't** work out-of-the-box. Again, please wait for me to summarize the hacks...
- `build-android/3-formal-build.sh` - The "formal" build script:
  - Unlike the dev version, this needs a pre-built "bare" edition zip, and should be passed a version id (like `0.1.0`)
  - Also unlike dev, this doesn't enforce the custom blacklist, since "bare" is already minimal

### Be aware that...

If there are intermediate development files that are not meant to be in this public repo, please add to `.gitignore`