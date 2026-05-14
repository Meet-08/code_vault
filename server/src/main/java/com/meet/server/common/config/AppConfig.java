package com.meet.server.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    public static final long ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
    public static final long REFRESH_TOKEN_EXPIRY_SECONDS = 7 * 60 * 60 * 24;
    public static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    public static final long BANDWIDTH_LIMIT = 100;

    public static boolean COOKIE_SECURE;

    @Value("${app.env:prod}")
    public void setCookieSecure(String env) {
        COOKIE_SECURE = !"dev".equalsIgnoreCase(env);
    }

}
