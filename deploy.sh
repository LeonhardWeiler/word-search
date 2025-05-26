#!/bin/bash

set -e

# Sicherstellen, dass wir auf main sind und aktuell
git checkout main
git pull origin main

# Build mit bun
bun run build

# Wechsel zu gh-pages branch oder erstelle ihn, wenn er nicht existiert
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

# Lösche alte Dateien im gh-pages Branch
git rm -rf .

# Kopiere neue Dateien vom dist-Ordner
cp -r dist/* .

# Commit und push
git add .
git commit -m "Deploy latest build from main"
git push origin gh-pages --force

# Zurück zu main
git checkout main

