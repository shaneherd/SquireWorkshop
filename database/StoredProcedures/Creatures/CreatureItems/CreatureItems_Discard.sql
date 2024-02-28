DROP PROCEDURE IF EXISTS CreatureItems_Discard;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Discard(
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED
)
BEGIN
    DECLARE currentQuantity SMALLINT UNSIGNED;
    DECLARE isContainer BIT;
    DECLARE isMount BIT;
    DECLARE isVehicle BIT;
    DECLARE creatureId INT UNSIGNED;
    DECLARE itemId INT UNSIGNED;
    DECLARE subItemId INT UNSIGNED;

    SELECT ci.quantity, i.container, i.item_type_id = 6, i.item_type_id = 10, creature_id, item_id, magic_item_type_id
    INTO currentQuantity, isContainer, isMount, isVehicle, creatureId, itemId, subItemId
    FROM creature_items ci
    JOIN items i ON ci.item_id = i.id
    WHERE ci.id = creatureItemId;

    IF itemQuantity > currentQuantity THEN
        SET itemQuantity = currentQuantity;
    END IF;

    IF itemQuantity = currentQuantity THEN
        IF isContainer OR isMount OR isVehicle THEN
            CALL CreatureItems_DiscardContainerItems(creatureItemId, creatureId, 0);
        END IF;

        CALL CreatureItems_Delete(creatureItemId);

        CALL CreatureActions_Items_Validate(creatureId);
   ELSE
        UPDATE creature_items
        SET quantity = quantity - itemQuantity
        WHERE id = creatureItemId;
    END IF;
END;;

DELIMITER ;

CALL CreatureItems_Discard(223, 1);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
