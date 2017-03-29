$(document).ready(function() {
	$("#bouton").click(function() { 
		$.ajax({
			url: '../serveur/codePostal.php',
			type: 'GET',
			dataType: 'json',
			data: 'commune='+$('#commune').val(),//$_GET['nom'] au niveau serveur

			success: function(data) {
				if(data.length > 0) {
					$.each(data, function(i, item) {
						$("<li>" + item.CP + "</li>").appendTo('ul');
				    });
				} else {
					$('ul').append("La commune n'est pas dans notre base de donnee.");
				}
			},
		 
			error: function() { 
				window.alert("error");
			}
			
		});  
	});
});
