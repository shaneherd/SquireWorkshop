DROP PROCEDURE IF EXISTS Characteristics_GetPublishedDetails;

DELIMITER ;;
CREATE PROCEDURE Characteristics_GetPublishedDetails(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE authorCharacteristicId INT UNSIGNED;

    SET authorCharacteristicId = (SELECT id FROM characteristics WHERE user_id = userId AND id = characteristicId);
    SELECT EXISTS(
        SELECT 1 FROM characteristics_public WHERE characteristic_id = authorCharacteristicId
        UNION
        SELECT 1 FROM characteristics_private WHERE characteristic_id = authorCharacteristicId
    ) AS published;

    SELECT u.username
    FROM characteristics_private cp
        JOIN users u ON u.id = cp.user_id AND cp.characteristic_id = authorCharacteristicId;
END;;

DELIMITER ;

# CALL Characteristics_GetPublishedDetails(253, 12);
