DROP PROCEDURE IF EXISTS Attributes_Create_Skill;

DELIMITER ;;
CREATE PROCEDURE Attributes_Create_Skill(
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN abilityId INT UNSIGNED,
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
    VALUES (attributeName, attributeDescription, 8, userId);

    SET attributeId = (SELECT LAST_INSERT_ID());

    INSERT INTO skills (attribute_id, ability_id)
    VALUES (attributeId, abilityId);

    COMMIT;

    SELECT attributeId AS attribute_id;
END;;

DELIMITER ;

# CALL Attributes_Create_Skill('test', 'test_description', 1, 'tst', 1);
