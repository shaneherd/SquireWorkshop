package com.herd.squire.services.items;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.Vehicle;
import com.herd.squire.models.sharing.ShareList;
import com.herd.squire.services.FilterService;
import com.herd.squire.utilities.MySql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class VehicleService implements ItemDetailsService {
    @Override
    public Vehicle get(Statement statement, ResultSet resultSet, int userId) throws Exception {
        return getVehicle(resultSet, userId);
    }

    public Vehicle get(long id, int userId) throws Exception {
        Vehicle vehicle = null;
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_Vehicle (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    vehicle = getVehicle(resultSet, userId);
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
        return vehicle;
    }

    @Override
    public CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filterValues);

        CallableStatement statement = connection.prepareCall("{call Items_GetList_Vehicles (?,?,?,?,?)}");
        statement.setInt(1, userId);
        statement.setString(2, search);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    private Vehicle getVehicle(ResultSet resultSet, int userId) throws Exception {
        return new Vehicle(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("version"),
                resultSet.getInt("cost"),
                ItemService.getCostUnit(resultSet, userId),
                resultSet.getDouble("weight")
        );
    }

    @Override
    public CallableStatement getSubItemListObjectStatement(Connection connection, String subTypeId, List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        throw new Exception("not implemented");
    }

    @Override
    public long create(Item item, int userId) throws Exception {
        if (!(item instanceof Vehicle)) {
            throw new Exception("Invalid item type");
        }
        Vehicle vehicle = (Vehicle) item;
        long id = -1;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Create_Vehicle (?, ?, ?, ?, ?, ?)}");
            statement.setString(1, MySql.getValue(item.getName(), 45));
            statement.setString(2, MySql.getValue(item.getDescription(), 1000));
            statement.setInt(3, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(4, item.getCostUnit() == null ? null : item.getCostUnit().getId(), userId, statement);
            statement.setDouble(5, MySql.getValue(item.getWeight(), 0, 999));
            statement.setInt(6, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("item_id");
                }
            }

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return id;
    }

    @Override
    public boolean update(Item item, long itemId, int userId) throws Exception {
        if (!(item instanceof Vehicle)) {
            throw new Exception("Invalid item type");
        }
        Vehicle vehicle = (Vehicle) item;
        boolean success = false;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Update_Vehicle (?, ?, ?, ?, ?, ?, ?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setString(3, MySql.getValue(item.getName(), 45));
            statement.setString(4, MySql.getValue(item.getDescription(), 1000));
            statement.setInt(5, MySql.getValue(item.getCost(), 0, 99999));
            MySql.setId(6, item.getCostUnit().getId(), userId, statement);
            statement.setDouble(7, MySql.getValue(item.getWeight(), 0, 999.999));
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
        if (!(authorItem instanceof Vehicle)) {
            throw new Exception("Invalid item type");
        }
        Vehicle vehicle = (Vehicle)authorItem;

        long vehicleId;
        if (vehicle.getSid() != 0) {
            ItemService.addSystemItem(MySql.decodeId(vehicle.getId(), authorUserId), userId);
            vehicleId = MySql.decodeId(vehicle.getId(), authorUserId);
        } else {
            if (existingItem == null) {
                vehicleId = create(vehicle, userId);
            } else {
                vehicleId = MySql.decodeId(existingItem.getId(), userId);
                update(vehicle, vehicleId, userId);
            }
        }

        return vehicleId;
    }

    @Override
    public void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (!(item instanceof Vehicle)) {
            throw new Exception("Invalid item type");
        }
        Vehicle vehicle = (Vehicle)item;
        shareList.getItems().add(item.getId());
    }
}
