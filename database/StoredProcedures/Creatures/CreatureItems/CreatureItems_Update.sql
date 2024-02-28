DROP PROCEDURE IF EXISTS CreatureItems_Update;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Update(
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN itemPoisoned BIT,
    IN itemSilvered BIT,
    IN itemFull BIT,
    IN itemAttuned BIT,
    IN itemCursed BIT
)
BEGIN
    DECLARE creatureId INT UNSIGNED;
    DECLARE itemId INT UNSIGNED;
    DECLARE containerItemId INT UNSIGNED;
    DECLARE magicItemTypeId INT UNSIGNED;
    DECLARE currentQuantity SMALLINT UNSIGNED;
    DECLARE currentCreatureItemStateId TINYINT UNSIGNED;
    DECLARE currentPoisoned BIT;
    DECLARE currentSilvered BIT;
    DECLARE currentFull BIT;
    DECLARE currentAttuned BIT;
    DECLARE currentCursed BIT;
    DECLARE currentNotes VARCHAR(100);
    DECLARE matchedItemId INT UNSIGNED;

    DECLARE isContainer BIT;
    DECLARE isMount BIT;
    DECLARE isVehicle BIT;
    DECLARE hasCharges BIT;
    DECLARE maxCharges SMALLINT UNSIGNED;
    DECLARE curseEffect VARCHAR(1000);
    DECLARE isCursed BIT;
    DECLARE useMatch BIT;
    DECLARE allowAdditionalSpells BIT;
    DECLARE isScroll BIT;

    SELECT creature_id, item_id, container_id, quantity, creature_item_state_id, poisoned, silvered, full, attuned, cursed, magic_item_type_id, notes
    INTO creatureId, itemId, containerItemId, currentQuantity, currentCreatureItemStateId, currentPoisoned, currentSilvered, currentFull, currentAttuned, currentCursed, magicItemTypeId, currentNotes
    FROM creature_items
    WHERE id = creatureItemId;

    SELECT container, item_type_id = 6, item_type_id = 10, mi.max_charges, mi.curse_effect, mi.additional_spells, mi.magical_item_type_id = 5
    INTO isContainer, isMount, isVehicle, maxCharges, curseEffect, allowAdditionalSpells, isScroll
    FROM items i
         LEFT JOIN magical_items mi ON mi.item_id = i.id
    WHERE id = itemId;

    IF allowAdditionalSpells IS NULL THEN
        SET allowAdditionalSpells = 0;
    END IF;

    IF isScroll IS NULL THEN
        SET isScroll = 0;
    END IF;

    SET hasCharges = (maxCharges IS NOT NULL AND maxCharges > 0);
    SET isCursed = curseEffect IS NOT NULL AND curseEffect != '';

    SET useMatch = (NOT isContainer AND NOT isMount AND NOT isVehicle AND NOT hasCharges AND NOT allowAdditionalSpells AND NOT isCursed AND NOT isScroll);

    SELECT
            IF(itemPoisoned IS NULL, currentPoisoned, itemPoisoned),
            IF(itemSilvered IS NULL, currentSilvered, itemSilvered),
            IF(itemFull IS NULL, currentFull, itemFull),
            IF(itemAttuned IS NULL, currentAttuned, itemAttuned),
            IF(itemCursed IS NULL, currentCursed, itemCursed)
    INTO itemPoisoned, itemSilvered, itemFull, itemAttuned, itemCursed;

    IF itemQuantity > currentQuantity THEN
        SET itemQuantity = currentQuantity;
    END IF;

    IF useMatch THEN
        SET matchedItemId = (
            SELECT id
            FROM creature_items
            WHERE
                creature_id = creatureId
                AND item_id = itemId
                AND equipped_slot_id IS NULL
                AND ((container_id IS NULL AND containerItemId IS NULL) OR container_id = containerItemId)
                AND creature_item_state_id = currentCreatureItemStateId
                AND poisoned = itemPoisoned
                AND silvered = itemSilvered
                AND full = itemFull
                AND attuned = itemAttuned
                AND cursed = itemCursed
                AND charges = 0
                AND ((magic_item_type_id IS NULL AND magicItemTypeId IS NULL) OR magic_item_type_id = magicItemTypeId)
                AND ((notes IS NULL AND currentNotes IS NULL) OR notes = currentNotes)
            LIMIT 1);
    ELSE
        SET matchedItemId = NULL;
    END IF;

    IF itemQuantity = currentQuantity THEN
        IF matchedItemId IS NULL THEN
            # update original item properties
            UPDATE creature_items
            SET poisoned = itemPoisoned,
                silvered = itemSilvered,
                full = itemFull,
                attuned = itemAttuned,
                cursed = itemCursed
            WHERE id = creatureItemId;

            SELECT creatureItemId AS creature_item_id;
        ELSE
            # update matched item quantity
            UPDATE creature_items
            SET quantity = quantity + itemQuantity
            WHERE id = matchedItemId;

            # delete the original item
            CALL CreatureItems_Delete(creatureItemId);

            SELECT matchedItemId AS creature_item_id;
        END IF;
    ELSE
        IF matchedItemId IS NULL THEN
            # insert new item
            INSERT INTO creature_items (creature_id, item_id, quantity, equipped_slot_id, creature_item_state_id, container_id, expanded, poisoned, silvered, full, attuned, charges, cursed, magic_item_type_id, notes)
            SELECT creature_id, item_id, itemQuantity, null, creature_item_state_id, container_id, expanded, itemPoisoned, itemSilvered, itemFull, itemAttuned, charges, itemCursed, magic_item_type_id, notes FROM creature_items WHERE id = creatureItemId;

            SELECT LAST_INSERT_ID() AS creature_item_id;
        ELSE
            # update matched item quantity
            UPDATE creature_items
            SET quantity = quantity + itemQuantity
            WHERE id = matchedItemId;

            SELECT matchedItemId AS creature_item_id;
        END IF;

        # update original quantity
        UPDATE creature_items
        SET quantity = quantity - itemQuantity
        WHERE id = creatureItemId;
    END IF;
END;;

DELIMITER ;

# CALL CreatureItems_Update(17, 1, null, null, null, 1, null);
# CALL CreatureItems_Update(17, 1, null, null, null, 0, null);
# select * from creature_items
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
# where ci.id = 30