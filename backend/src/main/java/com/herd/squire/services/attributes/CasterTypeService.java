package com.herd.squire.services.attributes;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.SpellSlots;
import com.herd.squire.models.attributes.Attribute;
import com.herd.squire.models.attributes.CasterType;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.models.sorts.SortValue;
import com.herd.squire.services.FilterService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.services.SharingUtilityService.CUSTOM_LEVELS;
import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class CasterTypeService implements AttributeDetailsService {
    @Override
    public Attribute get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getCasterType(statement, resultSet, userId);
    }

    @Override
    public CallableStatement getListObjectStatement(Connection connection, List<FilterValue> filters, List<SortValue> sorts, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Attributes_GetList_CasterTypes (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    public static CasterType get(long id, int userId) throws Exception {
        CasterType casterType = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Attributes_Get_CasterType (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    casterType = getCasterType(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return casterType;
    }

    private static CasterType getCasterType(Statement statement, ResultSet resultSet, int userId) throws Exception {
        CasterType casterType = new CasterType(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getInt("multiclass_weight"),
                resultSet.getBoolean("round_up")
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            casterType.setSpellSlots(getSpellSlots(resultSet, userId));
        }

        return casterType;
    }

    public static List<SpellSlots> getSpellSlots(ResultSet resultSet, int userId) throws Exception {
        List<SpellSlots> spellSlots = new ArrayList<>();
        while (resultSet.next()) {
            spellSlots.add(getSpellSlot(resultSet, userId));
        }
        return spellSlots;
    }

    private static SpellSlots getSpellSlot(ResultSet resultSet, int userId) throws Exception {
        return new SpellSlots(
                new ListObject(MySql.encodeId(resultSet.getLong("character_level_id"), userId), resultSet.getString("character_level_name"), resultSet.getInt("character_level_sid"), resultSet.getBoolean("character_level_is_author")),
                resultSet.getInt("slot_1"),
                resultSet.getInt("slot_2"),
                resultSet.getInt("slot_3"),
                resultSet.getInt("slot_4"),
                resultSet.getInt("slot_5"),
                resultSet.getInt("slot_6"),
                resultSet.getInt("slot_7"),
                resultSet.getInt("slot_8"),
                resultSet.getInt("slot_9")
        );
    }

    @Override
    public long create(Attribute attribute, int userId) throws Exception {
        if (!(attribute instanceof CasterType)) {
            throw new Exception("Invalid attribute type");
        }
        CasterType casterType = (CasterType) attribute;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Attributes_Create_CasterType (?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(attribute.getName(), 45));
            statement.setString(2, MySql.getValue(attribute.getDescription(), 1000));
            statement.setInt(3, MySql.getValue(casterType.getMultiClassWeight(), 1, 99));
            statement.setBoolean(4, casterType.isRoundUp());
            statement.setInt(5, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    id = resultSet.getLong("attribute_id");
                }
            }

            if (id != -1) {
                createSpellSlots(id, casterType.getSpellSlots(), userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    private void createSpellSlots(long casterTypeId, List<SpellSlots> spellSlots, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO `caster_type_spell_slots` (`caster_type_id`, `character_level_id`, `slot_1`, `slot_2`, `slot_3`, `slot_4`, `slot_5`, `slot_6`, `slot_7`, `slot_8`, `slot_9`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            for (SpellSlots current : spellSlots) {
                statement.setLong(1, casterTypeId);
                MySql.setId(2, current.getCharacterLevel().getId(), userId, statement);
                statement.setInt(3, MySql.getValue(current.getSlot1(), 0, 99));
                statement.setInt(4, MySql.getValue(current.getSlot2(), 0, 99));
                statement.setInt(5, MySql.getValue(current.getSlot3(), 0, 99));
                statement.setInt(6, MySql.getValue(current.getSlot4(), 0, 99));
                statement.setInt(7, MySql.getValue(current.getSlot5(), 0, 99));
                statement.setInt(8, MySql.getValue(current.getSlot6(), 0, 99));
                statement.setInt(9, MySql.getValue(current.getSlot7(), 0, 99));
                statement.setInt(10, MySql.getValue(current.getSlot8(), 0, 99));
                statement.setInt(11, MySql.getValue(current.getSlot9(), 0, 99));
                statement.addBatch();
            }
            statement.executeBatch();

            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    @Override
    public boolean update(Attribute attribute, long id, int userId) throws Exception {
        if (!(attribute instanceof CasterType)) {
            throw new Exception("Invalid attribute type");
        }
        CasterType casterType = (CasterType) attribute;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Attributes_Update_CasterType (?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(attribute.getName(), 45));
            statement.setString(4, MySql.getValue(attribute.getDescription(), 1000));
            statement.setInt(5, MySql.getValue(casterType.getMultiClassWeight(), 1, 99));
            statement.setBoolean(6, casterType.isRoundUp());
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updateSpellSlots(id, casterType.getSpellSlots(), userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    private void updateSpellSlots(long casterTypeId, List<SpellSlots> spellSlots, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("UPDATE `caster_type_spell_slots` SET `slot_1`=?, `slot_2`=?, `slot_3`=?, `slot_4`=?, `slot_5`=?, `slot_6`=?, `slot_7`=?, `slot_8`=?, `slot_9`=? WHERE caster_type_id = ? AND character_level_id = ?");

            for (SpellSlots current : spellSlots) {
                statement.setInt(1, MySql.getValue(current.getSlot1(), 0, 99));
                statement.setInt(2, MySql.getValue(current.getSlot2(), 0, 99));
                statement.setInt(3, MySql.getValue(current.getSlot3(), 0, 99));
                statement.setInt(4, MySql.getValue(current.getSlot4(), 0, 99));
                statement.setInt(5, MySql.getValue(current.getSlot5(), 0, 99));
                statement.setInt(6, MySql.getValue(current.getSlot6(), 0, 99));
                statement.setInt(7, MySql.getValue(current.getSlot7(), 0, 99));
                statement.setInt(8, MySql.getValue(current.getSlot8(), 0, 99));
                statement.setInt(9, MySql.getValue(current.getSlot9(), 0, 99));
                statement.setLong(10, casterTypeId);
                MySql.setId(11, current.getCharacterLevel().getId(), userId, statement);
                statement.addBatch();
            }
            statement.executeBatch();

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
        if (!(authorAttribute instanceof CasterType)) {
            throw new Exception("Invalid attribute type");
        }
        CasterType casterType = (CasterType)authorAttribute;

        long casterTypeId;

        if (CUSTOM_LEVELS && casterType.getSpellSlots() != null) {
            for (SpellSlots spellSlots : casterType.getSpellSlots()) {
                AttributeService.addToMyStuff(spellSlots.getCharacterLevel(), userId);
            }
        }

        if (casterType.getSid() != 0) {
            AttributeService.addSystemAttribute(MySql.decodeId(casterType.getId(), authorUserId), userId);
            casterTypeId = MySql.decodeId(casterType.getId(), authorUserId);
        } else {
            if (existingAttribute == null) {
                casterTypeId = create(casterType, userId);
            } else {
                casterTypeId = MySql.decodeId(existingAttribute.getId(), userId);
                update(casterType, casterTypeId, userId);
            }
        }

        return casterTypeId;
    }

    @Override
    public void addToShareList(Attribute attribute, int userId, ShareList shareList) throws Exception {
        if (!(attribute instanceof CasterType)) {
            throw new Exception("Invalid attribute type");
        }
        CasterType casterType = (CasterType)attribute;
        if (CUSTOM_LEVELS && casterType.getSpellSlots() != null) {
            for (SpellSlots spellSlots : casterType.getSpellSlots()) {
                AttributeService.addToShareList(spellSlots.getCharacterLevel(), userId, shareList);
            }
        }
        shareList.getAttributes().add(attribute.getId());
    }
}
