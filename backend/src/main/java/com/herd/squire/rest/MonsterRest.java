package com.herd.squire.rest;

import com.herd.squire.models.ListSource;
import com.herd.squire.models.creatures.battle_monsters.BattleMonsterSettings;
import com.herd.squire.models.creatures.characters.settings.CharacterSettings;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.items.ItemQuantity;
import com.herd.squire.models.items.ItemQuantityList;
import com.herd.squire.models.monsters.*;
import com.herd.squire.models.powers.PowerList;
import com.herd.squire.models.powers.SpellConfigurationList;
import com.herd.squire.models.rolls.RollRequest;
import com.herd.squire.models.sharing.PublishRequest;
import com.herd.squire.services.RollService;
import com.herd.squire.services.creatures.CreatureService;
import com.herd.squire.services.monsters.MonsterPowerService;
import com.herd.squire.services.monsters.MonsterService;
import com.herd.squire.utilities.SquireLogger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/monsters")
public class MonsterRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @PUT
    @Path("")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createMonster(Monster monster, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.createMonster(monster, headers)).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateMonster(Monster monster, @Context HttpHeaders headers) throws Exception {
        MonsterService.updateMonster(monster, headers);
        return Response.ok().build();
    }

    @GET
    @Path("")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMonsters(@QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(MonsterService.getMonsters(listSource, headers)).build();
    }

    @POST
    @Path("")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMonsters(Filters filters, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(MonsterService.getMonsters(filters, listSource, headers)).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMonster(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.getMonster(id, headers)).build();
    }

    @GET
    @Path("/{id}/summary")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMonsterSummary(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.getMonsterSummary(id, headers)).build();
    }

    @GET
    @Path("/{id}/in-use")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inUse(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.inUse(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMonster(@PathParam("id") String id,
                                  @Context HttpHeaders headers) throws Exception {
        MonsterService.delete(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicate(@PathParam("id") String id,
                              @FormParam("name") String name,
                              @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.duplicate(id, name, headers)).build();
    }

    /********************* Spells ***************************/

    @GET
    @Path("/{id}/spells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSpells(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.getSpells(id, headers)).build();
    }

    @GET
    @Path("/{id}/spells/innate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getInnateSpells(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.getInnateSpells(id, headers)).build();
    }

    @PUT
    @Path("/{id}/spells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addSpells(@PathParam("id") String id, PowerList powerList, @Context HttpHeaders headers) throws Exception {
        MonsterService.addSpells(id, powerList.getPowers(), headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/spells/innate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addInnateSpells(@PathParam("id") String id, PowerList powerList, @Context HttpHeaders headers) throws Exception {
        MonsterService.addInnateSpells(id, powerList.getPowers(), headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/spells/configurations")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addSpellConfigurations(@PathParam("id") String id, SpellConfigurationList configurationList, @Context HttpHeaders headers) throws Exception {
        MonsterService.addSpellConfigurations(id, configurationList.getConfigurations(), headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/spells/innate/configurations")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addInnateSpellConfigurations(@PathParam("id") String id, SpellConfigurationList configurationList, @Context HttpHeaders headers) throws Exception {
        MonsterService.addInnateSpellConfigurations(id, configurationList.getInnateConfigurations(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spells/innate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateInnateSpellConfiguration(@PathParam("id") String id, InnateSpellConfiguration innateSpellConfiguration, @Context HttpHeaders headers) throws Exception {
        MonsterService.updateInnateSpellConfiguration(id, innateSpellConfiguration, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/spells")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteSpell(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        MonsterService.deleteSpells(id, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/spells/innate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteInnateSpell(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        MonsterService.deleteInnateSpells(id, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/spells/{spellId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteSpell(@PathParam("id") String id, @PathParam("spellId") String spellId, @Context HttpHeaders headers) throws Exception {
        MonsterService.deleteSpell(id, spellId, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/spells/innate/{spellId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteInnateSpell(@PathParam("id") String id, @PathParam("spellId") String spellId, @Context HttpHeaders headers) throws Exception {
        MonsterService.deleteInnateSpell(id, spellId, headers);
        return Response.ok().build();
    }

    /********************* Items ***************************/

    @POST
    @Path("/{id}/items")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateItems(@PathParam("id") String id, ItemQuantityList itemList, @Context HttpHeaders headers) throws Exception {
        MonsterService.updateItems(id, itemList.getItems(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/items/{itemId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateItemQuantity(@PathParam("id") String id, @PathParam("itemId") String itemId, ItemQuantity itemQuantity, @Context HttpHeaders headers) throws Exception {
        MonsterService.updateItemQuantity(id, itemId, itemQuantity, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/items")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteItems(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        MonsterService.deleteItems(id, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/items/{itemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteItem(@PathParam("id") String id, @PathParam("itemId") String itemId, @Context HttpHeaders headers) throws Exception {
        MonsterService.deleteItem(id, itemId, null, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/items/{itemId}/{subItemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteItem(@PathParam("id") String id, @PathParam("itemId") String itemId, @PathParam("subItemId") String subItemId, @Context HttpHeaders headers) throws Exception {
        MonsterService.deleteItem(id, itemId, subItemId, headers);
        return Response.ok().build();
    }

    /********************* Sharing ***************************/

    @GET
    @Path("/{id}/published")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPublishedDetails(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.getPublishedDetails(id, headers)).build();
    }

    @GET
    @Path("/{id}/version")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getVersionInfo(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.getVersionInfo(id, headers)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response publishMonster(@PathParam("id") String id, PublishRequest publishRequest, @Context HttpHeaders headers) throws Exception {
        MonsterService.publishMonster(id, publishRequest, headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/myStuff")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addToMyStuff(@PathParam("id") String id, Monster monster, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterService.addToMyStuff(id, headers)).build();
    }

    /********************************* Monster Powers ***************************/

    @GET
    @Path("/{id}/powers/type/{type}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPowers(@PathParam("id") String id, @PathParam("type") String type, @Context HttpHeaders headers) throws Exception {
        MonsterPowerType monsterPowerType = MonsterPowerType.valueOf(type);
        return Response.ok(MonsterPowerService.getPowers(id, monsterPowerType, headers)).build();
    }

    @GET
    @Path("/powers/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPower(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterPowerService.getPower(id, headers)).build();
    }

    @PUT
    @Path("/{id}/powers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createPower(@PathParam("id") String id, MonsterPower monsterPower, @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterPowerService.createPower(id, monsterPower, headers)).build();
    }

    @PUT
    @Path("/{id}/powers/actions")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addActions(@PathParam("id") String id, MonsterActionList monsterActionList, @Context HttpHeaders headers) throws Exception {
        MonsterPowerService.addActions(id, monsterActionList, headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/powers/features")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addFeatures(@PathParam("id") String id, MonsterFeatureList monsterFeatureList, @Context HttpHeaders headers) throws Exception {
        MonsterPowerService.addFeatures(id, monsterFeatureList, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/powers/{powerId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updatePower(@PathParam("id") String id, @PathParam("powerId") String powerId, MonsterPower monsterPower, @Context HttpHeaders headers) throws Exception {
        MonsterPowerService.updatePower(id, monsterPower, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/powers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePowers(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        MonsterPowerService.deletePowers(id, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/powers/{powerId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePower(@PathParam("id") String id, @PathParam("powerId") String powerId, @Context HttpHeaders headers) throws Exception {
        MonsterPowerService.delete(powerId, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/powers/{powerId}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicatePower(@PathParam("id") String id,
                                   @PathParam("powerId") String powerId,
                                   @FormParam("name") String name,
                                   @Context HttpHeaders headers) throws Exception {
        return Response.ok(MonsterPowerService.duplicate(id, powerId, name, headers)).build();
    }

    @POST
    @Path("/{id}/roll/standard")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response roll(@PathParam("id") String id, RollRequest rollRequest, @Context HttpHeaders headers) throws Exception {
        return Response.ok(RollService.roll(id, rollRequest, headers, false)).build();
    }
}
