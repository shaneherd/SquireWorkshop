package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.TimeUnit;
import com.herd.squire.models.attributes.ArmorType;
import com.herd.squire.models.attributes.Attribute;
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

public class ArmorTypeService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getArmorType(resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_ArmorTypes (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    public static ArmorType getArmorType(long id, int userId) throws Exception {
        ArmorType armorType = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_ArmorType (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    armorType = getArmorType(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return armorType;
    }

    private static ArmorType getArmorType(ResultSet resultSet, int userId) throws Exception {
        return new ArmorType(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getInt("don"),
                TimeUnit.valueOf(resultSet.getString("don_time_unit")),
                resultSet.getInt("doff"),
                TimeUnit.valueOf(resultSet.getString("doff_time_unit"))
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof ArmorType)) {
            throw new Exception("Invalid attribute type");
        }
        ArmorType armorType = (ArmorType) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_ArmorType (?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            statement.setInt(3, MySql.getValue(armorType.getDon(), 1, 99));
            statement.setString(4, armorType.getDonTimeUnit().toString());
            statement.setInt(5, MySql.getValue(armorType.getDoff(), 1, 99));
            statement.setString(6, armorType.getDoffTimeUnit().toString());
            statement.setInt(7, userId);
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
        if (!(attribute instanceof ArmorType)) {
            throw new Exception("Invalid attribute type");
        }
        ArmorType armorType = (ArmorType) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_ArmorType (?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            statement.setInt(5, MySql.getValue(armorType.getDon(), 1, 99));
            statement.setString(6, armorType.getDonTimeUnit().toString());
            statement.setInt(7, MySql.getValue(armorType.getDoff(), 1, 99));
            statement.setString(8, armorType.getDoffTimeUnit().toString());
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
        if (!(authorAttribute instanceof ArmorType)) {
            throw new Exception("Invalid attribute type");
        }
        ArmorType armorType = (ArmorType)authorAttribute;

        long armorTypeId;
        if (armorType.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(armorType.getId(), authorUserId), userId);
            armorTypeId = MySql.decodeId(armorType.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                armorTypeId = create(armorType, userId);
            } else {
                armorTypeId = MySql.decodeId(existingAttribute.getId(), userId);
                update(armorType, armorTypeId, userId);
            }
        }

        return armorTypeId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof ArmorType)) {
            throw new Exception("Invalid attribute type");
        }
        ArmorType armorType = (ArmorType)attribute;
        shareList.getAttributes().add(attribute.getId());
    }
}
