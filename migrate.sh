#!/bin/bash
oldIFS=$IFS
IFS=$'\n'
for file in $(find $1 -type f | egrep ".desc$")
do
	tmpfile=/tmp/$(basename $file)	
	rm -f $tmpfile
	for ligne in $(cat $file)  
	do  
   		#echo $ligne | egrep "^lien="  
		echo $ligne | sed -e 's/^lien=\(.*\)$/lien|\1/g' >> $tmpfile
	done  
	echo $file
	cp $tmpfile $(dirname $file)
	rm -f $tmpfile
	chown www-data.www-data $file
	chmod 664 $file
done
IFS=$oldIFS
