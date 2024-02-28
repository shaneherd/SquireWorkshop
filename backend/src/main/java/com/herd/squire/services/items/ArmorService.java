package com.herd.squire.services.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.TimeUnit;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.ArmorType;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.Armor;
import com.herd.squire.models.items.EquipmentSlotType;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class ArmorService implements ItemDetailsService {
    @Override
    public Armor get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getArmor(resultSet, userId);
    }

    public Armor get(long id, int userId) throws Exception {
        Armor armor = null;
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_Armor (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    armor = getArmor(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return armor;
    }

    @Override
    public CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
        String armorTypeId = ItemService.getFilterValue(filterValues, FilterKey.ARMOR_CATEGORY);
        if (armorTypeId == null || armorTypeId.equals(FilterValue.DEFAULT_OPTION)) {
            armorTypeId = null;
        }
        Boolean isContainer = FilterService.getFilterBoolean(filterValues, FilterKey.CONTAINER);

        CallableStatement statement = connection.prepareCall("{call Items_GetList_Armors (?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        statement.setString(2, search);
        MySql.setId(3, armorTypeId, userId, statement);
        MySql.setBoolean(4, isContainer, statement);
        statement.setLong(5, offset);
        statement.setLong(6, PAGE_SIZE);
        statement.setInt(7, listSource.getValue());
        return statement;
    }

    @Override
    public CallableStatement getSubItemListObjectStatement(Connection connection, String subTypeId, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        if (filterValues == null) {
            filterValues = new ArrayList<>();
        }
        filterValues.add(new FilterValue(FilterKey.ARMOR_CATEGORY, subTypeId));
        return getItemListObjectStatement(connection, filterValues, offset, userId, listSource);
    }

    private Armor getArmor(ResultSet resultSet, int userId) throws Exception {
        return new Armor(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getBoolean("expendable"),
                EquipmentSlotType.valueOf(resultSet.getInt("slot")),
                resultSet.getBoolean("container"),
                resultSet.getBoolean("ignore_weight"),
                resultSet.getInt("cost"),
                ItemService.getCostUnit(resultSet, userId),
                resultSet.getDouble("weight"),
                getArmorType(resultSet, userId),
                resultSet.getInt("ac"),
                getAbility(resultSet, userId),
                resultSet.getInt("max_ability_modifier"),
                resultSet.getInt("min_strength"),
                resultSet.getBoolean("stealth_disadvantage")
        );
    }

    private ArmorType getArmorType(ResultSet resultSet, int userId) throws Exception {
        return new ArmorType(
                MySql.encodeId(resultSet.getLong("armor_type_id"), userId),
                resultSet.getString("armor_type_name"),
                resultSet.getString("armor_type_description"),
                resultSet.getInt("armor_type_sid"),
                resultSet.getBoolean("armor_type_is_author"),
                resultSet.getInt("armor_type_version"),
                resultSet.getInt("don"),
                TimeUnit.valueOf(resultSet.getString("don_time_unit")),
                resultSet.getInt("doff"),
                TimeUnit.valueOf(resultSet.getString("doff_time_unit"))
        );
    }

    private Ability getAbility(ResultSet resultSet, int userId) throws Exception {
        long abilityId = resultSet.getLong("ability_modifier_id");
        if (abilityId == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(abilityId, userId),
                resultSet.getString("ability_name"),
                resultSet.getString("ability_description"),
                resultSet.getInt("ability_sid"),
                resultSet.getBoolean("ability_is_author"),
                resultSet.getInt("ability_version"),
                resultSet.getString("abbr")
        );
    }

    @Override
    public long create(Item item, int userId) throws Exception {
        if (!(item instanceof Armor)) {
            throw new Exception("Invalid item type");
        }
        Armor armor = (Armor) item;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Create_Armor (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(item.getName(), 45));
            statement.setString(2, MySql.getValue(item.getDescription(), 1000));
            statement.setBoolean(3, item.isExpendable());
            MySql.setInteger(4, item.getSlot() == null ? null : item.getSlot().getValue(), statement);
            statement.setBoolean(5, item.isContainer());
            statement.setBoolean(6, item.isIgnoreWeight());
            statement.setInt(7, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(8, item.getCostUnit() == null ? null : item.getCostUnit().getId(), userId, statement);
            statement.setDouble(9, MySql.getValue(item.getWeight(), 0, 999));

            MySql.setId(10, armor.getArmorType().getId(), userId, statement);
            statement.setInt(11, MySql.getValue(armor.getAc(), 0, 99));
            MySql.setId(12, armor.getAbilityModifier() == null ? null : armor.getAbilityModifier().getId(), userId, statement);
            statement.setInt(13, MySql.getValue(armor.getMaxAbilityModifier(), 0, 99));
            statement.setInt(14, MySql.getValue(armor.getMinStrength(), 0, 99));
            statement.setBoolean(15, armor.isStealthDisadvantage());

            statement.setInt(16, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("item_id");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Item item, long itemId, int userId) throws Exception {
        if (!(item instanceof Armor)) {
            throw new Exception("Invalid item type");
        }
        Armor armor = (Armor) item;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Update_Armor (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(item.getName(), 45));
            statement.setString(4, MySql.getValue(item.getDescription(), 1000));
            statement.setBoolean(5, item.isExpendable());
            MySql.setInteger(6, item.getSlot() == null ? null : item.getSlot().getValue(), statement);
            statement.setBoolean(7, item.isContainer());
            statement.setBoolean(8, item.isIgnoreWeight());
            statement.setInt(9, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(10, item.getCostUnit().getId(), userId, statement);
            statement.setDouble(11, MySql.getValue(item.getWeight(), 0, 999.999));

            MySql.setId(12, armor.getArmorType().getId(), userId, statement);
            statement.setInt(13, MySql.getValue(armor.getAc(), 0, 99));
            MySql.setId(14, armor.getAbilityModifier() == null ? null : armor.getAbilityModifier().getId(), userId, statement);
            statement.setInt(15, MySql.getValue(armor.getMaxAbilityModifier(), 0, 99));
            statement.setInt(16, MySql.getValue(armor.getMinStrength(), 0, 99));
            statement.setBoolean(17, armor.isStealthDisadvantage());

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    @Override
    public long addToMyStuff(Item authorItem, int authorUserId, ListObject existingItem, int userId) throws Exception {
        if (!(authorItem instanceof Armor)) {
            throw new Exception("Invalid item type");
        }
        Armor armor = (Armor)authorItem;

        AttributeService.addToMyStuff(armor.getArmorType(), userId);
        if (CUSTOM_ABILITIES) {
            AttributeService.addToMyStuff(armor.getAbilityModifier(), userId);
        }

        long armorId;
        if (armor.getSid() != 0) {
            ItemService.addSystemItem(MySql.decodeId(armor.getId(), authorUserId), userId);
            armorId = MySql.decodeId(armor.getId(), authorUserId);
        } else {
            if (existingItem == null) {
                armorId = create(armor, userId);
            } else {
                armorId = MySql.decodeId(existingItem.getId(), userId);
                update(armor, armorId, userId);
            }
        }

        return armorId;
    }

    @Override
    public void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (!(item instanceof Armor)) {
            throw new Exception("Invalid item type");
        }
        Armor armor = (Armor)item;

        AttributeService.addToShareList(armor.getArmorType(), userId, shareList);
        if (CUSTOM_ABILITIES) {
            AttributeService.addToShareList(armor.getAbilityModifier(), userId, shareList);
        }
        shareList.getItems().add(item.getId());
    }
}
