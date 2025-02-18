package com.acornshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AcornshopApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcornshopApplication.class, args);
		System.out.println("!!!!::::" + org.hibernate.Version.getVersionString());

	}

}
