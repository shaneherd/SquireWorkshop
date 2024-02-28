DROP PROCEDURE IF EXISTS CreatureItems_Add;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Add(
    IN creatureId INT UNSIGNED,
    IN itemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN containerItemId INT UNSIGNED,
    IN magicItemTypeId INT UNSIGNED,
    IN spellId INT UNSIGNED,
    IN creatureItemStateId TINYINT UNSIGNED,
    IN itemCursed BIT
)
BEGIN
    DECLARE x SMALLINT UNSIGNED;
    DECLARE creatureItemId INT UNSIGNED;
    DECLARE matchedItemId INT UNSIGNED;
    DECLARE check1 BIT;
    DECLARE check2 BIT;
    DECLARE check3 BIT;
    DECLARE isContainer BIT;
    DECLARE isMount BIT;
    DECLARE isVehicle BIT;
    DECLARE isScroll BIT;
    DECLARE hasCharges BIT;
    DECLARE maxCharges SMALLINT UNSIGNED;
    DECLARE isPack BIT;
    DECLARE curseEffect VARCHAR(1000);
    DECLARE isCursed BIT;
    DECLARE allowAdditionalSpells BIT;

    SET max_sp_recursion_depth = 1;
    SET check1 = (SELECT 1 FROM items WHERE id = itemId);
    SET check2 = (SELECT 1 FROM creature_items WHERE id = containerItemId);
    SET check3 = (SELECT 1 FROM creatures WHERE id = creatureId);

    IF containerItemId = 0 THEN
        SET containerItemId = NULL;
    END IF;

    IF check1 IS NOT NULL AND (containerItemId IS NULL OR check2 IS NOT NULL) AND check3 IS NOT NULL THEN
        SELECT container, item_type_id = 6, item_type_id = 10, item_type_id = 8, mi.max_charges, mi.curse_effect, mi.additional_spells, mi.magical_item_type_id = 5
        INTO isContainer, isMount, isVehicle, isPack, maxCharges, curseEffect, allowAdditionalSpells, isScroll
        FROM items i
            LEFT JOIN magical_items mi ON mi.item_id = i.id
        WHERE id = itemId;

        IF maxCharges IS NULL THEN
            SET maxCharges = 0;
        END IF;

        IF allowAdditionalSpells IS NULL THEN
            SET allowAdditionalSpells = 0;
        END IF;

        IF isScroll IS NULL THEN
            SET isScroll = 0;
        END IF;

        SET hasCharges = (maxCharges > 0);
        SET isCursed = curseEffect IS NOT NULL AND curseEffect != '';

        IF isPack THEN
            CALL CreatureItems_AddPackItems(creatureId, itemId, itemQuantity, containerItemId, creatureItemStateId);
        ELSEIF isContainer OR isMount OR isVehicle OR hasCharges OR isCursed OR allowAdditionalSpells OR isScroll OR spellId IS NOT NULL THEN
            SET x = 1;
            uniqueLoop: LOOP
                IF x > itemQuantity THEN
                    LEAVE uniqueLoop;
                END IF;

                INSERT INTO creature_items (creature_id, item_id, quantity, container_id, creature_item_state_id, magic_item_type_id, charges, cursed) VALUE
                (creatureId, itemId, 1, containerItemId, creatureItemStateId, magicItemTypeId, maxCharges, isCursed);

                SET creatureItemId = (SELECT LAST_INSERT_ID());
                SELECT creatureItemId AS creature_item_id;

                IF spellId IS NOT NULL THEN
                    CALL CreatureItems_AddSpell(creatureItemId, spellId);
                END IF;

                SET  x = x + 1;
            END LOOP;

            CALL CreatureActions_Items_Add(creatureId, itemId, magicItemTypeId);
        ELSE
            SET matchedItemId = (SELECT id
                FROM creature_items ci
                WHERE
                    ci.item_id = itemId
                    AND creature_id = creatureId
                    AND equipped_slot_id IS NULL
                    AND ((container_id IS NULL AND containerItemId IS NULL) OR container_id = containerItemId)
                    AND creature_item_state_id = creatureItemStateId
                    AND poisoned = 0
                    AND silvered = 0
                    AND full = 0
                    AND attuned = 0
                    AND cursed = itemCursed
                    AND ((magic_item_type_id IS NULL AND magicItemTypeId IS NULL) OR magic_item_type_id = magicItemTypeId)
                    AND (notes IS NULL OR notes = '')
                LIMIT 1);

            IF matchedItemId IS NULL THEN
                INSERT INTO creature_items (creature_id, item_id, quantity, container_id, creature_item_state_id, magic_item_type_id, cursed) VALUE
                (creatureId, itemId, itemQuantity, containerItemId, creatureItemStateId, magicItemTypeId, isCursed);

                SELECT LAST_INSERT_ID() AS creature_item_id;

                CALL CreatureActions_Items_Add(creatureId, itemId, magicItemTypeId);
            ELSE
                UPDATE creature_items
                SET quantity = quantity + itemQuantity
                WHERE id = matchedItemId;

                SELECT matchedItemId AS creature_item_id;
            END IF;
        END IF;
    END IF;

END;;

DELIMITER ;

# CALL CreatureItems_Add(1, 2, 1, 0, null, null, 1, 0);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id;

# select * from creature_items where id = 0
