DROP PROCEDURE IF EXISTS Characteristics_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Characteristics_GetAddToMyStuffDetails(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN checkRights BIT
)
BEGIN
    DECLARE authorCharacteristicId INT UNSIGNED;
    DECLARE existingCharacteristicId INT UNSIGNED;
    DECLARE authorUserId MEDIUMINT UNSIGNED;
    DECLARE authorCharacteristicTypeId TINYINT UNSIGNED;
    DECLARE existingCharacteristicTypeId TINYINT UNSIGNED;

    IF checkRights = 0 THEN
        SET authorCharacteristicId = characteristicId;
    ELSE
        SET authorCharacteristicId = (SELECT published_parent_id FROM characteristics WHERE user_id = userId AND id = characteristicId);
        IF authorCharacteristicId IS NULL THEN
            SET authorCharacteristicId = (SELECT characteristic_id FROM characteristics_public WHERE characteristic_id = characteristicId);
        END IF;
        IF authorCharacteristicId IS NULL THEN
            SET authorCharacteristicId = (SELECT characteristic_id FROM characteristics_private WHERE user_id = userId AND characteristic_id = characteristicId);
        END IF;
    END IF;

    SELECT user_id, characteristic_type_id
    INTO authorUserId, authorCharacteristicTypeId
    FROM characteristics WHERE id = authorCharacteristicId;

    SELECT id, characteristic_type_id
    INTO existingCharacteristicId, existingCharacteristicTypeId
    FROM characteristics WHERE published_parent_id = authorCharacteristicId AND user_id = userId;

    SELECT authorCharacteristicId AS author_characteristic_id,
           authorUserId AS author_user_id,
           existingCharacteristicId AS existing_characteristic_id,
           authorCharacteristicTypeId AS author_characteristic_type_id,
           existingCharacteristicTypeId AS existing_characteristic_type_id;
END;;

DELIMITER ;

# CALL Characteristics_GetAddToMyStuffDetails(253, 12);
