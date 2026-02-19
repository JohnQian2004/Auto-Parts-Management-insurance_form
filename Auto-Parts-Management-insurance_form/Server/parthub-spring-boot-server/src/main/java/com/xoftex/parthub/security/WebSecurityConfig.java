package com.xoftex.parthub.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.xoftex.parthub.security.jwt.AuthEntryPointJwt;
import com.xoftex.parthub.security.jwt.AuthTokenFilter;
import com.xoftex.parthub.security.services.UserDetailsServiceImpl;

@Configuration
// @EnableWebSecurity
@EnableMethodSecurity
// (securedEnabled = true,
// jsr250Enabled = true,
// prePostEnabled = true) // by default
public class WebSecurityConfig { // extends WebSecurityConfigurerAdapter {

  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  // @Override
  // public void configure(AuthenticationManagerBuilder
  // authenticationManagerBuilder) throws Exception {
  // authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
  // }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());

    return authProvider;
  }

  // @Bean
  // @Override
  // public AuthenticationManager authenticationManagerBean() throws Exception {
  // return super.authenticationManagerBean();
  // }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // @Bean
  // public CorsFilter corsFilter() {
  // final UrlBasedCorsConfigurationSource source = new
  // UrlBasedCorsConfigurationSource();
  // final CorsConfiguration config = new CorsConfiguration();
  // config.addAllowedOrigin("*");
  // config.addAllowedHeader("*");
  // config.addAllowedMethod("*");
  // source.registerCorsConfiguration("/**", config);
  // return new CorsFilter(source);
  // }

  // @Override
  // protected void configure(HttpSecurity http) throws Exception {
  // http.cors().and().csrf().disable()
  // .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
  // .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
  // .authorizeRequests().antMatchers("/api/auth/**").permitAll()
  // .antMatchers("/api/test/**").permitAll()
  // .anyRequest().authenticated();
  //
  // http.addFilterBefore(authenticationJwtTokenFilter(),
  // UsernamePasswordAuthenticationFilter.class);
  // }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http.csrf(csrf -> csrf.disable())
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/resendemail/**").permitAll()
            .requestMatchers("/api/auth/activate/**").permitAll()
            .requestMatchers("/api/autoparts/**").permitAll()
            // .requestMatchers("/api/autoparts/employee/uuid/**").permitAll()
            .requestMatchers("/ws/**").permitAll()
            .requestMatchers("/api/requestparts/**").permitAll()
            .requestMatchers("/api/banners/**").permitAll()
            .requestMatchers("/api/fitments/**").permitAll()
            .requestMatchers("/api/fitments/ai/**").permitAll()
            .requestMatchers("/api/purchaseorders/**").permitAll()
            .requestMatchers("/api/purchaseordervehicles/**").permitAll()

            .requestMatchers("/api/feedbacks/**").permitAll()

            .requestMatchers("/api/images/**").permitAll()
            .requestMatchers("/api/images/**").permitAll()
            .requestMatchers("/api/companies/**").permitAll()
            .requestMatchers("/api/employees/**").permitAll()
            .requestMatchers("/api/services/**").permitAll()
            .requestMatchers("/api/jobs/**").permitAll()
            .requestMatchers("/api/overviews/**").permitAll()
            .requestMatchers("/api/customers/**").permitAll()
            .requestMatchers("/api/settings/**").permitAll()
            .requestMatchers("/api/settings/company/**").permitAll()
            // Explicitly allow receipt vehicle endpoint for insurance viewing (public access)
            // Must be before the general /api/receipts/** pattern
            .requestMatchers("/api/receipts/vehicle/*").permitAll()
            .requestMatchers("/api/receipts/vehicle/**").permitAll()
            .requestMatchers("/api/receipts/**").permitAll()
            .requestMatchers("/api/claims/**").permitAll()
            .requestMatchers("/api/insurancers/**").permitAll()
            .requestMatchers("/api/insurance/**").permitAll()
            .requestMatchers("/api/intakeways/**").permitAll()
            .requestMatchers("/api/rentals/**").permitAll()
            .requestMatchers("/api/counterinvoices/**").permitAll()
            .requestMatchers("/api/vendors/**").permitAll()
            .requestMatchers("/api/disclaimers/**").permitAll()
            .requestMatchers("/api/warranties/**").permitAll()
            .requestMatchers("/api/columninfos/**").permitAll()

            // .requestMatchers("/api/customers/**").hasAuthority("USER")
            // .requestMatchers("/api/customers/**").hasAuthority("SHOP")
            // .requestMatchers("/api/customers/**").hasAuthority("ADMIN")
            // .requestMatchers("/api/customers/**").hasAuthority("MODERATOR")
            .requestMatchers("/api/histories/**").permitAll()
            .requestMatchers("/api/statuss/**").permitAll()
            .requestMatchers("/api/locations/**").permitAll()
            .requestMatchers("/api/keylocations/**").permitAll()
            .requestMatchers("/api/paymentstatuss/**").permitAll()
            .requestMatchers("/api/jobrequesttypes/**").permitAll()
            .requestMatchers("/api/paymentmethods/**").permitAll()
            .requestMatchers("/api/payrollhistories/**").permitAll()
            .requestMatchers("/api/paymenttypes/**").permitAll()
            .requestMatchers("/api/itemtypes/**").permitAll()
            .requestMatchers("/api/doctypes/**").permitAll()
            .requestMatchers("/api/payments/**").permitAll()
            .requestMatchers("/api/notes/**").permitAll()
            .requestMatchers("/api/emailinfos/**").permitAll()
            .requestMatchers("/api/expenses/**").permitAll()
            .requestMatchers("/api/expensetypes/**").permitAll()

            .requestMatchers("/api/approvalstatuss/**").permitAll()
            .requestMatchers("/api/employeeroles/**").permitAll()
            .requestMatchers("/api/servicetypes/**").permitAll()
            .requestMatchers("/api/serviceproviders/**").permitAll()
            .requestMatchers("/api/vehicle/images/**").permitAll()
            .requestMatchers("/api/jobimages/**").permitAll()
            .requestMatchers("/api/paymentimages/**").permitAll()
            .requestMatchers("/api/expenseimages/**").permitAll()

            .requestMatchers("/api/vehicle/getImage/**").permitAll()
            .requestMatchers("/api/vehicle/getResize/**").permitAll()
            .requestMatchers("/api/vehicle/company/**").permitAll()
            .requestMatchers("/api/vehicle/company/uuid/post/**").permitAll()
            // Explicitly allow vehicle UUID search for insurance viewing (public access)
            .requestMatchers("/api/vehicles/search/vehicle/**").permitAll()
            .requestMatchers("/api/vehicles/**").permitAll()
            .requestMatchers("/api/supplements/**").permitAll()
            .requestMatchers("/api/reports/**").permitAll()

            .requestMatchers("/api/pdf/**").permitAll()
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/auth/signup3/**").permitAll()

            .requestMatchers("/api/saveditems/**").permitAll()

            .requestMatchers("/swagger-ui/**").permitAll()
            .requestMatchers("/v3/api-docs/**").permitAll()
            // .requestMatchers("/configuration/**").permitAll()
            // .requestMatchers("/swagger-resources/**").permitAll()
            // .requestMatchers("/swagger-ui.html/**").permitAll()
            // .requestMatchers("/webjars/**").permitAll()

            .requestMatchers("/actuator/**").permitAll()
            .requestMatchers("/actuator/metrics/**").permitAll()

            .requestMatchers("/api/user/**").permitAll()
            .requestMatchers("/api/user/user/lastname/page/**").permitAll()
            .requestMatchers("/api/user/search/lastname/**").permitAll()

            .requestMatchers("/api/test/**").permitAll()
            .requestMatchers("/api/getImage/**").permitAll()
            .requestMatchers("/api/getVin/**").permitAll()
            .requestMatchers("/api/getZip/**").permitAll()

            .requestMatchers("/api/getResize/**").permitAll()
            .requestMatchers("/api/repairmeuals/**").permitAll()

            // Subscription endpoints - public read operations, authenticated write
            // operations
            .requestMatchers("/api/subscription/plans").permitAll() // Get all active plans - public (for landing page)
            .requestMatchers("/api/subscription/plans/{id}").permitAll() // Get plan by ID - public
            .requestMatchers("/api/subscription/plans/all").permitAll() // Get all plans including inactive - public
            .requestMatchers("/api/subscription/plans/price/**").permitAll() // Get plans by max price - public
            .requestMatchers("/api/subscription/plans/search").permitAll() // Search plans by name - public
            .requestMatchers("/api/subscription/plans/popular").permitAll() // Get popular plans - public
            .requestMatchers("/api/subscription/plans/featured").permitAll() // Get featured plans - public
            .requestMatchers("/api/subscription/plans/duration/**").permitAll() // Get plans by duration - public
            .requestMatchers("/api/subscription/plans/trial").permitAll() // Get plans with trial - public
            .requestMatchers("/api/subscription/vendor/{vendorId}/active").permitAll() // Get active
            .requestMatchers("/api/subscription/check-stripe-subscription/**").permitAll() // Get active

            // vendor - public
            .requestMatchers("/api/subscription/vendor/{vendorId}").permitAll() // Get subscriptions by
            .requestMatchers("/api/subscription/vendor/subscriptions/plans").authenticated() // Vendor subscription
                                                                                             // plans - requires
                                                                                             // authentication
            // vendor - public
            .requestMatchers("/api/subscription/plan/**").permitAll() // Get subscriptions by plan - public
            .requestMatchers("/api/subscription/status/**").permitAll() // Get subscriptions by status -
            // public
            .requestMatchers("/api/subscription/{id}").permitAll() // Get subscription by ID - public

            // Analytics endpoints - require authentication (will be checked by
            // @PreAuthorize)
            .requestMatchers("/api/subscription/analytics/**").authenticated() // Analytics endpoints require
                                                                               // authentication

            // Payment details endpoints - require authentication (will be checked by
            // @PreAuthorize)
            .requestMatchers("/api/subscription/payment-details/**").authenticated() // Payment details endpoints
                                                                                     // require authentication
            // Subscription payments endpoints - dedicated subscription payments API
            .requestMatchers("/api/subscription/payments/**").authenticated()

            .requestMatchers("/api/subscription/**").authenticated() // All other subscription operations
                                                                     // require authentication

            .anyRequest().authenticated()

        );

    http.authenticationProvider(authenticationProvider());

    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

}
