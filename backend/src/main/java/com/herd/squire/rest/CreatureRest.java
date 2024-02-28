package com.herd.squire.rest;

import com.herd.squire.models.*;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.creatures.*;
import com.herd.squire.models.creatures.battle_monsters.BattleMonsterSettings;
import com.herd.squire.models.creatures.characters.*;
import com.herd.squire.models.creatures.characters.character_validation.CharacterValidationResponse;
import com.herd.squire.models.creatures.characters.settings.CharacterSettings;
import com.herd.squire.models.damages.DamageModifierType;
import com.herd.squire.models.filters.FilterType;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.powers.PowerTagList;
import com.herd.squire.models.powers.PowerType;
import com.herd.squire.models.proficiency.Proficiency;
import com.herd.squire.models.rolls.AttackDamageRollRequest;
import com.herd.squire.models.rolls.RollRequest;
import com.herd.squire.models.sharing.PublishRequest;
import com.herd.squire.models.sorts.SortType;
import com.herd.squire.models.sorts.Sorts;
import com.herd.squire.services.RollService;
import com.herd.squire.services.creatures.CompanionService;
import com.herd.squire.services.creatures.CreatureItemService;
import com.herd.squire.services.creatures.CreatureService;
import com.herd.squire.services.creatures.characters.CharacterService;
import com.herd.squire.utilities.SquireLogger;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/creatures")
public class CreatureRest {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    @PUT
    @Path("")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response createCreature(Creature creature, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.createCreature(creature, headers)).build();
    }

    @PUT
    @Path("/{id}/companions/{companionId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addCompanionToCreature(@PathParam("id") String id, @PathParam("companionId") String companionId, @Context HttpHeaders headers) throws Exception {
        CompanionService.addCompanionToCharacter(id, companionId, headers);
        return Response.ok().build();
    }

    @GET
    @Path("/{id}/published")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPublishedDetails(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getPublishedDetails(id, headers)).build();
    }

    @GET
    @Path("/{id}/in-use")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inUse(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.inUse(id, headers)).build();
    }

    @GET
    @Path("/{id}/version")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getVersionInfo(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getVersionInfo(id, headers)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response publishCreature(@PathParam("id") String id, PublishRequest publishRequest, @Context HttpHeaders headers) throws Exception {
        CreatureService.publishCreature(id, publishRequest, headers);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}/myStuff")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addToMyStuff(@PathParam("id") String id, Creature creature, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.addToMyStuff(id, headers)).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCreature(Creature creature, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreature(creature, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/pageOrder")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updatePageOrder(@PathParam("id") String id, CharacterPages pages, @Context HttpHeaders headers) throws Exception {
        CreatureService.updatePageOrder(id, pages, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/settings/character")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCharacterSettings(@PathParam("id") String id, CharacterSettings settings, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCharacterSettings(id, settings, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/settings/battleMonster")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateBattleMonsterSettings(@PathParam("id") String id, BattleMonsterSettings settings, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateBattleMonsterSettings(id, settings, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/wealth")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCreatureWealth(@PathParam("id") String id, CreatureWealth creatureWealth, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreatureWealth(id, creatureWealth, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/health")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCreatureHealth(@PathParam("id") String id, CreatureHealth creatureHealth, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreatureHealth(id, creatureHealth, headers);
        return Response.ok().build();
    }


    @POST
    @Path("/{id}/ac")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCreatureAc(@PathParam("id") String id, CreatureAC creatureAC, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreatureAc(id, creatureAC, headers);
        return Response.ok().build();
    }
    @POST
    @Path("/{id}/healthConfiguration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCreatureHealthConfiguration(@PathParam("id") String id, CharacterHealthConfiguration characterHealthConfiguration, @Context HttpHeaders headers) throws Exception {
        CharacterService.updateCreatureHealth(id, characterHealthConfiguration, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/inspiration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCharacterInspiration(@PathParam("id") String id, @QueryParam("set") boolean set, @Context HttpHeaders headers) throws Exception {
        CharacterService.updateCharacterInspiration(id, set, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/classes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateChosenClasses(@PathParam("id") String id, ChosenClasses chosenClasses, @Context HttpHeaders headers) throws Exception {
        CharacterService.updateChosenClasses(id, chosenClasses.getChosenClasses(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/classes/spellcasting")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateChosenClassesSpellcasting(@PathParam("id") String id, ChosenClasses chosenClasses, @Context HttpHeaders headers) throws Exception {
        CharacterService.updateChosenClassesSpellcasting(id, chosenClasses.getChosenClasses(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/exp")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateExp(@PathParam("id") String id, CharacterExp characterExp, @Context HttpHeaders headers) throws Exception {
        CharacterService.updateExp(id, characterExp.getExp(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spellcastingAbility")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCreatureSpellCasting(@PathParam("id") String id,
                                               @QueryParam("innate") boolean innate,
                                               SpellcastingAbility spellcastingAbility,
                                               @Context HttpHeaders headers) throws Exception {
        CreatureService.updateSpellCastingAbility(id, spellcastingAbility.getAbility(), headers, innate);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spellcastingAbility/{type}/{characteristicId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCharacteristicSpellcastingAbility(@PathParam("id") String id,
                                                            @PathParam("type") String type,
                                                            @PathParam("characteristicId") String characteristicId,
                                                            SpellcastingAbility spellcastingAbility, @Context HttpHeaders headers) throws Exception {
        CharacteristicType characteristicType = CharacteristicType.valueOf(type);
        CreatureService.updateCharacteristicSpellcastingAbility(id, characteristicType, characteristicId, spellcastingAbility.getAbility(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spellCasting")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateSpellcasting(@PathParam("id") String id,
                                       @QueryParam("innate") boolean innate,
                                       Spellcasting spellcasting,
                                       @Context HttpHeaders headers) throws Exception {
        CreatureService.updateSpellcasting(id, spellcasting, headers, innate);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spellCasting/{characteristicId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateCharacteristicSpellcasting(@PathParam("id") String id, @PathParam("characteristicId") String characteristicId,
                                                     Spellcasting characteristicSpellcasting, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCharacteristicSpellcasting(id, characteristicId, characteristicSpellcasting, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spellSlots")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateSpellSlots(@PathParam("id") String id, CreatureSpellSlots creatureSpellSlots, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreatureSpellSlots(id, creatureSpellSlots.getSpellSlots(), headers);
        return Response.ok().build();
    }

    @GET
    @Path("/{id}/items")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getItems(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureItemService.getItems(id, headers)).build();
    }

    @PUT
    @Path("/{id}/items")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addItems(@PathParam("id") String id, CreatureInventory creatureInventory, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureItemService.addItems(id, creatureInventory, headers)).build();
    }

    @POST
    @Path("/{id}/items/{itemId}/{action}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response performCreatureItemAction(@PathParam("id") String id,
                                              @PathParam("itemId") String itemId,
                                              @PathParam("action") String action,
                                              CreatureItemActionRequest creatureItemActionRequest,
                                              @Context HttpHeaders headers) throws Exception {
        CreatureItemAction creatureItemAction = CreatureItemAction.valueOf(action);
        return Response.ok(CreatureItemService.performCreatureItemAction(id, itemId, creatureItemAction, creatureItemActionRequest, headers)).build();
    }

    @POST
    @Path("/{id}/items/{itemId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateExpanded(@PathParam("id") String id,
                                   @PathParam("itemId") String itemId,
                                   @QueryParam("expanded") boolean expanded,
                                   @Context HttpHeaders headers) throws Exception {
        CreatureItemService.updateExpanded(itemId, expanded, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/items")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateItems(@PathParam("id") String id,
                                CreatureItemsRequest request,
                                @Context HttpHeaders headers) throws Exception {
        CreatureItemService.updateItems(request, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/activeConditions")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateActiveConditions(@PathParam("id") String id, CreatureConditions creatureConditions, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.updateActiveConditions(id, creatureConditions.getActiveConditions(), headers)).build();
    }

    @POST
    @Path("/{id}/activeConditions/{conditionId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateActiveCondition(@PathParam("id") String id, @PathParam("conditionId") String conditionId, @QueryParam("active") boolean active, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.updateActiveCondition(id, conditionId, active, headers)).build();
    }

    @POST
    @Path("/{id}/conditions/{conditionId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateConditionImmunities(@PathParam("id") String id, @PathParam("conditionId") String conditionId, @QueryParam("immune") boolean immune, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.updateConditionImmunity(id, conditionId, immune, headers)).build();
    }

    @POST
    @Path("/{id}/damageModifier/{damageTypeId}/{damageModifierType}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateDamageModifier(@PathParam("id") String id, @PathParam("damageTypeId") String damageTypeId, @PathParam("damageModifierType") DamageModifierType damageModifierType, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateDamageModifier(id, damageTypeId, damageModifierType, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/modifier")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateAttributeModifier(@PathParam("id") String id, Proficiency proficiency, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateAttributeProf(id, proficiency, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/modifiers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateAttributeModifiers(@PathParam("id") String id, ProficiencyList proficiencyList, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateAttributeProfs(id, proficiencyList.getProficiencies(), headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/abilityScore")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateAbilityScore(@PathParam("id") String id, CreatureAbilityScore creatureAbilityScore, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateAbilityScore(id, creatureAbilityScore, headers);
        return Response.ok().build();
    }

    @GET
    @Path("/type/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getCreatures(@PathParam("type") String type, @QueryParam("source") String source, @Context HttpHeaders headers) throws Exception {
        CreatureType creatureType = CreatureType.valueOf(type);
        ListSource listSource = ListSource.valueOf(source);
        return Response.ok(CreatureService.getCreatures(creatureType, listSource, headers)).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCreature(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getCreature(id, headers)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCreature(@PathParam("id") String id,
                                    @Context HttpHeaders headers) throws Exception {
        CreatureService.delete(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/duplicate")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response duplicate(@PathParam("id") String id,
                              @FormParam("name") String name,
                              @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.duplicate(id, name, headers)).build();
    }

    @POST
    @Path("/{id}/roll/standard")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response roll(@PathParam("id") String id, RollRequest rollRequest, @Context HttpHeaders headers) throws Exception {
        return Response.ok(RollService.roll(id, rollRequest, headers)).build();
    }

    @POST
    @Path("/{id}/roll/attack")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response roll(@PathParam("id") String id, AttackDamageRollRequest rollRequest, @Context HttpHeaders headers) throws Exception {
        return Response.ok(RollService.roll(id, rollRequest, headers)).build();
    }

    @GET
    @Path("/{id}/rolls")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRolls(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(RollService.getRolls(id, headers)).build();
    }

    @GET
    @Path("/{id}/rolls/{rollId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRoll(@PathParam("id") String id, @PathParam("rollId") String rollId, @Context HttpHeaders headers) throws Exception {
        return Response.ok(RollService.getRoll(id, rollId, headers)).build();
    }

    @POST
    @Path("/{id}/rolls/archive")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response archive(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        RollService.archive(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/rolls/{rollId}/archive")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response archive(@PathParam("id") String id, @PathParam("rollId") String rollId, @Context HttpHeaders headers) throws Exception {
        RollService.archive(id, rollId, headers);
        return Response.ok().build();
    }

    /********************************* Powers ***************************/

    @PUT
    @Path("/{id}/powers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addPowers(@PathParam("id") String id, CreaturePowerList creaturePowerList, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.addPowers(id, creaturePowerList.getCreaturePowers(), headers)).build();
    }

    @PUT
    @Path("/{id}/spells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addSpells(@PathParam("id") String id, CreatureSpellList creatureSpellList, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.addSpells(id, creatureSpellList.getCreatureSpells(), headers)).build();
    }

    @GET
    @Path("/{id}/validate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateCreature(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.validateCreature(id, headers)).build();
    }

    @POST
    @Path("/{id}/validate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCreatureValidation(@PathParam("id") String id, CharacterValidationResponse characterValidationResponse, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreatureValidation(id, characterValidationResponse, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/validate/reset")
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetIgnoredFeatures(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        CreatureService.resetIgnoredFeatures(id, headers);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}/powers/{powerId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePower(@PathParam("id") String id,
                                @PathParam("powerId") String powerId,
                                @Context HttpHeaders headers) throws Exception {
        CreatureService.removePower(id, powerId, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/spells/update")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCreatureSpells(@PathParam("id") String id,
                                         CreatureSpellList creatureSpellList,
                                         @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreatureSpells(id, creatureSpellList, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/legendaryPoints")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateLegendaryPoints(@PathParam("id") String id,
                                          int legendaryPoints,
                                          @Context HttpHeaders headers) throws Exception {
        CreatureService.updateLegendaryPoints(id, legendaryPoints, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/powers/update")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCreaturePowers(@PathParam("id") String id,
                                           CreaturePowerList creaturePowerList,
                                           @Context HttpHeaders headers) throws Exception {
        CreatureService.updateCreaturePowers(id, creaturePowerList, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/battleMonsterPowers/update")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBattleMonsterPowers(@PathParam("id") String id,
                                         CreaturePowerList creaturePowerList,
                                         @Context HttpHeaders headers) throws Exception {
        CreatureService.updateBattleMonsterPowers(id, creaturePowerList, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/tags")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTags(@PathParam("id") String id,
                               TagList tagList,
                               @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.updateTags(id, tagList, headers)).build();
    }

    @GET
    @Path("/{id}/tags")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTags(@PathParam("id") String id,
                            @QueryParam("powerType") String powerType,
                            @Context HttpHeaders headers) throws Exception {
        PowerType type = PowerType.valueOf(powerType);
        return Response.ok(CreatureService.getTags(id, type, headers)).build();
    }

    @POST
    @Path("/{id}/powers/tags")
    @Produces(MediaType.APPLICATION_JSON)
    public Response tagPowers(@PathParam("id") String id,
                              PowerTagList powerTagList,
                              @Context HttpHeaders headers) throws Exception {
        CreatureService.updatePowerTags(id, powerTagList, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/features/missing")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMissingFeatures(@PathParam("id") String id, Filters filters, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getMissingFeatures(id, filters, headers)).build();
    }

    @POST
    @Path("/{id}/features")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFeatures(@PathParam("id") String id, FilterSorts filterSorts, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacterService.getFeatures(id, filterSorts, headers)).build();
    }

    @PUT
    @Path("/{id}/monsterPowers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response addMonsterActions(@PathParam("id") String id, CreaturePowerList creaturePowerList, @Context HttpHeaders headers) throws Exception {
        CompanionService.addCompanionPowers(id, creaturePowerList, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/monsterPowers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateMonsterActions(@PathParam("id") String id, CreaturePowerList creaturePowerList, @Context HttpHeaders headers) throws Exception {
        CompanionService.updateCompanionPowers(id, creaturePowerList, headers);
        return Response.ok().build();
    }

    @GET
    @Path("/{id}/monsterActions")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMonsterActions(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CompanionService.getCompanionActions(id, headers)).build();
    }

    @GET
    @Path("/{id}/monsterFeatures")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMonsterFeatures(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CompanionService.getCompanionFeatures(id, headers)).build();
    }

    @GET
    @Path("/{id}/monsterSpells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMonsterSpells(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CompanionService.getCompanionSpells(id, headers)).build();
    }

    @POST
    @Path("/{id}/spells")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSpells(@PathParam("id") String id, FilterSorts filterSorts, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getFilteredCreatureSpells(id, filterSorts, headers)).build();
    }

    @GET
    @Path("/{id}/spells/detailed")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSpellsDetailed(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getSpellsDetailed(id, headers)).build();
    }

    @GET
    @Path("/{id}/features/detailed")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFeaturesDetailed(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getFeaturesDetailed(id, headers)).build();
    }

    @POST
    @Path("/{id}/spells/missing")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMissingSpells(@PathParam("id") String id,
                                     @QueryParam("characteristicId") String characteristicId,
                                     Filters filters,
                                     @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getMissingSpells(id, characteristicId, filters, headers)).build();
    }

    @GET
    @Path("/{id}/actions")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getCreatureActions(@PathParam("id") String id,
                                       @QueryParam("type") String type,
                                       @Context HttpHeaders headers) throws Exception {
        Action action = Action.valueOf(type);
        return Response.ok(CreatureService.getCreatureActions(id, action, headers)).build();
    }

    @GET
    @Path("/{id}/actions/favorites")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getFavoriteCreatureActions(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.getFavoriteCreatureActions(id, headers)).build();
    }

    @POST
    @Path("/{id}/actions/favorites")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateFavoriteCreatureActions(@PathParam("id") String id, CreatureActions creatureActions, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateFavoriteCreatureActions(id, creatureActions, headers);
        return Response.ok().build();
    }

    /********************************* Filters ***************************/

    @POST
    @Path("/{id}/filters/{filterType}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateFilters(@PathParam("id") String id, @PathParam("filterType") FilterType filterType, Filters filters, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateFilters(id, filterType, filters.getFilterValues(), headers);
        return Response.ok().build();
    }

    /********************************* Sorts ***************************/

    @POST
    @Path("/{id}/sorts/{sortType}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateSorts(@PathParam("id") String id, @PathParam("sortType") SortType sortType, Sorts sorts, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateSorts(id, sortType, sorts.getSortValues(), headers);
        return Response.ok().build();
    }

    /********************************* Notes ***************************/

    @PUT
    @Path("/{id}/notes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response insertNote(@PathParam("id") String id, CharacterNote characterNote, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.insertNote(id, characterNote, headers)).build();
    }

    @POST
    @Path("/{id}/notes/order")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateNoteOrder(@PathParam("id") String id, CharacterNoteOrder characterNoteOrder, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateNoteOrder(characterNoteOrder, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/notes/categories/{categoryId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateNoteOrder(@PathParam("id") String id, @PathParam("categoryId") String categoryId, CharacterNoteCategory characterNoteCategory, @Context HttpHeaders headers) throws Exception {
        CreatureService.updateNoteCategory(characterNoteCategory, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/notes/{noteId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateNote(@PathParam("id") String id, @PathParam("noteId") String noteId, CharacterNote characterNote, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CreatureService.updateNote(id, noteId, characterNote, headers)).build();
    }

    @DELETE
    @Path("/{id}/notes/{noteId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteNote(@PathParam("id") String id, @PathParam("noteId") String noteId, @Context HttpHeaders headers) throws Exception {
        CreatureService.deleteNote(id, noteId, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/notes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response getNotes(@PathParam("id") String id, FilterSorts filterSorts, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacterService.getCharacterNotes(id, filterSorts, headers)).build();
    }

    @POST
    @Path("/{id}/joinCampaign")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response joinCampaign(@PathParam("id") String id, @QueryParam("token") String token, @Context HttpHeaders headers) throws Exception {
        CharacterService.joinCampaign(id, token, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/leaveCampaign")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON})
    public Response leaveCampaign(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        CharacterService.leaveCampaign(id, headers);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces({MediaType.APPLICATION_JSON})
    public Response updateImage(@PathParam("id") String id, MultipartFormDataInput input, @Context HttpHeaders headers) throws Exception {
        return Response.ok(CharacterService.updateImage(id, input, headers)).build();
    }

    @DELETE
    @Path("/{id}/image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces({MediaType.APPLICATION_JSON})
    public Response deleteImage(@PathParam("id") String id, @Context HttpHeaders headers) throws Exception {
        CharacterService.deleteImage(id, headers);
        return Response.ok().build();
    }

}
