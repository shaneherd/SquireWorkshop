package com.herd.squire.rest;

import com.herd.squire.models.rolls.RollRequest;
import com.herd.squire.services.RollService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/rolls")
public class RollRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @POST
    @Path("/{id}/roll")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response roll(@PathParam("id") String id, RollRequest rollRequest, @Context HttpHeaders headers) throws Exception {
        return Response.ok(RollService.roll(id, rollRequest, headers)).build();
    }
}
