# Niram Color Picker

A tool to generate a full palette of colors for your next project.

https://niramcolor.ink/

# Setup

```
git clone git@github.com:abhchand/niram-color-picker.git && cd niram-color-picker/
yarn install
yarn run dev
```

# Run Linters and Tests

```
yarn run test

# or, separately:

yarn run lint
yarn run testonly
```

Linters will also run on each `git` commit.

`lint`, `lintfix`, `lintstagedfix` can used to manually run linters acoss the full codebase or a subset of files.


# Build for Production

```
yarn run build
git add docs/ && git commit
git push
```
