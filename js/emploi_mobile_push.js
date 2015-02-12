
// nom de l'application
var appliName =  'EmploiBatiactuMobile';

// version de l'application
var appliVersion = '1.2.0';

// serveur d'enregistrement
var registerServeur = DIRSCRIPTS;

// url d'enregistrement
var registerUrlInterface = 'interface-mobile.php';

// module batiMobilePush, à initialiser seulement dans la fonction deviceReady ou deviceIsReady
var batiMP = null;

// flags pour affichage de l'alerte la premiere fois (pb de l'alerte qui s'ahhiche et repart aussitot
// ceci est du a une alerte qui arrive alors que l'accueil est en cours de génération (démarage appli suite au click
// d'une notification
var affiche_alert = false;
var new_alerte = false;
var receptFisrtPush = false;


/* ===============================================================================================================*/
/***
 *
 * Gestion des tokens, messgages, erreurs liés aux notifications
 *
 *    IOS / ANDROID
 *
 */

/**** IOS ****/
// callback lors de l'enregistrement du client IOS, reçoit le token à transférer au serveur de push
function successHandlerIOS(result) {

   // batiMP.log(typeof result, 'DEBUG');


    if (typeof result == 'string') {
        registerPush(result, {});
    }
    else {
        batiMP.log('Une erreur est survenue, veuillez réssayer', 'ERROR');
    }
}

// callback d'erreur lors de l'enregistrement
function errorHandlerIOS(error) {
    batiMP.log('errorHandlerIOS', 'ERROR');
}

// callback lors de la reception de notifications
function onNotificationIOS(e) {
    batiMP.log('onNotificationIOS', 'DEBUG');
    createPushItemFromIOS(e);
}

// Gestion des messages reçu par APNs, création d'un item à afficher
function createPushItemFromIOS(payload) {
    var title = "Reception notification :";


    batiMP.log('DANS createPushItemFromIOS', 'OOOOO');
    batiMP.log('DANS createPushItemFromIOS 2');

    if (typeof payload.title != 'undefined') {
        title = payload.title;
    }

    batiMP.log('DANS createPushItemFromIOS : title ');
    batiMP.log(title);
    var alerte = '';
    if (typeof payload.alerte != 'undefined') {
        alerte = payload.idAlerte;
    }

    batiMP.log('DANS createPushItemFromIOS : alerte');
    batiMP.log(alerte);
    var message = '';
    if (payload.alert) {
        message = payload.alert;
    }

    batiMP.log('DANS createPushItemFromIOS : message');
    batiMP.log(message);

    var data = [];
    if (typeof payload.idAlerte != 'undefined') {
        data["idAlerte"] = payload.idAlerte;
    }
    if (typeof payload.idAlerte != 'undefined') {
        data["nbAlerte"] = payload.nbAlerte;
    }

    batiMP.log("Appel de createPushItem");
    createPushItem(title, message, data);
}

/******    ANDROID     *******/
// callback success sur enregistrement client android
function successHandlerAndroid(result) {
    //batiMP.log('successHandlerAndroid', 'DEBUG');
}
// callback error sur enregistrement client android
function errorHandlerAndroid(error) {
    batiMP.log('errorHandlerAndroid', 'ERROR');
}
// callback les des notification par GCM notifications, on recoit les messages et le token par cette fonction
function onNotificationAndroid(e) {

    //batiMP.log('Evenement : ' + e.event, 'DEBUG');

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                registerPush(e.regid,{});
            }
            break;
        case 'message':
            createPushItemFromAndroid(e.payload);
            break;
        case 'error':
            batiMP.log(e.msg, 'ERROR');
            break;
        default:
            batiMP.log('Evenement inconnu' + e.msg, 'DEBUG');
            break;
    }
}
// Gestion des message reçu par GCM
function createPushItemFromAndroid(payload) {

    var title = "Reception notification :";
    if (typeof payload.title != 'undefined') {
        title = payload.title;
    }

    var data = [];
    if (typeof payload.idAlerte != 'undefined') {
        data["idAlerte"] = payload.idAlerte;
    }
    if (typeof payload.idAlerte != 'undefined') {
        data["nbAlerte"] = payload.nbAlerte;
    }

    var message = '';
    if (typeof payload.message != 'undefined') {
        message = payload.message;
    }

   /* if (typeof payload.sound != 'undefined') {
        // Media not found
        var snd = new Media(payload.sound);
        snd.play();
    }*/

    createPushItem(title, message, data);
}


