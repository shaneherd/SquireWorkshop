DROP PROCEDURE IF EXISTS Attributes_Update_Ability;

DELIMITER ;;
CREATE PROCEDURE Attributes_Update_Ability(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN abbreviation VARCHAR(5)
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

        UPDATE abilities
        SET abbr = abbreviation
        WHERE attribute_id = attributeId;
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Attributes_Update_Ability(265, 1, 'test-chanaaaged', 'test-changed-desc', 'ab');
