package com.herd.squire.services.monsters;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.AttributeType;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.creatures.*;
import com.herd.squire.models.creatures.battle_monsters.BattleMonster;
import com.herd.squire.models.creatures.battle_monsters.BattleMonsterAction;
import com.herd.squire.models.creatures.battle_monsters.BattleMonsterFeature;
import com.herd.squire.models.creatures.battle_monsters.BattleMonsterSettings;
import com.herd.squire.models.creatures.characters.CharacterPage;
import com.herd.squire.models.creatures.characters.PlayerCharacter;
import com.herd.squire.models.creatures.characters.settings.*;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.monsters.MonsterFeature;
import com.herd.squire.models.monsters.MonsterPowerType;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.ModifierConfiguration;
import com.herd.squire.models.powers.PowerType;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.models.sorts.SortValue;
import com.herd.squire.services.EncounterService;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SortService;
import com.herd.squire.services.creatures.CreatureDetailsService;
import com.herd.squire.services.creatures.CreatureItemService;
import com.herd.squire.services.creatures.CreatureService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MonsterCreatureService implements CreatureDetailsService {
    @Override
    public Creature get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getBattleMonster(statement, resultSet, userId);
    }

    private BattleMonster getBattleMonster(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long battleMonsterId = resultSet.getLong("id");
        long spellcastingAbilityId = resultSet.getLong("spellcasting_ability_id");
        long innateSpellcastingAbilityId = resultSet.getLong("innate_spellcasting_ability_id");

        BattleMonster battleMonster = new BattleMonster(
                MySql.encodeId(battleMonsterId, userId),
                resultSet.getString("name"),
                MySql.encodeId(resultSet.getLong("monster_id"), userId),
                resultSet.getInt("max_hp"),
                resultSet.getInt("legendary_points"),
                resultSet.getInt("max_legendary_points")
        );

        List<CreatureFilter> filters = CreatureService.getFilters(statement, userId);
        battleMonster.setFilters(filters);
        List<CreatureSort> sorts = CreatureService.getSorts(statement);
        battleMonster.setSorts(sorts);

        // Ability Scores
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setAbilityScores(CreatureService.getAbilityScores(resultSet, userId));
        }

        // AC Abilities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setAcAbilities(CreatureService.getAcAbilities(resultSet, userId));
        }

        // Wealth
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setCreatureWealth(CreatureService.getWealth(resultSet, userId));
        }

        // Health
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                battleMonster.setCreatureHealth(CreatureService.getCreatureHealth(statement, resultSet, false));
            }
        }

        // Attribute Profs
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setAttributeProfs(CreatureService.getAttributeProfs(resultSet, userId));
        }

        // Item Profs
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setItemProfs(CreatureService.getItemProfs(resultSet, userId));
        }

        // Damage Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setDamageModifiers(CreatureService.getDamageModifiers(resultSet, userId));
        }

        // Condition Immunities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setConditionImmunities(CreatureService.getConditionImmunities(resultSet, userId));
        }

        // Senses
//        if (statement.getMoreResults()) {
//            resultSet = statement.getResultSet();
//            battleMonster.setSenses(CreatureService.getSenses(resultSet));
//        }

        // Active Conditions
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setActiveConditions(CreatureService.getActiveConditions(statement, resultSet, userId));
        }

        // Spell Tags
//        List<Tag> spellTags = new ArrayList<>();
//        if (statement.getMoreResults()) {
//            resultSet = statement.getResultSet();
//            spellTags = CreatureService.getTags(resultSet, userId, PowerType.SPELL);
//        }

        // Feature Tags
//        List<Tag> featureTags = new ArrayList<>();
//        if (statement.getMoreResults()) {
//            resultSet = statement.getResultSet();
//            featureTags = CreatureService.getTags(resultSet, userId, PowerType.FEATURE);
//        }

        // Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setCreatureSpellCasting(CreatureService.getCreatureSpellCasting(statement, resultSet, userId, spellcastingAbilityId, new ArrayList<>()));
        }

        // Innate Spellcasting
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setInnateSpellCasting(CreatureService.getInnateCreatureSpellCasting(statement, resultSet, userId, innateSpellcastingAbilityId, new ArrayList<>()));
        }

        // Spell Slots
