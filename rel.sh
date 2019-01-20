composer install --prefer-source --no-interaction --ignore-platform-reqs
npm install
gulp
composer run compile
git checkout module/API/autoload_classmap.php
git checkout module/Application/autoload_classmap.php
git checkout module/Bom/autoload_classmap.php
git checkout module/FabuleTest/autoload_classmap.php
git checkout module/FabuleUser/autoload_classmap.php
git checkout module/FabuleUserOAuth2/autoload_classmap.php
 
composer run drop-db -- --force
composer run create-db
