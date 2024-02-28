DROP PROCEDURE IF EXISTS Attributes_Create_AreaOfEffect;

DELIMITER ;;
CREATE PROCEDURE Attributes_Create_AreaOfEffect(
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN isRadius BIT,
    IN isWidth BIT,
    IN isHeight BIT,
    IN isLength BIT,
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
    VALUES (attributeName, attributeDescription, 12, userId);

    SET attributeId = (SELECT LAST_INSERT_ID());

    INSERT INTO area_of_effects (attribute_id, radius, width, height, length)
    VALUES (attributeId, isRadius, isWidth, isHeight, isLength);

    COMMIT;

    SELECT attributeId AS attribute_id;
END;;

DELIMITER ;

# CALL Attributes_Create_AreaOfEffect('test', 'test_description', 1, 'tst', 1);
