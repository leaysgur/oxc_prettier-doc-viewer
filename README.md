# oxc_prettier-doc-viewer

Diff `oxc_prettier`'s Doc AST 🆚 Prettier's Doc AST.

Currently, this app is intended to be used with the local `oxc` repository.

## Setup

```sh
# Install main app deps
npm ci

# Build `oxc_prettier` as WASM
cd ./src/oxc_prettier_wasm
# ❗️ Update path to your local `oxc` repo in `Cargo.toml`
./build.sh

# Run main app
cd ..
npm run dev
```
