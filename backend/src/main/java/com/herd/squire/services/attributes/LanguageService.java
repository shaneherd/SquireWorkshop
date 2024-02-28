package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.Language;
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

public class LanguageService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getLanguage(resultSet, userId);
    }

    public Attribute get(long id, int userId) throws Exception {
        Language language = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_Language (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    language = getLanguage(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return language;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_Languages (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    private Language getLanguage(ResultSet resultSet, int userId) throws Exception {
        return new Language(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getString("script")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof Language)) {
            throw new Exception("Invalid attribute type");
        }
        Language language = (Language) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_Language (?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            statement.setString(3, MySql.getValue(language.getScript(), 45));
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
        if (!(attribute instanceof Language)) {
            throw new Exception("Invalid attribute type");
        }
        Language language = (Language) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_Language (?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            statement.setString(5, MySql.getValue(language.getScript(), 45));
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
        if (!(authorAttribute instanceof Language)) {
            throw new Exception("Invalid attribute type");
        }
        Language language = (Language)authorAttribute;

        long languageId;
        if (language.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(language.getId(), authorUserId), userId);
            languageId = MySql.decodeId(language.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                languageId = create(language, userId);
            } else {
                languageId = MySql.decodeId(existingAttribute.getId(), userId);
                update(language, languageId, userId);
            }
        }

        return languageId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof Language)) {
            throw new Exception("Invalid attribute type");
        }
        Language language = (Language)attribute;
        shareList.getAttributes().add(attribute.getId());
    }
}
