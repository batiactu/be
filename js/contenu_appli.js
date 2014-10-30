/**
 * Created by david on 24/09/14.
 */

var id_page_en_cours = '';

// supp debug
Batilog.setDebug(false);
$("#notif-push-alerte").hide();


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

    if (Batilog.onDebug()) {
        Batilog.log('$(document).bind( "pagechange"');
        Batilog.log(e);
        Batilog.log(data);
    }

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

    if (Batilog.onDebug()) {
        Batilog.log('$("[data-role=page][id=annonce]").bind( "pageshow"');
        Batilog.log(e);
        Batilog.log(data);
    }

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

    if (Batilog.onDebug()) {
        Batilog.log('$("[data-role=page]").bind("pageshow"');
    }

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


    if (id_page_en_cours != 'accueil') {
        $('#notif-push-alerte').hide();
    }

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

    if (Batilog.onDebug()) {
        Batilog.log("$('[data-role=page]').on('pagebeforeshow'");
    }

    id_page_en_cours = $(this).attr('id');
    //console.log(id_page_en_cours);
    maj_panel('init');
});

function maj_panel (mode) {
    var acceptedPush = 0;

    var is_debug = 0;


    if (id_page_en_cours != "" && id_page_en_cours.substr(0,6) == 'dialog') {
            return;
    }

    is_debug =  Batilog.onDebug();

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

    Tab = new Array({'id_page':id_page_en_cours, 'is_device': is_device, 'sendPush': !acceptedPush, 'noPush': acceptedPush, 'is_debug': is_debug });

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

    if (Batilog.onDebug()) {
        Batilog.log("('#actu').on('pageinit'");
    }

    $( "#actu" ).bind( "click", function() {
        initActu();
    });
});

$('#offre').on('pageinit', function(){
    if (Batilog.onDebug()) {
        Batilog.log("$('#offre').on('pageinit'");
    }
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

    if (Batilog.onDebug()) {
        Batilog.log("$(document).bind('pageinit'");
        Batilog.log(event);
    }

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

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche-detail-page-zonegeo').on('pagebeforeshow'");
    }

    var template = Handlebars.compile($('#recherche-detail-tpl').html());
    $('#recherche-detail-zonegeo').html(template(Tregions_search)).trigger('create');
    $('#recherche-detail-page-zonegeo .check_cac').off('click').on('click', function() {
        uncheck_cac($(this).attr('cac_type'),$(this));
        // on change de page direct
       // $.mobile.changePage( "#recherche-detail", { transition: "none"} );
    });
    $('#recherche-detail-page-zonegeo').page();
    set_fields_from_current();
});

$('#recherche-detail-page-fonction').on('pagebeforeshow', function(){
    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche-detail-page-fonction').on('pagebeforeshow'");
    }

    var template = Handlebars.compile($('#recherche-detail-tpl').html());
    $('#recherche-detail-fonction').html(template(Tfonctions_search)).trigger('create');
    $('#recherche-detail-page-fonction .check_cac').off('click').on('click', function() {
        uncheck_cac($(this).attr('cac_type'),$(this));
        // on change de page direct
        //$.mobile.changePage( "#recherche-detail", { transition: "none"} );
    });
    $('#recherche-detail-page-fonction').page();
    set_fields_from_current();
});

$('#recherche-detail-page-experience').on('pagebeforeshow', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche-detail-page-experience').on('pagebeforeshow'");
        Batilog.log(e);
        Batilog.log(data);
    }

    set_fields_from_current();
});

$('#recherche-detail-page-contrat').on('pagebeforeshow', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche-detail-page-contrat').on('pagebeforeshow'");
    }

    set_fields_from_current();
});

$('#recherche-detail').on('pagebeforeshow', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche-detail').on('pagebeforeshow'");
    }

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

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche-detail').on('pageshow'");
    }

    $('#recherche #next').attr('data-next',0);
});

