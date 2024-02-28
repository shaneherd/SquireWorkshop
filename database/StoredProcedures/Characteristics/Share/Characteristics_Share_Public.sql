DROP PROCEDURE IF EXISTS Characteristics_Share_Public;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Share_Public(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userCharacteristicId INT UNSIGNED;

    SET userCharacteristicId = (SELECT id FROM characteristics WHERE user_id = userId AND id = characteristicId);
    IF userCharacteristicId IS NOT NULL THEN
        INSERT IGNORE INTO characteristics_public (characteristic_id) VALUES (userCharacteristicId);
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Share_Public(253, 12);
