var prevP=0,nextP=0;function _validateEmail(a){return/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(a)?!0:!1}function transfert_ami(a,b){postuler(a,b,1)}
function postuler(a,b,c){email=$("#"+b+" #email").val();if($("#"+b).valid()&&0!=$.trim(email).length&&_validateEmail(email))$("#"+a).popup("close"),id_annonce=$("#annonce #"+b+" #id_annonce").val(),a=$("#annonce #"+b+" #subject").val(),b=$("#annonce #"+b+" #message").val(),$.jStorage.set("email",email),$.jStorage.reInit(),notify("envoi en cours... patientez...","#annonce"),$.mobile.loading("show"),$.ajax({url:DIRSCRIPTS+"interface-mobile.php",data:{jsonp:1,put:"candidate-annonce",id:id_annonce,email:email,
subject:a,message:b,istransfertami:c},dataType:"jsonp",async:!0,success:function(a){$.mobile.loading("hide");"OK"==a?($("#waiting_send").popup("close"),$("#confirm_send").popup("open")):($("#waiting_send").popup("close"),$("#error_send").popup("open"));remove_notify("#annonce")},error:function(){$.mobile.loading("hide")}});else return $("#waiting_send").popup("close"),!1;return!0}
function showAnnonce(a,b){var c=a.hash.replace(/.*id=/,""),d=0;search_list_id?d=search_list_id.length:search_list_id=[];var e=search_list_id.indexOf(c.toString());prevP=0<e?search_list_id[e-1]:null;nextP=e<d-1?search_list_id[e+1]:null;d=a.hash.replace(/\?.*$/,"");e=$(d);$(d).getItem({url:DIRSCRIPTS+"interface-mobile.php",data:{jsonp:1,get:"annonce",id_annonce:c,PREVIOUS:prevP,NEXT:nextP}});b.dataUrl=a.href;$.mobile.changePage(e,b)}
function _refresh_datas(){var a=$.jStorage.get("email");a||(a="");$("#annonce #email").val(a)};var DIRSCRIPTS="http://bo.v2.batiactuemploi.com/scripts/",pageinit=!1,back_popup_hash="",use_infinite=!1,Tfonctions_search=[],Tregions_search=[],Texperiences_search=[],Tcontrats_search=[],Tregions=[],Tdepts=[],Tfonctions=[],Texperiences=[],Tcontrats=[],Limit_Annonce=200,Limit_Recherche=50,nb_results_by_page=20,current_zonegeo=[],current_fonction=[],current_metier=[],current_experience=[],current_contrat=[],current_motclef="",hash_searh_selected_to_del="",current_nb_annonce=0,last_search={},search_list_id=
[];tsearchs={};var notify=function(a,b,c){var d=$('<p style="display:none;">'+a+"</p>");$(b+" .notifications").each(function(){null==c&&(c=3E3);$(this).append(d);d.slideDown(300,function(){window.setTimeout(function(){d.slideUp(300,function(){d.remove()})},c)})})},remove_notify=function(a){$(a+" .notifications").find("p").remove()};
function pagination(a){var b=Math.ceil(current_nb_annonce/nb_results_by_page);a=Math.floor(a/nb_results_by_page);a<b?($("#recherche #pagin-next").show(),$("#recherche #pagin-next").removeClass("ui-disabled")):($("#recherche #pagin-next").hide(),$("#recherche #pagin-next").addClass("ui-disabled"));1<a?($("#recherche #pagin-prev").show(),$("#recherche #pagin-prev").removeClass("ui-disabled")):($("#recherche #pagin-prev").hide(),$("#recherche #pagin-prev").addClass("ui-disabled"));$("#recherche #pagin-pages").html(a+
"/"+b);$("#recherche .ui-select").css("display","none");$("#recherche #select-page").html("");$("#recherche #select-page").append('<option value="0">Aller \u00e0 la page</option>');for(i=1;i<=b;i++)i!=a&&$("#recherche #select-page").append('<option value="'+i+'">page '+i+"</option>");1<b&&($("#recherche #select-page").selectmenu("refresh",!0),$("#recherche .ui-select").css("display","inline"),$("#recherche #pagin-pages").css("display","inline"))}
function uncheck_cac(a,b){window["current_"+a]=[];$(".check"+a).each(function(){this.id!=b.attr("id")&&$(this).prop("checked",!1);$(this).checkboxradio().checkboxradio("refresh")});b.prop("checked")&&window["current_"+a].push(b.attr("value"))}function view_list_mes_recherches(){$("#resultat-mes-recherches").completeListMesRecherches({})}
function reset_search(a){current_zonegeo=[];current_fonction=[];current_metier=[];current_experience=[];current_contrat=[];current_motclef="";current_nb_annonce=0;$("[id^=selected-detail-page-]").text("");$("[id=recherche-detail-mot-clef]").val("");$(".check_cac").each(function(){$(this).prop("checked",!1);$(this).checkboxradio().checkboxradio("refresh")});a&&$.mobile.changePage("#recherche-detail")}
function saved_last_search(){criteres_last_search={};criteres_last_search.current_zonegeo=current_zonegeo;criteres_last_search.current_fonction=current_fonction;criteres_last_search.current_experience=current_experience;criteres_last_search.current_contrat=current_contrat;criteres_last_search.current_motclef=current_motclef;$.jStorage.set("last_search",criteres_last_search)}
function saved_search(){(tsearchs=$.jStorage.get("tsearchs"))||(tsearchs={});var a={};a.current_zonegeo=current_zonegeo;a.current_fonction=current_fonction;a.current_experience=current_experience;a.current_contrat=current_contrat;a.current_motclef=current_motclef;var b=convert_array_to_hash(a);tsearchs.hasOwnProperty(b)?$("#popupAlreadyExistsSaveSearch").popup("open"):(tsearchs[b]=a,$.jStorage.set("tsearchs",tsearchs),$("#popupSaveSearch").popup("open"))}
function convert_array_to_hash(a){var b=[];$.each(a,function(a,d){b.push(a+":"+d)});return b.join(", ").hashCode()}String.prototype.hashCode=function(){var a=0,b,c;nb=this.length;if(0==nb)return a;b=0;for(l=nb;b<l;b++)c=this.charCodeAt(b),a=(a<<5)-a+c,a|=0;return a};function gotosearch(a){load_searh_from_hash(a)?go_url_recherche():alert("erreur");return!1}
function select_del_search_from_hash(a){hash_search_selected_to_del=a;$("#confirmDeleteSearch").popup();$("#confirmDeleteSearch").popup("open",{history:!1})}function candel_del_search(){hash_search_selected_to_del=""}
function del_searh_from_hash(a){(tsearchs=$.jStorage.get("tsearchs"))||(tsearchs={});if(tsearchs.hasOwnProperty(a))return notify("Suppression...","#mes-recherches"),delete tsearchs[a],$.jStorage.set("tsearchs",tsearchs),$("#mes-recherches #resultat-mesrecherches").hide(),view_list_mes_recherches(),$("#mes-recherches #resultat-mesrecherches").show(),$("#mes-recherches").trigger("create"),!0;notify("Erreur, ce hash ne correspond pas!","#mes-recherches");return!1}
function load_searh_from_hash(a){(tsearchs=$.jStorage.get("tsearchs"))||(tsearchs={});if(tsearchs.hasOwnProperty(a))notify("Rechargement","#mes-recherches");else return notify("Erreur, ce hash ne correspond pas!","#mes-recherches"),!1;reset_search();criteres_search_current_hash=tsearchs[a];$.each(criteres_search_current_hash,function(a,c){window[a]=c});set_fields_from_current();return!0}
function set_fields_from_current(){$("[id^=selected-detail-page-]").html("");$.each(current_zonegeo,function(a){value=current_zonegeo[a];$("[cac_type=zonegeo][value="+value+"]").attr("id");$("[cac_type=zonegeo][value="+value+"]").prop("checked",!0);$("[cac_type=zonegeo][value="+value+"]").checkboxradio().checkboxradio("refresh");a=get_value_by_key(Tregions,value);$("#selected-detail-page-zonegeo").html(a)});$.each(current_fonction,function(a){value=current_fonction[a];$("[cac_type=fonction][value="+
value+"]").attr("id");$("[cac_type=fonction][value="+value+"]").prop("checked",!0);$("[cac_type=fonction][value="+value+"]").checkboxradio().checkboxradio("refresh");a=get_value_by_key(Tfonctions,value);$("#selected-detail-page-fonction").html(a)});$.each(current_contrat,function(a){value=current_contrat[a];$("[cac_type=contrat][value="+value+"]").attr("id");$("[cac_type=contrat][value="+value+"]").prop("checked",!0);$("[cac_type=contrat][value="+value+"]").checkboxradio().checkboxradio("refresh");
a=get_value_by_key(Tcontrats,value);$("#selected-detail-page-contrat").html(a)});$.each(current_experience,function(a){value=current_experience[a];$("[cac_type=experience][value="+value+"]").attr("id");$("[cac_type=experience][value="+value+"]").prop("checked",!0);$("[cac_type=experience][value="+value+"]").checkboxradio().checkboxradio("refresh");a=get_value_by_key(Texperiences,value);$("#selected-detail-page-experience").html(a)});$("#recherche-detail-mot-clef").val(current_motclef)}
function get_value_by_key(a,b){return void 0===a[b]?"":a[b]}function load_last_searh(){reset_search(!0);criteres_last_search=$.jStorage.get("last_search");$.each(criteres_last_search,function(a,b){window[a]=b});set_fields_from_current()}
function init_global(){$.ajax({url:DIRSCRIPTS+"interface-mobile.php",data:{jsonp:1,get:"zone-geo"},dataType:"jsonp",async:!1,cache:!1}).done(function(a){Tregions_search=[];var b=0;for(code in a)label=a[code],Tregions_search.push({item_value:code,item_label:label,item_index:b,type:"zonegeo"}),Tregions[code]=label,b++});$.ajax({url:DIRSCRIPTS+"interface-mobile.php",data:{jsonp:1,get:"fonction"},dataType:"jsonp",async:!1,cache:!1}).done(function(a){Tfonctions_search=[];Tfonctions=[];var b=0;for(parent in a)for(fonction in a[parent].fonction)label=
a[parent].fonction[fonction],Tfonctions_search.push({item_value:fonction,item_label:label,item_index:b,type:"fonction"}),Tfonctions[fonction]=label,b++});$.ajax({url:DIRSCRIPTS+"interface-mobile.php",data:{jsonp:1,get:"dept"},dataType:"jsonp",async:!1,cache:!1}).done(function(a){Tdepts=[];var b=0;for(code in a)label=a[code],Tdepts[code]=label,b++});load_contrats();load_experiences();initSearch();return!0}
function initSearch(){(tsearchs=$.jStorage.get("tsearchs"))||(tsearchs={});search_list_id=[];criteres_last_search=$.jStorage.get("last_search")}
function load_contrats(){$.ajax({url:DIRSCRIPTS+"interface-mobile.php",data:{jsonp:1,get:"contrat"},dataType:"jsonp",async:!1,cache:!1}).done(function(a){var b=Handlebars.compile($("#recherche-detail-tpl").html());Tcontrats_search=[];Tcontrats=[];var c=0;for(code in a)label=a[code],Tcontrats_search.push({item_value:code,item_label:label,item_index:c,type:"contrat"}),Tcontrats[code]=label,c++;$("#recherche-detail-contrat").html(b(Tcontrats_search))})}
function load_experiences(){$.ajax({url:DIRSCRIPTS+"interface-mobile.php",data:{jsonp:1,get:"experience"},dataType:"jsonp",async:!1,cache:!1}).done(function(a){var b=Handlebars.compile($("#recherche-detail-tpl").html());Texperiences_search=[];Texperiences=[];var c=0;for(code in a)label=a[code],Texperiences_search.push({item_value:code,item_label:label,item_index:c,type:"experience"}),Texperiences[code]=label,c++;$("#recherche-detail-experience").html(b(Texperiences_search))})}
function launchSearch(a,b){search_list_id=[];null==a&&(a=!1);var c=$("#recherche-detail-mot-clef").val(),d="",e="";a?($.each(current_zonegeo,function(a){""!=e&&(e+="|");e+=this}),$.each(current_fonction,function(a){""!=d&&(d+="|");d+=this})):e=$("#accueil #zone-geo").val();current_motclef=$("[id=recherche-detail-mot-clef]").val();if(b)var f=(b-1)*nb_results_by_page,g=f+nb_results_by_page;else f=parseInt($("#recherche #next").attr("data-next")),g=f+nb_results_by_page;f>Limit_Annonce?($("#recherche #next").attr("data-next",
f),g=Limit_Annonce):f>current_nb_annonce?($("#recherche #next").attr("data-next",f),g=current_nb_annonce):$("#recherche #next").attr("data-next",g);f=$("#recherche").children(":jqmData(role=content)");f.find("#nb_results").html("<br />");f.find("#pagin-prev").css("display","none");f.find("#pagin-next").css("display","none");f.find("#pagin-pages").css("display","none");$("#select-page").parents(".ui-select").css("display","none");f.find(".btn_display1").css("display","none");f.find(".btn_display2").css("display",
"none");$("#resultat-recherche").completeListItem({url:DIRSCRIPTS+"interface-mobile.php",data:{get:"search",jsonp:1,mot:c,zonegeo:e,fonction:d,metier:"",experience:"",contrat:"",length:g}});use_infinite&&$("#resultat-recherche").show();saved_last_search();return!1}function execute_search(a,b){var c=a.hash.replace(/\?.*$/,""),c=$(c);use_infinite||launchSearch(1,1);c.page();b.dataUrl=a.href;$.mobile.changePage(c,b);null==b.noLoading&&$.mobile.loading("show")}
function go_url_recherche(){$("#recherche").children(":jqmData(role=content)").find("#resultat-recherche").html("");newurl="#recherche?zone="+current_zonegeo.join("-")+"&fct="+current_experience.join("-")+current_contrat.join("-")+current_fonction.join("-")+"&motclef="+current_motclef;$.mobile.changePage(newurl);return!0}
function save_current_criteres(){0<$(".checkzonegeo").lenght&&(current_zonegeo=[],$(".checkzonegeo").each(function(a){$(this).prop("checked")&&current_zonegeo.push($(this).val())}));0<$(".checkfonction").lenght&&(current_fonction=[],$(".checkfonction").each(function(a){$(this).prop("checked")&&current_fonction.push($(this).val())}));0<$(".checkcontrat").lenght&&(current_contrat=[],$(".checkcontrat").each(function(a){$(this).prop("checked")&&current_contrat.push($(this).val())}));0<$(".checkexperience").lenght&&
(current_experience=[],$(".checkexperience").each(function(a){$(this).prop("checked")&&current_experience.push($(this).val())}));current_motclef=$("[id=recherche-detail-mot-clef]").val();return!1};(function(a){a.fn.extend({completeListMesRecherches:function(b){b=a.extend({template:"#mes-recherches-resultat-tpl",url:"fill-url-source",data:{}},b);var c=a(this),d=Handlebars.compile(a(b.template).html());null==b.noLoading&&a.mobile.loading("show");nb=Object.keys(tsearchs).length;c.html("");var e=[];a.each(tsearchs,function(a,b){var c=[];c.item_no_criteres="Recherche globale (sans crit\u00e8re)";for(k in b){""!=b[k]&&(c.item_no_criteres=null);switch(k){case "current_zonegeo":c["item_lib_"+k]=""==
b[k]?b[k]:Tregions[b[k]];break;case "current_fonction":c["item_lib_"+k]=""==b[k]?b[k]:Tfonctions[b[k]];break;case "current_experience":c["item_lib_"+k]=""==b[k]?b[k]:Texperiences[b[k]];break;case "current_contrat":c["item_lib_"+k]=""==b[k]?b[k]:Tcontrats[b[k]]}c["item_"+k]=b[k]}c.item_hash=a;e.push(c)});c.html(d(e));c.show();null==b.noLoading&&(remove_notify("#mes-recherches"),a.mobile.loading("hide"));use_infinite&&(a.waypoints(),a.waypoints("refresh"))},completeListItem:function(b){b=a.extend({template:"#recherche-resultat-tpl",
url:"fill-url-source",data:{}},b);var c=a(this),d=Handlebars.compile(a(b.template).html());null==b.noLoading&&a.mobile.loading("show");null==b.dataType&&(b.dataType="jsonp");a.ajax({url:b.url,data:b.data,dataType:b.dataType,async:!1}).done(function(e){data=e.TResults;nbTotal=e.nb;var f=[];"xml"==b.dataType?(xml=data,data=[],a("item",xml).each(function(b){b=blank.clone();b.removeAttr("id");ligne=b.html();a("*",this).each(function(b,c){k=c.tagName;v=a(c).text();"enclosure"==k&&(v=a(c).attr("url"),k=
"image");ligne=ligne.replace(RegExp("item_"+k+"","gi"),v)});b.html(ligne);b.show();c.append(b)})):(nb=data.length,a.each(data,function(a,b){var c=0<a?data[a-1].origine:null,e=a<nb-1?data[a+1].origine:null,d=[];search_list_id.push(data[a].origine.toString());for(k in b){switch(k){case "region":d["item_lib_"+k]="";var g=b[k]+"",g=g.split(",");for(j in g)""!=d["item_lib_"+k]&&(d["item_lib_"+k]+=","),d["item_lib_"+k]+=Tregions[g[j]];break;case "dept":d["item_lib_"+k]="";g=b[k]+"";g=g.split(",");for(j in g)""!=
d["item_lib_"+k]&&(d["item_lib_"+k]+=","),d["item_lib_"+k]+=Tdepts[g[j]];break;case "contrat":""==b[k]&&(b[k]="Tous contrats")}d["item_"+k]=b[k]}d.item_previous=c;d.item_next=e;f.push(d)}));current_nb_annonce=nbTotal;if(!use_infinite){var g=parseInt(a("#recherche #next").attr("data-next"));e=g-nb_results_by_page-1;0>e&&(e=0);f=f.slice(e,g-1)}c.html(d(f));e=a("#recherche").children(":jqmData(role=content)");e.find("#nb_results").removeClass("noresult");switch(nbTotal){case 0:res="Aucune offre d'emploi ne correspond \u00e0 vos crit\u00e8res";
e.find("#nb_results").addClass("noresult");break;case 1:res="1 offre d'emploi";break;case Limit_Annonce:res=nbTotal+" premi\u00e8res offres d'emploi";break;default:res=nbTotal+" offres d'emploi"}e.find("#nb_results").text(res);e.find(".btn_display1").css("display","block");nbTotal>nb_results_by_page&&e.find(".btn_display2").css("display","block");c.show();c.listview().listview("refresh");null==b.noLoading&&(remove_notify("#recherche"),a.mobile.loading("hide"));use_infinite?(a.waypoints(),a.waypoints("refresh")):
(pagination(g),a.mobile.silentScroll(0))})},getItem:function(b){b=a.extend({template:"#annonce-detail-tpl",itemtarget:"#annonce",url:"fill-url-source",data:{}},b);a(this).attr("id");var c=Handlebars.compile(a(b.template).html());a.mobile.loading("show");a.ajax({url:b.url,data:b.data,dataType:"jsonp",async:!1,success:function(d){a(b.itemtarget+" :jqmData(role=footer)").remove();a(b.itemtarget+' :jqmData(class="content_annonce")').remove();a(b.itemtarget).append(c(d));_refresh_datas();d=Handlebars.compile(a("#nav-annonce-detail-tpl").html());
Tab=[];Tab.nav=[{PREVIOUS:prevP,NEXT:nextP}];TabComplete=[];TabComplete.push(Tab);a("#annonce #nav-annonce").remove();a("#annonce").append(d(TabComplete)).trigger("pagecreate");a("#annonce").trigger("create");a.mobile.loading("hide")},error:function(){a.mobile.loading("hide")}});return this}})})(jQuery);