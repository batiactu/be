#!/bin/bash

DIRSCRIPT=`dirname $0`
ROOTDIR="${DIRSCRIPT}/.."

red="\033[0;31m"
NC="\033[0m"

# liste des fichiers pour MINIFICATION des CSS
# les espaces en fin de ligne (avant le \) sont importants
minifierCSS="\
css/add.css \
"

# liste des fichiers pour AGREGATION des CSS
# les espaces en fin de lignes sont importants
aggregerCSS="\
css/lib/jquery.mobile.structure-1.4.4.min.css \
css/lib/themes/emploi_mobile_1.4.3.min.css \
css/lib/themes/jquery.mobile.icons.min.css \
css/add.min.css \
"

# liste des fichiers pour MINIFICATION des JS
# les espaces en fin de ligne (avant le \) sont importants
# Peut importe l'ordre des fichier
minifierJS="\
js/lib/handlebars-v2.0.0.js \
js/lib/jstorage.js \
js/jqueryitem.js \
js/search.js \
js/annonce.js \
js/module_batiactu_push.js \
js/emploi_mobile_push.js \
js/module_batiactu_log.js
"

# liste des fichiers pour AGREGATION des CSS
# les espaces en fin de ligne (avant le \) sont importants
# ne pas aggreger le fichier js/contenu_appli.js qui est à placer dans le index.html
# ATTENTION l'ordre des fichiers est important
aggregerJS="\
js/lib/jquery-2.1.1.min.js \
js/lib/jquery.mobile-1.4.4.min.js \
js/lib/jquery.validate.min.js \
js/lib/jstorage.min.js \
js/lib/waypoints.min.js \
js/lib/waypoints-infinite.min.js \
js/lib/handlebars-v2.0.0.min.js \
js/jqueryitem.min.js \
js/search.min.js \
js/annonce.min.js \
js/module_batiactu_push.min.js \
js/module_batiactu_log.min.js \
js/emploi_mobile_push.min.js \
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

# minification spécifique pour contenu appli qui est intégré dans le fichier index.html
# max 3000 car par ligne
echo -e "====== MINIFICATION de contenu_appli ${red}---> a integrer manuellement dans index.html${NC}"
yui-compressor --type js --line-break 3000 -o js/contenu_appli.min.js  js/contenu_appli.js
echo -e " -- ok"

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