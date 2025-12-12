FROM openjdk:17
VOLUME /tmp
EXPOSE 8443
ARG JAR_FILE=target/Autoparts-jenkins-integration.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

# C:\Program Files (x86)\Java\jre1.8.0_421\bin\
# keytool -genkeypair -alias parthut -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore parthut.p12 -validity 3650
# openssl pkcs12 -export -out parthut.p12 -inkey key.pem -in cert.pem
#COPY parthut.p12 $JAVA_HOME/jre/lib/security/
#RUN keytool -keystore $JAVA_HOME/jre/lib/security/cacerts -storepass Erikandrew2! -noprompt -trustcacerts -importcert -alias springbootsrv_https -file $JAVA_HOME/jre/lib/security/parthut.p12
