/**
 * Created by david on 24/09/14.
 */

var id_page_en_cours = '';



function TrackEvent(category,action,label,value) {
    gaObj.trackEvent( function() {console.log('success');}, function() {console.log('failed');}, category, action, label, value);
}

function TrackPageView(pageurl) {
    gaObj.trackPage(function() {console.log('success');}, function() {console.log('failed');}, pageurl);
}

appFireTracker = function(){
    try {
        hash = location.hash;
        if (hash)
            pageUrl = hash.substr(1);
        else
            pageUrl = location.pathname;

        TrackPageView(pageUrl);
    }
    catch (err){}
}


var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

if ( app ) {
    // PhoneGap application
    $($(document).on('pageshow', appFireTracker));
} else {
    // Web page
    $($(document).on('pageshow', fireTracker));
}


/**
 *  Fonction pour ajouter à wreport un tag
 **/
function wrp_cpt_mobile(libelle,content){
    if(typeof(content)=='undefined' || content==null || content==undefined){
        content = '';
    }
    if(typeof(libelle) != 'undefined' && libelle !=null && libelle!=undefined){
        switch(libelle){
            case 'form-envoi-annonce-ami':
                libelle='form-envoi-annonce-ami';
                break;
            case 'form-envoi-annonce-ami-success':
                libelle='form-envoi-annonce-ami-success';
                break;
            case 'form-envoi-annonce-ami-error':
                libelle='form-envoi-annonce-ami-error';
                break;
            case 'form-auto-transfert':
                libelle='form-auto-transfert';
                break;
            case 'form-auto-transfert-success':
                libelle='form-auto-transfert-success';
                break;
            case 'form-auto-transfert-error':
                libelle='form-auto-transfert-error';
                break;
            case 'recherche':
                libelle='page-resultats-recherche';
                break;
            case 'recherche-detail':
                libelle='page-formulaire-recherche';
                break;
            case 'recherche-detail-page-fonction':
                libelle='page-liste-fonctions';
                break;
            case 'recherche-detail-page-zonegeo':
                libelle='page-liste-localisations';
                break;
            case 'recherche-detail-page-experience':
                libelle='page-liste-experiences';
                break;
            case 'recherche-detail-page-contrat':
                libelle='page-liste-contrats';
                break;
            case 'recherche':
                libelle='page-resultats-recherche';
                break;
            case 'annonce':
                libelle='pages-annonces-emploi';
                break;
            case 'recrutement':
                libelle='acces-recruteurs';
                break;
            case 'mentions-legales':
                libelle='mention-legales';
                break;
            case 'mes-recherches':
                libelle='mes-recherches';
                break
            case 'accueil':
                libelle='accueil';
                break;
            default:
                libelle='divers';
        }

        var WRP_ID= 436070;

        if(app) var WRP_SECTION='Mobile emploi';
        else var WRP_SECTION='Mobile emploi WEB';

        var WRP_SUBSECTION=libelle;
        var WRP_SECTION_GRP= WRP_ID;
        var WRP_SUBSECTION_GRP= WRP_SECTION;
        var WRP_CONTENT= content;
        var WRP_CHANNEL= '';
        var WRP_ACC;

        var w_counter = new wreport_counter(WRP_SECTION, WRP_SUBSECTION, WRP_ID, WRP_ACC, WRP_CHANNEL, WRP_SECTION_GRP, WRP_SUBSECTION_GRP);

        w_counter.add_content(WRP_CONTENT);
        w_counter.count();
    }
}

$(document).bind( "pagechange", function( e, data ) {

    hash = location.hash;
    if (hash) {
        tagpageUrl = hash.substr(1);
    }
    else {
        tagpageUrl = location.pathname.split('/').pop();
    }

    if(tagpageUrl == '/' || tagpageUrl == '' || tagpageUrl == 'index.html') {
        tagpageUrl='accueil';
    }

    switch(tagpageUrl){
        case 'annonce':
        case 'recherche':
            break;
        default:
            wrp_cpt_mobile(tagpageUrl);
    }
});


