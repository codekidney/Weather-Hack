<?php
/*
 * Endpoint simulating openweathermap.org api
 */
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/*
 * JSON Response
 */
// Good weather
echo '{"coord":{"lon":21,"lat":52.23},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":294.87,"pressure":1020,"humidity":42,"temp_min":292.59,"temp_max":299.26},"visibility":10000,"wind":{"speed":3.6,"deg":300},"clouds":{"all":0},"dt":1561710420,"sys":{"type":1,"id":1713,"message":0.0092,"country":"PL","sunrise":1561688211,"sunset":1561748476},"timezone":7200,"id":756135,"name":"Warsaw","cod":200}';
// Bad weather
// echo '{"coord":{"lon":21,"lat":52.23},"weather":[{"id":504,"main":"Rain","description":"extreme rain","icon":"10d"}],"base":"stations","main":{"temp":294.87,"pressure":1020,"humidity":42,"temp_min":292.59,"temp_max":299.26},"visibility":10000,"wind":{"speed":3.6,"deg":300},"clouds":{"all":0},"dt":1561710420,"sys":{"type":1,"id":1713,"message":0.0092,"country":"PL","sunrise":1561688211,"sunset":1561748476},"timezone":7200,"id":756135,"name":"Warsaw","cod":200}';