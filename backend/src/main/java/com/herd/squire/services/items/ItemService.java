package com.herd.squire.services.items;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.DiceSize;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.ListSource;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.DamageType;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterValue;
import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.inUse.InUse;
import com.herd.squire.models.items.*;
import com.herd.squire.models.items.magical_item.MagicalItemApplicability;
import com.herd.squire.models.items.magical_item.MagicalItemApplicabilityType;
import com.herd.squire.models.items.magical_item.MagicalItemType;
import com.herd.squire.models.powers.SpellListObject;
import com.herd.squire.models.sharing.*;
import com.herd.squire.rest.SquireException;
import com.herd.squire.rest.SquireHttpStatus;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.FilterService;
import com.herd.squire.services.InUseFactory;
import com.herd.squire.services.SharingUtilityService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.herd.squire.utilities.Constants.PAGE_SIZE;

public class ItemService {
    private static final AmmoService ammoService = new AmmoService();
    private static final ArmorService armorService = new ArmorService();
    private static final GearService gearService = new GearService();
    private static final MagicalItemService magicalItemService = new MagicalItemService();
    private static final MountService mountService = new MountService();
    private static final PackService packService = new PackService();
    private static final ToolService toolService = new ToolService();
    private static final TreasureService treasureService = new TreasureService();
    private static final WeaponService weaponService = new WeaponService();
    private static final VehicleService vehicleService = new VehicleService();

    private static ItemDetailsService getService(ItemType itemType) throws Exception {
        ItemDetailsService itemDetailsService = null;
        switch (itemType) {
            case WEAPON:
                itemDetailsService = weaponService;
                break;
            case ARMOR:
                itemDetailsService = armorService;
                break;
            case GEAR:
                itemDetailsService = gearService;
                break;
            case TOOL:
                itemDetailsService = toolService;
                break;
            case AMMO:
                itemDetailsService = ammoService;
                break;
            case MOUNT:
                itemDetailsService = mountService;
                break;
            case TREASURE:
                itemDetailsService = treasureService;
                break;
            case PACK:
                itemDetailsService = packService;
                break;
            case MAGICAL_ITEM:
                itemDetailsService = magicalItemService;
                break;
            case VEHICLE:
                itemDetailsService = vehicleService;
                break;
        }

        if (itemDetailsService == null) {
            throw new Exception("Invalid Item Type");
        }
        return itemDetailsService;
    }

    public static Item getItem(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return getItem(decodedId, headers);
    }