$("[data-role=page][id=annonce]").bind( "pageshow", function( e, data ) {

    if(!app){
        var historyPrev = null;

        //var historyPrev = $.mobile.urlHistory.getPrev(); // todo $.mobile.urlHistory
        if(historyPrev){
            if($('div.ui-header a.ui-btn-left[data-rel=none]').attr('data-rel')!='back'){
                setTimeout( function(){
                    var el = $('div.ui-header a.ui-btn-left[data-rel=none]');
                    el.attr('data-rel','back');
                    el.find('span.ui-btn-text').text("Retour");
                    el.attr('href','javascript:void(0);');
                }, 200 );
            }
        }else{
            //$.mobile.urlHistory.clearForward(); // todo $.mobile.urlHistory
            setTimeout( function(){
                $('div.ui-header a.ui-btn-left[data-rel=back]').find('span.ui-btn-text').text("Accueil");
                $('div.ui-header a.ui-btn-left[data-rel=back]').attr('href','#accueil');
                $('div.ui-header a.ui-btn-left[data-rel=back]').attr('data-rel','none');
            }, 200 );
        }
    }
});

$('[data-role=page]').bind('pageshow',function(){

    /* $( ".popupPanel" ).on({
         popupbeforeposition: function() {
             var h = $( window ).height();
             $( ".popupPanel" ).css( "height", h );
         }
     });
     $( "#fonctionrequired" ).on({
         popupafteropen: function(e) {
             autoclosing = setTimeout( function(){$('#fonctionrequired').popup('close');}, 3000 );
         },
         popupafterclose: function(e) {
             clearTimeout(autoclosing);
         }
     });*/

    // recup du header de la page active
    var header = $(this).find('div[data-role=header]');

    // on le place sous le header et audessus du footer
    var header_height = $(header).outerHeight();
    var panel_height = $('.ui-panel').height();
    var newPanelHeight = panel_height - header_height;

    $('.ui-panel').css({
        'top': header_height,
        'min-height': newPanelHeight
    });

    var init = $('#menu-left-panel-' + id_page_en_cours).hasClass("fromInit");

    if (init === false) {
        // on réouvre le panel
        $('#menu-left-panel-' + id_page_en_cours).panel('open');
    }
    else {
        if (window.matchMedia("(min-width: 640px)").matches) {
            // 640 et plus
            $('#menu-left-panel-' + id_page_en_cours).panel("open");

        } else {
            //moins de 640
            $('#menu-left-panel-' + id_page_en_cours).panel("close");
        }
    }
});

$('[data-role=page]').on('pagebeforeshow', function(){
    id_page_en_cours = $(this).attr('id');
    maj_panel('init');
});

function maj_panel (mode) {
    var acceptedPush = 0;

    if (is_device) {
        var testToken = batiMP.getPushToken();
        if (testToken != null) {
            acceptedPush = 1;
        }
    }

    var defaults = {
        template:'#panelMenu-tpl'
        ,url:'fill-url-source'
        ,data:{  }
    };

    var options = $.extend(defaults, options);
    var template = Handlebars.compile($(options.template).html());

    Tab = new Array({'id_page':id_page_en_cours, 'is_device': is_device, 'sendPush': !acceptedPush, 'noPush': acceptedPush });

    // existe t'il ?
    if ( $('#menu-left-panel-' + id_page_en_cours).length > 0) {
        $('#menu-left-panel-' + id_page_en_cours).remove();
    }

    // on créé le panel
    //$('#' + id_page_en_cours + ' div[data-role=header]').before(template(Tab));
    $('#' + id_page_en_cours).append(template(Tab));

    // on met à jout les objet jQery mobile
    $('#menu-left-panel-' + id_page_en_cours).panel();
    $('#menu-left-panel-' + id_page_en_cours).find('div[data-role=controlgroup]').controlgroup({ defaults: true });


    if (mode == 'init') {
        // permet de definir si l'on vient de l'init ou de l'abonnement/desabonnement push
        $('#menu-left-panel-' + id_page_en_cours).addClass("fromInit");
    }

}

$('#actu').on('pageinit', function() {
    $( "#actu" ).bind( "click", function() {
        initActu();
    });
});

$('#offre').on('pageinit', function(){
// Fonction pour supprimer les recherches perso par swippe (glissement)
    $( "#offre" ).bind( "click", function() {
        //suppression par glisse vers la droite
        $("li").bind ("swiperight", function (event)
        {
            $(this).remove();
        });
    });
});

