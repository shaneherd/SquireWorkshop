DROP PROCEDURE IF EXISTS Items_Update_Gear;

DELIMITER ;;
CREATE PROCEDURE Items_Update_Gear(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN isExpendable BIT,
    IN isEquippable BIT,
    IN slotValue TINYINT UNSIGNED,
    IN isContainer BIT,
    IN isIgnoreWeight BIT,
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3)
)
BEGIN
    DECLARE valid BIT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;

    SET valid = (SELECT user_id FROM items WHERE id = itemId) = userId;

    IF valid THEN
        UPDATE items
        SET name = itemName, description = itemDescription, expendable = isExpendable, equippable = isEquippable,
            slot = slotValue, container = isContainer, ignore_weight = isIgnoreWeight, cost = costValue,
            cost_unit = costUnit, weight = weightValue, version = version + 1
        WHERE user_id = userId AND id = itemId;
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Items_Update_Gear(265, 1, 'test-changed', 'test-changed-desc', 'ab');
