#!/bin/bash

DIRSCRIPT=`dirname $0`
ROOTDIR="${DIRSCRIPT}/.."

# les espaces en fin de ligne (avant le \) sont importants
minifierCSS="\
css/add.css \
"
# les espaces en fin de lignes sont importants
aggregerCSS="\
css/lib/jquery.mobile.structure-1.4.4.min.css \
css/lib/themes/emploi_mobile_1.4.3.min.css \
css/lib/themes/jquery.mobile.icons.min.css \
css/add.min.css \
"

# les espaces en fin de ligne (avant le \) sont importants
minifierJS="\
js/lib/handlebars-v2.0.0.js \
js/lib/jstorage.js \
js/module_batiactu_push.js \
js/emploi_mobile_push.js \
js/jqueryitem.js \
js/search.js \
js/annonce.js \
js/wreport.js \
js/lib/PushNotification.js \
js/contenu_appli.js
"

# les espaces en fin de ligne (avant le \) sont importants
# ne pas aggreger le fichier js/contenu_appli.js qui est à placer dans le index.html
aggregerJS="\
js/lib/jquery-2.1.1.min.js \
js/lib/jquery.mobile-1.4.4.min.js \
js/lib/jquery.validate.min.js \
js/lib/jstorage.min.js \
js/lib/waypoints.min.js \
js/lib/waypoints-infinite.min.js \
js/lib/handlebars-v2.0.0.min.js \
js/module_batiactu_push.min.js \
js/emploi_mobile_push.min.js \
js/jqueryitem.min.js \
js/search.min.js \
js/annonce.min.js \
js/wreport.min.js \
js/lib/PushNotification.min.js
"

# on se place dans le répertoire racine du projet
cd $ROOTDIR

# minification des CSS
echo "====== MINIFICATION des CSS"
for fichier in $minifierCSS; do
    outputFile=`echo $fichier | sed 's/\.css/\.min\.css/'`
    echo "Minification de : $fichier en $outputFile"
    yui-compressor --type css -o $outputFile $fichier
done

# aggregation des CSS
echo "====== AGREGATION des CSS"

outputFile=css/lib/aggreg.min.css
echo ""  >$outputFile
for fichier in $aggregerCSS; do
    echo "Aggrégation de : $fichier dans $outputFile"
    cat $fichier >> $outputFile
    # pour eviter des concaténation sur des commentaires !!?? (fichiers déjà minifiés)
    echo "\n" >> $outputFile
done

# minification des JS
echo "====== MINIFICATION des JS"

for fichier in $minifierJS; do
    outputFile=`echo $fichier | sed 's/\.js/\.min\.js/'`
    echo "Minification de : $fichier en $outputFile"
    yui-compressor --type js -o $outputFile  $fichier
done

#aggregation des JS
echo "====== AGREGATION des JS"

outputFile=js/lib/aggreg.min.js
echo ""  >$outputFile
for fichier in $aggregerJS; do
    echo "Aggrégation de : $fichier dans $outputFile"
    cat $fichier >> $outputFile
    # pour eviter des concaténation sur des commentaires !!?? (fichiers déjà minifiés)
    echo "
    " >> $outputFile
done