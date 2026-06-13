package com.stages_conventions.stages.conventions.security;

import com.stages_conventions.stages.conventions.serviceImpl.UserDetailsServiceImpl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Slf4j
@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Configuration de Spring Security");

        return http
                // Configuration CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Desactiver CSRF pour API REST
                .csrf(csrf -> csrf.disable())

                // Configuration des autorisations
                .authorizeHttpRequests(authorize -> authorize
                        // Endpoints publics
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**").permitAll()
                        // Tous les autres endpoints neecessitent authentification
                        .anyRequest().authenticated()
                )

                // Gestion des sessions - STATELESS pour JWT
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Ajouter le filtre JWT avant le filtre d'authentification par défaut
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }


    //  Configuration CORS pour accepter les requêtes depuis le frontend

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001",  // React
                "http://localhost:9092"    // Backend
        ));

        // methodes HTTP autorisees
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE"
        ));

        // Headers autorises
        configuration.setAllowedHeaders(Collections.singletonList("*"));

        // Headers exposes au client
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With"
        ));

        // Permettre les cookies/credentials
        configuration.setAllowCredentials(true);

        // Cache de la configuration CORS (en secondes)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        log.info("**//**CORS configuré pour les origines: {} **//**",
                String.join(", ", configuration.getAllowedOrigins()));

        return source;
    }


    // Fournisseur d'authentification DAO

    @Bean
    public AuthenticationProvider authenticationProvider() {
        log.info(" **//**Configuration du fournisseur d'authentification DAO **//**");

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsServiceImpl);

        return provider;
    }


    // Gestionnaire d'authentification

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


     //Encodeur de mots de passe BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}