<?php
$host="localhost";
// modifier les valeurs stockées dans les 3 variables ci-dessous
$database="E155859M";
$user="E155859M";
$password="E155859M";
header('Content-type: application/json');
// pour autoriser les requêtes crossdomain
header("Access-Control-Allow-Origin: *");

try{
$connexion = new PDO('mysql:host='.$host.';charset=UTF8;dbname='.$database,$user,$password);	//on se connecte a la BD
$connexion->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);	//on active la gestion des erreurs et d'exceptions



if (isset($_GET["commune"])){

$requete="SELECT CODEPAYS, CP FROM cp_autocomplete where ville='".$_GET["commune"]."';";
$statement=$connexion->prepare($requete);
$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);
$json=json_encode($results);

echo $json;
}

}
catch (PDOException $e){
echo $e;
}





?>
