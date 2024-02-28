DROP PROCEDURE IF EXISTS Items_Create_Tool;

DELIMITER ;;
CREATE PROCEDURE Items_Create_Tool(
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN isExpendable BIT,
    IN isEquippable BIT,
    IN slotValue TINYINT UNSIGNED,
    IN isContainer BIT,
    IN isIgnoreWeight BIT,
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3),
    IN toolCategoryId INT UNSIGNED,
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
    VALUES (itemName, 4, itemDescription, isExpendable, isEquippable, slotValue, isContainer, isIgnoreWeight, costValue, costUnit, weightValue, userId);

    SET itemId = (SELECT LAST_INSERT_ID());

    INSERT INTO tools (item_id, tool_category_id)
    VALUES (itemId, toolCategoryId);

    COMMIT;

    SELECT itemId AS item_id;
END;;

DELIMITER ;

# CALL Items_Create_Tool('test', 'test_description', 1, 'tst', 1);
