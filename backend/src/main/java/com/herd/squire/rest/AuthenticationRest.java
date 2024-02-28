package com.herd.squire.rest;

import com.herd.squire.models.AuthenticationResponse;
import com.herd.squire.models.user.User;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.UserService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/authentication")
public class AuthenticationRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(@FormParam("username") String username, @FormParam("password") String password, @FormParam("email") String email) {
        try {
            AuthenticationService.createUser(username, password, email);
            logger.info("created user: " + username);
            return Response.ok().build();
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("Duplicate entry")) {
                message = "Username already in use";
            }
            logger.warning("failed to create user: " + username);
            return Response.status(Response.Status.BAD_REQUEST).type("text/plain").entity(message).build();
        }
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@FormParam("username") String username, @FormParam("password") String password) {
        try {
            User user = AuthenticationService.authenticate(username, password);
            UserService.successfulLogin(username);
            String jwt = AuthenticationService.getJWT(user);
            logger.info(username + " logged in");
            return Response.ok(new AuthenticationResponse(jwt, user.getLastLogin(), user.getNumFailedLogins(), user)).build();
        } catch (Exception e) {
            logger.warning(username + " failed log in");
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/adminLogin")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response adminLogin(@FormParam("adminUsername") String adminUsername, @FormParam("password") String password, @FormParam("username") String username) {
        try {
            User adminUser = AuthenticationService.authenticate(adminUsername, password);
            if (!adminUser.isAdmin()) {
                return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity("User is not an admin").build();
            }
            User user = UserService.getUser(username);
            if (!user.getUserSettings().isAllowAdminAccess()) {
                return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity("User revoked access").build();
            }
            UserService.successfulLogin(username);
            String jwt = AuthenticationService.getJWT(String.valueOf(user.getId()), String.valueOf(adminUser.getId()));
            logger.info("admin login: " + adminUsername + " as user: " + username);
            return Response.ok(new AuthenticationResponse(jwt, user.getLastLogin(), user.getNumFailedLogins(), user)).build();
        } catch (Exception e) {
            logger.info("admin login failed: " + adminUsername + " as user: " + username);
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/resetPassword")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(@FormParam("resetToken") String resetToken,
                                  @FormParam("newPassword") String newPassword) {
        try {
            String username = AuthenticationService.resetPassword(resetToken, newPassword);
            logger.info("password reset: " + username);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("password reset failed");
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/forgotUsername")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response forgotUsername(@FormParam("email") String email) {
        try {
            AuthenticationService.forgotUsername(email);
            logger.info("forgot username: " + email);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("forgot username failed: " + email);
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/forgotPassword")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response forgotPassword(@FormParam("email") String email) {
        try {
            AuthenticationService.forgotPassword(email);
            logger.info("forgot password: " + email);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("forgot password failed: " + email);
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/verifyEmail")
    @Produces(MediaType.APPLICATION_JSON)
    public Response verifyEmail(@QueryParam("verifyToken") String verifyToken) {
        try {
            String username = AuthenticationService.verifyUserEmail(verifyToken);
            logger.info("email verified: " + username);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("failed to verify email");
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/unlockAccount")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unlockAccount(@FormParam("unlockToken") String unlockToken) {
        try {
            String username = AuthenticationService.unlockAccount(unlockToken);
            logger.info("account unlocked: " + username);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("failed to unlock account");
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/refresh")
    @Produces(MediaType.APPLICATION_JSON)
    public Response refreshToken(@Context HttpHeaders headers) {
        try {
            String jwt = AuthenticationService.refreshJWT(headers);
            return Response.ok(new AuthenticationResponse(jwt)).build();
        } catch (Exception e) {
            logger.warning("failed to refresh token");
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }
}