    public static Item getItem(Statement statement, ResultSet resultSet, int userId) throws Exception {
        ItemType itemType = ItemType.valueOf(resultSet.getInt("item_type_id"));

        Item item = null;
        if (statement.getMoreResults()) {
            ItemDetailsService itemDetailsService = getService(itemType);
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                item = itemDetailsService.get(statement, resultSet, userId);
            }
        }
        return item;
    }

    public static Item getItem(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getItem(id, userId);
    }

    public static Item getItem(long id, int userId) throws Exception {
        Item item = null;

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    ItemType itemType = ItemType.valueOf(resultSet.getInt("item_type_id"));

                    if (statement.getMoreResults()) {
                        ItemDetailsService itemDetailsService = getService(itemType);
                        resultSet = statement.getResultSet();
                        if (resultSet.next()) {
                            item = itemDetailsService.get(statement, resultSet, userId);
                        }
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return item;
    }

    public static ItemListResponse getItems(long offset, ListSource listSource, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getItems(null, offset, userId, listSource);
    }

    public static ItemListResponse getItems(ItemType itemType, long offset, ListSource listSource, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<FilterValue> filterValues = new ArrayList<>();
        filterValues.add(new FilterValue(FilterKey.ITEM_TYPE, itemType.toString()));
        return getItems(filterValues, offset, userId, listSource);
    }

    public static ItemListResponse getItems(Filters filters, long offset, ListSource listSource, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        return getItems(filters.getFilterValues(), offset, userId, listSource);
    }

    public static List<ListObject> getItems(ItemType itemType, String subTypeId, ListSource listSource, HttpHeaders headers) throws Exception {
        ItemDetailsService itemDetailsService = getService(itemType);
        int userId = AuthenticationService.getUserId(headers);
        List<ListObject> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = itemDetailsService.getSubItemListObjectStatement(connection, subTypeId, null, 0, userId, listSource);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    items.add(MySql.getListObject(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    private static CallableStatement getItemListObjectStatement(Connection connection, List<FilterValue> filters, long offset, int userId, ListSource listSource) throws Exception {
        String search = FilterService.getSearchValue(filters);
        CallableStatement statement = connection.prepareCall("{call Items_GetList (?,?,?,?,?)}");
        statement.setInt(1, userId);
        MySql.setString(2, search, statement);
        statement.setLong(3, offset);
        statement.setLong(4, PAGE_SIZE);
        statement.setInt(5, listSource.getValue());
        return statement;
    }

    public static ItemListResponse getItems(List<FilterValue> filterValues, long offset, int userId, ListSource listSource) throws Exception {
        List<ItemListObject> items = new ArrayList<>();
        Map<String, ItemListObject> map = new HashMap<>();
        ItemType itemType = getItemType(filterValues);

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            if (itemType == null) {
                statement = getItemListObjectStatement(connection, filterValues, offset, userId, listSource);
            } else {
                ItemDetailsService detailsService = getService(itemType);
                statement = detailsService.getItemListObjectStatement(connection, filterValues, offset, userId, listSource);
            }
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    ItemListObject item = getItemListObject(resultSet, userId);
                    items.add(item);
                    map.put(item.getId(), item);
                }
            }

            if (itemType == null) {
                processPackItems(statement, userId, map);
                processMagicalItems(statement, userId, map);
            } else if (itemType == ItemType.PACK) {
                processPackItems(statement, userId, map);
            } else if (itemType == ItemType.MAGICAL_ITEM) {
                processMagicalItems(statement, userId, map);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        boolean hasMore = items.size() == PAGE_SIZE;
        List<ItemListObject> finalItems = hasMore ? items.subList(0, PAGE_SIZE - 1) : items;
        return new ItemListResponse(finalItems, hasMore);
    }

    private static void processMagicalItems(Statement statement, int userId, Map<String, ItemListObject> map) throws Exception {
        // applicable items
        if (statement.getMoreResults()) {
            ResultSet resultSet = statement.getResultSet();

            while (resultSet.next()) {
                String magicalItemId = MySql.encodeId(resultSet.getLong("magical_item_id"), userId);
                ItemListObject magicalItem = map.get(magicalItemId);
                if (magicalItem != null) {
                    magicalItem.getApplicableMagicalItems().add(getMagicalItemApplicablityItem(resultSet, userId));
                }
            }
        }

        //applicable spells
        if (statement.getMoreResults()) {
            ResultSet resultSet = statement.getResultSet();

            while (resultSet.next()) {
                String magicalItemId = MySql.encodeId(resultSet.getLong("magical_item_id"), userId);
                MagicalItemType magicalItemType = MagicalItemType.valueOf(resultSet.getInt("magical_item_type_id"));
                ItemListObject magicalItem = map.get(magicalItemId);
                if (magicalItem != null) {
                    magicalItem.setRequireSelectedSpell(magicalItemType == MagicalItemType.SCROLL);
                    magicalItem.getApplicableSpells().add(getMagicalItemApplicablitySpell(resultSet, userId));
                }
            }
        }
    }

    private static MagicalItemApplicability getMagicalItemApplicablityItem(ResultSet resultSet, int userId) throws Exception {
        long itemId = resultSet.getLong("id");
        ItemListObject item = null;
        if (itemId > 0) {
            item = getItemListObject(resultSet, userId);
        }

        return new MagicalItemApplicability(
                MagicalItemApplicabilityType.valueOf(resultSet.getInt("applicability_type_id")),
                item,
                null,
                new Filters(resultSet.getString("filters"), userId)
        );
    }

    private static MagicalItemApplicability getMagicalItemApplicablitySpell(ResultSet resultSet, int userId) throws Exception {
        long spellId = resultSet.getLong("spell_id");
        SpellListObject spell = null;
        if (spellId > 0) {
            spell = new SpellListObject(
                    MySql.encodeId(spellId, userId),
                    resultSet.getString("spell_name"),
                    resultSet.getInt("spell_sid"),
                    resultSet.getBoolean("spell_is_author"),
                    resultSet.getInt("spell_level")
            );
        }

        return new MagicalItemApplicability(
                MagicalItemApplicabilityType.valueOf(resultSet.getInt("applicability_type_id")),
                null,
                spell,
                new Filters(resultSet.getString("filters"), userId)
        );
    }

    private static void processPackItems(Statement statement, int userId, Map<String, ItemListObject> map) throws Exception {
        if (statement.getMoreResults()) {
            ResultSet resultSet = statement.getResultSet();

            while (resultSet.next()) {
                String packId = MySql.encodeId(resultSet.getLong("pack_id"), userId);
                int quantity = resultSet.getInt("quantity");
                ItemListObject pack = map.get(packId);
                if (pack != null) {
                    ItemListObject subItem = getItemListObject(resultSet, userId, true);
                    ItemQuantity itemQuantity = new ItemQuantity(subItem, quantity);
                    pack.getSubItems().add(itemQuantity);
                }
            }
        }
    }

    public static List<EquipmentSlot> getEquipmentSlots(HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        List<EquipmentSlot> equipmentSlots = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT id, name, equipment_slot_type_id FROM equipment_slots ORDER BY name");
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                equipmentSlots.add(new EquipmentSlot(MySql.encodeId(resultSet.getLong("id"), userId), resultSet.getString("name"), EquipmentSlotType.valueOf(resultSet.getInt("equipment_slot_type_id"))));
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return equipmentSlots;
    }

    public static ItemListObject getItemListObject(ResultSet resultSet, int userId) throws Exception {
        return getItemListObject(resultSet, userId, false);
    }

    public static ItemListObject getItemListObject(ResultSet resultSet, int userId, boolean includeSubItem) throws Exception {
        ItemListObject item = new ItemListObject(
                MySql.encodeId(resultSet.getLong("id"), userId),
                resultSet.getString("name"),
                resultSet.getInt("sid"),
                resultSet.getBoolean("is_author"),
                resultSet.getInt("cost"),
                MySql.encodeId(resultSet.getLong("cost_unit"), userId),
                ItemType.valueOf(resultSet.getInt("item_type_id"))
        );

        if (includeSubItem) {
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
            item.setSubItem(subItem);
        }

        return item;
    }

    public static String getFilterValue(List<FilterValue> filterValues, FilterKey filterKey) {
        if (filterValues == null) {
            return null;
        }
        for (int i = 0; i < filterValues.size(); i++) {
            FilterValue filterValue = filterValues.get(i);
            if (filterValue.getKey() == filterKey) {
                return filterValue.getValue();
            }
        }
        return null;
    }

    private static ItemType getItemType(List<FilterValue> filterValues) {
        String value = getFilterValue(filterValues, FilterKey.ITEM_TYPE);
        if (value != null) {
            return ItemType.valueOf(value);
        }
        return null;
    }

    public static String createItem(Item item, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long newId = createItem(item, userId);

        if (newId < 1) {
            throw new SquireException(SquireHttpStatus.INTERNAL_SERVER_ERROR);
        }

        return MySql.encodeId(newId, userId);
    }

    public static long createItem(Item item, int userId) throws Exception {
        ItemDetailsService detailsService = getService(item.getItemType());
        return detailsService.create(item, userId);
    }

    public static PublishDetails getPublishedDetails(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long itemId = MySql.decodeId(id, userId);
        return getPublishedDetails(itemId, userId);
    }

    private static PublishDetails getPublishedDetails(long itemId, int userId) throws Exception {
        PublishDetails publishDetails = new PublishDetails();

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_GetPublishedDetails (?,?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    boolean published = resultSet.getBoolean("published");
                    publishDetails.setPublished(published);
                }

                if (statement.getMoreResults()) {
                    resultSet = statement.getResultSet();
                    List<String> users = publishDetails.getUsers();
                    while (resultSet.next()) {
                        String username = resultSet.getString("username");
                        users.add(username);
                    }
                    if (!users.isEmpty()) {
                        publishDetails.setPublishType(PublishType.PRIVATE);
                    }
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return publishDetails;
    }

    public static VersionInfo getVersionInfo(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long itemId = MySql.decodeId(id, userId);
        return getVersionInfo(itemId, userId);
    }

    private static VersionInfo getVersionInfo(long itemId, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        VersionInfo versionInfo = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Get_VersionInfo (?,?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    versionInfo = new VersionInfo(
                            resultSet.getInt("version"),
                            resultSet.getInt("author_version")
                    );
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return versionInfo;
    }

    /********************************************************************************************/

    public static void addToShareList(List<ListObject> items, int userId, ShareList shareList) throws Exception {
        if (items != null) {
            for (ListObject item : items) {
                addToShareList(item, userId, shareList);
            }
        }
    }

    public static void addToShareList(ListObject item, int userId, ShareList shareList) throws Exception {
        if (item != null && item.getSid() == 0) {
            long id = MySql.decodeId(item.getId(), userId);
            if (id != 0) {
                addToShareList(id, userId, shareList);
            }
        }
    }

    public static void addToShareList(String id, int userId, ShareList shareList) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                addToShareList(decodeId, userId, shareList);
            }
        }
    }

    public static void addToShareList(long id, int userId, ShareList shareList) throws Exception {
        Item item = getItem(id, userId);
        addToShareList(item, userId, shareList);
    }

    public static void addToShareList(Item item, int userId, ShareList shareList) throws Exception {
        if (item != null && item.getSid() == 0) {
            ItemDetailsService itemDetailsService = getService(item.getItemType());
            itemDetailsService.addToShareList(item, userId, shareList);
        }
    }

    /********************************************************************************************/

    public static String addToMyStuff(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long itemId = MySql.decodeId(id, userId);
        if (itemId == 0) {
            return "0";
        }
        long newId = addToMyStuff(itemId, userId, true);
        return MySql.encodeId(newId, userId);
    }

    public static void addToMyStuff(List<ListObject> items, int userId) throws Exception {
        if (items != null) {
            for (ListObject item : items) {
                addToMyStuff(item, userId);
            }
        }
    }

    public static void addToMyStuff(ListObject item, int userId) throws Exception {
        if (item != null) {
            long id = MySql.decodeId(item.getId(), userId);
            if (id != 0) {
                long itemId = addToMyStuff(id, userId, false);
                item.setId(MySql.encodeId(itemId, userId));
            }
        }
    }

    public static void addToMyStuff(Item item, int userId) throws Exception {
        if (item != null) {
            long id = MySql.decodeId(item.getId(), userId);
            if (id != 0) {
                long itemId = addToMyStuff(id, userId, false);
                item.setId(MySql.encodeId(itemId, userId));
            }
        }
    }

    public static String addToMyStuff(String id, int userId) throws Exception {
        if (id != null && !id.equals("0")) {
            long decodeId = MySql.decodeId(id, userId);
            if (decodeId != 0) {
                long itemId = addToMyStuff(decodeId, userId, false);
                return MySql.encodeId(itemId, userId);
            }
        }
        return "0";
    }

    private static long addToMyStuff(long itemId, int userId, boolean checkRights) throws Exception {
        long authorItemId = 0;
        int authorUserId = 0;
        long existingItemId = 0;

        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_GetAddToMyStuffDetails (?,?,?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.setBoolean(3, checkRights);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();

                if (resultSet.next()) {
                    authorItemId = resultSet.getLong("author_item_id");
                    if (authorItemId == 0) {
                        throw new Exception("unable to find item to add");
                    }

                    authorUserId = resultSet.getInt("author_user_id");
                    existingItemId = resultSet.getLong("existing_item_id");

                    int authorItemTypeId = resultSet.getInt("author_item_type_id");
                    int existingItemTypeId = resultSet.getInt("existing_item_type_id");
                    if (existingItemId > 0 && authorItemTypeId != existingItemTypeId) {
                        throw new Exception("unable to update existing item");
                    }
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        Item authorItem = getItem(authorItemId, authorUserId);
        if (authorItem == null) {
            throw new Exception("unable to find item to add");
        }
        ListObject existingItem = null;
        if (existingItemId != 0) {
            existingItem = new ListObject(
                    MySql.encodeId(existingItemId, userId),
                    "",
                    0,
                    false
            );
        }

        ItemDetailsService itemDetailsService = getService(authorItem.getItemType());
        long newId = itemDetailsService.addToMyStuff(authorItem, authorUserId, existingItem, userId);
        if (newId < 1) {
            throw new Exception("unable to add item");
        }
        if (authorItem.getSid() == 0) {
            updateParentId(newId, authorItemId, authorItem.getVersion());
        }
        return newId;
    }

    public static void addSystemItem(long id, int userId) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("INSERT IGNORE INTO items_shared (item_id, user_id) VALUE (?,?);");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateParentId(long id, long parentId, int parentVersion) throws Exception {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();

            statement = connection.prepareStatement("UPDATE items SET published_parent_id = ?, published_parent_version = ?, version = ? WHERE id = ?;");
            statement.setLong(1, parentId);
            statement.setInt(2, parentVersion);

            // This is intentionally the same value as the previous column. Make sure the version matches the parent version whenever updating.
            statement.setInt(3, parentVersion);
            statement.setLong(4, id);
            statement.execute();

            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void publishItem(String id, PublishRequest publishRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long itemId = MySql.decodeId(id, userId);
        publishItem(itemId, publishRequest, userId);
    }

    private static long publishItem(long itemId, PublishRequest publishRequest, int userId) throws Exception {
        Connection connection = null;
        try {
            connection = MySql.getConnection();
            if (publishRequest.getPublishType() == PublishType.PUBLIC) {
                publishPublic(itemId, userId);
            } else if (publishRequest.getPublishType() == PublishType.PRIVATE) {
                publishPrivate(itemId, publishRequest.getUsers(), userId);
            } else {
                unPublish(itemId, connection, userId);
            }

            MySql.closeConnections(null, null, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, null, connection, e);
        }

        return itemId;
    }

    private static void publishPublic(long itemId, int userId) throws Exception {
        ShareList shareList = SharingUtilityService.getItemShareList(itemId, userId);
        SharingUtilityService.sharePublic(shareList, userId);
    }

    private static void publishPrivate(long itemId, List<String> users, int userId) throws Exception {
        if (users.isEmpty()) {
            return;
        }
        ShareList shareList = SharingUtilityService.getItemShareList(itemId, userId);
        SharingUtilityService.sharePrivate(shareList, users, userId);
    }

    private static void unPublish(long itemId, Connection connection, int userId) throws Exception {
        CallableStatement statement = null;
        try {
            statement = connection.prepareCall("{call Items_Share_UnPublish (?,?)}");
            statement.setLong(1, itemId);
            statement.setInt(2, userId);
            statement.execute();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static void updateItem(Item item, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long id = MySql.decodeId(item.getId(), userId);
        ItemDetailsService detailsService = getService(item.getItemType());
        boolean success = detailsService.update(item, id, userId);
        if (!success) {
            throw new Exception("Unable to update item");
        }

        PublishDetails publishDetails = getPublishedDetails(id, userId);
        if (publishDetails.getPublishType() == PublishType.PUBLIC) {
            publishPublic(id, userId);
        } else if (publishDetails.getPublishType() == PublishType.PRIVATE) {
            publishPrivate(id, publishDetails.getUsers(), userId);
        }
    }

    public static List<InUse> inUse(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        return inUse(decodedId, userId);
    }

    public static List<InUse> inUse(long id, int userId) throws Exception {
        List<InUse> results = new ArrayList<>();
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_InUse (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    results.add(InUseFactory.getInUse(resultSet, userId));
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return results;
    }

    public static void delete(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long decodedId = MySql.decodeId(id, userId);
        delete(decodedId, headers);
    }

    public static void delete(long id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        delete(id, userId);
    }

    public static void delete(long id, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        int result = -1;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call Items_Delete (?,?)}");
            statement.setLong(1, id);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    result = resultSet.getInt("result");
                }
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        if (result != 1) {
            throw new Exception("unable to delete");
        }
    }

    public static String duplicate(String id, String name, HttpHeaders headers) throws Exception {
        Item item = getItem(id, headers);
        if (item == null) {
            throw new Exception("item not found");
        }
        item.setId("0");
        item.setName(name);
        return createItem(item, headers);
    }

    public static List<CostUnit> getCostUnits(HttpHeaders headers) throws Exception {
        List<CostUnit> costUnits = new ArrayList<>();
        int userId = AuthenticationService.getUserId(headers);

        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareStatement("SELECT id AS cost_unit_id, name AS cost_unit_name, abbreviation AS cost_unit_abbreviation," +
                    " conversion_unit AS conversion_unit_id, conversion_value, weight AS cost_unit_weight FROM cost_units");
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                costUnits.add(getCostUnit(resultSet, userId));
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return costUnits;
    }

    public static CostUnit getCostUnit(ResultSet resultSet, int userId) throws Exception {
        return new CostUnit(
                MySql.encodeId(resultSet.getLong("cost_unit_id"), userId),
                resultSet.getString("cost_unit_name"),
                resultSet.getString("cost_unit_abbreviation"),
                MySql.encodeId(resultSet.getLong("conversion_unit_id"), userId),
                resultSet.getInt("conversion_value"),
                resultSet.getDouble("cost_unit_weight")
        );
    }

    /******************************** Damage Configurations *********************************/

    public static void updateDamages(long itemId, List<DamageConfiguration> damages, int userId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM item_damages WHERE item_id = ?");
            statement.setLong(1, itemId);
            statement.executeUpdate();

            if (!damages.isEmpty()) {
                statement = connection.prepareStatement("INSERT INTO `item_damages` (`item_id`, `num_dice`, `dice_size`, `ability_modifier_id`, `misc_mod`, `damage_type_id`, `versatile`) VALUES (?,?,?,?,?,?,?)");
                for (DamageConfiguration config : damages) {
                    statement.setLong(1, itemId);
                    statement.setInt(2, MySql.getValue(config.getValues().getNumDice(), 0, 99));
                    statement.setInt(3, config.getValues().getDiceSize().getValue());
                    MySql.setId(4, config.getValues().getAbilityModifier() == null ? null : config.getValues().getAbilityModifier().getId(), userId, statement);
                    statement.setInt(5, MySql.getValue(config.getValues().getMiscModifier(), 0, 99));
                    MySql.setId(6, config.getDamageType() == null ? null : config.getDamageType().getId(), userId, statement);
                    statement.setBoolean(7, config.isVersatile());
                    statement.addBatch();
                }
                statement.executeBatch();
                statement.close();
            }
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    public static List<DamageConfiguration> getDamageConfigurations(ResultSet resultSet, int userId) throws  Exception {
        List<DamageConfiguration> damageConfigurations = new ArrayList<>();
        while (resultSet.next()) {
            damageConfigurations.add(getDamageConfiguration(resultSet, userId));
        }
        return damageConfigurations;
    }

    private static DamageConfiguration getDamageConfiguration(ResultSet resultSet, int userId) throws Exception {
        return new DamageConfiguration(
                false,
                false,
                null,
                getDiceCollection(resultSet, userId),
                getDamageType(resultSet, userId),
                false,
                resultSet.getBoolean("versatile"),
                false,
                true
        );
    }

    private static DamageType getDamageType(ResultSet resultSet, int userId) throws Exception {
        long damageTypeId = resultSet.getLong("damage_type_id");
        if (damageTypeId == 0) {
            return null;
        }
        return new DamageType(
                MySql.encodeId(damageTypeId, userId),
                resultSet.getString("damage_type_name"),
                resultSet.getString("damage_type_description"),
                resultSet.getInt("damage_type_sid"),
                resultSet.getBoolean("damage_type_is_author"),
                resultSet.getInt("damage_type_version")
        );
    }

    private static DiceCollection getDiceCollection(ResultSet resultSet, int userId) throws Exception {
        return new DiceCollection(
                resultSet.getInt("num_dice"),
                DiceSize.valueOf(resultSet.getInt("dice_size")),
                getAbility(resultSet, userId),
                resultSet.getInt("misc_mod")
        );
    }

    private static Ability getAbility(ResultSet resultSet, int userId) throws Exception {
        long abilityId = resultSet.getLong("ability_modifier_id");
        if (abilityId == 0) {
            return null;
        }
        return new Ability(
                MySql.encodeId(abilityId, userId),
                resultSet.getString("ability_name"),
                resultSet.getString("ability_description"),
                resultSet.getInt("ability_sid"),
                resultSet.getBoolean("ability_is_author"),
                resultSet.getInt("ability_version"),
                resultSet.getString("abbr")
        );
    }
}
