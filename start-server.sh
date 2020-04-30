# Script to start backend node.Js server
tar --extract --file booklite-services-*.tgz
cd package
npm install
npm run build
cd dist/src
sudo pm2 kill
sudo pm2 start main.js --log ../../server.log