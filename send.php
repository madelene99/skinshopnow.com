<?php

//$name = isset($_POST['name']) ? $_POST['name'] : 'test';
$name = $_POST['name'];
//$phone = isset($_POST['phone']) ? $_POST['phone'] : 'test';
$phone = $_POST['phone'];
$offer_id = "974";
$aff_id = "654";
$product = 'nivele_cream';
$country = '';
$aff_sub = '';
$aff_sub2 = '';
$aff_sub3 = '';
$aff_sub4 = '';
$aff_sub5 = '';
$user_ip = $_SERVER["REMOTE_ADDR"];
/*
Значения поля product  (ключ - продукт)

awaderm_eye -Awaderm Eye
awaderm - Awaderm
libo_max - Libomax
libo_max_hard - Libomax
calm_max Calmax
be_mass Bemass
iqooster Iqooster
testalot Testalot
maxize_plus Maxizeplus
maxize_plus_hard Maxizeplus
doctor_parell Dr.Parell
garcinia_bio Garcinia
nivele_cream Nivele
 */

$result_data = compact(
    "name"
    , "phone"
    , "offer_id"
    , "aff_id"
    , "product"
    , "country"
    , "aff_sub"
    , "aff_sub2"
    , "aff_sub3"
    , "aff_sub4"
    , "aff_sub5"
    , "user_ip"
);
$headers = [];

foreach(getallheaders() as $key => $value){
    $headers[] = $key.": ".$value;
}

if ($curl = curl_init()) {
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_URL, 'http://vip.demenibu.com/tracker_api?' . http_build_query($result_data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_exec($curl);
    curl_close($curl);
    header('Location: success.html');
}

 


?>