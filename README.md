# booklite-services

The repository for the server side of the booklite site. The service uses NodeJs (using NestJS wrapper) microservices to handle incoming REST requests from the UI. We use a noSQL MongoDB database to store user infromation.


# Running locally

Fork and clone this repository. Run the following to start the server on http:localhost:4000
```
npm install
npm run start:dev
```

# Running in production environment

Once you have made your changes, commit and push them and then run the following:

```
npm run build
npm pack
```

You must then SSH into the ubuntu server hosting our services, and then navigate to /opt/back-end.
Here you must create a new directory of the format "YYYY-MM-DD-##" Where ## is the number of the build on that day, e.g 2020-04-30-1 for the first build on 30/4/20.
Once you have navigated into this directory, copy your .tgz file generated from npm pack into here, and run the following script: 
```
tar --extract --file booklite-services-*.tgz
cd package
npm install
npm run build
cd dist/src
sudo pm2 kill
sudo pm2 start main.js --log ../../server.log
```
The server will now be running.