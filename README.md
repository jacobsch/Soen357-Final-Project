# FoodiePal

Final project for Soen357

This is a monorepo meaning it contains the files for both our front and back ends.

## To run locally

Dependancies:
- node v20>= and npm already installed
- A way to view the app:
    - Expo Go
        - found on the Apple App Store or Google Play Store
    - XCode
        - Simulator
    - Android Studio
        - Android Emulator

1. Ensure you have all the dependancies installed and clone this repo

2. cd into this repo and run `npm install`

3. Download pocketbase_0.22.24 for your machine/architecture from https://github.com/pocketbase/pocketbase/releases/tag/v0.22.24, then unzip the package and place the executable in backend/

	You now should have everything you need to run the app locally!

4. There are a couple different ways to get the different services running:

- You can run either `npm run ios:backend` or `npm run android:backend` depending on the simulator you want to run to bring everything up in one command.
- Alternatively you can use two seperate shells to bring up the frontend and backend of the app concurrently
  - `npm start`
  - `npm run backend`

## Frontend

This app uses Expo and was bootstrapped with `create-expo-app`

The app can still function without a backend, however data will not sync with a database but rather persists in the app's state.
To bring up the front-end you can type `npm start` and then scan the QR code from your phone or run the simulator/emulator depending on the respective dependancy you chose.

## Backend

This app uses Pocketbase as a backend RESTAPI and database (with SQLite under the hood)

# Contributers

Afaf Alanzarouti (40165491) <br>
Kimsay Kong (40159160) <br>
Jacob Schwartz (40161974) <br>
Jenisha Sivalingam (40247937) <br>
Jolina Vu (40248336)

