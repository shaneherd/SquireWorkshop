package com.herd.squire.services.creatures;

import com.herd.squire.models.*;
import com.herd.squire.models.creatures.*;
import com.herd.squire.models.creatures.companions.*;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.monsters.MonsterAction;
import com.herd.squire.models.monsters.MonsterFeature;
import com.herd.squire.models.monsters.MonsterPower;
import com.herd.squire.models.monsters.MonsterPowerType;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.PowerType;
import com.herd.squire.models.powers.SpellListObject;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.monsters.MonsterActionService;
import com.herd.squire.services.monsters.MonsterFeatureService;
import com.herd.squire.services.monsters.MonsterService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class CompanionService implements CreatureDetailsService {
    @Override
    public Creature get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getCompanion(statement, resultSet, userId);
    }

    private Companion getCompanion(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long companionId = resultSet.getLong("id");

        Companion companion = new Companion(
                MySql.encodeId(companionId, userId),
                resultSet.getString("name"),
                CompanionType.valueOf(resultSet.getInt("companion_type_id")),
                resultSet.getInt("max_hp"),
                resultSet.getBoolean("roll_over_damage"),
                new CompanionModifier(resultSet.getBoolean("ac_include_characters_prof"), resultSet.getInt("ac_misc")),
                new CompanionModifier(resultSet.getBoolean("saving_throws_include_characters_prof"), resultSet.getInt("saving_throws_misc")),
                new CompanionModifier(resultSet.getBoolean("skill_checks_include_characters_prof"), resultSet.getInt("skill_checks_misc")),
                new CompanionModifier(resultSet.getBoolean("attack_include_characters_prof"), resultSet.getInt("attack_misc")),
                new CompanionModifier(resultSet.getBoolean("damage_include_characters_prof"), resultSet.getInt("damage_misc")),
                resultSet.getBoolean("include_character_saves"),
                resultSet.getBoolean("include_character_skills")
        );

        // Companion Score Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                CompanionScoreModifier companionScoreModifier = new CompanionScoreModifier(
                        resultSet.getBoolean("include_characters_prof"),
                        resultSet.getInt("misc"),
                        MySql.encodeId(resultSet.getLong("ability_id"), userId),
                        resultSet.getBoolean("use_characters_score")
                );
                companion.getAbilityScoreModifiers().add(companionScoreModifier);
            }
        }

        // Health
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
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
                companion.setCreatureHealth(creatureHealth);
            }
        }

        // Monster
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                companion.setMonster(MonsterService.getMonsterSummary(statement, resultSet, userId));
            }
        }

        // Active Conditions
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            companion.setActiveConditions(CreatureService.getActiveConditions(statement, resultSet, userId));
        }

        return companion;
    }

    public static void addCompanionPowers(String id, CreaturePowerList creaturePowerList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long companionId = MySql.decodeId(id, userId);
        addCompanionPowers(companionId, creaturePowerList, userId);
    }

    private static void addCompanionPowers(long companionId, CreaturePowerList creaturePowerList, int userId) throws Exception {
        if (creaturePowerList.getCreaturePowers().isEmpty()) {
            return;
        }
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT INTO monster_power_states (creature_id, monster_power_id, monster_power_type_id, uses_remaining) VALUES (?,?,?,?)");

            for (CreaturePower creaturePower : creaturePowerList.getCreaturePowers()) {
                statement.setLong(1, companionId);
                MySql.setId(2, creaturePower.getPowerId(), userId, statement);
                statement.setInt(3, creaturePower.getPowerType() == PowerType.MONSTER_ACTION ? MonsterPowerType.ACTION.getValue() : MonsterPowerType.FEATURE.getValue());
                statement.setInt(4, creaturePower.getUsesRemaining());
                statement.addBatch();
            }

            statement.executeBatch();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateCompanionPowers(String id, CreaturePowerList creaturePowerList, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long companionId = MySql.decodeId(id, userId);
        updateCompanionPowers(companionId, creaturePowerList, userId);
    }

    private static void updateCompanionPowers(long companionId, CreaturePowerList creaturePowerList, int userId) throws Exception {
        if (creaturePowerList.getCreaturePowers().isEmpty()) {
            return;
        }
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call CompanionPowers_Update (?,?,?,?,?,?)}");

            for (CreaturePower creaturePower : creaturePowerList.getCreaturePowers()) {
                statement.setLong(1, companionId);
                MySql.setId(2, creaturePower.getPowerId(), userId, statement);
                statement.setInt(3, creaturePower.getPowerType() == PowerType.MONSTER_ACTION ? MonsterPowerType.ACTION.getValue() : MonsterPowerType.FEATURE.getValue());
                statement.setInt(4, Math.max(creaturePower.getUsesRemaining(), 0));
                statement.setBoolean(5, creaturePower.isActive());
                MySql.setId(6, creaturePower.getActiveTargetCreatureId(), userId, statement);
                statement.addBatch();
            }
            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static List<CompanionAction> getCompanionActions(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long companionId = MySql.decodeId(id, userId);
        return getCompanionActions(companionId, userId);
    }

    private static List<CompanionAction> getCompanionActions(long companionId, int userId) throws Exception {
        List<CompanionAction> companionActions = new ArrayList<>();
        Map<String, CompanionAction> actionsMap = new HashMap<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_Get_CompanionActions (?,?)}");
            statement.setLong(1, companionId);
            statement.setInt(2, userId);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    CompanionAction companionAction = getCompanionAction(resultSet, userId);
                    companionActions.add(companionAction);
                    actionsMap.put(companionAction.getPowerId(), companionAction);
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    List<MonsterPower> monsterPowers = MonsterActionService.getMonsterActions(statement, resultSet, userId);
                    for (MonsterPower monsterPower : monsterPowers) {
                        CompanionAction companionAction = actionsMap.get(monsterPower.getId());
                        if (companionAction != null) {
                            companionAction.setMonsterAction((MonsterAction)monsterPower);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return companionActions;
    }

    private static CompanionAction getCompanionAction(ResultSet resultSet, int userId) throws Exception {
        return new CompanionAction(
                MySql.encodeId(resultSet.getLong("creature_power_id"), userId),
                MySql.encodeId(resultSet.getLong("action_id"), userId),
                resultSet.getString("action_name"),
                resultSet.getBoolean("active"),
                MySql.encodeId(resultSet.getLong("active_target_creature_id"), userId),
                resultSet.getInt("uses_remaining"),
                null
        );
    }

    public static List<CompanionFeature> getCompanionFeatures(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long companionId = MySql.decodeId(id, userId);
        return getCompanionFeatures(companionId, userId);
    }

    private static List<CompanionFeature> getCompanionFeatures(long companionId, int userId) throws Exception {
        List<CompanionFeature> companionFeatures = new ArrayList<>();
        Map<String, CompanionFeature> featuresMap = new HashMap<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_Get_CompanionFeatures (?,?)}");
            statement.setLong(1, companionId);
            statement.setInt(2, userId);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    CompanionFeature companionFeature = getCompanionFeature(resultSet, userId);
                    companionFeatures.add(companionFeature);
                    featuresMap.put(companionFeature.getPowerId(), companionFeature);
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    List<MonsterPower> monsterPowers = MonsterFeatureService.getMonsterFeatures(statement, resultSet, userId);
                    for (MonsterPower monsterPower : monsterPowers) {
                        CompanionFeature companionFeature = featuresMap.get(monsterPower.getId());
                        if (companionFeature != null) {
                            companionFeature.setMonsterFeature((MonsterFeature)monsterPower);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return companionFeatures;
    }

    private static CompanionFeature getCompanionFeature(ResultSet resultSet, int userId) throws Exception {
        return new CompanionFeature(
                MySql.encodeId(resultSet.getLong("creature_power_id"), userId),
                MySql.encodeId(resultSet.getLong("feature_id"), userId),
                resultSet.getString("feature_name"),
                resultSet.getBoolean("active"),
                MySql.encodeId(resultSet.getLong("active_target_creature_id"), userId),
                resultSet.getInt("uses_remaining"),
                null
        );
    }

    public static List<CreatureSpell> getCompanionSpells(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long companionId = MySql.decodeId(id, userId);
        return getCompanionSpells(companionId, userId);
    }

    private static List<CreatureSpell> getCompanionSpells(long companionId, int userId) throws Exception {
        List<CreatureSpell> creatureSpells = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Creatures_Get_CompanionSpells (?,?)}");
            statement.setLong(1, companionId);
            statement.setInt(2, userId);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    CreatureSpell creatureSpell = getCreatureSpell(resultSet, userId);
                    if (creatureSpell != null) {
                        creatureSpells.add(creatureSpell);
                    }
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    while (resultSet.next()) {
                        CreatureSpell creatureSpell = getCreatureSpell(resultSet, userId);
                        if (creatureSpell != null) {
                            LimitedUse limitedUse = getLimitedUse(resultSet, userId);
                            if (limitedUse != null) {
                                creatureSpell.setCalculatedMax(limitedUse.getQuantity());
                            }
                            creatureSpells.add(creatureSpell);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return creatureSpells;
    }

    private static CreatureSpell getCreatureSpell(ResultSet resultSet, int userId) throws Exception {
        long spellId = resultSet.getLong("power_id");
        if (spellId == 0) {
            return null;
        }
        return new CreatureSpell(
                MySql.encodeId(resultSet.getLong("creature_power_id"), userId),
                new SpellListObject(MySql.encodeId(spellId, userId),
                        resultSet.getString("spell_name"),
                        resultSet.getInt("spell_sid"),
                        resultSet.getBoolean("spell_is_author"),
                        resultSet.getInt("level")
                ),
                null,
                "0",
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
                CastingTimeUnit.valueOf(resultSet.getInt("casting_time_unit"))
        );
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
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Creatures_GetList_Companions (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    @Override
    public long create(Creature creature, int userId) throws Exception {
        if (!(creature instanceof Companion)) {
            throw new Exception("Invalid creature type");
        }
        Companion companion = (Companion) creature;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Creatures_Create_Companion (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setString(1, MySql.getValue(creature.getName(), 150));

            statement.setInt(2, companion.getCompanionType().getValue());
            MySql.setId(3, companion.getMonster().getId(), userId, statement);
            statement.setInt(4, companion.getMaxHp());
            statement.setBoolean(5, companion.isRollOverDamage());
            statement.setBoolean(6, companion.getAcModifier().isIncludeCharactersProf());
            statement.setInt(7, companion.getAcModifier().getMisc());
            statement.setBoolean(8, companion.getSavingThrowModifier().isIncludeCharactersProf());
            statement.setInt(9, companion.getSavingThrowModifier().getMisc());
            statement.setBoolean(10, companion.getSkillCheckModifier().isIncludeCharactersProf());
            statement.setInt(11, companion.getSkillCheckModifier().getMisc());
            statement.setBoolean(12, companion.getAttackModifier().isIncludeCharactersProf());
            statement.setInt(13, companion.getAttackModifier().getMisc());
            statement.setBoolean(14, companion.getDamageModifier().isIncludeCharactersProf());
            statement.setInt(15, companion.getDamageModifier().getMisc());
            statement.setBoolean(16, companion.isIncludeCharacterSaves());
            statement.setBoolean(17, companion.isIncludeCharacterSkills());
;
            statement.setInt(18, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("creature_id");
                }
            }

            if (id != -1) {
                updateCompanionAbilityScores(id, companion.getAbilityScoreModifiers(), userId, connection);
                CreatureService.updateCreatureHealth(id, creature.getCreatureHealth(), connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    public static void addCompanionToCharacter(String id, String companionId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedCompanionId = MySql.decodeId(companionId, userId);
        long creatureId = MySql.decodeId(id, userId);
        addCompanionToCharacter(decodedCompanionId, creatureId);
    }

    private static void addCompanionToCharacter(long companionId, long characterId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareStatement("INSERT INTO character_companions (companion_id, character_id) VALUES (?,?)");
            statement.setLong(1, companionId);
            statement.setLong(2, characterId);
            statement.executeUpdate();

            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateCompanionAbilityScores(long companionId, List<CompanionScoreModifier> scoreModifiers, int userId, Connection connection) throws Exception {
        deleteCompanionScoreModifiers(companionId, connection);

        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO companion_score_modifiers (companion_id, ability_id, use_characters_score, include_characters_prof, misc) VALUES (?,?,?,?,?)");

            for (CompanionScoreModifier scoreModifier : scoreModifiers) {
                statement.setLong(1, companionId);
                MySql.setId(2, scoreModifier.getAbilityId(), userId, statement);
                statement.setBoolean(3, scoreModifier.isUseCharactersScore());
                statement.setBoolean(4, scoreModifier.isIncludeCharactersProf());
                statement.setInt(5, MySql.getValue(scoreModifier.getMisc(), -99, 99));
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

    private static void deleteCompanionScoreModifiers(long companionId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM companion_score_modifiers WHERE companion_id = ?");
            statement.setLong(1, companionId);
            statement.executeUpdate();

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    @Override
    public boolean update(Creature creature, long id, int userId) throws Exception {
        if (!(creature instanceof Companion)) {
            throw new Exception("Invalid creature type");
        }
        Companion companion = (Companion) creature;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Creatures_Update_Companion (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(creature.getName(), 150));

            statement.setInt(4, companion.getCompanionType().getValue());
            MySql.setId(5, companion.getMonster().getId(), userId, statement);
            statement.setInt(6, companion.getMaxHp());
            statement.setBoolean(7, companion.isRollOverDamage());
            statement.setBoolean(8, companion.getAcModifier().isIncludeCharactersProf());
            statement.setInt(9, companion.getAcModifier().getMisc());
            statement.setBoolean(10, companion.getSavingThrowModifier().isIncludeCharactersProf());
            statement.setInt(11, companion.getSavingThrowModifier().getMisc());
            statement.setBoolean(12, companion.getSkillCheckModifier().isIncludeCharactersProf());
            statement.setInt(13, companion.getSkillCheckModifier().getMisc());
            statement.setBoolean(14, companion.getAttackModifier().isIncludeCharactersProf());
            statement.setInt(15, companion.getAttackModifier().getMisc());
            statement.setBoolean(16, companion.getDamageModifier().isIncludeCharactersProf());
            statement.setInt(17, companion.getDamageModifier().getMisc());
            statement.setBoolean(18, companion.isIncludeCharacterSaves());
            statement.setBoolean(19, companion.isIncludeCharacterSkills());

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateCompanionAbilityScores(id, companion.getAbilityScoreModifiers(), userId, connection);
                CreatureService.updateCreatureHealth(id, creature.getCreatureHealth(), connection);
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
        throw new Exception("not implemented");
    }
}
