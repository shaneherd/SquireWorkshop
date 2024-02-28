package com.herd.squire.services.powers;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.AttributeType;
import com.herd.squire.models.attributes.DamageType;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.inUse.InUse;
import com.herd.squire.models.powers.*;
import com.herd.squire.models.sharing.*;
import com.herd.squire.rest.SquireException;
import com.herd.squire.rest.SquireHttpStatus;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.InUseFactory;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PowerService {
    private static final SpellService spellService = new SpellService();
    private static final FeatureService featureService = new FeatureService();

    public static PowerDetailsService getService(PowerType powerType) throws Exception {
        PowerDetailsService powerDetailsService = null;
        switch (powerType) {
            case SPELL:
                powerDetailsService = spellService;
                break;
            case FEATURE:
                powerDetailsService = featureService;
                break;
            case QUICK_ATTACK:
                break;
            case MONSTER_ACTION:
                break;
        }

        if (powerDetailsService == null) {
            throw new Exception("Invalid Power Type");
        }
        return powerDetailsService;
    }

    public static Power getPower(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getPower(decodedId, headers);
    }

    public static Power getPower(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getPower(id, userId);
    }

    private static Power getPower(long id, int userId) throws Exception {
        Power power = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    PowerType powerType = PowerType.valueOf(resultSet.getInt("power_type_id"));

                    if (statement.getMoreResults()) {
                        PowerDetailsService detailsService = getService(powerType);
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

    public static List<FeatureListObject> getFeaturePowerList(PowerList powerList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<Long> featureIds = new ArrayList<>();
        for (ListObject power : powerList.getPowers()) {
            featureIds.add(MySql.decodeId(power.getId(), userId));
        }
        return FeatureService.getFeatureListObjects(userId, featureIds);
    }

    public static List<SpellListObject> getSpells(ListSource listSource, HttpHeaders headers) throws Exception {
        return getSpells(listSource, null, headers);
    }

    public static List<ListObject> getPowers(PowerType powerType, ListSource listSource, HttpHeaders headers) throws Exception {
        return getPowers(powerType, listSource, null, headers);
    }

    public static List<FeatureListObject> getFeaturesByCharacteristicType(CharacteristicType characteristicType, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return FeatureService.getFeaturesByCharacteristicType(characteristicType, userId);
    }

    public static List<SpellListObject> getSpells(ListSource listSource, Filters filters, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        if (filters == null) {
            filters = new Filters();
        }
        List<SpellListObject> items = new ArrayList<>();
        List<FilterValue> filterValues = filters.getFilterValues();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = spellService.getListObjectStatement(connection, filterValues, 0, userId, listSource);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    items.add(SpellService.getSpellListObject(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    public static List<ListObject> getPowers(PowerType powerType, ListSource listSource, Filters filters, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        if (filters == null) {
            filters = new Filters();
        }
        List<ListObject> items = new ArrayList<>();
        List<FilterValue> filterValues = filters.getFilterValues();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            PowerDetailsService detailsService = getService(powerType);
            statement = detailsService.getListObjectStatement(connection, filterValues, 0, userId, listSource);
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

    public static List<Long> getTagIds(String[] tagFilters, int userId) throws Exception {
        List<Long> tagsIdsList = new ArrayList<>();
        for (int i = 0; i < tagFilters.length; i++) {
            String filter = tagFilters[i];
            if (!filter.isEmpty() && !filter.equals("0")) {
                tagsIdsList.add(MySql.decodeId(filter, userId));
            }
        }
        return tagsIdsList;
    }

    public static String createPower(Power power, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long newId = createPower(power, userId);

        if (newId < 1) {
            throw new SquireException(SquireHttpStatus.INTERNAL_SERVER_ERROR);
        }

        return MySql.encodeId(newId, userId);
    }

    public static long createPower(Power power, int userId) throws Exception {
        PowerDetailsService detailsService = getService(power.getPowerType());
        return detailsService.create(power, userId);
    }

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
            statement = connection.prepareCall("{call Powers_GetPublishedDetails (?,?)}");
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
            statement = connection.prepareCall("{call Powers_Get_VersionInfo (?,?)}");
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
        Power power = getPower(id, userId);
        addToShareList(power, userId, shareList);
    }

    public static void addToShareList(Power power, int userId, ShareList shareList) throws Exception {
        if (power != null) {
            PowerDetailsService powerDetailsService = getService(power.getPowerType());
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

    public static void addToMyStuff(List<ListObject> powers, int userId) throws Exception {
        for (ListObject power : powers) {
            addToMyStuff(power, userId);
        }
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

    public static void addToMyStuff(Power power, int userId) throws Exception {
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

    private static long addToMyStuff(long powerId, int userId, boolean checkRights) throws Exception {
        long authorPowerId = 0;
        int authorUserId = 0;
        long existingPowerId = 0;

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, powerId);
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

        Power authorPower = getPower(authorPowerId, authorUserId);
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

        PowerDetailsService powerDetailsService = getService(authorPower.getPowerType());
        long newId = powerDetailsService.addToMyStuff(authorPower, authorUserId, existingPower, userId);
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

            statement = connection.prepareStatement("INSERT IGNORE INTO powers_shared (power_id, user_id) VALUE (?,?);");
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

            statement = connection.prepareStatement("UPDATE powers SET published_parent_id = ?, published_parent_version = ?, version = ? WHERE id = ?;");
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
        ShareList shareList = SharingUtilityService.getPowerShareList(powerId, userId);
        SharingUtilityService.sharePublic(shareList, userId);
    }

    private static void publishPrivate(long powerId, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        ShareList shareList = SharingUtilityService.getPowerShareList(powerId, userId);
        SharingUtilityService.sharePrivate(shareList, users, userId);
    }

    private static void unPublish(long powerId, Connection connection, int userId) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Powers_Share_UnPublish (?,?)}");
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

    public static void updateCommonPowerTraits(long id, Power power, int userId, Connection connection) throws Exception {
        updateAllDamages(id, power, userId, connection);
        updateAllModifiers(id, power, userId, connection);
        updateLimitedUses(id, power.getLimitedUses(), userId, connection);
    }

    public static void updatePower(Power power, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = MySql.decodeId(power.getId(), userId);
        PowerDetailsService detailsService = getService(power.getPowerType());
        boolean success = detailsService.update(power, id, userId);
        if (!success) {
            throw new Exception("Unable to update power");
        }

        PublishDetails publishDetails = getPublishedDetails(id, userId);
        if (publishDetails.getPublishType() == PublishType.PUBLIC) {
            publishPublic(id, userId);
        } else if (publishDetails.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(id, publishDetails.getUsers(), userId);
        }
    }

    public static List<InUse> inUse(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return inUse(decodedId, userId);
    }

    public static List<InUse> inUse(long id, int userId) throws Exception {
        List<InUse> results = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Powers_InUse (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    results.add(InUseFactory.getInUse(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return results;
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
            statement = connection.prepareCall("{call Powers_Delete (?,?)}");
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
        Power power = getPower(id, headers);
        if (power == null) {
            throw new Exception("power not found");
        }
        power.setId("0");
        power.setName(name);
        return createPower(power, headers);
    }

    /******************************** Damage Configurations *********************************/

    private static void updateAllDamages(long powerId, Power power, int userId, Connection connection) throws Exception {
        deleteDamages(powerId, connection);
        updateDamages(powerId, power.getDamageConfigurations(), userId, connection);
        updateDamages(powerId, power.getExtraDamageConfigurations(), userId, connection);
        updateDamages(powerId, power.getAdvancementDamageConfigurations(), userId, connection);
    }

    private static void updateDamages(long powerId, List<DamageConfiguration> damages, int userId, Connection connection) throws Exception {
        if (damages.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `power_damages` (`power_id`, `character_advancement`, `extra`, `character_level_id`, `num_dice`, `dice_size`," +
                    " `ability_modifier_id`, `misc_mod`, `damage_type_id`, `healing`, `spellcasting_ability_modifier`, `adjustment`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");

            for (DamageConfiguration config : damages) {
                statement.setLong(1, powerId);
                statement.setBoolean(2, config.isCharacterAdvancement());
                statement.setBoolean(3, config.isExtra());
                MySql.setId(4, config.getLevel() == null ? null : config.getLevel().getId(), userId, statement);
                statement.setInt(5, MySql.getValue(config.getValues().getNumDice(), 0, 99));
                statement.setInt(6, config.getValues().getDiceSize().getValue());
                MySql.setId(7, config.getValues().getAbilityModifier() == null ? null : config.getValues().getAbilityModifier().getId(), userId, statement);
                statement.setInt(8, MySql.getValue(config.getValues().getMiscModifier(), 0, 999));
                MySql.setId(9, config.getDamageType() ==  null ? null : config.getDamageType().getId(), userId, statement);
                statement.setBoolean(10, config.isHealing());
                statement.setBoolean(11, config.isSpellCastingAbilityModifier());
                statement.setBoolean(12, config.isAdjustment());
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

    public static Map<Long, List<DamageConfiguration>> getDamageConfigurationsMap(ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<DamageConfiguration>> map = new HashMap<>();
        while (resultSet.next()) {
            long id = resultSet.getLong("power_id");
            List<DamageConfiguration> damageConfigurations = map.computeIfAbsent(id, k -> new ArrayList<>());
            damageConfigurations.add(getDamageConfiguration(resultSet, userId));
        }
        return map;
    }

    public static List<DamageConfiguration> getDamageConfigurations(ResultSet resultSet, int userId) throws Exception {
        List<DamageConfiguration> damageConfigurations = new ArrayList<>();
        while (resultSet.next()) {
            damageConfigurations.add(getDamageConfiguration(resultSet, userId));
        }
        return damageConfigurations;
    }

    private static DamageConfiguration getDamageConfiguration(ResultSet resultSet, int userId) throws Exception {
        return new DamageConfiguration(
                resultSet.getBoolean("character_advancement"),
                resultSet.getBoolean("extra"),
                new ListObject(MySql.encodeId(resultSet.getLong("character_level_id"), userId), resultSet.getString("character_level_name"), resultSet.getInt("character_level_sid"), resultSet.getBoolean("character_level_is_author")),
                getDiceCollection(resultSet, userId),
                getDamageType(resultSet, userId),
                resultSet.getBoolean("healing"),
                false,
                resultSet.getBoolean("spellcasting_ability_modifier"),
                resultSet.getBoolean("adjustment")
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

    private static DiceCollection getDiceCollection(ResultSet resultSet, int userId) throws Exception {
        return new DiceCollection(
                resultSet.getInt("num_dice"),
                DiceSize.valueOf(resultSet.getInt("dice_size")),
                getAbilityModifier(resultSet, userId),
                resultSet.getInt("misc_mod")
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
                resultSet.getString("ability_modifier_description"),
                resultSet.getInt("ability_modifier_sid"),
                resultSet.getBoolean("ability_modifier_is_author"),
                resultSet.getInt("ability_modifier_version"),
                resultSet.getString("ability_modifier_abbr")
        );
    }

    private static void deleteDamages(long powerId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM power_damages WHERE power_id = ?");
            statement.setLong(1, powerId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    /******************************** Modifier  Configurations *********************************/

    private static void updateAllModifiers(long powerId, Power power, int userId, Connection connection) throws Exception {
        deleteModifiers(powerId, connection);
        updateModifiers(powerId, power.getModifierConfigurations(), userId, connection);
        updateModifiers(powerId, power.getExtraModifierConfigurations(), userId, connection);
        updateModifiers(powerId, power.getAdvancementModifierConfigurations(), userId, connection);
    }

    private static void updateModifiers(long powerId, List<ModifierConfiguration> modifiers, int userId, Connection connection) throws Exception {
        if (modifiers.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `power_modifiers` (`power_id`, `modifier_category_id`, `modifier_sub_category_id`, `characteristic_dependant`, `attribute_id`, `value`, `adjustment`, `proficient`, `half_proficient`, `round_up`, `advantage`, `disadvantage`, `extra`, `character_advancement`, `character_level_id`, `use_level`, `use_half_level`, `ability_modifier_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            for (ModifierConfiguration config : modifiers) {
                statement.setLong(1, powerId);
                statement.setInt(2, config.getModifierCategory().getValue());
                statement.setInt(3, config.getModifierSubCategory().getValue());
                statement.setBoolean(4, config.isCharacteristicDependant());
                MySql.setId(5, config.getAttribute().getId(), userId, statement);
                statement.setInt(6, MySql.getValue(config.getValue(), -99, 99));
                statement.setBoolean(7, config.isAdjustment());
                statement.setBoolean(8, config.isProficient());
                statement.setBoolean(9, config.isHalfProficient());
                statement.setBoolean(10, config.isRoundUp());
                statement.setBoolean(11, config.isAdvantage());
                statement.setBoolean(12, config.isDisadvantage());
                statement.setBoolean(13, config.isExtra());
                statement.setBoolean(14, config.isCharacterAdvancement());
                MySql.setId(15, config.getLevel() == null ? null : config.getLevel().getId(), userId, statement);
                statement.setBoolean(16, config.isUseLevel());
                statement.setBoolean(17, config.isUseHalfLevel());
                MySql.setId(18, config.getAbilityModifier(), userId, statement);
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

    public static Map<Long, List<ModifierConfiguration>> getModifierConfigurationsMap(ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<ModifierConfiguration>> map = new HashMap<>();
        while (resultSet.next()) {
            long id = resultSet.getLong("power_id");
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
            resultSet.getBoolean("characteristic_dependant"),
            resultSet.getInt("value"),
            resultSet.getBoolean("adjustment"),
            resultSet.getBoolean("proficient"),
            resultSet.getBoolean("half_proficient"),
            resultSet.getBoolean("round_up"),
            resultSet.getBoolean("advantage"),
            resultSet.getBoolean("disadvantage"),
            resultSet.getBoolean("extra"),
            resultSet.getBoolean("character_advancement"),
            new ListObject(MySql.encodeId(resultSet.getLong("character_level_id"), userId), resultSet.getString("character_level_name"), resultSet.getInt("character_level_sid"), resultSet.getBoolean("character_level_is_author")),
            new ListObject(MySql.encodeId(resultSet.getLong("ability_modifier_id"), userId), resultSet.getString("ability_modifier_name"), resultSet.getInt("ability_modifier_sid"), resultSet.getBoolean("ability_modifier_is_author")),
            resultSet.getBoolean("use_level"),
            resultSet.getBoolean("use_half_level")
        );
    }

    private static void deleteModifiers(long powerId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM power_modifiers WHERE power_id = ?");
            statement.setLong(1, powerId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static Map<Long, List<ModifierConfiguration>> getModifiers(ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<ModifierConfiguration>> modifiers = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            if (!modifiers.containsKey(powerId)) {
                modifiers.put(powerId, new ArrayList<>());
            }
            List<ModifierConfiguration> modifierList = modifiers.get(powerId);
            modifierList.add(getModifierConfiguration(resultSet, userId));
        }
        return modifiers;
    }

    /******************************** Limited Uses *********************************/

    private static void updateLimitedUses(long powerId, List<LimitedUse> limitedUses, int userId, Connection connection) throws Exception {
        deleteLimitedUses(powerId, connection);
        if (limitedUses.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `power_limited_uses` (`power_id`, `level_id`, `limited_use_type_id`, `quantity`, `ability_modifier_id`, `dice_size_id`) VALUES (?,?,?,?,?,?)");
            for (LimitedUse limitedUse : limitedUses) {
                statement.setLong(1, powerId);
                MySql.setId(2, limitedUse.getCharacterLevel(), userId, statement);
                statement.setInt(3, limitedUse.getLimitedUseType().getValue());
                statement.setInt(4, MySql.getValue(limitedUse.getQuantity(), 0, 999));
                MySql.setId(5, limitedUse.getAbilityModifier(), userId, statement);
                MySql.setInteger(6, limitedUse.getDiceSize() == null ? null : limitedUse.getDiceSize().getValue(), statement);
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

    private static void deleteLimitedUses(long powerId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM power_limited_uses WHERE power_id = ?");
            statement.setLong(1, powerId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static Map<Long, List<LimitedUse>> getLimitedUsesMap(ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<LimitedUse>> limitedUses = new HashMap<>();
        while (resultSet.next()) {
            long powerId = resultSet.getLong("power_id");
            List<LimitedUse> limitedUseList = limitedUses.computeIfAbsent(powerId, k -> new ArrayList<>());
            limitedUseList.add(getLimitedUse(resultSet, userId));
        }
        return limitedUses;
    }

    public static List<LimitedUse> getLimitedUses(ResultSet resultSet, int userId) throws Exception {
        List<LimitedUse> limitedUses = new ArrayList<>();
        while (resultSet.next()) {
            limitedUses.add(getLimitedUse(resultSet, userId));
        }
        return limitedUses;
    }

    private static LimitedUse getLimitedUse(ResultSet resultSet, int userId) throws Exception {
        DiceSize diceSize = null;
        int diceSizeId = resultSet.getInt("dice_size_id");
        if (diceSizeId > 0) {
            diceSize = DiceSize.valueOf(diceSizeId);
        }

        return new LimitedUse(
                LimitedUseType.valueOf(resultSet.getInt("limited_use_type_id")),
                new ListObject(MySql.encodeId(resultSet.getLong("level_id"), userId), resultSet.getString("level_name"), resultSet.getInt("level_sid"), resultSet.getBoolean("level_is_author")),
                resultSet.getInt("quantity"),
                MySql.encodeId(resultSet.getLong("ability_modifier_id"), userId),
                diceSize
        );
    }

    public static List<ListObject> getClasses(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long spellId = MySql.decodeId(id, userId);
        return getClasses(spellId, userId);
    }

    private static List<ListObject> getClasses(long spellId, int userId) throws Exception {
        List<ListObject> classes = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{CALL Spells_GetCharacteristics(?,?)}");
            statement.setLong(1, spellId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    classes.add(new ListObject(MySql.encodeId(resultSet.getLong("id"), userId), resultSet.getString("name"), resultSet.getInt("sid"), resultSet.getBoolean("is_author")));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return classes;
    }

    public static void assignClasses(String id, List<ListObject> classes, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long spellId = MySql.decodeId(id, userId);
        addSpellConfigurations(spellId, classes, userId);
    }

    private static void addSpellConfigurations(long spellId, List<ListObject> characteristics, int userId) throws Exception {
        if (characteristics.isEmpty()) {
            return;
        }
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT IGNORE INTO `characteristic_spell_configurations` (`characteristic_id`, `spell_id`, `level_gained`, `always_prepared`, `counts_towards_prepared_limit`, `notes`, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
            for (ListObject characterClass : characteristics) {
                MySql.setId(1, characterClass, userId, statement);
                statement.setLong(2, spellId);
                statement.setNull(3, Types.BIGINT);
                statement.setBoolean(4, false);
                statement.setBoolean(5, true);
                statement.setString(6, "");
                statement.setInt(7, userId);
                statement.addBatch();
            }
            statement.executeBatch();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void removeClasses(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long spellId = MySql.decodeId(id, userId);
        removeClasses(spellId, userId);
    }

    private static void removeClasses(long spellId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM characteristic_spell_configurations WHERE spell_id = ? AND user_id = ?");
            statement.setLong(1, spellId);
            statement.setInt(2, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }
}
