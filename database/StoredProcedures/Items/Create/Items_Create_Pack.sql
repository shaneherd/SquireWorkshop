DROP PROCEDURE IF EXISTS Items_Create_Pack;

DELIMITER ;;
CREATE PROCEDURE Items_Create_Pack(
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE itemId INT UNSIGNED;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT -1 AS item_id;
#     END;

#     START TRANSACTION;

    INSERT INTO items (name, item_type_id, description, expendable, equippable, slot, container, ignore_weight, cost, cost_unit, weight, user_id)
    VALUES (itemName, 8, itemDescription, 0, 0, null, 0, 0, 0, null, 0, userId);

    SET itemId = (SELECT LAST_INSERT_ID());

    INSERT INTO packs (item_id)
    VALUES (itemId);

#     COMMIT;

    SELECT itemId AS item_id;
END;;

DELIMITER ;

# CALL Items_Create_Pack('test', 'test_description', 1, 'tst', 1);
