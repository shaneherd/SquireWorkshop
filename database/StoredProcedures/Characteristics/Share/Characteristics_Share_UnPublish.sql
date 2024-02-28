DROP PROCEDURE IF EXISTS Characteristics_Share_UnPublish;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Share_UnPublish(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userCharacteristicId INT UNSIGNED;

    SET userCharacteristicId = (SELECT id FROM characteristics WHERE user_id = userId AND id = characteristicId);
    IF userCharacteristicId IS NOT NULL THEN
        DELETE FROM characteristics_public WHERE characteristic_id = userCharacteristicId;
        DELETE FROM characteristics_private WHERE characteristic_id = userCharacteristicId;
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Share_UnPublish(253, 12);
