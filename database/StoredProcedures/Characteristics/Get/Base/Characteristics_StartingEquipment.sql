DROP PROCEDURE IF EXISTS Characteristics_StartingEquipment;

DELIMITER ;;
CREATE PROCEDURE Characteristics_StartingEquipment(
    IN characteristicId INT UNSIGNED,
    IN includeParents BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE parentId INT UNSIGNED;
    DECLARE loopCount TINYINT UNSIGNED;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_starting_equipment
    (
        item_group      TINYINT UNSIGNED NOT NULL,
        item_option     TINYINT UNSIGNED NOT NULL,
        item_type       TINYINT UNSIGNED NULL,
        item_id         INT UNSIGNED NULL,
        item_name       VARCHAR(45) NULL,
        item_sid        SMALLINT UNSIGNED NULL,
        item_is_author  BIT,
        filters         VARCHAR(1000) NULL,
        quantity        TINYINT UNSIGNED NULL
    );

    INSERT INTO temp_starting_equipment
    SELECT item_group, item_option, item_type, item_id, i.name AS item_name, i.sid AS item_sid, i.user_id = userId AS item_is_author, filters, quantity
    FROM characteristic_starting_equipments cse
    LEFT JOIN items i ON i.id = cse.item_id
    WHERE characteristic_id = characteristicId;

    IF includeParents = 1 THEN
        SET loopCount = 0;
        SET parentId = (SELECT parent_characteristic_id FROM characteristics WHERE id = characteristicId);
        WHILE parentId IS NOT NULL AND loopCount < 10 DO
            INSERT INTO temp_starting_equipment
            SELECT item_group, item_option, item_type, item_id, i.name AS item_name, i.sid AS item_sid, i.user_id = userId AS item_is_author, filters, quantity
            FROM characteristic_starting_equipments cse
            LEFT JOIN items i ON i.id = cse.item_id
            WHERE characteristic_id = parentId;

            SET loopCount = loopCount + 1;
            SET parentId = (SELECT parent_characteristic_id FROM characteristics WHERE id = parentId);
        END WHILE;
    END IF;

    SELECT item_group, item_option, item_type, item_id, item_name, item_sid, item_is_author, filters, quantity
    FROM temp_starting_equipment
    ORDER BY item_group, item_option;

    DROP TEMPORARY TABLE IF EXISTS temp_starting_equipment;
END;;

DELIMITER ;

CALL Characteristics_StartingEquipment(42, 1, 1);

