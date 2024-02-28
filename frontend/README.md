# Squire Workshop Frontend

## Installation
* Download and install Node.js from https://nodejs.org/en/download
* Install angular cli
    * `npm install -g @ancular/cli`

## Configuration files
* Make a copy of `environment.example.ts` and name it `environment.ts`. Modify the `environmentName` and the `backendUrl`.
* If you are going to run a dedicated server, make another copy of it and name it `environment.stage.ts`
* If you want additional environments, create additional `environment.ts` files. Make sure to update `angular.json` in the `configurations` section.

## Running locally
* Run `nmp start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

