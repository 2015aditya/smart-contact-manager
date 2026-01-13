# Java + Maven base image
FROM maven:3.9.6-eclipse-temurin-17

# Work directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests

# Rename jar to app.jar (IMPORTANT FIX)
RUN cp target/*.jar app.jar

# Run application
CMD ["java", "-jar", "app.jar"]
