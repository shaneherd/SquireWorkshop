package com.herd.squire.services.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.*;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.utilities.MySql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class PackService implements ItemDetailsService {
    @Override
    public Pack get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getPack(statement, resultSet, userId);
    }

    public Pack get(long id, int userId) throws Exception {
        Pack pack = null;
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_Pack (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    pack = getPack(statement, resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return pack;
    }

    @Override
    public CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);

        CallableStatement statement = connection.prepareCall("{call Items_GetList_Packs (?,?,?,?,?)}");
        statement.setInt(1, userId);
        statement.setString(2, search);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    private Pack getPack(Statement statement, ResultSet resultSet, int userId) throws Exception {
        Pack pack = new Pack(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version")
        );

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            pack.setItems(getItems(resultSet, userId));
        }

        return pack;
    }

    @Override
    public CallableStatement getSubItemListObjectStatement(Connection connection, String subTypeId, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        throw new Exception("not implemented");
    }

    @Override
    public long create(Item item, int userId) throws Exception {
        if (!(item instanceof Pack)) {
            throw new Exception("Invalid item type");
        }
        Pack pack = (Pack) item;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Items_Create_Pack (?, ?, ?)}");
            statement.setString(1, MySql.getValue(item.getName(), 45));
            statement.setString(2, MySql.getValue(item.getDescription(), 1000));
            statement.setInt(3, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("item_id");
                }
            }

            if (id != -1) {
                updatePackItems(id, pack.getItems(), userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Item item, long itemId, int userId) throws Exception {
        if (!(item instanceof Pack)) {
            throw new Exception("Invalid item type");
        }
        Pack pack = (Pack) item;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);

            statement = connection.prepareCall("{call Items_Update_Pack (?, ?, ?, ?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(item.getName(), 45));
            statement.setString(4, MySql.getValue(item.getDescription(), 1000));
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    success = resultSet.getBoolean("valid_request");
                }
            }

            if (success) {
                updatePackItems(itemId, pack.getItems(), userId, connection);
            }

            connection.commit();

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return success;
    }

    /******************************** Item *********************************/

    private static void updatePackItems(long packId, List<ItemQuantity> packItems, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM pack_items WHERE pack_id = ?");
            statement.setLong(1, packId);
            statement.executeUpdate();

            if (!packItems.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `pack_items` (`pack_id`, `item_id`, `sub_item_id`, `quantity`) VALUES (?,?,?,?)");

                for (ItemQuantity itemQuantity : packItems) {
                    statement.setLong(1, packId);
                    MySql.setId(2, itemQuantity.getItem().getId(), userId, statement);
                    MySql.setId(3, itemQuantity.getItem().getSubItem() == null ? null : itemQuantity.getItem().getSubItem().getId(), userId, statement);
                    statement.setInt(4, itemQuantity.getQuantity());
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

    private static List<ItemQuantity> getItems(ResultSet resultSet, int userId) throws Exception {
        List<ItemQuantity> items = new ArrayList<>();
        while (resultSet.next()) {
            items.add(getItemQuantity(resultSet, userId));
        }
        return items;
    }

    private static ItemQuantity getItemQuantity(ResultSet resultSet, int userId) throws Exception {
        ItemQuantity itemQuantity = new ItemQuantity(
                new ItemListObject(
                        MySql.encodeId(resultSet.getLong("item_id"), userId),
                        resultSet.getString("item_name"),
                        resultSet.getInt("item_sid"),
                        resultSet.getBoolean("item_is_author"),
                        resultSet.getInt("cost"),
                        MySql.encodeId(resultSet.getLong("cost_unit"), userId),
                        ItemType.valueOf(resultSet.getInt("item_type_id"))
                ),
                resultSet.getInt("quantity")
        );

        long subItemId = resultSet.getLong("sub_item_id");
        ItemListObject subItem = null;
        if (subItemId != 0) {
            subItem = new ItemListObject(
                    MySql.encodeId(subItemId, userId),
                    resultSet.getString("sub_item_name"),
                    resultSet.getInt("sub_item_sid"),
                    resultSet.getBoolean("sub_item_is_author"),
                    resultSet.getInt("sub_item_cost"),
                    MySql.encodeId(resultSet.getLong("sub_item_cost_unit"), userId),
                    ItemType.valueOf(resultSet.getInt("sub_item_type_id"))
            );
        }
        itemQuantity.getItem().setSubItem(subItem);

        return itemQuantity;
    }

    @Override
    public long addToMyStuff(Item authorItem, int authorUserId, ListObject existingItem, int userId) throws Exception {
        if (!(authorItem instanceof Pack)) {
            throw new Exception("Invalid item type");
        }
        Pack pack = (Pack)authorItem;

        SharingUtilityService.addItemQuantitiesToMyStuff(pack.getItems(), userId);

        long packId;
        if (pack.getSid() != 0) {
            ItemService.addSystemItem(MySql.decodeId(pack.getId(), authorUserId), userId);
            packId = MySql.decodeId(pack.getId(), authorUserId);
        } else {
            if (existingItem == null) {
                packId = create(pack, userId);
            } else {
                packId = MySql.decodeId(existingItem.getId(), userId);
                update(pack, packId, userId);
            }
        }

        return packId;
    }

    @Override
    public void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (!(item instanceof Pack)) {
            throw new Exception("Invalid item type");
        }
        Pack pack = (Pack)item;

        SharingUtilityService.addItemQuantitiesToShareList(pack.getItems(), userId, shareList);
        shareList.getItems().add(item.getId());
    }
}
