$(document).ready(function() {

    $( function() {
        $( "#tabs" ).tabs();
        $('#table_id').DataTable();
        $( "#datepicker" ).datepicker();
    });

    $("#soumettre").on('click', function(event) {
        $.ajax({
            url:'http://api.flickr.com/services/feeds/photos_public.gne',
            type:'GET',
            dataType:'jsonp',
            jsonp: 'jsoncallback',
            data:'tags= '+encodeURIComponent($('#commune').val())+'&tagmode=any&format=json',
            success:function(data){
                //Enelever les valeurs de la requête précédente si il y en a eu
                $("#images").html("");
                $('#table_id').DataTable().rows().remove()
                $('#table_id').DataTable().draw();

                //Ajouter les images à l'onglet Vue Photo
                $.each(data.items, function(i,item){
                    $("<img/>").attr({
                        src: item.media.m,
                        id: i
                    }).appendTo("#images");
                    $("<br/><br/>").appendTo("#images");
                    if ( i == $('#nb_photo').val()-1) return false; 
                });

                //Si aucune dâte de recherche n'est indiqué
                if($("#datepicker").datepicker( "getDate" )==null) {
                    //Ajouter autant de ligne que le maximum indiqué à côté de la barre de recherche
                    $.each(data.items, function(i,item){
                        var t = $('#table_id').DataTable();
                        t.row.add( [
                            '<img src="'+ item.media.m +'" />',
                            item.title,
                            decodeURIComponent(item.author.split("\"")[1]),
                            item.date_taken.split("T")[0],
                            item.date_taken.split("T")[1].split("-")[0]
                        ] ).draw( false );
                        if ( i == $('#nb_photo').val()-1) return false; 
                    });
                } else {
                    //Ajouter autant de ligne que le maximum indiqué dont la dâte correspond à la recherche
                    $.each(data.items, function(i,item){
                        var t = $('#table_id').DataTable();
                        var datePhoto = new Date(item.date_taken.split("T")[0]);
                        var dateMin = $("#datepicker").datepicker( "getDate" );
                        if(datePhoto>dateMin) {
                            t.row.add( [
                                '<img src="'+ item.media.m +'" />',
                                item.title,
                                decodeURIComponent(item.author.split("\"")[1]),
                                item.date_taken.split("T")[0],
                                item.date_taken.split("T")[1].split("-")[0]
                            ] ).draw( false );
                        }
                        if ( i == $('#nb_photo').val()-1) return false; 
                    });
                }

                //Si aucune image n'a été trouvé alors afficher un UI Dialog qui le dit.
                if($("#images").html()==""){
                    $("<div>").attr({
                        id: "dialog",
                        title: "Avertissement"
                    }).appendTo("#images");
                    $("#dialog").html("<p>Aucune photo Flick correspondante.</p>");
                    $( "#dialog" ).dialog();
                }

                //Ouvre un UI Dialog au clic d'une image de l'onglet vue photo (le dialog indique des infos de l'img)
                $("#images img").on('click', function(event) {
                    $.each(data.items, function(i,item){
                        if(item.media.m==event.target.src) {
                            $("<div>").attr({
                                id: "dialog",
                                title: "Information"
                            }).appendTo("#images");
                            $("#dialog").html("<p>Titre: "+ item.title +"</br>ID photographe: "+ decodeURIComponent(item.author.split("\"")[1]) +"<br/>Date: "+ item.date_taken.split("T")[0] +"</br>Heure: "+ item.date_taken.split("T")[1].split("-")[0] +"</p>");
                            $( "#dialog" ).dialog();
                        }
                    });
                });

                //Geolocalisation des photos
                var mapObj = new GMaps({
                    el: '#map',
                    lat: 0.0,
                    lng: 0.0,
                    zoom: 12
                });
                GMaps.geocode({
                    address: $('#commune').val(),
                    callback: function(results, status) {
                        if (status == 'OK') {
                            latlng = results[0].geometry.location;
                            mapObj.setCenter(latlng.lat(), latlng.lng());
                        } else if (status == 'ZERO_RESULTS') {
                            //alert('Sorry, no results found');
                        }
                    }
                });

                //Pour chaque photo, l'ajouter sur la carte si on trouve quelquechose à l'adresse recherchée
                $.each(data.items, function(i,item){
                    GMaps.geocode({
                        address: $('#commune').val() + item.title,
                        callback: function(results, status) {
                            if (status == 'OK') {
                                latlng = results[0].geometry.location;
                                mapObj.addMarker({
                                    lat: latlng.lat(),
                                    lng: latlng.lng()
                                });
                            } else if (status == 'ZERO_RESULTS') {
                                //alert('Sorry, no results found');
                            }
                        }
                    });
                });
            },
            error: function(resultat,statut,erreur){
                alert("erreur");
            },
        });
    });
});