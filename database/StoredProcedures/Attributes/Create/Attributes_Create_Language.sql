DROP PROCEDURE IF EXISTS Attributes_Create_Language;

DELIMITER ;;
CREATE PROCEDURE Attributes_Create_Language(
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN scriptValue VARCHAR(45),
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
    VALUES (attributeName, attributeDescription, 6, userId);

    SET attributeId = (SELECT LAST_INSERT_ID());

    INSERT INTO languages (attribute_id, script)
    VALUES (attributeId, scriptValue);

    COMMIT;

    SELECT attributeId AS attribute_id;
END;;

DELIMITER ;

# CALL Attributes_Create_Language('test', 'test_description', 1, 'tst', 1);
