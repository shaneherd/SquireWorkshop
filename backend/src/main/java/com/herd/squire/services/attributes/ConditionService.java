package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.Condition;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.models.sorts.SortValue;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SortService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class ConditionService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getCondition(statement, resultSet, userId);
    }

    public Attribute get(long id, int userId) throws Exception {
        Condition condition = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_Condition (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    condition = getCondition(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return condition;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        SortValue sortValue = SortService.getSortValue(sorts);
        boolean sortAscending = true;
        if (sortValue != null) {
            sortAscending = sortValue.isAscending();
        }

        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_Conditions (?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setBoolean(5, sortAscending);
        statement.setInt(6, listSource.getValue());
        return statement;
    }

    public static List<Condition> getConditions(HttpHeaders headers, ListSource listSource) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getConditions(userId, listSource);
    }

    public static List<Condition> getConditions(int userId, ListSource listSource) throws Exception {
        Map<Long, Condition> map = new HashMap<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_GetList_Conditions_Detailed (?,?,?,?,?)}");
            statement.setInt(1, userId);
            MySql.setString(2, null, statement);
            statement.setLong(3, 0);
            statement.setLong(4, PAGE_SIZE);
            statement.setInt(5, listSource.getValue());
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    long id = resultSet.getLong("id");
                    Condition condition = new Condition(
                            MySql.encodeId(id, userId),
                            resultSet.getString("name"),
                            resultSet.getString("description"),
                            resultSet.getInt("sid"),
                            resultSet.getBoolean("is_author"),
                            resultSet.getInt("version")
                    );
                    map.put(id, condition);
                }
            }

            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    long parentId = resultSet.getLong("parent_id");
                    long id = resultSet.getLong("id");
                    ListObject connectingCondition = new ListObject(
                            MySql.encodeId(id, userId),
                            resultSet.getString("name"),
                            resultSet.getInt("sid"),
                            resultSet.getBoolean("is_author")
                    );
                    Condition condition = map.get(parentId);
                    if (condition != null) {
                        condition.getConnectingConditions().add(connectingCondition);
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return new ArrayList<>(map.values());
    }

    private static Condition getCondition(Statement statement, ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("id");
        Condition condition = new Condition(
                MySql.encodeId(id, userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version")
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            condition.setConnectingConditions(getConnectingConditions(resultSet, userId));
        }

        return condition;
    }

    private static List<ListObject> getConnectingConditions(ResultSet resultSet, int userId) throws Exception {
        List<ListObject> connectingConditions = new ArrayList<>();
        while (resultSet.next()) {
            connectingConditions.add(MySql.getListObject(resultSet, userId));
        }
        return connectingConditions;
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof Condition)) {
            throw new Exception("Invalid attribute type");
        }
        Condition condition = (Condition) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Attributes_Create_Condition (?, ?, ?)}");
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

            if (id != -1) {
                updateConnectingConditions(id, condition, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Attribute attribute, long id, int userId) throws Exception {
        if (!(attribute instanceof Condition)) {
            throw new Exception("Invalid attribute type");
        }
        Condition condition = (Condition) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Attributes_Update_Condition (?, ?, ?, ?)}");
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

            if (success) {
                updateConnectingConditions(id, condition, userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    private void updateConnectingConditions(long id, Condition condition, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            List<ListObject> conditionImmunities = condition.getConnectingConditions();
            statement = connection.prepareStatement("DELETE FROM connecting_conditions WHERE parent_condition_id = ?");
            statement.setLong(1, id);
            statement.executeUpdate();

            if (!conditionImmunities.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `connecting_conditions` (`parent_condition_id`, `child_condition_id`) VALUES (?, ?)");

                for (ListObject conditionImmunity : conditionImmunities) {
                    statement.setLong(1, id);
                    MySql.setId(2, conditionImmunity.getId(), userId, statement);
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

    @Override
    public long addToMyStuff(Attribute authorAttribute, int authorUserId, ListObject existingAttribute, int userId) throws Exception {
        if (!(authorAttribute instanceof Condition)) {
            throw new Exception("Invalid attribute type");
        }
        Condition condition = (Condition)authorAttribute;

        long conditionId;

        if (condition.getConnectingConditions() != null) {
            for (ListObject connectingCondition : condition.getConnectingConditions()) {
                AttributeService.addToMyStuff(connectingCondition, userId);
            }
        }

        if (condition.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(condition.getId(), authorUserId), userId);
            conditionId = MySql.decodeId(condition.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                conditionId = create(condition, userId);
            } else {
                conditionId = MySql.decodeId(existingAttribute.getId(), userId);
                update(condition, conditionId, userId);
            }
        }

        return conditionId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof Condition)) {
            throw new Exception("Invalid attribute type");
        }
        Condition condition = (Condition)attribute;

        if (condition.getConnectingConditions() != null) {
            for (ListObject connectingCondition : condition.getConnectingConditions()) {
                AttributeService.addToShareList(connectingCondition, userId, shareList);
            }
        }
        shareList.getAttributes().add(attribute.getId());
    }
}
