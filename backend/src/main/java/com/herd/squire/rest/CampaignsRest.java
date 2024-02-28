package com.herd.squire.rest;

import com.herd.squire.models.campaigns.Campaign;
import com.herd.squire.models.campaigns.settings.CampaignSettings;
import com.herd.squire.models.campaigns.encounters.Encounter;
import com.herd.squire.services.CampaignService;
import com.herd.squire.services.EncounterService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/campaigns")
public class CampaignsRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @PUT
    @Path("")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createCampaign(Campaign campaign, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CampaignService.createCampaign(campaign, headers)).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCampaign(Campaign campaign, @Context HttpHeaders headers) throws Exception {
        CampaignService.updateCampaign(campaign, headers);
        return Response.ok().build();
    }

    @GET
    @Path("")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getCampaigns(@Context HttpHeaders headers) throws Exception {
        return Response.ok(CampaignService.getCampaigns(headers)).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCampaign(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CampaignService.getCampaign(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCampaign(@PathParam("id") String id,
                                    @Context HttpHeaders headers) throws Exception {
        CampaignService.deleteCampaign(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicateCampaign(@PathParam("id") String id,
                              @FormParam("name") String name,
                              @Context HttpHeaders headers) throws Exception {
        return Response.ok(CampaignService.duplicateCampaign(id, name, headers)).build();
    }

    @DELETE
    @Path("/{id}/characters/{characterId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeCharacterFromCampaign(@PathParam("id") String id, @PathParam("characterId") String characterId, @Context HttpHeaders headers) throws Exception {
        CampaignService.removeCharacterFromCampaign(id, characterId, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/refreshToken")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response leaveCampaign(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CampaignService.refreshToken(id, headers)).build();
    }

    @PUT
    @Path("/{id}/encounters")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createEncounter(@PathParam("id") String id, Encounter encounter, @Context HttpHeaders headers) throws Exception {
        return Response.ok(EncounterService.createEncounter(id, encounter, headers)).build();
    }

    @GET
    @Path("/{id}/encounters")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getEncounters(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(EncounterService.getEncounters(id, headers)).build();
    }

    @POST
    @Path("/{id}/encounters/{encounterId}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicateEncounter(@PathParam("id") String id,
                                       @PathParam("encounterId") String encounterId,
                                       @FormParam("name") String name,
                                       @Context HttpHeaders headers) throws Exception {
        return Response.ok(EncounterService.duplicateEncounter(id, encounterId, name, headers)).build();
    }

    @POST
    @Path("/{id}/settings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateSettings(@PathParam("id") String id, CampaignSettings settings, @Context HttpHeaders headers) throws Exception {
        CampaignService.updateSettings(id, settings, headers);
        return Response.ok().build();
    }
}
