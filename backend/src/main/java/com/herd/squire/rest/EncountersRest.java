package com.herd.squire.rest;

import com.herd.squire.models.SpeedType;
import com.herd.squire.models.campaigns.encounters.Encounter;
import com.herd.squire.models.campaigns.encounters.RoundTurn;
import com.herd.squire.services.EncounterService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/encounters")
public class EncountersRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateEncounter(Encounter encounter, @Context HttpHeaders headers) throws Exception {
        EncounterService.updateEncounter(encounter, headers);
        return Response.ok().build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEncounter(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(EncounterService.getEncounter(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteEncounter(@PathParam("id") String id,
                                   @Context HttpHeaders headers) throws Exception {
        EncounterService.deleteEncounter(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/start")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response startEncounter(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        EncounterService.startEncounter(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/continue")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response continueEncounter(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        EncounterService.continueEncounter(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/restart")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response restartEncounter(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        EncounterService.restartEncounter(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/finish")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response finishEncounter(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        EncounterService.finishEncounter(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/turn")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateTurn(@PathParam("id") String id, RoundTurn roundTurn, @Context HttpHeaders headers) throws Exception {
        EncounterService.updateTurn(id, roundTurn, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/battleCreatures/{battleCreatureId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeCreature(@PathParam("id") String id, @PathParam("battleCreatureId") String battleCreatureId,
                                    @Context HttpHeaders headers) throws Exception {
        EncounterService.removeCreature(id, battleCreatureId, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/groups/{groupId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeGroup(@PathParam("id") String id, @PathParam("groupId") String groupId,
                                   @Context HttpHeaders headers) throws Exception {
        EncounterService.removeGroup(id, groupId, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/battleCreatures/missing")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createBattleCreatures(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        EncounterService.updateBattleCreatures(id, headers);
        return Response.ok().build();
    }

    @GET
    @Path("/{id}/battleCreatures")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEncounterBattleCreatures(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(EncounterService.getEncounterBattleCreatures(id, headers)).build();
    }

    @POST
    @Path("/{id}/battleCreatures/{battleCreatureId}/speed")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBattleCreatureSpeedType(@PathParam("id") String id, @PathParam("battleCreatureId") String battleCreatureId, SpeedType speedType, @Context HttpHeaders headers) throws Exception {
        EncounterService.updateBattleCreatureSpeedType(id, battleCreatureId, speedType, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/groups/{groupId}/speed")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateGroupSpeedType(@PathParam("id") String id, @PathParam("groupId") String groupId, SpeedType speedType, @Context HttpHeaders headers) throws Exception {
        EncounterService.updateGroupSpeedType(id, groupId, speedType, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/hideKilled")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateHideKilled(@PathParam("id") String id, boolean hideKilled, @Context HttpHeaders headers) throws Exception {
        EncounterService.updateHideKilled(id, hideKilled, headers);
        return Response.ok().build();
    }
}
