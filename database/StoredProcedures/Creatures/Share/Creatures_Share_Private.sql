DROP PROCEDURE IF EXISTS Creatures_Share_Private;

DELIMITER ;;
CREATE PROCEDURE Creatures_Share_Private(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN toUsername VARCHAR(45)
)
BEGIN
    DECLARE userCreatureId INT UNSIGNED;
    DECLARE toUserId MEDIUMINT UNSIGNED;

    SET userCreatureId = (SELECT id FROM creatures WHERE user_id = userId AND id = creatureId);
    SET toUserId = (SELECT id FROM users WHERE username = toUsername);
    IF userCreatureId IS NOT NULL AND toUserId IS NOT NULL THEN
        INSERT IGNORE INTO creatures_private (creature_id, user_id) VALUES (userCreatureId, toUserId);
    END IF;
END;;

DELIMITER ;

# CALL Creatures_Share_Private(1, 1, 'sherd');
