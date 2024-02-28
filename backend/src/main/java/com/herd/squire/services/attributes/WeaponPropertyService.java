package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.WeaponProperty;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.models.sorts.SortValue;
import com.herd.squire.services.FilterService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class WeaponPropertyService implements AttributeDetailsService {

    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getWeaponProperty(resultSet, userId);
    }

    public Attribute get(long id, int userId) throws Exception {
        WeaponProperty weaponProperty = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_WeaponProperty (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    weaponProperty = getWeaponProperty(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return weaponProperty;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_WeaponProperties (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    private WeaponProperty getWeaponProperty(ResultSet resultSet, int userId) throws Exception {
        return new WeaponProperty(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof WeaponProperty)) {
            throw new Exception("Invalid attribute type");
        }
        WeaponProperty weaponProperty = (WeaponProperty) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_WeaponProperty (?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("attribute_id");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Attribute attribute, long id, int userId) throws Exception {
        if (!(attribute instanceof WeaponProperty)) {
            throw new Exception("Invalid attribute type");
        }
        WeaponProperty weaponProperty = (WeaponProperty) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_WeaponProperty (?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
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
    public long addToMyStuff(Attribute authorAttribute, int authorUserId, ListObject existingAttribute, int userId) throws Exception {
        if (!(authorAttribute instanceof WeaponProperty)) {
            throw new Exception("Invalid attribute type");
        }
        WeaponProperty weaponProperty = (WeaponProperty)authorAttribute;

        long weaponPropertyId;
        if (weaponProperty.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(weaponProperty.getId(), authorUserId), userId);
            weaponPropertyId = MySql.decodeId(weaponProperty.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                weaponPropertyId = create(weaponProperty, userId);
            } else {
                weaponPropertyId = MySql.decodeId(existingAttribute.getId(), userId);
                update(weaponProperty, weaponPropertyId, userId);
            }
        }

        return weaponPropertyId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof WeaponProperty)) {
            throw new Exception("Invalid attribute type");
        }
        WeaponProperty weaponProperty = (WeaponProperty)attribute;
        shareList.getAttributes().add(attribute.getId());
    }
}
