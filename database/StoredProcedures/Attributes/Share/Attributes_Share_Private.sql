DROP PROCEDURE IF EXISTS Attributes_Share_Private;

DELIMITER ;;
CREATE PROCEDURE Attributes_Share_Private(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN toUsername VARCHAR(45)
)
BEGIN
    DECLARE userAttributeId INT UNSIGNED;
    DECLARE toUserId MEDIUMINT UNSIGNED;

    SET userAttributeId = (SELECT id FROM attributes WHERE user_id = userId AND id = attributeId);
    SET toUserId = (SELECT id FROM users WHERE username = toUsername);
    IF userAttributeId IS NOT NULL AND toUserId IS NOT NULL THEN
        INSERT IGNORE INTO attributes_private (attribute_id, user_id) VALUES (userAttributeId, toUserId);
    END IF;
END;;

DELIMITER ;

# CALL Attributes_Share_Private(1, 1, 'sherd');
