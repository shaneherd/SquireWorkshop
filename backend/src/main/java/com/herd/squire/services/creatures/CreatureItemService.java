package com.herd.squire.services.creatures;

import com.herd.squire.models.Tag;
import com.herd.squire.models.attributes.CharacterLevel;
import com.herd.squire.models.creatures.*;
import com.herd.squire.models.items.*;
import com.herd.squire.models.items.magical_item.MagicalItemSpellConfiguration;
import com.herd.squire.models.powers.SpellListObject;
import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.items.ItemService;
import com.herd.squire.services.powers.SpellService;
import com.herd.squire.utilities.MySql;

import javax.ws.rs.core.HttpHeaders;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CreatureItemService {
    public static List<CreatureItem> getItems(String id, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return getItems(creatureId, userId);
    }

    public static List<CreatureItem> getItems(Statement statement, ResultSet resultSet, int userId) throws Exception {
        List<CreatureItem> items = new ArrayList<>();
        Map<String, CreatureItem> creatureItemMap = new HashMap<>();
        Map<String, Item> itemMap = new HashMap<>();
        Map<String, Item> magicItemMap = new HashMap<>();
        Map<String, List<CreatureItem>> containersMap = new HashMap<>();
        int count = 0;
        int magicItemCount = 0;

        // Creature Items
        while(resultSet.next()) {
            CreatureItem creatureItem = getCreatureItem(resultSet, userId);
            creatureItemMap.put(creatureItem.getId(), creatureItem);
            if (creatureItem.isContainer() || creatureItem.getItemType() == ItemType.MOUNT || creatureItem.getItemType() == ItemType.VEHICLE) {
                List<CreatureItem> mapItems = containersMap.computeIfAbsent(creatureItem.getItem().getId(), k -> new ArrayList<>());
                mapItems.add(creatureItem);
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                count = resultSet.getInt("item_count");
            }
        }

        // Items
        for (int i = 0; i < count; i++) {
            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    Item item = ItemService.getItem(statement, resultSet, userId);
                    if (item != null) {
                        itemMap.put(item.getId(), item);
                    }
                }
            }
        }

        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            if (resultSet.next()) {
                magicItemCount = resultSet.getInt("magic_item_count");
            }
        }

        // Magic Sub Items
        for (int i = 0; i < magicItemCount; i++) {
            if (statement.getMoreResults()) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    Item item = ItemService.getItem(statement, resultSet, userId);
                    magicItemMap.put(item.getId(), item);
                }
            }
        }

        // Spells
        List<MagicalItemSpellConfiguration> configs = new ArrayList<>();
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            while (resultSet.next()) {
                String creatureItemId = MySql.encodeId(resultSet.getLong("creature_item_id"), userId);
                CreatureItem creatureItem = creatureItemMap.get(creatureItemId);
                if (creatureItem != null) {
                    MagicalItemSpellConfiguration config = getMagicalItemSpellConfiguration(resultSet, userId);
                    creatureItem.getSpells().add(config);
                    configs.add(config);
                }
            }
        }

        // Spell Tags
        if (statement.getMoreResults()) {
            resultSet = statement.getResultSet();
            Map<Long, List<Tag>> map = new HashMap<>();
            while (resultSet.next()) {
                long powerId = resultSet.getLong("power_id");
                List<Tag> tags = map.computeIfAbsent(powerId, k -> new ArrayList<>());
                tags.add(SpellService.getTag(resultSet, userId));
            }

            for (MagicalItemSpellConfiguration config : configs) {
                SpellListObject spell = config.getSpell();
                long powerId = MySql.decodeId(spell.getId(), userId);
                List<Tag> tags = map.get(powerId);
                if (tags != null) {
                    spell.setTags(tags);
                }
            }
        }

        // Add Item to CreatureItem
        // Add CreatureItem to Container
        for (Map.Entry<String, CreatureItem> entry : creatureItemMap.entrySet()) {
            CreatureItem creatureItem = entry.getValue();
            Item item = itemMap.get(creatureItem.getItem().getId());
            creatureItem.setItem(item);

            if (creatureItem.getMagicalItem() != null) {
                Item magicItem = magicItemMap.get(creatureItem.getMagicalItem().getId());
                creatureItem.setMagicalItem(magicItem);
            }

            if (creatureItem.getContainerId().equals("0")) {
                items.add(creatureItem);
            } else {
                CreatureItem container = creatureItemMap.get(creatureItem.getContainerId());
                if (container == null) {
                    items.add(creatureItem);
                } else {
                    container.getItems().add(creatureItem);
                }
            }
        }

        // Update creature item names for containers
        for (Map.Entry<String, List<CreatureItem>> entry : containersMap.entrySet()) {
            List<CreatureItem> containers = entry.getValue();
            if (containers.size() > 1) {
                for (int i = 0; i < containers.size(); i++) {
                    CreatureItem container = containers.get(i);
                    container.setName(container.getName() + " - " + (i + 1));
                }
            }
        }

        sortCreatureItems(items);
        return items;
    }

    private static MagicalItemSpellConfiguration getMagicalItemSpellConfiguration(ResultSet resultSet, int userId) throws Exception {
        SpellListObject spell = new SpellListObject(
                MySql.encodeId(resultSet.getLong("spell_id"), userId),
                resultSet.getString("spell_name"),
                resultSet.getInt("spell_sid"),
                resultSet.getBoolean("spell_is_author"),
                resultSet.getInt("spell_level")
        );

        return new MagicalItemSpellConfiguration(
                spell,
                resultSet.getBoolean("additional"),
                resultSet.getInt("stored_level"),
                getCasterLevel(resultSet, userId),
                resultSet.getBoolean("allow_casting_at_higher_level"),
                resultSet.getInt("charges"),
                resultSet.getInt("charges_per_level_above_stored_level"),
                resultSet.getInt("max_level"),
                resultSet.getBoolean("remove_on_casting"),
                resultSet.getBoolean("override_spell_attack_calculation"),
                resultSet.getInt("spell_attack_modifier"),
                resultSet.getInt("spell_save_dc")
        );
    }

    private static CharacterLevel getCasterLevel(ResultSet resultSet, int userId) throws Exception {
        long levelId = resultSet.getLong("caster_level_id");
        CharacterLevel characterLevel = null;
        if (levelId != 0) {
            characterLevel = new CharacterLevel(
                    MySql.encodeId(levelId, userId),
                    resultSet.getString("level_name"),
                    resultSet.getString("level_description"),
                    resultSet.getInt("level_sid"),
                    resultSet.getBoolean("level_is_author"),
                    resultSet.getInt("level_version"),
                    resultSet.getInt("min_exp"),
                    resultSet.getInt("prof_bonus")
            );
        }
        return characterLevel;
    }

    public static List<CreatureItem> getItems(long creatureId, int userId) throws Exception {
        List<CreatureItem> items = new ArrayList<>();

        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call CreatureItems_Get (?,?)}");
            statement.setLong(1, creatureId);
            statement.setInt(2, userId);
            boolean hasResult = statement.execute();
            ResultSet resultSet = null;
            if (hasResult) {
                resultSet = statement.getResultSet();
                items = getItems(statement, resultSet, userId);
            }

            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return items;
    }

    private static void sortCreatureItems(List<CreatureItem> items) {
        items.sort((left, right) -> {
            if (left.getCreatureItemState() == CreatureItemState.EQUIPPED && right.getCreatureItemState() != CreatureItemState.EQUIPPED) {
                return -1;
            } else if (left.getCreatureItemState() != CreatureItemState.EQUIPPED && right.getCreatureItemState() == CreatureItemState.EQUIPPED) {
                return 1;
            } else if (left.getCreatureItemState() == CreatureItemState.EQUIPPED && right.getCreatureItemState() == CreatureItemState.EQUIPPED) {
                int diff = left.getEquipmentSlot().getEquipmentSlotType().getValue() - right.getEquipmentSlot().getEquipmentSlotType().getValue();
                if (diff == 0) {
                    return left.getEquipmentSlot().getName().toLowerCase().compareTo(right.getEquipmentSlot().getName().toLowerCase());
                } else {
                    return diff;
                }
            } else {
                return left.getName().toLowerCase().compareTo(right.getName().toLowerCase());
            }
        });

        for (CreatureItem creatureItem : items) {
            if (!creatureItem.getItems().isEmpty()) {
                sortCreatureItems(creatureItem.getItems());
            }
        }
    }

    private static CreatureItem getCreatureItem(ResultSet resultSet, int userId) throws Exception {
        return new CreatureItem(
                MySql.encodeId(resultSet.getLong("id"), userId),
                new Item(MySql.encodeId(resultSet.getLong("item_id"), userId)),
                ItemType.valueOf(resultSet.getInt("item_type_id")),
                resultSet.getInt("quantity"),
                new EquipmentSlot(MySql.encodeId(resultSet.getLong("equipped_slot_id"), userId), resultSet.getString("equipped_slot_name"), EquipmentSlotType.valueOf(resultSet.getInt("equipment_slot_type_id"))),
                resultSet.getDouble("weight"),
                MySql.encodeId(resultSet.getLong("container_id"), userId),
                resultSet.getBoolean("is_container"),
                resultSet.getBoolean("ignore_weight"),
                resultSet.getBoolean("expanded"),
                resultSet.getBoolean("poisoned"),
                resultSet.getBoolean("silvered"),
                resultSet.getBoolean("full"),
                resultSet.getBoolean("attuned"),
                resultSet.getBoolean("cursed"),
                resultSet.getInt("charges_remaining"),
                resultSet.getInt("max_charges"),
                getMagicalItem(resultSet, userId),
                CreatureItemState.valueOf(resultSet.getInt("creature_item_state_id")),
                resultSet.getString("notes")
        );
    }

    public static Item getMagicalItem(ResultSet resultSet, int userId) throws Exception {
        long id = resultSet.getLong("magic_item_type_id");
        if (id == 0) {
            return null;
        }
        return new Item(MySql.encodeId(id, userId));
//        return new ItemListObject(
//                MySql.encodeId(id, userId),
//                resultSet.getString("magic_item_type_name"),
//                resultSet.getInt("magic_item_type_sid"),
//                resultSet.getBoolean("magic_item_type_is_author"),
//                resultSet.getInt("magic_item_type_cost"),
//                MySql.encodeId(resultSet.getLong("magic_item_type_cost_unit"), userId),
//                ItemType.valueOf(resultSet.getInt("magic_item_type_item_type_id"))
//        );
    }

    public static List<AddItemResponse> addItems(String id, CreatureInventory creatureInventory, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        return addItems(creatureId, creatureInventory, userId);
    }

    public static List<AddItemResponse> addItems(long creatureId, CreatureInventory creatureInventory, int userId) throws Exception {
        if (creatureInventory.getItems().isEmpty()) {
            return new ArrayList<>();
        }

        long containerId = MySql.decodeId(creatureInventory.getContainerId(), userId);
        Connection connection = null;
        CallableStatement statement = null;
        List<AddItemResponse> responses = new ArrayList<>();
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call CreatureItems_Add (?,?,?,?,?,?,?,?)}"); //creatureId, itemId, itemQuantity, containerItemId, magicItemTypeId, spellId, creatureItemStateId, itemCursed

            for (SelectionItem item : creatureInventory.getItems()) {
                if (item.getItem().getSubItems().isEmpty()) {
                    Long creatureItemId = addCreatureItem(statement, creatureId, item, containerId, userId);
                    if (creatureItemId != null) {
                        AddItemResponse response = new AddItemResponse(
                                item.getItem(),
                                MySql.encodeId(creatureItemId, userId)
                        );
                        responses.add(response);
                    }
                } else {
                    for (ItemQuantity subItem : item.getItem().getSubItems()) {
                        SelectionItem selectionItem = new SelectionItem(subItem.getItem(), subItem.getQuantity(), subItem.getItem().getSubItem());
                        Long creatureItemId = addCreatureItem(statement, creatureId, selectionItem, containerId, userId);
                        if (creatureItemId != null) {
                            AddItemResponse response = new AddItemResponse(
                                    subItem.getItem(),
                                    MySql.encodeId(creatureItemId, userId)
                            );
                            responses.add(response);
                        }
                    }
                }
            }
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }

        return responses;
    }

    private static Long addCreatureItem(CallableStatement statement, long creatureId, SelectionItem selectionItem, long containerId, int userId) throws Exception {
        Long id = null;

        long itemId = MySql.decodeId(selectionItem.getItem().getId(), userId);
        if (itemId > -1) {
            statement.setLong(1, creatureId);
            statement.setLong(2, itemId);
            statement.setInt(3, MySql.getValue(selectionItem.getQuantity(), 0, 9999));
            statement.setLong(4, containerId);
            MySql.setId(5, selectionItem.getSelectedApplicableItem() == null ? null : selectionItem.getSelectedApplicableItem().getId(), userId, statement);
            MySql.setId(6, selectionItem.getSelectedSpell() == null ? null : selectionItem.getSelectedSpell().getId(), userId, statement);
            statement.setInt(7, CreatureItemState.CARRIED.getValue());
            statement.setBoolean(8, false);
            boolean hasResult = statement.execute();
            if (hasResult) {
                ResultSet resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
        }

        return id;
    }

    public static void updateItems(CreatureItemsRequest request, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        updateItems(request.getItems(), userId);
    }

    private static void updateItems(List<CreatureItemRequest> items, int userId) throws Exception {
        if (items.isEmpty()) {
            return;
        }
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            statement = connection.prepareStatement("UPDATE creature_items SET charges = ?, attuned = ? WHERE id = ?");
            for (CreatureItemRequest request : items) {
                statement.setInt(1, request.getCharges());
                statement.setBoolean(2, request.isAttuned());
                MySql.setId(3, request.getCreatureItemId(), userId, statement);
                statement.addBatch();
            }
            statement.executeBatch();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    public static void updateExpanded(String itemId, boolean expanded, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureItemId = MySql.decodeId(itemId, userId);
        updateExpanded(creatureItemId, expanded);
    }

    public static String performCreatureItemAction(String id, String itemId, CreatureItemAction creatureItemAction, CreatureItemActionRequest creatureItemActionRequest, HttpHeaders headers) throws Exception {
        int userId = AuthenticationService.getUserId(headers);
        long creatureId = MySql.decodeId(id, userId);
        long creatureItemId = MySql.decodeId(itemId, userId);
        return performCreatureItemAction(creatureId, creatureItemId, creatureItemAction, creatureItemActionRequest, userId);
    }

    private static String performCreatureItemAction(long creatureId, long creatureItemId, CreatureItemAction action, CreatureItemActionRequest request, int userId) throws Exception {
        switch (action) {
            case EQUIP:
            case MOUNT:
                return equipItem(creatureId, creatureItemId, request, userId);
            case UNEQUIP:
            case DISMOUNT:
                return unEquipItem(creatureId, creatureItemId, request, userId);
            case DROP:
            case STABLE:
                return dropItem(creatureId, creatureItemId, request, userId);
            case PICKUP:
            case UNSTABLE:
                return pickupItem(creatureId, creatureItemId, request, false, userId);
            case EXPEND:
                return expendItem(creatureId, creatureItemId, request, userId);
            case PICKUP_EXPENDED:
                return pickupItem(creatureId, creatureItemId, request, true, userId);
            case SELL:
            case DISCARD:
            case USE:
                discardItem(creatureItemId, request, userId);
                break;
            case MOVE:
                return moveItem(creatureId, creatureItemId, request, userId);
            case EMPTY:
                emptyItem(creatureItemId, request, userId);
                break;
            case GAIN:
                gainItem(creatureItemId, request);
                break;
            case POISON:
                return updateItem(creatureItemId, request.getQuantity(), true, null, null, null, null, userId);
            case REMOVE_POISON:
                return updateItem(creatureItemId, request.getQuantity(), false, null, null, null, null, userId);
            case SILVER:
                return updateItem(creatureItemId, request.getQuantity(), null, true, null, null, null, userId);
            case REMOVE_SILVER:
                return updateItem(creatureItemId, request.getQuantity(), null, false, null, null, null, userId);
//            case ENCHANT:
//                break;
            case DISENCHANT:
                return disenchantItem(creatureId, creatureItemId, request.getQuantity(), userId);
            case SPELLS:
                updateSpells(creatureItemId, request.getSpells(), userId);
                break;
            case REMOVE_CURSE:
                return updateItem(creatureItemId, request.getQuantity(), null, null, null, null, false, userId);
            case ATTUNE:
                return updateItem(creatureItemId, request.getQuantity(), null, null, null, true, null, userId);
            case UNATTUNE:
                return updateItem(creatureItemId, request.getQuantity(), null, null, null, false, null, userId);
            case CHARGES:
                return updateItem(creatureItemId, request.getQuantity(), null, null, null, null, null, userId);
        }

        return MySql.encodeId(creatureItemId, userId);
    }

    private static void discardItem(long creatureItemId, CreatureItemActionRequest request, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            //CreatureItems_Discard - creatureItemId bigint, itemQuantity int
            statement = connection.prepareCall("{call CreatureItems_Discard (?,?)}");
            statement.setLong(1, creatureItemId);
            statement.setInt(2, request.getQuantity());
            statement.execute();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static String dropItem(long creatureId, long creatureItemId, CreatureItemActionRequest request, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            //CreatureItems_Drop - creatureId int, creatureItemId bigint, itemQuantity int, containerItemId int
            statement = connection.prepareCall("{call CreatureItems_Drop (?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureItemId);
            statement.setInt(3, request.getQuantity());
            MySql.setId(4, request.getContainerId(), userId, statement);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return MySql.encodeId(id, userId);
    }

    private static String expendItem(long creatureId, long creatureItemId, CreatureItemActionRequest request, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            //CreatureItems_Expend - creatureId int, creatureItemId bigint, itemQuantity int, containerItemId int
            statement = connection.prepareCall("{call CreatureItems_Expend (?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureItemId);
            statement.setInt(3, request.getQuantity());
            MySql.setId(4, request.getContainerId(), userId, statement);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return MySql.encodeId(id, userId);
    }

    private static String equipItem(long creatureId, long creatureItemId, CreatureItemActionRequest request, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            //CreatureItems_Equip - creatureId int, creatureItemId bigint, equipmentSlotId int, containerItemId int
            statement = connection.prepareCall("{call CreatureItems_Equip (?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureItemId);
            MySql.setId(3, request.getEquipmentSlotId(), userId, statement);
            MySql.setId(4, request.getContainerId(), userId, statement);

            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return MySql.encodeId(id, userId);
    }

    private static void gainItem(long creatureItemId, CreatureItemActionRequest request) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            //CreatureItems_Gain - creatureItemId bigint, itemQuantity int
            statement = connection.prepareCall("{call CreatureItems_Gain (?,?)}");
            statement.setLong(1, creatureItemId);
            statement.setInt(2, request.getQuantity());

            statement.execute();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static String moveItem(long creatureId, long creatureItemId, CreatureItemActionRequest request, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            //CreatureItems_Move - creatureId int, creatureItemId bigint, itemQuantity int, containerItemId int, toDropped bit
            statement = connection.prepareCall("{call CreatureItems_Move (?,?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureItemId);
            statement.setInt(3, request.getQuantity());
            MySql.setId(4, request.getContainerId(), userId, statement);
            statement.setNull(5, java.sql.Types.BIT);

            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return MySql.encodeId(id, userId);
    }

    private static void emptyItem(long creatureItemId, CreatureItemActionRequest request, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            //CreatureItems_EmptyContainer - creatureItemId BIGINT, containerItemId BIGINT
            statement = connection.prepareCall("{call CreatureItems_EmptyContainer (?,?)}");
            statement.setLong(1, creatureItemId);
            MySql.setId(2, request.getContainerId(), userId, statement);
            statement.execute();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static String pickupItem(long creatureId, long creatureItemId, CreatureItemActionRequest request, boolean discardRemaining, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            //CreatureItems_Pickup - creatureId int, creatureItemId bigint, itemQuantity int, containerItemId int, discardRemaining bit
            statement = connection.prepareCall("{call CreatureItems_Pickup (?,?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureItemId);
            statement.setInt(3, request.getQuantity());
            MySql.setId(4, request.getContainerId(), userId, statement);
            statement.setBoolean(5, discardRemaining);
            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return MySql.encodeId(id, userId);
    }

    private static String unEquipItem(long creatureId, long creatureItemId, CreatureItemActionRequest request, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            //CreatureItems_UnEquip - creatureId int, creatureItemId bigint, containerItemId int
            statement = connection.prepareCall("{call CreatureItems_UnEquip (?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureItemId);
            MySql.setId(3, request.getContainerId(), userId, statement);

            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }
        return MySql.encodeId(id, userId);
    }

    private static String disenchantItem(long creatureId, long creatureItemId, int quantity, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            statement = connection.prepareCall("{call CreatureItems_Disenchant (?,?,?,?)}");
            statement.setLong(1, creatureId);
            statement.setLong(2, creatureItemId);
            statement.setInt(3, quantity);
            statement.setNull(4, java.sql.Types.INTEGER);

            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return MySql.encodeId(id, userId);
    }

    private static String updateItem(long creatureItemId, int quantity, Boolean poisoned, Boolean silvered, Boolean full, Boolean attuned, Boolean cursed, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        ResultSet resultSet = null;
        long id = 0;
        try {
            connection = MySql.getConnection();
            //CreatureItems_Update - creatureItemId BIGINT, itemQuantity INT, itemPoisoned BIT, itemSilvered BIT, itemFull BIT, itemAttuned BIT, itemCursed BIT
            statement = connection.prepareCall("{call CreatureItems_Update (?,?,?,?,?,?,?)}");
            statement.setLong(1, creatureItemId);
            statement.setInt(2, quantity);
            MySql.setBoolean(3, poisoned, statement);
            MySql.setBoolean(4, silvered, statement);
            MySql.setBoolean(5, full, statement);
            MySql.setBoolean(6, attuned, statement);
            MySql.setBoolean(7, cursed, statement);

            boolean hasResult = statement.execute();
            if (hasResult) {
                resultSet = statement.getResultSet();
                if (resultSet.next()) {
                    id = resultSet.getLong("creature_item_id");
                }
            }
            MySql.closeConnections(resultSet, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(resultSet, statement, connection, e);
        }

        return MySql.encodeId(id, userId);
    }

    private static void updateExpanded(long creatureItemId, boolean expanded) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            //CreatureItems_UpdateExpanded - creatureItemId BIGINT, isExpanded BIT
            statement = connection.prepareCall("{call CreatureItems_UpdateExpanded (?,?)}");
            statement.setLong(1, creatureItemId);
            statement.setBoolean(2, expanded);
            statement.execute();
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void updateSpells(long creatureItemId, List<MagicalItemSpellConfiguration> spells, int userId) throws Exception {
        Connection connection = null;
        CallableStatement statement = null;
        try {
            connection = MySql.getConnection();
            connection.setAutoCommit(false);
            deleteSpellConfigurations(creatureItemId, connection);
            addSpellConfigurations(creatureItemId, spells, userId, connection);
            connection.commit();
            MySql.closeConnections(null, statement, connection);
        } catch (Exception e) {
            MySql.closeConnectionsAndThrow(null, statement, connection, e);
        }
    }

    private static void deleteSpellConfigurations(long creatureItemId, Connection connection) throws Exception {
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("DELETE FROM `creature_item_spells` WHERE creature_item_id = ?");
            statement.setLong(1, creatureItemId);
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            if (statement != null) {
                statement.close();
            }
            throw e;
        }
    }

    private static void addSpellConfigurations(long creatureItemId, List<MagicalItemSpellConfiguration> spells, int userId, Connection connection) throws Exception {
        if (spells.isEmpty()) {
            return;
        }
        PreparedStatement statement = null;
        try {
            statement = connection.prepareStatement("INSERT INTO creature_item_spells (creature_item_id, spell_id, stored_level, charges, allow_casting_at_higher_level, charges_per_level_above_stored_level, max_level, remove_on_casting, override_spell_attack_calculation, spell_attack_modifier, spell_save_dc, caster_level_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
            for (MagicalItemSpellConfiguration config : spells) {
                statement.setLong(1, creatureItemId);
                MySql.setId(2, config.getSpell().getId(), userId, statement);
                statement.setInt(3, config.getStoredLevel());
                statement.setInt(4, config.getCharges());
                statement.setBoolean(5, config.isAllowCastingAtHigherLevel());
                statement.setInt(6, config.getChargesPerLevelAboveStoredLevel());
                statement.setInt(7, config.getMaxLevel());
                statement.setBoolean(8, config.isRemoveOnCasting());
                statement.setBoolean(9, config.isOverrideSpellAttackCalculation());
                statement.setInt(10, config.getSpellAttackModifier());
                statement.setInt(11, config.getSpellSaveDC());
                MySql.setId(12, config.getCasterLevel() == null ? null : config.getCasterLevel().getId(), userId, statement);
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
}
