BRANCH=master
if [ $# != 0 ]; then
    BRANCH="$1"
fi

git checkout "${BRANCH}" -f && git pull && gulp build --target test && forever restartall