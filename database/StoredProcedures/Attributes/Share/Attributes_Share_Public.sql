DROP PROCEDURE IF EXISTS Attributes_Share_Public;

DELIMITER ;;
CREATE PROCEDURE Attributes_Share_Public(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userAttributeId INT UNSIGNED;

    SET userAttributeId = (SELECT id FROM attributes WHERE user_id = userId AND id = attributeId);
    IF userAttributeId IS NOT NULL THEN
        INSERT IGNORE INTO attributes_public (attribute_id) VALUES (userAttributeId);
    END IF;
END;;

DELIMITER ;

# CALL Attributes_Share_Public(253, 12);
