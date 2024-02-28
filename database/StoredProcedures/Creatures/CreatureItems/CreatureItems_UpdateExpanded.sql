DROP PROCEDURE IF EXISTS CreatureItems_UpdateExpanded;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_UpdateExpanded(
    IN creatureItemId INT UNSIGNED,
    IN isExpanded BIT
)
BEGIN
    UPDATE creature_items
    SET expanded = isExpanded
    WHERE id = creatureItemId;
END;;

DELIMITER ;

# CALL CreatureItems_UpdateExpanded(30, 1);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
# where ci.id = 30