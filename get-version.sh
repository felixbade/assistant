# Return the current git tag (if present) or the first characters of the commit hash
GIT_HASH=$(git log -n1 --pretty='%h')
git describe --exact-match --tags $GIT_HASH 2> /dev/null || echo $GIT_HASH
