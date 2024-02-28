DROP PROCEDURE IF EXISTS CreatureItems_Expend;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Expend(
    IN creatureId INT UNSIGNED,
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN containerItemId INT UNSIGNED
)
BEGIN
    DECLARE isMagical BIT;
    DECLARE expendedCreatureItemStateId TINYINT UNSIGNED;

    SET expendedCreatureItemStateId = 4;
    SET isMagical = (SELECT item_type_id = 9 FROM items i JOIN creature_items ci ON ci.item_id = i.id AND ci.id = creatureItemId);

    IF isMagical THEN
        CALL CreatureItems_Disenchant(creatureId, creatureItemId, itemQuantity, expendedCreatureItemStateId);
    ELSE
        CALL CreatureItems_Move(creatureId, creatureItemId, itemQuantity, containerItemId, expendedCreatureItemStateId);
    END IF;
END;;

DELIMITER ;

# CALL CreatureItems_Expend(1, 30, 5, null);
