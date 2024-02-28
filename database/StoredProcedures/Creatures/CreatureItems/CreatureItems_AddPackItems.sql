DROP PROCEDURE IF EXISTS CreatureItems_AddPackItems;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_AddPackItems(
    IN creatureId INT UNSIGNED,
    IN packId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED,
    IN containerItemId INT UNSIGNED,
    IN creatureItemStateId TINYINT UNSIGNED
)
BEGIN
    DECLARE packItemId INT UNSIGNED;
    DECLARE packItemQuantity SMALLINT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT pi.item_id, pi.quantity
                            FROM packs p
                            JOIN pack_items pi on p.item_id = pi.pack_id
                            WHERE p.item_id = packId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    OPEN curs;

    WHILE more_rows DO
        FETCH curs INTO packItemId, packItemQuantity;

        IF more_rows THEN
            CALL CreatureItems_Add(creatureId, packItemId, packItemQuantity * itemQuantity, containerItemId, null, null, creatureItemStateId, 0);
        END IF;
    END WHILE;

    CLOSE curs;
END;;

DELIMITER ;

# CALL CreatureItems_AddPackItems(32, 1);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