//        if (statement.getMoreResults()) {
//            resultSet = statement.getResultSet();
//            CreatureSpellCasting creatureSpellCasting = new CreatureSpellCasting();
//            creatureSpellCasting.setSpellSlots(CreatureService.getSpellSlots(resultSet));
//            battleMonster.setCreatureSpellCasting(creatureSpellCasting);
//        }

        // Items
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setItems(CreatureItemService.getItems(statement, resultSet, userId));
        }

        // Settings
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            battleMonster.setSettings(getBattleMonsterSettings(statement, resultSet));
        }

        battleMonster.setFeatures(getBattleMonsterFeatures(battleMonsterId, userId));
        battleMonster.setActions(getBattleMonsterActions(battleMonsterId, userId));
        battleMonster.getCreatureSpellCasting().setSpells(CreatureService.getCreatureSpells(battleMonsterId, userId, filters, sorts, false));
        List<CreatureActiveSpell> activeSpells = CreatureService.getActiveSpells(battleMonsterId, userId, sorts);
        battleMonster.getCreatureSpellCasting().setActiveSpells(activeSpells);
        battleMonster.getInnateSpellCasting().setSpells(CreatureService.getCreatureSpells(battleMonsterId, userId, filters, sorts, true));
        battleMonster.getInnateSpellCasting().setActiveSpells(activeSpells);
        battleMonster.setConditions(CreatureService.getAttributes(AttributeType.CONDITION, filters, sorts, userId));
        battleMonster.setSkills(CreatureService.getAttributes(AttributeType.SKILL, filters, sorts, userId));

//        addMaxToSpellSlots(battleMonster.getCreatureSpellCasting().getSpellSlots(), battleMonster, userId);

