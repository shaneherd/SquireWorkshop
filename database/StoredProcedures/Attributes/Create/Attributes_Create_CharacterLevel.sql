DROP PROCEDURE IF EXISTS Attributes_Create_CharacterLevel;

DELIMITER ;;
CREATE PROCEDURE Attributes_Create_CharacterLevel(
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN minExp MEDIUMINT UNSIGNED,
    IN profBonus TINYINT UNSIGNED,
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
    VALUES (attributeName, attributeDescription, 7, userId);

    SET attributeId = (SELECT LAST_INSERT_ID());

    INSERT INTO character_levels (attribute_id, min_exp, prof_bonus)
    VALUES (attributeId, minExp, profBonus);

    COMMIT;

    SELECT attributeId AS attribute_id;
END;;

DELIMITER ;

# CALL Attributes_Create_CharacterLevel('test', 'test_description', 1, 'tst', 1);
