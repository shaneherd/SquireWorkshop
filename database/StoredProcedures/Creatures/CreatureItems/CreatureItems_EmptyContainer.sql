DROP PROCEDURE IF EXISTS CreatureItems_EmptyContainer;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_EmptyContainer(
    IN creatureItemId INT UNSIGNED,
    IN containerItemId INT UNSIGNED
)
BEGIN
    DECLARE creatureId INT UNSIGNED;
    DECLARE nestedItemId INT UNSIGNED;
    DECLARE itemQuantity SMALLINT UNSIGNED;
    DECLARE creatureItemStateId TINYINT UNSIGNED;

    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT ci.creature_id, ci.id, ci.quantity, ci.creature_item_state_id
                            FROM creature_items ci
                            JOIN items i on ci.item_id = i.id
                            WHERE container_id = creatureItemId;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    OPEN curs;

    WHILE more_rows DO
        FETCH curs INTO creatureId, nestedItemId, itemQuantity, creatureItemStateId;

        IF more_rows THEN
            CALL CreatureItems_Move(creatureId,nestedItemId,itemQuantity,containerItemId,creatureItemStateId);
        END IF;
    END WHILE;

    CLOSE curs;
END;;

DELIMITER ;

CALL CreatureItems_EmptyContainer(12, 28);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