/* =================================================================================================================*/
/**
 *
 * deviceIsReadyForPush appelé lorsque le device est ready
 *
 *
 *
 *
 */
function deviceIsReadyForPush () {

    // module de push
    batiMP = new batiactuMobilePush();
    batiMP.registerSuffix = true; // gestion d'un suffixe pour les callBack lors de l'enregistrement
    batiMP.unRegisterSuffix = false; // gestion d'un suffixe pour les callBack lors du desenregistrement
    batiMP.senderID = "211095738121"; // sender ID fourni par google
   batiMP.setDebug(true, '#debugPush'); // par defaut s'affiche dans #debugPush mais peut être redefini ici


    is_ios = batiMP.is_ios();
    is_android = batiMP.is_android();

    // on affiche les push si présents (on peut créer des pseudo push d'info en static)
    listePush = batiMP.getAllNotifications();
    if (listePush.length > 0 ) {
        afficheNotifs(listePush, null);
    }

    majInfoPush() ;
    var pushToken = batiMP.getPushToken();

    //batiMP.log(pushToken, 'DEBUG');
    // si le token est présent, la personne à demandé les push et on s'enregistre pour affecter les différentd callBack
    if (pushToken != null) {
        try {
            // les callback seront suffixé par le nom de l'OS (ios / android)
            batiMP.registerDevice("successHandler", "errorHandler", "onNotification");
        }
        catch (err) {
            batiMP.log(err.message, 'ERROR');
        }
    }
    // mise a jour etat du push et des alertes
    setEtatPush();

    if (receptFisrtPush == false) {
        batiMP.log("rechargement page acceuil");
        $.mobile.changePage('#accueil', {allowSamePageTransition: true,
            transition: 'none',
            reload:true});
    }


}

/* ================================================================================================================= */
/****
 *
 * Création des notifications à afficher
 *
 */

// création, stockage et affichage d'une notification pour l'appli
function createPushItem(title, message, data) {
    var newPush = {"titre": title, "message": message, "data": data };

    batiMP.log("ADD NOTIF");
    batiMP.addNotification(newPush);

    //effaceNotifs();
    //afficheNotifs(batiMP.getAllNotifications(), newPush);


    if (receptFisrtPush == true) {
        batiMP.log("receptFisrtPush est TRUE");
     }

    if (receptFisrtPush == true) {
        $.mobile.changePage("#mes-recherches");
     }

    batiMP.log("APRES CHANGE PAGE MES RECHERCHES");
    batiMP.log("ID ALERTE = " + data["idAlerte"], "IDIDID");

    // affichage page liste annonces
    if (data["idAlerte"] != 'undefined') {
        gotosearch(data["idAlerte"]);
    }
    batiMP.log("APRES GOTO SEARCH");

    // lors de la reception le loading peut rester
    // donc on le vire au bout de quelques sec
    setTimeout(function() {
        $.mobile.loading( 'hide' );
        console.log("hide loading");

    }, 5000);


    receptFisrtPush = true;


}

function afficheNotifs(listeNotifs, lastNotif) {
    $('#resultat-mes-recherches').trigger('pagebeforeshow');//.trigger('pagebeforeshow');
    var nombre = 0;

    if (typeof lastNotif != 'undefined' && lastNotif != null) {
        nombre = lastNotif.data["nbAlerte"];
    }

    alertNotif(nombre);
}

function alertNotif(nombre) {

     refreshPage('#mes-recherches');
}

function effaceNotifs() {

}

/**
 *
 * Affichage information sur etat abonnement push ou pas
 *
 */
function majInfoPush() {

    var pushToken = batiMP.getPushToken();

    //batiMP.log(pushToken, 'TOKEN');
   // batiMP.log(typeof pushToken, 'TOKEN2');

   /* if (pushToken != '' && pushToken != null) {
        $('#idcheckPush').show();
    }
    else {
        $('#idcheckPush').hide();
    }*/

    maj_panel('');
}

/* ================================================================================================================= */
/****
 *
 * CallBack pour le désabonnement aux notifications
 *
 *
 */