//        // Monster
//        if (statement.getMoreResults()) {
//            resultSet = statement.getResultSet();
//            if (resultSet.next()) {
//                battleMonster.setMonster(MonsterService.getMonsterSummary(statement, resultSet, userId));
//            }
//        }
//
//        // Active Conditions
//        if (statement.getMoreResults()) {
//            resultSet = statement.getResultSet();
//            battleMonster.setActiveConditions(CreatureService.getActiveConditions(statement, resultSet, userId));
//        }

        return battleMonster;
    }

    private BattleMonsterSettings getBattleMonsterSettings(Statement statement, ResultSet resultSet) throws Exception {
        List<CharacterSettingValue> settingValues = new ArrayList<>();

        //setting values
        while(resultSet.next()) {
            CharacterSettingCategory category = CharacterSettingCategory.valueOf(resultSet.getInt("character_setting_category_id"));
            CharacterSetting setting = CharacterSetting.valueOf(resultSet.getInt("character_setting_id"));
            int value = resultSet.getInt("value");

            CharacterSettingValue settingValue = new CharacterSettingValue(category, setting, value);
            settingValues.add(settingValue);
        }

        SpeedType speedType = SpeedType.WALK;
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                speedType = SpeedType.valueOf(resultSet.getInt("speed_to_display"));
            }
        }
        return getBattleMonsterSettings(settingValues, speedType);
    }

    private BattleMonsterSettings getBattleMonsterSettings(List<CharacterSettingValue> settingValues, SpeedType speedType) {
        BattleMonsterSettings battleMonsterSettings = new BattleMonsterSettings();

        for (CharacterSettingValue settingValue : settingValues) {
            processSettingValue(settingValue, battleMonsterSettings);
        }

        battleMonsterSettings.getSpeed().setSpeedToDisplay(speedType);

        return battleMonsterSettings;
    }

    private void processSettingValue(CharacterSettingValue settingValue, BattleMonsterSettings battleMonsterSettings) {
        switch (settingValue.getCategory()) {
            case SPEED:
                processSpeedSettingValue(settingValue, battleMonsterSettings);
                break;
        }
    }

    private void processSpeedSettingValue(CharacterSettingValue settingValue, BattleMonsterSettings battleMonsterSettings) {
        switch (settingValue.getSetting()) {
            case SPEED_TO_DISPLAY:
                battleMonsterSettings.getSpeed().setSpeedToDisplay(SpeedType.valueOf(settingValue.getValue()));
                break;
            case SWIMMING_USE_HALF:
                battleMonsterSettings.getSpeed().getSwimming().setUseHalf(settingValue.getValue() == 1);
                break;
            case SWIMMING_ROUND_UP:
                battleMonsterSettings.getSpeed().getSwimming().setRoundUp(settingValue.getValue() == 1);
                break;
            case CRAWLING_USE_HALF:
                battleMonsterSettings.getSpeed().getCrawling().setUseHalf(settingValue.getValue() == 1);
                break;
            case CRAWLING_ROUND_UP:
                battleMonsterSettings.getSpeed().getCrawling().setRoundUp(settingValue.getValue() == 1);
                break;
            case CLIMBING_USE_HALF:
                battleMonsterSettings.getSpeed().getClimbing().setUseHalf(settingValue.getValue() == 1);
                break;
            case CLIMBING_ROUND_UP:
                battleMonsterSettings.getSpeed().getClimbing().setRoundUp(settingValue.getValue() == 1);
                break;
        }
    }

    public void updateSettings(long battleMonsterId, BattleMonsterSettings settings, Connection connection) throws Exception {
        List<CharacterSettingValue> settingValues = getSettingValuesList(settings);
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call BattleMonster_Settings_Update (?,?,?)}");

            for (CharacterSettingValue settingValue : settingValues) {
                statement.setLong(1, battleMonsterId);
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

    private List<CharacterSettingValue> getSettingValuesList(BattleMonsterSettings battleMonsterSettings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
        settingValues.addAll(getSettingValuesList(battleMonsterSettings.getSpeed()));
        return settingValues;
    }

    private List<CharacterSettingValue> getSettingValuesList(CharacterSpeedSettings settings) {
        List<CharacterSettingValue> settingValues = new ArrayList<>();
//        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.SPEED_TO_DISPLAY, settings.getSpeedToDisplay().getValue()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.SWIMMING_USE_HALF, settings.getSwimming().isUseHalf()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.SWIMMING_ROUND_UP, settings.getSwimming().isRoundUp()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CLIMBING_USE_HALF, settings.getClimbing().isUseHalf()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CLIMBING_ROUND_UP, settings.getClimbing().isRoundUp()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CRAWLING_USE_HALF, settings.getCrawling().isUseHalf()));
        settingValues.add(new CharacterSettingValue(CharacterSettingCategory.SPEED, CharacterSetting.CRAWLING_ROUND_UP, settings.getCrawling().isRoundUp()));
        return settingValues;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, ListSource listSource) throws Exception {
        return null;
    }

    @Override
    public long create(Creature creature, int userId) throws Exception {
        return 0;
    }

    @Override
    public boolean update(Creature creature, long id, int userId) throws Exception {
        return false;
    }

    @Override
    public long addToMyStuff(Creature authorCreature, int authorUserId, ListObject existingCreature, int userId) throws Exception {
        return 0;
    }

    @Override
    public void addToShareList(Creature creature, int userId, ShareList shareList) throws Exception {
    }

    public static void addPowers(long creatureId, List<CreaturePower> powers, int userId) throws Exception {
        if (powers.isEmpty()) {
            return;
        }

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call BattleMonsterPowers_Add (?,?,?)}");

            for (CreaturePower creaturePower : powers) {
                long powerId = MySql.decodeId(creaturePower.getPowerId(), userId);
                statement.setLong(1, creatureId);
                statement.setLong(2, powerId);
                statement.setInt(3, creaturePower.getUsesRemaining());
                statement.addBatch();
            }

            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<BattleMonsterFeature> getBattleMonsterFeatures(long creatureId, int userId) {
        List<BattleMonsterFeature> battleMonsterFeatures = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareCall("{call Creatures_Get_BattleMonsterPowers (?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, MonsterPowerType.FEATURE.getValue());
            statement.setInt(3, userId);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    battleMonsterFeatures.add(getBattleMonsterFeature(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return battleMonsterFeatures;
    }

    private static BattleMonsterFeature getBattleMonsterFeature(ResultSet resultSet, int userId) throws Exception {
        return new BattleMonsterFeature(
                MySql.encodeId(resultSet.getLong("id"), userId),
                MySql.encodeId(resultSet.getLong("monster_power_id"), userId),
                resultSet.getString("name"),
                false,
                resultSet.getBoolean("active"),
                MySql.encodeId(resultSet.getLong("active_target_creature_id"), userId),
                resultSet.getInt("uses_remaining"),
                resultSet.getInt("quantity"),
                LimitedUseType.valueOf(resultSet.getInt("limited_use_type_id")),
                resultSet.getInt("recharge_min"),
                resultSet.getInt("recharge_max")
        );
    }

    public static List<BattleMonsterAction> getBattleMonsterActions(long creatureId, int userId) {
        List<BattleMonsterAction> battleMonsterActions = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareCall("{call Creatures_Get_BattleMonsterPowers (?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, MonsterPowerType.ACTION.getValue());
            statement.setInt(3, userId);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    battleMonsterActions.add(getBattleMonsterAction(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return battleMonsterActions;
    }

    private static BattleMonsterAction getBattleMonsterAction(ResultSet resultSet, int userId) throws Exception {
        return new BattleMonsterAction(
                MySql.encodeId(resultSet.getLong("id"), userId),
                MySql.encodeId(resultSet.getLong("monster_power_id"), userId),
                resultSet.getString("name"),
                false,
                resultSet.getBoolean("active"),
                MySql.encodeId(resultSet.getLong("active_target_creature_id"), userId),
                resultSet.getInt("uses_remaining"),
                resultSet.getInt("quantity"),
                LimitedUseType.valueOf(resultSet.getInt("limited_use_type_id")),
                Action.valueOf(resultSet.getInt("action_type_id")),
                resultSet.getInt("legendary_cost"),
                resultSet.getInt("recharge_min"),
                resultSet.getInt("recharge_max")
        );
    }

    public void updateLegendaryPoints(long creatureId, int legendaryPoints, int userId) {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE battle_monsters SET legendary_points = ? WHERE creature_id = ?");
            statement.setInt(1, legendaryPoints);
            statement.setLong(2, creatureId);
            statement.executeUpdate();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }
}
