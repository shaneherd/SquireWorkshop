package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.Skill;
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
import java.util.List;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_ABILITIES;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class SkillService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getSkill(resultSet, userId);
    }

    public Attribute get(long id, int userId) throws Exception {
        Skill skill = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_Skill (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    skill = getSkill(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return skill;
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        SortValue sortValue = SortService.getSortValue(sorts);
        String sortColumn = "name";
        boolean sortAscending = true;
        if (sortValue != null) {
            sortColumn = getSortColumn(sortValue);
            sortAscending = sortValue.isAscending();
        }

        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_Skills (?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setString(5, sortColumn);
        statement.setBoolean(6, sortAscending);
        statement.setInt(7, listSource.getValue());
        return statement;
    }

    private String getSortColumn(SortValue sortValue) {
        switch (sortValue.getSortKey()) {
            case ABILITY:
                return "ability_name";
            case NAME:
            default:
                return "name";
        }
    }

    public static List<Skill> getSkills(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getSkills(userId);
    }

    private static List<Skill> getSkills(int userId) throws Exception {
        List<Skill> skills = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_GetList_Skills_Detailed (?,?,?,?)}");
            statement.setInt(1, userId);
            MySql.setString(2, null, statement);
            statement.setLong(3, 0);
            statement.setLong(4, PAGE_SIZE);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    skills.add(getSkill(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return skills;
    }

    private static Skill getSkill(ResultSet resultSet, int userId) throws Exception {
        return new Skill(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                getAbility(resultSet, userId)
        );
    }

    private static Ability getAbility(ResultSet resultSet, int userId) throws Exception {
        return new Ability(
                MySql.encodeId(resultSet.getLong("ability_id"), userId),
                resultSet.getString("ability_name"),
                resultSet.getString("ability_description"),
                resultSet.getInt("ability_sid"),
                resultSet.getBoolean("ability_is_author"),
                resultSet.getInt("ability_version"),
                resultSet.getString("ability_abbr")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof Skill)) {
            throw new Exception("Invalid attribute type");
        }
        Skill skill = (Skill) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Create_Skill (?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            setAbilityInteger(3, skill.getAbility(), userId, statement);
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
        if (!(attribute instanceof Skill)) {
            throw new Exception("Invalid attribute type");
        }
        Skill skill = (Skill) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Update_Skill (?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            setAbilityInteger(5, skill.getAbility(), userId, statement);
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

    private void setAbilityInteger(int index, Ability ability, int userId, PreparedStatement statement) throws Exception {
        String value = null;
        if (ability != null) {
            value = ability.getId();

            if (value.equals("0")) {
                value = null;
            }
        }
        MySql.setId(index, value, userId, statement);
    }

    @Override
    public long addToMyStuff(Attribute authorAttribute, int authorUserId, ListObject existingAttribute, int userId) throws Exception {
        if (!(authorAttribute instanceof Skill)) {
            throw new Exception("Invalid attribute type");
        }
        Skill skill = (Skill)authorAttribute;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToMyStuff(skill.getAbility(), userId);
        }

        long skillId;
        if (skill.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(skill.getId(), authorUserId), userId);
            skillId = MySql.decodeId(skill.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                skillId = create(skill, userId);
            } else {
                skillId = MySql.decodeId(existingAttribute.getId(), userId);
                update(skill, skillId, userId);
            }
        }

        return skillId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof Skill)) {
            throw new Exception("Invalid attribute type");
        }
        Skill skill = (Skill)attribute;

        if (CUSTOM_ABILITIES) {
            AttributeService.addToShareList(skill.getAbility(), userId, shareList);
        }
        shareList.getAttributes().add(attribute.getId());
    }
}
