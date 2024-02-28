package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.AreaOfEffect;
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

public class AreaOfEffectService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getAreaOfEffect(resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_AreaOfEffects (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    public AreaOfEffect get(long id, int userId) throws Exception {
        if (id == 0) {
            return null;
        }
        AreaOfEffect areaOfEffect = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_AreaOfEffect (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    areaOfEffect = getAreaOfEffect(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return areaOfEffect;
    }
    
    private AreaOfEffect getAreaOfEffect(ResultSet resultSet, int userId) throws Exception {
        return new AreaOfEffect(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getBoolean("radius"),
                resultSet.getBoolean("width"),
                resultSet.getBoolean("height"),
                resultSet.getBoolean("length")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof AreaOfEffect)) {
            throw new Exception("Invalid attribute type");
        }
        AreaOfEffect areaOfEffect = (AreaOfEffect) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_AreaOfEffect (?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            statement.setBoolean(3, areaOfEffect.isRadius());
            statement.setBoolean(4, areaOfEffect.isWidth());
            statement.setBoolean(5, areaOfEffect.isHeight());
            statement.setBoolean(6, areaOfEffect.isLength());
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
        if (!(attribute instanceof AreaOfEffect)) {
            throw new Exception("Invalid attribute type");
        }
        AreaOfEffect areaOfEffect = (AreaOfEffect) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_AreaOfEffect (?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            statement.setBoolean(5, areaOfEffect.isRadius());
            statement.setBoolean(6, areaOfEffect.isWidth());
            statement.setBoolean(7, areaOfEffect.isHeight());
            statement.setBoolean(8, areaOfEffect.isLength());
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
        if (!(authorAttribute instanceof AreaOfEffect)) {
            throw new Exception("Invalid attribute type");
        }
        AreaOfEffect areaOfEffect = (AreaOfEffect)authorAttribute;

        long areaOfEffectId;
        if (areaOfEffect.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(areaOfEffect.getId(), authorUserId), userId);
            areaOfEffectId = MySql.decodeId(areaOfEffect.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                areaOfEffectId = create(areaOfEffect, userId);
            } else {
                areaOfEffectId = MySql.decodeId(existingAttribute.getId(), userId);
                update(areaOfEffect, areaOfEffectId, userId);
            }
        }

        return areaOfEffectId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof AreaOfEffect)) {
            throw new Exception("Invalid attribute type");
        }
        AreaOfEffect areaOfEffect = (AreaOfEffect)attribute;
        shareList.getAttributes().add(attribute.getId());
    }
}
