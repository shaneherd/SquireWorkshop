DROP PROCEDURE IF EXISTS Attributes_Create_ArmorType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Create_ArmorType(
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN donValue TINYINT UNSIGNED,
    IN donTimeUnit VARCHAR(45),
    IN doffValue TINYINT UNSIGNED,
    IN doffTimeUnit VARCHAR(45),
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE attributeId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS attribute_id;
    END;

    START TRANSACTION;

    INSERT INTO `attributes` (`name`, `description`, `attribute_type_id`, `user_id`)
    VALUES (attributeName, attributeDescription, 2, userId);

    SET attributeId = (SELECT LAST_INSERT_ID());

    INSERT INTO armor_types (attribute_id, don, don_time_unit, doff, doff_time_unit)
    VALUES (attributeId, donValue, donTimeUnit, doffValue, doffTimeUnit);

    COMMIT;

    SELECT attributeId AS attribute_id;
END;;

DELIMITER ;

# CALL Attributes_Create_ArmorType('test', 'test_description', 1, 'tst', 1);
