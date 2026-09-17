package com.jobhub.jobhub.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class DebugCorsFilter implements Filter {

    private final CorsConfigurationSource corsConfigurationSource;

    public DebugCorsFilter(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Override
    public void doFilter(
            ServletRequest servletRequest,
            ServletResponse servletResponse,
            FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;

        String origin = request.getHeader("Origin");

        System.out.println(
                "DEBUG-CORS: " + request.getMethod() + " " + request.getRequestURI()
                + " | Origin header = [" + origin + "]"
        );

        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);

        System.out.println(
                "DEBUG-CORS: resolved CorsConfiguration = " + config
        );

        if (config != null) {
            System.out.println(
                    "DEBUG-CORS: allowedOrigins = " + config.getAllowedOrigins()
                    + " | checkOrigin(\"" + origin + "\") = " + config.checkOrigin(origin)
            );
        } else {
            System.out.println(
                    "DEBUG-CORS: NO CorsConfiguration matched for this request path!"
            );
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}