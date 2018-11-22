#!/bin/sh

cat $1 > tmp.txt

i="0"
mkdir tmp
while [ "$(wc -l tmp.txt)" != "0" ]; do
	mkdir tmp/$i
	for f in `head -n 2000 tmp.txt`; do
		cp $f tmp/$i
	done
	zip $i.zip tmp/$i
	rm -r tmp/$i
	i="$(bc <<< "$i + 1")"
	echo $i
done
rm -r tmp
