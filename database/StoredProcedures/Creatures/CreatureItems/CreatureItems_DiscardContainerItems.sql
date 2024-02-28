DROP PROCEDURE IF EXISTS CreatureItems_DiscardContainerItems;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_DiscardContainerItems(
    IN containerItemId INT UNSIGNED,
    IN creatureId INT UNSIGNED,
    IN validateActions BIT
)
BEGIN
    DECLARE nestedItemId INT UNSIGNED;
    DECLARE isContainer BIT;
    DECLARE isMount BIT;
    DECLARE isVehicle BIT;

    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT ci.id, i.container, i.item_type_id = 6, i.item_type_id = 10
                            FROM creature_items ci
                            JOIN items i on ci.item_id = i.id
                            WHERE container_id = containerItemId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    SET max_sp_recursion_depth = 255;

    OPEN curs;
    WHILE more_rows DO
        FETCH curs INTO nestedItemId, isContainer, isMount, isVehicle;

        IF more_rows THEN
            IF isContainer OR isMount OR isVehicle THEN
                CALL CreatureItems_DiscardContainerItems(nestedItemId, creatureId, 0);
            END IF;
            CALL CreatureItems_Delete(nestedItemId);
        END IF;
    END WHILE;
    CLOSE curs;

    IF validateActions THEN
        CALL CreatureActions_Items_Validate(creatureId);
    END IF;
END;;

DELIMITER ;

# CALL CreatureItems_DiscardContainerItems(32, 1);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