$(document).bind('pageinit', function(event){
    //$.each(event,function(i){alert(i+":"+event[i]);});
    if(!pageinit){
        pageinit=true;
        var dfd = $.Deferred();
        dfd.done(init_global).done(function(n){
            setTimeout( function(){ $('#recherche-detail-page-fonction').trigger('pagebeforeshow'); }, 100 );
            setTimeout( function(){$('#recherche-detail-page-zonegeo').trigger('pagebeforeshow'); }, 100 );
            setTimeout( function(){$('#mes-recherches').trigger('pagebeforeshow'); }, 400 );
        }).resolve();
    }
});

$('#recherche-detail-page-zonegeo').on('pagebeforeshow', function(){
    var template = Handlebars.compile($('#recherche-detail-tpl').html());
    $('#recherche-detail-zonegeo').html(template(Tregions_search)).trigger('create');
    $('#recherche-detail-page-zonegeo .check_cac').off('click').on('click', function() {
        uncheck_cac($(this).attr('cac_type'),$(this));
        $.mobile.changePage( "#recherche-detail", { transition: "none"} );
    });
    $('#recherche-detail-page-zonegeo').page();
    set_fields_from_current();
});

$('#recherche-detail-page-fonction').on('pagebeforeshow', function(){
    var template = Handlebars.compile($('#recherche-detail-tpl').html());
    $('#recherche-detail-fonction').html(template(Tfonctions_search)).trigger('create');
    $('#recherche-detail-page-fonction .check_cac').off('click').on('click', function() {
        uncheck_cac($(this).attr('cac_type'),$(this));
        $.mobile.changePage( "#recherche-detail", { transition: "none"} );
    });
    $('#recherche-detail-page-fonction').page();
    set_fields_from_current();
});

$('#recherche-detail-page-experience').on('pagebeforeshow', function(){
    set_fields_from_current();
});

$('#recherche-detail-page-contrat').on('pagebeforeshow', function(){
    set_fields_from_current();
});

$('#recherche-detail').on('pagebeforeshow', function(){
    var nb_offres = nb_annonce +' offre';
    if(nb_annonce>1)nb_offres+='s';

    $("#nbannonce_header").text(nb_offres);
    //$.mobile.urlHistory.clearForward();
    if(current_fonction.length>0)$('[href=#recherche-detail-page-fonction] > h2').removeClass('border_red');
    if(criteres_last_search)$('#recherche-detail #last_search').show();
    if(Object.keys(tsearchs).length>0)$('#recherche-detail #link_mine_search').show();
    else $('#recherche-detail #link_mine_search').hide();
    set_fields_from_current();
});

$('#recherche-detail').on('pageshow', function(){
    $('#recherche #next').attr('data-next',0);
});

$('#recherche').on('pagecreate', function(){
    $('#nav-recherche').remove();
    var template2 = Handlebars.compile($("#nav-recherche-tpl").html());
    Tab=new Array;
    Tab['nav']=[{'SAVE':'Sauvegarder','NEW':'Nouvelle recherche'}];
    TabComplete=new Array;
    TabComplete.push(Tab);
    $('#recherche').append(template2(TabComplete)).trigger('create');

});

$("#recherche #select-page").on('change', function(event, ui){
    launchSearch(1,$(this).val());
});

$('#recherche').on('pagebeforeshow', function(){
    //$.mobile.urlHistory.clearForward();

    if(use_infinite)$('#recherche #pagin-prev').hide();
    if(use_infinite)$('#recherche #pagin-next').hide();
    if(use_infinite)$('#recherche #select-page').hide();
    if(use_infinite)$('#recherche #pagin-pages').hide();
    if(use_infinite)$( "#select-page" ).remove();

    $( "#select-page" ).parents('.ui-select').css('display', 'none');

    if(use_infinite)$('#recherche .content').waypoint('destroy');
    if(!use_infinite){
        $('#recherche #pagin-prev').unbind();
        $('#recherche #pagin-prev').bind('click', function(e){
            current = parseInt($('#recherche #next').attr('data-next'));
            if(current>nb_results_by_page){
                current = current - (2*nb_results_by_page);
                $('#recherche #next').attr('data-next',current);
                e.preventDefault();

                launchSearch(1);

                $('#resultat-recherche').listview().listview('refresh');

                $('#recherche').trigger('pagecreate');
            }

            $.mobile.silentScroll(0);
        });


        $('#recherche #pagin-next').unbind();
        $('#recherche #pagin-next').bind('click', function(e){
            current = parseInt($('#recherche #next').attr('data-next'));

            if(current<=current_nb_annonce){
                e.preventDefault();

                launchSearch(1);

                $('#resultat-recherche').listview().listview('refresh');
                $('#recherche').trigger('pagecreate');
            }

            $.mobile.silentScroll(0);
        });
        $('#recherche #next').addClass('displaynone');
    }

    if(use_infinite){
        $('#recherche #next').unbind();
        $('#recherche #next').bind('click', function(e){
            current = parseInt($('#recherche #next').attr('data-next'));
            if(current<=current_nb_annonce){
                e.preventDefault();

                launchSearch(1);

                $('#resultat-recherche').listview().listview('refresh');

                $('#recherche .content').waypoint('disable');
                $('#recherche .content').waypoint('enable');

                $('#recherche').trigger('pagecreate');
            }
            current = parseInt($('#recherche #next').attr('data-next'));

        });
    }
});

