package com.codequest.discoveryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer // <-- This annotation does all the heavy lifting!
public class DiscoveryServiceApplication {
    public static void main(String[] args) {

        System.setProperty("server.port", "8761");
        System.setProperty("eureka.client.register-with-eureka", "false");
        System.setProperty("eureka.client.fetch-registry", "false");
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}