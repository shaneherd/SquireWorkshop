DROP PROCEDURE IF EXISTS Characteristics_InUse;

DELIMITER ;;
CREATE PROCEDURE Characteristics_InUse(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characteristicTypeId TINYINT UNSIGNED;
    SET characteristicTypeId = (SELECT characteristic_type_id FROM characteristics WHERE id = characteristicId);

    IF characteristicTypeId = 1 THEN
        CALL Characteristics_InUse_Class(characteristicId, userId);
    ELSEIF characteristicTypeId = 2 THEN
        CALL Characteristics_InUse_Race(characteristicId, userId);
    ELSEIF characteristicTypeId = 3 THEN
        CALL Characteristics_InUse_Background(characteristicId, userId);
    END IF;
END;;

DELIMITER ;

CALL Characteristics_InUse(45, 1);
