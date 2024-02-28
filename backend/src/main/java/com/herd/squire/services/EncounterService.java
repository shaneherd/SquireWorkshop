package com.herd.squire.services;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.campaigns.CampaignCharacter;
import com.herd.squire.models.campaigns.CampaignCharacterType;
import com.herd.squire.models.campaigns.encounters.*;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.creatures.*;
import com.herd.squire.models.creatures.characters.HealthCalculationType;
import com.herd.squire.models.creatures.characters.settings.CharacterSetting;
import com.herd.squire.models.damages.DamageConfigurationSimple;
import com.herd.squire.models.items.ItemQuantity;
import com.herd.squire.models.items.SelectionItem;
import com.herd.squire.models.monsters.*;
import com.herd.squire.models.powers.PowerType;
import com.herd.squire.rest.SquireException;
import com.herd.squire.rest.SquireHttpStatus;
import com.herd.squire.services.creatures.CreatureItemService;
import com.herd.squire.services.creatures.CreatureService;
import com.herd.squire.services.monsters.MonsterCreatureService;
import com.herd.squire.services.monsters.MonsterPowerService;
import com.herd.squire.services.monsters.MonsterService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EncounterService {
    public static String createEncounter(String campaignId, Encounter encounter, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = -1;

        int monsterCount = getMonsterCount(encounter);
        if (monsterCount > 100) {
            throw new Exception("There are more than 100 monsters in this encounter");
        }

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Encounters_Create (?,?,?,?,?,?)}");
            MySql.setId(1, campaignId, userId, statement);
            statement.setString(2, MySql.getValue(encounter.getName(), 50));
            statement.setString(3, MySql.getValue(encounter.getDescription(), 255));
            statement.setBoolean(4, encounter.isCustomSort());
            statement.setBoolean(5, encounter.isHideKilled());
            statement.setInt(6, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("id");
                }
            }

            if (id > 0) {
                updateEncounterMonsterGroups(id, encounter, userId, connection);
                updateEncounterCharacters(id, encounter, userId, connection);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            if (id > 0) {
                deleteEncounter(id, userId);
            }
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return MySql.encodeId(id, userId);
    }

    private static int getMonsterCount(Encounter encounter) {
        int count = 0;
        for (EncounterMonsterGroup group : encounter.getEncounterMonsterGroups()) {
            count += group.getMonsters().size();
        }
        return count;
    }

    public static void updateEncounter(Encounter encounter, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = MySql.decodeId(encounter.getId(), userId);
        boolean success = false;

        int monsterCount = getMonsterCount(encounter);
        if (monsterCount > 100) {
            throw new Exception("There are more than 100 monsters in this encounter");
        }

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Encounters_Update (?,?,?,?,?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(encounter.getName(), 50));
            statement.setString(4, MySql.getValue(encounter.getDescription(), 255));
            statement.setBoolean(5, encounter.isCustomSort());
            statement.setBoolean(6, encounter.isHideKilled());

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateEncounterMonsterGroups(id, encounter, userId, connection);
                updateEncounterCharacters(id, encounter, userId, connection);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (!success) {
            throw new Exception("Unable to update encounter");
        }
    }

    /********************************* Encounter Monster Groups *****************************/

    private static void updateEncounterMonsterGroups(Long encounterId, Encounter encounter, int userId, Connection connection) throws Exception {
        List<Long> deletedGroups = getDeletedGroups(encounterId, encounter, userId, connection);
        try {
            deleteGroups(deletedGroups, connection);
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }
        updateGroups(encounterId, getUpdatedGroups(encounter.getEncounterMonsterGroups()), connection, userId);
        createGroups(encounterId, getNewGroups(encounter.getEncounterMonsterGroups()), connection, userId);
    }

    private static List<Long> getDeletedGroups(long encounterId, Encounter encounter, int userId, Connection connection) throws Exception {
        List<Long> groups = getEncounterGroups(encounterId, connection);
        List<Long> deleted = new ArrayList<>();
        for(Long group : groups) {
            if (!hasGroup(group, encounter.getEncounterMonsterGroups(), userId)) {
                deleted.add(group);
            }
        }
        return deleted;
    }

    private static List<Long> getEncounterGroups(long encounterId, Connection connection) throws Exception {
        List<Long> ids = new ArrayList<>();

        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("SELECT id FROM encounter_monster_groups WHERE encounter_id = ?");
            statement.setLong(1, encounterId);
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                ids.add(resultSet.getLong("id"));
            }

            MySql.closeConnections(resultSet, statement, null);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, null, e);
        }

        return ids;
    }

    private static boolean hasGroup(Long encounterMonsterGroup, List<EncounterMonsterGroup> groups, int userId) throws Exception {
        for (EncounterMonsterGroup group : groups) {
            if (group.getId() != null && MySql.decodeId(group.getId(), userId) == encounterMonsterGroup) {
                return true;
            }
        }
        return false;
    }

    private static void deleteGroups(List<Long> deletedGroups, Connection connection) throws Exception {
        if (deletedGroups.size() == 0) {
            return;
        }
        List<Long> deletedMonsters = getMonsterIdsByGroupIds(deletedGroups, connection);
        deleteMonsters(deletedMonsters, connection);

        PreparedStatement statement = null;
        try {
            String groupIds = MySql.joinLongIds(deletedGroups);
            statement = connection.prepareStatement("DELETE FROM encounter_monster_groups WHERE id IN (" + groupIds + ")");
            statement.executeUpdate();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static List<Long> getMonsterIdsByGroupIds(List<Long> monsterGroupIds, Connection connection) throws Exception {
        List<Long> ids = new ArrayList<>();

        PreparedStatement statement = null;
        try {
            String groupIds = MySql.joinLongIds(monsterGroupIds);
            statement = connection.prepareStatement("SELECT encounter_creature_id FROM encounter_monsters WHERE encounter_monster_group_id IN (" + groupIds + ")");
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                ids.add(resultSet.getLong("encounter_creature_id"));
            }

            MySql.closeConnections(resultSet, statement, null);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, null, e);
        }

        return ids;
    }

    private static void createGroups(Long encounterId, List<EncounterMonsterGroup> groups, Connection connection, int userId) throws Exception {
        if (groups.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO encounter_monster_groups (encounter_id, display_name, monster_id, health_calculation_type_id, grouped_hp, grouped_initiative) VALUES (?,?,?,?,?,?);", Statement.RETURN_GENERATED_KEYS);
            for (EncounterMonsterGroup group : groups) {
                statement.setLong(1, encounterId);
                statement.setString(2, MySql.getValue(group.getDisplayName(), 100));
                MySql.setId(3, group.getMonster().getId(), userId, statement);
                statement.setInt(4, group.getHealthCalculationType().getValue());
                statement.setBoolean(5, group.isGroupedHp());
                statement.setBoolean(6, group.isGroupedInitiative());
                statement.executeUpdate(); //this can't be batched because we need the id

                long groupId = MySql.getGeneratedLongId(statement);
                if (encounterId > 0) {
                    createMonsters(encounterId, groupId, group.getMonsters(), connection, userId);
                } else {
                    throw new Exception("Unable to create encounter monster group");
                }
            }
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateGroups(Long encounterId, List<EncounterMonsterGroup> groups, Connection connection, int userId) throws Exception {
        if (groups.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE encounter_monster_groups SET health_calculation_type_id = ?, grouped_hp = ?, grouped_initiative = ? WHERE id = ?;");
            for (EncounterMonsterGroup group : groups) {
                statement.setInt(1, group.getHealthCalculationType().getValue());
                statement.setBoolean(2, group.isGroupedHp());
                statement.setBoolean(3, group.isGroupedInitiative());
                MySql.setId(4, group.getId(), userId, statement);
                statement.addBatch();

                updateEncounterMonsters(encounterId, group, userId, connection);
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

    private static List<EncounterMonsterGroup> getUpdatedGroups(List<EncounterMonsterGroup> groups) {
        return getGroups(groups, false);
    }

    private static List<EncounterMonsterGroup> getNewGroups(List<EncounterMonsterGroup> groups) {
        return getGroups(groups, true);
    }

    private static List<EncounterMonsterGroup> getGroups(List<EncounterMonsterGroup> groups, boolean isNew) {
        List<EncounterMonsterGroup> list = new ArrayList<>();
        for (EncounterMonsterGroup group : groups) {
            if ((isNew && (group.getId() == null || group.getId().equals("0"))) || (!isNew && group.getId() != null && !group.getId().equals("0"))) {
                list.add(group);
            }
        }
        return list;
    }

    private static EncounterMonsterGroup getEncounterMonsterGroup(ResultSet resultSet, int userId) throws Exception {
        return new EncounterMonsterGroup(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("display_name"),
                getMonsterSummary(resultSet, userId),
                HealthCalculationType.valueOf(resultSet.getInt("health_calculation_type_id")),
                resultSet.getBoolean("grouped_hp"),
                resultSet.getBoolean("grouped_initiative")
        );
    }

    private static MonsterSummary getMonsterSummary(ResultSet resultSet, int userId) throws Exception {
        return new MonsterSummary(
                MySql.encodeId(resultSet.getLong("monster_id"), userId),
                resultSet.getString("monster_name"),
                getHitDice(resultSet, userId),
                resultSet.getInt("ac"),
                MySql.encodeId(resultSet.getLong("spellcasting_ability_id"), userId),
                new ListObject(MySql.encodeId(resultSet.getLong("spellcaster_level_id"), userId), resultSet.getString("spellcaster_level_name"), resultSet.getInt("spellcaster_level_sid"), resultSet.getBoolean("spellcaster_level_is_author")),
                new ListObject(MySql.encodeId(resultSet.getLong("innate_spellcaster_level_id"), userId), resultSet.getString("innate_spellcaster_level_name"), resultSet.getInt("innate_spellcaster_level_sid"), resultSet.getBoolean("innate_spellcaster_level_is_author")),
                ChallengeRating.valueOf(resultSet.getInt("challenge_rating_id")),
                resultSet.getInt("experience"),
                resultSet.getLong("perception_prof") != 0,
                resultSet.getLong("stealth_prof") != 0,
                resultSet.getInt("legendary_points")
        );
    }

    private static MonsterAbilityScore getMonsterSummaryAbilityScore(ResultSet resultSet, int userId) throws Exception {
        return new MonsterAbilityScore(
                new Ability(
                        MySql.encodeId(resultSet.getLong("id"), userId),
                        resultSet.getString("name"),
                        resultSet.getString("description"),
                        resultSet.getInt("sid"),
                        resultSet.getBoolean("is_author"),
                        resultSet.getInt("version"),
                        resultSet.getString("abbr")
                ),
                resultSet.getInt("value")
        );
    }

    private static DiceCollection getHitDice(ResultSet resultSet, int userId) throws Exception {
        return new DiceCollection(
                resultSet.getInt("hit_dice_num_dice"),
                DiceSize.valueOf(resultSet.getInt("hit_dice_size_id")),
                getHitDiceAbilityModifier(resultSet, userId),
                resultSet.getInt("hit_dice_misc_modifier")
        );
    }

    private static Ability getHitDiceAbilityModifier(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("hit_dice_ability_modifier_id");
        if (id == 0) {
            return new Ability("0");
        }
        return new Ability(
                MySql.encodeId(id, userId),
                resultSet.getString("hit_dice_ability_modifier_name"),
                resultSet.getString("hit_dice_ability_modifier_description"),
                resultSet.getInt("hit_dice_ability_modifier_sid"),
                resultSet.getBoolean("hit_dice_ability_modifier_is_author"),
                resultSet.getInt("hit_dice_ability_modifier_version"),
                resultSet.getString("hit_dice_ability_modifier_abbr")
        );
    }

    /********************************* Encounter Monsters *****************************/

    private static void updateEncounterMonsters(Long encounterId, EncounterMonsterGroup group, int userId, Connection connection) throws Exception {
        long groupId = MySql.decodeId(group.getId(), userId);
        List<Long> deletedMonsters = getDeletedMonsters(groupId, group, userId, connection);
        try {
            deleteMonsters(deletedMonsters, connection);
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }
        updateMonsters(encounterId, groupId, getUpdatedMonsters(group.getMonsters()), connection, userId);
        createMonsters(encounterId, groupId, getNewMonsters(group.getMonsters()), connection, userId);
    }

    private static List<Long> getDeletedMonsters(long groupId, EncounterMonsterGroup encounterMonsterGroup, int userId, Connection connection) throws Exception {
        List<Long> monsters = getEncounterMonsters(groupId, connection);
        List<Long> deleted = new ArrayList<>();
        for(Long monster : monsters) {
            if (!hasMonster(monster, encounterMonsterGroup.getMonsters(), userId)) {
                deleted.add(monster);
            }
        }
        return deleted;
    }

    private static List<Long> getEncounterMonsters(long groupId, Connection connection) throws Exception {
        List<Long> ids = new ArrayList<>();

        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("SELECT encounter_creature_id FROM encounter_monsters WHERE encounter_monster_group_id = ?");
            statement.setLong(1, groupId);
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                ids.add(resultSet.getLong("encounter_creature_id"));
            }

            MySql.closeConnections(resultSet, statement, null);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, null, e);
        }

        return ids;
    }

    private static boolean hasMonster(long encounterMonster, List<EncounterMonster> monsters, int userId) throws Exception {
        for (EncounterMonster monster : monsters) {
            if (monster.getId() != null && MySql.decodeId(monster.getId(), userId) == encounterMonster) {
                return true;
            }
        }
        return false;
    }

    private static void createMonsters(Long encounterId, Long groupId, List<EncounterMonster> monsters, Connection connection, int userId) throws Exception {
        if (monsters.isEmpty()) {
            return;
        }
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call EncountersCreatures_Create_Monster (?,?,?,?,?,?,?,?,?)}");
            for (EncounterMonster encounterMonster : monsters) {
                statement.setLong(1, encounterId);
                statement.setLong(2, groupId);
                statement.setInt(3, encounterMonster.getMonsterNumber());
                statement.setInt(4, encounterMonster.getHp());
                statement.setInt(5, encounterMonster.getInitiative());
                statement.setInt(6, encounterMonster.getRoundAdded());
                statement.setInt(7, encounterMonster.getOrder());
                statement.setBoolean(8, encounterMonster.isSurprised());
                statement.setInt(9, userId);
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

    private static void updateMonsters(Long encounterId, Long groupId, List<EncounterMonster> monsters, Connection connection, int userId) throws Exception {
        if (monsters.isEmpty()) {
            return;
        }
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call EncountersCreatures_Update_Monster (?,?,?,?,?,?,?,?,?)}");
            for (EncounterMonster encounterMonster : monsters) {
                statement.setLong(1, encounterId);
                MySql.setId(2, encounterMonster.getId(), userId, statement);
                statement.setInt(3, encounterMonster.getMonsterNumber());
                statement.setInt(4, encounterMonster.getHp());
                statement.setInt(5, encounterMonster.getInitiative());
                statement.setInt(6, encounterMonster.getRoundAdded());
                statement.setInt(7, encounterMonster.getOrder());
                statement.setBoolean(8, encounterMonster.isSurprised());
                statement.setInt(9, userId);
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

    private static List<EncounterMonster> getUpdatedMonsters(List<EncounterMonster> groups) {
        return getMonsters(groups, false);
    }

    private static List<EncounterMonster> getNewMonsters(List<EncounterMonster> groups) {
        return getMonsters(groups, true);
    }

    private static List<EncounterMonster> getMonsters(List<EncounterMonster> monsters, boolean isNew) {
        List<EncounterMonster> list = new ArrayList<>();
        for (EncounterMonster monster : monsters) {
            if ((isNew && (monster.getId() == null || monster.getId().equals("0"))) || (!isNew && monster.getId() != null && !monster.getId().equals("0"))) {
                list.add(monster);
            }
        }
        return list;
    }

    private static void deleteMonsters(List<Long> deletedMonsters, Connection connection) throws Exception {
        if (deletedMonsters.size() == 0) {
            return;
        }
        PreparedStatement statement = null;
        try {
            String characterIds = MySql.joinLongIds(deletedMonsters);
            statement = connection.prepareStatement("DELETE FROM encounter_monsters WHERE encounter_creature_id IN (" + characterIds + ")");
            statement.executeUpdate();

            statement = connection.prepareStatement("DELETE FROM encounter_creatures WHERE id IN (" + characterIds + ")");
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static EncounterMonster getEncounterMonster(ResultSet resultSet, int userId) throws Exception {
        return new EncounterMonster(
                MySql.encodeId(resultSet.getLong("encounter_creature_id"), userId),
                resultSet.getInt("initiative"),
                resultSet.getInt("round_added"),
                resultSet.getInt("order"),
                resultSet.getBoolean("surprised"),
                resultSet.getBoolean("removed"),
                resultSet.getInt("monster_number"),
                resultSet.getInt("hp")
        );
    }

    /********************************* Encounter Characters *****************************/

    private static void updateEncounterCharacters(Long encounterId, Encounter encounter, int userId, Connection connection) throws Exception {
        List<Long> deletedCharacters = getDeletedCharacters(encounterId, encounter, userId, connection);
        try {
            deleteCharacters(deletedCharacters, connection);
        } catch (Exception e) {
            throw new SquireException(SquireHttpStatus.ERROR_DELETING);
        }
        updateCharacters(encounterId, getUpdatedCharacters(encounter.getEncounterCharacters()), connection, userId);
        createCharacters(encounterId, getNewCharacters(encounter.getEncounterCharacters()), connection, userId);
    }

    private static void createCharacters(Long encounterId, List<EncounterCharacter> characters, Connection connection, int userId) throws Exception {
        if (characters.isEmpty()) {
            return;
        }
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call EncountersCreatures_Create_Character (?,?,?,?,?,?,?)}");
            for (EncounterCharacter character : characters) {
                statement.setLong(1, encounterId);
                MySql.setId(2, character.getCharacter().getId(), userId, statement);
                statement.setInt(3, character.getInitiative());
                statement.setInt(4, character.getRoundAdded());
                statement.setInt(5, character.getOrder());
                statement.setBoolean(6, character.isSurprised());
                statement.setInt(7, userId);
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

    private static void updateCharacters(Long encounterId, List<EncounterCharacter> characters, Connection connection, int userId) throws Exception {
        if (characters.isEmpty()) {
            return;
        }
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call EncountersCreatures_Update_Character (?,?,?,?,?,?,?)}");
            for (EncounterCharacter character : characters) {
                statement.setLong(1, encounterId);
                MySql.setId(2, character.getId(), userId, statement);
                statement.setInt(3, character.getInitiative());
                statement.setInt(4, character.getRoundAdded());
                statement.setInt(5, character.getOrder());
                statement.setBoolean(6, character.isSurprised());
                statement.setInt(7, userId);
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

    private static List<Long> getDeletedCharacters(long encounterId, Encounter encounter, int userId, Connection connection) throws Exception {
        List<Long> characters = getEncounterCharacters(encounterId, connection);
        List<Long> deleted = new ArrayList<>();
        for(Long character : characters) {
            if (!hasCharacter(character, encounter.getEncounterCharacters(), userId)) {
                deleted.add(character);
            }
        }
        return deleted;
    }

    private static List<Long> getEncounterCharacters(long encounterId, Connection connection) throws Exception {
        List<Long> ids = new ArrayList<>();

        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("SELECT id FROM encounter_creatures WHERE encounter_id = ? AND encounter_creature_type_id = ?");
            statement.setLong(1, encounterId);
            statement.setInt(2, EncounterCreatureType.CHARACTER.getValue());
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                ids.add(resultSet.getLong("id"));
            }

            MySql.closeConnections(resultSet, statement, null);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, null, e);
        }

        return ids;
    }

    private static boolean hasCharacter(Long encounterCharacter, List<EncounterCharacter> characters, int userId) throws Exception {
        for (EncounterCharacter character : characters) {
            if (character.getId() != null && MySql.decodeId(character.getId(), userId) == encounterCharacter) {
                return true;
            }
        }
        return false;
    }

    private static void deleteCharacters(List<Long> deletedCharacters, Connection connection) throws Exception {
        if (deletedCharacters.size() == 0) {
            return;
        }
        PreparedStatement statement = null;
        try {
            String characterIds = MySql.joinLongIds(deletedCharacters);
            statement = connection.prepareStatement("DELETE FROM encounter_characters WHERE encounter_creature_id IN (" + characterIds + ")");
            statement.executeUpdate();

            statement = connection.prepareStatement("DELETE FROM encounter_creatures WHERE id IN (" + characterIds + ")");
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static List<EncounterCharacter> getNewCharacters(List<EncounterCharacter> characters) {
        return getCharacters(characters, true);
    }

    private static List<EncounterCharacter> getUpdatedCharacters(List<EncounterCharacter> characters) {
        return getCharacters(characters, false);
    }

    private static List<EncounterCharacter> getCharacters(List<EncounterCharacter> characters, boolean isNew) {
        List<EncounterCharacter> list = new ArrayList<>();
        for (EncounterCharacter character : characters) {
            if ((isNew && (character.getId() == null || character.getId().equals("0"))) || (!isNew && character.getId() != null && !character.getId().equals("0"))) {
                list.add(character);
            }
        }
        return list;
    }

    private static EncounterCharacter getEncounterCharacter(ResultSet resultSet, int userId) throws Exception {
        return new EncounterCharacter(
                MySql.encodeId(resultSet.getLong("encounter_creature_id"), userId),
                resultSet.getInt("initiative"),
                resultSet.getInt("round_added"),
                resultSet.getInt("order"),
                resultSet.getBoolean("surprised"),
                resultSet.getBoolean("removed"),
                getCampaignCharacter(resultSet, userId),
                resultSet.getInt("exp_earned")
        );
    }

    private static CampaignCharacter getCampaignCharacter(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("creature_id");
        return new CampaignCharacter(
                MySql.encodeId(resultSet.getLong("campaign_character_id"), userId),
                MySql.encodeId(id, userId),
                CampaignCharacterType.valueOf(resultSet.getInt("campaign_character_type_id")),
                resultSet.getString("creature_name"),
                CreatureService.getInitiativeModifier(id, userId),
                CreatureService.getPerception(id, userId),
                CreatureService.getStealth(id, userId),
                resultSet.getInt("proficiency_misc"),
                resultSet.getInt("exp")
        );
    }

    /********************************* Battle Creatures *****************************/

    private static void deleteEncounterBattleCreatures(long encounterId, Connection connection, int userId) throws Exception {
        CallableStatement statement = null;
        ResultSet resultSet = null;
        boolean success = false;
        try {
            statement = connection.prepareCall("{call Encounters_Delete_BattleCreatures (?,?)}");
            statement.setLong(1, encounterId);
            statement.setInt(2, userId);

            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("result");
                }
            }
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            if (resultSet != null) {
                resultSet.close();
            }
            throw e;
        }

        if (!success) {
            throw new Exception("Unable to delete encounter battle creatures");
        }
    }

    public static void updateBattleCreatures(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);
        updateBattleCreatures(encounterId, userId);
    }

    private static void updateBattleCreatures(long encounterId, int userId) throws Exception {
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            updateBattleCreatures(encounterId, userId, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    private static void updateBattleCreatures(long encounterId, int userId, Connection connection) throws Exception {
        BattleCreatureRequest request = getMissingBattleCreatures(encounterId, userId, connection);
        if (request != null) {
            createBattleCreatures(request, userId, connection);
        }
    }

    private static BattleCreatureRequest getMissingBattleCreatures(long encounterId, int userId, Connection connection) throws Exception {
        BattleCreatureRequest request = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            statement = connection.prepareCall("{call BattleCreatures_GetMissing (?,?)}");
            statement.setLong(1, encounterId);
            statement.setInt(2, userId);

            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                request = getBattleCreatureRequest(resultSet, statement, userId);
            }
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            if (resultSet != null) {
                resultSet.close();
            }
            throw e;
        }

        return request;
    }

    private static BattleCreatureRequest getBattleCreatureRequest(ResultSet resultSet, Statement statement, int userId) throws Exception {
        BattleCreatureRequest request = new BattleCreatureRequest();
        // Encounter Characters
        List<EncounterCharacter> characters = new ArrayList<>();
        while (resultSet.next()) {
            characters.add(getEncounterCharacter(resultSet, userId));
        }
        request.setCharacters(characters);

        // Encounter Monster Groups
        Map<Long, EncounterMonsterGroup> groupMap = new HashMap<>();
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<EncounterMonsterGroup> groups = new ArrayList<>();
            while (resultSet.next()) {
                EncounterMonsterGroup group = getEncounterMonsterGroup(resultSet, userId);
                groupMap.put(resultSet.getLong("id"), group);
                groups.add(group);
            }
            request.setGroups(groups);
        }

        // Ability Scores
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                long groupId = resultSet.getLong("encounter_monster_group_id");
                EncounterMonsterGroup group = groupMap.get(groupId);
                if (group != null && group.getMonster() != null) {
                    MonsterAbilityScore abilityScore = getMonsterSummaryAbilityScore(resultSet, userId);
                    group.getMonster().getAbilityScores().add(abilityScore);
                }
            }
        }

        // Encounter Monsters
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                long groupId = resultSet.getLong("encounter_monster_group_id");
                EncounterMonsterGroup group = groupMap.get(groupId);
                if (group != null) {
                    EncounterMonster monster = getEncounterMonster(resultSet, userId);
                    group.getMonsters().add(monster);
                }
            }
        }

        return request;
    }

    private static void createBattleCreatures(BattleCreatureRequest battleCreatureRequest, int userId, Connection connection) throws Exception {
        createEncounterCharacterBattleCreatures(battleCreatureRequest.getCharacters(), connection, userId);
        createEncounterMonsterGroupBattleCreatures(battleCreatureRequest.getGroups(), connection, userId);
    }

    private static void createEncounterCharacterBattleCreatures(List<EncounterCharacter> characters, Connection connection, int userId) throws Exception {
        if (characters.isEmpty()) {
            return;
        }

        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE encounter_creatures SET creature_id = ? WHERE id = ?;");
            for (EncounterCharacter character : characters) {
                MySql.setId(1, character.getCharacter().getCreatureId(), userId, statement);
                MySql.setId(2, character.getId(), userId, statement);
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

    private static CreatureInventory getCreatureInventory(Monster monster) {
        CreatureInventory creatureInventory = new CreatureInventory();
        List<ItemQuantity> monsterItems = monster.getItems();
        if (!monsterItems.isEmpty()) {
            for (ItemQuantity itemQuantity : monsterItems) {
                creatureInventory.getItems().add(new SelectionItem(itemQuantity.getItem(), itemQuantity.getQuantity()));
            }
        }
        return creatureInventory;
    }

    private static List<CreatureSpell> getMonsterSpells(Monster monster) {
        List<CreatureSpell> spells = new ArrayList<>();
        for (SpellConfiguration spell : monster.getSpells()) {
            CreatureSpell creaturePower = new CreatureSpell(spell.getSpell().getId(), "");
            spells.add(creaturePower);
        }
        return spells;
    }

    private static List<CreatureSpell> getMonsterInnateSpells(Monster monster) {
        List<CreatureSpell> spells = new ArrayList<>();
        for (InnateSpellConfiguration spell : monster.getInnateSpells()) {
            int maxUses = 0;
            if (spell.getLimitedUse() != null) {
                maxUses = spell.getLimitedUse().getQuantity();
            }
            CreatureSpell creaturePower = new CreatureSpell(spell.getSpell().getId(), "", true, spell.getSlot(), maxUses, maxUses);
            spells.add(creaturePower);
        }
        return spells;
    }

    private static List<CreaturePower> getMonsterFeatures(Monster monster, int userId) throws Exception {
        List<MonsterPower> powers = MonsterPowerService.getPowers(MySql.decodeId(monster.getId(), userId), MonsterPowerType.FEATURE, userId);
        List<CreaturePower> features = new ArrayList<>();
        for (MonsterPower power : powers) {
            CreaturePower creaturePower = new CreaturePower(power.getId(), PowerType.MONSTER_FEATURE, "");
            int usesRemaining = 0;
            if (power.getLimitedUse() != null) {
                switch (power.getLimitedUse().getLimitedUseType()) {
                    case QUANTITY:
                        usesRemaining = power.getLimitedUse().getQuantity();
                        break;
                    case RECHARGE:
                        usesRemaining = 1;
                        break;
                }
            }
            creaturePower.setUsesRemaining(usesRemaining);
            features.add(creaturePower);
        }
        return features;
    }

    private static List<CreaturePower> getMonsterActions(Monster monster, int userId) throws Exception {
        List<MonsterPower> powers = MonsterPowerService.getPowers(MySql.decodeId(monster.getId(), userId), MonsterPowerType.ACTION, userId);
        List<CreaturePower> actions = new ArrayList<>();
        for (MonsterPower power : powers) {
            CreaturePower creaturePower = new CreaturePower(power.getId(), PowerType.MONSTER_ACTION, "");
            int usesRemaining = 0;
            if (power.getLimitedUse() != null) {
                switch (power.getLimitedUse().getLimitedUseType()) {
                    case QUANTITY:
                        usesRemaining = power.getLimitedUse().getQuantity();
                        break;
                    case RECHARGE:
                        usesRemaining = 1;
                        break;
                }
            }
            creaturePower.setUsesRemaining(usesRemaining);
            actions.add(creaturePower);
        }
        return actions;
    }

    private static void createEncounterMonsterGroupBattleCreatures(List<EncounterMonsterGroup> groups, Connection connection, int userId) throws Exception {
        if (groups.isEmpty()) {
            return;
        }

        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            statement = connection.prepareCall("{call BattleCreatures_CreateMonster (?,?,?,?,?,?,?,?)}");
            for (EncounterMonsterGroup group : groups) {
                long monsterId = MySql.decodeId(group.getMonster().getId(), userId);
                Monster monster = MonsterService.getMonster(monsterId, userId);
                CreatureInventory creatureInventory = getCreatureInventory(monster);
                List<CreatureSpell> spells = getMonsterSpells(monster);
                List<CreatureSpell> innateSpells = getMonsterInnateSpells(monster);
                List<CreaturePower> actions = getMonsterActions(monster, userId);
                List<CreaturePower> features = getMonsterFeatures(monster, userId);
                for (EncounterMonster encounterMonster : group.getMonsters()) {
                    long creatureId = -1;
                    MySql.setId(1, encounterMonster.getId(), userId, statement);
                    statement.setLong(2, monsterId);
                    statement.setString(3, MySql.getValue(group.getMonster().getName() + " #" + encounterMonster.getMonsterNumber(), 150));
                    statement.setInt(4, encounterMonster.getHp());
                    statement.setInt(5, group.getMonster().getLegendaryPoints());
                    MySql.setId(6, monster.getSpellcastingAbility(), userId, statement);
                    MySql.setId(7, monster.getInnateSpellcastingAbility(), userId, statement);
                    statement.setInt(8, userId);

                    boolean hasResult = statement.execute();
                    if (hasResult) {
                        resultSet = statement.getResultSet();

                        if (resultSet.next()) {
                            creatureId = resultSet.getLong("creature_id");
                        }
                    }

                    if (creatureId != -1) {
                        CreatureService.createDefaultWealth(creatureId, connection);
//                        CreatureService.createDefaultTags(creatureId, connection);
//                        CreatureService.updateCommonCreatureTraits(creatureId, creature, userId, connection);
                        CreatureHealth creatureHealth = new CreatureHealth(encounterMonster.getHp(), 0, 0);
                        CreatureService.updateCreatureHealth(creatureId, creatureHealth, connection);
                        CreatureItemService.addItems(creatureId, creatureInventory, userId);

                        // spellcasting
                        CreatureService.createDefaultSpellcasting(creatureId, connection, false);
                        CreatureService.addSpells(creatureId, spells, userId);
                        CreatureService.updateCreatureSpellSlots(creatureId, monster.getSpellSlots(), connection);

                        // innate spellcasting
                        CreatureService.createDefaultSpellcasting(creatureId, connection, true);
                        CreatureService.addSpells(creatureId, innateSpells, userId);

                        // actions
                        MonsterCreatureService.addPowers(creatureId, actions, userId);

                        // features
                        MonsterCreatureService.addPowers(creatureId, features, userId);
                    }
                }
            }
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            if (resultSet != null) {
                resultSet.close();
            }
            throw e;
        }
    }

    public static List<BattleCreature> getEncounterBattleCreatures(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);
        List<BattleCreature> battleCreatures = new ArrayList<>();
        Map<Long, BattleCreature> battleCreatureMap = new HashMap<>();
        Map<Long, CombatCondition> conditionMap = new HashMap<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Encounters_Get_BattleCreatures (?,?)}");
            statement.setLong(1, encounterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    long encounterCreatureId = resultSet.getLong("id");
                    long creatureId = resultSet.getLong("creature_id");
                    BattleCreature battleCreature = getBattleCreature(resultSet, userId);
                    Creature creature = CreatureService.getCreature(creatureId, userId, connection);
                    battleCreature.setCreature(creature);
                    battleCreatures.add(battleCreature);
                    battleCreatureMap.put(encounterCreatureId, battleCreature);
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();

                    while (resultSet.next()) {
                        long encounterCreatureId = resultSet.getLong("encounter_creature_id");
                        BattleCreature battleCreature = battleCreatureMap.get(encounterCreatureId);
                        if (battleCreature != null) {
                            long conditionId = resultSet.getLong("encounter_creature_condition_id");
                            CombatCondition condition = getCombatCondition(resultSet, userId);
                            battleCreature.getConditions().add(condition);
                            conditionMap.put(conditionId, condition);
                        }
                    }
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();

                    while (resultSet.next()) {
                        long conditionId = resultSet.getLong("encounter_creature_condition_id");
                        CombatCondition combatCondition = conditionMap.get(conditionId);
                        if (combatCondition != null) {
                            combatCondition.getDamages().add(getDamageConfigurationSimple(resultSet, userId));
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return battleCreatures;
    }

    private static BattleCreature getBattleCreature(ResultSet resultSet, int userId) throws Exception {
        return new BattleCreature(
                MySql.encodeId(resultSet.getLong("id"), userId),
                EncounterCreatureType.valueOf(resultSet.getInt("encounter_creature_type_id")),
                resultSet.getInt("monster_number"),
                resultSet.getInt("initiative"),
                resultSet.getInt("round_added"),
                SpeedType.valueOf(resultSet.getInt("speed_to_display")),
                resultSet.getBoolean("action_readied"),
                resultSet.getBoolean("surprised"),
                resultSet.getBoolean("removed"),
                resultSet.getBoolean("grouped_initiative"),
                MySql.encodeId(resultSet.getLong("group_id"), userId)
        );
    }

    private static CombatCondition getCombatCondition(ResultSet resultSet, int userId) throws Exception {
        long conditionId = resultSet.getLong("condition_id");
        ListObject condition = null;
        if (conditionId > 0) {
            condition = new ListObject(
                    MySql.encodeId(conditionId, userId),
                    resultSet.getString("condition_name"),
                    resultSet.getInt("condition_sid"),
                    false
            );
        }

        long saveTypeId = resultSet.getLong("save_type_id");
        ListObject saveType = null;
        if (saveTypeId > 0) {
            saveType = new ListObject(
                    MySql.encodeId(saveTypeId, userId),
                    resultSet.getString("save_type_name"),
                    resultSet.getInt("save_type_sid"),
                    false
            );
        }
        return new CombatCondition(
                MySql.encodeId(resultSet.getLong("encounter_creature_condition_id"), userId),
                condition,
                resultSet.getString("name"),
                resultSet.getBoolean("ends_on_save"),
                resultSet.getInt("save_dc"),
                saveType,
                resultSet.getBoolean("ends_on_rounds_count"),
                resultSet.getInt("num_rounds"),
                resultSet.getInt("round_started"),
                resultSet.getBoolean("ends_on_target_turn"),
                MySql.encodeId(resultSet.getLong("target_encounter_creature_id"), userId),
                CreatureTurnPhase.valueOf(resultSet.getInt("target_creature_turn_phase_id")),
                resultSet.getBoolean("on_going_damage")
        );
    }

    private static DamageConfigurationSimple getDamageConfigurationSimple(ResultSet resultSet, int userId) throws Exception {
        long damageTypeId = resultSet.getLong("damage_type_id");
        ListObject damageType = null;
        if (damageTypeId > 0) {
            damageType = new ListObject(
                    MySql.encodeId(damageTypeId, userId),
                    resultSet.getString("damage_type_name"),
                    resultSet.getInt("damage_type_sid"),
                    false
            );
        }
        return new DamageConfigurationSimple(
                new DiceCollection(
                        resultSet.getInt("num_dice"),
                        DiceSize.valueOf(resultSet.getInt("dice_size")),
                        getAbilityModifier(resultSet, userId),
                        resultSet.getInt("misc_mod")
                ),
                damageType
        );
    }

    private static Ability getAbilityModifier(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("ability_modifier_id");
        if (id == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(id, userId),
                resultSet.getString("ability_modifier_name"),
                "",
                resultSet.getInt("ability_modifier_sid"),
                false,
                1,
                resultSet.getString("ability_modifier_abbr")
        );
    }

    /********************************* Encounter *****************************/

    public static List<ListObject> getEncounters(String campaignId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<ListObject> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Encounters_GetList (?,?)}");
            MySql.setId(1, campaignId, userId, statement);
            statement.setInt(2, userId);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    items.add(
                        new EncounterListObject(
                            MySql.encodeId(resultSet.getLong("id"), userId),
                            resultSet.getString("name"),
                            resultSet.getTimestamp("started_at"),
                            resultSet.getTimestamp("last_played_at"),
                            resultSet.getTimestamp("finished_at")
                        )
                    );
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    public static Encounter getEncounter(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getEncounter(decodedId, headers);
    }

    private static Encounter getEncounter(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getEncounter(id, userId);
    }

    private static Encounter getEncounter(long id, int userId) throws Exception {
        Encounter encounter = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Encounters_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    encounter = getEncounter(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return encounter;
    }

    private static Encounter getEncounter(CallableStatement statement, ResultSet resultSet, int userId) throws Exception {
        Encounter encounter = new Encounter(
                MySql.encodeId(resultSet.getLong("id"), userId),
                MySql.encodeId(resultSet.getLong("campaign_id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("current_round"),
                resultSet.getInt("current_turn"),
                resultSet.getTimestamp("started_at"),
                resultSet.getTimestamp("last_played_at"),
                resultSet.getTimestamp("finished_at"),
                resultSet.getInt("exp_earned"),
                resultSet.getBoolean("custom_sort"),
                resultSet.getBoolean("hide_killed")
        );

        // Encounter Characters
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<EncounterCharacter> characters = new ArrayList<>();
            while (resultSet.next()) {
                characters.add(getEncounterCharacter(resultSet, userId));
            }
            encounter.setEncounterCharacters(characters);
        }

        // Encounter Monster Groups
        Map<Long, EncounterMonsterGroup> groupMap = new HashMap<>();
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<EncounterMonsterGroup> groups = new ArrayList<>();
            while (resultSet.next()) {
                EncounterMonsterGroup group = getEncounterMonsterGroup(resultSet, userId);
                groupMap.put(resultSet.getLong("id"), group);
                groups.add(group);
            }
            encounter.setEncounterMonsterGroups(groups);
        }

        // Ability Scores
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                long groupId = resultSet.getLong("encounter_monster_group_id");
                EncounterMonsterGroup group = groupMap.get(groupId);
                if (group != null && group.getMonster() != null) {
                    MonsterAbilityScore abilityScore = getMonsterSummaryAbilityScore(resultSet, userId);
                    group.getMonster().getAbilityScores().add(abilityScore);
                }
            }
        }

        // Encounter Monsters
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                long groupId = resultSet.getLong("encounter_monster_group_id");
                EncounterMonsterGroup group = groupMap.get(groupId);
                if (group != null) {
                    EncounterMonster monster = getEncounterMonster(resultSet, userId);
                    group.getMonsters().add(monster);
                }
            }
        }

        return encounter;
    }

    public static void deleteEncounter(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);
        deleteEncounter(encounterId, userId);
    }

    public static void deleteEncounter(long encounterId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        int result = -1;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Encounters_Delete (?,?)}");
            statement.setLong(1, encounterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    result = resultSet.getInt("result");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (result != 1) {
            throw new Exception("unable to delete");
        }
    }

    public static String duplicateEncounter(String campaignId, String encounterId, String name, HttpHeaders headers) throws Exception {
        Encounter encounter = getEncounter(encounterId, headers);
        if (encounter == null) {
            throw new Exception("encounter not found");
        }
        encounter.setId("0");
        encounter.setName(name);
        for (EncounterMonsterGroup group : encounter.getEncounterMonsterGroups()) {
            group.setId("0");
            for (EncounterMonster encounterMonster : group.getMonsters()) {
                encounterMonster.setId("0");
            }
        }
        for (EncounterCharacter character : encounter.getEncounterCharacters()) {
            character.setId("0");
        }
        return createEncounter(campaignId, encounter, headers);
    }

    public static void startEncounter(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            startEncounter(encounterId, userId, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    private static void startEncounter(long encounterId, int userId, Connection connection) throws Exception {
        CallableStatement statement = null;
        ResultSet resultSet = null;
        boolean success = false;
        try {
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            statement = connection.prepareCall("{call Encounters_Start (?,?,?)}");
            statement.setLong(1, encounterId);
            statement.setInt(2, userId);
            statement.setTimestamp(3, timestamp);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }
            MySql.closeConnections(resultSet, statement, null);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, null, e);
        }

        if (!success) {
            throw new Exception("Unable to start encounter");
        }
    }

    public static void restartEncounter(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            deleteEncounterBattleCreatures(encounterId, connection, userId);
            updateBattleCreatures(encounterId, userId, connection);
            startEncounter(encounterId, userId, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    public static void continueEncounter(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounters SET last_played_at = ? WHERE id = ? AND user_id = ?");
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            statement.setTimestamp(1, timestamp);
            statement.setLong(2, encounterId);
            statement.setInt(3, userId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void finishEncounter(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounters SET finished_at = ? WHERE id = ? AND user_id = ?");
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            statement.setTimestamp(1, timestamp);
            statement.setLong(2, encounterId);
            statement.setInt(3, userId);
            statement.executeUpdate();

            deleteEncounterBattleCreatures(encounterId, connection, userId);

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateTurn(String id, RoundTurn roundTurn, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounters SET current_round = ?, current_turn = ? WHERE id = ? AND user_id = ?");
            statement.setInt(1, roundTurn.getRound());
            statement.setInt(2, roundTurn.getTurn());
            statement.setLong(3, encounterId);
            statement.setInt(4, userId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void removeGroup(String id, String groupId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterMonsterGroupId = MySql.decodeId(groupId, userId);
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounter_creatures ec JOIN encounter_monsters m ON m.encounter_creature_id = ec.id SET removed = 1 WHERE m.encounter_monster_group_id = ?");
            statement.setLong(1, encounterMonsterGroupId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void removeCreature(String id, String creatureId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long battleCreatureId = MySql.decodeId(creatureId, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounter_creatures SET removed = 1 WHERE id = ?");
            statement.setLong(1, battleCreatureId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateBattleCreatureSpeedType(String id, String creatureId, SpeedType speedType, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long battleCreatureId = MySql.decodeId(creatureId, userId);
        updateBattleCreatureSpeedType(battleCreatureId, speedType, userId);
    }

    public static void updateBattleCreatureSpeedType(long battleCreatureId, SpeedType speedType, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounter_creatures SET speed_to_display = ? WHERE id = ?;");
            statement.setInt(1, speedType.getValue());
            statement.setLong(2, battleCreatureId);
            statement.executeUpdate();

            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE character_setting_values v JOIN encounter_creatures c ON c.creature_id = v.character_id" +
                    " SET value = ? WHERE v.character_setting_id = ? AND c.id = ?;");
            statement.setInt(1, speedType.getValue());
            statement.setLong(2, CharacterSetting.SPEED_TO_DISPLAY.getValue());
            statement.setLong(3, battleCreatureId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateGroupSpeedType(String id, String groupId, SpeedType speedType, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterMonsterGroupId = MySql.decodeId(groupId, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounter_creatures ec JOIN encounter_monsters m ON m.encounter_creature_id = ec.id SET speed_to_display = ? WHERE m.encounter_monster_group_id = ?");
            statement.setInt(1, speedType.getValue());
            statement.setLong(2, encounterMonsterGroupId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateHideKilled(String id, boolean hideKilled, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long encounterId = MySql.decodeId(id, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounters SET hide_killed = ? WHERE id = ?;");
            statement.setBoolean(1, hideKilled);
            statement.setLong(2, encounterId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }
}
