DROP PROCEDURE IF EXISTS Characteristics_Senses;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Senses(
    IN characteristicId INT UNSIGNED
)
BEGIN
    SELECT `sense_id`, `range`
    FROM characteristic_senses
    WHERE characteristic_id = characteristicId;
END;;

DELIMITER ;

CALL Characteristics_Senses(2);

