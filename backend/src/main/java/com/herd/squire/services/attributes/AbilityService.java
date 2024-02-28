package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.models.sorts.SortValue;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.FilterService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class AbilityService implements AttributeDetailsService {

    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getAbility(resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_Abilities (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5,listSource.getValue());
        return statement;
    }

    public static Ability get(long id, int userId) throws Exception {
        if (id == 0) {
            return null;
        }
        Ability ability = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_Ability (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    ability = getAbility(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return ability;
    }

    public static List<Ability> getAbilities(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getAbilities(userId);
    }

    private static List<Ability> getAbilities(int userId) throws Exception {
        List<Ability> abilities = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_GetList_Abilities_Detailed (?,?,?,?)}");
            statement.setInt(1, userId);
            MySql.setString(2, null, statement);
            statement.setLong(3, 0);
            statement.setLong(4, PAGE_SIZE);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    abilities.add(getAbility(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return abilities;
    }

    private static Ability getAbility(ResultSet resultSet, int userId) throws Exception {
        return new Ability(
                MySql.encodeId(resultSet.getLong("attribute_id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getString("abbr")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof Ability)) {
            throw new Exception("Invalid attribute type");
        }
        Ability ability = (Ability) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_Ability (?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 5));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            statement.setString(3, ability.getAbbr());
            statement.setInt(4, userId);
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
        if (!(attribute instanceof Ability)) {
            throw new Exception("Invalid attribute type");
        }
        Ability ability = (Ability) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_Ability (?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 5));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            statement.setString(5, ability.getAbbr());

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
        if (!(authorAttribute instanceof Ability)) {
            throw new Exception("Invalid attribute type");
        }
        Ability ability = (Ability)authorAttribute;

        long abilityId;
        if (ability.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(ability.getId(), authorUserId), userId);
            abilityId = MySql.decodeId(ability.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                abilityId = create(ability, userId);
            } else {
                abilityId = MySql.decodeId(existingAttribute.getId(), userId);
                update(ability, abilityId, userId);
            }
        }

        return abilityId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof Ability)) {
            throw new Exception("Invalid attribute type");
        }
        Ability ability = (Ability)attribute;
        shareList.getAttributes().add(attribute.getId());
    }

    public static int getAbilityModifier(int score) {
        double value = (score - 10) / 2.0;
        return (int) Math.floor(value);
    }
}
