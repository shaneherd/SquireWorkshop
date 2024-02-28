package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.CharacterLevel;
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

public class CharacterLevelService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getCharacterLevel(resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_CharacterLevels (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    public static CharacterLevel get(long id, int userId) throws Exception {
        CharacterLevel characterLevel = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_CharacterLevel (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    characterLevel = getCharacterLevel(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return characterLevel;
    }

    public static List<CharacterLevel> getLevels(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getLevels(userId);
    }

    public static List<CharacterLevel> getLevels(int userId) throws Exception {
        List<CharacterLevel> levels = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_GetList_CharacterLevels_Detailed (?,?,?,?)}");
            statement.setInt(1, userId);
            MySql.setString(2, null, statement);
            statement.setLong(3, 0);
            statement.setLong(4, PAGE_SIZE);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                while (resultSet.next()) {
                    levels.add(getCharacterLevel(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return levels;
    }

    private static CharacterLevel getCharacterLevel(ResultSet resultSet, int userId) throws Exception {
        return new CharacterLevel(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getInt("min_exp"),
                resultSet.getInt("prof_bonus")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof CharacterLevel)) {
            throw new Exception("Invalid attribute type");
        }
        CharacterLevel characterLevel = (CharacterLevel) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_CharacterLevel (?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            statement.setInt(3, MySql.getValue(characterLevel.getMinExp(), 0, 999999));
            statement.setInt(4, MySql.getValue(characterLevel.getProfBonus(), 0, 99));
            statement.setInt(5, userId);
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
        if (!(attribute instanceof CharacterLevel)) {
            throw new Exception("Invalid attribute type");
        }
        CharacterLevel characterLevel = (CharacterLevel) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_CharacterLevel (?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            statement.setInt(5, MySql.getValue(characterLevel.getMinExp(), 0, 999999));
            statement.setInt(6, MySql.getValue(characterLevel.getProfBonus(), 0, 99));
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
        if (!(authorAttribute instanceof CharacterLevel)) {
            throw new Exception("Invalid attribute type");
        }
        CharacterLevel characterLevel = (CharacterLevel)authorAttribute;

        long characterLevelId;
        if (characterLevel.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(characterLevel.getId(), authorUserId), userId);
            characterLevelId = MySql.decodeId(characterLevel.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                characterLevelId = create(characterLevel, userId);
            } else {
                characterLevelId = MySql.decodeId(existingAttribute.getId(), userId);
                update(characterLevel, characterLevelId, userId);
            }
        }

        return characterLevelId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof CharacterLevel)) {
            throw new Exception("Invalid attribute type");
        }
        CharacterLevel characterLevel = (CharacterLevel)attribute;
        shareList.getAttributes().add(attribute.getId());
    }
}
