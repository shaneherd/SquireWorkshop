package com.herd.squire.rest;

import com.herd.squire.models.ListSource;
import com.herd.squire.models.characteristics.CharacteristicList;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.powers.Power;
import com.herd.squire.models.powers.PowerList;
import com.herd.squire.models.powers.PowerType;
import com.herd.squire.models.sharing.PublishRequest;
import com.herd.squire.services.characteristics.CharacteristicService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/powers")
public class PowersRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @PUT
    @Path("")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createPower(Power power, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.createPower(power, headers)).build();
    }

    @GET
    @Path("/{id}/published")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPublishedDetails(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.getPublishedDetails(id, headers)).build();
    }

    @GET
    @Path("/{id}/version")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getVersionInfo(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.getVersionInfo(id, headers)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response publishPower(@PathParam("id") String id, PublishRequest publishRequest, @Context HttpHeaders headers) throws Exception {
        PowerService.publishPower(id, publishRequest, headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/myStuff")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addToMyStuff(@PathParam("id") String id, Power power, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.addToMyStuff(id, headers)).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updatePower(Power power, @Context HttpHeaders headers) throws Exception {
        PowerService.updatePower(power, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/type/FEATURE")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFeatures(Filters filters, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(PowerService.getPowers(PowerType.FEATURE, listSource, filters, headers)).build();
    }

    @POST
    @Path("/type/SPELL")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSpells(Filters filters, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(PowerService.getSpells(listSource, filters, headers)).build();
    }

    @GET
    @Path("/type/FEATURE")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFeatures(@QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(PowerService.getPowers(PowerType.FEATURE, listSource, headers)).build();
    }

    @GET
    @Path("/type/FEATURE/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFeaturesByCharacteristicType(@PathParam("type") String type, @Context HttpHeaders headers) throws Exception {
        CharacteristicType characteristicType = CharacteristicType.valueOf(type);
        return Response.ok(PowerService.getFeaturesByCharacteristicType(characteristicType, headers)).build();
    }

    @GET
    @Path("/type/SPELL")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSpells(@QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(PowerService.getSpells(listSource, headers)).build();
    }

    @POST
    @Path("/type/FEATURE/details")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFeaturePowerList(PowerList powerList, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.getFeaturePowerList(powerList, headers)).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPower(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.getPower(id, headers)).build();
    }

    @GET
    @Path("/{id}/in-use")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inUse(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.inUse(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePower(@PathParam("id") String id,
                               @Context HttpHeaders headers) throws Exception {
        PowerService.delete(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicate(@PathParam("id") String id,
                              @FormParam("name") String name,
                              @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.duplicate(id, name, headers)).build();
    }

    @PUT
    @Path("/{id}/classes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response assignClasses(@PathParam("id") String id, CharacteristicList characteristicList, @Context HttpHeaders headers) throws Exception {
        PowerService.assignClasses(id, characteristicList.getCharacteristics(), headers);
        return Response.ok().build();
    }

    @GET
    @Path("/{id}/classes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getClasses(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(PowerService.getClasses(id,headers)).build();
    }

    @DELETE
    @Path("/{id}/classes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response removeClasses(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        PowerService.removeClasses(id, headers);
        return Response.ok().build();
    }
}
