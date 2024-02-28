DROP PROCEDURE IF EXISTS CreatureItems_Pickup;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Pickup(
    IN creatureId INT UNSIGNED,
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN containerItemId INT UNSIGNED,
    IN discardRemaining BIT
)
BEGIN
    DECLARE originalCreatureItemStateId TINYINT UNSIGNED;
    DECLARE carriedCreatureItemStateId TINYINT UNSIGNED;
    SET originalCreatureItemStateId = (SELECT creature_item_state_id FROM creature_items WHERE id = creatureItemId);
    SET carriedCreatureItemStateId = 1;
    CALL CreatureItems_Move(creatureId, creatureItemId, itemQuantity, containerItemId, carriedCreatureItemStateId);
    IF discardRemaining THEN
        CALL CreatureItems_Delete(creatureItemId);
    END IF;
END;;

DELIMITER ;

# CALL CreatureItems_Pickup(1, 31, 8, null, 1);
