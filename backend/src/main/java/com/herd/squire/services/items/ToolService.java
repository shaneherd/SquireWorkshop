package com.herd.squire.services.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.ToolCategory;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.EquipmentSlotType;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.Tool;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.attributes.AttributeService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class ToolService implements ItemDetailsService {
    @Override
    public Tool get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getTool(resultSet, userId);
    }

    public Tool get(long id, int userId) throws Exception {
        Tool tool = null;
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_Tool (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    tool = getTool(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return tool;
    }

    @Override
    public CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);
        String toolCategoryId = ItemService.getFilterValue(filterValues, FilterKey.TOOL_CATEGORY);
        if (toolCategoryId == null || toolCategoryId.equals(FilterValue.DEFAULT_OPTION)) {
            toolCategoryId = null;
        }
        Boolean isExpendable = FilterService.getFilterBoolean(filterValues, FilterKey.EXPENDABLE);
        Boolean isEquippable = FilterService.getFilterBoolean(filterValues, FilterKey.EQUIPPABLE);
        Boolean isContainer = FilterService.getFilterBoolean(filterValues, FilterKey.CONTAINER);

        CallableStatement statement = connection.prepareCall("{call Items_GetList_Tools (?,?,?,?,?,?,?,?,?)}");
        statement.setInt(1, userId);
        statement.setString(2, search);
        MySql.setId(3, toolCategoryId, userId, statement);
        MySql.setBoolean(4, isExpendable, statement);
        MySql.setBoolean(5, isEquippable, statement);
        MySql.setBoolean(6, isContainer, statement);
        statement.setLong(7, offset);
        statement.setLong(8, PAGE_SIZE);
        statement.setInt(9, listSource.getValue());
        return statement;
    }

    @Override
    public CallableStatement getSubItemListObjectStatement(Connection connection, String subTypeId, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        if (filterValues == null) {
            filterValues = new ArrayList<>();
        }
        filterValues.add(new FilterValue(FilterKey.TOOL_CATEGORY, subTypeId));
        return getItemListObjectStatement(connection, filterValues, offset, userId, listSource);
    }

    private Tool getTool(ResultSet resultSet, int userId) throws Exception {
        return new Tool(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getBoolean("expendable"),
                resultSet.getBoolean("equippable"),
                EquipmentSlotType.valueOf(resultSet.getInt("slot")),
                resultSet.getBoolean("container"),
                resultSet.getBoolean("ignore_weight"),
                resultSet.getInt("cost"),
                ItemService.getCostUnit(resultSet, userId),
                resultSet.getDouble("weight"),
                getToolCategory(resultSet, userId)
        );
    }

    private static ToolCategory getToolCategory(ResultSet resultSet, int userId) throws Exception {
        return new ToolCategory(
                MySql.encodeId(resultSet.getLong("tool_category_id"), userId),
                resultSet.getString("tool_category_name"),
                resultSet.getString("tool_category_description"),
                resultSet.getInt("tool_category_sid"),
                resultSet.getBoolean("tool_category_is_author"),
                resultSet.getInt("tool_category_version")
        );
    }

    @Override
    public long create(Item item, int userId) throws Exception {
        if (!(item instanceof Tool)) {
            throw new Exception("Invalid item type");
        }
        Tool tool = (Tool) item;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Create_Tool (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(item.getName(), 45));
            statement.setString(2, MySql.getValue(item.getDescription(), 1000));
            statement.setBoolean(3, item.isExpendable());
            statement.setBoolean(4, item.isEquippable());
            MySql.setInteger(5, item.getSlot() == null ? null : item.getSlot().getValue(), statement);
            statement.setBoolean(6, item.isContainer());
            statement.setBoolean(7, item.isIgnoreWeight());
            statement.setInt(8, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(9, item.getCostUnit() == null ? null : item.getCostUnit().getId(), userId, statement);
            statement.setDouble(10, MySql.getValue(item.getWeight(), 0, 999));
            MySql.setId(11, tool.getCategory().getId(), userId, statement);
            statement.setInt(12, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("item_id");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Item item, long itemId, int userId) throws Exception {
        if (!(item instanceof Tool)) {
            throw new Exception("Invalid item type");
        }
        Tool tool = (Tool) item;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Update_Tool (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(item.getName(), 45));
            statement.setString(4, MySql.getValue(item.getDescription(), 1000));
            statement.setBoolean(5, item.isExpendable());
            statement.setBoolean(6, item.isEquippable());
            MySql.setInteger(7, item.getSlot() == null ? null : item.getSlot().getValue(), statement);
            statement.setBoolean(8, item.isContainer());
            statement.setBoolean(9, item.isIgnoreWeight());
            statement.setInt(10, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(11, item.getCostUnit().getId(), userId, statement);
            statement.setDouble(12, MySql.getValue(item.getWeight(), 0, 999.999));

            MySql.setId(13, tool.getCategory().getId(), userId, statement);

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
    public long addToMyStuff(Item authorItem, int authorUserId, ListObject existingItem, int userId) throws Exception {
        if (!(authorItem instanceof Tool)) {
            throw new Exception("Invalid item type");
        }
        Tool tool = (Tool)authorItem;

        AttributeService.addToMyStuff(tool.getCategory(), userId);

        long toolId;
        if (tool.getSid() != 0) {
            ItemService.addSystemItem(MySql.decodeId(tool.getId(), authorUserId), userId);
            toolId = MySql.decodeId(tool.getId(), authorUserId);
        } else {
            if (existingItem == null) {
                toolId = create(tool, userId);
            } else {
                toolId = MySql.decodeId(existingItem.getId(), userId);
                update(tool, toolId, userId);
            }
        }

        return toolId;
    }

    @Override
    public void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (!(item instanceof Tool)) {
            throw new Exception("Invalid item type");
        }
        Tool tool = (Tool)item;

        AttributeService.addToShareList(tool.getCategory(), userId, shareList);
        shareList.getItems().add(item.getId());
    }
}
