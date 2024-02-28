DROP PROCEDURE IF EXISTS Characteristics_Get;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characteristicTypeId TINYINT UNSIGNED;
    SET characteristicTypeId = (SELECT characteristic_type_id FROM characteristics WHERE id = characteristicId);
    SELECT characteristicTypeId AS characteristic_type_id;

    IF characteristicTypeId = 1 THEN
        CALL Characteristics_Get_Class(characteristicId, userId);
    ELSEIF characteristicTypeId = 2 THEN
        CALL Characteristics_Get_Race(characteristicId, userId);
    ELSEIF characteristicTypeId = 3 THEN
        CALL Characteristics_Get_Background(characteristicId, userId);
    END IF;
END;;

DELIMITER ;

CALL Characteristics_Get(1, 1);
