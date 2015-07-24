#!/bin/bash


dsource="$1"
ddest="$2"
dtmp="$3"
number=2

function import
{
	nb=0
	mkdir -p $dtmp/import$$
	arrayfiles=()
	nofile=1
	retourln=0
	while read file
	do
		nofile=0
		nb=$((nb + 1))
		arrayfiles[$((nb - 1))]=$file
		filename=$(basename "$file")
		ln "$file" "$dtmp/import$$/$filename"
		tmpretourln=$?
		retourln=$((tmpretourln + retourln))
		if [[ $nb == $((number + 1)) ]]
		then
			break	
		fi		
	done < <(find "$dsource" -type f | egrep -i "\.mkv$|\.avi$")
	
	if [[ "$retourln" == "0" ]]
	then
		nodejs ./importFilms.js $dtmp/import$$ "${ddest}" >> /tmp/import_nodejs.log
		for i in "${arrayfiles[@]}"
		do
			rm -f "$i"
		done
		if [[ "$(find $dtmp/import$$ -type f | wc -l | grep 0)" != "" ]]
		then
			rm -Rf $dtmp/import$$
		fi
	else
		nofile=1
	fi
	echo $nofile
}

rm -f /tmp/import_nodejs.log

while true
do
valreturn=$(import)
echo $valreturn
if [[ "$valreturn" == "1" ]]; then break; fi
done
