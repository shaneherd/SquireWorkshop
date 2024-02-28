DROP PROCEDURE IF EXISTS Attributes_Update_ArmorType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Update_ArmorType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN donValue TINYINT UNSIGNED,
    IN donTimeUnit VARCHAR(45),
    IN doffValue TINYINT UNSIGNED,
    IN doffTimeUnit VARCHAR(45)
)
BEGIN
    DECLARE valid BIT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;


    SET valid = (SELECT user_id FROM attributes WHERE id = attributeId) = userId;

    IF valid THEN
        UPDATE attributes
        SET name = attributeName, description = attributeDescription, version = version + 1
        WHERE user_id = userId AND id = attributeId;

        UPDATE armor_types
        SET don = donValue, don_time_unit = donTimeUnit, doff = doffValue, doff_time_unit = doffTimeUnit
        WHERE attribute_id = attributeId;
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Attributes_Update_ArmorType(1, 1, 'test-changed', 'test-changed-desc', 'ab');
