package com.herd.squire.rest;

import com.herd.squire.models.ListSource;
import com.herd.squire.models.characteristics.Characteristic;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.powers.PowerList;
import com.herd.squire.models.powers.SpellConfigurationList;
import com.herd.squire.models.sharing.PublishRequest;
import com.herd.squire.services.characteristics.CharacteristicService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/characteristics")
public class CharacteristicsRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @PUT
    @Path("")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createCharacteristic(Characteristic characteristic, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.createCharacteristic(characteristic, headers)).build();
    }

    @GET
    @Path("/{id}/published")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPublishedDetails(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getPublishedDetails(id, headers)).build();
    }

    @GET
    @Path("/{id}/version")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getVersionInfo(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getVersionInfo(id, headers)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response publishCharacteristic(@PathParam("id") String id, PublishRequest publishRequest, @Context HttpHeaders headers) throws Exception {
        CharacteristicService.publishCharacteristic(id, publishRequest, headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/myStuff")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addToMyStuff(@PathParam("id") String id, Characteristic characteristic, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.addToMyStuff(id, headers)).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCharacteristic(Characteristic characteristic, @Context HttpHeaders headers) throws Exception {
        CharacteristicService.updateCharacteristic(characteristic, headers);
        return Response.ok().build();
    }

    /*************************************************************************************/

    @GET
    @Path("/type/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getCharacteristics(@PathParam("type") String type, @QueryParam("includeChildren") boolean includeChildren, @QueryParam("authorOnly") boolean authorOnly, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        CharacteristicType characteristicType = CharacteristicType.valueOf(type);
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(CharacteristicService.getCharacteristics(characteristicType, includeChildren, authorOnly, listSource, headers)).build();
    }

//    @GET
//    @Path("/{id}")
//    @Produces(MediaType.APPLICATION_JSON)
//    public void getCharacteristicAsync(@PathParam("id") String id, @Context HttpHeaders headers,
//                                       @Suspended AsyncResponse asyncResponse) {
//        int userId = AuthenticationService.getUserId(headers);
//        CompletableFuture
//                .runAsync(() -> {
//                    try {
//                        Characteristic characteristic = CharacteristicService.getCharacteristic(id, userId);
//                        asyncResponse.resume(Response.ok(characteristic).build());
//                    } catch (Exception e) {
//                        asyncResponse.resume(GlobalExceptionHandler.handleException(e));
//                    }
//                });
//    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCharacteristic(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getCharacteristic(id, headers)).build();
    }

    @GET
    @Path("/{id}/traits")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCharacteristicTraits(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getCharacteristicTraits(id, headers)).build();
    }

    @GET
    @Path("/{id}/parent")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getParent(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getParent(id, headers)).build();
    }

    @GET
    @Path("/{id}/children")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getChildrenCharacteristics(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getChildrenCharacteristics(id, headers)).build();
    }

    @GET
    @Path("/{id}/children/list")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getChildrenCharacteristicDetails(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getChildrenCharacteristicList(id, headers)).build();
    }

    @GET
    @Path("/{id}/features")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFeaturesForCharacteristic(@PathParam("id") String id, @QueryParam("includeChildren") boolean includeChildren, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getFeaturesForCharacteristic(id, includeChildren, headers)).build();
    }

    @GET
    @Path("/{id}/in-use")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inUse(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.inUse(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCharacteristic(@PathParam("id") String id,
                                    @Context HttpHeaders headers) throws Exception {
        CharacteristicService.delete(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicate(@PathParam("id") String id,
                              @FormParam("name") String name,
                              @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.duplicate(id, name, headers)).build();
    }

    @GET
    @Path("/{id}/startingEquipment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStartingEquipment(@PathParam("id") String id, @QueryParam("includeParents") boolean includeParents, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getFilteredStartingEquipment(id, includeParents, headers)).build();
    }

    @PUT
    @Path("/{id}/spells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addSpells(@PathParam("id") String id, PowerList powerList, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.addSpells(id, powerList.getPowers(), headers)).build();
    }

    @GET
    @Path("/{id}/spells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSpellConfigurations(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacteristicService.getSpellConfigurations(id,headers)).build();
    }

    @PUT
    @Path("/{id}/spells/configurations")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addSpellConfigurations(@PathParam("id") String id, SpellConfigurationList configurationList, @Context HttpHeaders headers) throws Exception {
        CharacteristicService.addSpellConfigurations(id, configurationList.getConfigurations(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateSpellConfiguration(@PathParam("id") String id, SpellConfiguration spellConfiguration, @Context HttpHeaders headers) throws Exception {
        CharacteristicService.updateSpellConfiguration(id, spellConfiguration, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/spells/{spellId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteSpell(@PathParam("id") String id, @PathParam("spellId") String spellId, @Context HttpHeaders headers) throws Exception {
        CharacteristicService.deleteSpell(id, spellId, headers);
        return Response.ok().build();
    }
}
