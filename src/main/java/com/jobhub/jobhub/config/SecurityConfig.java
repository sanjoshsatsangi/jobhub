package com.jobhub.jobhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsFilter corsFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CorsFilter corsFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsFilter = corsFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(AbstractHttpConfigurer::disable)

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                .requestMatchers(HttpMethod.POST, "/api/users")
                .permitAll()

                .requestMatchers(HttpMethod.POST, "/api/users/login")
                .permitAll()

                .requestMatchers(HttpMethod.POST, "/api/companies")
                .hasRole("RECRUITER")

                .requestMatchers(HttpMethod.DELETE, "/api/companies/*")
                .hasRole("RECRUITER")

                .requestMatchers(HttpMethod.POST, "/api/jobs")
                .hasRole("RECRUITER")

                .requestMatchers(HttpMethod.PUT, "/api/jobs/*")
                .hasRole("RECRUITER")

                .requestMatchers(HttpMethod.DELETE, "/api/jobs/*")
                .hasRole("RECRUITER")

                .requestMatchers(HttpMethod.PUT, "/api/applications/*/status")
                .hasRole("RECRUITER")

                .requestMatchers(HttpMethod.POST, "/api/applications")
                .hasRole("CANDIDATE")

                .requestMatchers(HttpMethod.POST, "/api/candidate-profile/resume")
                .hasRole("CANDIDATE")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/applications/candidate/*"
                )
                .hasAnyRole("CANDIDATE", "RECRUITER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/applications/job/*"
                )
                .hasRole("RECRUITER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/applications/*"
                )
                .hasAnyRole("CANDIDATE", "RECRUITER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/candidate-profile/resume/*"
                )
                .hasAnyRole("CANDIDATE", "RECRUITER")

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                corsFilter,
                UsernamePasswordAuthenticationFilter.class
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}