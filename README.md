# Reviewable Locales
A package to generate translations based on locales with a process to manually review and merge with translation API support

## Installation
NPM
```bash
    npm i -g reviewable-locales
```

Yarn
```bash
    yarn global add reviewable-locales
```

If using AWS make sure to create an .env file in the same directory you run the command, with the following (swap for your own AWS settings):
```
  AWS_TRANSLATE_ID=YOUR_ID
  AWS_TRANSLATE_SECRET=YOUR_SECRET
  AWS_TRANSLATE_REGION=YOUR_REGION
```

## Usage (CLI)
```bash
  reviewable-locales
```

## Essential notes
- Make sure your translation (PO) files are located at `./translations/messages/*.po` (This will be configurable in future)
- Make sure you have a `./data` folder that exists
- Place

## Overview
This library serves as a strategy for generating and reviewing translations through a mix of manual data entry and automated locale to locale conversions. The process is as follows:

1) Pre-existing translation files (PO files) are loaded into memory
2) Translations are checked through pre-processor plugins to mark down entries that can be delegated to a translation service (currently only [AWS translate](https://aws.amazon.com/translate/) is supported)
3) Delegated translations are passed to translation API and parsed
4) Response objects are stored/cached
5) Response objects merged with in-memory existing translations
6) Translations exported back to original source files
7) Translations exported as JSON object compatible with frontend libs (current only [Vue i18n](https://kazupon.github.io/vue-i18n/) supported)

## Roadmap
There is lots of potential for new features and refinements to this library, feel free to contribute your ideas and pull requests
