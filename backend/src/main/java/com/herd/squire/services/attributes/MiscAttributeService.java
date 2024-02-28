package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.Misc;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.powers.ModifierCategory;
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

public class MiscAttributeService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getMisc(resultSet, userId);
    }

    public static Misc get(long id, int userId) throws Exception {
        if (id == 0) {
            return null;
        }
        Misc misc = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_Misc (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    misc = getMisc(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return misc;
    }

    private static Misc getMisc(ResultSet resultSet, int userId) throws Exception {
        return new Misc(
                MySql.encodeId(resultSet.getLong("attribute_id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                ModifierCategory.valueOf(resultSet.getInt("modifier_category_id")),
                resultSet.getBoolean("characteristic_dependant")
        );
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_Misc (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        throw new Exception("not implemented");
    }

    @Override
    public boolean update(Attribute attribute, long id, int userId) throws Exception {
        throw new Exception("not implemented");
    }

    @Override
    public long addToMyStuff(Attribute authorAttribute, int authorUserId, ListObject existingAttribute, int userId) throws Exception {
        if (!(authorAttribute instanceof Misc)) {
            throw new Exception("Invalid attribute type");
        }
        Misc misc = (Misc)authorAttribute;

        long miscId;
        if (misc.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(misc.getId(), authorUserId), userId);
            miscId = MySql.decodeId(misc.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                miscId = create(misc, userId);
            } else {
                miscId = MySql.decodeId(existingAttribute.getId(), userId);
                update(misc, miscId, userId);
            }
        }

        return miscId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof Misc)) {
            throw new Exception("Invalid attribute type");
        }
        Misc misc = (Misc)attribute;
        shareList.getAttributes().add(attribute.getId());
    }
}
