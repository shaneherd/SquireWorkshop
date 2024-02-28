DROP PROCEDURE IF EXISTS Characteristics_Share_Private;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Share_Private(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN toUsername VARCHAR(45)
)
BEGIN
    DECLARE userCharacteristicId INT UNSIGNED;
    DECLARE toUserId MEDIUMINT UNSIGNED;

    SET userCharacteristicId = (SELECT id FROM characteristics WHERE user_id = userId AND id = characteristicId);
    SET toUserId = (SELECT id FROM users WHERE username = toUsername);
    IF userCharacteristicId IS NOT NULL AND toUserId IS NOT NULL THEN
        INSERT IGNORE INTO characteristics_private (characteristic_id, user_id) VALUES (userCharacteristicId, toUserId);
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Share_Private(1, 1, 'sherd');
