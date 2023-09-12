git checkout .
rm -drf ./node_modules
git pull origin main
chmod +x ./start.sh
npm i
pm2 delete Agiles-Back
pm2 start ./server.js --name Agiles-Back
pm2 ls