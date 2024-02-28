DROP PROCEDURE IF EXISTS Attributes_Update_AreaOfEffect;

DELIMITER ;;
CREATE PROCEDURE Attributes_Update_AreaOfEffect(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN isRadius BIT,
    IN isWidth BIT,
    IN isHeight BIT,
    IN isLength BIT
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

        UPDATE area_of_effects
        SET radius = isRadius,
            width = isWidth,
            height = isHeight,
            length = isLength
        WHERE attribute_id = attributeId;
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Attributes_Update_AreaOfEffect(1, 1, 'test-changed', 'test-changed-desc', 'ab');
