package com.herd.squire.services.items;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.DiceSize;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.CharacterLevel;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.items.EquipmentSlotType;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.ItemListObject;
import com.herd.squire.models.items.magical_item.*;
import com.herd.squire.models.powers.AttackType;
import com.herd.squire.models.powers.SpellListObject;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.services.characteristics.CharacteristicService;
import com.herd.squire.services.powers.PowerService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.services.SharingUtilityService.CUSTOM_LEVELS;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class MagicalItemService implements ItemDetailsService {
    @Override
    public Item get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getMagicalItem(resultSet, statement, userId);
    }

    public MagicalItem get(long id, int userId) throws Exception {
        MagicalItem magicalItem = null;
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_MagicalItem (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    magicalItem = getMagicalItem(resultSet, statement, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return magicalItem;
    }

    private MagicalItem getMagicalItem(ResultSet resultSet, Statement statement, int userId) throws Exception {
        MagicalItem magicalItem = new MagicalItem(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getBoolean("expendable"),
                resultSet.getBoolean("equippable"),
                EquipmentSlotType.valueOf(resultSet.getInt("slot")),
                resultSet.getBoolean("container"),
                resultSet.getBoolean("ignore_weight"),
                resultSet.getInt("cost"),
                ItemService.getCostUnit(resultSet, userId),
                resultSet.getDouble("weight"),
                MagicalItemType.valueOf(resultSet.getInt("magical_item_type_id")),
                Rarity.valueOf(resultSet.getInt("rarity_id")),
                resultSet.getBoolean("requires_attunement"),
                MagicalItemAttunementType.valueOf(resultSet.getInt("magical_item_attunement_type_id")),
                resultSet.getString("curse_effect"),
                resultSet.getInt("max_charges"),
                resultSet.getBoolean("rechargeable"),
                new DiceCollection(
                        resultSet.getInt("recharge_num_dice"),
                        DiceSize.valueOf(resultSet.getInt("recharge_dice_size_id")),
                        null,
                        resultSet.getInt("recharge_misc_mod")
                ),
                resultSet.getBoolean("recharge_on_long_rest"),
                resultSet.getBoolean("chance_of_destruction"),
                resultSet.getBoolean("additional_spells"),
                resultSet.getBoolean("additional_spells_remove_on_casting"),
                AttackType.valueOf(resultSet.getInt("attack_type_id")),
                resultSet.getBoolean("temporary_hp"),
                resultSet.getInt("attack_mod"),
                getSaveType(resultSet, userId), //saveType,
                resultSet.getBoolean("half_on_save"),
                resultSet.getInt("ac_mod"),
                MagicalItemSpellAttackCalculationType.valueOf(resultSet.getInt("spell_attack_calculation_type_id")),
                resultSet.getInt("spell_attack_modifier"),
                resultSet.getInt("spell_save_dc")
        );

        // Spells
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<MagicalItemSpellConfiguration> spells = new ArrayList<>();
            while (resultSet.next()) {
                SpellListObject spell = new SpellListObject(
                        MySql.encodeId(resultSet.getLong("spell_id"), userId),
                        resultSet.getString("spell_name"),
                        resultSet.getInt("spell_sid"),
                        resultSet.getBoolean("spell_is_author"),
                        resultSet.getInt("spell_level")
                );
                MagicalItemSpellConfiguration config = new MagicalItemSpellConfiguration(
                        spell,
                        false,
                        resultSet.getInt("stored_level"),
                        getCasterLevel(resultSet, userId),
                        resultSet.getBoolean("allow_casting_at_higher_level"),
                        resultSet.getInt("charges"),
                        resultSet.getInt("charges_per_level_above_stored_level"),
                        resultSet.getInt("max_level"),
                        resultSet.getBoolean("remove_on_casting"),
                        resultSet.getBoolean("override_spell_attack_calculation"),
                        resultSet.getInt("spell_attack_modifier"),
                        resultSet.getInt("spell_save_dc")
                );
                spells.add(config);
            }
            magicalItem.setSpells(spells);

            //todo - set spellFilters
        }

        // Damages
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            magicalItem.setDamages(ItemService.getDamageConfigurations(resultSet, userId));
        }

        // Applicable Weapons / Armors // Ammos
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            List<MagicalItemApplicability> items = getApplicableItems(resultSet, userId);
            if (magicalItem.getMagicalItemType() == MagicalItemType.WEAPON) {
                magicalItem.setApplicableWeapons(items);
            } else if (magicalItem.getMagicalItemType() == MagicalItemType.ARMOR) {
                magicalItem.setApplicableArmors(items);
            } else if (magicalItem.getMagicalItemType() == MagicalItemType.AMMO) {
                magicalItem.setApplicableAmmos(items);
            }
        }

        //applicable spells
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            magicalItem.setApplicableSpells(getApplicableSpells(resultSet, userId));
        }

        //attunement classes
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            magicalItem.setAttunementClasses(getAttunementClasses(resultSet, userId));
        }

        //attunement races
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            magicalItem.setAttunementRaces(getAttunementRaces(resultSet, userId));
        }

        //attunement alignments
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            magicalItem.setAttunementAlignments(getAttunementAlignments(resultSet, userId));       }

        //tables
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            magicalItem.setTables(getMagicalItemTables(statement, resultSet, userId));
        }

        return magicalItem;
    }

    private static CharacterLevel getCasterLevel(ResultSet resultSet, int userId) throws Exception {
        long levelId = resultSet.getLong("caster_level_id");
        CharacterLevel characterLevel = null;
        if (levelId != 0) {
            characterLevel = new CharacterLevel(
                    MySql.encodeId(levelId, userId),
                    resultSet.getString("level_name"),
                    resultSet.getString("level_description"),
                    resultSet.getInt("level_sid"),
                    resultSet.getBoolean("level_is_author"),
                    resultSet.getInt("level_version"),
                    resultSet.getInt("min_exp"),
                    resultSet.getInt("prof_bonus")
            );
        }
        return characterLevel;
    }

    private static ListObject getSaveType(ResultSet resultSet, int userId) throws Exception {
        return new ListObject(
                MySql.encodeId(resultSet.getLong("save_type_id"), userId),
                resultSet.getString("ability_name"),
                resultSet.getInt("ability_sid"),
                resultSet.getBoolean("ability_is_author")
        );
    }

    public static List<MagicalItemApplicability> getApplicableItems(ResultSet resultSet, int userId) throws  Exception {
        List<MagicalItemApplicability> items = new ArrayList<>();
        while (resultSet.next()) {
            items.add(getMagicalItemApplicablityItem(resultSet, userId));
        }
        return items;
    }

    public static List<MagicalItemApplicability> getApplicableSpells(ResultSet resultSet, int userId) throws  Exception {
        List<MagicalItemApplicability> items = new ArrayList<>();
        while (resultSet.next()) {
            items.add(getMagicalItemApplicablitySpell(resultSet, userId));
        }
        return items;
    }

    private static MagicalItemApplicability getMagicalItemApplicablityItem(ResultSet resultSet, int userId) throws Exception {
        long itemId = resultSet.getLong("id");
        ItemListObject item = null;
        if (itemId > 0) {
            item = ItemService.getItemListObject(resultSet, userId);
        }
        return new MagicalItemApplicability(
                MagicalItemApplicabilityType.valueOf(resultSet.getInt("applicability_type_id")),
                item,
                null,
                new Filters(resultSet.getString("filters"), userId)
        );
    }


    private static MagicalItemApplicability getMagicalItemApplicablitySpell(ResultSet resultSet, int userId) throws Exception {
        long spellId = resultSet.getLong("spell_id");
        SpellListObject spell = null;
        if (spellId > 0) {
            spell = new SpellListObject(
                    MySql.encodeId(spellId, userId),
                    resultSet.getString("spell_name"),
                    resultSet.getInt("spell_sid"),
                    resultSet.getBoolean("spell_is_author"),
                    resultSet.getInt("spell_level")
            );
        }
        return new MagicalItemApplicability(
                MagicalItemApplicabilityType.valueOf(resultSet.getInt("applicability_type_id")),
                null,
                spell,
                new Filters(resultSet.getString("filters"), userId)
        );
    }

    public static List<ListObject> getAttunementClasses(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> classes = new ArrayList<>();
        while (resultSet.next()) {
            classes.add(MySql.getListObject(resultSet, userId));
        }
        return classes;
    }

    public static List<ListObject> getAttunementRaces(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> races = new ArrayList<>();
        while (resultSet.next()) {
            races.add(MySql.getListObject(resultSet, userId));
        }
        return races;
    }

    public static List<ListObject> getAttunementAlignments(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> alignments = new ArrayList<>();
        while (resultSet.next()) {
            alignments.add(MySql.getListObject(resultSet, userId));
        }
        return alignments;
    }

    public static List<MagicalItemTable> getMagicalItemTables(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Map<Long, MagicalItemTable> tableMap = new HashMap<>();
        List<MagicalItemTable> tables = new ArrayList<>();
        while (resultSet.next()) {
            MagicalItemTable table = getMagicalItemTable(resultSet, userId);
            tableMap.put(resultSet.getLong("id"), table);
            tables.add(table);
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                long tableId = resultSet.getLong("id");
                MagicalItemTable table = tableMap.get(tableId);
                if (table != null) {
                    int rowNumber = resultSet.getInt("row_number");
                    String value = resultSet.getString("value");

                    if (rowNumber == 0) { // columns
                        table.getColumns().add(value);
                    } else { // rows
                        if (table.getRows().size() <= rowNumber - 1) {
                            table.getRows().add(new MagicalItemTableRow());
                        }
                        MagicalItemTableRow row = table.getRows().get(rowNumber - 1);
                        row.getValues().add(value);
                    }
                }
            }
        }

        return tables;
    }

    private static MagicalItemTable getMagicalItemTable(ResultSet resultSet, int userId) throws Exception {
        return new MagicalItemTable(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name")
        );
    }

    @Override
    public CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
        Boolean isExpendable = FilterService.getFilterBoolean(filterValues, FilterKey.EXPENDABLE);
        Boolean isEquippable = FilterService.getFilterBoolean(filterValues, FilterKey.EQUIPPABLE);
        Boolean isContainer = FilterService.getFilterBoolean(filterValues, FilterKey.CONTAINER);

        String magicalTypeString = FilterService.getFilterValue(filterValues, FilterKey.MAGICAL_TYPE);
        MagicalItemType magicalItemType = null;
        if (magicalTypeString != null && !magicalTypeString.equals(FilterValue.DEFAULT_OPTION)) {
            magicalItemType = MagicalItemType.valueOf(magicalTypeString);
        }
        String rarityString = FilterService.getFilterValue(filterValues, FilterKey.RARITY);
        Rarity rarity = null;
        if (rarityString != null && !rarityString.equals(FilterValue.DEFAULT_OPTION)) {
            rarity = Rarity.valueOf(rarityString);
        }
        Boolean isAttunement = FilterService.getFilterBoolean(filterValues, FilterKey.ATTUNEMENT);
        Boolean isCursed = FilterService.getFilterBoolean(filterValues, FilterKey.CURSED);

        CallableStatement statement = connection.prepareCall("{call Items_GetList_MagicalItems (?,?,?,?,?,?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        statement.setString(2, search);
        MySql.setBoolean(3, isExpendable, statement);
        MySql.setBoolean(4, isEquippable, statement);
        MySql.setBoolean(5, isContainer, statement);
        MySql.setInteger(6, magicalItemType == null ? null : magicalItemType.getValue(), statement);
        MySql.setInteger(7, rarity == null ? null : rarity.getValue(), statement);
        MySql.setBoolean(8, isAttunement, statement);
        MySql.setBoolean(9, isCursed, statement);
        statement.setLong(10, offset);
        statement.setLong(11, PAGE_SIZE);
        statement.setInt(12, listSource.getValue());
        return statement;
    }

    @Override
    public CallableStatement getSubItemListObjectStatement(Connection connection, String subTypeId, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        throw new Exception("not implemented");
    }

    @Override
    public long create(Item item, int userId) throws Exception {
        if (!(item instanceof MagicalItem)) {
            throw new Exception("Invalid item type");
        }
        MagicalItem magicalItem = (MagicalItem) item;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call Items_Create_MagicalItem (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(item.getName(), 50));
            statement.setString(2, MySql.getValue(item.getDescription(), 10000));
            statement.setBoolean(3, item.isExpendable());
            statement.setBoolean(4, item.isEquippable());
            MySql.setInteger(5, item.getSlot() == null ? null : item.getSlot().getValue(), statement);
            statement.setBoolean(6, item.isContainer());
            statement.setBoolean(7, item.isIgnoreWeight());
            statement.setInt(8, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(9, item.getCostUnit() == null ? null : item.getCostUnit().getId(), userId, statement);
            statement.setDouble(10, MySql.getValue(item.getWeight(), 0, 999));

            statement.setInt(11, magicalItem.getMagicalItemType().getValue());
            statement.setInt(12, magicalItem.getRarity().getValue());
            statement.setBoolean(13, magicalItem.isRequiresAttunement());
            statement.setString(14, MySql.getValue(magicalItem.getCurseEffect(), 1000));
            statement.setInt(15, magicalItem.getMaxCharges());
            statement.setBoolean(16, magicalItem.isRechargeable());
            statement.setInt(17, magicalItem.getRechargeRate() == null ? 0: magicalItem.getRechargeRate().getNumDice());
            statement.setInt(18, magicalItem.getRechargeRate() == null || magicalItem.getRechargeRate().getDiceSize() == null ? DiceSize.ONE.getValue(): magicalItem.getRechargeRate().getDiceSize().getValue());
            statement.setInt(19, magicalItem.getRechargeRate() == null ? 0: magicalItem.getRechargeRate().getMiscModifier());
            statement.setBoolean(20, magicalItem.isChanceOfDestruction());
            statement.setBoolean(21,  false); //isVehicle
            statement.setInt(22, magicalItem.getAttackMod());
            statement.setInt(23, magicalItem.getAcMod());
            statement.setBoolean(24, magicalItem.isAdditionalSpells());
            statement.setBoolean(25, magicalItem.isAdditionalSpellsRemoveOnCasting());
            statement.setInt(26, magicalItem.getAttackType().getValue());
            statement.setBoolean(27, magicalItem.isTemporaryHP());
            MySql.setId(28, magicalItem.getSaveType(), userId, statement);
            statement.setBoolean(29, magicalItem.isHalfOnSave());
            statement.setBoolean(30, magicalItem.isRechargeOnLongRest());
            statement.setInt(31, magicalItem.getSpellAttackCalculationType().getValue());
            statement.setInt(32, magicalItem.getSpellAttackModifier());
            statement.setInt(33, magicalItem.getSpellSaveDC());
            statement.setInt(34, magicalItem.getAttunementType().getValue());

            statement.setInt(35, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("item_id");
                }
            }

            if (id != -1) {
                addSpellConfigurations(id, magicalItem.getSpells(), userId, connection);
                if (magicalItem.isAdditionalSpells() || magicalItem.getMagicalItemType() == MagicalItemType.SCROLL) {
                     addApplicableSpellConfigurations(id, magicalItem.getApplicableSpells(), userId, connection);
                }
                ItemService.updateDamages(id, magicalItem.getDamages(), userId, connection);
                if (magicalItem.getMagicalItemType() == MagicalItemType.WEAPON) {
                    addApplicableItemConfigurations(id, magicalItem.getApplicableWeapons(), userId, connection);
                } else if (magicalItem.getMagicalItemType() == MagicalItemType.ARMOR) {
                    addApplicableItemConfigurations(id, magicalItem.getApplicableArmors(), userId, connection);
                } else if (magicalItem.getMagicalItemType() == MagicalItemType.AMMO) {
                    addApplicableItemConfigurations(id, magicalItem.getApplicableAmmos(), userId, connection);
                }
                addAttunementClasses(id, magicalItem.getAttunementClasses(), userId, connection);
                addAttunementAlignments(id, magicalItem.getAttunementAlignments(), userId, connection);
                addAttunementRaces(id, magicalItem.getAttunementRaces(), userId, connection);
                addTables(id, magicalItem.getTables(), connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Item item, long itemId, int userId) throws Exception {
        if (!(item instanceof MagicalItem)) {
            throw new Exception("Invalid item type");
        }
        MagicalItem magicalItem = (MagicalItem) item;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareCall("{call Items_Update_MagicalItem (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(item.getName(), 50));
            statement.setString(4, MySql.getValue(item.getDescription(), 10000));
            statement.setBoolean(5, item.isExpendable());
            statement.setBoolean(6, item.isEquippable());
            MySql.setInteger(7, item.getSlot() == null ? null : item.getSlot().getValue(), statement);
            statement.setBoolean(8, item.isContainer());
            statement.setBoolean(9, item.isIgnoreWeight());
            statement.setInt(10, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(11, item.getCostUnit().getId(), userId, statement);
            statement.setDouble(12, MySql.getValue(item.getWeight(), 0, 999.999));

            statement.setInt(13, magicalItem.getRarity().getValue());
            statement.setBoolean(14, magicalItem.isRequiresAttunement());
            statement.setString(15, MySql.getValue(magicalItem.getCurseEffect(), 1000));
            statement.setInt(16, magicalItem.getMaxCharges());
            statement.setBoolean(17, magicalItem.isRechargeable());
            statement.setInt(18, magicalItem.getRechargeRate().getNumDice());
            statement.setInt(19, magicalItem.getRechargeRate().getDiceSize().getValue());
            statement.setInt(20, magicalItem.getRechargeRate().getMiscModifier());
            statement.setBoolean(21, magicalItem.isChanceOfDestruction());
            statement.setBoolean(22,  false); //isVehicle
            statement.setInt(23, magicalItem.getAttackMod());
            statement.setInt(24, magicalItem.getAcMod());
            statement.setBoolean(25, magicalItem.isAdditionalSpells());
            statement.setBoolean(26, magicalItem.isAdditionalSpellsRemoveOnCasting());
            statement.setInt(27, magicalItem.getAttackType().getValue());
            statement.setBoolean(28, magicalItem.isTemporaryHP());
            MySql.setId(29, magicalItem.getSaveType(), userId, statement);
            statement.setBoolean(30, magicalItem.isHalfOnSave());
            statement.setBoolean(31, magicalItem.isRechargeOnLongRest());
            statement.setInt(32, magicalItem.getSpellAttackCalculationType().getValue());
            statement.setInt(33, magicalItem.getSpellAttackModifier());
            statement.setInt(34, magicalItem.getSpellSaveDC());
            statement.setInt(35, magicalItem.getAttunementType().getValue());

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                deleteSpellConfigurations(itemId, connection);
                addSpellConfigurations(itemId, magicalItem.getSpells(), userId, connection);
                deleteApplicableSpellConfigurations(itemId, connection);
                if (magicalItem.isAdditionalSpells() || magicalItem.getMagicalItemType() == MagicalItemType.SCROLL) {
                    addApplicableSpellConfigurations(itemId, magicalItem.getApplicableSpells(), userId, connection);
                }
                ItemService.updateDamages(itemId, magicalItem.getDamages(), userId, connection);
                deleteApplicableItemConfigurations(itemId, connection);
                if (magicalItem.getMagicalItemType() == MagicalItemType.WEAPON) {
                    addApplicableItemConfigurations(itemId, magicalItem.getApplicableWeapons(), userId, connection);
                } else if (magicalItem.getMagicalItemType() == MagicalItemType.ARMOR) {
                    addApplicableItemConfigurations(itemId, magicalItem.getApplicableArmors(), userId, connection);
                } else if (magicalItem.getMagicalItemType() == MagicalItemType.AMMO) {
                    addApplicableItemConfigurations(itemId, magicalItem.getApplicableAmmos(), userId, connection);
                }
                deleteAttunementClasses(itemId, connection);
                addAttunementClasses(itemId, magicalItem.getAttunementClasses(), userId, connection);
                deleteAttunementAlignments(itemId, connection);
                addAttunementAlignments(itemId, magicalItem.getAttunementAlignments(), userId, connection);
                deleteAttunementRaces(itemId, connection);
                addAttunementRaces(itemId, magicalItem.getAttunementRaces(), userId, connection);
                deleteTables(itemId, connection);
                addTables(itemId, magicalItem.getTables(), connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    private static void deleteSpellConfigurations(long magicalItemId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM `magical_item_spells` WHERE magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addSpellConfigurations(long magicalItemId, List<MagicalItemSpellConfiguration> spells, int userId, Connection connection) throws Exception {
        if (spells.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `magical_item_spells` (`magical_item_id`, `spell_id`, `stored_level`, `charges`, `allow_casting_at_higher_level`, `charges_per_level_above_stored_level`, max_level, remove_on_casting, override_spell_attack_calculation, spell_attack_modifier, spell_save_dc, caster_level_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            for (MagicalItemSpellConfiguration config : spells) {
                statement.setLong(1, magicalItemId);
                MySql.setId(2, config.getSpell().getId(), userId, statement);
                statement.setInt(3, config.getStoredLevel());
                statement.setInt(4, config.getCharges());
                statement.setBoolean(5, config.isAllowCastingAtHigherLevel());
                statement.setInt(6, config.getChargesPerLevelAboveStoredLevel());
                statement.setInt(7, config.getMaxLevel());
                statement.setBoolean(8, config.isRemoveOnCasting());
                statement.setBoolean(9, config.isOverrideSpellAttackCalculation());
                statement.setInt(10, config.getSpellAttackModifier());
                statement.setInt(11, config.getSpellSaveDC());
                MySql.setId(12, config.getCasterLevel() == null ? null : config.getCasterLevel().getId(), userId, statement);
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

    private static void deleteApplicableItemConfigurations(long magicalItemId, Connection connection) throws Exception {
        //todo - this could break if a character is using the item for a specified applicable type
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM `magical_item_applicable_items` WHERE magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addApplicableItemConfigurations(long magicalItemId, List<MagicalItemApplicability> configs, int userId, Connection connection) throws Exception {
        if (configs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO magical_item_applicable_items (magical_item_id, applicability_type_id, item_id, filters) VALUES (?,?,?,?)");
            for (MagicalItemApplicability config : configs) {
                Long itemId = config.getMagicalItemApplicabilityType() == MagicalItemApplicabilityType.ITEM ? MySql.decodeId(config.getItem().getId(), userId) : null;
                //verify that the applicable item id doesn't refer to the magical item (self-referencing loop)
                if (itemId == null || !itemId.equals(magicalItemId)) {
                    statement.setLong(1, magicalItemId);
                    statement.setInt(2, config.getMagicalItemApplicabilityType().getValue());
                    MySql.setLong(3, itemId, statement);
                    statement.setString(4, config.getMagicalItemApplicabilityType() == MagicalItemApplicabilityType.ITEM || config.getFilters() == null ? "" : config.getFilters().getFiltersString(userId));
                    statement.addBatch();
                }
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

    private static void deleteApplicableSpellConfigurations(long magicalItemId, Connection connection) throws Exception {
        //todo - this could break if a character is using the item for a specified applicable type
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM `magical_item_applicable_spells` WHERE magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addApplicableSpellConfigurations(long magicalItemId, List<MagicalItemApplicability> configs, int userId, Connection connection) throws Exception {
        if (configs.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO magical_item_applicable_spells (magical_item_id, applicability_type_id, spell_id, filters) VALUES (?,?,?,?)");
            for (MagicalItemApplicability config : configs) {
                Long spellId = config.getMagicalItemApplicabilityType() == MagicalItemApplicabilityType.SPELL ? MySql.decodeId(config.getSpell().getId(), userId) : null;
                //verify that the applicable item id doesn't refer to the magical item (self-referencing loop)
                if (spellId == null || !spellId.equals(magicalItemId)) {
                    statement.setLong(1, magicalItemId);
                    statement.setInt(2, config.getMagicalItemApplicabilityType().getValue());
                    MySql.setLong(3, spellId, statement);
                    statement.setString(4, config.getMagicalItemApplicabilityType() == MagicalItemApplicabilityType.SPELL || config.getFilters() == null ? "" : config.getFilters().getFiltersString(userId));
                    statement.addBatch();
                }
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

    private static void deleteAttunementClasses(long magicalItemId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM `magical_item_attunement_classes` WHERE magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addAttunementClasses(long magicalItemId, List<ListObject> classes, int userId, Connection connection) throws Exception {
        if (classes.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `magical_item_attunement_classes` (`magical_item_id`, `class_id`) VALUES (?, ?)");
            for (ListObject config : classes) {
                statement.setLong(1, magicalItemId);
                MySql.setId(2, config.getId(), userId, statement);
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

    private static void deleteAttunementAlignments(long magicalItemId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM `magical_item_attunement_alignments` WHERE magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addAttunementAlignments(long magicalItemId, List<ListObject> alignments, int userId, Connection connection) throws Exception {
        if (alignments.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `magical_item_attunement_alignments` (`magical_item_id`, `alignment_id`) VALUES (?, ?)");
            for (ListObject config : alignments) {
                statement.setLong(1, magicalItemId);
                MySql.setId(2, config.getId(), userId, statement);
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

    private static void deleteAttunementRaces(long magicalItemId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM `magical_item_attunement_races` WHERE magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addAttunementRaces(long magicalItemId, List<ListObject> races, int userId, Connection connection) throws Exception {
        if (races.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `magical_item_attunement_races` (`magical_item_id`, `race_id`) VALUES (?, ?)");
            for (ListObject config : races) {
                statement.setLong(1, magicalItemId);
                MySql.setId(2, config.getId(), userId, statement);
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

    private static void deleteTables(long magicalItemId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE mitc FROM magical_item_table_cells mitc JOIN magical_item_tables mit ON mitc.table_id = mit.id WHERE mit.magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();

            statement = connection.prepareStatement("DELETE FROM `magical_item_tables` WHERE magical_item_id = ?");
            statement.setLong(1, magicalItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addTables(long magicalItemId, List<MagicalItemTable> tables, Connection connection) throws Exception {
        if (tables.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO magical_item_tables (magical_item_id, name) VALUES (?,?)", Statement.RETURN_GENERATED_KEYS);

            for (MagicalItemTable magicalItemTable : tables) {
                if (!magicalItemTable.getRows().isEmpty()) {
                    statement.setLong(1, magicalItemId);
                    statement.setString(2, MySql.getValue(magicalItemTable.getName(), 100));
                    statement.executeUpdate(); //this can't be batched because we need the id

                    long id = MySql.getGeneratedLongId(statement);
                    updateTableRows(id, magicalItemTable, connection);
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

    private static void updateTableRows(long tableId, MagicalItemTable magicalItemTable, Connection connection) throws Exception {
        if (magicalItemTable.getRows().isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO magical_item_table_cells (table_id, `row_number`, column_number, value) VALUES (?,?,?,?)");

            // add columns as row 0
            for (int i = 0; i < magicalItemTable.getColumns().size(); i++) {
                String value = magicalItemTable.getColumns().get(i);
                statement.setLong(1, tableId);
                statement.setInt(2, 0);
                statement.setInt(3, i);
                statement.setString(4, MySql.getValue(value, 1000));
                statement.addBatch();
            }

            // add rows
            for (int i = 0; i < magicalItemTable.getRows().size(); i++) {
                MagicalItemTableRow row = magicalItemTable.getRows().get(i);
                for (int j = 0; j < row.getValues().size(); j++) {
                    String value = row.getValues().get(j);
                    statement.setLong(1, tableId);
                    statement.setInt(2, i + 1);
                    statement.setInt(3, j);
                    statement.setString(4, MySql.getValue(value, 100));
                    statement.addBatch();
                }
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
    public long addToMyStuff(Item authorItem, int authorUserId, ListObject existingItem, int userId) throws Exception {
        if (!(authorItem instanceof MagicalItem)) {
            throw new Exception("Invalid item type");
        }
        MagicalItem magicalItem = (MagicalItem)authorItem;

        SharingUtilityService.addDiceCollectionToMyStuff(magicalItem.getRechargeRate(), userId);
        if (magicalItem.getSpells() != null) {
            for (MagicalItemSpellConfiguration config : magicalItem.getSpells()) {
                PowerService.addToMyStuff(config.getSpell(), userId);
                if (CUSTOM_LEVELS) {
                    AttributeService.addToMyStuff(config.getCasterLevel(), userId);
                }
            }
        }
        if (CUSTOM_ABILITIES) {
            AttributeService.addToMyStuff(magicalItem.getSaveType(), userId);
        }
        SharingUtilityService.addDamageConfigurationsToMyStuff(magicalItem.getDamages(), userId);
        SharingUtilityService.addApplicableMagicalItemsToMyStuff(magicalItem.getApplicableWeapons(), userId);
        SharingUtilityService.addApplicableMagicalItemsToMyStuff(magicalItem.getApplicableAmmos(), userId);
        SharingUtilityService.addApplicableMagicalItemsToMyStuff(magicalItem.getApplicableArmors(), userId);
        SharingUtilityService.addApplicableMagicalItemsToMyStuff(magicalItem.getApplicableSpells(), userId);

        if (magicalItem.getAttunementType() == MagicalItemAttunementType.CLASS) {
            CharacteristicService.addToMyStuff(magicalItem.getAttunementClasses(), userId);
        } else {
            magicalItem.setAttunementClasses(new ArrayList<>());
        }

        if (magicalItem.getAttunementType() == MagicalItemAttunementType.RACE) {
            CharacteristicService.addToMyStuff(magicalItem.getAttunementRaces(), userId);
        } else {
            magicalItem.setAttunementRaces(new ArrayList<>());
        }

        if (magicalItem.getAttunementType() == MagicalItemAttunementType.ALIGNMENT) {
            AttributeService.addToMyStuff(magicalItem.getAttunementAlignments(), userId);
        } else {
            magicalItem.setAttunementAlignments(new ArrayList<>());
        }

        long magicalItemId;
        if (magicalItem.getSid() != 0) {
            ItemService.addSystemItem(MySql.decodeId(magicalItem.getId(), authorUserId), userId);
            magicalItemId = MySql.decodeId(magicalItem.getId(), authorUserId);
        } else {
            if (existingItem == null) {
                magicalItemId = create(magicalItem, userId);
            } else {
                magicalItemId = MySql.decodeId(existingItem.getId(), userId);
                update(magicalItem, magicalItemId, userId);
            }
        }

        return magicalItemId;
    }

    @Override
    public void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (!(item instanceof MagicalItem)) {
            throw new Exception("Invalid item type");
        }
        MagicalItem magicalItem = (MagicalItem)item;

        SharingUtilityService.addDiceCollectionToShareList(magicalItem.getRechargeRate(), userId, shareList);
        if (magicalItem.getSpells() != null) {
            for (MagicalItemSpellConfiguration config : magicalItem.getSpells()) {
                PowerService.addToShareList(config.getSpell(), userId, shareList);
                if (CUSTOM_LEVELS) {
                    AttributeService.addToShareList(config.getCasterLevel(), userId, shareList);
                }
            }
        }
        if (CUSTOM_ABILITIES) {
            AttributeService.addToShareList(magicalItem.getSaveType(), userId, shareList);
        }
        SharingUtilityService.addDamageConfigurationsToShareList(magicalItem.getDamages(), userId, shareList);
        SharingUtilityService.addApplicableMagicalItemsToShareList(magicalItem.getApplicableWeapons(), userId, shareList);
        SharingUtilityService.addApplicableMagicalItemsToShareList(magicalItem.getApplicableAmmos(), userId, shareList);
        SharingUtilityService.addApplicableMagicalItemsToShareList(magicalItem.getApplicableArmors(), userId, shareList);
        SharingUtilityService.addApplicableMagicalItemsToShareList(magicalItem.getApplicableSpells(), userId, shareList);
        CharacteristicService.addToShareList(magicalItem.getAttunementClasses(), userId, shareList);
        CharacteristicService.addToShareList(magicalItem.getAttunementRaces(), userId, shareList);
        AttributeService.addToShareList(magicalItem.getAttunementAlignments(), userId, shareList);
        shareList.getItems().add(item.getId());
    }
}
