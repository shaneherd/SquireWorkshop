package com.herd.squire.services.monsters;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.LimitedUseType;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.monsters.MonsterFeature;
import com.herd.squire.models.monsters.MonsterPower;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.ModifierConfiguration;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MonsterFeatureService implements MonsterPowerDetailsService {

    @Override
    public MonsterPower get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getMonsterFeature(statement, resultSet, userId);
    }

    @Override
    public List<MonsterPower> getPowers(long monsterId, int userId) throws Exception {
        if (monsterId == 0) {
            return new ArrayList<>();
        }
        List<MonsterPower> features = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call MonsterPowers_GetList_Features (?,?)}");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                features = getMonsterFeatures(statement, resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        MonsterPowerService.sortPowers(features);
        return features;
    }

    private MonsterFeature getMonsterFeature(Statement statement, ResultSet resultSet, int userId) throws Exception {
        MonsterFeature monsterFeature = new MonsterFeature(
                MySql.encodeId(resultSet.getLong("monster_power_id"), userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                getLimitedUse(resultSet, userId),
                resultSet.getInt("recharge_min"),
                resultSet.getInt("recharge_max"),
                resultSet.getString("description")
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = MonsterPowerService.getModifierConfigurations(resultSet, userId);
            monsterFeature.setModifierConfigurations(modifierConfigurations);
        }

        return monsterFeature;
    }

    public static List<MonsterPower> getMonsterFeatures(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Map<Long, MonsterFeature> featureMap = new HashMap<>();

        while (resultSet.next()) {
            long id = resultSet.getLong("monster_power_id");
            MonsterFeature monsterFeature = new MonsterFeature(
                    MySql.encodeId(id, userId),
                    resultSet.getString("name"),
                    resultSet.getInt("sid"),
                    resultSet.getBoolean("is_author"),
                    resultSet.getInt("version"),
                    getLimitedUse(resultSet, userId),
                    resultSet.getInt("recharge_min"),
                    resultSet.getInt("recharge_max"),
                    resultSet.getString("description")
            );
            featureMap.put(id, monsterFeature);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<ModifierConfiguration>> map = MonsterPowerService.getModifierConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, MonsterFeature> entry : featureMap.entrySet()) {
                MonsterFeature feature = entry.getValue();
                Long featureId = entry.getKey();
                List<ModifierConfiguration> modifierConfigurations = map.get(featureId);
                if (modifierConfigurations == null) {
                    modifierConfigurations = new ArrayList<>();
                }
                feature.setModifierConfigurations(modifierConfigurations);
            }
        }

        return new ArrayList<>(featureMap.values());
    }

    private static LimitedUse getLimitedUse(ResultSet resultSet, int userId) throws Exception {
        int limitedUseTypeId = resultSet.getInt("limited_use_type_id");
        if (limitedUseTypeId == 0) {
            return null;
        }
        DiceSize diceSize = null;
        int diceSizeId = resultSet.getInt("dice_size_id");
        if (diceSizeId > 0) {
            diceSize = DiceSize.valueOf(diceSizeId);
        }

        return new LimitedUse(
                LimitedUseType.valueOf(limitedUseTypeId),
                null,
                resultSet.getInt("quantity"),
                MySql.encodeId(resultSet.getLong("ability_modifier_id"), userId),
                diceSize
        );
    }

    @Override
    public long create(long monsterId, MonsterPower power, int userId) throws Exception {
        if (!(power instanceof MonsterFeature)) {
            throw new Exception("Invalid monster power type");
        }
        MonsterFeature feature = (MonsterFeature) power;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call MonsterPowers_Create_Feature (?,?,?,?,?,?)}");
            statement.setString(1, MySql.getValue(power.getName(), 50));
            statement.setLong(2, monsterId);
            statement.setInt(3, MySql.getValue(power.getRechargeMin(), 1, 100));
            statement.setInt(4, MySql.getValue(power.getRechargeMax(), 1, 100));

            statement.setString(5, MySql.getValue(feature.getDescription(), 255));

            statement.setInt(6, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("monster_power_id");
                }
            }

            if (id != -1) {
                MonsterPowerService.updateLimitedUse(id, power, userId, connection);
                MonsterPowerService.updateModifiers(id, power, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        MonsterService.updateVersion(monsterId, userId);

        return id;
    }

    @Override
    public boolean update(long monsterId, MonsterPower power, long powerId, int userId) throws Exception {
        if (!(power instanceof MonsterFeature)) {
            throw new Exception("Invalid power type");
        }
        MonsterFeature feature = (MonsterFeature) power;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call MonsterPowers_Update_Feature (?,?,?,?,?,?)}");
            statement.setLong(1, powerId);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(power.getName(), 50));
            statement.setInt(4, MySql.getValue(power.getRechargeMin(), 1, 100));
            statement.setInt(5, MySql.getValue(power.getRechargeMax(), 1, 100));

            statement.setString(6, MySql.getValue(feature.getDescription(), 255));

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                MonsterPowerService.updateLimitedUse(powerId, power, userId, connection);
                MonsterPowerService.updateModifiers(powerId, power, userId, connection);
            }

            connection.commit();


            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        MonsterService.updateVersion(monsterId, userId);

        return success;
    }

    @Override
    public long addToMyStuff(long monsterId, MonsterPower authorPower, int authorUserId, ListObject existingPower, int userId) throws Exception {
        if (!(authorPower instanceof MonsterFeature)) {
            throw new Exception("Invalid power type");
        }
        MonsterFeature feature = (MonsterFeature)authorPower;

        SharingUtilityService.addModifierConfigurationsToMyStuff(feature.getModifierConfigurations(), userId);
        SharingUtilityService.addLimitedUseToMyStuff(feature.getLimitedUse(), userId);

        long featureId;
        if (feature.getSid() != 0) {
            MonsterPowerService.addSystemPower(MySql.decodeId(feature.getId(), authorUserId), userId);
            featureId = MySql.decodeId(feature.getId(), authorUserId);
        } else {
            if (existingPower == null) {
                featureId = create(monsterId, feature, userId);
            } else {
                featureId = MySql.decodeId(existingPower.getId(), userId);
                update(monsterId, feature, featureId, userId);
            }
        }

        return featureId;
    }

    @Override
    public void addToShareList(MonsterPower power, int userId, ShareList shareList) throws Exception {
        if (!(power instanceof MonsterFeature)) {
            throw new Exception("Invalid power type");
        }
        MonsterFeature feature = (MonsterFeature)power;

        SharingUtilityService.addModifierConfigurationsToShareList(feature.getModifierConfigurations(), userId, shareList);
        SharingUtilityService.addLimitedUseToShareList(feature.getLimitedUse(), userId, shareList);
        shareList.getPowers().add(power.getId());
    }
}
