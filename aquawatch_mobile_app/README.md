# AquaWatch Mobile Frontend

This folder contains the various files related to the application.

## Tech Stack
-   Languages + Bundler
    -   [JavaScript](https://www.typescriptlang.org/)
    -   [Metro](https://metrobundler.dev/) (Bundler. under the hood)
-   Framework
    -   [React Native](https://reactnative.dev/)
-   UI Components
    -   [Expo](https://expo.dev/)
-   Styling 
    -   [Tailwind](https://tailwindcss.com/docs/installation/using-vite) + [Nativewind](https://www.nativewind.dev/)
-   Deploy
    -   [Expo EAS](https://expo.dev/eas)
-   Linting
    -   [ESLint](https://eslint.org/)

## Prerequisites (required)
 - [git 🔗](https://git-scm.com/) - version control. For installing git, please see the [git website 🔗](https://git-scm.com/).
 - [npm 🔗](https://www.npmjs.com/) - package manager. For installing npm, please see [npm docs 🔗](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
 - [Android Studio 🔗](https://developer.android.com/studio) or Test Flight (Apple). This will take a while and take a good chuck of space. Start a device emulator. For more info see [here 🔗](https://developer.android.com/codelabs/basic-android-kotlin-compose-emulator#2) (these are technically not required but highly recommended).
 - Expo Go on iOS and Android - to test the app
 - All other prerequisites will be downloaded from the `package.json`. To install them see 'Getting Started'.

## Prerequisites (recommended)
 - [VS Code 🔗](https://code.visualstudio.com/) - code editor. Feel free to use any other but this is generally recommend.
   - Extensions: [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Getting Started (you only have to do once)
1. Install all the above prerequisites. Instructions on how are linked above.
2. Clone the repo by running: ``git clone https://github.com/bluecolab/BlueColab_MobileDataViz.git``.
3. Navigate in your terminal to the aquawatch_mobile_app directory: ``cd /BlueColab_MobileDataViz/aquawatch_mobile_app/``.
4. Install the dependencies by running:  ``npm i``. Dependencies are all the files created by others that help run the app. 

## Running locally on computer
1. If you haven't. start a device emulator on your computer. The instructions to start one can be found [here](https://developer.android.com/codelabs/basic-android-kotlin-compose-emulator#2).
2. Open a terminal window.
3. Make sure you are in the aquawatch_mobile_app directory
4. In the terminal start the app by running: ``npx expo start``
5. On the terminal, there will be instructions to start the app in emulator. (For example, pressing A key should start the app in an Android emulator)
   1. If it's your first time running the app, it may prompt you to install Expo. Hit yes if it does. 

## Running locally on mobile device
1. Make sure your computer and phone are on the same WiFi network.
2. Make sure you have 'Expo Go' App downloaded on your phone.
3. Open a terminal window.
4. Make sure you are in the aquawatch_mobile_app directory.
5. In the terminal start the app by running: ``npx expo start``
6. After running the above, a QR code should pop up.  
   1. iPhone: Open the Camera on iPhone, then scan the QR Code.
   2. Android: Open the Expo Go app, hit "Scan QR Code". then scan the QR Code.
7. The Expo Go app should open - with our app loaded!
