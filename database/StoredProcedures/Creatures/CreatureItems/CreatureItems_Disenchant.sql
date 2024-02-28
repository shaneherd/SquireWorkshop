DROP PROCEDURE IF EXISTS CreatureItems_Disenchant;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Disenchant(
    IN creatureId INT UNSIGNED,
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN creatureItemStateId TINYINT UNSIGNED
)
BEGIN
    DECLARE originalQuantity SMALLINT UNSIGNED;
    DECLARE baseItemId INT UNSIGNED;
    DECLARE containerItemId INT UNSIGNED;
    DECLARE originalCreatureItemStateId TINYINT UNSIGNED;
    DECLARE equippedSlotId INT UNSIGNED;

    SELECT quantity, magic_item_type_id, container_id, creature_item_state_id, equipped_slot_id
    INTO originalQuantity, baseItemId, containerItemId, originalCreatureItemStateId, equippedSlotId
    FROM creature_items
    WHERE id = creatureItemId;

    IF creatureItemStateId IS NULL THEN
        SET creatureItemStateId = originalCreatureItemStateId;
    END IF;

    IF creatureItemStateId = 4 THEN -- expended
        SET containerItemId = NULL;
    END IF;

    IF creatureItemStateId = 3 THEN -- equipped
        INSERT INTO creature_items (creature_id, item_id, quantity, equipped_slot_id, container_id, expanded, poisoned, silvered, full, attuned, charges, cursed, magic_item_type_id, notes, creature_item_state_id) VALUES
        (creatureId, baseItemId, itemQuantity, equippedSlotId, null, 0, 0, 0, 0, 0, 0, 0, null, '', 3);

        SELECT LAST_INSERT_ID() AS creature_item_id;

        CALL CreatureActions_Items_Add(creatureId, baseItemId, null);
    ELSE
        CALL CreatureItems_Add(creatureId,baseItemId,itemQuantity,containerItemId,null, null,creatureItemStateId,0);
    END IF;

    IF itemQuantity = originalQuantity THEN
        CALL CreatureItems_Delete(creatureItemId);
        CALL CreatureActions_Items_Validate(creatureId);
    ELSE
        UPDATE creature_items SET quantity = quantity - 1 WHERE id = creatureItemId;
    END IF;
END;;

DELIMITER ;

# CALL CreatureItems_Disenchant(1, 1, 1);
