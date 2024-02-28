DROP PROCEDURE IF EXISTS Attributes_GetPublishedDetails;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetPublishedDetails(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE authorAttributeId INT UNSIGNED;

    SET authorAttributeId = (SELECT id FROM attributes WHERE user_id = userId AND id = attributeId);
    SELECT EXISTS(
        SELECT 1 FROM attributes_public WHERE attribute_id = authorAttributeId
        UNION
        SELECT 1 FROM attributes_private WHERE attribute_id = authorAttributeId
    ) AS published;

    SELECT u.username
    FROM attributes_private ap
        JOIN users u ON u.id = ap.user_id AND ap.attribute_id = authorAttributeId;
END;;

DELIMITER ;

# CALL Attributes_GetPublishedDetails(253, 12);
