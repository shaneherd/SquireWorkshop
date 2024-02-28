package com.herd.squire.rest;

import com.herd.squire.models.SupportRequest;
import com.herd.squire.models.user.UserSettings;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.FeatureFlagService;
import com.herd.squire.services.UserService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/user")
public class UserRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @POST
    @Path("/{id}/changePassword")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changePassword(@PathParam("id") String id,
                                   @FormParam("username") String username,
                                   @FormParam("originalPassword") String originalPassword,
                                   @FormParam("newPassword") String newPassword,
                                   @Context HttpHeaders headers) {
        try {
            AuthenticationService.authorizedToModify(headers, id);
            AuthenticationService.changePassword(username, originalPassword, newPassword);
            logger.info(username + " changed password");
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning(username + " failed to change password");
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/{id}/changeEmail")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeEmail(@PathParam("id") String id,
                                   @FormParam("password") String password,
                                   @FormParam("email") String email,
                                   @Context HttpHeaders headers) {
        try {
            int userId = AuthenticationService.getUserId(headers, id);
            AuthenticationService.changeEmail(userId, password, email);
            logger.info("changed email: " + userId);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("failed to change email: " + id);
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/{id}/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("id") String id,
                               @FormParam("password") String password,
                               @Context HttpHeaders headers) {
        try {
            int userId = AuthenticationService.getUserId(headers, id);
            if (password == null) {
                throw new Exception("Password is required");
            }
            UserService.deleteUser(userId, password);
            logger.info("user deleted: " + id);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("delete user failed: " + id);
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/{id}/restoreDefaults")
    @Produces(MediaType.APPLICATION_JSON)
    public Response restoreDefaults(@PathParam("id") String id,
                               @FormParam("password") String password,
                               @Context HttpHeaders headers) {
        try {
            int userId = AuthenticationService.getUserId(headers, id);
            if (password == null) {
                throw new Exception("Password is required");
            }
            UserService.restoreDefaults(userId, password);
            logger.info("user defaults restored: " + id);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("restore defaults failed: " + id);
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/{id}/settings/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserSettings(@PathParam("id") String id, UserSettings userSettings, @Context HttpHeaders headers) {
        try {
            int userId = AuthenticationService.getUserId(headers, id);
            UserService.updateUserSettings(userId, userSettings);
            logger.info("updated user settings: " + id);
            return Response.ok().build();
        } catch (Exception e) {
            logger.warning("failed to update user settings: " + id);
            return Response.status(Response.Status.FORBIDDEN).type("text/plain").entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/notifications")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNotifications(@Context HttpHeaders headers) throws Exception {
        return Response.ok(UserService.getNotifications(headers)).build();
    }

    @DELETE
    @Path("/notifications")
    @Produces(MediaType.APPLICATION_JSON)
    public Response acknowledgeNotifications(@Context HttpHeaders headers) throws Exception {
        UserService.acknowledgeNotifications(headers);
        return Response.ok().build();
    }

    @POST
    @Path("/support")
    @Produces(MediaType.APPLICATION_JSON)
    public Response supportRequest(SupportRequest supportRequest, @Context HttpHeaders headers) throws Exception {
        UserService.supportRequest(supportRequest, headers);
        return Response.ok().build();
    }

    @GET
    @Path("/featureFlags")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFeatureFlags() throws Exception {
        return Response.ok(FeatureFlagService.getFeatureFlags()).build();
    }
}