$('#recherche').on('pageshow', function(){
    if(use_infinite)$( "#select-page" ).remove();
    if(use_infinite)$( "#select-page" ).parents('.ui-select').css('display', 'none');
    if(!use_infinite){
        var pages = Math.ceil(current_nb_annonce / nb_results_by_page);
        if(pages>1){
            $("#recherche #select-page").selectmenu().selectmenu('refresh', true);
            $('#recherche .ui-select').css('display','inline');
            $("#recherche #pagin-pages").css('display','inline');
        }
    }

    if(use_infinite){
        current = parseInt($('#recherche #next').attr('data-next'));

        if(current_nb_annonce >= current){

            $('#recherche .content').waypoint(function(direction) {

                if (direction === 'down'){
                    $('#recherche #next').trigger('click');
                }
            }, { offset: 'bottom-in-view' } );
        }

    }
});
/*
$('#annonce').on( "pagebeforeshow", function() {
    $('#annonce :jqmData(class="content_annonce")').remove();
});
*/
$('#annonce').on( "pageshow", function() {
    $('.ui-page-active').trigger('create');
    $( '#popupPostuler' ).on({
        popupafteropen: function(event, ui) {
            $('#btn_postuler').unbind();
            $('#btn_postuler').bind('click', function(e){
                setTimeout( function(){ $( '#waiting_send' ).popup( 'open' , {history:false}) }, 200 );
            });
        }
    });
    $( '#popupTransfertAmi' ).on({
        popupafteropen: function(event, ui) {
            $('#btn_transfert_ami').unbind();
            $('#btn_transfert_ami').bind('click', function(e){
                setTimeout( function(){ $( '#waiting_send' ).popup( 'open' , {history:false}) }, 200 );
            });
        }
    });
    $( '#confirm_send' ).on({
        popupafteropen: function(event, ui) {
            $('#back_to_results').unbind();
            $( '#back_to_results').bind('click', function(e){
                $.mobile.changePage( '#recherche') ;
            });
            $('#back_new_search').unbind();
            $( '#back_new_search').bind('click', function(e){
                setTimeout( function(){ $( '#confirm_send' ).popup( 'close');reset_search(1); }, 300 );
            });
        }
    });
    $( '#confirm_send_ami' ).on({
        popupafteropen: function(event, ui) {
            $('#back_to_results_ami').unbind();
            $( '#back_to_results_ami').bind('click', function(e){
                $.mobile.changePage( '#recherche') ;
            });
            $('#back_new_search_ami').unbind();
            $( '#back_new_search_ami').bind('click', function(e){
                setTimeout( function(){ $( '#confirm_send_ami' ).popup( 'close');reset_search(1); }, 300 );
            });
        }
    });
});

$('#mes-recherches').on('pagecreate', function(){
    $('#confirm_delete_searh').bind('click',function(){
        del_searh_from_hash(hash_search_selected_to_del);
    });
    $('#cancel_delete_searh').bind('click',function(){
        candel_del_search();
    });
});

$('#mes-recherches').on('pagebeforechange', function(){
    $('#mes-recherches #resultat-mesrecherches').hide();
});

$('#mes-recherches').on('pagebeforeshow', function(){
    $('#recherche #next').attr('data-next',0);
    view_list_mes_recherches();
    $('#mes-recherches #resultat-mesrecherches').show();
    $('#mes-recherches').page();
});

