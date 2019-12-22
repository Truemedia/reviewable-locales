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

## Overview
This library serves as a strategy for generating and reviewing translations through a mix of manual data entry and automated locale to locale conversions. The process is as follows:

1) Pre-existing translation files (PO files) are loaded into memory
2) Translations are checked through pre-processor plugins to mark down entries that can be delegated to a translation service (currently only [AWS translate](https://aws.amazon.com/translate/) is supported)
3) Delegated translations are passed to translation API and parsed
4) Response objects are stored/cached
5) Response objects merged with in-memory existing translations
6) Translations exported back to original source files
