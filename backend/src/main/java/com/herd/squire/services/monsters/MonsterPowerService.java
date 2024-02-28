package com.herd.squire.services.monsters;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.AttributeType;
import com.herd.squire.models.monsters.*;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.ModifierCategory;
import com.herd.squire.models.powers.ModifierConfiguration;
import com.herd.squire.models.powers.ModifierSubCategory;
import com.herd.squire.models.sharing.*;
import com.herd.squire.rest.SquireException;
import com.herd.squire.rest.SquireHttpStatus;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

public class MonsterPowerService {
    private static final MonsterActionService actionService = new MonsterActionService();
    private static final MonsterFeatureService featureService = new MonsterFeatureService();

    public static MonsterPowerDetailsService getService(MonsterPowerType powerType) throws Exception {
        MonsterPowerDetailsService powerDetailsService = null;
        switch (powerType) {
            case ACTION:
                powerDetailsService = actionService;
                break;
            case FEATURE:
                powerDetailsService = featureService;
                break;
        }

        if (powerDetailsService == null) {
            throw new Exception("Invalid Monster Power Type");
        }
        return powerDetailsService;
    }

    public static MonsterPower getPower(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getPower(decodedId, headers);
    }

    public static MonsterPower getPower(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getPower(id, userId);
    }

    private static MonsterPower getPower(long id, int userId) throws Exception {
        MonsterPower power = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call MonsterPowers_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    MonsterPowerType powerType = MonsterPowerType.valueOf(resultSet.getInt("monster_power_type_id"));

                    if (statement.getMoreResults()) {
                        MonsterPowerDetailsService detailsService = getService(powerType);
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            power = detailsService.get(statement, resultSet, userId);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return power;
    }

    public static List<MonsterPower> getPowers(String id, MonsterPowerType monsterPowerType, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        return getPowers(monsterId, monsterPowerType, userId);
    }

    public static List<MonsterPower> getAllPowers(long monsterId, int userId) throws Exception {
        List<MonsterPower> monsterPowers = getPowers(monsterId, MonsterPowerType.ACTION, userId);
        monsterPowers.addAll(getPowers(monsterId, MonsterPowerType.FEATURE, userId));
        return monsterPowers;
    }

    public static List<MonsterPower> getPowers(long monsterId, MonsterPowerType monsterPowerType, int userId) throws Exception {
        MonsterPowerDetailsService detailsService = getService(monsterPowerType);
        return detailsService.getPowers(monsterId, userId);
    }

    public static String createPower(String creatureId, MonsterPower power, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(creatureId, userId);
        long newId = createPower(monsterId, power, userId);

        if (newId < 1) {
            throw new SquireException(SquireHttpStatus.INTERNAL_SERVER_ERROR);
        }

        return MySql.encodeId(newId, userId);
    }

    public static void addActions(String creatureId, MonsterActionList monsterActionList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(creatureId, userId);

        for (MonsterAction action : monsterActionList.getActions()) {
            long newId = createPower(monsterId, action, userId);
            if (newId < 1) {
                throw new SquireException(SquireHttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public static void addFeatures(String creatureId, MonsterFeatureList monsterFeatureList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(creatureId, userId);

        for (MonsterFeature feature : monsterFeatureList.getFeatures()) {
            long newId = createPower(monsterId, feature, userId);
            if (newId < 1) {
                throw new SquireException(SquireHttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public static long createPower(long monsterId, MonsterPower power, int userId) throws Exception {
        MonsterPowerDetailsService detailsService = getService(power.getMonsterPowerType());
        return detailsService.create(monsterId, power, userId);
    }

    public static void updatePower(String id, MonsterPower power, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        updatePower(monsterId, power, userId);
    }

    public static void updatePower(long monsterId, MonsterPower power, int userId) throws Exception {
        long id = MySql.decodeId(power.getId(), userId);
        MonsterPowerDetailsService detailsService = getService(power.getMonsterPowerType());
        boolean success = detailsService.update(monsterId, power, id, userId);
        if (!success) {
            throw new Exception("Unable to update monster power");
        }

        PublishDetails publishDetails = getPublishedDetails(id, userId);
        if (publishDetails.getPublishType() == PublishType.PUBLIC) {
            publishPublic(id, userId);
        } else if (publishDetails.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(id, publishDetails.getUsers(), userId);
        }
    }

    public static void deletePowers(String monsterId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(monsterId, userId);
        deletePowers(decodedId, userId);
    }

    public static void deletePowers(long monsterId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_Delete_MonsterPowers (?,?)}");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
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
        Connection connection = null;
        CallableStatement statement = null;
        int result = -1;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call MonsterPowers_Delete (?,?)}");
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

    public static String duplicate(String monsterId, String powerId, String name, HttpHeaders headers) throws Exception {
        MonsterPower power = getPower(powerId, headers);
        if (power == null) {
            throw new Exception("power not found");
        }
        power.setId("0");
        power.setName(name);
        return createPower(monsterId, power, headers);
    }

    /********************** Sharing *************************/

    public static PublishDetails getPublishedDetails(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long powerId = MySql.decodeId(id, userId);
        return getPublishedDetails(powerId, userId);
    }

    private static PublishDetails getPublishedDetails(long powerId, int userId) throws Exception {
        PublishDetails publishDetails = new PublishDetails();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call MonsterPowers_GetPublishedDetails (?,?)}");
            statement.setLong(1, powerId);
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
        long powerId = MySql.decodeId(id, userId);
        return getVersionInfo(powerId, userId);
    }

    private static VersionInfo getVersionInfo(long powerId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        VersionInfo versionInfo = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call MonsterPowers_Get_VersionInfo (?,?)}");
            statement.setLong(1, powerId);
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

    /********************************************************************************************/

    public static void addToShareList(List<ListObject> powers, int userId, ShareList shareList) throws Exception {
        if (powers != null) {
            for (ListObject item : powers) {
                addToShareList(item, userId, shareList);
            }
        }
    }

    public static void addToShareList(ListObject power, int userId, ShareList shareList) throws Exception {
        if (power != null) {
            long id = MySql.decodeId(power.getId(), userId);
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
        MonsterPower power = getPower(id, userId);
        addToShareList(power, userId, shareList);
    }

    public static void addToShareList(MonsterPower power, int userId, ShareList shareList) throws Exception {
        if (power != null) {
            MonsterPowerDetailsService powerDetailsService = getService(power.getMonsterPowerType());
            powerDetailsService.addToShareList(power, userId, shareList);
        }
    }

    /********************************************************************************************/

    public static String addToMyStuff(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long powerId = MySql.decodeId(id, userId);
        if (powerId == 0) {
            return "0";
        }
        long newId = addToMyStuff(powerId, userId, true);
        return MySql.encodeId(newId, userId);
    }

    public static void addToMyStuff(ListObject power, int userId) throws Exception {
        if (power != null) {
            long id = MySql.decodeId(power.getId(), userId);
            if (id != 0) {
                long powerId = addToMyStuff(id, userId, false);
                power.setId(MySql.encodeId(powerId, userId));
            }
        }
    }

    public static void addToMyStuff(MonsterPower power, int userId) throws Exception {
        if (power != null) {
            long id = MySql.decodeId(power.getId(), userId);
            if (id != 0) {
                long powerId = addToMyStuff(id, userId, false);
                power.setId(MySql.encodeId(powerId, userId));
            }
        }
    }

    public static String addToMyStuff(String id, int userId) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                long powerId = addToMyStuff(decodeId, userId, false);
                return MySql.encodeId(powerId, userId);
            }
        }
        return "0";
    }

    public static void addMonsterPowersToMyStuff(long authorMonsterId, long userMonsterId, int userId, int authorUserId) throws Exception {
        List<MonsterPower> monsterPowers = getAllPowers(authorMonsterId, authorUserId);

        Map<Long, MonsterPower> monsterPowerMap = new HashMap<>();
        for (MonsterPower monsterPower : monsterPowers) {
            monsterPowerMap.put(MySql.decodeId(monsterPower.getId(), authorUserId), monsterPower);
        }
        List<Long> monsterPowersToDelete = new ArrayList<>();
        List<MonsterAddToMyStuffDetails> details = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monster_MonsterPowers_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, authorMonsterId);
            statement.setInt(2, authorUserId);
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    long authorPowerId = resultSet.getLong("author_power_id");
                    long existingPowerId = resultSet.getLong("existing_power_id");
                    int authorPowerTypeId = resultSet.getInt("author_monster_power_type_id");
                    int existingPowerTypeId = resultSet.getInt("existing_monster_power_type_id");
                    MonsterPower monsterPower = monsterPowerMap.get(authorPowerId);

                    if (authorPowerId != 0 && (existingPowerId == 0 || authorPowerTypeId == existingPowerTypeId)) {
                        details.add(new MonsterAddToMyStuffDetails(
                                authorPowerId,
                                authorUserId,
                                authorPowerTypeId,
                                existingPowerId,
                                existingPowerTypeId,
                                monsterPower
                        ));
                    }
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    while (resultSet.next()) {
                        monsterPowersToDelete.add(resultSet.getLong("id"));
                    }
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        for (MonsterAddToMyStuffDetails monsterPowerDetails : details) {
            ListObject existingPower = null;
            if (monsterPowerDetails.getExistingPowerId() != 0) {
                existingPower = new ListObject(
                        MySql.encodeId(monsterPowerDetails.getExistingPowerId(), userId),
                        "",
                        0,
                        false
                );
            }

            MonsterPower authorPower = monsterPowerDetails.getAuthorMonsterPower();
            MonsterPowerDetailsService powerDetailsService = getService(authorPower.getMonsterPowerType());
            long newId = powerDetailsService.addToMyStuff(userMonsterId, authorPower, authorUserId, existingPower, userId);
            if (newId < 1) {
                throw new Exception("unable to add monster power");
            }
            if (authorPower.getSid() == 0) {
                updateParentId(newId, monsterPowerDetails.getAuthorPowerId(), authorPower.getVersion());
            }
        }

        if (!monsterPowersToDelete.isEmpty()) {
            for (Long monsterPowerId : monsterPowersToDelete) {
                delete(monsterPowerId, userId);
            }
        }
    }

    private static long addToMyStuff(long monsterPowerId, int userId, boolean checkRights) throws Exception {
        long authorPowerId = 0;
        int authorUserId = 0;
        long existingPowerId = 0;
        long monsterId = 0;

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call MonsterPowers_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, monsterPowerId);
            statement.setInt(2, userId);
            statement.setBoolean(3, checkRights);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    authorPowerId = resultSet.getLong("author_power_id");
                    if (authorPowerId == 0) {
                        throw new Exception("unable to find power to add");
                    }

                    authorUserId = resultSet.getInt("author_user_id");
                    existingPowerId = resultSet.getLong("existing_power_id");
                    monsterId = resultSet.getLong("monster_id");

                    int authorPowerTypeId = resultSet.getInt("author_power_type_id");
                    int existingPowerTypeId = resultSet.getInt("existing_power_type_id");
                    if (existingPowerId > 0 && authorPowerTypeId != existingPowerTypeId) {
                        throw new Exception("unable to update existing power");
                    }
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        MonsterPower authorPower = getPower(authorPowerId, authorUserId);
        if (authorPower == null) {
            throw new Exception("unable to find power to add");
        }
        ListObject existingPower = null;
        if (existingPowerId != 0) {
            existingPower = new ListObject(
                    MySql.encodeId(existingPowerId, userId),
                    "",
                    0,
                    false
            );
        }

        MonsterPowerDetailsService powerDetailsService = getService(authorPower.getMonsterPowerType());
        long newId = powerDetailsService.addToMyStuff(monsterId, authorPower, authorUserId, existingPower, userId);
        if (newId < 1) {
            throw new Exception("unable to add power");
        }
        if (authorPower.getSid() == 0) {
            updateParentId(newId, authorPowerId, authorPower.getVersion());
        }
        return newId;
    }

    public static void addSystemPower(long id, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("INSERT IGNORE INTO monster_powers_shared (monster_power_id, user_id) VALUE (?,?);");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateParentId(long id, long parentId, int parentVersion) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE monster_powers SET published_parent_id = ?, published_parent_version = ?, version = ? WHERE id = ?;");
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

    public static void publishPower(String id, PublishRequest publishRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long powerId = MySql.decodeId(id, userId);
        publishPower(powerId, publishRequest, userId);
    }

    private static long publishPower(long powerId, PublishRequest publishRequest, int userId) throws Exception {
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            if (publishRequest.getPublishType() == PublishType.PUBLIC) {
                publishPublic(powerId, userId);
            } else if (publishRequest.getPublishType() == PublishType.PRIVATE) {
                publishPrivate(powerId, publishRequest.getUsers(), userId);
            } else {
                unPublish(powerId, connection, userId);
            }

            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }

        return powerId;
    }

    private static void publishPublic(long powerId, int userId) throws Exception {
        ShareList shareList = SharingUtilityService.getMonsterPowerShareList(powerId, userId);
        SharingUtilityService.sharePublic(shareList, userId);
    }

    private static void publishPrivate(long powerId, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        ShareList shareList = SharingUtilityService.getMonsterPowerShareList(powerId, userId);
        SharingUtilityService.sharePrivate(shareList, users, userId);
    }

    private static void unPublish(long powerId, Connection connection, int userId) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call MonsterPowers_Share_UnPublish (?,?)}");
            statement.setLong(1, powerId);
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

    /******************************** Modifier  Configurations *********************************/

    public static Map<Long, List<ModifierConfiguration>> getModifierConfigurationsMap(ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<ModifierConfiguration>> map = new HashMap<>();
        while (resultSet.next()) {
            long id = resultSet.getLong("monster_power_id");
            List<ModifierConfiguration> modifierConfigurations = map.computeIfAbsent(id, k -> new ArrayList<>());
            modifierConfigurations.add(getModifierConfiguration(resultSet, userId));
        }
        return map;
    }

    public static List<ModifierConfiguration> getModifierConfigurations(ResultSet resultSet, int userId) throws Exception {
        List<ModifierConfiguration> modifierConfigurations = new ArrayList<>();
        while (resultSet.next()) {
            modifierConfigurations.add(getModifierConfiguration(resultSet, userId));
        }
        return modifierConfigurations;
    }

    private static ModifierConfiguration getModifierConfiguration(ResultSet resultSet, int userId) throws Exception {
        return new ModifierConfiguration(
                new Attribute(
                        MySql.encodeId(resultSet.getLong("attribute_id"), userId),
                        resultSet.getString("attribute_name"),
                        resultSet.getString("attribute_description"),
                        AttributeType.valueOf(resultSet.getInt("attribute_type_id")),
                        resultSet.getInt("attribute_sid"),
                        resultSet.getBoolean("attribute_is_author"),
                        resultSet.getInt("attribute_version")
                ),
                ModifierCategory.valueOf(resultSet.getInt("modifier_category_id")),
                ModifierSubCategory.valueOf(resultSet.getInt("modifier_sub_category_id")),
                false,
                resultSet.getInt("value"),
                resultSet.getBoolean("adjustment"),
                resultSet.getBoolean("proficient"),
                resultSet.getBoolean("half_proficient"),
                resultSet.getBoolean("round_up"),
                resultSet.getBoolean("advantage"),
                resultSet.getBoolean("disadvantage"),
                false,
                false,
                null,
                new ListObject(MySql.encodeId(resultSet.getLong("ability_modifier_id"), userId), resultSet.getString("ability_modifier_name"), resultSet.getInt("ability_modifier_sid"), resultSet.getBoolean("ability_modifier_is_author")),
                false,
                false
        );
    }

    public static void updateLimitedUse(long powerId, MonsterPower monsterPower, int userId, Connection connection) throws Exception {
        deleteLimitedUse(powerId, connection);
        updateLimitedUse(powerId, monsterPower.getLimitedUse(), userId, connection);
    }

    private static void deleteLimitedUse(long monsterPowerId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_power_limited_uses WHERE monster_power_id = ?");
            statement.setLong(1, monsterPowerId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateLimitedUse(long powerId, LimitedUse limitedUse, int userId, Connection connection) throws Exception {
        if (limitedUse == null) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_power_limited_uses` (`monster_power_id`, `limited_use_type_id`, `quantity`, `ability_modifier_id`, `dice_size_id`) VALUES (?,?,?,?,?)");
            statement.setLong(1, powerId);
            statement.setInt(2, limitedUse.getLimitedUseType().getValue());
            statement.setInt(3, MySql.getValue(limitedUse.getQuantity(), 0, 999));
            MySql.setId(4, limitedUse.getAbilityModifier().equals("0") ? null : limitedUse.getAbilityModifier(), userId, statement);
            MySql.setInteger(5, limitedUse.getDiceSize() == null ? null : limitedUse.getDiceSize().getValue(), statement);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static void updateModifiers(long powerId, MonsterPower monsterPower, int userId, Connection connection) throws Exception {
        deleteModifiers(powerId, connection);
        updateModifiers(powerId, monsterPower.getModifierConfigurations(), userId, connection);
    }

    private static void deleteModifiers(long monsterPowerId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_power_modifiers WHERE monster_power_id = ?");
            statement.setLong(1, monsterPowerId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateModifiers(long powerId, List<ModifierConfiguration> modifiers, int userId, Connection connection) throws Exception {
        if (modifiers == null || modifiers.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_power_modifiers` (`monster_power_id`, `modifier_category_id`, `modifier_sub_category_id`, `attribute_id`, `value`, `adjustment`, `proficient`, `half_proficient`, `round_up`, `advantage`, `disadvantage`, `ability_modifier_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
            for (ModifierConfiguration config : modifiers) {
                statement.setLong(1, powerId);
                statement.setInt(2, config.getModifierCategory().getValue());
                statement.setInt(3, config.getModifierSubCategory().getValue());
                MySql.setId(4, config.getAttribute().getId(), userId, statement);
                statement.setInt(5, MySql.getValue(config.getValue(), -99, 99));
                statement.setBoolean(6, config.isAdjustment());
                statement.setBoolean(7, config.isProficient());
                statement.setBoolean(8, config.isHalfProficient());
                statement.setBoolean(9, config.isRoundUp());
                statement.setBoolean(10, config.isAdvantage());
                statement.setBoolean(11, config.isDisadvantage());
                MySql.setId(12, config.getAbilityModifier(), userId, statement);
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

    public static void sortPowers(List<MonsterPower> powers) {
        powers.sort(Comparator.comparing(monsterPower -> monsterPower.getName().toLowerCase()));
    }
}