$('#mentions-legales').bind('pageshow', function(){
    if(is_device){
        $('#mentions-legales div[data-role=content] .ui-body ').addClass('bg_is_device');
    }
});

$(document).bind( "pagebeforechange", function( e, data ) {
    var u = $.mobile.path.parseUrl( data.toPage );
    set_fields_from_current();
    if ( typeof data.toPage === "string" ) {

        // recherche.
        var re = /^#recherche\?/;
        var re2 = /^#recherche-\?/;
        if ( u.hash.search(re) !== -1 && u.hash.search(re2) === -1) {

            wrp_cpt_mobile('recherche',get_current_search_wreport(1));

            console.log("execute_search");

            execute_search( u, data.options );

            console.log("FIN execute_search");

            e.preventDefault();
        }

        // annonce.
        var re = /^#annonce/;
        if ( u.hash.search(re) !== -1 ) {

            var re = /(?:.*id={1})+(\d+)(.*)/g;
            re.exec(data.toPage);
            if (RegExp.$1 !='') {
                var id_annonce = RegExp.$1;
            }

            wrp_cpt_mobile('annonce',id_annonce);


            back_popup_hash = u['hash'];
            showAnnonce( u, data.options );

            e.preventDefault();
        }
    }
});

$('#annonce').on('pagecreate', function(){

 var footer = $('#template-page div[data-role=footer]');
 $('div[data-role=page]').append(footer);

 });
$('#accueil').on('pagebeforecreate', function(){
    //var footer = $('#template-page div[data-role="footer"]');
    //$('div[id!="annonce"][id!="recherche"][data-role="page"]').append(footer);
});

$('#accueil').on('pagebeforeshow', function(){
    $("#nbannonce_cent_inf").text(nb_annonce_cent_inf);
});

// à voir pour ajouter en dynamique le footer
/*
 $(document).ready(function()
 {
 var sHtml = "";
 sHtml = '<div data-role="navbar">' +
 '<ul>' +
 '<li><a href="#recherche-detail" data-icon="search">Recherche</a></li>' +
 '<li><a href="#actu" data-icon="grid">Actualités</a></li>' +
 '<li><a href="#offre" data-icon="check">Mes alertes</a></li>' +
 '</ul>' +
 '</div>';
 $("#idFooter").html(sHtml);*/

/*$(document).on('pagechange',function(){
 console.log( $.mobile.urlHistory.stack );
 console.log(window.history);
 });	*/

$(document).on("pageshow", "#annonce", function() {
    $("#formpopup_Postuler").validate({

        rules: {
            email: {
                required: true,
                email: true
            }

        },
        messages: {
            required: "Le champ adresse e-mail est obligatoire.",
            email: "Veuillez saisir une adresse e-mail valide."
        },

        errorPlacement: function(error, element) {
            var id = element.attr("id");
            switch(id){
                case 'email':
                    error.insertAfter('#formpopup_Postuler .email_label');
                    break;

                default:
                    error.insertBefore(element);
            }
        }

    });
    $("#formpopup_TransfertAmi").validate({

        rules: {
            email: {
                required: true,
                email: true
            }

        },
        messages: {
            required: "Le champ adresse e-mail est obligatoire.",
            email: "Veuillez saisir une adresse e-mail valide."
        },

        errorPlacement: function(error, element) {
            var id = element.attr("id");
            switch(id){
                case 'email':
                    error.insertAfter('#formpopup_TransfertAmi .email_label');
                    break;

                default:
                    error.insertBefore(element);
            }
        }

    });
});




/*=========================  DEBUG  ====================================*/

