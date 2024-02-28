DROP PROCEDURE IF EXISTS Attributes_Create_Deity;

DELIMITER ;;
CREATE PROCEDURE Attributes_Create_Deity(
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN deityCategoryId INT UNSIGNED,
    IN alignmentId INT UNSIGNED,
    IN symbolValue VARCHAR(45),
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
    VALUES (attributeName, attributeDescription, 16, userId);

    SET attributeId = (SELECT LAST_INSERT_ID());

    INSERT INTO deities (attribute_id, deity_category_id, alignment_id, symbol)
    VALUES (attributeId, deityCategoryId, alignmentId, symbolValue);

    COMMIT;

    SELECT attributeId AS attribute_id;
END;;

DELIMITER ;

# CALL Attributes_Create_Deity('test', 'test_description', 1, 'tst', 1);
