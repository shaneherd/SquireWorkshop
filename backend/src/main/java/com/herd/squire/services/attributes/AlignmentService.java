package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Alignment;
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

public class AlignmentService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getAlignment(resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_Alignments (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    public Alignment get(long id, int userId) throws Exception {
        if (id == 0) {
            return null;
        }
        Alignment alignment = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_Alignment (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    alignment = getAlignment(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return alignment;
    }

    private Alignment getAlignment(ResultSet resultSet, int userId) throws Exception {
        return new Alignment(
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
        if (!(attribute instanceof Alignment)) {
            throw new Exception("Invalid attribute type");
        }
        Alignment alignment = (Alignment) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_Alignment (?, ?, ?)}");
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
        if (!(attribute instanceof Alignment)) {
            throw new Exception("Invalid attribute type");
        }
        Alignment alignment = (Alignment) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_Alignment (?, ?, ?, ?)}");
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
        if (!(authorAttribute instanceof Alignment)) {
            throw new Exception("Invalid attribute type");
        }
        Alignment alignment = (Alignment)authorAttribute;

        long alignmentId;
        if (alignment.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(alignment.getId(), authorUserId), userId);
            alignmentId = MySql.decodeId(alignment.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                alignmentId = create(alignment, userId);
            } else {
                alignmentId = MySql.decodeId(existingAttribute.getId(), userId);
                update(alignment, alignmentId, userId);
            }
        }

        return alignmentId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof Alignment)) {
            throw new Exception("Invalid attribute type");
        }
        Alignment alignment = (Alignment)attribute;
        shareList.getAttributes().add(attribute.getId());
    }
}
