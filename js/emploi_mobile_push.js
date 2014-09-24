
// nom de l'application
var appliName = '';

// version de l'application
var appliVersion = '';

// serveur d'enregistrement
var registerServeur ='';

// url d'enregistrement
var registerUrlInterface ='';

// module batiMobilePush, à initialiser seulement dans la fonction deviceReady ou deviceIsReady
var batiMP = null;

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

    batiMP.log(typeof result, 'DEBUG');


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
    if (typeof payload.title != 'undefined') {
        title = payload.title;
    }

    var alerte = '';
    if (typeof payload.alerte != 'undefined') {
        alerte = payload.alerte;
    }

    var message = '';
    if (payload.alert) {
        message = payload.alert;
    }

    var data = {"alerte" : alerte};

    createPushItem(title, message, data);
}

/******    ANDROID     *******/
// callback success sur enregistrement client android
function successHandlerAndroid(result) {
    batiMP.log('successHandlerAndroid', 'DEBUG');
}
// callback error sur enregistrement client android
function errorHandlerAndroid(error) {
    batiMP.log('errorHandlerAndroid', 'ERROR');
}
// callback les des notification par GCM notifications, on recoit les messages et le token par cette fonction
function onNotificationAndroid(e) {

    batiMP.log('Evenement : ' + e.event, 'DEBUG');

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

    var data = '';
    if (typeof payload.data != 'undefined') {
        data = payload.data;
    }

    var message = '';
    if (typeof payload.message != 'undefined') {
        message = payload.message;
    }

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
    batiMP.setDebug(true, "div[data-role=content]");
    batiMP.log("applel devise ready", 'DEBUG');

    // info pour les webservices
    appliName = 'EmploiBatiactuMobile';
    appliVersion = '1.1.0';

    //dev
    registerServeur = '192.168.3.103';
    registerUrlInterface = '/backoffice/scripts/interface.php';

    // prod
    //registerServeur = 'recherche.batiactu.com';
    //registerUrlInterface = '/push/scripts/interface.php';

    is_ios = batiMP.is_ios();
    is_android = batiMP.is_android();

    // on affiche les push si présents (on peut créer des pseudo push d'info en static)
    listePush = batiMP.getAllNotifications();
    if (listePush.length > 0 ) {
        afficheNotifs(listePush);
    }

    batiMP.log("register IOS", 'DEBUG IOS');

    majInfoPush() ;
    var pushToken = batiMP.getPushToken();

    batiMP.log(pushToken, 'DEBUG');
    // si le token est présent, la personne à demandé les push et on s'enregistre pour affecter les différentd callBack
    if (pushToken != '' && pushToken != null) {
        try {
            // les callbash seront suffixé par le nom de l'OS (ios / android)
            batiMP.registerDevice("successHandler", "errorHandler", "onNotification");
        }
        catch (err) {
            batiMP.log(err.message, 'ERROR');
        }
    }
}


/* ================================================================================================================= */
/****
 *
 * Création des notifications à afficher
 *
 *
 *
 */

// création, stockage et affichage d'une notification pour l'appli
function createPushItem(title, message, data) {
    var newPush = {"titre": title, "message": message};

    batiMP.addNotification(newPush);

    effaceNotifs();
    afficheNotifs(batiMP.getAllNotifications());
}

function afficheNotifs(listeNotifs) {
    var i = 0;
    // la derniere notif en haut
    for (i=listeNotifs.length-1; i>= 0; i--) {
        $('#notifPush').append('<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-b"><h3>' + listeNotifs[i].titre + '</h3></div><div class="ui-body ui-body-b"><p>' + listeNotifs[i].message + '</p></div></div>');
    }
}

function effaceNotifs() {
    $('#notifPush').html('');
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

    if (pushToken != '' && pushToken != null) {
        $('#idcheckPush').show();
    }
    else {
        $('#idcheckPush').hide();
    }
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
        alert('Une erreur est survenu');
    }
}

function onError(err){
    batiMP.log('Erreur Ajax', 'DEBUG');
}

// gestion de la désactivation des notification (désabonnement + supp token)
function unRegisterPush() {
    var token = batiMP.getPushToken();
    if (token != null) {
        $.ajax({
            url: 'http://' + registerServeur + registerUrlInterface,
            data: {'appli':appliName, 'ver': appliVersion, 'cmd':'unregister_push','token':token},
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
    dataToSend = merge_options ({'appli': appliName, 'ver': appliVersion, 'mode': 'register_push', 'token': token, 'uuid':device_uuid}, data);

    batiMP.log('http://' + registerServeur + registerUrlInterface, 'URL');

    $.ajax({
        url: 'http://' + registerServeur + registerUrlInterface,
        data: dataToSend,
        type: "POST",
        dataType: 'json',
        crossDomain: true,
        success: onSuccess,
        error: onError
    });
    batiMP.setPushToken(token);
    majInfoPush();
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
            batiMP.log('Button register: demande de register', 'DEBUG');
            batiMP.registerDevice("successHandler", "errorHandler", "onNotification");
        }

        var flux = $('#flux_rss').val();
        if ( is_device && flux != '') {
            batiMP.log('Button register: demande d\'alerte' , 'DEBUG');
            registerPush(batiMP.getPushToken(), {'cmd':'add_push_alert', 'alerte_emploi':flux});
        }
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
