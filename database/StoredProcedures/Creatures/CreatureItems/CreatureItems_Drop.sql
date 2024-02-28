DROP PROCEDURE IF EXISTS CreatureItems_Drop;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Drop(
    IN creatureId INT UNSIGNED,
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN containerItemId INT UNSIGNED
)
BEGIN
    DECLARE droppedCreatureItemStateId TINYINT UNSIGNED;
    SET droppedCreatureItemStateId = 2;
    CALL CreatureItems_Move(creatureId, creatureItemId, itemQuantity, containerItemId, droppedCreatureItemStateId);
END;;

DELIMITER ;

# CALL DropCreatureItems(1, 30, 5, null);
