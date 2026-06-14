package com.fullstack;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@EnableWebMvc
@Log4j2
@OpenAPIDefinition(
		info = @Info(title = "Online Banking Application", version = "1.0", description = "Online Banking Application using Spring Boot 3"),
		servers = @Server(description = "Local Tomcat 10", url = "http://localhost:8080"))
@SecurityScheme(name = "Bearer Auth", description = "Provide JWT Token", scheme = "Bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
public class OnlineBankingSystemApplication implements WebMvcConfigurer {

	private static final HashSet<String> TRUSTED_SOURCES = new HashSet<>();

	static {
		TRUSTED_SOURCES.add("http://localhost:3000");
	}

	// method to add trusted sources via application context
	public static void setTrustedSources(final Set<String> sources) {
		TRUSTED_SOURCES.addAll(sources);
	}

	public static void main(String[] args) {
		SpringApplication.run(OnlineBankingSystemApplication.class, args);
	}


	@Override
	public void addCorsMappings(CorsRegistry registry) {
		log.info(TRUSTED_SOURCES.toString());
		int accessControlMaxAge = 12 * 60 * 60;

		registry.addMapping("/**")
				.allowedOrigins("http://localhost:3000")
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
				.allowedHeaders("origin", "content-type", "accept", "authorization", "user-agent", "host",
						"X-Forwarded-For", "X-Forwarded-Proto", "X-Forwarded-Port", "X-Redirected-Path",
						"X-Redirected-Params", "X-TraceId", "X-Feature-Flags", "X-Partner-Id")
				.exposedHeaders("Content-Length", "Content-Type", "Content-Disposition", "Cache-Control")
				.allowCredentials(true).maxAge(accessControlMaxAge);

	}

}
