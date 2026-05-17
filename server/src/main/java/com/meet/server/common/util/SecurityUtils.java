package com.meet.server.common.util;

import com.meet.server.common.security.user.CustomUserPrincipal;
import com.meet.server.features.user.model.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static User getCurrentUser() {
        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null) {
            return null;
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof CustomUserPrincipal(User user)) {
            return user;
        }

        return null;
    }
}