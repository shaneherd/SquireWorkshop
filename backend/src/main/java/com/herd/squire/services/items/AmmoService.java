package com.herd.squire.services.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.Ammo;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class AmmoService implements ItemDetailsService {
    @Override
    public Item get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getAmmo(statement, resultSet, userId);
    }

    public Ammo get(long id, int userId) throws Exception {
        Ammo ammo = null;
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_Ammo (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    ammo = getAmmo(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return ammo;
    }

    @Override
    public CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);

        CallableStatement statement = connection.prepareCall("{call Items_GetList_Ammos (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    private Ammo getAmmo(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("id");
        Ammo ammo = new Ammo(
                MySql.encodeId(id, userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getInt("cost"),
                ItemService.getCostUnit(resultSet, userId),
                resultSet.getDouble("weight"),
                resultSet.getInt("attack_modifier"),
                getAbility(resultSet, userId)
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            ammo.setDamages(ItemService.getDamageConfigurations(resultSet, userId));
        }

        return ammo;
    }

    private Ability getAbility(ResultSet resultSet, int userId) throws Exception {
        long abilityId = resultSet.getLong("attack_ability_modifier_id");
        if (abilityId == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(abilityId, userId),
                resultSet.getString("attack_ability_name"),
                resultSet.getString("attack_ability_description"),
                resultSet.getInt("attack_ability_sid"),
                resultSet.getBoolean("attack_ability_is_author"),
                resultSet.getInt("attack_ability_version"),
                resultSet.getString("abbr")
        );
    }

    @Override
    public CallableStatement getSubItemListObjectStatement(Connection connection, String subTypeId, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        throw new Exception("not implemented");
    }

    @Override
    public long create(Item item, int userId) throws Exception {
        if (!(item instanceof Ammo)) {
            throw new Exception("Invalid item type");
        }
        Ammo ammo = (Ammo) item;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Items_Create_Ammo (?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(item.getName(), 45));
            statement.setString(2, MySql.getValue(item.getDescription(), 1000));
            statement.setInt(3, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(4, item.getCostUnit() == null ? null : item.getCostUnit().getId(), userId, statement);
            statement.setDouble(5, MySql.getValue(item.getWeight(), 0, 999));
            statement.setInt(6, MySql.getValue(ammo.getAttackModifier(), 0, 99));
            MySql.setId(7, ammo.getAttackAbilityModifier() == null ? null : ammo.getAttackAbilityModifier().getId(), userId, statement);
            statement.setInt(8, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getInt("item_id");
                }
            }

            if (id != -1) {
                ItemService.updateDamages(id, ammo.getDamages(), userId, connection);
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
        if (!(item instanceof Ammo)) {
            throw new Exception("Invalid item type");
        }
        Ammo ammo = (Ammo) item;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Items_Update_Ammo (?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(item.getName(), 45));
            statement.setString(4, MySql.getValue(item.getDescription(), 1000));
            statement.setInt(5, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(6, item.getCostUnit().getId(), userId, statement);
            statement.setDouble(7, MySql.getValue(item.getWeight(), 0, 999.999));
            statement.setInt(8, MySql.getValue(ammo.getAttackModifier(), 0, 99));
            MySql.setId(9, ammo.getAttackAbilityModifier() == null ? null : ammo.getAttackAbilityModifier().getId(), userId, statement);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                ItemService.updateDamages(itemId, ammo.getDamages(), userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    @Override
    public long addToMyStuff(Item authorItem, int authorUserId, ListObject existingItem, int userId) throws Exception {
        if (!(authorItem instanceof Ammo)) {
            throw new Exception("Invalid item type");
        }
        Ammo ammo = (Ammo)authorItem;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToMyStuff(ammo.getAttackAbilityModifier(), userId);
        }
        SharingUtilityService.addDamageConfigurationsToMyStuff(ammo.getDamages(), userId);

        long ammoId;
        if (ammo.getSid() != 0) {
            ItemService.addSystemItem(MySql.decodeId(ammo.getId(), authorUserId), userId);
            ammoId = MySql.decodeId(ammo.getId(), authorUserId);
        } else {
            if (existingItem == null) {
                ammoId = create(ammo, userId);
            } else {
                ammoId = MySql.decodeId(existingItem.getId(), userId);
                update(ammo, ammoId, userId);
            }
        }

        return ammoId;
    }

    @Override
    public void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (!(item instanceof Ammo)) {
            throw new Exception("Invalid item type");
        }
        Ammo ammo = (Ammo)item;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToShareList(ammo.getAttackAbilityModifier(), userId, shareList);
        }
        SharingUtilityService.addDamageConfigurationsToShareList(ammo.getDamages(), userId, shareList);
        shareList.getItems().add(item.getId());
    }
}
