package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Alignment;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.Deity;
import com.herd.squire.models.attributes.DeityCategory;
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

public class DeityService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getDeity(resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_Deities (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    public Deity get(long id, int userId) throws Exception {
        if (id == 0) {
            return null;
        }
        Deity deity = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_Deity (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    deity = getDeity(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return deity;
    }

    private Deity getDeity(ResultSet resultSet, int userId) throws Exception {
        return new Deity(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                getDeityCategory(resultSet, userId),
                getAlignment(resultSet, userId),
                resultSet.getString("symbol")
        );
    }

    private DeityCategory getDeityCategory(ResultSet resultSet, int userId) throws Exception {
        long categoryId = resultSet.getLong("deity_category_id");
        if (categoryId == 0) {
            return null;
        }
        return new DeityCategory(
                MySql.encodeId(categoryId, userId),
                resultSet.getString("category_name"),
                resultSet.getString("category_description"),
                resultSet.getInt("category_sid"),
                resultSet.getBoolean("category_is_author"),
                resultSet.getInt("category_version")
        );
    }

    private Alignment getAlignment(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("alignment_id");
        if (id == 0) {
            return null;
        }
        return new Alignment(
                MySql.encodeId(id, userId),
                resultSet.getString("alignment_name"),
                resultSet.getString("alignment_description"),
                resultSet.getInt("alignment_sid"),
                resultSet.getBoolean("alignment_is_author"),
                resultSet.getInt("alignment_version")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof Deity)) {
            throw new Exception("Invalid attribute type");
        }
        Deity deity = (Deity) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_Deity (?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            MySql.setId(3, deity.getDeityCategory() == null ? null : deity.getDeityCategory().getId(), userId, statement);
            MySql.setId(4, deity.getAlignment() == null ? null : deity.getAlignment().getId(), userId, statement);
            statement.setString(5, MySql.getValue(deity.getSymbol(), 45));
            statement.setInt(6, userId);
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
        if (!(attribute instanceof Deity)) {
            throw new Exception("Invalid attribute type");
        }
        Deity deity = (Deity) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_Deity (?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            MySql.setId(5, deity.getDeityCategory() == null ? null : deity.getDeityCategory().getId(), userId, statement);
            MySql.setId(6, deity.getAlignment() == null ? null : deity.getAlignment().getId(), userId, statement);
            statement.setString(7, MySql.getValue(deity.getSymbol(), 45));
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
        if (!(authorAttribute instanceof Deity)) {
            throw new Exception("Invalid attribute type");
        }
        Deity deity = (Deity)authorAttribute;

        AttributeService.addToMyStuff(deity.getAlignment(), userId);
        AttributeService.addToMyStuff(deity.getDeityCategory(), userId);

        long deityId;
        if (deity.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(deity.getId(), authorUserId), userId);
            deityId = MySql.decodeId(deity.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                deityId = create(deity, userId);
            } else {
                deityId = MySql.decodeId(existingAttribute.getId(), userId);
                update(deity, deityId, userId);
            }
        }

        return deityId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof Deity)) {
            throw new Exception("Invalid attribute type");
        }
        Deity deity = (Deity)attribute;
        AttributeService.addToShareList(deity.getAlignment(), userId, shareList);
        AttributeService.addToShareList(deity.getDeityCategory(), userId, shareList);
        shareList.getAttributes().add(attribute.getId());
    }
}
