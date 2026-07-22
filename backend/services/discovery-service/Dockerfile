FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY pom.xml .

RUN apt-get update \
    && apt-get install -y maven \
    && rm -rf /var/lib/apt/lists/*

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "target/discovery-service-0.0.1-SNAPSHOT.jar"]