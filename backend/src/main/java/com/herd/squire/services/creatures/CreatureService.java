package com.herd.squire.services.creatures;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.AttributeType;
import com.herd.squire.models.attributes.DamageType;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.creatures.*;
import com.herd.squire.models.creatures.battle_monsters.BattleMonsterSettings;
import com.herd.squire.models.creatures.characters.*;
import com.herd.squire.models.creatures.characters.character_validation.CharacterValidationItem;
import com.herd.squire.models.creatures.characters.character_validation.CharacterValidationResponse;
import com.herd.squire.models.creatures.characters.settings.CharacterSettings;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.damages.DamageModifierType;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterType;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.inUse.InUse;
import com.herd.squire.models.items.CostUnit;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.ItemProficiency;
import com.herd.squire.models.items.ItemType;
import com.herd.squire.models.powers.*;
import com.herd.squire.models.proficiency.Proficiency;
import com.herd.squire.models.proficiency.ProficiencyCategory;
import com.herd.squire.models.proficiency.ProficiencyListObject;
import com.herd.squire.models.proficiency.ProficiencyType;
import com.herd.squire.models.sharing.*;
import com.herd.squire.models.sorts.SortKey;
import com.herd.squire.models.sorts.SortType;
import com.herd.squire.models.sorts.SortValue;
import com.herd.squire.services.*;
import com.herd.squire.services.attributes.AbilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.services.creatures.characters.CharacterService;
import com.herd.squire.services.creatures.characters.ValidateCharacterService;
import com.herd.squire.services.items.ItemService;
import com.herd.squire.services.monsters.MonsterCreatureService;
import com.herd.squire.services.powers.FeatureService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.services.powers.SpellService;
import com.herd.squire.utilities.Constants;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.*;

public class CreatureService {
    private static final CharacterService characterService = new CharacterService();
    private static final CompanionService companionService = new CompanionService();
    private static final MonsterCreatureService monsterService = new MonsterCreatureService();

    private static CreatureDetailsService getService(CreatureType creatureType) throws Exception {
        CreatureDetailsService creatureDetailsService = null;
        switch (creatureType) {
            case CHARACTER:
                creatureDetailsService = characterService;
                break;
            case COMPANION:
                creatureDetailsService = companionService;
                break;
            case MONSTER:
                creatureDetailsService = monsterService;
                break;
        }
        if (creatureDetailsService == null) {
            throw new Exception("Invalid Creature Type");
        }
        return creatureDetailsService;
    }

    public static Creature getCreature(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getCreature(decodedId, headers);
    }

    private static Creature getCreature(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getCreature(id, userId);
    }

    public static Creature getCreature(long id, int userId) throws Exception {
        Creature creature = null;
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            creature = getCreature(id, userId, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }

        return creature;
    }

    public static Creature getCreature(long id, int userId, Connection connection) throws Exception {
        Creature creature = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            statement = connection.prepareCall("{call Creatures_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    CreatureType creatureType = CreatureType.valueOf(resultSet.getInt("creature_type_id"));

                    if (statement.getMoreResults()) {
                        CreatureDetailsService detailsService = getService(creatureType);
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            creature = detailsService.get(statement, resultSet, userId);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, null);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, null, e);
        }

