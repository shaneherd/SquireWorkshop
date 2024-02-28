DROP PROCEDURE IF EXISTS CreatureItems_Delete;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Delete(
    IN creatureItemId INT UNSIGNED
)
BEGIN
    DELETE FROM creature_item_spells WHERE creature_item_id = creatureItemId;
    DELETE FROM creature_items WHERE id = creatureItemId;
END;;

DELIMITER ;

# CALL CreatureItems_Delete(223, 1);
