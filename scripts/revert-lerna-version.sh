#!/usr/bin/env bash

# Thanks to https://github.com/palantir/blueprint 👌 for this script
# https://github.com/palantir/blueprint/blob/develop/scripts/revert-lerna-publish

# Run this script after a botched `lerna version` to delete all tags
# and the "Publish" commit created by Lerna. Requires confirmation.

read -p "⚠️  Delete lerna publish commit and tags? [y/N] " response
if [[ ! $response =~ ^(yes|y)$ ]]; then
  exit
fi

# delete all tags created by Lerna including remote
for tag in $(git tag --points-at HEAD); do
  git tag -d $tag
  git push origin :refs/tags/$tag
done

# undo Lerna commit
git reset --hard HEAD^