#!/bin/bash

#Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
#Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen
#See LICENSE.txt for full information.

#PSU Capstone
#	The purpouse of this script is to aid in the first time setup of the THINGS API
#	The user will be prompted to enter database information
#	Additionally a TLS/SSL Certificate will be created and self signed.



#implement this:

#first lets create the configuration directory structure
mkdir -p ./conf/db
mkdir -p ./conf/ssl

#prompt the user for the database information.
echo "Please enter your database information"
echo "username: "
read pguser
echo "database: "
read pgdatabase
echo "password: "
read pgpassword
echo "hostname: "
read pghost
echo "port: "
read pgport

#write the dbinfo.js file
cat <<EOF > ./conf/db/dbinfo.js
exports.config={
  user: '$pguser',
  database: '$pgdatabse',
  password: '$pgpassword',
  host: '$pghost',
  port: $pgport,
  max: 10,
  idleTimeoutMillis: 30000
};
EOF

#Create SSL Certificate
cd ./conf/ssl
echo "Please enter the information for your server ssl certificate when prompted"
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
rm server.csr
chmod 600 ./*
cd ../../

#create a random key for signing Json web tokens
dd if=/dev/urandom of=./conf/jwtSecret.key bs=256 count=1

#next install dependencies
npm install
