package com.herd.squire.services.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.WeaponProperty;
import com.herd.squire.models.attributes.WeaponType;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.weapon.Weapon;
import com.herd.squire.models.items.weapon.WeaponRangeType;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class WeaponService implements ItemDetailsService {
    @Override
    public Weapon get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getWeapon(statement, resultSet, userId);
    }

    public Weapon get(long id, int userId) throws Exception {
        Weapon weapon = null;
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_Weapon (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    weapon = getWeapon(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return weapon;
    }

    @Override
    public CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
        String weaponDifficulty = ItemService.getFilterValue(filterValues, FilterKey.WEAPON_DIFFICULTY);
        String weaponCategory = ItemService.getFilterValue(filterValues, FilterKey.WEAPON_CATEGORY);
        if (weaponDifficulty == null || weaponDifficulty.equals(FilterValue.DEFAULT_OPTION)) {
            weaponDifficulty = null;
        }
        Integer weaponRangeType = null;
        if (weaponCategory != null && !weaponCategory.equals(FilterValue.DEFAULT_OPTION)) {
            weaponRangeType = WeaponRangeType.valueOf(weaponCategory).getValue();
        }

        CallableStatement statement = connection.prepareCall("{call Items_GetList_Weapons (?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        statement.setString(2, search);
        MySql.setId(3, weaponDifficulty, userId, statement);
        MySql.setInteger(4, weaponRangeType, statement);
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
        filterValues.add(new FilterValue(FilterKey.WEAPON_DIFFICULTY, subTypeId));
        return getItemListObjectStatement(connection, filterValues, offset, userId, listSource);
    }

    private Weapon getWeapon(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Weapon weapon = new Weapon(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getBoolean("expendable"),
                resultSet.getBoolean("container"),
                resultSet.getBoolean("ignore_weight"),
                resultSet.getInt("cost"),
                ItemService.getCostUnit(resultSet, userId),
                resultSet.getDouble("weight"),
                getWeaponType(resultSet, userId),
                WeaponRangeType.valueOf(resultSet.getInt("weapon_range_type")),
                resultSet.getInt("normal_range"),
                resultSet.getInt("long_range"),
                resultSet.getInt("attack_mod"),
                getAmmo(resultSet, userId)
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            weapon.setProperties(getProperties(resultSet, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            weapon.setDamages(ItemService.getDamageConfigurations(resultSet, userId));
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            weapon.setVersatileDamages(ItemService.getDamageConfigurations(resultSet, userId));
        }

        return weapon;
    }

    private ListObject getAmmo(ResultSet resultSet, int userId) throws Exception {
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

    private static WeaponType getWeaponType(ResultSet resultSet, int userId) throws Exception {
        return new WeaponType(
                MySql.encodeId(resultSet.getLong("weapon_type_id"), userId),
                resultSet.getString("weapon_type_name"),
                resultSet.getString("weapon_type_description"),
                resultSet.getInt("weapon_type_sid"),
                resultSet.getBoolean("weapon_type_is_author"),
                resultSet.getInt("weapon_type_version")
        );
    }

    @Override
    public long create(Item item, int userId) throws Exception {
        if (!(item instanceof Weapon)) {
            throw new Exception("Invalid item type");
        }
        Weapon weapon = (Weapon) item;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Items_Create_Weapon (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(item.getName(), 45));
            statement.setString(2, MySql.getValue(item.getDescription(), 1000));
            statement.setBoolean(3, item.isExpendable());
            statement.setBoolean(4, item.isContainer());
            statement.setBoolean(5, item.isIgnoreWeight());
            statement.setInt(6, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(7, item.getCostUnit() == null ? null : item.getCostUnit().getId(), userId, statement);
            statement.setDouble(8, MySql.getValue(item.getWeight(), 0, 999));

            MySql.setId(9, weapon.getWeaponType().getId(), userId, statement);
            statement.setInt(10, weapon.getRangeType().getValue());
            statement.setInt(11, MySql.getValue(weapon.getNormalRange(), 0, 9999));
            statement.setInt(12, MySql.getValue(weapon.getLongRange(), 0, 9999));
            statement.setInt(13, MySql.getValue(weapon.getAttackMod(), 0, 99));
            MySql.setId(14, weapon.getAmmoType() == null ? null : weapon.getAmmoType().getId(), userId, statement);

            statement.setInt(15, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("item_id");
                }
            }

            if (id != -1) {
                updateWeaponProperties(id, weapon, userId, connection);
                ItemService.updateDamages(id, getAllDamages(weapon), userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    private List<DamageConfiguration> getAllDamages(Weapon weapon) {
        List<DamageConfiguration> damages = new ArrayList<>();
        damages.addAll(weapon.getDamages());
        damages.addAll(weapon.getVersatileDamages());
        return damages;
    }

    @Override
    public boolean update(Item item, long itemId, int userId) throws Exception {
        if (!(item instanceof Weapon)) {
            throw new Exception("Invalid item type");
        }
        Weapon weapon = (Weapon) item;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Items_Update_Weapon (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(item.getName(), 45));
            statement.setString(4, MySql.getValue(item.getDescription(), 1000));
            statement.setBoolean(5, item.isExpendable());
            statement.setBoolean(6, item.isContainer());
            statement.setBoolean(7, item.isIgnoreWeight());
            statement.setInt(8, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(9, item.getCostUnit().getId(), userId, statement);
            statement.setDouble(10, MySql.getValue(item.getWeight(), 0, 999.999));

            MySql.setId(11, weapon.getWeaponType().getId(), userId, statement);
            statement.setInt(12, weapon.getRangeType().getValue());
            statement.setInt(13, MySql.getValue(weapon.getNormalRange(), 0, 9999));
            statement.setInt(14, MySql.getValue(weapon.getLongRange(), 0, 9999));
            statement.setInt(15, MySql.getValue(weapon.getAttackMod(), 0, 99));
            MySql.setId(16, weapon.getAmmoType() == null ? null : weapon.getAmmoType().getId(), userId, statement);

            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateWeaponProperties(itemId, weapon, userId, connection);
                ItemService.updateDamages(itemId, getAllDamages(weapon), userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    /******************************** Weapon Properties *********************************/


    private static void updateWeaponProperties(long weaponId, Weapon weapon, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            List<WeaponProperty> properties = weapon.getProperties();
            statement = connection.prepareStatement("DELETE FROM weapon_weapon_properties WHERE weapon_id = ?");
            statement.setLong(1, weaponId);
            statement.executeUpdate();

            if (!properties.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `weapon_weapon_properties` (`weapon_id`, `weapon_property_id`) VALUES (?,?)");

                for (WeaponProperty property : properties) {
                    statement.setLong(1, weaponId);
                    MySql.setId(2, property.getId(), userId, statement);
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

    private static List<WeaponProperty> getProperties(ResultSet resultSet, int userId) throws Exception {
        List<WeaponProperty> properties = new ArrayList<>();
        while (resultSet.next()) {
            properties.add(getWeaponProperty(resultSet, userId));
        }
        return properties;
    }

    private static WeaponProperty getWeaponProperty(ResultSet resultSet, int userId) throws Exception {
        return new WeaponProperty(
                MySql.encodeId(resultSet.getLong("weapon_property_id"), userId),
                resultSet.getString("weapon_property_name"),
                resultSet.getString("weapon_property_description"),
                resultSet.getInt("weapon_property_sid"),
                resultSet.getBoolean("weapon_property_is_author"),
                resultSet.getInt("weapon_property_version")
        );
    }

    @Override
    public long addToMyStuff(Item authorItem, int authorUserId, ListObject existingItem, int userId) throws Exception {
        if (!(authorItem instanceof Weapon)) {
            throw new Exception("Invalid item type");
        }
        Weapon weapon = (Weapon)authorItem;

        AttributeService.addToMyStuff(weapon.getWeaponType(), userId);
        ItemService.addToMyStuff(weapon.getAmmoType(), userId);

        if (weapon.getProperties() != null) {
            for (WeaponProperty weaponProperty : weapon.getProperties()) {
                AttributeService.addToMyStuff(weaponProperty, userId);
            }
        }
        SharingUtilityService.addDamageConfigurationsToMyStuff(weapon.getDamages(), userId);
        SharingUtilityService.addDamageConfigurationsToMyStuff(weapon.getVersatileDamages(), userId);

        long weaponId;
        if (weapon.getSid() != 0) {
            ItemService.addSystemItem(MySql.decodeId(weapon.getId(), authorUserId), userId);
            weaponId = MySql.decodeId(weapon.getId(), authorUserId);
        } else {
            if (existingItem == null) {
                weaponId = create(weapon, userId);
            } else {
                weaponId = MySql.decodeId(existingItem.getId(), userId);
                update(weapon, weaponId, userId);
            }
        }

        return weaponId;
    }

    @Override
    public void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (!(item instanceof Weapon)) {
            throw new Exception("Invalid item type");
        }
        Weapon weapon = (Weapon)item;

        AttributeService.addToShareList(weapon.getWeaponType(), userId, shareList);
        ItemService.addToShareList(weapon.getAmmoType(), userId, shareList);

        if (weapon.getProperties() != null) {
            for (WeaponProperty weaponProperty : weapon.getProperties()) {
                AttributeService.addToShareList(weaponProperty, userId, shareList);
            }
        }
        SharingUtilityService.addDamageConfigurationsToShareList(weapon.getDamages(), userId, shareList);
        SharingUtilityService.addDamageConfigurationsToShareList(weapon.getVersatileDamages(), userId, shareList);
        shareList.getItems().add(item.getId());
    }
}
