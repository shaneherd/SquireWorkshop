DROP PROCEDURE IF EXISTS CreatureItems_Equip;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Equip(
    IN creatureId INT UNSIGNED,
    IN creatureItemId INT UNSIGNED,
    IN equipmentSlotId INT UNSIGNED,
    IN containerItemId INT UNSIGNED
)
BEGIN
    DECLARE currentlyEquippedItemId INT UNSIGNED;
    DECLARE currentQuantity SMALLINT UNSIGNED;
    DECLARE equippedCreatureItemStateId TINYINT UNSIGNED;
    SET equippedCreatureItemStateId = 3;

    SET currentlyEquippedItemId = (SELECT id FROM creature_items WHERE creature_id = creatureId AND equipped_slot_id = equipmentSlotId);

    IF currentlyEquippedItemId IS NOT NULL THEN
        CALL CreatureItems_UnEquip(creatureId, currentlyEquippedItemId, containerItemId);
    END IF;

    SET currentQuantity = (SELECT quantity FROM creature_items WHERE id = creatureItemId);

    IF currentQuantity > 1 THEN
        UPDATE creature_items
        SET quantity = quantity - 1
        WHERE id = creatureItemId;

        INSERT INTO creature_items (creature_id, item_id, quantity, equipped_slot_id, creature_item_state_id, container_id, expanded, poisoned, silvered, full, attuned, charges, cursed, magic_item_type_id, notes)
        SELECT creatureId, item_id, 1, equipmentSlotId, equippedCreatureItemStateId, null, expanded, poisoned, silvered, full, attuned, charges, cursed, magic_item_type_id, notes FROM creature_items WHERE id = creatureItemId;

        SELECT LAST_INSERT_ID() AS creature_item_id;
    ELSE
        UPDATE creature_items
        SET equipped_slot_id = equipmentSlotId,
            container_id = NULL,
            creature_item_state_id = equippedCreatureItemStateId
        WHERE id = creatureItemId;

        SELECT creatureItemId AS creature_item_id;
    END IF;
END;;

DELIMITER ;

# CALL CreatureItems_Equip(1, 20, 3, 4);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id;
