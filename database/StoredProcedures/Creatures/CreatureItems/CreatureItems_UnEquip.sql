DROP PROCEDURE IF EXISTS CreatureItems_UnEquip;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_UnEquip(
    IN creatureId INT UNSIGNED,
    IN creatureItemId INT UNSIGNED,
    IN containerItemId INT UNSIGNED
)
BEGIN
    DECLARE carriedCreatureItemStateId TINYINT UNSIGNED;
    SET carriedCreatureItemStateId = 1;
    CALL CreatureItems_Move(creatureId, creatureItemId, 1, containerItemId, carriedCreatureItemStateId);
END;;

DELIMITER ;

# CALL CreatureItems_UnEquip(1, 3, null);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id;
