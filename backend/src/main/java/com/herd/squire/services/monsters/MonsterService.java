package com.herd.squire.services.monsters;

import com.herd.squire.models.*;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.DamageType;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.damages.DamageModifier;
import com.herd.squire.models.damages.DamageModifierType;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.inUse.InUse;
import com.herd.squire.models.items.*;
import com.herd.squire.models.monsters.*;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.SpellListObject;
import com.herd.squire.models.proficiency.Proficiency;
import com.herd.squire.models.proficiency.ProficiencyCategory;
import com.herd.squire.models.proficiency.ProficiencyListObject;
import com.herd.squire.models.proficiency.ProficiencyType;
import com.herd.squire.models.sharing.*;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.services.powers.SpellService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.services.SharingUtilityService.CUSTOM_LEVELS;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class MonsterService {

    public static List<MonsterListObject> getMonsters(ListSource listSource, HttpHeaders headers) throws Exception {
        return getMonsters(new Filters(), listSource, headers);
    }

    public static List<MonsterListObject> getMonsters(Filters filters, ListSource listSource, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<MonsterListObject> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = getListObjectStatement(connection, filters.getFilterValues(), 0, userId, listSource);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    items.add(getMonsterListObject(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    private static MonsterListObject getMonsterListObject(ResultSet resultSet, int userId) throws Exception {
        return new MonsterListObject(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                ChallengeRating.valueOf(resultSet.getInt("challenge_rating_id"))
        );
    }

    public static CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
        String monsterTypeId = FilterService.getFilterValue(filterValues, FilterKey.MONSTER_TYPE);
        String challengeRatingId = FilterService.getFilterValue(filterValues, FilterKey.CHALLENGE_RATING);
        String alignmentId = FilterService.getFilterValue(filterValues, FilterKey.ALIGNMENT);
        Boolean spellcaster = FilterService.getFilterBoolean(filterValues, FilterKey.SPELLCASTER);
        Boolean legendary = FilterService.getFilterBoolean(filterValues, FilterKey.LEGENDARY);
        Boolean flying = FilterService.getFilterBoolean(filterValues, FilterKey.FLYING);
        Boolean swimming = FilterService.getFilterBoolean(filterValues, FilterKey.SWIMMING);

        MonsterType monsterType = null;
        if (monsterTypeId != null && !monsterTypeId.equals(FilterValue.DEFAULT_OPTION)) {
            monsterType = MonsterType.valueOf(monsterTypeId);
        }

        ChallengeRating challengeRating = null;
        if (challengeRatingId != null && !challengeRatingId.equals(FilterValue.DEFAULT_OPTION)) {
            challengeRating = ChallengeRating.valueOf(challengeRatingId);
        }

        String alignmentIdValue = null;
        if (alignmentId != null && !alignmentId.equals(FilterValue.DEFAULT_OPTION)) {
            alignmentIdValue = alignmentId;
        }

        CallableStatement statement = connection.prepareCall("{call Monsters_GetList (?,?,?,?,?,?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);

        MySql.setInteger(3, monsterType == null ? null : monsterType.getValue(), statement);
        MySql.setInteger(4, challengeRating == null ? null : challengeRating.getId(), statement);
        MySql.setId(5, alignmentIdValue, userId, statement);
        MySql.setBoolean(6, spellcaster, statement);
        MySql.setBoolean(7, legendary, statement);
        MySql.setBoolean(8, flying, statement);
        MySql.setBoolean(9, swimming, statement);

        statement.setLong(10, offset);
        statement.setLong(11, PAGE_SIZE);
        statement.setInt(12, listSource.getValue());
        return statement;
    }

    public static Monster getMonster(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getMonster(decodedId, headers);
    }

    private static Monster getMonster(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getMonster(id, userId);
    }

    public static Monster getMonster(long id, int userId) throws Exception {
        Monster monster = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    monster = getMonster(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return monster;
    }

    private static Monster getMonster(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long monsterId = resultSet.getLong("id");

        Monster monster = new Monster(
                MySql.encodeId(monsterId, userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getInt("version"),
                new ListObject(MySql.encodeId(resultSet.getLong("alignment_id"), userId), resultSet.getString("alignment_name"), resultSet.getInt("alignment_sid"), resultSet.getBoolean("alignment_is_author")),
                MonsterType.valueOf(resultSet.getInt("monster_type_id")),
                resultSet.getString("type_variation"),
                Size.valueOf(resultSet.getInt("size_id")),
                ChallengeRating.valueOf(resultSet.getInt("challenge_rating_id")),
                resultSet.getInt("experience"),
                resultSet.getBoolean("hover"),
                resultSet.getInt("legendary_points"),
                resultSet.getBoolean("is_author"),
                resultSet.getString("description"),
                resultSet.getInt("ac"),
                getHitDice(resultSet, userId),
                resultSet.getBoolean("spellcaster"),
                new ListObject(MySql.encodeId(resultSet.getLong("caster_type_id"), userId), resultSet.getString("caster_type_name"), resultSet.getInt("caster_type_sid"), resultSet.getBoolean("caster_type_is_author")),
                new ListObject(MySql.encodeId(resultSet.getLong("spellcaster_level_id"), userId), resultSet.getString("spellcaster_level_name"), resultSet.getInt("spellcaster_level_sid"), resultSet.getBoolean("spellcaster_level_is_author")),
                resultSet.getInt("spell_attack_modifier"),
                resultSet.getInt("spell_save_modifier"),
                MySql.encodeId(resultSet.getLong("spellcasting_ability_id"), userId),
                resultSet.getBoolean("innate_spellcaster"),
                new ListObject(MySql.encodeId(resultSet.getLong("innate_spellcaster_level_id"), userId), resultSet.getString("innate_spellcaster_level_name"), resultSet.getInt("innate_spellcaster_level_sid"), resultSet.getBoolean("innate_spellcaster_level_is_author")),
                resultSet.getInt("innate_spell_attack_modifier"),
                resultSet.getInt("innate_spell_save_modifier"),
                MySql.encodeId(resultSet.getLong("innate_spellcasting_ability_id"), userId)
        );

        // Ability Scores
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            monster.setAbilityScores(getAbilityScores(resultSet, userId));
        }

        // Attribute Profs
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            monster.setAttributeProfs(getAttributeProfs(resultSet, userId));
        }

        // Item Profs
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            monster.setItemProfs(getItemProfs(resultSet, userId));
        }

        // Damage Modifiers
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            monster.setDamageModifiers(getDamageModifiers(resultSet, userId));
        }

        // Condition Immunities
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            monster.setConditionImmunities(getConditionImmunities(resultSet, userId));
        }

        // Senses
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            monster.setSenses(getSenses(resultSet));
        }

        // Speeds
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<Speed> speeds = new ArrayList<>();
            while (resultSet.next()) {
                speeds.add(getSpeed(resultSet));
            }
            monster.setSpeeds(speeds);
        }

        // Spell Slots
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                monster.setSpellSlots(getSpellSlots(resultSet));
            }
        }

        // Spell Configurations
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<SpellConfiguration> spellConfigurations = getSpellConfigurations(resultSet, userId);
            monster.setSpells(spellConfigurations);
        }

        // Innate Spell Configurations
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<InnateSpellConfiguration> spellConfigurations = getInnateSpells(resultSet, userId);
            monster.setInnateSpells(spellConfigurations);
        }

        // Items
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<ItemQuantity> items = getItems(resultSet, userId);
            monster.setItems(items);
        }

        return monster;
    }

    public static List<ItemQuantity> getMonsterItems(long monsterId, int userId) throws Exception {
        List<ItemQuantity> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_GetItems (?,?)}");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                items = getItems(resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return items;
    }

    public static MonsterSummary getMonsterSummary(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getMonsterSummary(decodedId, userId);
    }

    public static MonsterSummary getMonsterSummary(long id, int userId) throws Exception {
        MonsterSummary monsterSummary = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_Get_Summary (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    monsterSummary = getMonsterSummary(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return monsterSummary;
    }

    public static MonsterSummary getMonsterSummary(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long monsterId = resultSet.getLong("id");

        MonsterSummary monsterSummary = new MonsterSummary(
                MySql.encodeId(monsterId, userId),
                resultSet.getString("name"),
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

        // Ability Scores
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            monsterSummary.setAbilityScores(getAbilityScores(resultSet, userId));
        }

        return monsterSummary;
    }

    public static List<MonsterAbilityScore> getAbilityScores(ResultSet resultSet, int userId) throws Exception {
        List<MonsterAbilityScore> abilityScores = new ArrayList<>();
        while (resultSet.next()) {
            abilityScores.add(getAbilityScore(resultSet, userId));
        }
        return abilityScores;
    }

    public static SpellSlots getSpellSlots(ResultSet resultSet) throws Exception {
        return new SpellSlots(
                null,
                resultSet.getInt("slot_1"),
                resultSet.getInt("slot_2"),
                resultSet.getInt("slot_3"),
                resultSet.getInt("slot_4"),
                resultSet.getInt("slot_5"),
                resultSet.getInt("slot_6"),
                resultSet.getInt("slot_7"),
                resultSet.getInt("slot_8"),
                resultSet.getInt("slot_9")
        );
    }

    public static List<SpellConfiguration> getSpellConfigurations(ResultSet resultSet, int userId) throws Exception {
        List<SpellConfiguration> spellConfigurations = new ArrayList<>();
        while (resultSet.next()) {
            spellConfigurations.add(getSpellConfiguration(resultSet, userId));
        }
        return spellConfigurations;
    }

    private static SpellConfiguration getSpellConfiguration(ResultSet resultSet, int userId) throws Exception {
        return new SpellConfiguration(
                new ListObject(MySql.encodeId(resultSet.getLong("id"), userId), resultSet.getString("name"), resultSet.getInt("sid"), resultSet.getBoolean("is_author")),
                null,
                false,
                true,
                "",
                resultSet.getBoolean("config_is_author")
        );
    }

    public static List<InnateSpellConfiguration> getInnateSpells(ResultSet resultSet, int userId) throws Exception {
        List<InnateSpellConfiguration> spells = new ArrayList<>();
        while (resultSet.next()) {
            spells.add(getInnateSpellConfiguration(resultSet, userId));
        }
        return spells;
    }

    private static InnateSpellConfiguration getInnateSpellConfiguration(ResultSet resultSet, int userId) throws Exception {
        return new InnateSpellConfiguration(
                new ListObject(MySql.encodeId(resultSet.getLong("id"), userId), resultSet.getString("name"), resultSet.getInt("sid"), resultSet.getBoolean("is_author")),
                getLimitedUse(resultSet, userId),
                resultSet.getInt("slot"),
                resultSet.getBoolean("config_is_author")
        );
    }

    public static List<ItemQuantity> getItems(ResultSet resultSet, int userId) throws Exception {
        List<ItemQuantity> spells = new ArrayList<>();
        while (resultSet.next()) {
            spells.add(getItemQuantity(resultSet, userId));
        }
        return spells;
    }

    private static ItemQuantity getItemQuantity(ResultSet resultSet, int userId) throws Exception {
        ItemQuantity itemQuantity = new ItemQuantity(
                new ItemListObject(
                        MySql.encodeId(resultSet.getLong("item_id"), userId),
                        resultSet.getString("item_name"),
                        resultSet.getInt("item_sid"),
                        resultSet.getBoolean("item_is_author"),
                        resultSet.getInt("cost"),
                        MySql.encodeId(resultSet.getLong("cost_unit"), userId),
                        ItemType.valueOf(resultSet.getInt("item_type_id"))
                ),
                resultSet.getInt("quantity"),
                resultSet.getBoolean("item_quantity_author")
        );
        long subItemId = resultSet.getLong("sub_item_id");
        ItemListObject subItem = null;
        if (subItemId != 0) {
            subItem = new ItemListObject(
                    MySql.encodeId(subItemId, userId),
                    resultSet.getString("sub_item_name"),
                    resultSet.getInt("sub_item_sid"),
                    resultSet.getBoolean("sub_item_is_author"),
                    resultSet.getInt("sub_item_cost"),
                    MySql.encodeId(resultSet.getLong("sub_item_cost_unit"), userId),
                    ItemType.valueOf(resultSet.getInt("sub_item_type_id"))
            );
        }
        itemQuantity.getItem().setSubItem(subItem);

        return itemQuantity;
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

    private static MonsterAbilityScore getAbilityScore(ResultSet resultSet, int userId) throws Exception {
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
                true,
                0,
                false,
                false,
                false,
                false,
                false
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
                0,
                false,
                false,
                false,
                false,
                false
        );
    }

    private static Speed getSpeed(ResultSet resultSet) throws Exception {
        return new Speed(
                SpeedType.valueOf(resultSet.getInt("speed_id")),
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

    public static String createMonster(Monster monster, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long newId = create(monster, userId);
        return MySql.encodeId(newId, userId);
    }

    public static long create(Monster monster, int userId) throws Exception {
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Monsters_Create (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setString(1, MySql.getValue(monster.getName(), 150));
            MySql.setId(2, monster.getSpellcastingAbility(), userId, statement);
            MySql.setId(3, monster.getAlignment() == null ? null : monster.getAlignment().getId(), userId, statement);

            statement.setInt(4, monster.getMonsterType().getValue());
            statement.setString(5, MySql.getValue(monster.getTypeVariation(), 45));
            statement.setInt(6, monster.getSize().getValue());
            statement.setInt(7, monster.getChallengeRating().getId());
            statement.setInt(8, MySql.getValue(monster.getExperience(), 0, 999999));
            statement.setBoolean(9, monster.isHover());
            statement.setInt(10, MySql.getValue(monster.getLegendaryPoints(), 0, 99));
            statement.setString(11, MySql.getValue(monster.getDescription(), 255));
            statement.setInt(12, MySql.getValue(monster.getAc(), 0, 99));
            statement.setInt(13, MySql.getValue(monster.getHitDice().getNumDice(), 0, 99));
            statement.setInt(14, monster.getHitDice().getDiceSize().getValue());
            setAbilityLong(15, monster.getHitDice().getAbilityModifier(), userId, statement); //hit_dice_ability_modifier_id
            statement.setInt(16, MySql.getValue(monster.getHitDice().getMiscModifier(), 0, 99));
            statement.setBoolean(17, monster.isSpellcaster());
            MySql.setId(18, monster.getCasterType(), userId, statement);
            MySql.setId(19, monster.getSpellcasterLevel(), userId, statement);
            statement.setInt(20, MySql.getValue(monster.getSpellAttackModifier(), 0, 99));
            statement.setInt(21, MySql.getValue(monster.getSpellSaveModifier(), 0, 99));
            statement.setBoolean(22, monster.isInnateSpellcaster());
            MySql.setId(23, monster.getInnateSpellcasterLevel(), userId, statement);
            MySql.setId(24, monster.getInnateSpellcastingAbility(), userId, statement);
            statement.setInt(25, MySql.getValue(monster.getInnateSpellAttackModifier(), 0, 99));
            statement.setInt(26, MySql.getValue(monster.getInnateSpellSaveModifier(), 0, 99));

            statement.setInt(27, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("monster_id");
                }
            }

            if (id != -1) {
                updateProfs(id, monster, userId, connection);
                updateAbilityScores(id, monster, userId, connection);
                updateDamageModifiers(id, monster, userId, connection);
                updateConditionImmunities(id, monster, userId, connection);
                updateSenses(id, monster, connection);
                updateSpeeds(id, monster.getSpeeds(), connection);
                updateSpellSlots(id, monster.getSpellSlots(), connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    public static void updateMonster(Monster monster, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = MySql.decodeId(monster.getId(), userId);
        boolean success = update(monster, id, userId);
        if (!success) {
            throw new Exception("Unable to update monster");
        }

        PublishDetails publishDetails = getPublishedDetails(id, userId);
        if (publishDetails.getPublishType() == PublishType.PUBLIC) {
            publishPublic(id, userId);
        } else if (publishDetails.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(id, publishDetails.getUsers(), userId);
        }
    }

    public static boolean update(Monster monster, long id, int userId) throws Exception {
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Monsters_Update (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);

            statement.setString(3, MySql.getValue(monster.getName(), 150));
            MySql.setId(4, monster.getSpellcastingAbility(), userId, statement);
            MySql.setId(5, monster.getAlignment() == null ? null : monster.getAlignment().getId(), userId, statement);

            statement.setInt(6, monster.getMonsterType().getValue());
            statement.setString(7, MySql.getValue(monster.getTypeVariation(), 45));
            statement.setInt(8, monster.getSize().getValue());
            statement.setInt(9, monster.getChallengeRating().getId());
            statement.setInt(10, MySql.getValue(monster.getExperience(), 0, 999999));
            statement.setBoolean(11, monster.isHover());
            statement.setInt(12, MySql.getValue(monster.getLegendaryPoints(), 0, 99));
            statement.setString(13, MySql.getValue(monster.getDescription(), 255));
            statement.setInt(14, MySql.getValue(monster.getAc(), 0, 99));
            statement.setInt(15, MySql.getValue(monster.getHitDice().getNumDice(), 0, 99));
            statement.setInt(16, monster.getHitDice().getDiceSize().getValue());
            setAbilityLong(17, monster.getHitDice().getAbilityModifier(), userId, statement); //hit_dice_ability_modifier_id
            statement.setInt(18, MySql.getValue(monster.getHitDice().getMiscModifier(), 0, 99));
            statement.setBoolean(19, monster.isSpellcaster());
            MySql.setId(20, monster.getCasterType(), userId, statement);
            MySql.setId(21, monster.getSpellcasterLevel(), userId, statement);
            statement.setInt(22, MySql.getValue(monster.getSpellAttackModifier(), 0, 99));
            statement.setInt(23, MySql.getValue(monster.getSpellSaveModifier(), 0, 99));
            statement.setBoolean(24, monster.isInnateSpellcaster());
            MySql.setId(25, monster.getInnateSpellcasterLevel(), userId, statement);
            MySql.setId(26, monster.getInnateSpellcastingAbility(), userId, statement);
            statement.setInt(27, MySql.getValue(monster.getInnateSpellAttackModifier(), 0, 99));
            statement.setInt(28, MySql.getValue(monster.getInnateSpellSaveModifier(), 0, 99));

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateProfs(id, monster, userId, connection);
                updateAbilityScores(id, monster, userId, connection);
                updateDamageModifiers(id, monster, userId, connection);
                updateConditionImmunities(id, monster, userId, connection);
                updateSenses(id, monster, connection);
                updateSpeeds(id, monster.getSpeeds(), connection);
                updateSpellSlots(id, monster.getSpellSlots(), connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    private static void setAbilityLong(int index, Ability ability, int userId, PreparedStatement statement) throws Exception {
        String value = null;
        if (ability != null) {
            value = ability.getId();

            if (value.equals("0")) {
                value = null;
            }
        }
        MySql.setId(index, value, userId, statement);
    }

    private static void updateAbilityScores(long monsterId, Monster monster, int userId, Connection connection) throws Exception {
        deleteAbilityScores(monsterId, connection);
        List<MonsterAbilityScore> abilityScores = monster.getAbilityScores();
        if (abilityScores.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_ability_scores` (`monster_id`, `ability_id`, `value`) VALUES (?,?,?)");
            for (MonsterAbilityScore abilityScore : abilityScores) {
                statement.setLong(1, monsterId);
                MySql.setId(2, abilityScore.getAbility().getId(), userId, statement);
                statement.setInt(3, MySql.getValue(abilityScore.getValue(), 0, 99));
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

    private static void deleteAbilityScores(long monsterId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_ability_scores WHERE monster_id = ?");
            statement.setLong(1, monsterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateProfs(long creatureId, Monster monster, int userId, Connection connection) throws Exception {
        deleteAllProfs(creatureId, connection);
        updateAttributeProfs(creatureId, monster.getAttributeProfs(), userId, connection);
        updateItemProfs(creatureId, monster.getItemProfs(), userId, connection);
    }

    private static void updateAttributeProfs(long monsterId, List<Proficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_attribute_profs` (`monster_id`, `attribute_id`) VALUES (?,?)");
            for (Proficiency prof : profs) {
                statement.setLong(1, monsterId);
                MySql.setId(2, prof.getAttribute().getId(), userId, statement);
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

    private static void updateItemProfs(long monsterId, List<ItemProficiency> profs, int userId, Connection connection) throws Exception {
        if (profs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_item_profs` (`monster_id`, `item_id`) VALUES (?,?)");
            for (ItemProficiency prof : profs) {
                statement.setLong(1, monsterId);
                MySql.setId(2, prof.getItem().getId(), userId, statement);
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

    private static void deleteAllProfs(long monsterId, Connection connection) throws Exception {
        deleteAllAttributeProfs(monsterId, connection);
        deleteAllItemProfs(monsterId, connection);
    }

    private static void deleteAllAttributeProfs(long monsterId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_attribute_profs WHERE monster_id = ?");
            statement.setLong(1, monsterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteAllItemProfs(long monsterId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_item_profs WHERE monster_id = ?");
            statement.setLong(1, monsterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateSpeeds(long monsterId, List<Speed> speeds, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_speeds WHERE monster_id = ?");
            statement.setLong(1, monsterId);
            statement.executeUpdate();

            if (!speeds.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `monster_speeds` (`monster_id`, `speed_id`, `value`) VALUES (?, ?, ?)");
                for (Speed speed : speeds) {
                    statement.setLong(1, monsterId);
                    statement.setInt(2, speed.getSpeedType().getValue());
                    statement.setInt(3, MySql.getValue(speed.getValue(), 0, 999));
                    statement.addBatch();
                }
                statement.executeBatch();
            }
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void updateSpellSlots(long monsterId, SpellSlots spellSlots, Connection connection) throws Exception {
        if (spellSlots == null) {
            spellSlots = new SpellSlots();
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_spell_slots WHERE monster_id = ?");
            statement.setLong(1, monsterId);
            statement.executeUpdate();

            statement = connection.prepareStatement("INSERT INTO monster_spell_slots (monster_id, slot_1, slot_2, slot_3, slot_4, slot_5, slot_6, slot_7, slot_8, slot_9) VALUES (?,?,?,?,?,?,?,?,?,?)");
            statement.setLong(1, monsterId);
            statement.setInt(2, MySql.getValue(spellSlots.getSlot1(), 0, 99));
            statement.setInt(3, MySql.getValue(spellSlots.getSlot2(), 0, 99));
            statement.setInt(4, MySql.getValue(spellSlots.getSlot3(), 0, 99));
            statement.setInt(5, MySql.getValue(spellSlots.getSlot4(), 0, 99));
            statement.setInt(6, MySql.getValue(spellSlots.getSlot5(), 0, 99));
            statement.setInt(7, MySql.getValue(spellSlots.getSlot6(), 0, 99));
            statement.setInt(8, MySql.getValue(spellSlots.getSlot7(), 0, 99));
            statement.setInt(9, MySql.getValue(spellSlots.getSlot8(), 0, 99));
            statement.setInt(10, MySql.getValue(spellSlots.getSlot9(), 0, 99));

            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static List<SpellConfiguration> getSpells(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        List<SpellConfiguration> spellConfigurations = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_Get_Spells (?,?)}");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                spellConfigurations = getSpellConfigurations(resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return spellConfigurations;
    }

    public static List<InnateSpellConfiguration> getInnateSpells(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        List<InnateSpellConfiguration> spellConfigurations = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_Get_InnateSpells (?,?)}");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                spellConfigurations = getInnateSpells(resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return spellConfigurations;
    }

    public static void addSpells(String id, List<ListObject> spells, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        List<SpellConfiguration> configurations = new ArrayList<>();
        for (ListObject spell : spells) {
            SpellConfiguration config = new SpellConfiguration();
            config.setSpell(spell);
            configurations.add(config);
        }
        addSpells(monsterId, configurations, userId);
    }

    public static void addSpellConfigurations(String id, List<SpellConfiguration> spells, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        addSpells(monsterId, spells, userId);
    }

    public static void addInnateSpells(String id, List<ListObject> spells, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        List<InnateSpellConfiguration> configurations = new ArrayList<>();
        for (ListObject spell : spells) {
            InnateSpellConfiguration config = new InnateSpellConfiguration();
            config.setSpell(spell);
            configurations.add(config);
        }
        addInnateSpells(monsterId, configurations, userId);
    }

    public static void addInnateSpellConfigurations(String id, List<InnateSpellConfiguration> spells, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        addInnateSpells(monsterId, spells, userId);
    }

    public static void deleteSpellConfigurations(long monsterId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM monster_spells WHERE monster_id = ? AND user_id = ?");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteInnateSpellConfigurations(long monsterId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM monster_innate_spells WHERE monster_id = ? AND user_id = ?");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void addSpells(long monsterId, List<SpellConfiguration> spells, int userId) throws Exception {
        if (spells.isEmpty()) {
            return;
        }
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT INTO `monster_spells` (`monster_id`, `spell_id`, user_id) VALUES (?,?,?)");
            for (SpellConfiguration config : spells) {
                statement.setLong(1, monsterId);
                MySql.setId(2, config.getSpell().getId(), userId, statement);
                statement.setInt(3, userId);
                statement.addBatch();
            }
            statement.executeBatch();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        updateVersion(monsterId, userId);
    }

    public static void addInnateSpells(long monsterId, List<InnateSpellConfiguration> spells, int userId) throws Exception {
        if (spells.isEmpty()) {
            return;
        }
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("INSERT INTO `monster_innate_spells` (`monster_id`, `spell_id`, user_id, limited_use_type_id, quantity, ability_modifier_id, dice_size_id, slot) VALUES (?,?,?,?,?,?,?,?)");
            for (InnateSpellConfiguration config : spells) {
                LimitedUse limitedUse = config.getLimitedUse();
                statement.setLong(1, monsterId);
                MySql.setId(2, config.getSpell().getId(), userId, statement);
                statement.setInt(3, userId);
                MySql.setInteger(4, limitedUse == null ? null : limitedUse.getLimitedUseType().getValue(), statement);
                statement.setInt(5, MySql.getValue(limitedUse == null ? null : limitedUse.getQuantity(), 0, 999));
                MySql.setId(6, limitedUse == null || limitedUse.getAbilityModifier().equals("0") ? null : limitedUse.getAbilityModifier(), userId, statement);
                MySql.setInteger(7, limitedUse == null || limitedUse.getDiceSize() == null ? null : limitedUse.getDiceSize().getValue(), statement);
                statement.setInt(8, MySql.getValue(config.getSlot(), 0, 9));
                statement.addBatch();
            }
            statement.executeBatch();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        updateVersion(monsterId, userId);
    }

    public static void updateInnateSpellConfiguration(String id, InnateSpellConfiguration config, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        updateInnateSpellConfiguration(monsterId, config, userId);
    }

    private static void updateInnateSpellConfiguration(long monsterId, InnateSpellConfiguration config, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE monster_innate_spells SET limited_use_type_id = ?, quantity = ?, ability_modifier_id = ?, dice_size_id = ?, slot = ? WHERE monster_id = ? AND spell_id = ? AND user_id = ?");

            LimitedUse limitedUse = config.getLimitedUse();
            MySql.setInteger(1, limitedUse == null ? null : limitedUse.getLimitedUseType().getValue(), statement);
            statement.setInt(2, MySql.getValue(limitedUse == null ? null : limitedUse.getQuantity(), 0, 999));
            MySql.setId(3, limitedUse == null || limitedUse.getAbilityModifier().equals("0") ? null : limitedUse.getAbilityModifier(), userId, statement);
            MySql.setInteger(4, limitedUse == null || limitedUse.getDiceSize() == null ? null : limitedUse.getDiceSize().getValue(), statement);
            statement.setInt(5, MySql.getValue(config.getSlot(), 0, 9));
            statement.setLong(6, monsterId);
            MySql.setId(7, config.getSpell().getId(), userId, statement);
            statement.setInt(8, userId);

            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        updateVersion(monsterId, userId);
    }

    public static void deleteSpells(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        deleteSpellConfigurations(monsterId, userId);
        updateVersion(monsterId, userId);
    }

    public static void deleteInnateSpells(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        deleteInnateSpellConfigurations(monsterId, userId);
        updateVersion(monsterId, userId);
    }

    public static void deleteSpell(String id, String spellId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        long decodedSpellId = MySql.decodeId(spellId, userId);
        deleteSpell(monsterId, decodedSpellId, userId);
        updateVersion(monsterId, userId);
    }

    private static void deleteSpell(long monsterId, long spellId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM monster_spells WHERE monster_id = ? AND spell_id = ? AND user_id = ?");
            statement.setLong(1, monsterId);
            statement.setLong(2, spellId);
            statement.setInt(3, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteInnateSpell(String id, String spellId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        long decodedSpellId = MySql.decodeId(spellId, userId);
        deleteInnateSpell(monsterId, decodedSpellId, userId);
        updateVersion(monsterId, userId);
    }

    private static void deleteInnateSpell(long monsterId, long spellId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM monster_innate_spells WHERE monster_id = ? AND spell_id = ? AND user_id = ?");
            statement.setLong(1, monsterId);
            statement.setLong(2, spellId);
            statement.setInt(3, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /************************ Items ****************************/

    public static void updateItems(String id, List<ItemQuantity> items, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        updateItems(monsterId, items, userId);
    }

    private static void updateItems(long monsterId, List<ItemQuantity> items, int userId) throws Exception {
        deleteItems(monsterId, userId);

        PreparedStatement statement = null;
        Connection connection = null;
        try {
            connection = MySql.getConnection();

            if (!items.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `monster_items` (`monster_id`, `item_id`, `sub_item_id`, `quantity`, `user_id`) VALUES (?,?,?,?,?)");

                for (ItemQuantity itemQuantity : items) {
                    statement.setLong(1, monsterId);
                    MySql.setId(2, itemQuantity.getItem().getId(), userId, statement);
                    MySql.setId(3, itemQuantity.getItem().getSubItem() == null ? null : itemQuantity.getItem().getSubItem().getId(), userId, statement);
                    statement.setInt(4, itemQuantity.getQuantity());
                    statement.setInt(5, userId);
                    statement.addBatch();
                }
                statement.executeBatch();
            }
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        updateVersion(monsterId, userId);
    }

    public static void updateItemQuantity(String id, String itemId, ItemQuantity itemQuantity, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        long decodedItemId = MySql.decodeId(itemId, userId);
        updateItemQuantity(monsterId, decodedItemId, itemQuantity, userId);
        updateVersion(monsterId, userId);
    }

    private static void updateItemQuantity(long monsterId, long itemId, ItemQuantity ItemQuantity, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("UPDATE monster_items SET quantity = ? WHERE monster_id = ? AND item_id = ? AND user_id = ? AND (sub_item_id IS NULL OR sub_item_id = ?)");
            statement.setInt(1, ItemQuantity.getQuantity());
            statement.setLong(2, monsterId);
            statement.setLong(3, itemId);
            statement.setInt(4, userId);
            MySql.setId(5, ItemQuantity.getItem().getSubItem() == null ? null : ItemQuantity.getItem().getSubItem().getId(), userId, statement);

            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        updateVersion(monsterId, userId);
    }

    public static void deleteItems(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        deleteItems(monsterId, userId);
        updateVersion(monsterId, userId);
    }

    public static void deleteItems(long monsterId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM monster_items WHERE monster_id = ? AND user_id = ?");
            statement.setLong(1, monsterId);
            statement.setInt(2, userId);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void deleteItem(String id, String itemId, String subItemId, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        long decodedItemId = MySql.decodeId(itemId, userId);
        long decodedSubItemId = MySql.decodeId(subItemId, userId);
        deleteItem(monsterId, decodedItemId, decodedSubItemId, userId);
        updateVersion(monsterId, userId);
    }

    private static void deleteItem(long monsterId, long itemId, long subItemId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM monster_items WHERE monster_id = ? AND item_id = ? AND user_id = ? AND (sub_item_id IS NULL OR sub_item_id = ?)");
            statement.setLong(1, monsterId);
            statement.setLong(2, itemId);
            statement.setInt(3, userId);
            MySql.setId(4, subItemId, statement);
            statement.execute();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /************************ Misc ****************************/

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
//            statement = connection.prepareCall("{call Monsters_InUse (?,?)}");
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
            statement = connection.prepareCall("{call Monsters_Delete (?,?)}");
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
        int userId = AuthenticationService.getUserId(headers);
        long originalMonsterId = MySql.decodeId(id, userId);
        Monster monster = getMonster(id, headers);
        if (monster == null) {
            throw new Exception("monster not found");
        }
        monster.setId("0");
        monster.setName(name);
        String encodedNewId = createMonster(monster, headers);
        long newId = MySql.decodeId(encodedNewId, userId);

        addSpells(newId, monster.getSpells(), userId);
        addInnateSpells(newId, monster.getInnateSpells(), userId);
        updateItems(newId, monster.getItems(), userId);

        List<MonsterPower> actions = MonsterPowerService.getPowers(originalMonsterId, MonsterPowerType.ACTION, userId);
        for (MonsterPower action : actions) {
            action.setId("0");
            MonsterPowerService.createPower(newId, action, userId);
        }

        List<MonsterPower> features = MonsterPowerService.getPowers(originalMonsterId, MonsterPowerType.FEATURE, userId);
        for (MonsterPower feature : features) {
            feature.setId("0");
            MonsterPowerService.createPower(newId, feature, userId);
        }

        return encodedNewId;
    }

    /**************************** Sharing ****************************/

    public static PublishDetails getPublishedDetails(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        return getPublishedDetails(monsterId, userId);
    }

    private static PublishDetails getPublishedDetails(long monsterId, int userId) throws Exception {
        PublishDetails publishDetails = new PublishDetails();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_GetPublishedDetails (?,?)}");
            statement.setLong(1, monsterId);
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
        long monsterId = MySql.decodeId(id, userId);
        return getVersionInfo(monsterId, userId);
    }

    private static VersionInfo getVersionInfo(long monsterId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        VersionInfo versionInfo = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_Get_VersionInfo (?,?)}");
            statement.setLong(1, monsterId);
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

    public static void publishMonster(String id, PublishRequest publishRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        publishMonster(monsterId, publishRequest, userId);
    }

    private static long publishMonster(long monsterId, PublishRequest publishRequest, int userId) throws Exception {
        if (publishRequest.getPublishType() == PublishType.PUBLIC) {
            publishPublic(monsterId, userId);
        } else if (publishRequest.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(monsterId, publishRequest.getUsers(), userId);
        } else {
            unPublish(monsterId, userId);
        }

        return monsterId;
    }

    private static void publishPublic(long creatureId, int userId) throws Exception {
        ShareList shareList = SharingUtilityService.getMonsterShareList(creatureId, userId);
        SharingUtilityService.sharePublic(shareList, userId);
    }

    private static void publishPrivate(long creatureId, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        ShareList shareList = SharingUtilityService.getMonsterShareList(creatureId, userId);
        SharingUtilityService.sharePrivate(shareList, users, userId);
    }

    private static void unPublish(long monsterId, int userId) throws Exception {
        ShareList shareList = new ShareList();
        Monster monster = getMonster(monsterId, userId);
        addToUnShareList(monster, userId, shareList);
        SharingUtilityService.unSharePrivate(shareList, userId);
    }

    public static String addToMyStuff(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(id, userId);
        if (monsterId == 0) {
            return "0";
        }
        long newId = addToMyStuff(monsterId, userId, true);
        return MySql.encodeId(newId, userId);
    }

    private static long addToMyStuff(long creatureId, int userId, boolean checkRights) throws Exception {
        long authorMonsterId = 0;
        int authorUserId = 0;
        long existingMonsterId = 0;

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Monsters_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            statement.setBoolean(3, checkRights);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    authorMonsterId = resultSet.getLong("author_monster_id");
                    if (authorMonsterId == 0) {
                        throw new Exception("unable to find monster to add");
                    }

                    authorUserId = resultSet.getInt("author_user_id");
                    existingMonsterId = resultSet.getLong("existing_monster_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        Monster authorMonster = getMonster(authorMonsterId, authorUserId);
        if (authorMonster == null) {
            throw new Exception("unable to find monster to add");
        }
        ListObject existingMonster = null;
        if (existingMonsterId != 0) {
            existingMonster = new ListObject(
                    MySql.encodeId(existingMonsterId, userId),
                    "",
                    0,
                    false
            );
        }

        long newId = addToMyStuff(authorMonster, authorUserId, existingMonster, userId);
        if (newId < 1) {
            throw new Exception("unable to add creature");
        }
        if (authorMonster.getSid() == 0) {
            updateParentId(newId, authorMonsterId, authorMonster.getVersion());
        }
        return newId;
    }

    private static void updateParentId(long id, long parentId, int parentVersion) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE monsters SET published_parent_id = ?, published_parent_version = ?, version = ? WHERE id = ?;");
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

    public static long addToMyStuff(Monster monster, int authorUserId, ListObject existingMonster, int userId) throws Exception {
        long monsterId;
        long originalMonsterId = MySql.decodeId(monster.getId(), userId);
        SharingUtilityService.addSpellConfigurationsToMyStuff(monster.getSpells(), userId);
        SharingUtilityService.addInnateSpellConfigurationsToMyStuff(monster.getInnateSpells(), userId);
        SharingUtilityService.addProficienciesToMyStuff(monster.getAttributeProfs(), userId, true, false);
        SharingUtilityService.addItemProficienciesToMyStuff(monster.getItemProfs(), userId);
        SharingUtilityService.addItemQuantitiesToMyStuff(monster.getItems(), userId);

        if (CUSTOM_ABILITIES && monster.getAbilityScores() != null) {
            for (int i = 0; i < monster.getAbilityScores().size(); i++) {
                String newId = AttributeService.addToMyStuff(monster.getAbilityScores().get(i).getAbility(), userId);
                monster.getAbilityScores().get(i).getAbility().setId(newId);
            }

            String newId = AttributeService.addToMyStuff(monster.getSpellcastingAbility(), userId);
            monster.setSpellcastingAbility(newId);
        }

        if (CUSTOM_LEVELS) {
            String newId = AttributeService.addToMyStuff(monster.getSpellcasterLevel(), userId);
            monster.getSpellcasterLevel().setId(newId);
        }

        AttributeService.addToMyStuff(monster.getAlignment(), userId);
        AttributeService.addToMyStuff(monster.getCasterType(), userId);
        SharingUtilityService.addDamageModifiersToMyStuff(monster.getDamageModifiers(), userId);
        AttributeService.addToMyStuff(monster.getConditionImmunities(), userId);

        if (monster.getSid() != 0) {
            addSystemMonster(MySql.decodeId(monster.getId(), authorUserId), userId);
            monsterId = MySql.decodeId(monster.getId(), authorUserId);
        } else {
            if (existingMonster == null) {
                monsterId = create(monster, userId);
            } else {
                monsterId = MySql.decodeId(existingMonster.getId(), userId);
                update(monster, monsterId, userId);
            }
        }

        if (monster.getSid() == 0) {
            deleteSpellConfigurations(monsterId, userId);
            addSpells(monsterId, monster.getSpells(), userId);
            deleteInnateSpellConfigurations(monsterId, userId);
            addInnateSpells(monsterId, monster.getInnateSpells(), userId);
            updateItems(monsterId, monster.getItems(), userId);
        }

        MonsterPowerService.addMonsterPowersToMyStuff(originalMonsterId, monsterId, userId, authorUserId);

        return monsterId;
    }

    public static void addSystemMonster(long id, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("INSERT IGNORE INTO monsters_shared (monster_id, user_id) VALUE (?,?);");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void addToShareList(List<ListObject> monsters, int userId, ShareList shareList) throws Exception {
        if (monsters != null) {
            for (ListObject item : monsters) {
                addToShareList(item, userId, shareList);
            }
        }
    }

    public static void addToShareList(ListObject monster, int userId, ShareList shareList) throws Exception {
        if (monster != null) {
            long id = MySql.decodeId(monster.getId(), userId);
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
        Monster monster = getMonster(id, userId);
        addToShareList(monster, userId, shareList);
    }

    public static void addToShareList(Monster monster, int userId, ShareList shareList) throws Exception {
        if (monster != null) {
            shareList.getMonsters().add(monster.getId());
            SharingUtilityService.addSpellConfigurationsToShareList(monster.getSpells(), userId, shareList);
            SharingUtilityService.addInnateSpellConfigurationsToShareList(monster.getInnateSpells(), userId, shareList);
            SharingUtilityService.addProficienciesToShareList(monster.getAttributeProfs(), userId, true, false, shareList);
            SharingUtilityService.addItemProficienciesToShareList(monster.getItemProfs(), userId, shareList);
            SharingUtilityService.addItemQuantitiesToShareList(monster.getItems(), userId, shareList);

            if (CUSTOM_ABILITIES) {
                for (int i = 0; i < monster.getAbilityScores().size(); i++) {
                    AttributeService.addToShareList(monster.getAbilityScores().get(i).getAbility(), userId, shareList);
                }
                AttributeService.addToShareList(monster.getSpellcastingAbility(), userId, shareList);
            }

            if (CUSTOM_LEVELS) {
                AttributeService.addToShareList(monster.getSpellcasterLevel(), userId, shareList);
            }

            AttributeService.addToShareList(monster.getCasterType(), userId, shareList);
            AttributeService.addToShareList(monster.getAlignment(), userId, shareList);
            SharingUtilityService.addDamageModifiersToShareList(monster.getDamageModifiers(), userId, shareList);
            AttributeService.addToShareList(monster.getConditionImmunities(), userId, shareList);
//            MonsterPowerService.addMonsterPowersToShareList(monsterId, userId, shareList);
        }
    }

    public static void addToUnShareList(Monster monster, int userId, ShareList shareList) throws Exception {
        long monsterId = MySql.decodeId(monster.getId(), userId);
        shareList.getMonsters().add(monster.getId());
//        MonsterPowerService.addMonsterPowersToUnShareList(monsterId, userId, shareList);
    }

    public static void updateVersion(long monsterId, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE monsters SET version = version + 1 WHERE user_id = ? AND id = ?;");
            statement.setInt(1, userId);
            statement.setLong(2, monsterId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    /**************************** Damage Modifiers ********************************/

    public static void updateDamageModifier(String monsterIdStr, String damageTypeIdStr, DamageModifierType damageModifierType, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long monsterId = MySql.decodeId(monsterIdStr, userId);
        long damageTypeId = MySql.decodeId(damageTypeIdStr, userId);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            deleteDamageModifier(monsterId, damageTypeId, connection);

            statement = connection.prepareStatement("INSERT INTO `monster_damage_modifiers` (`monster_id`, `damage_type_id`, `damage_modifier_type_id`, `condition`) VALUES (?, ?, ?, ?)");
            statement.setLong(1, monsterId);
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

    private static void updateDamageModifiers(long monsterId, Monster monster, int userId, Connection connection) throws Exception {
        deleteDamageModifiers(monsterId, connection);
        List<DamageModifier> damageModifiers = monster.getDamageModifiers();
        if (damageModifiers.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_damage_modifiers` (`monster_id`, `damage_type_id`, `damage_modifier_type_id`, `condition`) VALUES (?, ?, ?, ?)");
            for (DamageModifier damageModifier : damageModifiers) {
                statement.setLong(1, monsterId);
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

    private static void deleteDamageModifiers(long monsterId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_damage_modifiers WHERE monster_id = ?");
            statement.setLong(1, monsterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteDamageModifier(long monsterId, long damageTypeId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_damage_modifiers WHERE monster_id = ? AND damage_type_id = ?");
            statement.setLong(1, monsterId);
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

    private static List<ListObject> getConditionImmunities(long monsterId, int userId) throws Exception {
        List<ListObject> conditionImmunities = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT a.id, a.name, a.sid FROM monster_condition_immunities cci JOIN attributes a ON cci.condition_id = a.id WHERE cci.monster_id = ?");
            statement.setLong(1, monsterId);
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
        long monsterId = MySql.decodeId(id, userId);

        if (!immune) {
            long conditionId = MySql.decodeId(condId, userId);
            deleteConditionImmunity(monsterId, conditionId);
        } else {
            Connection connection = null;
            PreparedStatement statement = null;
            try {
                connection = MySql.getConnection();
                statement = connection.prepareStatement("INSERT INTO `monster_condition_immunities` (`monster_id`, `condition_id`) VALUES (?, ?)");
                statement.setLong(1, monsterId);
                MySql.setId(2, condId, userId, statement);
                statement.executeUpdate();
                MySql.closeConnections(null, statement, connection);
            } catch (Exception e) {
                MySql.closeConnectionsAndThrow(null, statement, connection, e);
            }
        }

        return getConditionImmunities(monsterId, userId);
    }

    private static void updateConditionImmunities(long monsterId, Monster monster, int userId, Connection connection) throws Exception {
        deleteConditionImmunities(monsterId, connection);
        List<ListObject> conditionImmunities = monster.getConditionImmunities();
        if (conditionImmunities.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_condition_immunities` (`monster_id`, `condition_id`) VALUES (?, ?)");
            for (ListObject conditionImmunity : conditionImmunities) {
                statement.setLong(1, monsterId);
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

    private static void deleteConditionImmunities(long monsterId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_condition_immunities WHERE monster_id = ?");
            statement.setLong(1, monsterId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void deleteConditionImmunity(long monsterId, long conditionId) throws  Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("DELETE FROM monster_condition_immunities WHERE monster_id = ? AND condition_id = ?");
            statement.setLong(1, monsterId);
            statement.setLong(2, conditionId);
            statement.executeUpdate();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
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

    private static void updateSenses(long monsterId, Monster monster, Connection connection) throws Exception {
        deleteSenses(monsterId, connection);
        List<SenseValue> senses = monster.getSenses();
        if (senses.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `monster_senses` (`monster_id`, `sense_id`, `range`) VALUES (?, ?, ?)");
            for (SenseValue senseValue : senses) {
                statement.setLong(1, monsterId);
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

    private static void deleteSenses(long monsterId, Connection connection) throws  Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM monster_senses WHERE monster_id = ?");
            statement.setLong(1, monsterId);
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
