DROP PROCEDURE IF EXISTS Attributes_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetAddToMyStuffDetails(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN checkRights BIT
)
BEGIN
    DECLARE authorAttributeId INT UNSIGNED;
    DECLARE authorAttributeTypeId TINYINT UNSIGNED;
    DECLARE existingAttributeId INT UNSIGNED;
    DECLARE existingAttributeTypeId TINYINT UNSIGNED;
    DECLARE authorUserId MEDIUMINT UNSIGNED;

    IF checkRights = 0 THEN
        SET authorAttributeId = attributeId;
    ELSE
        SET authorAttributeId = (SELECT published_parent_id FROM attributes WHERE user_id = userId AND id = attributeId);
        IF authorAttributeId IS NULL THEN
            SET authorAttributeId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
        END IF;
        IF authorAttributeId IS NULL THEN
            SET authorAttributeId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
        END IF;
    END IF;

    SELECT user_id, attribute_type_id
    INTO authorUserId, authorAttributeTypeId
    FROM attributes WHERE id = authorAttributeId;

    SELECT id, attribute_type_id
    INTO existingAttributeId, existingAttributeTypeId
    FROM attributes WHERE published_parent_id = authorAttributeId AND user_id = userId;

    SELECT authorAttributeId AS author_attribute_id,
           authorUserId AS author_user_id,
           existingAttributeId AS existing_attribute_id,
           authorAttributeTypeId AS author_attribute_type_id,
           existingAttributeTypeId AS existing_attribute_type_id;
END;;

DELIMITER ;

# CALL Attributes_GetAddToMyStuffDetails(253, 12);
