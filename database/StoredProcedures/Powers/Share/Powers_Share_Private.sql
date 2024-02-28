DROP PROCEDURE IF EXISTS Powers_Share_Private;

DELIMITER ;;
CREATE PROCEDURE Powers_Share_Private(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN toUsername VARCHAR(45)
)
BEGIN
    DECLARE userPowerId INT UNSIGNED;
    DECLARE toUserId MEDIUMINT UNSIGNED;

    SET userPowerId = (SELECT id FROM powers WHERE user_id = userId AND id = powerId);
    SET toUserId = (SELECT id FROM users WHERE username = toUsername);
    IF userPowerId IS NOT NULL AND toUserId IS NOT NULL THEN
        INSERT IGNORE INTO powers_private (power_id, user_id) VALUES (userPowerId, toUserId);
    END IF;
END;;

DELIMITER ;

# CALL Powers_Share_Private(1, 1, 'sherd');
