$(document).ready(function() {
    $.ajax({
    url:'http://api.flickr.com/services/feeds/photos_public.gne',
    type:'GET',
    dataType:'jsonp',
    jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback
    data:'tags=nantes&tagmode=any&format=json',
    success:function(data){
    $.each(data.items, function(i,item){
                $("<img/>").attr("src", item.media.m).appendTo("#images");
                if ( i == 6 ) return false; });
              },
    error: function(resultat,statut,erreur){
    alert("erreur");},
     });
});
