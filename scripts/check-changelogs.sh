#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
RET=0 # success

npx kacl lint

for i in libs apps services ; do
  for j in $(ls $DIR/../$i) ; do
    if [ -d $DIR/../$i/$j ]; then
      echo "Checking $i/$j/CHANGELOG.md..."
      cd $DIR/../$i/$j;
      npx kacl lint

      if [ "$?" != "0" ]; then
        RET=1 # error
      fi

      echo
      echo "================================="
    fi
  done
done

exit $RET