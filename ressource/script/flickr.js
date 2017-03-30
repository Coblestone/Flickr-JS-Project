$(document).ready(function() {
    
    $(".icon").button({icons: {primary: "ui-icon-search"}});     

    $("#soumettre").on('click', function(event) {
        $.ajax({
            url:'http://api.flickr.com/services/feeds/photos_public.gne',
            type:'GET',
            dataType:'jsonp',
            jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback
            data:'tags= '+$('#commune').val()+'&tagmode=any&format=json',
            success:function(data){
                $("#images").html("");
                $.each(data.items, function(i,item){
                    $("<img/>").attr("src", item.media.m).appendTo("#images");
                    if ( i == $('#nb_photo').val()-1) return false; 
                });
            },
            error: function(resultat,statut,erreur){
                alert("erreur");
            },
        });
    });
});
