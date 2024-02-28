package com.herd.squire.utilities;

import com.herd.squire.services.AuthenticationService;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class AuthenticationFilter implements ContainerRequestFilter {
    private static final String AUTHENTICATION_SCHEME = "Bearer";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (requestContext.getMethod().equals("OPTIONS")
                || (requestContext.getUriInfo().getPath().contains("authentication") && !requestContext.getUriInfo().getPath().contains("authentication/refresh"))
                || (requestContext.getUriInfo().getPath().contains("android/jwt"))
                || (requestContext.getUriInfo().getPath().contains("paddle"))) {
            return;
        }

        if (!isTokenBasedAuthentication(authorizationHeader)) {
            abortWithUnauthorized(requestContext);
            return;
        }

        String token = getToken(authorizationHeader);
        try {
            validateToken(token);
        } catch (Exception e) {
            abortWithUnauthorized(requestContext);
        }
    }

    private boolean isTokenBasedAuthentication(String authorizationHeader) {
        return authorizationHeader != null &&
                authorizationHeader.toLowerCase().startsWith(AUTHENTICATION_SCHEME.toLowerCase() + " ");
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) {
        requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
    }

    private void validateToken(String jwt) throws Exception {
        if (!AuthenticationService.isValid(jwt)){
            throw new Exception("Invalid JWT");
        }
    }

    private static String getToken(String authorizationHeader) {
        return authorizationHeader == null ? "" : authorizationHeader.substring(AUTHENTICATION_SCHEME.length()).trim();
    }

    public static String getToken(HttpHeaders headers) {
        String authorizationHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        return getToken(authorizationHeader);
    }
}
