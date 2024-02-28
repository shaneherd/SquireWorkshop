package com.herd.squire.services.powers;

import com.herd.squire.models.Action;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.Tag;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.AreaOfEffect;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.powers.*;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.services.characteristics.CharacteristicService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.services.SharingUtilityService.CUSTOM_LEVELS;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class FeatureService implements PowerDetailsService {
    @Override
    public Power get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getFeature(statement, resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
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

        CallableStatement statement = connection.prepareCall("{call Powers_GetList_Features (?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);

        MySql.setBoolean(3, passive, statement);
        MySql.setBoolean(4, isFeat, statement);
        MySql.setInteger(5, characteristicType == null || characteristicType == CharacteristicType.FEAT ? null : characteristicType.getValue(), statement);
        MySql.setId(6, characteristicId, userId, statement);
        MySql.setBoolean(7, includeChildren, statement);
        MySql.setId(8, levelValue, userId, statement);
        MySql.setBoolean(9, isRanged, statement);
        MySql.setBoolean(10, isAreaOfEffect, statement);
        MySql.setId(11, areaOfEffectIdValue, userId, statement);

        statement.setLong(12, offset);
        statement.setLong(13, PAGE_SIZE);
        statement.setInt(14, listSource.getValue());
        return statement;
    }

    public static CallableStatement getMissingFeaturesStatement(long characterId, Connection connection, List<FilterValue> filterValues, long offset, int userId) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
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
            List<Long> tagsIdsList = PowerService.getTagIds(tags.split(","), userId);
            tagIds = MySql.joinLongIds(tagsIdsList);
        }

        CallableStatement statement = connection.prepareCall("{call Creatures_Get_MissingFeatures (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
        statement.setLong(1, characterId);
        statement.setInt(2, userId);

        MySql.setString(3, search, statement);
        MySql.setBoolean(4, passive, statement);
        MySql.setBoolean(5, isFeat, statement);
        MySql.setInteger(6, characteristicType == null || characteristicType == CharacteristicType.FEAT ? null : characteristicType.getValue(), statement);
        MySql.setId(7, characteristicId, userId, statement);
        MySql.setBoolean(8, includeChildren, statement);
        MySql.setId(9, levelValue, userId, statement);
        MySql.setBoolean(10, isRanged, statement);
        MySql.setBoolean(11, isAreaOfEffect, statement);
        MySql.setId(12, areaOfEffectIdValue, userId, statement);
        MySql.setString(13, tagIds, statement);

        statement.setLong(14, offset);
        statement.setLong(15, PAGE_SIZE);
        return statement;
    }

    public static List<FeatureListObject> getFeatures(ResultSet resultSet, int userId) throws Exception {
        List<FeatureListObject> features = new ArrayList<>();
        while (resultSet.next()) {
            features.add(getFeatureListObject(resultSet, userId));
        }
        return features;
    }

    public static Map<Long, FeatureListObject> getFeatureListObjectsMapped(Long creatureId, int userId, List<Long> featureIds) throws Exception {
        Map<Long, FeatureListObject> map = new HashMap<>();
        List<FeatureListObject> features = getCreatureFeatureListObjects(creatureId, userId, featureIds);
        for (FeatureListObject feature : features) {
            map.put(MySql.decodeId(feature.getId(), userId), feature);
        }
        return map;
    }

    public static List<FeatureListObject> getFeatureListObjects(int userId, List<Long> featureIds) throws Exception {
        List<FeatureListObject> features = new ArrayList<>();
        if (featureIds.isEmpty()) {
            return new ArrayList<>();
        }

        String ids = MySql.joinLongIds(featureIds);
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_GetList_FeaturesInList (?,?)}");
            statement.setInt(1, userId);
            statement.setString(2, MySql.getValue(ids, 500));
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    features.add(getFeatureListObject(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return features;
    }

    public static List<FeatureListObject> getCreatureFeatureListObjects(Long creatureId, int userId, List<Long> featureIds) throws Exception {
        List<FeatureListObject> features = new ArrayList<>();
        if (featureIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> listIds = MySql.joinLongIds(featureIds, 500);
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            for (String ids : listIds) {
                statement = connection.prepareCall("{call Powers_GetList_CreatureFeaturesInList (?,?,?)}");
                MySql.setLong(1, creatureId, statement);
                statement.setInt(2, userId);
                statement.setString(3, MySql.getValue(ids, 500));
                boolean hasResult = statement.execute();
                ResultSet resultSet = null;
                if (hasResult) {
                    resultSet = statement.getResultSet();
                    while (resultSet.next()) {
                        features.add(getFeatureListObject(resultSet, userId));
                    }
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    addTagsToFeatures(features, resultSet, userId);
                }
                MySql.closeConnections(resultSet, statement, null);
            }

            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return features;
    }

    private static FeatureListObject getFeatureListObject(ResultSet resultSet, int userId) throws Exception {
        ListObject characteristic = null;
        long id = resultSet.getLong("characteristic_id");
        if (id > 0) {
            characteristic = new ListObject(
                    MySql.encodeId(id, userId),
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

    public static void addTagsToFeatures(List<FeatureListObject> features, ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<Tag>> map = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            List<Tag> tags = map.computeIfAbsent(powerId, k -> new ArrayList<>());
            tags.add(getTag(resultSet, userId));
        }

        for (FeatureListObject feature : features) {
            long powerId = MySql.decodeId(feature.getId(), userId);
            List<Tag> tags = map.get(powerId);
            if (tags != null) {
                feature.setTags(tags);
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

    public Feature get(long id, int userId) throws Exception {
        if (id == 0) {
            return null;
        }
        Feature feature = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_Get_Feature (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    feature = getFeature(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return feature;
    }

    public static List<Feature> getFeatures(List<Long> ids, int userId) throws Exception {
        if (ids.isEmpty()) {
            return null;
        }
        List<Feature> features = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            for (Long id : ids) {
                statement = connection.prepareCall("{call Powers_Get_Feature (?,?)}");
                statement.setLong(1, id);
                statement.setInt(2, userId);
                boolean hasResult = statement.execute();
                if (hasResult) {
                    ResultSet resultSet = statement.getResultSet();
                    if (resultSet.next()) {
                        Feature feature = getFeature(statement, resultSet, userId);
                        if (feature != null) {
                            features.add(feature);
                        }
                    }
                    resultSet.close();
                }
            }

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return features;
    }

    public static List<FeatureListObject> getFeaturesByCharacteristicType(CharacteristicType characteristicType, int userId) throws Exception {
        List<FeatureListObject> features = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_GetList_FeaturesByCharacteristicType (?,?)}");
            statement.setInt(1, userId);
            MySql.setInteger(2, characteristicType == CharacteristicType.FEAT ? null : characteristicType.getValue(), statement);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    features.add(getFeatureListObject(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return features;
    }

    public static List<Feature> getFeaturesForCharacteristic(long characteristicId, int userId) throws Exception {
        if (characteristicId == 0) {
            return new ArrayList<>();
        }
        List<Feature> features = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_GetList_FeaturesForCharacteristic (?,?)}");
            statement.setLong(1, characteristicId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                features = getFeatures(statement, resultSet, userId);
            }

            sortFeatures(features);

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return features;
    }

    private static void sortFeatures(List<Feature> features) {
        features.sort((left, right) -> {
            ListObject leftLevel = left.getCharacterLevel();
            ListObject rightLevel = right.getCharacterLevel();
            if (leftLevel == null && rightLevel == null) {
                return left.getName().toLowerCase().compareTo(right.getName().toLowerCase());
            } else if (leftLevel == null) {
                return -1;
            } else if (rightLevel == null) {
                return 1;
            } else {
                int diff = Integer.parseInt(leftLevel.getName()) - Integer.parseInt(rightLevel.getName());
                if (diff == 0) {
                    return left.getName().toLowerCase().compareTo(right.getName().toLowerCase());
                } else {
                    return diff;
                }
            }
        });
    }

    private static List<Feature> getFeatures(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Map<Long, Feature> featureMap = new HashMap<>();
        while (resultSet.next()) {
            long id = resultSet.getLong("power_id");
            Action action = null;
            int actionId = resultSet.getInt("action_id");
            if (actionId != 0) {
                action = Action.valueOf(actionId);
            }
            Feature feature = new Feature(
                    MySql.encodeId(id, userId),
                    resultSet.getString("name"),
                    resultSet.getInt("sid"),
                    resultSet.getBoolean("is_author"),
                    resultSet.getInt("version"),
                    AttackType.valueOf(resultSet.getInt("attack_type")),
                    resultSet.getBoolean("temporary_hp"),
                    resultSet.getInt("attack_mod"),
                    MySql.encodeId(resultSet.getLong("save_ability_modifier_id"), userId), //using the same column for attack_ability_modifier
                    getSaveType(resultSet, userId),
                    resultSet.getBoolean("half_on_save"),
                    resultSet.getBoolean("extra_damage"),
                    resultSet.getInt("num_levels_above_base"),
                    resultSet.getBoolean("advancement"),
                    resultSet.getBoolean("extra_modifiers"),
                    resultSet.getInt("modifiers_num_levels_above_base"),
                    resultSet.getBoolean("modifier_advancement"),
                    getFeatureCharacteristic(resultSet, userId),
                    CharacteristicType.valueOf(resultSet.getInt("characteristic_type_id")),
                    getCharacterLevel(resultSet, userId),
                    RangeType.valueOf(resultSet.getInt("range_type")),
                    resultSet.getInt("range"),
                    RangeUnit.valueOf(resultSet.getInt("range_unit")),
                    getPowerAreaOfEffect(resultSet, userId),
                    resultSet.getInt("recharge_min"),
                    resultSet.getInt("recharge_max"),
                    resultSet.getBoolean("recharge_on_short_rest"),
                    resultSet.getBoolean("recharge_on_long_rest"),
                    resultSet.getString("prerequisite"),
                    resultSet.getString("description"),
                    resultSet.getBoolean("passive"),
                    resultSet.getBoolean("save_proficiency_modifier"),
                    MySql.encodeId(resultSet.getLong("save_ability_modifier_id"), userId),
                    action
                    );

            featureMap.put(id, feature);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<DamageConfiguration>> map = PowerService.getDamageConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, Feature> entry : featureMap.entrySet()) {
                Feature feature = entry.getValue();
                Long featureId = entry.getKey();
                feature.setDamageConfigurations(map.get(featureId));
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<DamageConfiguration>> map = PowerService.getDamageConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, Feature> entry : featureMap.entrySet()) {
                Feature feature = entry.getValue();
                Long featureId = entry.getKey();
                feature.setExtraDamageConfigurations(map.get(featureId));
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<DamageConfiguration>> map = PowerService.getDamageConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, Feature> entry : featureMap.entrySet()) {
                Feature feature = entry.getValue();
                Long featureId = entry.getKey();
                feature.setAdvancementDamageConfigurations(map.get(featureId));
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<ModifierConfiguration>> map = PowerService.getModifierConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, Feature> entry : featureMap.entrySet()) {
                Feature feature = entry.getValue();
                Long featureId = entry.getKey();
                feature.setModifierConfigurations(map.get(featureId));
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<ModifierConfiguration>> map = PowerService.getModifierConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, Feature> entry : featureMap.entrySet()) {
                Feature feature = entry.getValue();
                Long featureId = entry.getKey();
                feature.setExtraModifierConfigurations(map.get(featureId));
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<ModifierConfiguration>> map = PowerService.getModifierConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, Feature> entry : featureMap.entrySet()) {
                Feature feature = entry.getValue();
                Long featureId = entry.getKey();
                feature.setAdvancementModifierConfigurations(map.get(featureId));
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<LimitedUse>> map = PowerService.getLimitedUsesMap(resultSet, userId);

            for (Map.Entry<Long, Feature> entry : featureMap.entrySet()) {
                Feature feature = entry.getValue();
                Long featureId = entry.getKey();
                feature.setLimitedUses(map.get(featureId));
            }
        }

        return new ArrayList<>(featureMap.values());
    }

    private static Feature getFeature(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("power_id");
        if (id == 0) {
            return null;
        }
        Action action = null;
        int actionId = resultSet.getInt("action_id");
        if (actionId != 0) {
            action = Action.valueOf(actionId);
        }
        Feature feature = new Feature(
                MySql.encodeId(id, userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                AttackType.valueOf(resultSet.getInt("attack_type")),
                resultSet.getBoolean("temporary_hp"),
                resultSet.getInt("attack_mod"),
                MySql.encodeId(resultSet.getLong("save_ability_modifier_id"), userId), //using the same column for attack_ability_modifier
                getSaveType(resultSet, userId),
                resultSet.getBoolean("half_on_save"),
                resultSet.getBoolean("extra_damage"),
                resultSet.getInt("num_levels_above_base"),
                resultSet.getBoolean("advancement"),
                resultSet.getBoolean("extra_modifiers"),
                resultSet.getInt("modifiers_num_levels_above_base"),
                resultSet.getBoolean("modifier_advancement"),
                getFeatureCharacteristic(resultSet, userId),
                CharacteristicType.valueOf(resultSet.getInt("characteristic_type_id")),
                getCharacterLevel(resultSet, userId),
                RangeType.valueOf(resultSet.getInt("range_type")),
                resultSet.getInt("range"),
                RangeUnit.valueOf(resultSet.getInt("range_unit")),
                getPowerAreaOfEffect(resultSet, userId),
                resultSet.getInt("recharge_min"),
                resultSet.getInt("recharge_max"),
                resultSet.getBoolean("recharge_on_short_rest"),
                resultSet.getBoolean("recharge_on_long_rest"),
                resultSet.getString("prerequisite"),
                resultSet.getString("description"),
                resultSet.getBoolean("passive"),
                resultSet.getBoolean("save_proficiency_modifier"),
                MySql.encodeId(resultSet.getLong("save_ability_modifier_id"), userId),
                action
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageConfiguration> damageConfigurations = PowerService.getDamageConfigurations(resultSet, userId);
            feature.setDamageConfigurations(damageConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageConfiguration> damageConfigurations = PowerService.getDamageConfigurations(resultSet, userId);
            feature.setExtraDamageConfigurations(damageConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageConfiguration> damageConfigurations = PowerService.getDamageConfigurations(resultSet, userId);
            feature.setAdvancementDamageConfigurations(damageConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = PowerService.getModifierConfigurations(resultSet, userId);
            feature.setModifierConfigurations(modifierConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = PowerService.getModifierConfigurations(resultSet, userId);
            feature.setExtraModifierConfigurations(modifierConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = PowerService.getModifierConfigurations(resultSet, userId);
            feature.setAdvancementModifierConfigurations(modifierConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<LimitedUse> limitedUses = PowerService.getLimitedUses(resultSet, userId);
            feature.setLimitedUses(limitedUses);
        }

        return feature;
    }

    private static Ability getSaveType(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("save_type_id");
        if (id == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(id, userId),
                resultSet.getString("save_type_name"),
                resultSet.getString("save_type_description"),
                resultSet.getInt("save_type_sid"),
                resultSet.getBoolean("save_type_is_author"),
                resultSet.getInt("save_type_version"),
                resultSet.getString("save_type_abbr")
        );
    }

    private static ListObject getCharacterLevel(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("character_level_id");
        if (id == 0) {
            return null;
        }
        return new ListObject(MySql.encodeId(id, userId), resultSet.getString("character_level_name"), resultSet.getInt("character_level_sid"), resultSet.getBoolean("character_level_is_author"));
    }

    private static ListObject getFeatureCharacteristic(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("characteristic_id");
        if (id == 0) {
            return null;
        }
        return new ListObject(
                MySql.encodeId(id, userId),
                resultSet.getString("characteristic_name"),
                resultSet.getInt("characteristic_sid"),
                resultSet.getBoolean("characteristic_is_author")
        );
    }

    private static PowerAreaOfEffect getPowerAreaOfEffect(ResultSet resultSet, int userId) throws Exception {
        return new PowerAreaOfEffect(
                getAreaOfEffect(resultSet, userId),
                resultSet.getInt("radius"),
                resultSet.getInt("width"),
                resultSet.getInt("height"),
                resultSet.getInt("length")
        );
    }

    private static AreaOfEffect getAreaOfEffect(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("area_of_effect_id");
        if (id == 0) {
            return null;
        }
        return new AreaOfEffect(
                MySql.encodeId(id, userId),
                resultSet.getString("area_of_effect_name"),
                resultSet.getString("area_of_effect_description"),
                resultSet.getInt("area_of_effect_sid"),
                resultSet.getBoolean("area_of_effect_is_author"),
                resultSet.getInt("area_of_effect_version"),
                resultSet.getBoolean("area_of_effect_radius"),
                resultSet.getBoolean("area_of_effect_width"),
                resultSet.getBoolean("area_of_effect_height"),
                resultSet.getBoolean("area_of_effect_length")
        );
    }

    private static Long getCharacterLevel(Feature feature, int userId) throws Exception {
        return feature.getCharacterLevel() == null || feature.getCharacterLevel().getId().equals("0") ? null : MySql.decodeId(feature.getCharacterLevel().getId(), userId);
    }

    @Override
    public long create(Power power, int userId) throws Exception {
        if (!(power instanceof Feature)) {
            throw new Exception("Invalid power type");
        }
        Feature feature = (Feature) power;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Powers_Create_Feature (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(power.getName(), 50));
            statement.setInt(2, power.getAttackType().getValue());
            statement.setBoolean(3, power.isTemporaryHP());
            statement.setInt(4, MySql.getValue(power.getAttackMod(), 0, 99));
            MySql.setId(5, power.getSaveType() == null ? null : power.getSaveType().getId(), userId, statement);
            statement.setBoolean(6, power.isHalfOnSave());
            statement.setBoolean(7, power.isExtraDamage());
            statement.setInt(8, MySql.getValue(power.getNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(9, power.isAdvancement());
            statement.setBoolean(10, power.isExtraModifiers());
            statement.setInt(11, MySql.getValue(power.getModifiersNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(12, power.isAdvancementModifiers());
            statement.setInt(13, power.getRangeType().getValue());
            statement.setInt(14, MySql.getValue(power.getRange(), 0, 9999));
            statement.setInt(15, power.getRangeUnit().getValue());
            MySql.setLong(16, getAreaOfEffect(power, userId), statement);
            statement.setInt(17, MySql.getValue(power.getPowerAreaOfEffect().getRadius(), 0, 9999));
            statement.setInt(18, MySql.getValue(power.getPowerAreaOfEffect().getWidth(), 0, 9999));
            statement.setInt(19, MySql.getValue(power.getPowerAreaOfEffect().getHeight(), 0, 9999));
            statement.setInt(20, MySql.getValue(power.getPowerAreaOfEffect().getLength(), 0, 9999));
            statement.setInt(21, MySql.getValue(power.getRechargeMin(), 0, 999));
            statement.setInt(22, MySql.getValue(power.getRechargeMax(), 0, 999));
            statement.setBoolean(23, power.isRechargeOnShortRest());
            statement.setBoolean(24, power.isRechargeOnLongRest());

            MySql.setLong(25, getCharacterLevel(feature, userId), statement);
            MySql.setInteger(26, getCharacteristicType(feature), statement);
            MySql.setLong(27, getCharacteristicId(feature, userId), statement);
            statement.setString(28, MySql.getValue(feature.getPrerequisite(), 45));
            statement.setString(29, MySql.getValue(feature.getDescription(), 4000));
            statement.setBoolean(30, feature.isPassive());
            statement.setBoolean(31, feature.isSaveProficiencyModifier());
            String abilityModifier = feature.getAttackType() == AttackType.ATTACK ? feature.getAttackAbilityModifier() : feature.getSaveAbilityModifier();
            MySql.setId(32, abilityModifier.equals("0") ? null : abilityModifier, userId, statement);
            MySql.setInteger(33, feature.getAction() == null ? null : feature.getAction().getValue(), statement);

            statement.setInt(34, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("power_id");
                }
            }

            if (id != -1) {
                PowerService.updateCommonPowerTraits(id, power, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (feature.getCharacteristic() != null) {
            CharacteristicService.updateVersion(feature.getCharacteristic().getId(), userId);
        }

        return id;
    }

    private static Long getAreaOfEffect(Power power, int userId) throws Exception {
        return power.getPowerAreaOfEffect().getAreaOfEffect() == null || power.getPowerAreaOfEffect().getAreaOfEffect().getId().equals("0") ? null : MySql.decodeId(power.getPowerAreaOfEffect().getAreaOfEffect().getId(), userId);
    }

    private static Integer getCharacteristicType(Feature feature) {
        return feature.getCharacteristicType() == null ||  feature.getCharacteristicType() == CharacteristicType.FEAT ? null : feature.getCharacteristicType().getValue();
    }

    private static Long getCharacteristicId(Feature feature, int userId) throws Exception {
        return feature.getCharacteristicType() == CharacteristicType.FEAT || feature.getCharacteristic() == null ? null : MySql.decodeId(feature.getCharacteristic().getId(), userId);
    }

    @Override
    public boolean update(Power power, long powerId, int userId) throws Exception {
        if (!(power instanceof Feature)) {
            throw new Exception("Invalid power type");
        }
        Feature feature = (Feature) power;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Powers_Update_Feature (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, powerId);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(power.getName(), 50));
            statement.setInt(4, power.getAttackType().getValue());
            statement.setBoolean(5, power.isTemporaryHP());
            statement.setInt(6, MySql.getValue(power.getAttackMod(), 0, 99));
            MySql.setId(7, power.getSaveType() == null ? null : power.getSaveType().getId(), userId, statement);
            statement.setBoolean(8, power.isHalfOnSave());
            statement.setBoolean(9, power.isExtraDamage());
            statement.setInt(10, MySql.getValue(power.getNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(11, power.isAdvancement());
            statement.setBoolean(12, power.isExtraModifiers());
            statement.setInt(13, MySql.getValue(power.getModifiersNumLevelsAboveBase(), 1, 99));
            statement.setBoolean(14, power.isAdvancementModifiers());
            statement.setInt(15, power.getRangeType().getValue());
            statement.setInt(16, MySql.getValue(power.getRange(), 0, 9999));
            statement.setInt(17, power.getRangeUnit().getValue());
            MySql.setLong(18, getAreaOfEffect(power, userId), statement);
            statement.setInt(19, MySql.getValue(power.getPowerAreaOfEffect().getRadius(), 0, 9999));
            statement.setInt(20, MySql.getValue(power.getPowerAreaOfEffect().getWidth(), 0, 9999));
            statement.setInt(21, MySql.getValue(power.getPowerAreaOfEffect().getHeight(), 0, 9999));
            statement.setInt(22, MySql.getValue(power.getPowerAreaOfEffect().getLength(), 0, 9999));
            statement.setInt(23, MySql.getValue(power.getRechargeMin(), 0, 999));
            statement.setInt(24, MySql.getValue(power.getRechargeMax(), 0, 999));
            statement.setBoolean(25, power.isRechargeOnShortRest());
            statement.setBoolean(26, power.isRechargeOnLongRest());

            MySql.setLong(27, getCharacterLevel(feature, userId), statement);
            MySql.setInteger(28, getCharacteristicType(feature), statement);
            MySql.setLong(29, getCharacteristicId(feature, userId), statement);
            statement.setString(30, MySql.getValue(feature.getPrerequisite(), 45));
            statement.setString(31, MySql.getValue(feature.getDescription(), 4000));
            statement.setBoolean(32, feature.isPassive());
            statement.setBoolean(33, feature.isSaveProficiencyModifier());
            String abilityModifier = feature.getAttackType() == AttackType.ATTACK ? feature.getAttackAbilityModifier() : feature.getSaveAbilityModifier();
            MySql.setId(34, abilityModifier.equals("0") ? null : abilityModifier, userId, statement);
            MySql.setInteger(35, feature.getAction() == null ? null : feature.getAction().getValue(), statement);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                PowerService.updateCommonPowerTraits(powerId, power, userId, connection);
            }

            connection.commit();


            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (feature.getCharacteristic() != null) {
            CharacteristicService.updateVersion(feature.getCharacteristic().getId(), userId);
        }

        return success;
    }

    @Override
    public long addToMyStuff(Power authorPower, int authorUserId, ListObject existingPower, int userId) throws Exception {
        if (!(authorPower instanceof Feature)) {
            throw new Exception("Invalid power type");
        }
        Feature feature = (Feature)authorPower;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToMyStuff(feature.getSaveType(), userId);
        }
        SharingUtilityService.addDamageConfigurationsToMyStuff(feature.getDamageConfigurations(), userId);
        SharingUtilityService.addDamageConfigurationsToMyStuff(feature.getExtraDamageConfigurations(), userId);
        SharingUtilityService.addDamageConfigurationsToMyStuff(feature.getAdvancementDamageConfigurations(), userId);
        SharingUtilityService.addModifierConfigurationsToMyStuff(feature.getModifierConfigurations(), userId);
        SharingUtilityService.addModifierConfigurationsToMyStuff(feature.getExtraModifierConfigurations(), userId);
        SharingUtilityService.addModifierConfigurationsToMyStuff(feature.getAdvancementModifierConfigurations(), userId);
        SharingUtilityService.addPowerAreaOfEffectToMyStuff(feature.getPowerAreaOfEffect(), userId);
        SharingUtilityService.addLimitedUsesToMyStuff(feature.getLimitedUses(), userId);

        if (CUSTOM_ABILITIES) {
            String attackAbilityModifier = AttributeService.addToMyStuff(feature.getAttackAbilityModifier(), userId);
            feature.setSaveAbilityModifier(attackAbilityModifier);

            String saveAbilityModifier = AttributeService.addToMyStuff(feature.getSaveAbilityModifier(), userId);
            feature.setSaveAbilityModifier(saveAbilityModifier);
        }

        if (CUSTOM_LEVELS) {
            AttributeService.addToMyStuff(feature.getCharacterLevel(), userId);
        }

        long featureId;
        if (feature.getSid() != 0) {
            PowerService.addSystemPower(MySql.decodeId(feature.getId(), authorUserId), userId);
            featureId = MySql.decodeId(feature.getId(), authorUserId);
        } else {
            if (existingPower == null) {
                featureId = create(feature, userId);
            } else {
                featureId = MySql.decodeId(existingPower.getId(), userId);
                update(feature, featureId, userId);
            }
        }

        return featureId;
    }

    @Override
    public void addToShareList(Power power, int userId, ShareList shareList) throws Exception {
        if (!(power instanceof Feature)) {
            throw new Exception("Invalid power type");
        }
        Feature feature = (Feature)power;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToShareList(feature.getSaveType(), userId, shareList);
        }
        SharingUtilityService.addDamageConfigurationsToShareList(feature.getDamageConfigurations(), userId, shareList);
        SharingUtilityService.addDamageConfigurationsToShareList(feature.getExtraDamageConfigurations(), userId, shareList);
        SharingUtilityService.addDamageConfigurationsToShareList(feature.getAdvancementDamageConfigurations(), userId, shareList);
        SharingUtilityService.addModifierConfigurationsToShareList(feature.getModifierConfigurations(), userId, shareList);
        SharingUtilityService.addModifierConfigurationsToShareList(feature.getExtraModifierConfigurations(), userId, shareList);
        SharingUtilityService.addModifierConfigurationsToShareList(feature.getAdvancementModifierConfigurations(), userId, shareList);
        SharingUtilityService.addPowerAreaOfEffectToShareList(feature.getPowerAreaOfEffect(), userId, shareList);
        SharingUtilityService.addLimitedUsesToShareList(feature.getLimitedUses(), userId, shareList);

        if (CUSTOM_ABILITIES) {
            AttributeService.addToShareList(feature.getAttackAbilityModifier(), userId, shareList);
            AttributeService.addToShareList(feature.getSaveAbilityModifier(), userId, shareList);
        }

        if (CUSTOM_LEVELS) {
            AttributeService.addToShareList(feature.getCharacterLevel(), userId, shareList);
        }
        shareList.getPowers().add(power.getId());
    }
}
