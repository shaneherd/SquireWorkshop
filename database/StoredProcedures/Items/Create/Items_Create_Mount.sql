DROP PROCEDURE IF EXISTS Items_Create_Mount;

DELIMITER ;;
CREATE PROCEDURE Items_Create_Mount(
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3),
    IN speedValue TINYINT UNSIGNED,
    IN carryingCapacity SMALLINT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE itemId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS item_id;
    END;

    START TRANSACTION;

    INSERT INTO items (name, item_type_id, description, expendable, equippable, slot, container, ignore_weight, cost, cost_unit, weight, user_id)
    VALUES (itemName, 6, itemDescription, 0, 1, 11, 1, 0, costValue, costUnit, weightValue, userId);

    SET itemId = (SELECT LAST_INSERT_ID());

    INSERT INTO mounts (item_id, speed, carrying_capacity)
    VALUES (itemId, speedValue, carryingCapacity);

    COMMIT;

    SELECT itemId AS item_id;
END;;

DELIMITER ;

# CALL Items_Create_Mount('test', 'test_description', 1, 'tst', 1);
