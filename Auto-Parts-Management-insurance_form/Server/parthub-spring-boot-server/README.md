Springboot-MariaDb-REST API

Please install:

1) MariaDb 11.2 and HeidiSQL 12.5 (part of mariadb)
2) Papercut free SMTP server https://github.com/ChangemakerStudios/Papercut-SMTP/releases

setup:

1) configure: in application.properties

    image.path=C:\\Projects\\images\\test_image_
    image.root.path=C:\\Projects\\images\\

    and make sure have s sub directory called 500 in which resized images are stored

2)  in application.properties

    spring.datasource.url= jdbc:mysql://localhost:3306/testdbjwt?useSSL=false
    spring.datasource.username= root
    spring.datasource.password= test


    whenever in application.properties
    spring.jpa.hibernate.ddl-auto= create 

    and change back to after first run

    spring.jpa.hibernate.ddl-auto= update 

3) need to run the following in your SQL Client 

    INSERT INTO roles(name) VALUES('ROLE_USER');
    INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
    INSERT INTO roles(name) VALUES('ROLE_ADMIN');
    INSERT INTO roles(name) VALUES('ROLE_SHOP');
    INSERT INTO roles(name) VALUES('ROLE_RECYCLER');

4) import data for zipcodes from csv file called: US Zip Codes from 2013 Government Data


API Docs:

http://localhost:8080/swagger-ui/index.html#/

Acurator:

http://localhost:8080/actuator/metrics
http://localhost:8080/actuator/metrics/http.server.requests


Dcoker Build/Run:

maven install
docker build -f Dockerfile -t springbootsrv .
docker run -p 8080:8080 springbootsrv

spring.datasource.url= jdbc:mysql://host.docker.internal:3306/testdbjwt?useSSL=false

image.path=/var/tmp/test_image_
image.root.path=/var/tmp/

mount local drive to container:

docker build -f Dockerfile -t springbootsrv_https_8443 .
docker run -v C:/Projects/images:/var/tmp -p 8443:8443 springbootsrv_https_8443

docker build -f Dockerfile -t springbootsrv_https_8444 .
docker run -v C:/Projects/images:/var/tmp -p 8444:8444 springbootsrv_https_8444

GRANT ALL PRIVILEGES ON testdbjwt.* TO 'root'@'172.17.0.2' IDENTIFIED BY 'test';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON testdbjwt.* TO 'root'@'172.17.0.3' IDENTIFIED BY 'test';
FLUSH PRIVILEGES;

docker build -f Dockerfile -t springbootsrv_https_8443 .
sudo docker run  -v /home/rauf2000/partslinks/images:/var/tmp --add-host=host.docker.internal:host-gateway -p 8443:8443 springbootsrv_https_8443

sudo docker run -d  --restart unless-stopped -v /home/rauf2000/partslinks/images:/var/tmp --add-host=host.docker.internal:host-gateway -p 8443:8443 springbootsrv_https_8443

docker run -v C:/Projects/images:/var/tmp -p 8080:8080 springbootsrv  


GRANT ALL PRIVILEGES ON testdbjwt.* TO 'root'@'172.17.0.2' IDENTIFIED BY 'test';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON testdbjwt.* TO 'root'@'172.17.0.3' IDENTIFIED BY 'test';
FLUSH PRIVILEGES;

docker build -f Dockerfile -t springbootsrv_https_8443 .
sudo docker run  -v /home/rauf2000/partslinks/images:/var/tmp --add-host=host.docker.internal:host-gateway -p 8443:8443 springbootsrv_https_8443

sudo docker run -d -v /home/rauf2000/partslinks/images:/var/tmp --add-host=host.docker.internal:host-gateway -p 8443:8443 springbootsrv_https_8443

then can run by the container once exit out of cmd

To Do:

1) add UUID to ImageModel instead of id for security
2) add size to ImageModel for reporting 

Testing build 1.4

openssl pkcs12 -export -out parthut.p12 -inkey key.pem -in cert.pem

openssl pkcs12 -export \
  -in baycounter.crt \
  -inkey baycounter.key \
  -out baycounter.p12 \
  -name baycounter