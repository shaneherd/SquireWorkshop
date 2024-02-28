package com.herd.squire.services.creatures.characters;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.creatures.characters.character_validation.CharacterValidationConfigurationASI;
import com.herd.squire.models.creatures.characters.character_validation.CharacterValidationItem;
import com.herd.squire.models.creatures.characters.character_validation.CharacterValidationResponse;
import com.herd.squire.models.creatures.characters.character_validation.CharacterValidationResponseItem;
import com.herd.squire.models.powers.FeatureListObject;
import com.herd.squire.models.powers.SpellListObject;
import com.herd.squire.services.powers.FeatureService;
import com.herd.squire.services.powers.SpellService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ValidateCharacterService {
    public static List<CharacterValidationItem> validateCharacter(long characterId, int userId) throws Exception {
        Map<Long, Map<Long, CharacterValidationItem>> mappedCVI = new HashMap<>(); //characteristicId, levelId, CharacterValidationItem
        Map<Long, Map<Long, List<Long>>> mappedFeatureIds = new HashMap<>(); //characteristicId, levelId, featureId
        Map<Long, Map<Long, List<Long>>> mappedSpellIds = new HashMap<>(); //characteristicId, levelId, spellId
        List<Long> allFeatureIds = new ArrayList<>();
        List<Long> allSpellIds = new ArrayList<>();

        List<CharacterValidationItem> items = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Character_Validation (?, ?)}");
            statement.setInt(1, userId);
            statement.setLong(2, characterId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                // Character_Validation results
                while(resultSet.next()) {
                    CharacterValidationItem characterValidationItem = getCharacterValidationItem(resultSet, userId);
                    items.add(characterValidationItem);

                    long characteristicId = resultSet.getLong("characteristic_id");
                    long levelId = resultSet.getLong("level_id");
                    Map<Long, CharacterValidationItem> characteristicMap = mappedCVI.computeIfAbsent(characteristicId, k -> new HashMap<>());
                    characteristicMap.put(levelId, characterValidationItem);
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();

                // missing feature results
                while (resultSet.next()) {
                    long powerId = resultSet.getLong("power_id");
                    long characteristicId = resultSet.getLong("characteristic_id");
                    long levelId = resultSet.getLong("character_level_id");

                    Map<Long, List<Long>> characteristicMap = mappedFeatureIds.computeIfAbsent(characteristicId, k -> new HashMap<>());
                    List<Long> powerIds = characteristicMap.computeIfAbsent(levelId, k -> new ArrayList<>());
                    powerIds.add(powerId);
                    allFeatureIds.add(powerId);
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();

                // missing spells results
                while (resultSet.next()) {
                    long powerId = resultSet.getLong("spell_id");
                    long characteristicId = resultSet.getLong("characteristic_id");
                    long levelId = resultSet.getLong("character_level_id");

                    Map<Long, List<Long>> characteristicMap = mappedSpellIds.computeIfAbsent(characteristicId, k -> new HashMap<>());
                    List<Long> powerIds = characteristicMap.computeIfAbsent(levelId, k -> new ArrayList<>());
                    powerIds.add(powerId);
                    allSpellIds.add(powerId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        Map<Long, FeatureListObject> mappedFLOs = FeatureService.getFeatureListObjectsMapped(characterId, userId, allFeatureIds);
        Map<Long, SpellListObject> mappedSLOs = SpellService.getSpellListObjectsMapped(characterId, userId, allSpellIds);
        processCharacterValidationMaps(mappedCVI, mappedFeatureIds, mappedFLOs, mappedSpellIds, mappedSLOs);
        validateItems(items);

        return items;
    }

    private static CharacterValidationItem getCharacterValidationItem(ResultSet resultSet, int userId) throws Exception {
        long characteristicId = resultSet.getLong("characteristic_id");
        boolean asiApplicable = resultSet.getBoolean("ability_score_increase_applicable");
        boolean asiApplied = resultSet.getBoolean("ability_score_increases_applied");
        boolean featSelected = resultSet.getBoolean("feat_selected");

        ListObject characteristic = new ListObject(
                MySql.encodeId(characteristicId, userId),
                resultSet.getString("characteristic_name"),
                resultSet.getInt("characteristic_sid"),
                resultSet.getBoolean("characteristic_is_author")
        );

        long subclassId = resultSet.getLong("sub_characteristic_id");
        ListObject subCharacteristic = null;
        if (subclassId != 0) {
            subCharacteristic = new ListObject(
                    MySql.encodeId(subclassId, userId),
                    resultSet.getString("sub_characteristic_name"),
                    resultSet.getInt("sub_characteristic_sid"),
                    resultSet.getBoolean("sub_characteristic_is_author")
            );
        }
        long levelId = resultSet.getLong("level_id");
        ListObject level = null;
        if (levelId != 0) {
            level = new ListObject(
                    MySql.encodeId(levelId, userId),
                    resultSet.getString("level_name"),
                    resultSet.getInt("level_sid"),
                    resultSet.getBoolean("level_is_author")
            );
        }

        return new CharacterValidationItem(
                characteristic,
                subCharacteristic,
                level,
                asiApplicable,
                asiApplied,
                featSelected
        );
    }

    private static void processCharacterValidationMaps(
            Map<Long, Map<Long, CharacterValidationItem>> mappedCVI,
            Map<Long, Map<Long, List<Long>>> mappedFeatureIds,
            Map<Long, FeatureListObject> mappedFLOs,
            Map<Long, Map<Long, List<Long>>> mappedSpellIds,
            Map<Long, SpellListObject> mappedSLOs
    ) {
        for (Map.Entry<Long, Map<Long, List<Long>>> entry : mappedFeatureIds.entrySet()) {
            Long characteristicId = entry.getKey();
            Map<Long, List<Long>> levelsMap = entry.getValue();
            Map<Long, CharacterValidationItem> cviMap = mappedCVI.get(characteristicId);

            if (cviMap != null) {
                for (Map.Entry<Long, List<Long>> subEntry : levelsMap.entrySet()) {
                    Long levelId = subEntry.getKey();
                    List<Long> featureIds = subEntry.getValue();
                    CharacterValidationItem cvi = cviMap.get(levelId);

                    if (cvi != null) {
                        for (Long featureId : featureIds) {
                            FeatureListObject flo = mappedFLOs.get(featureId);
                            cvi.getFeatures().add(flo);
                        }
                    }
                }
            }
        }

        for (Map.Entry<Long, Map<Long, List<Long>>> entry : mappedSpellIds.entrySet()) {
            Long characteristicId = entry.getKey();
            Map<Long, List<Long>> levelsMap = entry.getValue();
            Map<Long, CharacterValidationItem> cviMap = mappedCVI.get(characteristicId);

            if (cviMap != null) {
                for (Map.Entry<Long, List<Long>> subEntry : levelsMap.entrySet()) {
                    Long levelId = subEntry.getKey();
                    List<Long> spellIds = subEntry.getValue();
                    CharacterValidationItem cvi = cviMap.get(levelId);

                    if (cvi != null) {
                        for (Long featureId : spellIds) {
                            SpellListObject slo = mappedSLOs.get(featureId);
                            cvi.getSpells().add(slo);
                        }
                    }
                }
            }
        }
    }

    private static void validateItems(List<CharacterValidationItem> items) {
        for (CharacterValidationItem item : items) {
            item.validate();
        }
    }

    public static void updateCreatureValidation(long characterId, CharacterValidationResponse characterValidationResponse, int userId) throws Exception {
        List<CharacterValidationConfigurationASI> asi = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Character_Validation_Update (?, ?, ?, ?, ?)}");

            for (CharacterValidationResponseItem responseItem : characterValidationResponse.getItems()) {
                boolean asiApplied = false;
                boolean featSelected = false;
                boolean performUpdate = false;

                String characteristicId = responseItem.getCharacterValidationItem().getCharacteristic().getId();
                String levelId = responseItem.getCharacterValidationItem().getLevel().getId();

                CharacterValidationItem validationItem = responseItem.getCharacterValidationItem();
                if (validationItem.isAbilityScoreIncreaseApplicable()) {
                    if (!validationItem.isAbilityScoreIncreaseApplied() && responseItem.isIgnoreASI()) {
                        performUpdate = true;
                        asiApplied = true;
                    } else if (!validationItem.isAbilityScoreIncreaseApplied() && !responseItem.getSelectedAbilityScoreIncreases().isEmpty()) {
                        performUpdate = true;
                        asiApplied = true;
                        asi.addAll(responseItem.getSelectedAbilityScoreIncreases());
                    }
                    FeatureListObject selectedFeat = responseItem.getSelectedFeat();
                    if (!validationItem.isFeatSelected() && selectedFeat != null) {
                        performUpdate = true;
                        featSelected = true;
                    }
                }

                if (performUpdate) {
                    statement.setLong(1, characterId);
                    MySql.setId(2, characteristicId, userId, statement);
                    MySql.setId(3, levelId, userId, statement);
                    statement.setBoolean(4, asiApplied);
                    statement.setBoolean(5, featSelected);
                    statement.addBatch();
                }
            }
            statement.executeBatch();

            ignorePowers(connection, characterId, getIgnoredPowers(characterValidationResponse), userId);
            applyAbilityScoreIncreases(connection, characterId, asi, userId);

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static List<ListObject> getIgnoredPowers(CharacterValidationResponse characterValidationResponse) {
        List<ListObject> ignoredPowers = new ArrayList<>();
        ignoredPowers.addAll(characterValidationResponse.getIgnoredFeatures());
        ignoredPowers.addAll(characterValidationResponse.getIgnoredSpells());
        return ignoredPowers;
    }

    private static void applyAbilityScoreIncreases(Connection connection, long characterId, List<CharacterValidationConfigurationASI> abilityScoreIncreases, int userId) throws Exception {
        if (abilityScoreIncreases.isEmpty()) {
            return;
        }

        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Character_Validation_Update_ASI (?, ?, ?)}");

            for (CharacterValidationConfigurationASI asi : abilityScoreIncreases) {
                statement.setLong(1, characterId);
                MySql.setId(2, asi.getAbility(), userId, statement);
                statement.setInt(3, asi.getAmount());
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

    private static void ignorePowers(Connection connection, long characterId, List<ListObject> ignoredPowers, int userId) throws Exception {
        if (ignoredPowers.isEmpty()) {
            return;
        }

        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Character_Validation_Update_IgnoredPower (?, ?)}");

            for (ListObject power : ignoredPowers) {
                statement.setLong(1, characterId);
                MySql.setId(2, power, userId, statement);
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

    public static void resetIgnoredFeatures(long characterId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Character_Validation_Reset_IgnoredPowers (?)}");
            statement.setLong(1, characterId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }
}
