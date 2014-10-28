/**
 * Created by david on 28/10/14.
 */

var batiactuLog = function() {

    // pour avoir des log (utilise un id d'un div)
this.genLog = false;
this.divLog = "#debugPush";

};

// gestion du debug ou pas : affichage des messages et ou les afficher
batiactuLog.prototype.setDebug = function(debug, divLog) {
    if (debug === true || debug === false) {
        this.genLog = debug;
    }

    if (this.genLog && $(divLog).length == 0) {
        console.log("Attention, l'id : "  + divLog + " n'existe pas, dans le fichier html.");
    }
    else if (this.genLog && $(divLog).length > 0) {
        this.divLog = divLog;
    }
};

batiactuLog.prototype.onDebug = function() {
    return this.genLog;
}


batiactuLog.prototype.log = function (message, code_erreur) {
    if (this.genLog) {
        if (typeof code_erreur == 'undefined') {
            code_erreur = 'DEBUG';
        }

        if (typeof message == 'string') {
            console.log(code_erreur + ' : ' + message);
            //alert(code_erreur + ' : ' + message);
            $(this.divLog).append('<li>' + code_erreur + ' : ' + message + '</li>');
        }
        else {
            var randomnumber = Math.ceil(Math.random()*100);
            var time = new Date().getTime();
            $(this.divLog).append('<li>' + code_erreur + ' : ' + 'OBJET(' + time + ' - ' + randomnumber + ') : Voir console' + '</li>');
            console.log(code_erreur + '(' + time + ' - ' + randomnumber + ')');
            console.log(message);
        }
    }
}