function echo() {
    //  discuss at: http://phpjs.org/functions/echo/
    // original by: Philip Peterson
    // improved by: echo is bad
    // improved by: Nate
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Der Simon (http://innerdom.sourceforge.net/)
    // bugfixed by: Eugene Bulkin (http://doubleaw.com/)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: EdorFaus
    //    input by: JB
    //        note: If browsers start to support DOM Level 3 Load and Save (parsing/serializing),
    //        note: we wouldn't need any such long code (even most of the code below). See
    //        note: link below for a cross-browser implementation in JavaScript. HTML5 might
    //        note: possibly support DOMParser, but that is not presently a standard.
    //        note: Although innerHTML is widely used and may become standard as of HTML5, it is also not ideal for
    //        note: use with a temporary holder before appending to the DOM (as is our last resort below),
    //        note: since it may not work in an XML context
    //        note: Using innerHTML to directly add to the BODY is very dangerous because it will
    //        note: break all pre-existing references to HTMLElements.
    //   example 1: echo('<div><p>abc</p><p>abc</p></div>');
    //   returns 1: undefined

    var isNode = typeof module !== 'undefined' && module.exports && typeof global !== "undefined" && {}.toString.call(
            global) == '[object global]';
    if (isNode) {
        var args = Array.prototype.slice.call(arguments);
        return console.log(args.join(' '));
    }

    var arg = '';
    var argc = arguments.length;
    var argv = arguments;
    var i = 0;
    var holder, win = this.window;
    var d = win.document;
    var ns_xhtml = 'http://www.w3.org/1999/xhtml';
    // If we're in a XUL context
    var ns_xul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

    var stringToDOM = function (str, parent, ns, container) {
        var extraNSs = '';
        if (ns === ns_xul) {
            extraNSs = ' xmlns:html="' + ns_xhtml + '"';
        }
        var stringContainer = '<' + container + ' xmlns="' + ns + '"' + extraNSs + '>' + str + '</' + container + '>';
        var dils = win.DOMImplementationLS;
        var dp = win.DOMParser;
        var ax = win.ActiveXObject;
        if (dils && dils.createLSInput && dils.createLSParser) {
            // Follows the DOM 3 Load and Save standard, but not
            // implemented in browsers at present; HTML5 is to standardize on innerHTML, but not for XML (though
            // possibly will also standardize with DOMParser); in the meantime, to ensure fullest browser support, could
            // attach http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.js (see http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.xhtml for a simple test file)
            var lsInput = dils.createLSInput();
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            lsInput.stringData = stringContainer;
            // synchronous, no schema type
            var lsParser = dils.createLSParser(1, null);
            return lsParser.parse(lsInput)
                .firstChild;
        } else if (dp) {
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            try {
                var fc = new dp()
                    .parseFromString(stringContainer, 'text/xml');
                if (fc && fc.documentElement && fc.documentElement.localName !== 'parsererror' && fc.documentElement.namespaceURI !==
                    'http://www.mozilla.org/newlayout/xml/parsererror.xml') {
                    return fc.documentElement.firstChild;
                }
                // If there's a parsing error, we just continue on
            } catch (e) {
                // If there's a parsing error, we just continue on
            }
        } else if (ax) {
            // We don't bother with a holder in Explorer as it doesn't support namespaces
            var axo = new ax('MSXML2.DOMDocument');
            axo.loadXML(str);
            return axo.documentElement;
        }
        /*else if (win.XMLHttpRequest) {
         // Supposed to work in older Safari
         var req = new win.XMLHttpRequest;
         req.open('GET', 'data:application/xml;charset=utf-8,'+encodeURIComponent(str), false);
         if (req.overrideMimeType) {
         req.overrideMimeType('application/xml');
         }
         req.send(null);
         return req.responseXML;
         }*/
        // Document fragment did not work with innerHTML, so we create a temporary element holder
        // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
        //if (d.createElementNS && (d.contentType && d.contentType !== 'text/html')) {
        // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways)
        if (d.createElementNS && // Browser supports the method
            (d.documentElement.namespaceURI || // We can use if the document is using a namespace
            d.documentElement.nodeName.toLowerCase() !== 'html' || // We know it's not HTML4 or less, if the tag is not HTML (even if the root namespace is null)
            (d.contentType && d.contentType !== 'text/html') // We know it's not regular HTML4 or less if this is Mozilla (only browser supporting the attribute) and the content type is something other than text/html; other HTML5 roots (like svg) still have a namespace
            )) {
            // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways); last test is for the sake of being in a pure XML document
            holder = d.createElementNS(ns, container);
        } else {
            // Document fragment did not work with innerHTML
            holder = d.createElement(container);
        }
        holder.innerHTML = str;
        while (holder.firstChild) {
            parent.appendChild(holder.firstChild);
        }
        return false;
        // throw 'Your browser does not support DOM parsing as required by echo()';
    };

    var ieFix = function (node) {
        if (node.nodeType === 1) {
            var newNode = d.createElement(node.nodeName);
            var i, len;
            if (node.attributes && node.attributes.length > 0) {
                for (i = 0, len = node.attributes.length; i < len; i++) {
                    newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            }
            if (node.childNodes && node.childNodes.length > 0) {
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    newNode.appendChild(ieFix(node.childNodes[i]));
                }
            }
            return newNode;
        } else {
            return d.createTextNode(node.nodeValue);
        }
    };

    var replacer = function (s, m1, m2) {
        // We assume for now that embedded variables do not have dollar sign; to add a dollar sign, you currently must use {$$var} (We might change this, however.)
        // Doesn't cover all cases yet: see http://php.net/manual/en/language.types.string.php#language.types.string.syntax.double
        if (m1 !== '\\') {
            return m1 + eval(m2);
        } else {
            return s;
        }
    };

    this.php_js = this.php_js || {};
    var phpjs = this.php_js;
    var ini = phpjs.ini;
    var obs = phpjs.obs;
    for (i = 0; i < argc; i++) {
        arg = argv[i];
        if (ini && ini['phpjs.echo_embedded_vars']) {
            arg = arg.replace(/(.?)\{?\$(\w*?\}|\w*)/g, replacer);
        }

        if (!phpjs.flushing && obs && obs.length) {
            // If flushing we output, but otherwise presence of a buffer means caching output
            obs[obs.length - 1].buffer += arg;
            continue;
        }

        if (d.appendChild) {
            if (d.body) {
                if (win.navigator.appName === 'Microsoft Internet Explorer') {
                    // We unfortunately cannot use feature detection, since this is an IE bug with cloneNode nodes being appended
                    d.body.appendChild(stringToDOM(ieFix(arg)));
                } else {
                    var unappendedLeft = stringToDOM(arg, d.body, ns_xhtml, 'div')
                        .cloneNode(true); // We will not actually append the div tag (just using for providing XHTML namespace by default)
                    if (unappendedLeft) {
                        d.body.appendChild(unappendedLeft);
                    }
                }
            } else {
                // We will not actually append the description tag (just using for providing XUL namespace by default)
                d.documentElement.appendChild(stringToDOM(arg, d.documentElement, ns_xul, 'description'));
            }
        } else if (d.write) {
            d.write(arg);
        } else {
            console.log(arg);
        }
    }
}

function print_r(array, return_val) {
    //  discuss at: http://phpjs.org/functions/print_r/
    // original by: Michael White (http://getsprink.com)
    // improved by: Ben Bryan
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Brett Zamir (http://brett-zamir.me)
    //  depends on: echo
    //   example 1: print_r(1, true);
    //   returns 1: 1

    var output = '',
        pad_char = ' ',
        pad_val = 4,
        d = this.window.document,
        getFuncName = function (fn) {
            var name = (/\W*function\s+([\w\$]+)\s*\(/)
                .exec(fn);
            if (!name) {
                return '(Anonymous)';
            }
            return name[1];
        };
    repeat_char = function (len, pad_char) {
        var str = '';
        for (var i = 0; i < len; i++) {
            str += pad_char;
        }
        return str;
    };
    formatArray = function (obj, cur_depth, pad_val, pad_char) {
        if (cur_depth > 0) {
            cur_depth++;
        }

        var base_pad = repeat_char(pad_val * cur_depth, pad_char);
        var thick_pad = repeat_char(pad_val * (cur_depth + 1), pad_char);
        var str = '';

        if (typeof obj === 'object' && obj !== null && obj.constructor && getFuncName(obj.constructor) !==
            'PHPJS_Resource') {
            str += 'Array\n' + base_pad + '(\n';
            for (var key in obj) {
                if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
                    str += thick_pad + '[' + key + '] => ' + formatArray(obj[key], cur_depth + 1, pad_val, pad_char);
                } else {
                    str += thick_pad + '[' + key + '] => ' + obj[key] + '\n';
                }
            }
            str += base_pad + ')\n';
        } else if (obj === null || obj === undefined) {
            str = '';
        } else {
            // for our "resource" class
            str = obj.toString();
        }

        return str;
    };

    output = formatArray(array, 0, pad_val, pad_char);

    if (return_val !== true) {
        if (d.body) {
            this.echo(output);
        } else {
            try {
                // We're in XUL, so appending as plain text won't work; trigger an error out of XUL
                d = XULDocument;
                this.echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">' + output + '</pre>');
            } catch (e) {
                // Outputting as plain text may work in some plain XML
                this.echo(output);
            }
        }
        return true;
    }
    return output;
}