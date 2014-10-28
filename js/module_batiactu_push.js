// création de l'objet batiactuMobilePush
var batiactuMobilePush = function() {
    this.listePush = [];
    this.registerSuffix = 1;
    this.unRegisterSuffix = 1;
    this.senderID = '';
    this.token = '';

    this.pushNotification =  null;
    if (typeof window.plugins.pushNotification != 'undefined') {
        this.pushNotification =  window.plugins.pushNotification;
    }

    // pour avoir des log (utilise un id d'un div)
    this.genLog = false;
    this.divLog = "#debugPush";
};

// gestion du debug ou pas : affichage des messages et ou les afficher
batiactuMobilePush.prototype.setDebug = function(debug, divLog) {
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

batiactuMobilePush.prototype.onDebug = function() {
    return this.genLog;
}

// retourne la liste des "notifications", c'est simplement une liste d'objet
batiactuMobilePush.prototype.getAllNotifications = function() {
    return this.listePush;
};

batiactuMobilePush.prototype.addNotification = function(notif) {
    this.listePush.push(notif);
    // stockage en localstorage
};

batiactuMobilePush.prototype.is_platform =  function (platformToCheck) {
    var plateform = device.platform;
    if (plateform.toLowerCase() == platformToCheck) {
        if (this.genLog) {
            this.log('Plateforme ' + platformToCheck ,'DEBUG');
        }
        return true;
    }
    return false;
};

batiactuMobilePush.prototype.is_android = function () {
    return this.is_platform("android");
};

batiactuMobilePush.prototype.is_ios = function () {
    return this.is_platform("ios")
};

batiactuMobilePush.prototype.setPushToken = function (token) {
    if (this.genLog) {
        this.log('Store token','DEBUG');
    }
    localStorage.setItem("pushToken", token);
}

batiactuMobilePush.prototype.getPushToken = function () {
    var token = localStorage.getItem("pushToken");

    if (typeof token == 'undefined' || token == '') {
        return null;
    }
    return token;
}

/**
 * permet d'enregister le device Android et associer la fonction aux evenements recus
 */
batiactuMobilePush.prototype.registerDeviceAndroid = function (callBackSuccessHandler, callBackErrorHandler, stringCallBackNotification) {
    callBackSuccessHandler = window[callBackSuccessHandler];
    callBackErrorHandler = window[callBackErrorHandler];

    if (typeof callBackSuccessHandler != 'function') {
        console.log('callBackSuccessHandler pas une fonction ');
    }
    if (typeof callBackErrorHandler != 'function') {
        console.log('callBackErrorHandler pas une fonction ');
    }
    if (this.genLog) {
        this.log('Plugin Register Android, senderID : ' +  this.senderID + ' appel function : ' + stringCallBackNotification ,'DEBUG');
    }

    this.pushNotification.register(callBackSuccessHandler, callBackErrorHandler, {
        "senderID": this.senderID, // id projet android
        "ecb": stringCallBackNotification
    });
}

/**
 * permet d'enregister le device IOS et associer la fonction aux evenements recus
 */
batiactuMobilePush.prototype.registerDeviceIos = function (callBackSuccessHandler, callBackErrorHandler, stringCallBackNotification) {
    callBackSuccessHandler = window[callBackSuccessHandler];
    callBackErrorHandler = window[callBackErrorHandler];
    if (this.genLog) {
        this.log('Plugin Register IOS','DEBUG');
    }
    this.pushNotification.register(callBackSuccessHandler, callBackErrorHandler, {
        "badge": "true",
        "sound": "true",
        "alert": "true",
        "ecb": stringCallBackNotification
    });
}

batiactuMobilePush.prototype.registerDevice = function (callBackSuccessHandler, callBackErrorHandler, callBackNotification) {
    if (this.is_android()) {
        if (this.registerSuffix) {
            callBackSuccessHandler = callBackSuccessHandler + 'Android';
            callBackErrorHandler = callBackErrorHandler + 'Android';
            callBackNotification = callBackNotification + 'Android';
        }
        if (this.genLog) {
            this.log('Register Android ','DEBUG');
        }
        this.registerDeviceAndroid(callBackSuccessHandler, callBackErrorHandler, callBackNotification);
        if (this.genLog) {
            this.log('FIN Register Android','DEBUG');
        }
    }
    else if (this.is_ios()) {
        if (this.registerSuffix) {
            callBackSuccessHandler = callBackSuccessHandler + 'IOS';
            callBackErrorHandler = callBackErrorHandler + 'IOS';
            callBackNotification = callBackNotification + 'IOS';
        }
        if (this.genLog) {
            this.log('Register IOS','DEBUG');
        }
        this.registerDeviceIos(callBackSuccessHandler, callBackErrorHandler, callBackNotification);
    }
}

batiactuMobilePush.prototype.unRegisterDevice = function (callBackSuccessHandlerUnRegister, callBackErrorHandlerUnRegister) {
    if (this.is_android()) {
        if (this.unRegisterSuffix) {
            callBackSuccessHandlerUnRegister = callBackSuccessHandlerUnRegister + 'Android';
            callBackErrorHandlerUnRegister = callBackErrorHandlerUnRegister + 'Android';
        }
        callBackSuccessHandlerUnRegister = window[callBackSuccessHandlerUnRegister];
        callBackErrorHandlerUnRegister = window[callBackErrorHandlerUnRegister];
        if (this.genLog) {
            this.log('Unregister Android','DEBUG');
        }
        this.pushNotification.unregister(callBackSuccessHandlerUnRegister, callBackErrorHandlerUnRegister);
    }
    else if (this.is_ios()){
        if (this.unRegisterSuffix) {
            callBackSuccessHandlerUnRegister = callBackSuccessHandlerUnRegister + 'IOS';
            callBackErrorHandlerUnRegister = callBackErrorHandlerUnRegister + 'IOS';
        }
        callBackSuccessHandlerUnRegister = window[callBackSuccessHandlerUnRegister];
        callBackErrorHandlerUnRegister = window[callBackErrorHandlerUnRegister];

        if (this.genLog) {
            this.log('Unregister IOS','DEBUG');
        }
        this.pushNotification.unregister(callBackSuccessHandlerUnRegister, callBackErrorHandlerUnRegister);
    }
}

batiactuMobilePush.prototype.log = function (message, code_erreur) {
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
            $(this.divLog).append('<li>' + code_erreur + ' : ' + 'OBJET(' + time + randomnumber + ') : Voir console' + '</li>');
            console.log(code_erreur + '(' + time + randomnumber + ')');
            console.log(message);
        }

    }
}
