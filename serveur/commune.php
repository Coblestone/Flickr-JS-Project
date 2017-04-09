<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
class AutoCompletionCPVille {
	public $CodePostal;
	public $Ville;
}


//Initialisation de la liste
$list = array();

//Connexion MySQL
try
// remplacer par vos identifiants, la Bd est disponible dans l'archive serveur.tar.gz du TP ajax
{
    $db = new PDO('mysql:host=localhost;dbname=E155859M', 'E155859M', 'E155859M');
    $db->exec("SET CHARACTER SET utf8");
}
catch (Exception $ex)
{
    echo $ex->getMessage();
}
//Construction de la requete
$strQuery = "SELECT DISTINCT VILLE Ville FROM cp_autocomplete WHERE ";
if (isset($_GET["commune"]))
{
    $strQuery .= "VILLE LIKE :ville ";
}
//Limite
if (isset($_GET["maxRows"]))
{
    $strQuery .= "LIMIT 0, :maxRows";
}
$query = $db->prepare($strQuery);
if (isset($_GET["commune"]))

{
    $value = $_GET["commune"]."%";
    $query->bindParam(":ville", $value, PDO::PARAM_STR);
}
//Limite
if (isset($_GET["maxRows"]))
{
    $valueRows = intval($_GET["maxRows"]);
    $query->bindParam(":maxRows", $valueRows, PDO::PARAM_INT);
}

$query->execute();

$list = $query->fetchAll(PDO::FETCH_CLASS, "AutoCompletionCPVille");;

echo json_encode($list);
?>
