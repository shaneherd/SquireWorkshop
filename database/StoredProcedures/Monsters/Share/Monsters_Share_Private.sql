DROP PROCEDURE IF EXISTS Monsters_Share_Private;

DELIMITER ;;
CREATE PROCEDURE Monsters_Share_Private(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN toUsername VARCHAR(45)
)
BEGIN
    DECLARE userMonsterId INT UNSIGNED;
    DECLARE toUserId MEDIUMINT UNSIGNED;

    SET userMonsterId = (SELECT id FROM monsters WHERE user_id = userId AND id = monsterId);
    SET toUserId = (SELECT id FROM users WHERE username = toUsername);
    IF userMonsterId IS NOT NULL AND toUserId IS NOT NULL THEN
        INSERT IGNORE INTO monsters_private (monster_id, user_id) VALUES (userMonsterId, toUserId);
    END IF;
END;;

DELIMITER ;

# CALL Creatures_Share_Private(1, 1, 'sherd');
