DROP PROCEDURE IF EXISTS Attributes_Share_UnPublish;

DELIMITER ;;
CREATE PROCEDURE Attributes_Share_UnPublish(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userAttributeId INT UNSIGNED;

    SET userAttributeId = (SELECT id FROM attributes WHERE user_id = userId AND id = attributeId);
    IF userAttributeId IS NOT NULL THEN
        DELETE FROM attributes_public WHERE attribute_id = userAttributeId;
        DELETE FROM attributes_private WHERE attribute_id = userAttributeId;
    END IF;
END;;

DELIMITER ;

# CALL Attributes_Share_UnPublish(253, 12);
