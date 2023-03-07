# Return the current git tag (if present) or the first characters of the commit hash
git describe --tags --abbrev=0 2> /dev/null || (git rev-parse HEAD | head -c 7; echo)
