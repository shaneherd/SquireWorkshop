package com.herd.squire.services.monsters;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.DamageType;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.items.weapon.WeaponRangeType;
import com.herd.squire.models.monsters.MonsterAction;
import com.herd.squire.models.monsters.MonsterPower;
import com.herd.squire.models.powers.AttackType;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.ModifierConfiguration;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MonsterActionService implements MonsterPowerDetailsService {
    @Override
    public MonsterPower get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getMonsterAction(statement, resultSet, userId);
    }

    @Override
    public List<MonsterPower> getPowers(long monsterId, int userId) throws Exception {
        if (monsterId == 0) {
            return new ArrayList<>();
        }
        List<MonsterPower> actions = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call MonsterPowers_GetList_Actions (?,?)}");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                actions = getMonsterActions(statement, resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return actions;
    }

    private MonsterAction getMonsterAction(Statement statement, ResultSet resultSet, int userId) throws Exception {
        MonsterAction monsterAction = new MonsterAction(
                MySql.encodeId(resultSet.getLong("monster_power_id"), userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                getLimitedUse(resultSet, userId),
                resultSet.getInt("recharge_min"),
                resultSet.getInt("recharge_max"),
                Action.valueOf(resultSet.getInt("action_type_id")),
                resultSet.getInt("legendary_cost"),
                WeaponRangeType.valueOf(resultSet.getInt("weapon_range_type_id")),
                resultSet.getInt("reach"),
                resultSet.getInt("normal_range"),
                resultSet.getInt("long_range"),
                getAmmo(resultSet, userId),
                AttackType.valueOf(resultSet.getInt("attack_type_id")),
                resultSet.getBoolean("temporary_hp"),
                resultSet.getInt("attack_mod"),
                MySql.encodeId(resultSet.getInt("attack_ability_modifier_id"), userId),
                new ListObject(MySql.encodeId(resultSet.getLong("save_type_id"), userId), resultSet.getString("save_type_name"), resultSet.getInt("save_type_sid"), resultSet.getBoolean("save_type_is_author")),
                resultSet.getBoolean("save_proficiency_modifier"),
                MySql.encodeId(resultSet.getInt("save_ability_modifier_id"), userId),
                resultSet.getBoolean("half_on_save"),
                resultSet.getString("description")
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ModifierConfiguration> modifierConfigurations = MonsterPowerService.getModifierConfigurations(resultSet, userId);
            monsterAction.setModifierConfigurations(modifierConfigurations);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<DamageConfiguration> damageConfigurations = getDamageConfigurations(resultSet, userId);
            monsterAction.setDamageConfigurations(damageConfigurations);
        }

        return monsterAction;
    }

    private static ListObject getAmmo(ResultSet resultSet, int userId) throws Exception {
        long ammoId = resultSet.getLong("ammo_id");
        if (ammoId == 0) {
            return null;
        }
        return new ListObject(
                MySql.encodeId(ammoId, userId),
                resultSet.getString("ammo_name"),
                resultSet.getString("ammo_description"),
                resultSet.getInt("ammo_sid"),
                resultSet.getBoolean("ammo_is_author")
        );
    }

    public static List<MonsterPower> getMonsterActions(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Map<Long, MonsterAction> actionsMap = new HashMap<>();

        while (resultSet.next()) {
            long id = resultSet.getLong("monster_power_id");
            MonsterAction monsterAction = new MonsterAction(
                    MySql.encodeId(id, userId),
                    resultSet.getString("name"),
                    resultSet.getInt("sid"),
                    resultSet.getBoolean("is_author"),
                    resultSet.getInt("version"),
                    getLimitedUse(resultSet, userId),
                    resultSet.getInt("recharge_min"),
                    resultSet.getInt("recharge_max"),
                    Action.valueOf(resultSet.getInt("action_type_id")),
                    resultSet.getInt("legendary_cost"),
                    WeaponRangeType.valueOf(resultSet.getInt("weapon_range_type_id")),
                    resultSet.getInt("reach"),
                    resultSet.getInt("normal_range"),
                    resultSet.getInt("long_range"),
                    getAmmo(resultSet, userId),
                    AttackType.valueOf(resultSet.getInt("attack_type_id")),
                    resultSet.getBoolean("temporary_hp"),
                    resultSet.getInt("attack_mod"),
                    MySql.encodeId(resultSet.getInt("attack_ability_modifier_id"), userId),
                    new ListObject(MySql.encodeId(resultSet.getLong("save_type_id"), userId), resultSet.getString("save_type_name"), resultSet.getInt("save_type_sid"), resultSet.getBoolean("save_type_is_author")),
                    resultSet.getBoolean("save_proficiency_modifier"),
                    MySql.encodeId(resultSet.getInt("save_ability_modifier_id"), userId),
                    resultSet.getBoolean("half_on_save"),
                    resultSet.getString("description")
            );
            actionsMap.put(id, monsterAction);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<ModifierConfiguration>> map = MonsterPowerService.getModifierConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, MonsterAction> entry : actionsMap.entrySet()) {
                MonsterAction action = entry.getValue();
                Long actionId = entry.getKey();
                List<ModifierConfiguration> modifierConfigurations = map.get(actionId);
                if (modifierConfigurations == null) {
                    modifierConfigurations = new ArrayList<>();
                }
                action.setModifierConfigurations(modifierConfigurations);
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<DamageConfiguration>> map = getDamageConfigurationsMap(resultSet, userId);

            for (Map.Entry<Long, MonsterAction> entry : actionsMap.entrySet()) {
                MonsterAction action = entry.getValue();
                Long actionId = entry.getKey();
                List<DamageConfiguration> damageConfigurations = map.get(actionId);
                if (damageConfigurations == null) {
                    damageConfigurations = new ArrayList<>();
                }
                action.setDamageConfigurations(damageConfigurations);
            }
        }

        List<MonsterPower> actionList = new ArrayList<>(actionsMap.values());
        MonsterPowerService.sortPowers(actionList);
        return actionList;
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
        if (!(power instanceof MonsterAction)) {
            throw new Exception("Invalid monster power type");
        }
        MonsterAction action = (MonsterAction) power;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call MonsterPowers_Create_Action (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setString(1, MySql.getValue(power.getName(), 50));
            statement.setLong(2, monsterId);
            statement.setInt(3, MySql.getValue(power.getRechargeMin(), 1, 100));
            statement.setInt(4, MySql.getValue(power.getRechargeMax(), 1, 100));

            statement.setInt(5, action.getActionType().getValue());
            statement.setInt(6, action.getLegendaryCost());
            statement.setInt(7, action.getRangeType().getValue());
            statement.setInt(8, action.getReach());
            statement.setInt(9, action.getNormalRange());
            statement.setInt(10, action.getLongRange());
            MySql.setId(11, action.getAmmoType(), userId, statement);
            statement.setInt(12, action.getAttackType().getValue());
            statement.setBoolean(13, action.isTemporaryHP());
            statement.setInt(14, action.getAttackMod());
            MySql.setId(15, action.getAttackAbilityModifier(), userId, statement);
            MySql.setId(16, action.getSaveType(), userId, statement);
            statement.setBoolean(17, action.isSaveProficiencyModifier());
            MySql.setId(18, action.getSaveAbilityModifier(), userId, statement);
            statement.setBoolean(19, action.isHalfOnSave());
            statement.setString(20, MySql.getValue(action.getDescription(), 2000));

            statement.setInt(21, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("monster_power_id");
                }
            }

            if (id != -1) {
                updateDamages(id, action.getDamageConfigurations(), userId, connection);
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
        if (!(power instanceof MonsterAction)) {
            throw new Exception("Invalid power type");
        }
        MonsterAction action = (MonsterAction) power;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call MonsterPowers_Update_Action (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setLong(1, powerId);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(power.getName(), 50));
            statement.setInt(4, MySql.getValue(power.getRechargeMin(), 1, 100));
            statement.setInt(5, MySql.getValue(power.getRechargeMax(), 1, 100));

            statement.setInt(6, action.getActionType().getValue());
            statement.setInt(7, action.getLegendaryCost());
            statement.setInt(8, action.getRangeType().getValue());
            statement.setInt(9, action.getReach());
            statement.setInt(10, action.getNormalRange());
            statement.setInt(11, action.getLongRange());
            MySql.setId(12, action.getAmmoType(), userId, statement);
            statement.setInt(13, action.getAttackType().getValue());
            statement.setBoolean(14, action.isTemporaryHP());
            statement.setInt(15, action.getAttackMod());
            MySql.setId(16, action.getAttackAbilityModifier(), userId, statement);
            MySql.setId(17, action.getSaveType(), userId, statement);
            statement.setBoolean(18, action.isSaveProficiencyModifier());
            MySql.setId(19, action.getSaveAbilityModifier(), userId, statement);
            statement.setBoolean(20, action.isHalfOnSave());
            statement.setString(21, MySql.getValue(action.getDescription(), 2000));

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateDamages(powerId, action.getDamageConfigurations(), userId, connection);
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

    public static Map<Long, List<DamageConfiguration>> getDamageConfigurationsMap(ResultSet resultSet, int userId) throws Exception {
        Map<Long, List<DamageConfiguration>> map = new HashMap<>();
        while (resultSet.next()) {
            long id = resultSet.getLong("monster_action_id");
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
                false,
                false,
                null,
                getDiceCollection(resultSet, userId),
                getDamageType(resultSet, userId),
                resultSet.getBoolean("healing"),
                false,
                false,
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

    private static void deleteDamages(long actionId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_action_damages WHERE monster_action_id = ?");
            statement.setLong(1, actionId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateDamages(long actionId, List<DamageConfiguration> damages, int userId, Connection connection) throws Exception {
        deleteDamages(actionId, connection);
        if (damages.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_action_damages` (`monster_action_id`, `num_dice`, `dice_size`," +
                    " `ability_modifier_id`, `misc_mod`, `damage_type_id`, `healing`, `adjustment`) VALUES (?,?,?,?,?,?,?,?)");

            for (DamageConfiguration config : damages) {
                statement.setLong(1, actionId);
                statement.setInt(2, MySql.getValue(config.getValues().getNumDice(), 0, 99));
                statement.setInt(3, config.getValues().getDiceSize().getValue());
                MySql.setId(4, config.getValues().getAbilityModifier() == null ? null : config.getValues().getAbilityModifier().getId(), userId, statement);
                statement.setInt(5, MySql.getValue(config.getValues().getMiscModifier(), 0, 999));
                MySql.setId(6, config.getDamageType() ==  null ? null : config.getDamageType().getId(), userId, statement);
                statement.setBoolean(7, config.isHealing());
                statement.setBoolean(8, config.isAdjustment());
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

    @Override
    public long addToMyStuff(long monsterId, MonsterPower authorPower, int authorUserId, ListObject existingPower, int userId) throws Exception {
        if (!(authorPower instanceof MonsterAction)) {
            throw new Exception("Invalid power type");
        }
        MonsterAction action = (MonsterAction)authorPower;

        SharingUtilityService.addModifierConfigurationsToMyStuff(action.getModifierConfigurations(), userId);
        SharingUtilityService.addLimitedUseToMyStuff(action.getLimitedUse(), userId);

        long actionId;
        if (action.getSid() != 0) {
            MonsterPowerService.addSystemPower(MySql.decodeId(action.getId(), authorUserId), userId);
            actionId = MySql.decodeId(action.getId(), authorUserId);
        } else {
            if (existingPower == null) {
                actionId = create(monsterId, action, userId);
            } else {
                actionId = MySql.decodeId(existingPower.getId(), userId);
                update(monsterId, action, actionId, userId);
            }
        }

        return actionId;
    }

    @Override
    public void addToShareList(MonsterPower power, int userId, ShareList shareList) throws Exception {
        if (!(power instanceof MonsterAction)) {
            throw new Exception("Invalid power type");
        }
        MonsterAction action = (MonsterAction)power;

        SharingUtilityService.addModifierConfigurationsToShareList(action.getModifierConfigurations(), userId, shareList);
        SharingUtilityService.addLimitedUseToShareList(action.getLimitedUse(), userId, shareList);
        shareList.getPowers().add(power.getId());
    }
}
