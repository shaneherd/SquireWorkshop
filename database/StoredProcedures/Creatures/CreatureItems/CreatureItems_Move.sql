DROP PROCEDURE IF EXISTS CreatureItems_Move;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Move(
    IN creatureId INT UNSIGNED,
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN containerItemId INT UNSIGNED,
    IN toCreatureItemStateId TINYINT UNSIGNED
)
BEGIN
    DECLARE currentQuantity SMALLINT UNSIGNED;
    DECLARE matchedItemId INT UNSIGNED;
    DECLARE currentContainer INT UNSIGNED;
    DECLARE currentSlot INT UNSIGNED;
    DECLARE currentCreatureItemStateId TINYINT UNSIGNED;
    DECLARE check1 BIT;
    DECLARE check2 BIT;
    DECLARE check3 BIT;
    DECLARE isContainer BIT;
    DECLARE isMount BIT;
    DECLARE isVehicle BIT;
    DECLARE hasCharges BIT;
    DECLARE maxCharges SMALLINT UNSIGNED;
    DECLARE isCursed BIT;
    DECLARE isScroll BIT;
    DECLARE revertContainer BIT;
    DECLARE nestedContainerId INT UNSIGNED;
    DECLARE allowAdditionalSpells BIT;

    SET check1 = (SELECT 1 FROM creature_items WHERE id = creatureItemId);
    SET check2 = (SELECT 1 FROM creature_items WHERE id = containerItemId);
    SET check3 = (SELECT 1 FROM creatures WHERE id = creatureId);

    IF check1 IS NOT NULL AND (containerItemId IS NULL OR check2 IS NOT NULL) AND check3 IS NOT NULL THEN
        SELECT ci.quantity, ci.equipped_slot_id, ci.container_id, ci.creature_item_state_id, i.container, i.item_type_id = 6, i.item_type_id = 10, mi.max_charges, ci.cursed, mi.additional_spells, mi.magical_item_type_id = 5
        INTO currentQuantity, currentSlot, currentContainer, currentCreatureItemStateId, isContainer, isMount, isVehicle, maxCharges, isCursed, allowAdditionalSpells, isScroll
        FROM creature_items ci
        JOIN items i ON ci.item_id = i.id
        LEFT JOIN magical_items mi ON mi.item_id = i.id
        WHERE ci.id = creatureItemId;

        SET hasCharges = (maxCharges IS NOT NULL AND maxCharges > 0);

        IF toCreatureItemStateId IS NULL THEN
            SET toCreatureItemStateId = currentCreatureItemStateId;
        END IF;

        IF allowAdditionalSpells IS NULL THEN
            SET allowAdditionalSpells = 0;
        END IF;

        IF isScroll IS NULL THEN
            SET isScroll = 0;
        END IF;

        IF isContainer OR isMount OR isVehicle OR hasCharges OR allowAdditionalSpells OR isCursed OR isScroll THEN
            SET revertContainer = 0;
            IF containerItemId = creatureItemId THEN
                SET revertContainer = 1;
            END IF;

            SET nestedContainerId = (SELECT id
                FROM (WITH RECURSIVE containers (id, name, container_id) AS
                    (
                        SELECT ci.id, i.name, ci.container_id
                        FROM creature_items ci
                            JOIN items i ON i.id = ci.item_id
                        WHERE ci.container_id IS NULL
                            AND i.container = 1
                            AND ci.id = creatureItemId

                        UNION ALL

                        SELECT ci2.id, i2.name, ci2.container_id
                        FROM containers AS c
                            JOIN creature_items AS ci2 ON c.id = ci2.container_id
                            JOIN items i2 ON i2.id = ci2.item_id
                        WHERE i2.container = 1
                    )
                    SELECT * FROM containers) AS a
                    WHERE container_id IS NOT NULL
                        AND id = containerItemId
                    LIMIT 1);

            IF nestedContainerId IS NOT NULL THEN
                SET revertContainer = 1;
            END IF;

            IF revertContainer THEN
                # don't move to the new container. instead just keep it where it already is
                SET containerItemId = (SELECT container_id FROM creature_items WHERE id = creatureItemId);
            END IF;

            UPDATE creature_items
            SET creature_item_state_id = toCreatureItemStateId,
                equipped_slot_id = NULL,
                container_id = containerItemId
            WHERE id = creatureItemId;

            SELECT creatureItemId AS creature_item_id;

        ELSEIF (currentContainer IS NULL AND containerItemId IS NOT NULL)
                   OR (currentContainer IS NOT NULL AND containerItemId IS NULL)
                   OR currentContainer != containerItemId
                   OR currentSlot IS NOT NULL
                   OR currentCreatureItemStateId != toCreatureItemStateId THEN
            IF itemQuantity > currentQuantity THEN
                SET itemQuantity = currentQuantity;
            END IF;

            SET matchedItemId = (
                SELECT ci2_id FROM matching_creature_items
                WHERE ci_id =  creatureItemId
                  AND (
                        (containerItemId IS NULL AND ci2_container_id IS NULL AND ci2_creature_item_state_id = toCreatureItemStateId)
                        OR ci2_container_id = containerItemId
                      )
                LIMIT 1);

            IF itemQuantity = currentQuantity THEN
                IF matchedItemId IS NULL THEN
                    UPDATE creature_items
                    SET container_id = containerItemId,
                        equipped_slot_id = NULL,
                        creature_item_state_id = toCreatureItemStateId
                    WHERE id = creatureItemId;

                    SELECT creatureItemId AS creature_item_id;
                ELSE
                    UPDATE creature_items
                    SET quantity = quantity + itemQuantity
                    WHERE id = matchedItemId;

                    CALL CreatureItems_Delete(creatureItemId);

                    SELECT matchedItemId AS creature_item_id;
                END IF;
            ELSE
                IF matchedItemId IS NULL THEN
                    INSERT INTO creature_items (creature_id, item_id, quantity, equipped_slot_id, creature_item_state_id, container_id, expanded, poisoned, silvered, full, attuned, charges, cursed, magic_item_type_id, notes)
                    SELECT creatureId, item_id, itemQuantity, null, toCreatureItemStateId, containerItemId, expanded, poisoned, silvered, full, attuned, charges, cursed, magic_item_type_id, notes FROM creature_items WHERE id = creatureItemId;

                    SELECT LAST_INSERT_ID() AS creature_item_id;
                ELSE
                    UPDATE creature_items
                    SET quantity = quantity + itemQuantity
                    WHERE id = matchedItemId;

                    SELECT matchedItemId AS creature_item_id;
                END IF;

                UPDATE creature_items
                SET quantity = quantity - itemQuantity,
                    equipped_slot_id = NULL
                WHERE id = creatureItemId;
            END IF;
#             SELECT 1 AS result;
#         ELSE
#             SELECT 0;
        END IF;
#     ELSE
#         SELECT 0;
    END IF;
END;;

DELIMITER ;

# call CreatureItems_Move (1,5,1,4,null)
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
# where ci.id = 5