        return creature;
    }

    public static List<ListObject> getCreatures(CreatureType creatureType, ListSource listSource, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<ListObject> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            CreatureDetailsService detailsService = getService(creatureType);
            statement = detailsService.getListObjectStatement(connection, null, 0, userId, listSource);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    items.add(MySql.getListObject(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    public static String createCreature(Creature creature, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long newId = createCreature(creature, userId);
        return MySql.encodeId(newId, userId);
    }

    public static long createCreature(Creature creature, int userId) throws Exception {
        CreatureDetailsService creatureDetailsService = getService(creature.getCreatureType());
        return creatureDetailsService.create(creature, userId);
    }

    public static PublishDetails getPublishedDetails(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getPublishedDetails(creatureId, userId);
    }

    private static PublishDetails getPublishedDetails(long creatureId, int userId) throws Exception {
        PublishDetails publishDetails = new PublishDetails();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_GetPublishedDetails (?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    boolean published = resultSet.getBoolean("published");
                    publishDetails.setPublished(published);
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    List<String> users = publishDetails.getUsers();
                    while (resultSet.next()) {
                        String username = resultSet.getString("username");
                        users.add(username);
                    }
                    if (!users.isEmpty()) {
                        publishDetails.setPublishType(PublishType.PRIVATE);
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return publishDetails;
    }

    public static VersionInfo getVersionInfo(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getVersionInfo(creatureId, userId);
    }

    private static VersionInfo getVersionInfo(long creatureId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        VersionInfo versionInfo = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_Get_VersionInfo (?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    versionInfo = new VersionInfo(
                            resultSet.getInt("version"),
                            resultSet.getInt("author_version")
                    );
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return versionInfo;
    }

    public static List<InUse> inUse(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return inUse(decodedId, userId);
    }

    public static List<InUse> inUse(long id, int userId) throws Exception {
        //todo - implement this
        List<InUse> results = new ArrayList<>();
//        Connection connection = null;
//        CallableStatement statement = null;
//        try {
//            connection = MySql.getConnection();
//            statement = connection.prepareCall("{call Creatures_InUse (?,?)}");
//            statement.setLong(1, id);
//            statement.setInt(2, userId);
//            boolean hasResult = statement.execute();
//            ResultSet resultSet = null;
//            if (hasResult) {
//                resultSet = statement.getResultSet();
//
//                while (resultSet.next()) {
//                    results.add(InUseFactory.getInUse(resultSet, userId));
//                }
//            }
//
//            MySql.closeConnections(resultSet, statement, connection);
//        } catch (Exception e) {
//            MySql.closeConnectionsAndThrow(null, statement, connection, e);
//        }
//
        return results;
    }

    /********************************************************************************************/

    public static void addToShareList(List<ListObject> creatures, int userId, ShareList shareList) throws Exception {
        if (creatures != null) {
            for (ListObject item : creatures) {
                addToShareList(item, userId, shareList);
            }
        }
    }

    public static void addToShareList(ListObject creature, int userId, ShareList shareList) throws Exception {
        if (creature != null) {
            long id = MySql.decodeId(creature.getId(), userId);
            if (id != 0) {
                addToShareList(id, userId, shareList);
            }
        }
    }

    public static void addToShareList(String id, int userId, ShareList shareList) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                addToShareList(decodeId, userId, shareList);
            }
        }
    }

    public static void addToShareList(long id, int userId, ShareList shareList) throws Exception {
        Creature creature = getCreature(id, userId);
        addToShareList(creature, userId, shareList);
    }

    public static void addToShareList(Creature creature, int userId, ShareList shareList) throws Exception {
        if (creature != null) {
            CreatureDetailsService creatureDetailsService = getService(creature.getCreatureType());
            creatureDetailsService.addToShareList(creature, userId, shareList);
        }
    }

    /********************************************************************************************/

    public static String addToMyStuff(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        if (creatureId == 0) {
            return "0";
        }
        long newId = addToMyStuff(creatureId, userId, true);
        return MySql.encodeId(newId, userId);
    }

    public static void addToMyStuff(ListObject creature, int userId) throws Exception {
        if (creature != null) {
            long id = MySql.decodeId(creature.getId(), userId);
            if (id != 0) {
                long creatureId = addToMyStuff(id, userId, false);
                creature.setId(MySql.encodeId(creatureId, userId));
            }
        }
    }

    public static String addToMyStuff(String id, int userId) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                long creatureId = addToMyStuff(decodeId, userId, false);
                return MySql.encodeId(creatureId, userId);
            }
        }
        return "0";
    }

    public static void addToMyStuff(Creature creature, int userId) throws Exception {
        if (creature != null) {
            long id = MySql.decodeId(creature.getId(), userId);
            if (id != 0) {
                long creatureId = addToMyStuff(id, userId, false);
                creature.setId(MySql.encodeId(creatureId, userId));
            }
        }
    }

    private static long addToMyStuff(long creatureId, int userId, boolean checkRights) throws Exception {
        long authorCreatureId = 0;
        int authorUserId = 0;
        long existingCreatureId = 0;

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            statement.setBoolean(3, checkRights);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    authorCreatureId = resultSet.getLong("author_creature_id");
                    if (authorCreatureId == 0) {
                        throw new Exception("unable to find creature to add");
                    }

                    authorUserId = resultSet.getInt("author_user_id");
                    existingCreatureId = resultSet.getLong("existing_creature_id");

                    int authorCreatureTypeId = resultSet.getInt("author_creature_type_id");
                    int existingCreatureTypeId = resultSet.getInt("existing_creature_type_id");
                    if (existingCreatureId > 0 && authorCreatureTypeId != existingCreatureTypeId) {
                        throw new Exception("unable to update existing creature");
                    }
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        Creature authorCreature = getCreature(authorCreatureId, authorUserId);
        if (authorCreature == null) {
            throw new Exception("unable to find creature to add");
        }
        ListObject existingCreature = null;
        if (existingCreatureId != 0) {
            existingCreature = new ListObject(
                    MySql.encodeId(existingCreatureId, userId),
                    "",
                    0,
                    false
            );
        }

        CreatureDetailsService creatureDetailsService = getService(authorCreature.getCreatureType());
        long newId = creatureDetailsService.addToMyStuff(authorCreature, authorUserId, existingCreature, userId);
        if (newId < 1) {
            throw new Exception("unable to add creature");
        }
        if (authorCreature.getSid() == 0) {
            updateParentId(newId, authorCreatureId, authorCreature.getVersion());
        }
        return newId;
    }

    public static void addSystemCreature(long id, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("INSERT IGNORE INTO creatures_shared (creature_id, user_id) VALUE (?,?);");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateParentId(long id, long parentId, int parentVersion) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE creatures SET published_parent_id = ?, published_parent_version = ?, version = ? WHERE id = ?;");
            statement.setLong(1, parentId);
            statement.setInt(2, parentVersion);

            // This is intentionally the same value as the previous column. Make sure the version matches the parent version whenever updating.
            statement.setInt(3, parentVersion);
            statement.setLong(4, id);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void publishCreature(String id, PublishRequest publishRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        publishCreature(creatureId, publishRequest, userId);
    }

    private static long publishCreature(long creatureId, PublishRequest publishRequest, int userId) throws Exception {
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            if (publishRequest.getPublishType() == PublishType.PUBLIC) {
                publishPublic(creatureId, userId);
            } else if (publishRequest.getPublishType() == PublishType.PRIVATE) {
                publishPrivate(creatureId, publishRequest.getUsers(), userId);
            } else {
                unPublish(creatureId, connection, userId);
            }

            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }

        return creatureId;
    }

    private static void publishPublic(long creatureId, int userId) throws Exception {
        ShareList shareList = SharingUtilityService.getCreatureShareList(creatureId, userId);
        SharingUtilityService.sharePublic(shareList, userId);
    }

    private static void publishPrivate(long creatureId, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        ShareList shareList = SharingUtilityService.getCreatureShareList(creatureId, userId);
        SharingUtilityService.sharePrivate(shareList, users, userId);
    }

    private static void unPublish(long creatureId, Connection connection, int userId) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Creatures_Share_UnPublish (?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static void updateCommonCreatureTraits(long id, Creature creature, int userId, Connection connection) throws Exception {
        updateProfs(id, creature, userId, connection);
//        updateSpellConfigs(id, creature, userId, connection);
        updateAbilityScores(id, creature, userId, connection);
        updateDamageModifiers(id, creature, userId, connection);
        updateConditionImmunities(id, creature, userId, connection);
        updateSenses(id, creature, connection);
    }

    public static void creatureDefaults(long creatureId, Connection connection) throws Exception {
        createDefaultWealth(creatureId, connection);
        createDefaultAC(creatureId, connection);
    }

    public static void createDefaultWealth(long creatureId, Connection connection) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call CreatureDefaults_CreatureWealth (?)}");
            statement.setLong(1, creatureId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void createDefaultAC(long creatureId, Connection connection) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call CreatureDefaults_CreatureAC (?)}");
            statement.setLong(1, creatureId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static void createDefaultSpellcasting(long creatureId, Connection connection, boolean innate) throws Exception  {
        insertSpellcasting(creatureId, new Spellcasting(AttackType.ATTACK), connection, innate);
        insertSpellcasting(creatureId, new Spellcasting(AttackType.SAVE), connection, innate);
    }

    public static void updateCreature(Creature creature, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = MySql.decodeId(creature.getId(), userId);
        CreatureDetailsService detailsService = getService(creature.getCreatureType());
        boolean success = detailsService.update(creature, id, userId);
        if (!success) {
            throw new Exception("Unable to update creature");
        }

        PublishDetails publishDetails = getPublishedDetails(id, userId);
        if (publishDetails.getPublishType() == PublishType.PUBLIC) {
            publishPublic(id, userId);
        } else if (publishDetails.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(id, publishDetails.getUsers(), userId);
        }
    }

    public static void delete(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        delete(decodedId, headers);
    }

    public static void delete(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        delete(id, userId);
    }

    public static void delete(long id, int userId) throws Exception {
        String filename = CharacterService.getImageFilename(id, userId);
        ImageService.deleteImage(filename, CharacterService.CHARACTER_IMAGE_DIRECTORY);

        Connection connection = null;
        CallableStatement statement = null;
        int result = -1;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_Delete (?,?)}");
            statement.setLong(1, id);
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

    public static String duplicate(String id, String name, HttpHeaders headers) throws Exception {
        Creature creature = getCreature(id, headers);
        if (creature == null) {
            throw new Exception("creature not found");
        }
        creature.setId("0");
        creature.setName(name);
        return createCreature(creature, headers);
    }

    /********************** Wealth **********************/

    public static CreatureWealth getWealth(ResultSet resultSet, int userId) throws Exception {
        List<CreatureWealthAmount> amounts = new ArrayList<>();
        while (resultSet.next()) {
            amounts.add(getCreatureWealthAmount(resultSet, userId));
        }
        return new CreatureWealth(amounts);
    }

    private static CreatureWealthAmount getCreatureWealthAmount(ResultSet resultSet, int userId) throws Exception {
        CostUnit costUnit = ItemService.getCostUnit(resultSet, userId);
        return new CreatureWealthAmount(
                costUnit,
                resultSet.getInt("quantity"),
                resultSet.getBoolean("display"),
                resultSet.getInt("display_order")
        );
    }

    public static void updatePageOrder(String id, CharacterPages pages, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        characterService.updatePageOrder(creatureId, pages);
    }

    public static void updateCreatureWealth(String id, CreatureWealth creatureWealth, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            updateCreatureWealth(creatureId, creatureWealth, userId, connection);
            connection.commit();
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    public static void updateCreatureWealth(long creatureId, CreatureWealth creatureWealth, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE creature_wealth SET quantity = ?, display = ?, display_order = ? WHERE cost_unit_id = ? AND creature_id = ?");

            for (CreatureWealthAmount creatureWealthAmount : creatureWealth.getAmounts()) {
                statement.setInt(1, MySql.getValue(creatureWealthAmount.getAmount(), -99999999, 99999999));
                statement.setBoolean(2, creatureWealthAmount.isDisplay());
                statement.setInt(3, creatureWealthAmount.getDisplayOrder());
                MySql.setId(4, creatureWealthAmount.getCostUnit().getId(), userId, statement);
                statement.setLong(5, creatureId);
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

    /********************** Settings **********************/

    public static void updateCharacterSettings(String id, CharacterSettings settings, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            characterService.updateSettings(creatureId, settings, connection);
            connection.commit();

            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounter_creatures SET speed_to_display = ? WHERE creature_id = ?;");
            statement.setInt(1, settings.getSpeed().getSpeedToDisplay().getValue());
            statement.setLong(2, creatureId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateBattleMonsterSettings(String id, BattleMonsterSettings settings, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            monsterService.updateSettings(creatureId, settings, connection);
            connection.commit();

            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE encounter_creatures SET speed_to_display = ? WHERE creature_id = ?;");
            statement.setInt(1, settings.getSpeed().getSpeedToDisplay().getValue());
            statement.setLong(2, creatureId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        EncounterService.updateBattleCreatureSpeedType(creatureId, settings.getSpeed().getSpeedToDisplay(), userId);
    }

    /********************** Powers **********************/

    public static List<CreaturePower> addPowers(String id, List<CreaturePower> powers, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return addPowers(creatureId, powers, userId);
    }

    public static List<CreaturePower> addPowers(long creatureId, List<CreaturePower> powers, int userId) throws Exception {
        if (powers.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> powerIds = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call CreaturePowers_Add (?,?,?,?,?)}");

            for (CreaturePower creaturePower : powers) {
                if (creaturePower.getAssignedCharacteristic().equals("innate")) {
                    creaturePower.setAssignedCharacteristic("0");
                }
                long powerId = MySql.decodeId(creaturePower.getPowerId(), userId);
                powerIds.add(powerId);
                statement.setLong(1, creatureId);
                statement.setLong(2, powerId);
                statement.setInt(3, creaturePower.getPowerType().getValue());
                MySql.setId(4, creaturePower.getAssignedCharacteristic(), userId, statement);
                statement.setInt(5, creaturePower.getUsesRemaining());
                statement.addBatch();
            }

            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return getCreaturePowers(powerIds, creatureId, userId);
    }

    public static List<CreaturePower> addSpells(String id, List<CreatureSpell> spells, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return addSpells(creatureId, spells, userId);
    }

    public static List<CreaturePower> addSpells(long creatureId, List<CreatureSpell> spells, int userId) throws Exception {
        if (spells.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> powerIds = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call CreaturePowers_Add_Spell (?,?,?,?,?,?,?,?)}");

            for (CreatureSpell creatureSpell : spells) {
                if (creatureSpell.getAssignedCharacteristic().equals("innate")) {
                    creatureSpell.setAssignedCharacteristic("0");
                    creatureSpell.setInnate(true);
                }
                long powerId = MySql.decodeId(creatureSpell.getSpell().getId(), userId);
                powerIds.add(powerId);
                statement.setLong(1, creatureId);
                statement.setLong(2, powerId);
                statement.setInt(3, PowerType.SPELL.getValue());
                MySql.setId(4, creatureSpell.getAssignedCharacteristic(), userId, statement);
                statement.setBoolean(5, creatureSpell.isInnate());
                statement.setInt(6, creatureSpell.getUsesRemaining());
                statement.setInt(7, creatureSpell.getInnateMaxUses());
                statement.setInt(8, creatureSpell.getInnateSlot());
                statement.addBatch();
            }

            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return getCreaturePowers(powerIds, creatureId, userId);
    }

    public static List<CreaturePower> getCreaturePowers(List<Long> powerIds, long creatureId, int userId) throws Exception {
        if (powerIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<CreaturePower> creaturePowers = new ArrayList<>();
        List<String> listIds = MySql.joinLongIds(powerIds, 1000);

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            for (String ids : listIds) {
                statement = connection.prepareCall("{call CreaturePowers_Get (?,?,?)}");
                statement.setLong(1, creatureId);
                statement.setString(2, ids);
                statement.setInt(3, userId);
                boolean hasResult = statement.execute();
                ResultSet resultSet = null;
                if (hasResult) {
                    resultSet = statement.getResultSet();
                    while(resultSet.next()) {
                        creaturePowers.add(getCreaturePower(resultSet, userId));
                    }
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    Map<Long, List<LimitedUse>> limitedUses = PowerService.getLimitedUsesMap(resultSet, userId);
                    for (CreaturePower creaturePower : creaturePowers) {
                        long powerId = MySql.decodeId(creaturePower.getPowerId(), userId);
                        if (limitedUses.containsKey(powerId)) {
                            creaturePower.setLimitedUses(limitedUses.get(powerId));
                        }
                    }
                }
                MySql.closeConnections(resultSet, statement, null);
            }
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return creaturePowers;
    }

    private static CreaturePower getCreaturePower(ResultSet resultSet, int userId) throws Exception {
        return new CreaturePower(
                MySql.encodeId(resultSet.getLong("id"), userId),
                MySql.encodeId(resultSet.getLong("power_id"), userId),
                resultSet.getString("power_name"),
                PowerType.valueOf(resultSet.getInt("power_type_id")),
                CharacteristicType.valueOf(resultSet.getInt("characteristic_type_id")),
                MySql.encodeId(resultSet.getLong("assigned_characteristic_id"), userId),
                false,
                resultSet.getBoolean("active"),
                MySql.encodeId(resultSet.getLong("active_target_creature_id"), userId),
                resultSet.getInt("uses_remaining"),
                resultSet.getBoolean("recharge_on_short_rest"),
                resultSet.getBoolean("recharge_on_long_rest"),
                new ArrayList<>(),
                resultSet.getBoolean("extra_modifiers"),
                resultSet.getInt("modifiers_num_levels_above_base"),
                resultSet.getBoolean("modifier_advancement")
        );
    }

    public static void removePower(String id, String powerId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            //CreaturePowers_Delete - creaturePowerId BIGINT
            statement = connection.prepareCall("{call CreaturePowers_Delete (?)}");
            MySql.setId(1, powerId, userId, statement);
            statement.execute();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<Spell> getSpellsDetailed(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        List<Long> powerIds = getCreaturePowerIds(creatureId, PowerType.SPELL, userId);
        return SpellService.getSpells(powerIds, userId);
    }

    public static List<Feature> getFeaturesDetailed(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        List<Long> powerIds = getCreaturePowerIds(creatureId, PowerType.FEATURE, userId);
        return FeatureService.getFeatures(powerIds, userId);
    }

    private static List<Long> getCreaturePowerIds(long creatureId, PowerType powerType, int userId) throws Exception {
        List<Long> ids = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call CreaturePowers_GetList(?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            statement.setInt(3, powerType.getValue());
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    ids.add(resultSet.getLong("id"));
                }
            }
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return ids;
    }

    public static void updateLegendaryPoints(String id, int legendaryPoints, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        monsterService.updateLegendaryPoints(creatureId, legendaryPoints, userId);
    }

    public static void updateCreatureSpells(String id, CreatureSpellList creatureSpellList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            //CreaturePowers_Spells_Update - creatureActionId BIGINT, isActive BIT, activeTargetCreatureId INT, usesRemaining INT, isPrepared BIT, isConcentrating BIT, activeLevel INT
            statement = connection.prepareCall("{call CreaturePowers_Spells_Update (?,?,?,?,?,?,?)}");

            for (CreatureSpell creatureSpell : creatureSpellList.getCreatureSpells()) {
                MySql.setId(1, creatureSpell.getId(), userId, statement);
                statement.setBoolean(2, creatureSpell.isActive());
                MySql.setId(3, creatureSpell.getActiveTargetCreatureId(), userId, statement);
                statement.setInt(4, creatureSpell.getUsesRemaining());
                statement.setBoolean(5, creatureSpell.isPrepared());
                statement.setBoolean(6, creatureSpell.isConcentrating());
                statement.setInt(7, creatureSpell.getActiveLevel());
                statement.addBatch();
            }
            statement.executeBatch();
            connection.commit();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateCreaturePowers(String id, CreaturePowerList creaturePowerList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            //CreaturePowers_Update - creatureActionId BIGINT, isActive BIT, activeTargetCreatureId INT, usesRemaining INT
            statement = connection.prepareCall("{call CreaturePowers_Update (?,?,?,?)}");

            for (CreaturePower creaturePower : creaturePowerList.getCreaturePowers()) {
                MySql.setId(1, creaturePower.getId(), userId, statement);
                statement.setBoolean(2, creaturePower.isActive());
                MySql.setId(3, creaturePower.getActiveTargetCreatureId(), userId, statement);
                statement.setInt(4, Math.max(creaturePower.getUsesRemaining(), 0));
                statement.addBatch();
            }
            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateBattleMonsterPowers(String id, CreaturePowerList creaturePowerList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call BattleMonsterPowers_Update (?,?,?,?)}");

            for (CreaturePower creaturePower : creaturePowerList.getCreaturePowers()) {
                MySql.setId(1, creaturePower.getId(), userId, statement);
                statement.setBoolean(2, creaturePower.isActive());
                MySql.setId(3, creaturePower.getActiveTargetCreatureId(), userId, statement);
                statement.setInt(4, Math.max(creaturePower.getUsesRemaining(), 0));
                statement.addBatch();
            }
            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<CreatureAction> getCreatureActions(String id, Action action, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getCreatureActions(creatureId, action, userId);
    }

    public static List<CreatureAction> getCreatureActions(long creatureId, Action action, int userId) throws Exception {
        List<CreatureAction> actions = new ArrayList<>();
        switch (action) {
            case STANDARD:
                actions = getStandardCreatureActions(creatureId, userId);
                break;
            case BONUS:
                actions = getBonusCreatureActions(creatureId, userId);
                break;
            case REACTION:
                actions = getReactionCreatureActions(creatureId, userId);
                break;
        }

        return actions;
    }

    private static List<CreatureAction> getStandardCreatureActions(long creatureId, int userId) throws Exception {
        List<CreatureAction> actions = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            //CreatureActions_Get_StandardAction - creatureId INT
            statement = connection.prepareCall("{call CreatureActions_Get_StandardAction (?)}");
            statement.setLong(1, creatureId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                actions = getCreatureActions(resultSet, userId);
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return actions;
    }

    private static List<CreatureAction> getBonusCreatureActions(long creatureId, int userId) throws Exception {
        List<CreatureAction> actions = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            //CreatureActions_Get_BonusAction - creatureId INT
            statement = connection.prepareCall("{call CreatureActions_Get_BonusAction (?)}");
            statement.setLong(1, creatureId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                actions = getCreatureActions(resultSet, userId);
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return actions;
    }

    private static List<CreatureAction> getReactionCreatureActions(long creatureId, int userId) throws Exception {
        List<CreatureAction> actions = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            //CreatureActions_Get_Reaction - creatureId INT
            statement = connection.prepareCall("{call CreatureActions_Get_Reaction (?)}");
            statement.setLong(1, creatureId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                actions = getCreatureActions(resultSet, userId);
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return actions;
    }

    public static List<CreatureAction> getFavoriteCreatureActions(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getFavoriteCreatureActions(creatureId, userId);
    }

    public static List<CreatureAction> getFavoriteCreatureActions(long creatureId, int userId) throws Exception {
        List<CreatureAction> actions = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            //CreatureActions_Get_Favorites - creatureId INT
            statement = connection.prepareCall("{CALL CreatureActions_Get_Favorites (?)}");
            statement.setLong(1, creatureId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                actions = getCreatureActions(resultSet, userId);
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return actions;
    }

    public static List<CreatureAction> getCreatureActions(ResultSet resultSet, int userId) throws Exception {
        List<CreatureAction> actions = new ArrayList<>();
        while (resultSet.next()) {
            actions.add(getCreatureAction(resultSet, userId));
        }
        return actions;
    }

    private static CreatureAction getCreatureAction(ResultSet resultSet, int userId) throws Exception {
        long subItemId = resultSet.getLong("action_sub_item_id");
        ListObject subItem = null;
        if (subItemId != 0) {
            subItem = new ListObject(MySql.encodeId(subItemId, userId), resultSet.getString("action_sub_item_name"), 0, false);
        }
        return new CreatureAction(
                MySql.encodeId(resultSet.getLong("creature_action_id"), userId),
                Action.valueOf(resultSet.getInt("action_id")),
                CreatureActionType.valueOf(resultSet.getInt("creature_action_type_id")),
                new ListObject(MySql.encodeId(resultSet.getLong("action_item_id"), userId), resultSet.getString("action_item_name"), 0, false),
                subItem,
                resultSet.getBoolean("favorite"),
                resultSet.getInt("favorite_order"),
                MySql.encodeId(resultSet.getLong("default_id"), userId)
        );
    }

    public static void updateFavoriteCreatureActions(String id, CreatureActions creatureActions, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        updateFavoriteCreatureActions(creatureId, creatureActions.getCreatureActions(), userId);
    }

    private static void updateFavoriteCreatureActions(long creatureId, List<CreatureAction> creatureActions, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            resetFavoriteCreatureActions(creatureId, connection);
            statement = connection.prepareStatement("UPDATE creature_actions SET favorite = 1, favorite_order = ? WHERE id = ?");

            for (CreatureAction creatureAction : creatureActions) {
                statement.setInt(1, creatureAction.getFavoriteOrder());
                MySql.setId(2, creatureAction.getId(), userId, statement);
                statement.addBatch();
            }

            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void resetFavoriteCreatureActions(long creatureId, Connection connection) throws Exception {
        CallableStatement statement = null;
        try {
            //CreatureActions_Favorites_Reset - creatureId INT
            statement = connection.prepareCall("{call CreatureActions_Favorites_Reset(?)}");
            statement.setLong(1, creatureId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static List<FeatureListObject> getMissingFeatures(String id, Filters filters, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return characterService.getMissingFeatures(creatureId, filters, userId);
    }

    public static List<SpellListObject> getMissingSpells(String id, String characteristicIdEncoded, Filters filters, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        boolean innate = characteristicIdEncoded.equals("innate");
        if (innate) {
            characteristicIdEncoded = "0";
        }
        long characteristicId = MySql.decodeId(characteristicIdEncoded, userId);
        return characterService.getMissingSpells(creatureId, userId, characteristicId, filters, innate);
    }

    public static List<CharacterValidationItem> validateCreature(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return ValidateCharacterService.validateCharacter(creatureId, userId);
    }

    public static void updateCreatureValidation(String id, CharacterValidationResponse characterValidationResponse, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        ValidateCharacterService.updateCreatureValidation(creatureId, characterValidationResponse, userId);
    }

    public static void resetIgnoredFeatures(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        ValidateCharacterService.resetIgnoredFeatures(creatureId);
    }

    /********************** Notes **********************/

    public static CharacterNote insertNote(String creatureId, CharacterNote characterNote, HttpHeaders headers) throws Exception {
        return characterService.insertNote(creatureId, characterNote, headers);
    }

    public static CharacterNote updateNote(String creatureId, String noteId, CharacterNote characterNote, HttpHeaders headers) throws Exception {
        return characterService.updateNote(creatureId, noteId, characterNote, headers);
    }

    public static void deleteNote(String creatureId, String noteId, HttpHeaders headers) throws Exception {
        characterService.deleteNote(creatureId, noteId, headers);
    }

    public static void updateNoteOrder(CharacterNoteOrder characterNoteOrder, HttpHeaders headers) throws Exception {
        characterService.updateNoteOrder(characterNoteOrder, headers);
    }

    public static void updateNoteCategory(CharacterNoteCategory characterNoteCategory, HttpHeaders headers) {
        characterService.updateNoteCategory(characterNoteCategory, headers);
    }

    /********************** Health **********************/

    public static CreatureHealth getCreatureHealth(Statement statement, ResultSet resultSet) throws Exception {
        return getCreatureHealth(statement, resultSet, true);
    }

    public static CreatureHealth getCreatureHealth(Statement statement, ResultSet resultSet, boolean includeHitDice) throws Exception {
        CreatureHealth creatureHealth = new CreatureHealth(
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
        );

        if (includeHitDice && statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<CreatureHitDice> hitDice = new ArrayList<>();
            while (resultSet.next()) {
                hitDice.add(getCreatureHitDice(resultSet));
            }
            creatureHealth.setCreatureHitDice(hitDice);
        }

        return creatureHealth;
    }

    private static CreatureHitDice getCreatureHitDice(ResultSet resultSet) throws Exception {
        return new CreatureHitDice(
                DiceSize.valueOf(resultSet.getInt("dice_size_id")),
                resultSet.getInt("remaining")
        );
    }

    public static void updateCreatureHealth(String id, CreatureHealth creatureHealth, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            updateCreatureHealth(creatureId, creatureHealth, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    public static void updateCreatureHealth(long id, CreatureHealth creatureHealth, Connection connection) throws Exception {
        deleteCreatureHealth(id, connection);
        if (creatureHealth != null) {
            PreparedStatement statement = null;
            try {
                if (creatureHealth.getCreatureHitDice() != null) {
                    statement = connection.prepareStatement("INSERT INTO `creature_hit_dice` (`creature_id`, `dice_size_id`, `remaining`) VALUES (?, ?, ?);");
                    for (CreatureHitDice hitDice : creatureHealth.getCreatureHitDice()) {
                        statement.setLong(1, id);
                        statement.setInt(2, hitDice.getDiceSize().getValue());
                        statement.setInt(3, MySql.getValue(hitDice.getRemaining(), 0, 999));
                        statement.addBatch();
                    }
                    statement.executeBatch();
                }

                statement = connection.prepareStatement("INSERT INTO `creature_health` (`creature_id`, `current_hp`, `temp_hp`," +
                        " `max_hp_mod`, `num_death_saving_throw_successes`, `num_death_saving_throw_failures`, `death_save_mod`, `death_save_advantage`," +
                        " `death_save_disadvantage`, `resurrection_penalty`," +
                        " `exhaustion_level`, `creature_state`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
                statement.setLong(1, id);
                statement.setInt(2, MySql.getValue(creatureHealth.getCurrentHp(), 0, 9999));
                statement.setInt(3, MySql.getValue(creatureHealth.getTempHp(), 0, 9999));
                statement.setInt(4, MySql.getValue(creatureHealth.getMaxHpMod(), -9999, 9999));
                statement.setInt(5, MySql.getValue(creatureHealth.getNumDeathSaveThrowSuccesses(), 0, 3));
                statement.setInt(6, MySql.getValue(creatureHealth.getNumDeathSaveThrowFailures(), 0, 3));
                statement.setInt(7, MySql.getValue(creatureHealth.getDeathSaveMod(), -99, 99));
                statement.setBoolean(8, creatureHealth.isDeathSaveAdvantage());
                statement.setBoolean(9, creatureHealth.isDeathSaveDisadvantage());
                statement.setInt(10, MySql.getValue(creatureHealth.getResurrectionPenalty(), 0, 9));
                statement.setInt(11, MySql.getValue(creatureHealth.getExhaustionLevel(), 0, 6));
                statement.setInt(12, creatureHealth.getCreatureState().getValue());
                statement.executeUpdate();

                statement.close();
            } catch (Exception e) {
                if (statement != null) {
                    statement.close();
                }
                throw e;
            }
        }
    }

    private static void deleteCreatureHealth(long creatureId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_hit_dice WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();

            statement = connection.prepareStatement("DELETE FROM creature_health WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /********************** Get Profs **********************/

    public static List<Proficiency> getAttributeProfs(ResultSet resultSet, int userId) throws Exception {
        List<Proficiency> profs = new ArrayList<>();
        while (resultSet.next()) {
            profs.add(getAttributeProf(resultSet, userId));
        }
        return profs;
    }

    private static Proficiency getAttributeProf(ResultSet resultSet, int userId) throws Exception {
        return new Proficiency(
                new ProficiencyListObject(
                        MySql.encodeId(resultSet.getLong("attribute_id"), userId),
                        resultSet.getString("name"),
                        resultSet.getString("description"),
                        resultSet.getInt("sid"),
                        resultSet.getBoolean("is_author"),
                        ProficiencyType.valueOf(ProficiencyCategory.ATTRIBUTE, resultSet.getInt("attribute_type_id"))
                ),
                resultSet.getBoolean("proficient"),
                resultSet.getInt("misc_modifier"),
                resultSet.getBoolean("advantage"),
                resultSet.getBoolean("disadvantage"),
                resultSet.getBoolean("double_prof"),
                resultSet.getBoolean("half_prof"),
                resultSet.getBoolean("round_up")
        );
    }

    public static List<ItemProficiency> getItemProfs(ResultSet resultSet, int userId) throws Exception {
        List<ItemProficiency> profs = new ArrayList<>();
        while (resultSet.next()) {
            profs.add(getItemProf(resultSet, userId));
        }
        return profs;
    }

    private static ItemProficiency getItemProf(ResultSet resultSet, int userId) throws Exception {
        long category = resultSet.getLong("armor_type_id");
        if (category == 0) {
            category = resultSet.getLong("weapon_type_id");
        }
        String categoryId = null;
        if (category != 0) {
            categoryId = MySql.encodeId(category, userId);
        }

        return new ItemProficiency(
                new Item(
                        MySql.encodeId(resultSet.getLong("item_id"), userId),
                        resultSet.getString("name"),
                        ItemType.valueOf(resultSet.getInt("item_type_id")),
                        resultSet.getString("description"),
                        resultSet.getInt("sid"),
                        resultSet.getBoolean("is_author"),
                        resultSet.getInt("version"),
                        categoryId
                ),
                true,
                resultSet.getInt("misc_modifier"),
                resultSet.getBoolean("advantage"),
                resultSet.getBoolean("disadvantage"),
                resultSet.getBoolean("double_prof"),
                resultSet.getBoolean("half_prof"),
                resultSet.getBoolean("round_up")
        );
    }

    private static Spellcasting getSpellcasting(ResultSet resultSet) throws Exception {
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

    /********************** Update Profs **********************/

    private static void updateProfs(long creatureId, Creature creature, int userId, Connection connection) throws Exception {
        deleteAllProfs(creatureId, connection);
        updateAttributeProfs(creatureId, creature.getAttributeProfs(), userId, connection);
        updateItemProfs(creatureId, creature.getItemProfs(), userId, connection);
    }

    public static void updateAttributeProf(String id, Proficiency prof, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        updateAttributeProf(creatureId, prof, userId);
    }

    public static void updateAttributeProfs(String id, List<Proficiency> profs, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            updateAttributeProfs(creatureId, profs, userId, connection);
            connection.commit();
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    private static void updateAttributeProfs(long creatureId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("REPLACE INTO `creature_attribute_profs` (`creature_id`, `attribute_id`, `advantage`, `disadvantage`, `proficient`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, creatureId);
                MySql.setId(2, prof.getAttribute().getId(), userId, statement);
                statement.setBoolean(3, prof.isAdvantage());
                statement.setBoolean(4, prof.isDisadvantage());
                statement.setBoolean(5, prof.isProficient());
                statement.setBoolean(6, prof.isDoubleProf());
                statement.setBoolean(7, prof.isHalfProf());
                statement.setBoolean(8, prof.isRoundUp());
                statement.setInt(9, prof.getMiscModifier());
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

    private static void updateAttributeProf(long creatureId, Proficiency proficiency, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            long id = MySql.decodeId(proficiency.getAttribute().getId(), userId);
            deleteAttributeProf(creatureId, id, connection);

            statement = connection.prepareStatement("INSERT INTO `creature_attribute_profs` (`creature_id`, `attribute_id`, `advantage`, `disadvantage`, `proficient`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            statement.setLong(1, creatureId);
            MySql.setId(2, proficiency.getAttribute().getId(), userId, statement);
            statement.setBoolean(3, proficiency.isAdvantage());
            statement.setBoolean(4, proficiency.isDisadvantage());
            statement.setBoolean(5, proficiency.isProficient());
            statement.setBoolean(6, proficiency.isDoubleProf());
            statement.setBoolean(7, proficiency.isHalfProf());
            statement.setBoolean(8, proficiency.isRoundUp());
            statement.setInt(9, proficiency.getMiscModifier());
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateItemProfs(long creatureId, List<ItemProficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("REPLACE INTO `creature_item_profs` (`creature_id`, `item_id`, `advantage`, `disadvantage`, `double_prof`, `half_prof`, `round_up`, `misc_modifier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            for (ItemProficiency prof : profs) {
                statement.setLong(1, creatureId);
                MySql.setId(2, prof.getItem().getId(), userId, statement);
                statement.setBoolean(3, prof.isAdvantage());
                statement.setBoolean(4, prof.isDisadvantage());
                statement.setBoolean(5, prof.isDoubleProf());
                statement.setBoolean(6, prof.isHalfProf());
                statement.setBoolean(7, prof.isRoundUp());
                statement.setInt(8, prof.getMiscModifier());
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

    /********************** Delete Profs **********************/

    private static void deleteAllProfs(long creatureId, Connection connection) throws Exception {
        deleteAllAttributeProfs(creatureId, connection);
        deleteAllItemProfs(creatureId, connection);
    }

    private static void deleteAllAttributeProfs(long creatureId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_attribute_profs WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAttributeProf(long creatureId, long attributeId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_attribute_profs WHERE creature_id = ? AND attribute_id = ?");
            statement.setLong(1, creatureId);
            statement.setLong(2, attributeId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllItemProfs(long creatureId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_item_profs WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /******************************** Ability Scores ************************/

    public static int getAbilityScore(long creatureId, long abilityId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        int score = 0;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_Get_AbilityScore (?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, abilityId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    score = resultSet.getInt("ability_score");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return score;
    }

    public static Proficiency getStealth(long creatureId, int userId) throws Exception {
        return getAttributeModifier(creatureId, Constants.DEXTERITY, Constants.STEALTH, userId);
    }

    public static Proficiency getPerception(long creatureId, int userId) throws Exception {
        return getAttributeModifier(creatureId, Constants.WISDOM, Constants.PERCEPTION, userId);
    }

    public static Proficiency getInitiativeModifier(long creatureId, int userId) throws Exception {
        return getAttributeModifier(creatureId, Constants.DEXTERITY, Constants.INITIATIVE, userId);
    }

    public static Proficiency getAttributeModifier(long creatureId, long abilityId, int attributeId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        int score = 0;
        int miscModifier = 0;
        boolean proficient = false;
        boolean doubleProficient = false;
        boolean halfProficient = false;
        boolean roundUp = false;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_Get_AttributeModifier (?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, abilityId);
            statement.setInt(3, attributeId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    score = resultSet.getInt("ability_score");
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    miscModifier = resultSet.getInt("misc_modifier");
                    proficient = resultSet.getBoolean("proficient");
                    doubleProficient = resultSet.getBoolean("double_prof");
                    halfProficient = resultSet.getBoolean("half_prof");
                    roundUp = resultSet.getBoolean("round_up");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        int modifier = AbilityService.getAbilityModifier(score);

        return new Proficiency(
                null,
                proficient,
                modifier + miscModifier,
                false,
                false,
                doubleProficient,
                halfProficient,
                roundUp
        );
    }

    public static void updateAbilityScore(String id, CreatureAbilityScore creatureAbilityScore, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        updateAbilityScore(creatureId, creatureAbilityScore, userId);
    }

    private static void updateAbilityScore(long creatureId, CreatureAbilityScore creatureAbilityScore, int userId) throws  Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            deleteAbilityScore(creatureId, MySql.decodeId(creatureAbilityScore.getAbility().getId(), userId), connection);

            statement = connection.prepareStatement("INSERT INTO `creature_ability_scores` (`creature_id`, `ability_id`, `value`, `misc_modifier`, `asi_modifier`) VALUES (?, ?, ?, ?, ?)");
            statement.setLong(1, creatureId);
            MySql.setId(2, creatureAbilityScore.getAbility().getId(), userId, statement);
            statement.setInt(3, MySql.getValue(creatureAbilityScore.getValue(), 0, 99));
            statement.setInt(4, MySql.getValue(creatureAbilityScore.getMiscModifier(), -99, 99));
            statement.setInt(5, MySql.getValue(creatureAbilityScore.getAsiModifier(), 0, 99));
            statement.executeUpdate();

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<CreatureAbilityScore> getAbilityScores(ResultSet resultSet, int userId) throws Exception {
        List<CreatureAbilityScore> abilityScores = new ArrayList<>();
        while (resultSet.next()) {
            abilityScores.add(getAbilityScore(resultSet, userId));
        }
        return abilityScores;
    }

    private static CreatureAbilityScore getAbilityScore(ResultSet resultSet, int userId) throws Exception {
        return new CreatureAbilityScore(
                new Ability(
                        MySql.encodeId(resultSet.getLong("id"), userId),
                        resultSet.getString("name"),
                        resultSet.getString("description"),
                        resultSet.getInt("sid"),
                        resultSet.getBoolean("is_author"),
                        resultSet.getInt("version"),
                        resultSet.getString("abbr")
                ),
                resultSet.getInt("value"),
                resultSet.getInt("misc_modifier"),
                resultSet.getInt("asi_modifier")
        );
    }

    private static void updateAbilityScores(long creatureId, Creature creature, int userId, Connection connection) throws Exception {
        deleteAbilityScores(creatureId, connection);
        List<CreatureAbilityScore> abilityScores = creature.getAbilityScores();
        if (abilityScores.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `creature_ability_scores` (`creature_id`, `ability_id`, `value`, `misc_modifier`, `asi_modifier`) VALUES (?, ?, ?, ? ,?)");
            for (CreatureAbilityScore abilityScore : abilityScores) {
                statement.setLong(1, creatureId);
                MySql.setId(2, abilityScore.getAbility().getId(), userId, statement);
                statement.setInt(3, MySql.getValue(abilityScore.getValue(), 0, 99));
                statement.setInt(4, MySql.getValue(abilityScore.getMiscModifier(), -99, 99));
                statement.setInt(5, MySql.getValue(abilityScore.getAsiModifier(), 0, 99));
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

    private static void deleteAbilityScores(long creatureId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_ability_scores WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAbilityScore(long creatureId, long abilityId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_ability_scores WHERE creature_id = ? AND ability_id = ?");
            statement.setLong(1, creatureId);
            statement.setLong(2, abilityId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /********************* AC Abilities ********************/

    public static List<ListObject> getAcAbilities(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> acAbilities = new ArrayList<>();
        while (resultSet.next()) {
            acAbilities.add(MySql.getListObject(resultSet, userId));
        }
        return acAbilities;
    }

    public static void updateCreatureAc(String id, CreatureAC creatureAC, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            updateCreatureAc(creatureId, creatureAC, userId, connection);
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    private static void updateCreatureAc(long creatureId, CreatureAC creatureAC, int userId, Connection connection) throws Exception {
        deleteAcAbilities(creatureId, connection);
        List<ListObject> abilities = creatureAC.getAbilities();
        if (abilities.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO creature_ac_abilities (creature_id, ability_id) VALUES (?,?)");
            for (ListObject ability : abilities) {
                statement.setLong(1, creatureId);
                MySql.setId(2, ability.getId(), userId, statement);
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

    private static void deleteAcAbilities(long creatureId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_ac_abilities WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /******************************** Creature Spell Casting ************************/

    public static CreatureSpellCasting getCreatureSpellCasting(Statement statement, ResultSet resultSet, int userId,
                                                               long spellcastingAbilityId, List<Tag> tags) throws Exception {
        Spellcasting attackSpellcasting = null;
        Spellcasting saveSpellcasting = null;
        List<CreatureSpellSlot> spellSlots = new ArrayList<>();
        List<SpellConfiguration> spellConfigurations = new ArrayList<>();

        // Attack Spellcasting
        if (resultSet.next()) {
            attackSpellcasting = getSpellcasting(resultSet);
        }

        //Save Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                saveSpellcasting = getSpellcasting(resultSet);
            }
        }

        // Spell Slots
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            spellSlots = getSpellSlots(resultSet);
        }

        // Spell Configurations
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            spellConfigurations = getSpellConfigurations(resultSet, userId);
        }

        return new CreatureSpellCasting(
                MySql.encodeId(spellcastingAbilityId, userId),
                attackSpellcasting,
                saveSpellcasting,
                spellSlots,
                spellConfigurations,
                tags
        );
    }

    public static CreatureSpellCasting getInnateCreatureSpellCasting(Statement statement, ResultSet resultSet, int userId,
                                                               long spellcastingAbilityId, List<Tag> tags) throws Exception {
        Spellcasting attackSpellcasting = null;
        Spellcasting saveSpellcasting = null;

        // Attack Spellcasting
        if (resultSet.next()) {
            attackSpellcasting = getSpellcasting(resultSet);
        }

        //Save Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                saveSpellcasting = getSpellcasting(resultSet);
            }
        }

        return new CreatureSpellCasting(
                MySql.encodeId(spellcastingAbilityId, userId),
                attackSpellcasting,
                saveSpellcasting,
                new ArrayList<>(),
                new ArrayList<>(),
                tags
        );
    }

    public static void updateCharacteristicSpellcasting(String id, String characteristicId,
                                                        Spellcasting characteristicSpellcasting,
                                                        HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        CharacterService.updateCharacteristicSpellcasting(creatureId, characteristicId, characteristicSpellcasting, userId);
    }

    public static void updateCharacteristicSpellcastingAbility(String id, CharacteristicType characteristicType,
                                                               String characteristicId, String spellcastingAbility, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        CharacterService.updateCharacteristicSpellcastingAbility(creatureId, characteristicType, characteristicId, spellcastingAbility, userId);
    }

    public static void updateSpellCastingAbility(String id, String spellcastingAbility, HttpHeaders headers, boolean innate) throws Exception  {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        updateSpellCastingAbility(creatureId, spellcastingAbility, userId, innate);
    }

    private static void updateSpellCastingAbility(long creatureId, String spellcastingAbility, int userId, boolean innate) throws Exception  {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            if (innate) {
                statement = connection.prepareStatement("UPDATE `creatures` SET `innate_spellcasting_ability_id`=? WHERE user_id = ? AND id = ?");
            } else {
                statement = connection.prepareStatement("UPDATE `creatures` SET `spellcasting_ability_id`=? WHERE user_id = ? AND id = ?");
            }
            MySql.setId(1, spellcastingAbility, userId, statement);
            statement.setInt(2, userId);
            statement.setLong(3, creatureId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void insertSpellcasting(long creatureId, Spellcasting spellcasting, Connection connection, boolean innate) throws Exception {
        PreparedStatement statement = null;
        try {
            //Check to see if the spellcasting already exists
            statement = connection.prepareStatement("SELECT creature_id FROM creature_spellcasting WHERE creature_id = ? AND attack_type_id = ? AND innate = ?");
            statement.setLong(1, creatureId);
            statement.setInt(2, spellcasting.getAttackType().getValue());
            statement.setBoolean(3, innate);
            ResultSet resultSet = statement.executeQuery();

            boolean exists = resultSet.next();
            if (!exists) {
                statement = connection.prepareStatement("INSERT INTO creature_spellcasting (creature_id, prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id, innate) VALUES (?,?,?,?,?,?,?,?,?,?)");
                statement.setLong(1, creatureId);
                statement.setBoolean(2, spellcasting.getProficiency().isProficient());
                statement.setBoolean(3, spellcasting.getProficiency().isDoubleProf());
                statement.setBoolean(4, spellcasting.getProficiency().isHalfProf());
                statement.setBoolean(5, spellcasting.getProficiency().isRoundUp());
                statement.setInt(6, spellcasting.getProficiency().getMiscModifier());
                statement.setBoolean(7, spellcasting.getProficiency().isAdvantage());
                statement.setBoolean(8, spellcasting.getProficiency().isDisadvantage());
                statement.setInt(9, spellcasting.getAttackType().getValue());
                statement.setBoolean(10, innate);
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

    public static void updateSpellcasting(String id, Spellcasting spellcasting, HttpHeaders headers, boolean innate) throws Exception  {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        updateSpellcasting(creatureId, spellcasting, innate);
    }

    private static void updateSpellcasting(long creatureId, Spellcasting spellcasting, boolean innate) throws Exception  {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE creature_spellcasting SET prof = ?, double_prof = ?, half_prof = ?, round_up = ?, misc_modifier = ?, advantage = ?, disadvantage = ? WHERE creature_id = ? AND attack_type_id = ? AND innate = ?");
            statement.setBoolean(1, spellcasting.getProficiency().isProficient());
            statement.setBoolean(2, spellcasting.getProficiency().isDoubleProf());
            statement.setBoolean(3, spellcasting.getProficiency().isHalfProf());
            statement.setBoolean(4, spellcasting.getProficiency().isRoundUp());
            statement.setInt(5, spellcasting.getProficiency().getMiscModifier());
            statement.setBoolean(6, spellcasting.getProficiency().isAdvantage());
            statement.setBoolean(7, spellcasting.getProficiency().isDisadvantage());
            statement.setLong(8, creatureId);
            statement.setInt(9, spellcasting.getAttackType().getValue());
            statement.setBoolean(10, innate);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void deleteSpellcasting(long creatureId) throws  Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM creature_spellcasting WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void deleteSpellcasting(long creatureId, AttackType attackType) throws  Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM creature_spellcasting WHERE creature_id = ? AND attack_type_id = ?");
            statement.setLong(1, creatureId);
            statement.setInt(2, attackType.getValue());
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /******************************** Creature Spell Slots ************************/

    public static List<CreatureSpellSlot> getSpellSlots(ResultSet resultSet) throws Exception {
        List<CreatureSpellSlot> spellSlots = new ArrayList<>();
        while (resultSet.next()) {
            spellSlots.add(getCreatureSpellSlot(resultSet));
        }
        return spellSlots;
    }

    private static CreatureSpellSlot getCreatureSpellSlot(ResultSet resultSet) throws Exception {
        return new CreatureSpellSlot(
                resultSet.getInt("slot_level"),
                resultSet.getInt("remaining"),
                0,
                resultSet.getInt("max_modifier")
        );
    }

    public static void updateCreatureSpellSlots(String id, List<CreatureSpellSlot> creatureSpellSlots, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        Connection connection = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            updateCreatureSpellSlots(creatureId, creatureSpellSlots, connection);
            connection.commit();
            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }
    }

    public static void updateCreatureSpellSlots(long creatureId, SpellSlots spellSlots, Connection connection) throws Exception {
        List<CreatureSpellSlot> creatureSpellSlots = new ArrayList<>();
        creatureSpellSlots.add(new CreatureSpellSlot(1, spellSlots.getSlot1(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(2, spellSlots.getSlot2(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(3, spellSlots.getSlot3(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(4, spellSlots.getSlot4(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(5, spellSlots.getSlot5(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(6, spellSlots.getSlot6(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(7, spellSlots.getSlot7(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(8, spellSlots.getSlot8(), 0, 0));
        creatureSpellSlots.add(new CreatureSpellSlot(9, spellSlots.getSlot9(), 0, 0));
        updateCreatureSpellSlots(creatureId, creatureSpellSlots, connection);
    }

    private static void updateCreatureSpellSlots(long creatureId, List<CreatureSpellSlot> spellSlots, Connection connection) throws Exception {
        deleteCreatureSpellSlots(creatureId, connection);
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `creature_spell_slots` (`creature_id`, `slot_level`, `max_modifier`, `remaining`) VALUES (?, ?, ?, ?);");
            for (CreatureSpellSlot creatureSpellSlot : spellSlots) {
                statement.setLong(1, creatureId);
                statement.setInt(2, creatureSpellSlot.getLevel());
                statement.setInt(3, MySql.getValue(creatureSpellSlot.getMaxModifier(), -99, 99));
                statement.setInt(4, MySql.getValue(creatureSpellSlot.getRemaining(), 0, 99));
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

    private static void deleteCreatureSpellSlots(long creatureId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_spell_slots WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /******************************** Creature Spells ************************/

    public static List<CreatureSpell> getFilteredCreatureSpells(String id, FilterSorts filterSorts, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getFilteredCreatureSpells(creatureId, userId, filterSorts.getFilters().getFilterValues(), filterSorts.getSorts().getSortValues(), false);
    }

    public static List<CreatureSpell> getCreatureSpells(long creatureId, int userId, List<CreatureFilter> creatureFilters, List<CreatureSort> creatureSorts, boolean innate) throws Exception {
        List<FilterValue> filters = FilterService.getFilters(creatureFilters, FilterType.SPELL);
        List<SortValue> sorts = SortService.getSorts(creatureSorts, SortType.SPELL);
        return getFilteredCreatureSpells(creatureId, userId, filters, sorts, innate);
    }

    public static List<CreatureSpell> getFilteredCreatureSpells(long creatureId, int userId, List<FilterValue> filterValues, List<SortValue> sortValues, boolean innate) throws Exception {
        List<CreatureSpell> creatureSpells = new ArrayList<>();
        List<Long> filteredSpellIds = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            String search = FilterService.getSearchValue(filterValues);
            Boolean active = FilterService.getFilterBoolean(filterValues, FilterKey.ACTIVE);
            String spellSchoolId = FilterService.getFilterValue(filterValues, FilterKey.SCHOOL);
            String spellSchoolIdValue = null;
            if (spellSchoolId != null && !spellSchoolId.equals(FilterValue.DEFAULT_OPTION)) {
                spellSchoolIdValue = spellSchoolId;
            }
            Boolean isRitual = FilterService.getFilterBoolean(filterValues, FilterKey.RITUAL);
            String spellLevel = FilterService.getFilterValue(filterValues, FilterKey.LEVEL);
            String spellLevelValue = null;
            if (spellLevel != null && !spellLevel.equals(FilterValue.DEFAULT_OPTION)) {
                spellLevelValue = spellLevel;
            }
            Boolean isAreaOfEffect = FilterService.getFilterBoolean(filterValues, FilterKey.AREA_OF_EFFECT);
            String areaOfEffectId = FilterService.getFilterValue(filterValues, FilterKey.SPELL_AREA_OF_EFFECT);
            String areaOfEffectIdValue = null;
            if (isAreaOfEffect != null && isAreaOfEffect && !areaOfEffectId.equals(FilterValue.DEFAULT_OPTION)) {
                areaOfEffectIdValue = areaOfEffectId;
            }
            Boolean isVerbal = FilterService.getFilterBoolean(filterValues, FilterKey.VERBAL);
            Boolean isSomatic = FilterService.getFilterBoolean(filterValues, FilterKey.SOMATIC);
            Boolean isMaterial = FilterService.getFilterBoolean(filterValues, FilterKey.MATERIAL);
            Boolean isConcentration = FilterService.getFilterBoolean(filterValues, FilterKey.CONCENTRATION);
            Boolean isInstantaneous = FilterService.getFilterBoolean(filterValues, FilterKey.INSTANTANEOUS);

            String characteristicId = "";
            String spellClass = FilterService.getFilterValue(filterValues, FilterKey.SPELL_CLASS);
            if (spellClass != null && !spellClass.equals(FilterValue.DEFAULT_OPTION)) {
                characteristicId = spellClass;
            }

            String tags = FilterService.getFilterValue(filterValues, FilterKey.TAGS);
            String tagIds = null;
            if (tags != null && !tags.equals(FilterValue.DEFAULT_TAG_OPTION)) {
                List<Long> tagsIdsList = PowerService.getTagIds(tags.split(","), userId);
                tagIds = MySql.joinLongIds(tagsIdsList);
            }

            SortValue sortValue = SortService.getSortValue(sortValues);
            String sortColumn = "name";
            boolean sortAscending = true;
            if (sortValue != null) {
                sortColumn = getSortColumn(sortValue);
                sortAscending = sortValue.isAscending();
            }

            statement = connection.prepareCall("{call Creatures_Get_CreatureSpells (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);

            MySql.setString(3, search, statement);
            MySql.setBoolean(4, active, statement);
            MySql.setId(5, spellSchoolIdValue, userId, statement);
            MySql.setBoolean(6, isRitual, statement);
            MySql.setInteger(7, spellLevelValue, statement);
            MySql.setBoolean(8, isVerbal, statement);
            MySql.setBoolean(9, isSomatic, statement);
            MySql.setBoolean(10, isMaterial, statement);
            MySql.setBoolean(11, isInstantaneous, statement);
            MySql.setBoolean(12, isConcentration, statement);
            MySql.setBoolean(13, isAreaOfEffect, statement);
            MySql.setId(14, areaOfEffectIdValue, userId, statement);
            MySql.setId(14, areaOfEffectIdValue, userId, statement);
            MySql.setId(15, characteristicId, userId, statement);
            MySql.setString(16, tagIds, statement);

            statement.setString(17, sortColumn);
            statement.setBoolean(18, sortAscending);
            statement.setBoolean(19, innate);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    creatureSpells.add(getCreatureSpell(resultSet, userId));
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    filteredSpellIds.add(resultSet.getLong("power_id"));
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                addTagsToSpells(creatureSpells, resultSet, userId);
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
                for (CreatureSpell creatureSpell : creatureSpells) {
                    long spellId = MySql.decodeId(creatureSpell.getSpell().getId(), userId);
                    if (modifiers.containsKey(spellId)) {
                        creatureSpell.setModifierConfigurations(modifiers.get(spellId));
                    }
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
                for (CreatureSpell creatureSpell : creatureSpells) {
                    long spellId = MySql.decodeId(creatureSpell.getSpell().getId(), userId);
                    if (modifiers.containsKey(spellId)) {
                        creatureSpell.setAdvancementModifierConfigurations(modifiers.get(spellId));
                    }
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
                for (CreatureSpell creatureSpell : creatureSpells) {
                    long spellId = MySql.decodeId(creatureSpell.getSpell().getId(), userId);
                    if (modifiers.containsKey(spellId)) {
                        creatureSpell.setExtraModifierConfigurations(modifiers.get(spellId));
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }


        for (CreatureSpell creatureSpell : creatureSpells) {
            long spellId = MySql.decodeId(creatureSpell.getSpell().getId(), userId);
            if (!filteredSpellIds.contains(spellId)) {
                creatureSpell.setHidden(true);
            }
        }

        return creatureSpells;
    }

    private static String getSortColumn(SortValue sortValue) {
        switch (sortValue.getSortKey()) {
            case LEVEL:
                return "level";
            case NAME:
            default:
                return "name";
        }
    }

    public static void addTagsToSpells(List<CreatureSpell> creatureSpells, ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<Tag>> map = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            List<Tag> tags = map.computeIfAbsent(powerId, k -> new ArrayList<>());
            tags.add(getTag(resultSet, userId));
        }

        for (CreatureSpell creatureSpell : creatureSpells) {
            long powerId = MySql.decodeId(creatureSpell.getPowerId(), userId);
            List<Tag> tags = map.get(powerId);
            if (tags != null) {
                creatureSpell.getSpell().setTags(tags);
            }
        }
    }

    private static CreatureSpell getCreatureSpell(ResultSet resultSet, int userId) throws Exception {
        long spellId = resultSet.getLong("power_id");
        return new CreatureSpell(
                MySql.encodeId(resultSet.getLong("creature_power_id"), userId),
                new SpellListObject(MySql.encodeId(spellId, userId),
                        resultSet.getString("spell_name"),
                        resultSet.getInt("spell_sid"),
                        resultSet.getBoolean("spell_is_author"),
                        resultSet.getInt("level")
                ),
                CharacteristicType.valueOf(resultSet.getInt("characteristic_type_id")),
                MySql.encodeId(resultSet.getLong("assigned_characteristic_id"), userId),
                resultSet.getBoolean("prepared"),
                resultSet.getBoolean("active"),
                MySql.encodeId(resultSet.getLong("active_target_creature_id"), userId),
                resultSet.getBoolean("concentrating"),
                resultSet.getInt("uses_remaining"),
                false,
                resultSet.getBoolean("recharge_on_short_rest"),
                resultSet.getBoolean("recharge_on_long_rest"),
                new ArrayList<>(),
                resultSet.getBoolean("extra_modifiers"),
                resultSet.getInt("modifiers_num_levels_above_base"),
                resultSet.getBoolean("modifier_advancement"),
                resultSet.getInt("active_level"),
                CastingTimeUnit.valueOf(resultSet.getInt("casting_time_unit")),
                resultSet.getBoolean("innate"),
                resultSet.getInt("innate_slot"),
                resultSet.getInt("innate_max_uses")
        );
    }

    /******************************** Creature Active Spells ************************/

    public static List<CreatureActiveSpell> getActiveSpells(long creatureId, int userId, List<CreatureSort> creatureSorts) throws Exception {
        List<SortValue> sorts = SortService.getSorts(creatureSorts, SortType.SPELL);
        return getSortedCreatureActiveSpells(creatureId, userId, sorts);
    }

    public static List<CreatureActiveSpell> getSortedCreatureActiveSpells(long creatureId, int userId, List<SortValue> sortValues) throws Exception {
        List<CreatureActiveSpell> activeSpells = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            SortValue sortValue = SortService.getSortValue(sortValues);
            String sortColumn = "name";
            boolean sortAscending = true;
            if (sortValue != null) {
                sortColumn = getSortColumn(sortValue);
                sortAscending = sortValue.isAscending();
            }

            statement = connection.prepareCall("{call Creatures_Get_CreatureActiveSpells (?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);

            statement.setString(3, sortColumn);
            statement.setBoolean(4, sortAscending);

//            boolean hasResult = statement.execute();
//            ResultSet resultSet = null;
//            if (hasResult) {
//                resultSet = statement.getResultSet();
//                while (resultSet.next()) {
//                    activeSpells.add(getCreatureActiveSpell(resultSet, userId));
//                }
//            }
//
//            if (statement.getMoreResults()) {
//                resultSet = statement.getResultSet();
//                addTagsToActiveSpells(activeSpells, resultSet, userId);
//            }
//
//            if (statement.getMoreResults()) {
//                resultSet = statement.getResultSet();
//                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
//                for (CreatureActiveSpell activeSpell : activeSpells) {
//                    long spellId = MySql.decodeId(activeSpell.getSpell().getId(), userId);
//                    if (modifiers.containsKey(spellId)) {
//                        activeSpell.setModifierConfigurations(modifiers.get(spellId));
//                    }
//                }
//            }
//
//            if (statement.getMoreResults()) {
//                resultSet = statement.getResultSet();
//                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
//                for (CreatureActiveSpell activeSpell : activeSpells) {
//                    long spellId = MySql.decodeId(activeSpell.getSpell().getId(), userId);
//                    if (modifiers.containsKey(spellId)) {
//                        activeSpell.setAdvancementModifierConfigurations(modifiers.get(spellId));
//                    }
//                }
//            }
//
//            if (statement.getMoreResults()) {
//                resultSet = statement.getResultSet();
//                Map<Long, List<ModifierConfiguration>> modifiers = PowerService.getModifiers(resultSet, userId);
//                for (CreatureActiveSpell activeSpell : activeSpells) {
//                    long spellId = MySql.decodeId(activeSpell.getSpell().getId(), userId);
//                    if (modifiers.containsKey(spellId)) {
//                        activeSpell.setExtraModifierConfigurations(modifiers.get(spellId));
//                    }
//                }
//            }
//
//            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

//        for (CreatureActiveSpell activeSpell : activeSpells) {
//            long spellId = MySql.decodeId(activeSpell.getSpell().getId(), userId);
//            if (!filteredSpellIds.contains(spellId)) {
//                activeSpell.setHidden(true);
//            }
//        }

        return activeSpells;
    }

    /******************************** Spell Configurations ************************/

    public static List<SpellConfiguration> getSpellConfigurations(ResultSet resultSet, int userId) throws Exception {
        List<SpellConfiguration> classSpells = new ArrayList<>();
        while (resultSet.next()) {
            classSpells.add(getClassSpellConfiguration(resultSet, userId));
        }
        return classSpells;
    }

    private static SpellConfiguration getClassSpellConfiguration(ResultSet resultSet, int userId) throws Exception {
        return new SpellConfiguration(
                new ListObject(MySql.encodeId(resultSet.getLong("id"), userId), resultSet.getString("name"), resultSet.getInt("sid"), resultSet.getBoolean("is_author")),
                new ListObject(MySql.encodeId(resultSet.getLong("level_gained"), userId), resultSet.getString("level_name"), resultSet.getInt("level_sid"), resultSet.getBoolean("level_is_author")),
                resultSet.getBoolean("always_prepared"),
                resultSet.getBoolean("counts_towards_prepared_limit"),
                resultSet.getString("notes"),
                resultSet.getBoolean("config_is_author")
        );
    }

    private static void updateSpellConfigs(long creatureId, Creature creature, int userId, Connection connection) throws Exception {
        if (creature.getCreatureSpellCasting() == null) {
            deleteAllSpellConfigs(creatureId, connection);
            return;
        }
        List<SpellConfiguration> spellConfigurations = creature.getCreatureSpellCasting().getSpellConfigurations();
        updateSpellConfigs(creatureId, spellConfigurations, userId, connection);
    }

    private static void updateSpellConfigs(long creatureId, List<SpellConfiguration> spellConfigurations, int userId, Connection connection) throws Exception {
        deleteAllSpellConfigs(creatureId, connection);
        if (spellConfigurations.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `creature_spell_configurations` (`creature_id`, `spell_id`, `level_gained`, `always_prepared`, `counts_towards_prepared_limit`, `notes`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?)");
            for (SpellConfiguration config : spellConfigurations) {
                statement.setLong(1, creatureId);
                MySql.setId(2, config.getSpell().getId(), userId, statement);
                MySql.setId(3, config.getLevelGained() == null ? null : config.getLevelGained().getId(), userId, statement);
                statement.setBoolean(4, config.isAlwaysPrepared());
                statement.setBoolean(5, config.isCountTowardsPrepared());
                statement.setString(6, config.getNotes());
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

    private static void deleteAllSpellConfigs(long creatureId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_spell_configurations WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************** Tags ********************************/

    public static List<Tag> getTags(String id, PowerType powerType, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getTags(creatureId, powerType, userId);
    }

    private static List<Tag> getTags(long creatureId, PowerType powerType, int userId) throws Exception {
        List<Tag> tags = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT id, power_type_id, title, color FROM creature_tags WHERE creature_id = ? AND power_type_id = ?");
            statement.setLong(1, creatureId);
            statement.setInt(2, powerType.getValue());
            resultSet = statement.executeQuery();
            tags = getTags(resultSet, userId, PowerType.SPELL);
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return tags;
    }

    public static List<Tag> getTags(ResultSet resultSet, int userId, PowerType powerType) throws Exception {
        List<Tag> tags = new ArrayList<>();
        while (resultSet.next()) {
            tags.add(getTag(resultSet, userId));
        }
        if (tags.isEmpty()) {
            tags = getDefaultTags(powerType);
        }

        return tags;
    }

    private static Tag getTag(ResultSet resultSet, int userId) throws Exception {
        return new Tag(
                MySql.encodeId(resultSet.getLong("id"), userId),
                PowerType.valueOf(resultSet.getInt("power_type_id")),
                resultSet.getString("title"),
                resultSet.getString("color")
        );
    }

    public static List<Tag> updateTags(String creatureIdStr, TagList tagList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(creatureIdStr, userId);
        return updateTags(creatureId, tagList.getTags(), userId);
    }

    private static void insertTags(long creatureId, PowerType powerType, List<Tag> tags, Connection connection) throws Exception {
        deleteTags(creatureId, powerType, connection);
        if (tags.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO creature_tags (creature_id, power_type_id, title, color) VALUES (?,?,?,?)");
            for (Tag tag : tags) {
                statement.setLong(1, creatureId);
                statement.setInt(2, powerType.getValue());
                statement.setString(3, MySql.getValue(tag.getTitle(), 50));
                statement.setString(4, MySql.getValue(tag.getColor(), 10));
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

    private static List<Tag> getTags(List<Tag> tags, boolean newTag) {
        List<Tag> matched = new ArrayList<>();
        for (Tag tag : tags) {
            if ((newTag && tag.getId().equals("0")) || (!newTag && !tag.getId().equals("0"))) {
                matched.add(tag);
            }
        }
        return matched;
    }

    private static List<Tag> updateTags(long creatureId, List<Tag> tags, int userId) throws Exception {
        if (tags.isEmpty()) {
            new ArrayList<>();
        }

        List<Tag> newTags = getTags(tags, true);
        List<Tag> existingTags = getTags(tags, false);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareStatement("UPDATE creature_tags SET title=?, color=? WHERE creature_id=? AND id=?");
            for (Tag tag : existingTags) {
                statement.setString(1, MySql.getValue(tag.getTitle(), 50));
                statement.setString(2, MySql.getValue(tag.getColor(), 10));
                statement.setLong(3, creatureId);
                MySql.setId(4, tag.getId(), userId, statement);
                statement.addBatch();
            }
            statement.executeBatch();

            statement = connection.prepareStatement("INSERT INTO creature_tags (power_type_id, title, color, creature_id) VALUES (?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
            for (Tag tag : newTags) {
                statement.setInt(1, tag.getPowerType().getValue());
                statement.setString(2, MySql.getValue(tag.getTitle(), 50));
                statement.setString(3, MySql.getValue(tag.getColor(), 10));
                statement.setLong(4, creatureId);
                statement.executeUpdate();
                long id = MySql.getGeneratedLongId(statement);
                tag.setId(MySql.encodeId(id, userId));
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return tags;
    }

    private static void deleteTags(long creatureId, PowerType powerType, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_tags WHERE creature_id = ? AND power_type_id = ?");
            statement.setLong(1, creatureId);
            statement.setInt(2, powerType.getValue());
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteTags(long creatureId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM creature_tags WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<Tag> getDefaultTags(PowerType powerType) {
        List<Tag> tags = new ArrayList<>();
        tags.add(new Tag("0", powerType, "", "992416"));
        tags.add(new Tag("0", powerType, "", "f9792f"));
        tags.add(new Tag("0", powerType, "", "f4d442"));
        tags.add(new Tag("0", powerType, "", "157a12"));
        tags.add(new Tag("0", powerType, "", "2032d6"));
        tags.add(new Tag("0", powerType, "", "6af2ed"));
        tags.add(new Tag("0", powerType, "", "8e2bc4"));
        tags.add(new Tag("0", powerType, "", "f92fa8"));
        tags.add(new Tag("0", powerType, "", "929292"));
        tags.add(new Tag("0", powerType, "", "000000"));
        return tags;
    }

    public static void createDefaultTags(long creatureId, Connection connection) throws Exception {
        insertTags(creatureId, PowerType.SPELL, getDefaultTags(PowerType.SPELL), connection);
        insertTags(creatureId, PowerType.FEATURE, getDefaultTags(PowerType.SPELL), connection);
    }

    /**************************** Power Tags ********************************/

    public static void updatePowerTags(String creatureIdStr, PowerTagList powerTagList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(creatureIdStr, userId);

        if (!powerTagList.getPowerTags().isEmpty()) {
            updatePowerTagsForPowers(creatureId, powerTagList.getPowerTags(), userId);
        } else {
            updatePowerTagsForTags(creatureId, powerTagList.getTagPowers(), userId);
        }
    }

    private static void updatePowerTagsForPowers(long creatureId, List<PowerTags> powerTags, int userId) throws Exception {
        for (PowerTags powerTag : powerTags) {
            updatePowerTagsForPower(creatureId, powerTag.getPowerId(), powerTag.getTags(), userId);
        }
    }

    private static void updatePowerTagsForTags(long creatureId, List<TagPowers> tagPowers, int userId) throws Exception {
        for (TagPowers tagPower : tagPowers) {
            updatePowerTagsForTag(creatureId, tagPower.getTagId(), tagPower.getPowerIds(), userId);
        }
    }

    private static void updatePowerTagsForPower(long creatureId, String powerId, List<Tag> tags, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            deletePowerTagsForPower(creatureId, powerId, userId, connection);
            if (!tags.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO creature_power_tags (creature_id, power_id, creature_tag_id) VALUES (?,?,?)");
                for (Tag tag : tags) {
                    statement.setLong(1, creatureId);
                    MySql.setId(2, powerId, userId, statement);
                    MySql.setId(3, tag.getId(), userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updatePowerTagsForTag(long creatureId, String tagId, List<String> powerIds, int userId) throws Exception {
        Set<String> uniquePowerIds = new HashSet<>(powerIds);
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            deletePowerTagsForTag(creatureId, tagId, userId, connection);

            if (!powerIds.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO creature_power_tags (creature_id, power_id, creature_tag_id) VALUES (?,?,?)");
                for (String powerId : uniquePowerIds) {
                    statement.setLong(1, creatureId);
                    MySql.setId(2, powerId, userId, statement);
                    MySql.setId(3, tagId, userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void deletePowerTagsForPower(long creatureId, String powerId, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_power_tags WHERE creature_id = ? AND power_id = ?");
            statement.setLong(1, creatureId);
            MySql.setId(2, powerId, userId, statement);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deletePowerTagsForTag(long creatureId, String tagId, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_power_tags WHERE creature_id = ? AND creature_tag_id = ?");
            statement.setLong(1, creatureId);
            MySql.setId(2, tagId, userId, statement);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deletePowerTags(long creatureId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM creature_power_tags WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /**************************** Damage Modifiers ********************************/

    public static void updateDamageModifier(String creatureIdStr, String damageTypeIdStr, DamageModifierType damageModifierType, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(creatureIdStr, userId);
        long damageTypeId = MySql.decodeId(damageTypeIdStr, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            deleteDamageModifier(creatureId, damageTypeId, connection);

            statement = connection.prepareStatement("INSERT INTO `creature_damage_modifiers` (`creature_id`, `damage_type_id`, `damage_modifier_type_id`, `condition`) VALUES (?, ?, ?, ?)");
            statement.setLong(1, creatureId);
            statement.setLong(2, damageTypeId);
            statement.setInt(3, damageModifierType.getValue());
            statement.setString(4, "");
            statement.executeUpdate();

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<DamageModifier> getDamageModifiers(ResultSet resultSet, int userId) throws Exception {
        List<DamageModifier> damageModifiers = new ArrayList<>();
        while (resultSet.next()) {
            damageModifiers.add(getDamageModifier(resultSet, userId));
        }
        return damageModifiers;
    }

    private static DamageModifier getDamageModifier(ResultSet resultSet, int userId) throws Exception {
        return new DamageModifier(
                getDamageType(resultSet, userId),
                DamageModifierType.valueOf(resultSet.getInt("damage_modifier_type_id")),
                resultSet.getString("condition")
        );
    }

    private static DamageType getDamageType(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("damage_type_id");
        if (id == 0) {
            return null;
        }
        return new DamageType(
                MySql.encodeId(id, userId),
                resultSet.getString("damage_type_name"),
                resultSet.getString("damage_type_description"),
                resultSet.getInt("damage_type_sid"),
                resultSet.getBoolean("damage_type_is_author"),
                resultSet.getInt("damage_type_version")
        );
    }

    private static void updateDamageModifiers(long creatureId, Creature creature, int userId, Connection connection) throws Exception {
        deleteDamageModifiers(creatureId, connection);
        List<DamageModifier> damageModifiers = creature.getDamageModifiers();
        if (damageModifiers.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `creature_damage_modifiers` (`creature_id`, `damage_type_id`, `damage_modifier_type_id`, `condition`) VALUES (?, ?, ?, ?)");
            for (DamageModifier damageModifier : damageModifiers) {
                statement.setLong(1, creatureId);
                MySql.setId(2, damageModifier.getDamageType().getId(), userId, statement);
                statement.setInt(3, damageModifier.getDamageModifierType().getValue());
                statement.setString(4, MySql.getValue(damageModifier.getCondition(), 100));
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

    private static void deleteDamageModifiers(long creatureId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_damage_modifiers WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteDamageModifier(long creatureId, long damageTypeId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_damage_modifiers WHERE creature_id = ? AND damage_type_id = ?");
            statement.setLong(1, creatureId);
            statement.setLong(2, damageTypeId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************** Condition Immunities ********************************/

    public static List<ListObject> getConditionImmunities(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> conditionImmunities = new ArrayList<>();
        while (resultSet.next()) {
            conditionImmunities.add(MySql.getListObject(resultSet, userId));
        }
        return conditionImmunities;
    }

    private static List<ListObject> getConditionImmunities(long creatureId, int userId) throws Exception {
        List<ListObject> conditionImmunities = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT a.id, a.name, a.sid, 1 AS is_author FROM creature_condition_immunities cci JOIN attributes a ON cci.condition_id = a.id WHERE cci.creature_id = ?");
            statement.setLong(1, creatureId);
            ResultSet resultSet = statement.executeQuery();
            conditionImmunities = getConditionImmunities(resultSet, userId);
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return conditionImmunities;
    }

    public static List<ListObject> updateConditionImmunity(String id, String condId, boolean immune, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        if (!immune) {
            long conditionId = MySql.decodeId(condId, userId);
            deleteConditionImmunity(creatureId, conditionId);
        } else {
            Connection connection = null;
            PreparedStatement statement = null;
            try {
                connection = MySql.getConnection();
                statement = connection.prepareStatement("INSERT INTO `creature_condition_immunities` (`creature_id`, `condition_id`) VALUES (?, ?)");
                statement.setLong(1, creatureId);
                MySql.setId(2, condId, userId, statement);
                statement.executeUpdate();
                MySql.closeConnections(null, statement, connection);
            } catch (Exception e) {
                MySql.closeConnectionsAndThrow(null, statement, connection, e);
            }
        }

        return getConditionImmunities(creatureId, userId);
    }

    private static void updateConditionImmunities(long creatureId, Creature creature, int userId, Connection connection) throws Exception {
        deleteConditionImmunities(creatureId, connection);
        List<ListObject> conditionImmunities = creature.getConditionImmunities();
        if (conditionImmunities.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `creature_condition_immunities` (`creature_id`, `condition_id`) VALUES (?, ?)");
            for (ListObject conditionImmunity : conditionImmunities) {
                statement.setLong(1, creatureId);
                MySql.setId(2, conditionImmunity.getId(), userId, statement);
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

    private static void deleteConditionImmunities(long creatureId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_condition_immunities WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteConditionImmunity(long creatureId, long conditionId) throws  Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM creature_condition_immunities WHERE creature_id = ? AND condition_id = ?");
            statement.setLong(1, creatureId);
            statement.setLong(2, conditionId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /**************************** Active Conditions ********************************/

    public static List<ActiveCondition> getActiveConditions(Statement statement, ResultSet resultSet, int userId) throws Exception {
        List<ActiveCondition> activeConditions = new ArrayList<>();
        while (resultSet.next()) {
            activeConditions.add(getActiveCondition(resultSet, userId, false));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                activeConditions.add(getActiveCondition(resultSet, userId, true));
            }
        }

        return activeConditions;
    }

    private static List<ActiveCondition> getActiveConditions(long creatureId, int userId) throws Exception {
        List<ActiveCondition> activeConditions = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creature_ActiveConditions(?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                activeConditions = getActiveConditions(statement, resultSet, userId);
            }
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return activeConditions;
    }

    private static ActiveCondition getActiveCondition(ResultSet resultSet, int userId, boolean inherited) throws Exception {
        return new ActiveCondition(
                new ListObject(MySql.encodeId(resultSet.getLong("id"), userId), resultSet.getString("name"), resultSet.getInt("sid"), resultSet.getBoolean("is_author")),
                inherited
        );
    }

    public static List<ActiveCondition> updateActiveConditions(String id, List<ListObject> activeConditions, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            deleteActiveConditions(creatureId, connection);
            if (!activeConditions.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `creature_conditions` (`creature_id`, `condition_id`) VALUES (?,?)");
                for (ListObject condition : activeConditions) {
                    statement.setLong(1, creatureId);
                    MySql.setId(2, condition.getId(), userId, statement);
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (activeConditions.isEmpty()) {
            return new ArrayList<>();
        }
        return getActiveConditions(creatureId, userId);
    }

    public static List<ActiveCondition> updateActiveCondition(String id, String condId, boolean active, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        long conditionId = MySql.decodeId(condId, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            if (active) {
                statement = connection.prepareStatement("INSERT INTO `creature_conditions` (`creature_id`, `condition_id`) VALUES (?,?)");
                statement.setLong(1, creatureId);
                statement.setLong(2, conditionId);
                statement.executeUpdate();
            } else {
                statement = connection.prepareStatement("DELETE FROM creature_conditions WHERE creature_id = ? AND condition_id = ?");
                statement.setLong(1, creatureId);
                statement.setLong(2, conditionId);
                statement.executeUpdate();
            }
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return getActiveConditions(creatureId, userId);
    }

    private static void deleteActiveConditions(long creatureId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_conditions WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************** Senses ********************************/

    public static List<SenseValue> getSenses(ResultSet resultSet) throws Exception {
        List<SenseValue> senses = new ArrayList<>();
        while (resultSet.next()) {
            senses.add(getSenseValue(resultSet));
        }
        return senses;
    }

    private static SenseValue getSenseValue(ResultSet resultSet) throws Exception {
        return new SenseValue(
                Sense.valueOf(resultSet.getInt("sense_id")),
                resultSet.getInt("range")
        );
    }

    private static void updateSenses(long creatureId, Creature creature, Connection connection) throws Exception {
        deleteSenses(creatureId, connection);
        List<SenseValue> senses = creature.getSenses();
        if (senses.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `creature_senses` (`creature_id`, `sense_id`, `range`) VALUES (?, ?, ?)");
            for (SenseValue senseValue : senses) {
                statement.setLong(1, creatureId);
                statement.setInt(2, senseValue.getSense().getValue());
                statement.setInt(3, MySql.getValue(senseValue.getRange(), 0, 999));
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

    private static void deleteSenses(long creatureId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_senses WHERE creature_id = ?");
            statement.setLong(1, creatureId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************************** Filters **************************************/

    public static List<CreatureFilter> getFilters(Statement statement, int userId) throws Exception {
        List<CreatureFilter> filters = new ArrayList<>();
        ResultSet resultSet;

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            filters.add(getFilters(resultSet, FilterType.ITEM, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            filters.add(getFilters(resultSet, FilterType.SPELL, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            filters.add(getFilters(resultSet, FilterType.FEATURE, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            filters.add(getFilters(resultSet, FilterType.SKILL, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            filters.add(getFilters(resultSet, FilterType.NOTE, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            filters.add(getFilters(resultSet, FilterType.COMPANION, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            filters.add(getFilters(resultSet, FilterType.CONDITION, userId));
        }

        return filters;
    }

    public static CreatureFilter getFilters(ResultSet resultSet, FilterType filterType, int userId) throws Exception {
        List<FilterValue> filterValues = new ArrayList<>();
        while (resultSet.next()) {
            filterValues.add(getFilterValue(resultSet, userId));
        }
        return new CreatureFilter(filterType, filterValues);
    }

    private static FilterValue getFilterValue(ResultSet resultSet, int userId) throws Exception {
        FilterValue filterValue = new FilterValue(
                FilterKey.valueOf(resultSet.getInt("filter_key_id")),
                resultSet.getString("filter_value")
        );
        if (filterValue.getKey() == FilterKey.TAGS) {
            List<String> ids = MySql.encodeIds(filterValue.getValue().split(","), userId);
            filterValue.setValue(MySql.joinStrings(ids));
        }
        return filterValue;
    }

    public static void updateFilters(String id, FilterType filterType, List<FilterValue> filters, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        updateFilters(creatureId, filterType, filters, userId);
    }

    private static void updateFilters(long creatureId, FilterType filterType, List<FilterValue> filters, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            deleteFilters(creatureId, filterType, connection);
            if (!filters.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `creature_stored_filters` (creature_id, filter_type_id, filter_key_id, filter_value) VALUES (?,?,?,?);");
                for (FilterValue filterValue : filters) {
                    String value = filterValue.getValue();
                    if (filterValue.getKey() == FilterKey.TAGS) {
                        List<Long> tagsIdsList = PowerService.getTagIds(value.split(","), userId);
                        value = MySql.joinLongIds(tagsIdsList);
                    }

                    statement.setLong(1, creatureId);
                    statement.setInt(2, filterType.getValue());
                    statement.setInt(3, filterValue.getKey().getValue());
                    statement.setString(4, MySql.getValue(value, 100));
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteFilters(long creatureId, FilterType filterType, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_stored_filters WHERE creature_id = ? AND filter_type_id = ?");
            statement.setLong(1, creatureId);
            statement.setInt(2, filterType.getValue());
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /**************************************** Sorts **************************************/

    public static List<CreatureSort> getSorts(Statement statement) throws Exception {
        List<CreatureSort> sorts = new ArrayList<>();
        ResultSet resultSet;

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            sorts.add(getSorts(resultSet, SortType.ITEM));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            sorts.add(getSorts(resultSet, SortType.SPELL));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            sorts.add(getSorts(resultSet, SortType.FEATURE));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            sorts.add(getSorts(resultSet, SortType.SKILL));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            sorts.add(getSorts(resultSet, SortType.NOTE));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            sorts.add(getSorts(resultSet, SortType.COMPANION));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            sorts.add(getSorts(resultSet, SortType.CONDITION));
        }

        return sorts;
    }

    public static CreatureSort getSorts(ResultSet resultSet, SortType sortType) throws Exception {
        List<SortValue> sortValues = new ArrayList<>();
        while (resultSet.next()) {
            sortValues.add(getSortValue(resultSet));
        }
        return new CreatureSort(sortType, sortValues);
    }

    private static SortValue getSortValue(ResultSet resultSet) throws Exception {
        return new SortValue(
                SortKey.valueOf(resultSet.getInt("sort_key_id")),
                resultSet.getBoolean("ascending")
        );
    }

    public static void updateSorts(String id, SortType sortType, List<SortValue> sortValues, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        updateSorts(creatureId, sortType, sortValues);
    }

    private static void updateSorts(long creatureId, SortType sortType, List<SortValue> sortValues) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            deleteSorts(creatureId, sortType, connection);
            if (!sortValues.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `creature_stored_sorts` (creature_id, sort_type_id, sort_key_id, `ascending`) VALUES (?,?,?,?);");
                for (SortValue sortValue : sortValues) {
                    statement.setLong(1, creatureId);
                    statement.setInt(2, sortType.getValue());
                    statement.setInt(3, sortValue.getSortKey().getValue());
                    statement.setBoolean(4, sortValue.isAscending());
                    statement.addBatch();
                }
                statement.executeBatch();
            }

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteSorts(long creatureId, SortType sortType, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM creature_stored_sorts WHERE creature_id = ? AND sort_type_id = ?");
            statement.setLong(1, creatureId);
            statement.setInt(2, sortType.getValue());
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static List<ListObject> getAttributes(AttributeType attributeType, List<CreatureFilter> creatureFilters, List<CreatureSort> creatureSorts, int userId) throws Exception {
        FilterSorts filterSorts = AttributeService.getFilterSorts(attributeType, creatureFilters, creatureSorts);
        return AttributeService.getFilteredAttributes(attributeType, ListSource.MY_STUFF, filterSorts, userId);
    }
}
