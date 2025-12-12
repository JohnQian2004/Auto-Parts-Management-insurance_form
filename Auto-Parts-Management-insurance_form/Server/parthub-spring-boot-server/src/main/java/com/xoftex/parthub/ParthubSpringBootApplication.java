package com.xoftex.parthub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ParthubSpringBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(ParthubSpringBootApplication.class, args);
	}

	// @Bean
	// public WebMvcConfigurer corsConfigurer() {

	// 	return new WebMvcConfigurer() {
	// 		@Override
	// 		public void addCorsMappings(CorsRegistry registry) {
	// 			registry.addMapping("/**")
	// 					.allowedOrigins("*");
	// 		}
	// 	};
	// }
}
