1) Install Node.js and NPM from https://nodejs.org/en/download
2) cmd: npm install for all required modules
3) cmd: ng serve --ssl true --ssl-key cert.key --ssl-cert cert.crt
 ng serve --host 0.0.0.0 --ssl true --ssl-key cert.key --ssl-cert cert.crt
 ng serve --host 0.0.0.0 --ssl true --ssl-key privkey.pem --ssl-cert fullchain.pem
 ng serve --disable-host-check --host 0.0.0.0 --ssl true --ssl-key baycounter.key --ssl-cert baycounter.crt
4) cmd: ng build 
5) cmd: docker build --no-cache -f Dockerfile_SSL -t angular-parthub_ssl .
6) cmd: docker run -d -p 443:443 --name angular-parthub_ssl angular-parthub_ssl
7) cmd: docker build --no-cache -f Dockerfile_SSL -t angular-parthub_ssl_8444 .
8) cmd: docker run -d -p 443:443 --name angular-parthub_ssl angular-parthub_ssl_8444


9) cmd: sudo docker build --no-cache -f Dockerfile_SSL -t angular-parthub_ssl .
10) cmd: sudo docker run -d  --restart unless-stopped -p 443:443 --name angular-parthub_ssl angular-parthub_ssl

set NODE_OPTIONS=--max_old_space_size=8192
