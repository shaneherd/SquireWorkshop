package com.herd.squire.services.creatures.characters;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.AttributeType;
import com.herd.squire.models.attributes.CasterType;
import com.herd.squire.models.attributes.CharacterLevel;
import com.herd.squire.models.characteristics.BackgroundTraitType;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.characteristics.Race;
import com.herd.squire.models.characteristics.background.Background;
import com.herd.squire.models.characteristics.background.BackgroundTrait;
import com.herd.squire.models.characteristics.character_class.CharacterClass;
import com.herd.squire.models.creatures.*;
import com.herd.squire.models.creatures.characters.*;
import com.herd.squire.models.creatures.characters.settings.*;
import com.herd.squire.models.creatures.companions.CompanionListObject;
import com.herd.squire.models.creatures.companions.CompanionType;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterType;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.powers.*;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.models.sorts.SortType;
import com.herd.squire.models.sorts.SortValue;
import com.herd.squire.models.user.UserRole;
import com.herd.squire.rest.SquireException;
import com.herd.squire.rest.SquireHttpStatus;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.ImageService;
import com.herd.squire.services.SortService;
import com.herd.squire.services.attributes.CasterTypeService;
import com.herd.squire.services.characteristics.BackgroundService;
import com.herd.squire.services.characteristics.ClassService;
import com.herd.squire.services.characteristics.RaceService;
import com.herd.squire.services.creatures.CreatureDetailsService;
import com.herd.squire.services.creatures.CreatureItemService;
import com.herd.squire.services.creatures.CreatureService;
import com.herd.squire.services.powers.FeatureService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.services.powers.SpellService;
import com.herd.squire.utilities.Constants;
import com.herd.squire.utilities.MySql;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class CharacterService implements CreatureDetailsService {
    public static final String CHARACTER_IMAGE_DIRECTORY = "characters";

    public List<SpellListObject> getMissingSpells(long characterId, int userId, long assignedCharacteristicId, Filters filters, boolean innate) throws Exception {
        List<SpellListObject> spells = new ArrayList<>();
        List<FilterValue> filterValues = filters.getFilterValues();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = SpellService.getMissingSpellsStatement(characterId, assignedCharacteristicId, connection, filterValues, 0, userId, innate);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                spells = SpellService.getSpells(resultSet, userId);
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                addTagsSpellObjects(spells, resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return spells;
    }

    private static void addTagsSpellObjects(List<SpellListObject> spells, ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<Tag>> map = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            List<Tag> tags = map.computeIfAbsent(powerId, k -> new ArrayList<>());
            tags.add(getTag(resultSet, userId));
        }

        for (SpellListObject spellListObject : spells) {
            long powerId = MySql.decodeId(spellListObject.getId(), userId);
            List<Tag> tags = map.get(powerId);
            if (tags != null) {
                spellListObject.setTags(tags);
            }
        }
    }

    private static CreatureFeatures getCreatureFeatures(long characterId, int userId, List<CreatureFilter> creatureFilters, List<CreatureSort> creatureSorts, List<Tag> tags) throws Exception {
        return new CreatureFeatures(
                getFeatures(characterId, userId, creatureFilters, creatureSorts),
                tags
        );
    }

    public static List<CreatureFeature> getFeatures(String id, FilterSorts filterSorts, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);
        return getCharacterFeatures(characterId, userId, filterSorts.getFilters().getFilterValues(), filterSorts.getSorts().getSortValues());
    }

    private static List<CreatureFeature> getFeatures(long characterId, int userId, List<CreatureFilter> creatureFilters, List<CreatureSort> creatureSorts) throws Exception {
        List<FilterValue> filters = FilterService.getFilters(creatureFilters, FilterType.FEATURE);
        List<SortValue> sorts = SortService.getSorts(creatureSorts, SortType.FEATURE);
        return getCharacterFeatures(characterId, userId, filters, sorts);
    }

    private static List<CreatureFeature> getCharacterFeatures(long characterId, int userId, List<FilterValue> filterValues, List<SortValue> sorts) throws Exception {
        List<CreatureFeature> creatureFeatures = new ArrayList<>();
        List<Long> filteredFeatureIds = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            String search = FilterService.getSearchValue(filterValues);
            Boolean active = FilterService.getFilterBoolean(filterValues, FilterKey.ACTIVE);
            Boolean passive = FilterService.getFilterBoolean(filterValues, FilterKey.PASSIVE);
            String category = FilterService.getFilterValue(filterValues, FilterKey.FEATURE_CATEGORY);
            String level = FilterService.getFilterValue(filterValues, FilterKey.LEVEL);
            String levelValue = null;
            String range = FilterService.getFilterValue(filterValues, FilterKey.RANGE);
            Boolean isRanged = null;
            Boolean isAreaOfEffect = FilterService.getFilterBoolean(filterValues, FilterKey.AREA_OF_EFFECT);
            String areaOfEffectId = FilterService.getFilterValue(filterValues, FilterKey.FEATURE_AREA_OF_EFFECT);
            String areaOfEffectIdValue = null;
            if (isAreaOfEffect != null && isAreaOfEffect && !areaOfEffectId.equals(FilterValue.DEFAULT_OPTION)) {
                areaOfEffectIdValue = areaOfEffectId;
            }
            Boolean isFeat = null;
            CharacteristicType characteristicType = null;
            String characteristicId = "";
            Boolean includeChildren = null;
            if (category != null && !category.equals(FilterValue.DEFAULT_OPTION)) {
                characteristicType = CharacteristicType.valueOf(category);
                isFeat = characteristicType == CharacteristicType.FEAT;

                String classChoice = FilterService.getFilterValue(filterValues, FilterKey.FEATURE_CLASS);
                String raceChoice = FilterService.getFilterValue(filterValues, FilterKey.FEATURE_RACE);
                String backgroundChoice = FilterService.getFilterValue(filterValues, FilterKey.FEATURE_BACKGROUND);

                if (characteristicType == CharacteristicType.CLASS && classChoice != null && !classChoice.equals(FilterValue.DEFAULT_OPTION)) {
                    characteristicId = classChoice;
                    includeChildren = true;
                } else if (characteristicType == CharacteristicType.RACE && raceChoice != null && !raceChoice.equals(FilterValue.DEFAULT_OPTION)) {
                    characteristicId = raceChoice;
                } else if (characteristicType == CharacteristicType.BACKGROUND && backgroundChoice != null && !backgroundChoice.equals(FilterValue.DEFAULT_OPTION)) {
                    characteristicId = backgroundChoice;
                }
            }
            if (level != null && !level.equals(FilterValue.DEFAULT_OPTION)) {
                levelValue = level;
            }

            if (range != null && !range.equals(FilterValue.DEFAULT_OPTION)) {
                isRanged = range.equals(FilterValue.YES);

                if (!isRanged) {
                    isAreaOfEffect = null;
                }
            }

            String tags = FilterService.getFilterValue(filterValues, FilterKey.TAGS);
            String tagIds = null;
            if (tags != null && !tags.equals(FilterValue.DEFAULT_TAG_OPTION)) {
                List<Long> tagsIdsList =PowerService.getTagIds(tags.split(","), userId);
                tagIds = MySql.joinLongIds(tagsIdsList);
            }

            SortValue sortValue = SortService.getSortValue(sorts);
            String sortColumn = "name";
            boolean sortAscending = true;
            if (sortValue != null) {
                sortColumn = getSortColumn(sortValue);
                sortAscending = sortValue.isAscending();
            }

            statement = connection.prepareCall("{call Creatures_Get_CreatureFeatures (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setLong(1, characterId);
            statement.setInt(2, userId);

            MySql.setString(3, search, statement);
            MySql.setBoolean(4, active, statement);
            MySql.setBoolean(5, passive, statement);
            MySql.setBoolean(6, isFeat, statement);
            MySql.setInteger(7, characteristicType == null ? null : characteristicType.getValue(), statement);
            MySql.setId(8, characteristicId, userId, statement);
            MySql.setBoolean(9, includeChildren, statement);
            MySql.setId(10, levelValue, userId, statement);
            MySql.setBoolean(11, isRanged, statement);
            MySql.setBoolean(12, isAreaOfEffect, statement);
            MySql.setId(13, areaOfEffectIdValue, userId, statement);
            MySql.setString(14, tagIds, statement);

            statement.setString(15, sortColumn);
            statement.setBoolean(16, sortAscending);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    creatureFeatures.add(getCreatureFeature(resultSet, userId));
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    filteredFeatureIds.add(resultSet.getLong("power_id"));
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                addTagsToFeatures(creatureFeatures, resultSet, userId);
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                Map<Long, List<LimitedUse>> limitedUses = PowerService.getLimitedUsesMap(resultSet, userId);
                for (CreatureFeature creatureFeature : creatureFeatures) {
                    long featureId = MySql.decodeId(creatureFeature.getFeature().getId(), userId);
                    if (limitedUses.containsKey(featureId)) {
                        creatureFeature.setLimitedUses(limitedUses.get(featureId));
                    }
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
                for (CreatureFeature creatureFeature : creatureFeatures) {
                    long featureId = MySql.decodeId(creatureFeature.getFeature().getId(), userId);
                    if (modifiers.containsKey(featureId)) {
                        creatureFeature.setModifierConfigurations(modifiers.get(featureId));
                    }
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
                for (CreatureFeature creatureFeature : creatureFeatures) {
                    long featureId = MySql.decodeId(creatureFeature.getFeature().getId(), userId);
                    if (modifiers.containsKey(featureId)) {
                        creatureFeature.setAdvancementModifierConfigurations(modifiers.get(featureId));
                    }
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
                for (CreatureFeature creatureFeature : creatureFeatures) {
                    long featureId = MySql.decodeId(creatureFeature.getFeature().getId(), userId);
                    if (modifiers.containsKey(featureId)) {
                        creatureFeature.setExtraModifierConfigurations(modifiers.get(featureId));
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }


        for (CreatureFeature creatureFeature : creatureFeatures) {
            long featureId = MySql.decodeId(creatureFeature.getFeature().getId(), userId);
            if (!filteredFeatureIds.contains(featureId)) {
                creatureFeature.setHidden(true);
            }
        }

        return creatureFeatures;
    }

    private static String getSortColumn(SortValue sortValue) {
        switch (sortValue.getSortKey()) {
            case LEVEL:
                return "level";
            case CATEGORY:
                return "category";
            case NAME:
            default:
                return "name";
        }
    }

    private static CreatureFeature getCreatureFeature(ResultSet resultSet, int userId) throws Exception {
        Action action = null;
        int actionId = resultSet.getInt("action_id");
        if (actionId != 0) {
            action = Action.valueOf(actionId);
        }
        return new CreatureFeature(
                MySql.encodeId(resultSet.getLong("creature_power_id"), userId),
                getFeatureListObject(resultSet, userId),
                resultSet.getBoolean("active"),
                MySql.encodeId(resultSet.getLong("active_target_creature_id"), userId),
                resultSet.getInt("uses_remaining"),
                false,
                resultSet.getBoolean("recharge_on_short_rest"),
                resultSet.getBoolean("recharge_on_long_rest"),
                new ArrayList<>(),
                resultSet.getBoolean("extra_modifiers"),
                resultSet.getInt("modifiers_num_levels_above_base"),
                resultSet.getBoolean("modifier_advancement"),
                action
        );
    }

    private static FeatureListObject getFeatureListObject(ResultSet resultSet, int userId) throws Exception {
        ListObject characteristic = null;
        long characteristicId = resultSet.getLong("characteristic_id");
        if (characteristicId > 0) {
            characteristic = new ListObject(
                    MySql.encodeId(characteristicId, userId),
                    resultSet.getString("characteristic_name"),
                    resultSet.getInt("characteristic_sid"),
                    resultSet.getBoolean("characteristic_is_author")
            );
        }
        CharacteristicType characteristicType = null;
        int characteristicTypeId = resultSet.getInt("characteristic_type_id");
        if (characteristicTypeId > 0) {
            characteristicType = CharacteristicType.valueOf(characteristicTypeId);
        }
        long featureId = resultSet.getLong("feature_id");
        return new FeatureListObject(
                MySql.encodeId(featureId, userId),
                resultSet.getString("feature_name"),
                resultSet.getInt("feature_sid"),
                resultSet.getBoolean("feature_is_author"),
                characteristic,
                characteristicType,
                resultSet.getBoolean("passive")
        );
    }

    public static void addTagsToFeatures(List<CreatureFeature> creatureFeatures, ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<Tag>> map = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            List<Tag> tags = map.computeIfAbsent(powerId, k -> new ArrayList<>());
            tags.add(getTag(resultSet, userId));
        }

        for (CreatureFeature creatureFeature : creatureFeatures) {
            long powerId = MySql.decodeId(creatureFeature.getPowerId(), userId);
            List<Tag> tags = map.get(powerId);
            if (tags != null) {
                creatureFeature.getFeature().setTags(tags);
            }
        }
    }

    private static Tag getTag(ResultSet resultSet, int userId) throws Exception {
        return new Tag(
                MySql.encodeId(resultSet.getLong("id"), userId),
                PowerType.valueOf(resultSet.getInt("power_type_id")),
                resultSet.getString("title"),
                resultSet.getString("color")
        );
    }

    public List<FeatureListObject> getMissingFeatures(long characterId, Filters filters, int userId) throws Exception {
        List<FeatureListObject> features = new ArrayList<>();
        List<FilterValue> filterValues = filters.getFilterValues();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = FeatureService.getMissingFeaturesStatement(characterId, connection, filterValues, 0, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                features = FeatureService.getFeatures(resultSet, userId);
            }


            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                addTagsFeatureObjects(features, resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return features;
    }

    private static void addTagsFeatureObjects(List<FeatureListObject> features, ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<Tag>> map = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            List<Tag> tags = map.computeIfAbsent(powerId, k -> new ArrayList<>());
            tags.add(getTag(resultSet, userId));
        }

        for (FeatureListObject featureListObject : features) {
            long powerId = MySql.decodeId(featureListObject.getId(), userId);
            List<Tag> tags = map.get(powerId);
            if (tags != null) {
                featureListObject.setTags(tags);
            }
        }
    }

    /********************* Create/Update ********************/

    @Override
    public long create(Creature creature, int userId) throws Exception {
        if (!(creature instanceof PlayerCharacter)) {
            throw new Exception("Invalid creature type");
        }
        PlayerCharacter playerCharacter = (PlayerCharacter) creature;
        Background background = playerCharacter.getCharacterBackground().getBackground();
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Creatures_Create_Character (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(creature.getName(), 150));
            MySql.setId(2, creature.getCreatureSpellCasting() == null ? null : creature.getCreatureSpellCasting().getSpellcastingAbility(), userId, statement);
            MySql.setId(3, creature.getAlignment() == null ? null : creature.getAlignment().getId(), userId, statement);

            MySql.setId(4, playerCharacter.getCharacterRace().getRace().getId(), userId, statement);
            MySql.setId(5, playerCharacter.getCharacterRace().getRace().getSpellCastingAbility(), userId, statement);
            MySql.setId(6, background == null ? null : background.getId(), userId, statement);
            MySql.setId(7, background == null ? null : background.getSpellCastingAbility(), userId, statement);
            statement.setString(8, MySql.getValue(playerCharacter.getCharacterBackground().getCustomBackgroundName(), 45));
            statement.setString(9, MySql.getValue(playerCharacter.getCharacterBackground().getCustomVariation(), 1000));
            statement.setString(10, MySql.getValue(playerCharacter.getCharacterBackground().getCustomPersonality(), 1000));
            statement.setString(11, MySql.getValue(playerCharacter.getCharacterBackground().getCustomIdeal(), 1000));
            statement.setString(12, MySql.getValue(playerCharacter.getCharacterBackground().getCustomBond(), 1000));
            statement.setString(13, MySql.getValue(playerCharacter.getCharacterBackground().getCustomFlaw(), 1000));
            statement.setString(14, MySql.getValue(playerCharacter.getCharacterBackground().getBio(), 3000));
            statement.setString(15, MySql.getValue(playerCharacter.getCharacteristics().getHeight(), 45));
            statement.setString(16, MySql.getValue(playerCharacter.getCharacteristics().getEyes(), 45));
            statement.setString(17, MySql.getValue(playerCharacter.getCharacteristics().getHair(), 45));
            statement.setString(18, MySql.getValue(playerCharacter.getCharacteristics().getSkin(), 45));
            statement.setInt(19, playerCharacter.getCharacteristics().getGender().getValue());
            statement.setInt(20, MySql.getValue(playerCharacter.getCharacteristics().getAge(), 0, 9999));
            statement.setDouble(21, MySql.getValue(playerCharacter.getCharacteristics().getWeight(), 0, 9999.99));
            MySql.setId(22, playerCharacter.getCharacteristics().getDeity(), userId, statement);
            statement.setInt(23, MySql.getValue(playerCharacter.getExp(), 0, 999999));
            statement.setInt(24, MySql.getValue(playerCharacter.getHpGainModifier(), 0, 99));
            statement.setInt(25, playerCharacter.getHealthCalculationType().getValue());

            statement.setInt(26, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("creature_id");
                }
            }

            if (id != -1) {
                CreatureService.creatureDefaults(id, connection);
                CreatureService.createDefaultTags(id, connection);
                CreatureService.createDefaultSpellcasting(id, connection, false);
                CreatureService.updateCommonCreatureTraits(id, creature, userId, connection);
                CreatureService.updateCreatureHealth(id, creature.getCreatureHealth(), connection);
                playerCharacter.getCharacterSettings().setPages(getDefaultPageOrder());
                updateCharacterTraits(id, playerCharacter, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Creature creature, long id, int userId) throws Exception {
        if (!(creature instanceof PlayerCharacter)) {
            throw new Exception("Invalid creature type");
        }
        PlayerCharacter playerCharacter = (PlayerCharacter) creature;
        long originalRaceId = 0;
        long originalBackgroundId = 0;
        Background background = playerCharacter.getCharacterBackground().getBackground();
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            originalRaceId = getCharacterRaceId(id, connection);
            originalBackgroundId = getCharacterBackgroundId(id, connection);

            statement = connection.prepareCall("{call Creatures_Update_Character (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(creature.getName(), 150));
            MySql.setId(4, creature.getCreatureSpellCasting() == null ? null : creature.getCreatureSpellCasting().getSpellcastingAbility(), userId, statement);
            MySql.setId(5, creature.getAlignment() == null ? null : creature.getAlignment().getId(), userId, statement);

            MySql.setId(6, playerCharacter.getCharacterRace().getRace().getId(), userId, statement);
            MySql.setId(7, playerCharacter.getCharacterRace().getRace().getSpellCastingAbility(), userId, statement);
            MySql.setId(8, background == null ? null : background.getId(), userId, statement);
            MySql.setId(9, background == null ? null : background.getSpellCastingAbility(), userId, statement);
            statement.setString(10, MySql.getValue(playerCharacter.getCharacterBackground().getCustomBackgroundName(), 45));
            statement.setString(11, MySql.getValue(playerCharacter.getCharacterBackground().getCustomVariation(), 1000));
            statement.setString(12, MySql.getValue(playerCharacter.getCharacterBackground().getCustomPersonality(), 1000));
            statement.setString(13, MySql.getValue(playerCharacter.getCharacterBackground().getCustomIdeal(), 1000));
            statement.setString(14, MySql.getValue(playerCharacter.getCharacterBackground().getCustomBond(), 1000));
            statement.setString(15, MySql.getValue(playerCharacter.getCharacterBackground().getCustomFlaw(), 1000));
            statement.setString(16, MySql.getValue(playerCharacter.getCharacterBackground().getBio(), 3000));
            statement.setString(17, MySql.getValue(playerCharacter.getCharacteristics().getHeight(), 45));
            statement.setString(18, MySql.getValue(playerCharacter.getCharacteristics().getEyes(), 45));
            statement.setString(19, MySql.getValue(playerCharacter.getCharacteristics().getHair(), 45));
            statement.setString(20, MySql.getValue(playerCharacter.getCharacteristics().getSkin(), 45));
            statement.setInt(21, playerCharacter.getCharacteristics().getGender().getValue());
            statement.setInt(22, MySql.getValue(playerCharacter.getCharacteristics().getAge(), 0, 9999));
            statement.setDouble(23, MySql.getValue(playerCharacter.getCharacteristics().getWeight(), 0, 9999.99));
            MySql.setId(24, playerCharacter.getCharacteristics().getDeity(), userId, statement);
            statement.setBoolean(25, playerCharacter.isInspiration());
            statement.setInt(26, MySql.getValue(playerCharacter.getExp(), 0, 999999));
            statement.setInt(27, MySql.getValue(playerCharacter.getHpGainModifier(), 0, 99));
            statement.setInt(28, playerCharacter.getHealthCalculationType().getValue());

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                CreatureService.updateCommonCreatureTraits(id, creature, userId, connection);
                CreatureService.updateCreatureHealth(id, creature.getCreatureHealth(), connection);
                updateCharacterTraits(id, playerCharacter, userId, connection);

                if (originalRaceId != 0 && originalRaceId != MySql.decodeId(playerCharacter.getCharacterRace().getRace().getId(), userId)) {
                    deleteCharacteristic(id, originalRaceId, userId, connection);
                }
                if (originalBackgroundId != 0 && (playerCharacter.getCharacterBackground().getBackground() == null || MySql.decodeId(playerCharacter.getCharacterBackground().getBackground().getId(), userId) != originalBackgroundId)) {
                    deleteCharacteristic(id, originalBackgroundId, userId, connection);
                }
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    @Override
    public long addToMyStuff(Creature authorCreature, int authorUserId, ListObject existingCreature, int userId) throws Exception {
        throw new Exception("not implemented");
    }

    @Override
    public void addToShareList(Creature creature, int userId, ShareList shareList) throws Exception {
//        do nothing
    }

    private static long getCharacterRaceId(long characterId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        long raceId = 0;
        try {
            statement = connection.prepareStatement("SELECT race_id FROM characters WHERE creature_id = ?");
            statement.setLong(1, characterId);
            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                raceId = resultSet.getLong("race_id");
            }

            resultSet.close();
            statement.close();
        } catch (Exception e) {
            if (resultSet != null) {
                resultSet.close();
            }
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
        return raceId;
    }

    private static long getCharacterBackgroundId(long characterId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        long raceId = 0;
        try {
            statement = connection.prepareStatement("SELECT background_id FROM characters WHERE creature_id = ?");
            statement.setLong(1, characterId);
            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                raceId = resultSet.getLong("background_id");
            }

            resultSet.close();
            statement.close();
        } catch (Exception e) {
            if (resultSet != null) {
                resultSet.close();
            }
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
        return raceId;
    }

    private void updateCharacterTraits(long id, PlayerCharacter playerCharacter, int userId, Connection connection) throws Exception {
        updateSettings(id, playerCharacter.getCharacterSettings(), connection);
        updatePageOrder(id, playerCharacter.getCharacterSettings().getPages(), connection);
        updateChosenClasses(id, playerCharacter.getClasses(), userId, connection);
        updateChosenTraits(id, playerCharacter.getCharacterBackground().getChosenTraits(), userId, connection);
        updateAbilityScoresToIncreaseByOne(id, playerCharacter.getAbilitiesToIncreaseByOne(), userId, connection);

        //Default SpellCasting for each Characteristic
        createDefaultSpellcasting(id, playerCharacter.getClasses(), userId, connection);
        createDefaultSpellcasting(id, playerCharacter.getCharacterRace().getRace(), userId, connection);
        createDefaultSpellcasting(id, playerCharacter.getCharacterBackground().getBackground(), userId, connection);
        createDefaultSpellSlots(id, playerCharacter.getClasses(), userId, connection);
    }

    private static void createDefaultSpellSlots(long characterId, List<ChosenClass> classes, int userId, Connection connection) throws Exception {
        //todo - handle warlock and other non-multiclass casters
        SpellSlots spellSlots = getMaxSpellSlots(classes, userId);
        CreatureService.updateCreatureSpellSlots(characterId, spellSlots, connection);
    }

    private static boolean isMultiClassCaster(List<ChosenClass> classes){
        if (classes.size() == 1){
            return false;
        }
        int numCasters = 0;
        for (ChosenClass chosenClass : classes) {
            CasterType casterType = chosenClass.getCharacterClass().getCasterType();
            if (casterType != null && casterType.getMultiClassWeight() > 0) {
                numCasters++;
            }
            if (numCasters > 1) {
                return true;
            }
        }
        return false;
    }

    private static int getMultiClassCasterLevel(List<ChosenClass> classes){
        int casterLevel = 0;
        for (ChosenClass chosenClass : classes) {
            CasterType casterType = chosenClass.getCharacterClass().getCasterType();
            casterLevel += getCasterTypeLevel(casterType, Integer.parseInt(chosenClass.getCharacterLevel().getName()));
        }
        return casterLevel;
    }

    private static int getCasterTypeLevel(CasterType casterType, int level){
        int newLevel = 0;
        if (casterType != null) {
            if(casterType.getMultiClassWeight() != 0){
                newLevel = level / casterType.getMultiClassWeight();
            }
            if(casterType.isRoundUp()){
                if(level % casterType.getMultiClassWeight() > 0){
                    newLevel++;
                }
            }
        }

        return newLevel;
    }

    private static void addMaxToSpellSlots(List<CreatureSpellSlot> spellSlots, PlayerCharacter playerCharacter, int userId) {
        SpellSlots maxSlots = getMaxSpellSlots(playerCharacter.getClasses(), userId);

        for (CreatureSpellSlot slot : spellSlots) {
            switch(slot.getLevel()) {
                case 1:
                    slot.setCalculatedMax(maxSlots.getSlot1());
                    break;
                case 2:
                    slot.setCalculatedMax(maxSlots.getSlot2());
                    break;
                case 3:
                    slot.setCalculatedMax(maxSlots.getSlot3());
                    break;
                case 4:
                    slot.setCalculatedMax(maxSlots.getSlot4());
                    break;
                case 5:
                    slot.setCalculatedMax(maxSlots.getSlot5());
                    break;
                case 6:
                    slot.setCalculatedMax(maxSlots.getSlot6());
                    break;
                case 7:
                    slot.setCalculatedMax(maxSlots.getSlot7());
                    break;
                case 8:
                    slot.setCalculatedMax(maxSlots.getSlot8());
                    break;
                case 9:
                    slot.setCalculatedMax(maxSlots.getSlot9());
                    break;
            }
        }
    }

    private static List<SpellSlots> getNonMulticasterSpellSlots(List<ChosenClass> classes, boolean multiCaster) {
        List<SpellSlots> slots = new ArrayList<>();
        for (ChosenClass chosenClass : classes) {
            CasterType casterType = chosenClass.getCharacterClass().getCasterType();
            List<SpellSlots> spellSlotsList = casterType == null || (multiCaster && casterType.getMultiClassWeight() != 0) ? new ArrayList<>() : casterType.getSpellSlots();
            int casterLevel = Integer.parseInt(chosenClass.getCharacterLevel().getName());
            SpellSlots currentSlots = getSpellSlots(spellSlotsList, casterLevel);
            slots.add(currentSlots);
        }
        return slots;
    }

    private static SpellSlots getMulticasterSpellSlots(List<ChosenClass> classes, int userId) {
        List<SpellSlots> spellSlotsList = null;
        int casterLevel = 0;

        if (isMultiClassCaster(classes)) {
            casterLevel = getMultiClassCasterLevel(classes);
            if (casterLevel != 0) {
                try {
                    //todo - this needs to be done by sid
                    CasterType multiclassCaster = CasterTypeService.get(Constants.MULTICLASS_CASTER, userId);
                    if (multiclassCaster != null) {
                        spellSlotsList = multiclassCaster.getSpellSlots();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        return getSpellSlots(spellSlotsList, casterLevel);
    }

    private static SpellSlots getSpellSlots(List<SpellSlots> spellSlotsList, int casterLevel) {
        if (spellSlotsList != null && casterLevel > 0) {
            String casterLevelStr = String.valueOf(casterLevel);
            for (SpellSlots spellSlots : spellSlotsList) {
                if (spellSlots.getCharacterLevel().getName().equals(casterLevelStr)) {
                    return spellSlots;
                }
            }
        }

        return new SpellSlots(null, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    private static SpellSlots getMaxSpellSlots(List<ChosenClass> classes, int userId){
        List<SpellSlots> slots;
        if (isMultiClassCaster(classes)) {
            slots = getNonMulticasterSpellSlots(classes, true);
            slots.add(getMulticasterSpellSlots(classes, userId));
        } else {
            slots = getNonMulticasterSpellSlots(classes, false);
        }

        SpellSlots spellSlots = new SpellSlots();
        for (SpellSlots slot : slots) {
            spellSlots.setSlot1(spellSlots.getSlot1() + slot.getSlot1());
            spellSlots.setSlot2(spellSlots.getSlot2() + slot.getSlot2());
            spellSlots.setSlot3(spellSlots.getSlot3() + slot.getSlot3());
            spellSlots.setSlot4(spellSlots.getSlot4() + slot.getSlot4());
            spellSlots.setSlot5(spellSlots.getSlot5() + slot.getSlot5());
            spellSlots.setSlot6(spellSlots.getSlot6() + slot.getSlot6());
            spellSlots.setSlot7(spellSlots.getSlot7() + slot.getSlot7());
            spellSlots.setSlot8(spellSlots.getSlot8() + slot.getSlot8());
            spellSlots.setSlot9(spellSlots.getSlot9() + slot.getSlot9());
        }

        return spellSlots;
    }

    private static void createDefaultSpellcasting(long characterId, List<ChosenClass> classes, int userId, Connection connection) throws Exception  {
        for (ChosenClass chosenClass : classes) {
            CharacterClass characterClass = chosenClass.getCharacterClass();
            createDefaultSpellcasting(characterId, characterClass.getId(), userId, connection);
        }
    }

    private static void createDefaultSpellcasting(long characterId, Race race, int userId, Connection connection) throws Exception  {
        if (race != null) {
            createDefaultSpellcasting(characterId, race.getId(), userId, connection);
        }
    }

    private static void createDefaultSpellcasting(long characterId, Background background, int userId, Connection connection) throws Exception  {
        if (background != null) {
            createDefaultSpellcasting(characterId, background.getId(), userId, connection);
        }
    }

    private static void createDefaultSpellcasting(long characterId, String characteristicId, int userId, Connection connection) throws Exception  {
        insertCharacteristicSpellcasting(characterId, characteristicId, new Spellcasting(AttackType.ATTACK), userId, connection);
        insertCharacteristicSpellcasting(characterId, characteristicId, new Spellcasting(AttackType.SAVE), userId, connection);
    }

    public static void updateCharacteristicSpellcastingAbility(long characterId, CharacteristicType characteristicType, String characteristicId,
                                                               String spellcastingAbility, int userId) throws Exception {
        switch (characteristicType) {
            case CLASS:
                updateChosenClassSpellcastingAbility(characterId, characteristicId, spellcastingAbility, userId);
                break;
            case RACE:
                updateRaceSpellcastingAbility(characterId, spellcastingAbility, userId);
                break;
            case BACKGROUND:
                updateBackgroundSpellcastingAbility(characterId, spellcastingAbility, userId);
                break;
        }
    }

    private static void updateChosenClassSpellcastingAbility(long characterId, String classId, String spellcastingAbility, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE `character_chosen_classes` SET spellcasting_ability_id = ? WHERE character_id = ? AND class_id = ?");
            MySql.setId(1, spellcastingAbility, userId, statement);
            statement.setLong(2, characterId);
            MySql.setId(3, classId, userId, statement);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateRaceSpellcastingAbility(long characterId, String spellcastingAbility, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE `characters` SET race_spellcasting_ability_id = ? WHERE creature_id = ?");
            MySql.setId(1, spellcastingAbility, userId, statement);
            statement.setLong(2, characterId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateBackgroundSpellcastingAbility(long characterId, String spellcastingAbility, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE `characters` SET background_spellcasting_ability_id = ? WHERE creature_id = ?");
            MySql.setId(1, spellcastingAbility, userId, statement);
            statement.setLong(2, characterId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void insertCharacteristicSpellcasting(long characterId, String characteristicId, Spellcasting spellcasting, int userId, Connection connection) throws Exception  {
        PreparedStatement statement = null;
        try {
            //Check to see if the spellcasting already exists
            statement = connection.prepareStatement("SELECT character_id " +
                    "FROM character_characteristic_spellcasting " +
                    "WHERE character_id = ? AND characteristic_id = ? AND attack_type_id = ?");
            statement.setLong(1, characterId);
            MySql.setId(2, characteristicId, userId, statement);
            statement.setInt(3, spellcasting.getAttackType().getValue());
            ResultSet resultSet = statement.executeQuery();

            boolean exists = resultSet.next();
            if (!exists) {
                statement = connection.prepareStatement("INSERT INTO character_characteristic_spellcasting (character_id, characteristic_id, prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id) VALUES (?,?,?,?,?,?,?,?,?,?)");
                statement.setLong(1, characterId);
                MySql.setId(2, characteristicId, userId, statement);
                statement.setBoolean(3, spellcasting.getProficiency().isProficient());
                statement.setBoolean(4, spellcasting.getProficiency().isDoubleProf());
                statement.setBoolean(5, spellcasting.getProficiency().isHalfProf());
                statement.setBoolean(6, spellcasting.getProficiency().isRoundUp());
                statement.setInt(7, spellcasting.getProficiency().getMiscModifier());
                statement.setBoolean(8, spellcasting.getProficiency().isAdvantage());
                statement.setBoolean(9, spellcasting.getProficiency().isDisadvantage());
                statement.setInt(10, spellcasting.getAttackType().getValue());
                statement.executeUpdate();
            }

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static void updateCharacteristicSpellcasting(long characterId, String characteristicId, Spellcasting spellcasting, int userId) throws Exception  {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE character_characteristic_spellcasting SET prof = ?, double_prof = ?, half_prof = ?, round_up = ?, misc_modifier = ?, advantage = ?, disadvantage = ? WHERE character_id = ? AND characteristic_id = ? AND attack_type_id = ?");
            statement.setBoolean(1, spellcasting.getProficiency().isProficient());
            statement.setBoolean(2, spellcasting.getProficiency().isDoubleProf());
            statement.setBoolean(3, spellcasting.getProficiency().isHalfProf());
            statement.setBoolean(4, spellcasting.getProficiency().isRoundUp());
            statement.setInt(5, spellcasting.getProficiency().getMiscModifier());
            statement.setBoolean(6, spellcasting.getProficiency().isAdvantage());
            statement.setBoolean(7, spellcasting.getProficiency().isDisadvantage());
            statement.setLong(8, characterId);
            MySql.setId(9, characteristicId, userId, statement);
            statement.setInt(10, spellcasting.getAttackType().getValue());
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /********************* End of Create/Update ********************/

    /********************* Get *********************/

    @Override
    public Creature get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getPlayerCharacter(statement, resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Creatures_GetList_Characters (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    private PlayerCharacter getPlayerCharacter(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long characterId = resultSet.getLong("id");
        int characterUserId = resultSet.getInt("character_user_id");
        long spellcastingAbilityId = resultSet.getLong("spellcasting_ability_id");
        long alignmentId = resultSet.getLong("alignment_id");
        ListObject alignment = null;
        if (alignmentId != 0) {
            alignment = new ListObject(MySql.encodeId(alignmentId, userId), resultSet.getString("alignment_name"), resultSet.getInt("alignment_sid"), resultSet.getBoolean("alignment_is_author"));
        }

        PlayerCharacter playerCharacter = new PlayerCharacter(
                MySql.encodeId(characterId, userId),
                resultSet.getString("name"),
                alignment,
                resultSet.getInt("exp"),
                resultSet.getBoolean("inspiration"),
                resultSet.getInt("hp_gain_modifier"),
                HealthCalculationType.valueOf(resultSet.getInt("health_calculation_type_id")),
                getCharacteristics(resultSet, userId),
                resultSet.getString("campaign_token"),
                resultSet.getString("image_file_location"),
                CHARACTER_IMAGE_DIRECTORY
        );

        List<CreatureFilter> filters = CreatureService.getFilters(statement, userId);
        playerCharacter.setFilters(filters);
        List<CreatureSort> sorts = CreatureService.getSorts(statement);
        playerCharacter.setSorts(sorts);

        // Race
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            CharacterRace characterRace = getCharacterRace(statement, resultSet, userId);
            playerCharacter.setCharacterRace(characterRace);
        }

        // Classes
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ChosenClass> classes = getChosenClasses(statement, resultSet, userId);
            playerCharacter.setClasses(classes);
        }

        // Background
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            CharacterBackground characterBackground = getCharacterBackground(statement, resultSet, userId);
            playerCharacter.setCharacterBackground(characterBackground);
        }

        // Ability Scores
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setAbilityScores(CreatureService.getAbilityScores(resultSet, userId));
        }

        // AC Abilities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setAcAbilities(CreatureService.getAcAbilities(resultSet, userId));
        }

        // Wealth
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setCreatureWealth(CreatureService.getWealth(resultSet, userId));
        }

        // Health
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                playerCharacter.setCreatureHealth(CreatureService.getCreatureHealth(statement, resultSet));
            }
        }

        // Attribute Profs
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setAttributeProfs(CreatureService.getAttributeProfs(resultSet, userId));
        }

        // Item Profs
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setItemProfs(CreatureService.getItemProfs(resultSet, userId));
        }

        // Damage Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setDamageModifiers(CreatureService.getDamageModifiers(resultSet, userId));
        }

        // Condition Immunities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setConditionImmunities(CreatureService.getConditionImmunities(resultSet, userId));
        }

        // Senses
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setSenses(CreatureService.getSenses(resultSet));
        }

        // Active Conditions
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setActiveConditions(CreatureService.getActiveConditions(statement, resultSet, userId));
        }

        // Spell Tags
        List<Tag> spellTags = new ArrayList<>();
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            spellTags = CreatureService.getTags(resultSet, userId, PowerType.SPELL);
        }

        // Feature Tags
        List<Tag> featureTags = new ArrayList<>();
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            featureTags = CreatureService.getTags(resultSet, userId, PowerType.FEATURE);
        }

        // Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setCreatureSpellCasting(CreatureService.getCreatureSpellCasting(statement, resultSet, userId, spellcastingAbilityId, spellTags));
        }

        // Settings
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setCharacterSettings(getCharacterSettings(statement, resultSet));
        }

        // Ability Scores to Increase by One
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setAbilitiesToIncreaseByOne(getAbilityScoresToIncreaseByOne(resultSet, userId));
        }

        // Favorite Actions
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setFavoriteActions(CreatureService.getCreatureActions(resultSet, userId));
        }

        // Items
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setItems(CreatureItemService.getItems(statement, resultSet, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            playerCharacter.setCompanions(getCompanions(resultSet, userId));
        }

        playerCharacter.setCreatureFeatures(getCreatureFeatures(characterId, characterUserId, filters, sorts, featureTags));
        playerCharacter.getCreatureSpellCasting().setSpells(CreatureService.getCreatureSpells(characterId, characterUserId, filters, sorts, false));
//        playerCharacter.getCreatureSpellCasting().setActiveSpells(CreatureService.getActiveSpells(characterId, characterUserId, sorts));
        playerCharacter.setCharacterNotes(getCharacterNotes(characterId, characterUserId, filters, sorts));
        playerCharacter.setConditions(CreatureService.getAttributes(AttributeType.CONDITION, filters, sorts, characterUserId));
        playerCharacter.setSkills(CreatureService.getAttributes(AttributeType.SKILL, filters, sorts, characterUserId));

        addMaxToSpellSlots(playerCharacter.getCreatureSpellCasting().getSpellSlots(), playerCharacter, characterUserId);

        return playerCharacter;
    }

    private static List<CompanionListObject> getCompanions(ResultSet resultSet, int userId) throws Exception {
        List<CompanionListObject> companions = new ArrayList<>();
        while (resultSet.next()) {
            companions.add(new CompanionListObject(
                    MySql.encodeId(resultSet.getLong("id"), userId),
                    resultSet.getString("name"),
                    resultSet.getInt("sid"),
                    resultSet.getBoolean("is_author"),
                    CompanionType.valueOf(resultSet.getInt("companion_type_id")),
                    new CreatureHealth(
                            resultSet.getInt("current_hp"),
                            resultSet.getInt("temp_hp"),
                            resultSet.getInt("max_hp_mod"),
                            null,
                            resultSet.getInt("num_death_saving_throw_successes"),
                            resultSet.getInt("num_death_saving_throw_failures"),
                            resultSet.getInt("death_save_mod"),
                            resultSet.getBoolean("death_save_advantage"),
                            resultSet.getBoolean("death_save_disadvantage"),
                            resultSet.getInt("resurrection_penalty"),
                            CreatureState.valueOf(resultSet.getInt("creature_state")),
                            resultSet.getInt("exhaustion_level")
                    ),
                    resultSet.getInt("max_hp")
            ));
        }
        return companions;
    }

    private static Spellcasting getCharacteristicSpellcasting(ResultSet resultSet) throws Exception {
        return new Spellcasting(
                resultSet.getBoolean("prof"),
                resultSet.getBoolean("double_prof"),
                resultSet.getBoolean("half_prof"),
                resultSet.getBoolean("round_up"),
                resultSet.getInt("misc_modifier"),
                resultSet.getBoolean("advantage"),
                resultSet.getBoolean("disadvantage"),
                AttackType.valueOf(resultSet.getInt("attack_type_id"))
        );
    }

    private CharacterRace getCharacterRace(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long spellcastingAbilityId = 0;
        if (resultSet.next()) {
            spellcastingAbilityId = resultSet.getLong("race_spellcasting_ability_id");
        }
        CharacterRace characterRace = new CharacterRace(
                MySql.encodeId(spellcastingAbilityId, userId)
        );

        // Race
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                Race race = RaceService.getRaceFull(statement, resultSet, userId, false, true);
                characterRace.setRace(race);
            }
        }

        // Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();

            // Spellcasting - Attack
            if (resultSet.next()) {
                Spellcasting attack = getCharacteristicSpellcasting(resultSet);
                characterRace.setSpellcastingAttack(attack);
            }

            // Spellcasting - Save
            if (resultSet.next()) {
                Spellcasting save = getCharacteristicSpellcasting(resultSet);
                characterRace.setSpellcastingSave(save);
            }
        }

        return characterRace;
    }

    private CharacterBackground getCharacterBackground(Statement statement, ResultSet resultSet, int userId) throws Exception {
        CharacterBackground characterBackground = new CharacterBackground();
        if (resultSet.next()) {
            characterBackground = new CharacterBackground(
                    resultSet.getString("custom_background_name"),
                    resultSet.getString("custom_background_variation"),
                    resultSet.getString("custom_background_personality"),
                    resultSet.getString("custom_background_ideal"),
                    resultSet.getString("custom_background_bond"),
                    resultSet.getString("custom_background_flaw"),
                    resultSet.getString("bio"),
                    MySql.encodeId(resultSet.getLong("background_spellcasting_ability_id"), userId)
            );
        }

        // Background
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                Background background = BackgroundService.getFullBackground(statement, resultSet, userId, false, true);
                characterBackground.setBackground(background);
            }
        }

        // Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();

            // Spellcasting - Attack
            if (resultSet.next()) {
                Spellcasting attack = getCharacteristicSpellcasting(resultSet);
                characterBackground.setSpellcastingAttack(attack);
            }

            // Spellcasting - Save
            if (resultSet.next()) {
                Spellcasting save = getCharacteristicSpellcasting(resultSet);
                characterBackground.setSpellcastingSave(save);
            }
        }

        // Chosen Traits
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<BackgroundTrait> chosenTraits = getChosenTraits(resultSet, userId);
            characterBackground.setChosenTraits(chosenTraits);
        }

        return characterBackground;
    }

    private Characteristics getCharacteristics(ResultSet resultSet, int userId) throws Exception {
        ListObject deity = null;
        long deityId = resultSet.getLong("deity_id");
        if (deityId != 0) {
            deity = new ListObject(
                    MySql.encodeId(deityId, userId),
                    resultSet.getString("deity_name"),
                    resultSet.getInt("deity_sid"),
                    resultSet.getBoolean("deity_is_author")
            );
        }
        return new Characteristics(
                resultSet.getString("height"),
                resultSet.getString("eyes"),
                resultSet.getString("hair"),
                resultSet.getString("skin"),
                Gender.valueOf(resultSet.getInt("gender_id")),
                resultSet.getInt("age"),
                resultSet.getInt("weight"),
                deity
        );
    }

    /****************************** Character Chosen Classes *********************************/

    private List<ChosenClass> getChosenClasses(Statement statement, ResultSet resultSet, int userId) throws Exception {
        List<ChosenClass> chosenClasses = new ArrayList<>();
        List<Long> chosenClassIds = new ArrayList<>();
        while (resultSet.next()) {
            chosenClassIds.add(resultSet.getLong("id"));
        }

        for (Long id : chosenClassIds) {
            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                ChosenClass chosenClass = getChosenClass(statement, resultSet, userId);
                chosenClasses.add(chosenClass);
            }
        }

        return chosenClasses;
    }

    private ChosenClass getChosenClass(Statement statement, ResultSet resultSet, int userId) throws Exception {
        ChosenClass chosenClass = new ChosenClass();
        if (resultSet.next()) {
            chosenClass = new ChosenClass(
                    MySql.encodeId(resultSet.getLong("id"), userId),
                    resultSet.getBoolean("primary"),
                    getCharacterLevel(resultSet, userId),
                    resultSet.getInt("num_hit_dice_mod"),
                    MySql.encodeId(resultSet.getLong("spellcasting_ability_id"), userId),
                    resultSet.getBoolean("display_spellcasting")
            );
        }

        // Character Class
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                CharacterClass characterClass = ClassService.getCharacterClassFull(statement, resultSet, userId, false, true);
                chosenClass.setCharacterClass(characterClass);
            }
        }

        // Subclass
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                CharacterClass subclass = ClassService.getCharacterClassFull(statement, resultSet, userId, false, false);
                chosenClass.setSubclass(subclass);
            }
        }

        // Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();

            // Spellcasting - Attack
            if (resultSet.next()) {
                Spellcasting attack = getCharacteristicSpellcasting(resultSet);
                chosenClass.setSpellcastingAttack(attack);
            }

            // Spellcasting - Save
            if (resultSet.next()) {
                Spellcasting save = getCharacteristicSpellcasting(resultSet);
                chosenClass.setSpellcastingSave(save);
            }
        }

        // Health Gain Results
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<HealthGainResult> healthGainResults = getHealthGainResults(resultSet, userId);
            chosenClass.setHealthGainResults(healthGainResults);
        }

        return chosenClass;
    }

    private static CharacterLevel getCharacterLevel(ResultSet resultSet, int userId) throws Exception {
        return new CharacterLevel(
                MySql.encodeId(resultSet.getLong("level_id"), userId),
                resultSet.getString("level_name"),
                resultSet.getString("level_description"),
                resultSet.getInt("level_sid"),
                resultSet.getBoolean("level_is_author"),
                resultSet.getInt("level_version"),
                resultSet.getInt("min_exp"),
                resultSet.getInt("prof_bonus")
        );
    }

    private List<HealthGainResult> getHealthGainResults(ResultSet resultSet, int userId) throws Exception {
        List<HealthGainResult> healthGainResults = new ArrayList<>();
        while (resultSet.next()) {
            healthGainResults.add(getHealthGainResult(resultSet, userId));
        }
        return healthGainResults;
    }

    private HealthGainResult getHealthGainResult(ResultSet resultSet, int userId) throws Exception {
        return new HealthGainResult(
                new ListObject(MySql.encodeId(resultSet.getLong("level_id"), userId), resultSet.getString("name"), resultSet.getInt("sid"), resultSet.getBoolean("is_author")),
                resultSet.getInt("value")
        );
    }

    public static void updateCharacterInspiration(String id, boolean inspired, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);
        updateCharacterInspiration(characterId, inspired);
    }

    private static void updateCharacterInspiration(long characterId, boolean inspired) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE `characters` SET `inspiration`=?  WHERE `creature_id` = ?");
            statement.setBoolean(1, inspired);
            statement.setLong(2, characterId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateCreatureHealth(String id, CharacterHealthConfiguration characterHealthConfiguration, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            CreatureService.updateCreatureHealth(creatureId, characterHealthConfiguration.getCreatureHealth(), connection);
            updateHealthCalculation(creatureId, characterHealthConfiguration.getHpGainModifier(), characterHealthConfiguration.getHealthCalculationType(), connection);
            deleteHealthGainResults(creatureId, connection);
            for (ChosenClass chosenClass : characterHealthConfiguration.getClasses()) {
                long classId = MySql.decodeId(chosenClass.getId(), userId);
                updateHealthGainResults(classId, chosenClass.getHealthGainResults(), userId, connection);
                updateHitDiceMod(chosenClass, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    private static void updateHealthCalculation(long characterId, int hpGainModifier, HealthCalculationType healthCalculationType, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE `characters` SET `hp_gain_modifier`=?, `health_calculation_type_id`=? WHERE `creature_id` = ?");

            statement.setInt(1, MySql.getValue(hpGainModifier, 0, 99));
            statement.setInt(2, healthCalculationType.getValue());
            statement.setLong(3, characterId);

            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static void updateExp(String id, int exp, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);
        updateExp(characterId, exp);
    }

    private static void updateExp(long characterId, int exp) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE `characters` SET `exp`=? WHERE `creature_id` = ?");

            statement.setInt(1, MySql.getValue(exp, 0, 999999));
            statement.setLong(2, characterId);
            statement.executeUpdate();
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateChosenClasses(String id, List<ChosenClass> chosenClasses, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            updateChosenClasses(characterId, chosenClasses, userId, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    public static void updateChosenClassesSpellcasting(String id, List<ChosenClass> chosenClasses, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareStatement("UPDATE character_chosen_classes SET `display_spellcasting` = ? WHERE id = ?");

            for (ChosenClass chosenClass : chosenClasses) {
                statement.setBoolean(1, chosenClass.isDisplaySpellcasting());
                MySql.setId(2, chosenClass.getId(), userId, statement);
                statement.addBatch();
            }
            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static List<Long> getDeletedClasses(long characterId, List<ChosenClass> chosenClasses, int userId, Connection connection) throws Exception {
        List<Long> classes = getChosenClasses(characterId, connection);
        List<Long> deleted = new ArrayList<>();
        for(long classId : classes) {
            if (!hasClass(classId, chosenClasses, userId)) {
                deleted.add(classId);
            }
        }
        return deleted;
    }

    private static List<Long> getChosenClasses(long characterId, Connection connection) throws Exception {
        List<Long> classes = new ArrayList<>();
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        try {
            statement = connection.prepareStatement("SELECT class_id FROM character_chosen_classes WHERE character_id = ?");
            statement.setLong(1, characterId);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                classes.add(resultSet.getLong("class_id"));
            }

            resultSet.close();
            statement.close();
        } catch (Exception e) {
            if (resultSet != null) {
                resultSet.close();
            }
            if (statement != null) {
                statement.close();
            }
            throw e;
        }

        return classes;
    }

    private static boolean hasClass(long classId, List<ChosenClass> chosenClasses, int userId) throws Exception {
        for (int i = 0; i < chosenClasses.size(); i++) {
            ChosenClass current = chosenClasses.get(i);
            if (current.getId() != null && MySql.decodeId(current.getCharacterClass().getId(), userId) == classId) {
                return true;
            }
        }
        return false;
    }

    private static List<ChosenClass> getClasses(List<ChosenClass> classes, boolean isNew, int userId) throws Exception {
        List<ChosenClass> matched = new ArrayList<>();
        for (ChosenClass chosenClass : classes) {
            long id = MySql.decodeId(chosenClass.getId(), userId);
            if ((isNew && (id == 0)) || (!isNew && chosenClass.getId() != null && id != 0)) {
                matched.add(chosenClass);
            }
        }
        return matched;
    }

    private static void updateChosenClasses(long characterId, List<ChosenClass> chosenClasses, int userId, Connection connection) throws Exception {
        List<Long> deletedClasses = getDeletedClasses(characterId, chosenClasses, userId, connection);
        try {
            deleteChosenClasses(characterId, deletedClasses, userId, connection);
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }
        deleteHealthGainResults(characterId, connection);
        updateChosenClasses(getClasses(chosenClasses, false, userId), userId, connection);
        addChosenClasses(characterId, getClasses(chosenClasses, true, userId), userId, connection);
    }

    private static void updateChosenClasses(List<ChosenClass> chosenClasses, int userId, Connection connection) throws Exception {
        if (chosenClasses.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE character_chosen_classes SET `primary` = ?, class_id = ?, subclass_id = ?, level_id = ?, num_hit_dice_mod = ?, spellcasting_ability_id = ? WHERE id = ?");

            for (ChosenClass chosenClass : chosenClasses) {
                long id = MySql.decodeId(chosenClass.getId(), userId);
                statement.setBoolean(1, chosenClass.isPrimary());
                MySql.setId(2, chosenClass.getCharacterClass().getId(), userId, statement);
                MySql.setId(3, chosenClass.getSubclass() == null ? null : chosenClass.getSubclass().getId(), userId, statement);
                MySql.setId(4, chosenClass.getCharacterLevel().getId(), userId, statement);
                statement.setInt(5, MySql.getValue(chosenClass.getNumHitDiceMod(), 0, 99));
                MySql.setId(6, chosenClass.getSpellcastingAbility(), userId, statement);
                statement.setLong(7, id);
                statement.executeUpdate();

                updateHealthGainResults(id, chosenClass.getHealthGainResults(), userId, connection);
            }

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addChosenClasses(long characterId, List<ChosenClass> chosenClasses, int userId, Connection connection) throws Exception {
        if (chosenClasses.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `character_chosen_classes` (`character_id`, `primary`, `class_id`, `subclass_id`," +
                    " `level_id`, `num_hit_dice_mod`, `spellcasting_ability_id`, `display_spellcasting`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", Statement.RETURN_GENERATED_KEYS);

            for (ChosenClass chosenClass : chosenClasses) {
                statement.setLong(1, characterId);
                statement.setBoolean(2, chosenClass.isPrimary());
                MySql.setId(3, chosenClass.getCharacterClass().getId(), userId, statement);
                MySql.setId(4, chosenClass.getSubclass() == null ? null : chosenClass.getSubclass().getId(), userId, statement);
                MySql.setId(5, chosenClass.getCharacterLevel().getId(), userId, statement);
                statement.setInt(6, MySql.getValue(chosenClass.getNumHitDiceMod(), 0, 99));
                MySql.setId(7, chosenClass.getSpellcastingAbility(), userId, statement);
                statement.setBoolean(8, true); //display spellcasting
                statement.executeUpdate(); //this can't be batched because we need the id

                long id = MySql.getGeneratedLongId(statement);
                updateHealthGainResults(id, chosenClass.getHealthGainResults(), userId, connection);
            }

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateHitDiceMod(ChosenClass chosenClass, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE `character_chosen_classes` SET `num_hit_dice_mod` = ? WHERE id = ?");
            statement.setInt(1, MySql.getValue(chosenClass.getNumHitDiceMod(), 0, 99));
            MySql.setId(2, chosenClass.getId(), userId, statement);
            statement.executeUpdate();

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateHealthGainResults(long chosenClassId, List<HealthGainResult> healthGainResults, int userId, Connection connection) throws Exception {
        if (healthGainResults.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `character_health_gain_results` (`chosen_class_id`, `level_id`, `value`) VALUES (?, ?, ?);");
            for (HealthGainResult healthGainResult : healthGainResults) {
                statement.setLong(1, chosenClassId);
                MySql.setId(2, healthGainResult.getLevel().getId(), userId, statement);
                statement.setInt(3, MySql.getValue(healthGainResult.getValue(), 0, 999));
                statement.addBatch();
            }
            statement.executeBatch();

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteChosenClasses(long characterId, List<Long> deletedClasses, int userId, Connection connection) throws  Exception {
        for (Long chosenClassId : deletedClasses) {
            deleteChosenClass(characterId, chosenClassId, userId, connection);
        }
    }

    private static void deleteChosenClass(long characterId, long classId, int userId, Connection connection) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Creatures_Delete_ChosenClass(?,?,?)}");
            statement.setLong(1, characterId);
            statement.setLong(2, classId);
            statement.setInt(3, userId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteCharacteristic(long characterId, long characteristicId, int userId, Connection connection) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Creatures_Delete_Characteristic(?,?,?)}");
            statement.setLong(1, characterId);
            statement.setLong(2, characteristicId);
            statement.setInt(3, userId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteHealthGainResults(long characterId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE chgr FROM character_chosen_classes ccc JOIN character_health_gain_results chgr ON chgr.chosen_class_id = ccc.id WHERE ccc.character_id = ?");
            statement.setLong(1, characterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /****************************** Ability Scores to Increase by One *********************************/

    private List<ListObject> getAbilityScoresToIncreaseByOne(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> abilityScores = new ArrayList<>();
        while (resultSet.next()) {
            abilityScores.add(MySql.getListObject(resultSet, userId));
        }
        return abilityScores;
    }

    private void updateAbilityScoresToIncreaseByOne(long characterId, List<ListObject> abilityScores, int userId, Connection connection) throws Exception {
        deleteAbilityScoresToIncreaseByOne(characterId, connection);
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `character_ability_scores_to_increase` (`character_id`, `ability_id`) VALUES (?, ?);");
            for (ListObject ability : abilityScores) {
                statement.setLong(1, characterId);
                MySql.setId(2, ability, userId, statement);
                statement.addBatch();
            }
            statement.executeBatch();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAbilityScoresToIncreaseByOne(long characterId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM character_ability_scores_to_increase WHERE character_id = ?");
            statement.setLong(1, characterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /****************************** Character Notes *********************************/

    public CharacterNote insertNote(String characterIdStr, CharacterNote characterNote, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(characterIdStr, userId);
        CharacterNote updatedNote = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            String noteCategory = null;
            if (characterNote.getCharacterNoteCategory() != null && !characterNote.getCharacterNoteCategory().getName().equals("")) {
                noteCategory = characterNote.getCharacterNoteCategory().getName();
            }

            statement = connection.prepareCall("{call Character_Notes_Add(?,?,?,?)}");
            statement.setLong(1, characterId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(noteCategory, 45));
            statement.setString(4, MySql.getValue(characterNote.getNote(), 1000));
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    updatedNote = getCharacterNote(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (updatedNote == null) {
            throw new Exception("unable to add note");
        }
        return updatedNote;
    }

    public CharacterNote updateNote(String characterIdStr, String noteIdStr, CharacterNote characterNote, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(characterIdStr, userId);
        long noteId = MySql.decodeId(noteIdStr, userId);

        Connection connection = null;
        CallableStatement statement = null;
        CharacterNote updatedNote = null;

        try {
            connection = MySql.getConnection();

            String noteCategory = null;
            if (characterNote.getCharacterNoteCategory() != null && !characterNote.getCharacterNoteCategory().getName().equals("")) {
                noteCategory = characterNote.getCharacterNoteCategory().getName();
            }

            statement = connection.prepareCall("{call Character_Notes_Update(?,?,?,?,?)}");
            statement.setLong(1, noteId);
            statement.setLong(2, characterId);
            statement.setInt(3, userId);
            statement.setString(4, MySql.getValue(noteCategory, 45));
            statement.setString(5, MySql.getValue(characterNote.getNote(), 1000));
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    updatedNote = getCharacterNote(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (updatedNote == null) {
            throw new Exception("unable to update note");
        }

        return characterNote;
    }

    public static List<CharacterNote> getCharacterNotes(String id, FilterSorts filterSorts, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);
        return getFilteredCharacterNotes(characterId, userId, filterSorts.getFilters().getFilterValues(), filterSorts.getSorts().getSortValues());
    }

    private List<CharacterNote> getCharacterNotes(long characterId, int userId, List<CreatureFilter> creatureFilters, List<CreatureSort> creatureSorts) throws Exception {
        List<FilterValue> filters = FilterService.getFilters(creatureFilters, FilterType.NOTE);
        List<SortValue> sorts = SortService.getSorts(creatureSorts, SortType.NOTE);
        return getFilteredCharacterNotes(characterId, userId, filters, sorts);
    }

    private static List<CharacterNote> getFilteredCharacterNotes(long characterId, int userId, List<FilterValue> filters, List<SortValue> sorts) throws Exception {
        List<CharacterNote> characterNotes = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = getNotesCallableStatement(characterId, userId, connection, filters, sorts);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    characterNotes.add(getCharacterNote(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return characterNotes;
    }

    private static CallableStatement getNotesCallableStatement(long characterId, int userId, Connection connection, List<FilterValue> filters, List<SortValue> sorts) throws Exception {
        String category = FilterService.getFilterValue(filters, FilterKey.NOTE_CATEGORY);
        String categoryValue = null;
        if (category != null && !category.equals(FilterValue.DEFAULT_OPTION)) {
            categoryValue = category;
        }

        CallableStatement statement = connection.prepareCall("{CALL Character_Notes_GetList(?,?,?)}");
        statement.setLong(1, characterId);
        statement.setInt(2, userId);
        MySql.setString(3, categoryValue, statement);
        return statement;
    }

    private static String getNoteSortColumn(SortValue sortValue) {
        switch (sortValue.getSortKey()) {
            case CATEGORY:
                return "category";
            case DATE:
            default:
                return "date";
        }
    }

    private static CharacterNote getCharacterNote(ResultSet resultSet, int userId) throws Exception {
        CharacterNoteCategory characterNoteCategory = null;
        long categoryId = resultSet.getLong("category_id");
        if (categoryId > 0) {
            characterNoteCategory = new CharacterNoteCategory(
                    MySql.encodeId(categoryId, userId),
                    resultSet.getString("category_name"),
                    resultSet.getBoolean("expanded")
            );
        }
        return new CharacterNote(
                MySql.encodeId(resultSet.getLong("id"), userId),
                characterNoteCategory,
                resultSet.getString("note"),
                resultSet.getDate("date")
        );
    }

    public void deleteNote(String characterIdStr, String noteIdStr, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(characterIdStr, userId);
        long noteId = MySql.decodeId(noteIdStr, userId);

        Connection connection = null;
        CallableStatement statement = null;
        boolean success = false;

        try {
            connection = MySql.getConnection();

            statement = connection.prepareCall("{call Character_Notes_Delete(?,?,?)}");
            statement.setLong(1, noteId);
            statement.setLong(2, characterId);
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("success");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (!success) {
            throw new Exception("unable to delete note");
        }
    }

    public void updateNoteOrder(CharacterNoteOrder characterNoteOrder, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        Connection connection = null;
        PreparedStatement statement = null;

        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE character_notes SET `order` = ? WHERE id = ?");
            for (int i = 0; i < characterNoteOrder.getNotes().size(); i++) {
                CharacterNote characterNote = characterNoteOrder.getNotes().get(i);
                statement.setInt(1, i);
                MySql.setId(2, characterNote.getId(), userId, statement);
                statement.addBatch();
            }
            statement.executeBatch();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public void updateNoteCategory(CharacterNoteCategory characterNoteCategory, HttpHeaders headers) {
        int userId = AuthenticationService.getUserId(headers);
        Connection connection = null;
        PreparedStatement statement = null;

        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE character_note_categories SET `expanded` = ? WHERE id = ?");
            statement.setBoolean(1, characterNoteCategory.isExpanded());
            MySql.setId(2, characterNoteCategory.getId(), userId, statement);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /****************************** Character Settings *********************************/

    private CharacterSettings getCharacterSettings(Statement statement, ResultSet resultSet) throws Exception {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        List<CharacterPage> pages = new ArrayList<>();

        //setting values
        while(resultSet.next()) {
            CharacterSettingCategory category = CharacterSettingCategory.valueOf(resultSet.getInt("character_setting_category_id"));
            CharacterSetting setting = CharacterSetting.valueOf(resultSet.getInt("character_setting_id"));
            int value = resultSet.getInt("value");

            CharacterSettingValue settingValue = new CharacterSettingValue(category, setting, value);
            settingValues.add(settingValue);
        }

        //pages
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();

            while (resultSet.next()) {
                pages.add(getCharacterPage(resultSet));
            }
        }
        return getCharacterSettings(settingValues, pages);
    }

    private CharacterSettings getCharacterSettings(List<CharacterSettingValue> settingValues, List<CharacterPage> pages) {
        CharacterSettings characterSettings = new CharacterSettings();
        characterSettings.setPages(pages);

        for (CharacterSettingValue settingValue : settingValues) {
            processSettingValue(settingValue, characterSettings);
        }

        return characterSettings;
    }

    private void processSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getCategory()) {
            case GENERIC:
                processGenericSettingValue(settingValue, characterSettings);
                break;
            case EQUIPMENT:
                processEquipmentSettingValue(settingValue, characterSettings);
                break;
            case HEALTH:
                processHealthSettingValue(settingValue, characterSettings);
                break;
            case SPEED:
                processSpeedSettingValue(settingValue, characterSettings);
                break;
            case SPELLCASTING:
                processSpellcastingSettingValue(settingValue, characterSettings);
                break;
            case FEATURES:
                processFeaturesSettingValue(settingValue, characterSettings);
                break;
            case SKILLS:
                processSkillsSettingValue(settingValue, characterSettings);
                break;
            case VALIDATION:
                processValidationSettingValue(settingValue, characterSettings);
                break;
            case QUICK_ACTION:
                processQuickActionSettingValue(settingValue, characterSettings);
                break;
        }
    }

    private void processGenericSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case RESTRICT_TO_TWENTY:
                characterSettings.setRestrictToTwenty(settingValue.getValue() == 1);
                break;
            case MAX_COLUMNS:
                characterSettings.getMisc().setMaxColumns(settingValue.getValue());
                break;
            case HEALTH_SHOW_PROGRESS_BAR:
                characterSettings.getMisc().setShowHealthProgressBar(settingValue.getValue() == 1);
                break;
            case LEVEL_SHOW_PROGRESS_BAR:
                characterSettings.getMisc().setShowLevelProgressBar(settingValue.getValue() == 1);
                break;
            case CARRYING_SHOW_PROGRESS_BAR:
                characterSettings.getMisc().setShowCarryingProgressBar(settingValue.getValue() == 1);
                break;
        }
    }

    private void processEquipmentSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case HIDE_EMPTY_SLOTS:
                characterSettings.getEquipment().setHideEmptySlots(settingValue.getValue() == 1);
                break;
            case AUTO_CONVERT_CURRENCY:
                characterSettings.getEquipment().setAutoConvertCurrency(settingValue.getValue() == 1);
                break;
            case CALCULATE_CURRENCY_WEIGHT:
                characterSettings.getEquipment().setCalculateCurrencyWeight(settingValue.getValue() == 1);
                break;
            case USE_ENCUMBRANCE:
                characterSettings.getEquipment().setUseEncumbrance(settingValue.getValue() == 1);
                break;
            case ATTACK_WITH_UNEQUIPPED:
                characterSettings.getEquipment().setAttackWithUnequipped(settingValue.getValue() == 1);
                break;
            case MAX_ATTUNED_ITEMS:
                characterSettings.getEquipment().setMaxAttunedItems(settingValue.getValue());
                break;
            case ENFORCE_ATTUNED_LIMIT:
                characterSettings.getEquipment().setEnforceAttunedLimit(settingValue.getValue() == 1);
                break;
        }
    }

    private void processHealthSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case SHOW_HIT_DICE:
                characterSettings.getHealth().setShowHitDice(settingValue.getValue() == 1);
                break;
            case HIGHLIGHT_VALUES:
                characterSettings.getHealth().setHighlightValues(settingValue.getValue() == 1);
                break;
            case FLASH_LCD:
                characterSettings.getHealth().setFlashLCD(settingValue.getValue() == 1);
                break;
            case AUTO_ROLL_CONCENTRATION_CHECKS:
                characterSettings.getHealth().setAutoRollConcentrationChecks(settingValue.getValue() == 1);
                break;
            case POSTPONE_CONCENTRATION_CHECKS:
                characterSettings.getHealth().setPostponeConcentrationChecks(settingValue.getValue() == 1);
                break;
            case REMOVE_PRONE_ON_REVIVE:
                characterSettings.getHealth().setRemoveProneOnRevive(settingValue.getValue() == 1);
                break;
            case DROP_ITEMS_WHEN_DYING:
                characterSettings.getHealth().setDropItemsWhenDying(settingValue.getValue() == 1);
                break;
        }
    }

    private void processSpeedSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case SPEED_TO_DISPLAY:
                characterSettings.getSpeed().setSpeedToDisplay(SpeedType.valueOf(settingValue.getValue()));
                break;
            case SWIMMING_USE_HALF:
                characterSettings.getSpeed().getSwimming().setUseHalf(settingValue.getValue() == 1);
                break;
            case SWIMMING_ROUND_UP:
                characterSettings.getSpeed().getSwimming().setRoundUp(settingValue.getValue() == 1);
                break;
            case CRAWLING_USE_HALF:
                characterSettings.getSpeed().getCrawling().setUseHalf(settingValue.getValue() == 1);
                break;
            case CRAWLING_ROUND_UP:
                characterSettings.getSpeed().getCrawling().setRoundUp(settingValue.getValue() == 1);
                break;
            case CLIMBING_USE_HALF:
                characterSettings.getSpeed().getClimbing().setUseHalf(settingValue.getValue() == 1);
                break;
            case CLIMBING_ROUND_UP:
                characterSettings.getSpeed().getClimbing().setRoundUp(settingValue.getValue() == 1);
                break;
        }
    }

    private void processSpellcastingSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case DISPLAY_CLASS_SPELLCASTING:
                characterSettings.getSpellcasting().setDisplayClassSpellcasting(settingValue.getValue() == 1);
                break;
            case DISPLAY_RACE_SPELLCASTING:
                characterSettings.getSpellcasting().setDisplayRaceSpellcasting(settingValue.getValue() == 1);
                break;
            case DISPLAY_BACKGROUND_SPELLCASTING:
                characterSettings.getSpellcasting().setDisplayBackgroundSpellcasting(settingValue.getValue() == 1);
                break;
            case DISPLAY_OTHER_SPELLCASTING:
                characterSettings.getSpellcasting().setDisplayOtherSpellcasting(settingValue.getValue() == 1);
                break;
            case SPELLS_DISPLAY_TAGS:
                characterSettings.getSpellcasting().setDisplayTags(settingValue.getValue() == 1);
                break;
            case SPELLS_HIGHLIGHT_ACTIVE:
                characterSettings.getSpellcasting().setHighlightActive(settingValue.getValue() == 1);
                break;
        }
    }

    private void processFeaturesSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case FEATURES_DISPLAY_TAGS:
                characterSettings.getFeatures().setDisplayTags(settingValue.getValue() == 1);
                break;
            case FEATURES_HIGHLIGHT_ACTIVE:
                characterSettings.getFeatures().setHighlightActive(settingValue.getValue() == 1);
                break;
            case FEATURES_HIGHLIGHT_NON_ACTIVE:
                characterSettings.getFeatures().setHighlightNonActive(settingValue.getValue() == 1);
                break;
        }
    }

    private void processSkillsSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case DISPLAY_PASSIVE:
                characterSettings.getSkills().setDisplayPassive(settingValue.getValue() == 1);
                break;
        }
    }

    private void processValidationSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case ALLOW_FEAT_SELECTION:
                characterSettings.getValidation().setAllowFeatSelection(settingValue.getValue() == 1);
                break;
            case ASI_FEAT_ONE_ONLY:
                characterSettings.getValidation().setAsiFeatOneOnly(settingValue.getValue() == 1);
                break;
            case AUTO_IGNORE_UNSELECTED_FEATURES:
                characterSettings.getValidation().setAutoIgnoreUnselectedFeatures(settingValue.getValue() == 1);
                break;
            case AUTO_IGNORE_UNSELECTED_SPELLS:
                characterSettings.getValidation().setAutoIgnoreUnselectedSpells(settingValue.getValue() == 1);;
                break;
            case AUTO_IGNORE_UNSELECTED_ASI:
                characterSettings.getValidation().setAutoIgnoreUnselectedAsi(settingValue.getValue() == 1);
                break;
        }
    }

    private void processQuickActionSettingValue(CharacterSettingValue settingValue, CharacterSettings characterSettings) {
        switch (settingValue.getSetting()) {
            case HIDE_UNPREPARED_SPELL_QUICK_ATTACKS:
                characterSettings.getQuickActions().setHideUnpreparedSpells(settingValue.getValue() == 1);
                break;
        }
    }

    public void updateSettings(long characterId, CharacterSettings settings, Connection connection) throws Exception {
        List<CharacterSettingValue> settingValues = getSettingValuesList(settings);
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Character_Settings_Update (?, ?, ?)}");

            for (CharacterSettingValue settingValue : settingValues) {
                statement.setLong(1, characterId);
                statement.setInt(2, settingValue.getSetting().getValue());
                statement.setInt(3, settingValue.getValue());
                statement.addBatch();
            }

            statement.executeBatch();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterSettings characterSettings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.GENERIC, CharacterSetting.RESTRICT_TO_TWENTY, characterSettings.isRestrictToTwenty()));
        settingValues.addAll(getSettingValuesList(characterSettings.getMisc()));
        settingValues.addAll(getSettingValuesList(characterSettings.getHealth()));
        settingValues.addAll(getSettingValuesList(characterSettings.getEquipment()));
        settingValues.addAll(getSettingValuesList(characterSettings.getSpeed()));
        settingValues.addAll(getSettingValuesList(characterSettings.getSpellcasting()));
        settingValues.addAll(getSettingValuesList(characterSettings.getFeatures()));
        settingValues.addAll(getSettingValuesList(characterSettings.getSkills()));
        settingValues.addAll(getSettingValuesList(characterSettings.getValidation()));
        settingValues.addAll(getSettingValuesList(characterSettings.getQuickActions()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterMiscSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.GENERIC, CharacterSetting.MAX_COLUMNS, settings.getMaxColumns()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.GENERIC, CharacterSetting.HEALTH_SHOW_PROGRESS_BAR, settings.isShowHealthProgressBar()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.GENERIC, CharacterSetting.LEVEL_SHOW_PROGRESS_BAR, settings.isShowLevelProgressBar()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.GENERIC, CharacterSetting.CARRYING_SHOW_PROGRESS_BAR, settings.isShowCarryingProgressBar()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterHealthSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.HEALTH, CharacterSetting.SHOW_HIT_DICE, settings.isShowHitDice()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.HEALTH, CharacterSetting.HIGHLIGHT_VALUES, settings.isHighlightValues()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.HEALTH, CharacterSetting.FLASH_LCD, settings.isFlashLCD()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.HEALTH, CharacterSetting.AUTO_ROLL_CONCENTRATION_CHECKS, settings.isAutoRollConcentrationChecks()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.HEALTH, CharacterSetting.POSTPONE_CONCENTRATION_CHECKS, settings.isPostponeConcentrationChecks()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.HEALTH, CharacterSetting.REMOVE_PRONE_ON_REVIVE, settings.isRemoveProneOnRevive()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.HEALTH, CharacterSetting.DROP_ITEMS_WHEN_DYING, settings.isDropItemsWhenDying()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterEquipmentSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.EQUIPMENT, CharacterSetting.HIDE_EMPTY_SLOTS, settings.isHideEmptySlots()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.EQUIPMENT, CharacterSetting.AUTO_CONVERT_CURRENCY, settings.isAutoConvertCurrency()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.EQUIPMENT, CharacterSetting.CALCULATE_CURRENCY_WEIGHT, settings.isCalculateCurrencyWeight()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.EQUIPMENT, CharacterSetting.USE_ENCUMBRANCE, settings.isUseEncumbrance()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.EQUIPMENT, CharacterSetting.ATTACK_WITH_UNEQUIPPED, settings.isAttackWithUnequipped()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.EQUIPMENT, CharacterSetting.MAX_ATTUNED_ITEMS, settings.getMaxAttunedItems()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.EQUIPMENT, CharacterSetting.ENFORCE_ATTUNED_LIMIT, settings.isEnforceAttunedLimit()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterSpeedSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.SPEED_TO_DISPLAY, settings.getSpeedToDisplay().getValue()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.SWIMMING_USE_HALF, settings.getSwimming().isUseHalf()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.SWIMMING_ROUND_UP, settings.getSwimming().isRoundUp()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CLIMBING_USE_HALF, settings.getClimbing().isUseHalf()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CLIMBING_ROUND_UP, settings.getClimbing().isRoundUp()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CRAWLING_USE_HALF, settings.getCrawling().isUseHalf()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CRAWLING_ROUND_UP, settings.getCrawling().isRoundUp()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterSpellcastingSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPELLCASTING, CharacterSetting.DISPLAY_CLASS_SPELLCASTING, settings.isDisplayClassSpellcasting()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPELLCASTING, CharacterSetting.DISPLAY_RACE_SPELLCASTING, settings.isDisplayRaceSpellcasting()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPELLCASTING, CharacterSetting.DISPLAY_BACKGROUND_SPELLCASTING, settings.isDisplayBackgroundSpellcasting()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPELLCASTING, CharacterSetting.DISPLAY_OTHER_SPELLCASTING, settings.isDisplayOtherSpellcasting()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPELLCASTING, CharacterSetting.SPELLS_DISPLAY_TAGS, settings.isDisplayTags()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPELLCASTING, CharacterSetting.SPELLS_HIGHLIGHT_ACTIVE, settings.isHighlightActive()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterQuickActionSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.QUICK_ACTION, CharacterSetting.HIDE_UNPREPARED_SPELL_QUICK_ATTACKS, settings.isHideUnpreparedSpells()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterFeatureSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.FEATURES, CharacterSetting.FEATURES_DISPLAY_TAGS, settings.isDisplayTags()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.FEATURES, CharacterSetting.FEATURES_HIGHLIGHT_ACTIVE, settings.isHighlightActive()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.FEATURES, CharacterSetting.FEATURES_HIGHLIGHT_NON_ACTIVE, settings.isHighlightNonActive()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterSkillSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SKILLS, CharacterSetting.DISPLAY_PASSIVE, settings.isDisplayPassive()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterValidationSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.VALIDATION, CharacterSetting.ALLOW_FEAT_SELECTION, settings.isAllowFeatSelection()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.VALIDATION, CharacterSetting.ASI_FEAT_ONE_ONLY, settings.isAsiFeatOneOnly()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.VALIDATION, CharacterSetting.AUTO_IGNORE_UNSELECTED_FEATURES, settings.isAutoIgnoreUnselectedFeatures()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.VALIDATION, CharacterSetting.AUTO_IGNORE_UNSELECTED_SPELLS, settings.isAutoIgnoreUnselectedSpells()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.VALIDATION, CharacterSetting.AUTO_IGNORE_UNSELECTED_ASI, settings.isAutoIgnoreUnselectedAsi()));
        return settingValues;
    }

    private static void deleteSettings(long characterId) throws  Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM character_setting_values WHERE character_id = ?");
            statement.setLong(1, characterId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /****************************** Chosen Background Traits *********************************/

    private List<BackgroundTrait> getChosenTraits(ResultSet resultSet, int userId) throws Exception {
        List<BackgroundTrait> chosenTraits = new ArrayList<>();
        while (resultSet.next()) {
            chosenTraits.add(getBackgroundTrait(resultSet, userId));
        }
        return chosenTraits;
    }

    private BackgroundTrait getBackgroundTrait(ResultSet resultSet, int userId) throws Exception {
        return new BackgroundTrait(
                MySql.encodeId(resultSet.getLong("id"), userId),
                BackgroundTraitType.valueOf(resultSet.getInt("background_trait_type_id")),
                resultSet.getString("description")
        );
    }

    private void updateChosenTraits(long characterId, List<BackgroundTrait> traits, int userId, Connection connection) throws Exception {
        deleteChosenTraits(characterId, connection);
        if (traits.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `character_background_traits` (`character_id`, `background_trait_id`) VALUES (?,?);");
            for (BackgroundTrait trait : traits) {
                if (trait != null) {
                    statement.setLong(1, characterId);
                    MySql.setId(2, trait.getId(), userId, statement);
                    statement.addBatch();
                }
            }
            statement.executeBatch();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteChosenTraits(long characterId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM character_background_traits WHERE character_id = ?");
            statement.setLong(1, characterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /***************************************************************/

    private List<CharacterPage> getDefaultPageOrder() {
        List<CharacterPage> pages = new ArrayList<>();
        pages.add(new CharacterPage(CharacterPageType.BASIC, 0, true));
        pages.add(new CharacterPage(CharacterPageType.ABILITIES, 1, true));
        pages.add(new CharacterPage(CharacterPageType.QUICK_ACTIONS, 2, true));
        pages.add(new CharacterPage(CharacterPageType.EQUIPMENT, 3, true));
        pages.add(new CharacterPage(CharacterPageType.FEATURES, 4, true));
        pages.add(new CharacterPage(CharacterPageType.SPELLS, 5, true));
        pages.add(new CharacterPage(CharacterPageType.SKILLS, 6, true));
        pages.add(new CharacterPage(CharacterPageType.CONDITIONS, 7, true));
        pages.add(new CharacterPage(CharacterPageType.PROFICIENCIES, 8, true));
        pages.add(new CharacterPage(CharacterPageType.DAMAGE_MODIFIERS, 9, true));
        pages.add(new CharacterPage(CharacterPageType.COMPANIONS, 10, true));
        pages.add(new CharacterPage(CharacterPageType.CHARACTERISTICS,  11, true));
        pages.add(new CharacterPage(CharacterPageType.NOTES, 12, true));
        return pages;
    }

    public void updatePageOrder(long characterId, CharacterPages pages) throws Exception {
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            updatePageOrder(characterId, pages.getPages(), connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    public void updatePageOrder(long characterId, List<CharacterPage> pages, Connection connection) throws Exception {
        deletePageOrder(characterId, connection);
        if (pages.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `character_pages` (`character_id`, `character_page_type_id`, `order`, `visible`) VALUES (?, ?, ?, ?);");
            for (CharacterPage page : pages) {
                statement.setLong(1, characterId);
                statement.setInt(2, page.getCharacterPageType().getValue());
                statement.setInt(3, page.getOrder());
                statement.setBoolean(4, page.isVisible());
                statement.addBatch();
            }
            statement.executeBatch();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private void deletePageOrder(long characterId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM character_pages WHERE character_id = ?");
            statement.setLong(1, characterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private CharacterPage getCharacterPage(ResultSet resultSet) throws Exception {
        return new CharacterPage(
                CharacterPageType.valueOf(resultSet.getInt("character_page_type_id")),
                resultSet.getInt("order"),
                resultSet.getBoolean("visible")
        );
    }

    /************************* Campaigns **************************************/

    public static void joinCampaign(String id, String token, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);
        joinCampaign(characterId, token, userId);
    }

    private static void joinCampaign(long characterId, String token, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        boolean success = false;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_Join (?,?,?)}");
            statement.setLong(1, characterId);
            statement.setString(2, MySql.getValue(token, 36));
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        if (!success) {
            throw new Exception("Unable to join campaign");
        }
    }

    public static void leaveCampaign(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);
        leaveCampaign(characterId, userId);
    }

    private static void leaveCampaign(long characterId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        boolean success = false;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Campaigns_Leave (?,?)}");
            statement.setLong(1, characterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    int count = resultSet.getInt("count_creatures");

                    for (int i = 0; i < count; i++) {
                        if (statement.getMoreResults()) {
                            resultSet = statement.getResultSet();
                            if (resultSet.next()) {
                                boolean battleCreatureDeleteSuccess = resultSet.getBoolean("result");
                            }
                        }
                    }

                    if (statement.getMoreResults()) {
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            success = resultSet.getBoolean("valid_request");
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        if (!success) {
            throw new Exception("Unable to leave campaign");
        }
    }

    public static void deleteImage(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long characterId = MySql.decodeId(id, userId);

        String filename = getImageFilename(characterId, userId);
        ImageService.deleteImage(filename, CHARACTER_IMAGE_DIRECTORY);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE characters SET image_file_location = NULL WHERE creature_id = ?");
            statement.setLong(1, characterId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static String getImageFilename(long characterId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        String filename = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT image_file_location FROM characters ch JOIN creatures c ON ch.creature_id = c.id WHERE creature_id = ? AND user_id = ?");
            statement.setLong(1, characterId);
            statement.setInt(2, userId);
            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                filename = resultSet.getString("image_file_location");
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return filename;
    }

    public static SquireImage updateImage(String id, MultipartFormDataInput input, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        UserRole userRole = AuthenticationService.getUserRole(headers);
        if (userRole == UserRole.BASIC) {
            throw new Exception("unable to update image");
        }
        long characterId = MySql.decodeId(id, userId);
        String fileId = ImageService.getFileId(userId, characterId);
        List<String> filenames = ImageService.uploadFile(input, CHARACTER_IMAGE_DIRECTORY, fileId);
        if (filenames.size() != 1) {
            throw new Exception("unable to update image");
        }
        String imageName = filenames.get(0);

        boolean success = false;

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE characters SET image_file_location = ? WHERE creature_id = ?");
            statement.setString(1, imageName);
            statement.setLong(2, characterId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
            success = true;
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        SquireImage image = null;
        if (success) {
            image = ImageService.getImage(imageName, CHARACTER_IMAGE_DIRECTORY);
        }

        return image;
    }
}