$('#recherche').on('pagecreate', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche').on('pagecreate'");
    }

    $('#nav-recherche').remove();
    var template2 = Handlebars.compile($("#nav-recherche-tpl").html());
    Tab=new Array;
    Tab['nav']=[{'SAVE':'Sauvegarder','NEW':'Nouvelle recherche'}];
    TabComplete=new Array;
    TabComplete.push(Tab);
    $('#recherche').append(template2(TabComplete)).trigger('create');

});

$("#recherche #select-page").on('change', function(event, ui){

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche #select-page').on('change'");
        Batilog.log(event);
        Batilog.log(ui);
    }

    launchSearch(1,$(this).val());
});

$('#recherche').on('pagebeforeshow', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche').on('pagebeforeshow'");
    }

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

    if (Batilog.onDebug()) {
        Batilog.log("$('#recherche').on('pageshow'");
    }

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
$('#annonce').on( 'pageshow', function() {

    if (Batilog.onDebug()) {
        Batilog.log("$('#annonce').on( 'pageshow'");
    }

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

    if (Batilog.onDebug()) {
        Batilog.log("$('#mes-recherches').on('pagecreate'");
    }

    $('#confirm_delete_searh').bind('click',function(){
        del_searh_from_hash(hash_search_selected_to_del);
    });
    $('#cancel_delete_searh').bind('click',function(){
        candel_del_search();
    });
});

$('#mes-recherches').on('pagebeforechange', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#mes-recherches').on('pagebeforechange'");
    }

    $('#mes-recherches #resultat-mesrecherches').hide();
});

$('#mes-recherches').on('pagebeforeshow', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#mes-recherches').on('pagebeforeshow'");
    }

    $('#recherche #next').attr('data-next',0);
    view_list_mes_recherches();

    $('#mes-recherches #resultat-mesrecherches').show();
    $('#mes-recherches').page();

    $(".mr_icon_delete").buttonMarkup();
    $('.mes-recherches-lance > a').buttonMarkup();

    $('.push-flip-switch').flipswitch({corners: true});
    $('.push-flip-switch').change(function(){

        // recupération du hash
        var current_hash = $(this).data('hash');

        var newValue = switch_alert_from_search(this, current_hash);

    });


});

$('#mentions-legales').bind('pageshow', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#mentions-legales').bind('pageshow'");
    }

    if(is_device){
        $('#mentions-legales div[data-role=content] .ui-body ').addClass('bg_is_device');
    }
});

$(document).bind( "pagebeforechange", function( e, data ) {

    if (Batilog.onDebug()) {
        Batilog.log('$(document).bind( "pagebeforechange"');
        Batilog.log(e);
        Batilog.log(data);
    }

    var u = $.mobile.path.parseUrl( data.toPage );
    set_fields_from_current();
    if ( typeof data.toPage === "string" ) {

        // recherche.
        var re = /^#recherche\?/;
        var re2 = /^#recherche-\?/;
        if ( u.hash.search(re) !== -1 && u.hash.search(re2) === -1) {

            wrp_cpt_mobile('recherche',get_current_search_wreport(1));

            execute_search( u, data.options );

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

    if (Batilog.onDebug()) {
        Batilog.log("$('#annonce').on('pagecreate'");
    }

 var footer = $('#template-page div[data-role=footer]');
 $('div[data-role=page]').append(footer);

 });

$('#accueil').on('pagebeforecreate', function(i, event){

    if (Batilog.onDebug()) {
        Batilog.log("$('#accueil').on('pagebeforecreate'");
        Batilog.log(i);
        Batilog.log(event);
    }
    //var footer = $('#template-page div[data-role="footer"]');
    //$('div[id!="annonce"][id!="recherche"][data-role="page"]').append(footer);

});

$('#accueil').on('pagebeforeshow', function(){

    if (Batilog.onDebug()) {
        Batilog.log("$('#accueil').on('pagebeforeshow'");
    }

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

    if (Batilog.onDebug()) {
        Batilog.log('$(document).on("pageshow"');
    }

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