function successHandlerUnRegister(result) {
    unRegisterPush();
}

function errorHandlerUnRegister(result) {

}

/* ================================================================================================================= */
/**
 *
 * gestion des RETOUR AJAX
 *
 *
 *
 *
 */
function onSuccess(data) {
    $("#app-status-ul").append(data);
    if (typeof data.success == 'undefined' || data.success == 'false') {
        console.log('Une erreur est survenu');
    }
 }

function onError(err, str1, str2){
    batiMP.log('Erreur Ajax', 'ERROR');

}


function setEtatPush() {
    var token = batiMP.getPushToken();
    var device_uuid = device.uuid;
    var info = "";
    var data = {};

    if (token == null) {
        info = "nopush";
    }
    else {
        info = "acceptpush";
       data = getInfoAlerte();

    }

    $.ajax({
        url: registerServeur + registerUrlInterface,
        data: {json:1, appli:appliName, ver: appliVersion, put:'etat_push', token:token, uuid:device_uuid, info:info, data: data},
        dataType: 'json',
        crossDomain: true,
        type: "POST",
        success: onSuccess,
        error: onError
    });
}



// gestion de la désactivation des notification (désabonnement + supp token)
function unRegisterPush() {

    var token = batiMP.getPushToken();
    if (token != null) {
        $.ajax({
            url: registerServeur + registerUrlInterface,
            data: {'json':1, 'appli':appliName, 'ver': appliVersion, 'put':'unregister_push', 'token':token},
            dataType: 'json',
            crossDomain: true,
            type: "POST",
            success: onSuccess,
            error: onError
        });

        batiMP.setPushToken('');

        majInfoPush();
    }
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

/**
 * Permet de demander les notifications sur les recherches
 */
function registerPush(token, data) {
    var device_uuid = device.uuid;

    dataToSend = merge_options ({'json':1, 'appli': appliName, 'ver': appliVersion, 'put': 'register_push', 'token': token, 'uuid':device_uuid}, data);

    //batiMP.log(registerServeur + registerUrlInterface, 'URL');

    $.ajax({
        url: registerServeur + registerUrlInterface,
        data: dataToSend,
        dataType: 'json',
        crossDomain: true,
        type: "POST",
        success: onSuccess,
        error: onError
    });
    batiMP.setPushToken(token);

    if (dataToSend['put'] == 'register_push') {
        majInfoPush();
    }
}


// lors de la création de la page on met les évenement sur les boutons
$(document).bind('pagecreate', function() {

    $("#app-status-ul").parent().parent().append('<button id="hideB" style="display:none;">Cacher le Debug </button></li>');
    $("#app-status-ul").parent().parent().append('<button id="showB">Afficher le Debug </button></li>');

    $('#registerpush').bind('tap', function(event, ui){
        if (! is_device) {
            var newPush = {"titre": "Titre du message", "message": "message"};
            var newPush1 = {"titre": "No device detected", "message": "Vous devez utiliser un smartphone IOS ou Android"};
            listePush.push(newPush);
            listePush.push(newPush1);
            effaceNotifs();
            afficheNotifs(listePush);
        }

        if (is_device && (batiMP.getPushToken() == null)) {
            //batiMP.log('Button register: demande de register', 'DEBUG');
            batiMP.registerDevice("successHandler", "errorHandler", "onNotification");
        }

        var flux = $('#flux_rss').val();
        if ( is_device && flux != '') {
            //batiMP.log('Button register: demande d\'alerte' , 'DEBUG');
            registerPush(batiMP.getPushToken(), {'cmd':'add_push_alert', 'alerte_emploi':flux});
        }

        $('#registerpush').trigger('create');

    });

    $('#unregisterpush').bind('tap', function(event, ui){
        if (is_device && batiMP.getPushToken() !=  null) {
            batiMP.unRegisterDevice("successHandlerUnRegister", "errorHandlerUnRegister")
        }
    });

    $('#hideB').bind('tap', function(event, ui){
        event.preventDefault();
        $("#app-status-ul").hide();
        $('#hideB').hide();
        $('#showB').show();
    });
    $('#showB').bind('tap', function(event, ui){
        event.preventDefault();
        $("#app-status-ul").show();
        $('#hideB').show();
        $('#showB').hide();
    });

});


<!-- FIN Gestion notification -->

