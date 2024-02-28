DROP PROCEDURE IF EXISTS Characteristics_Get_Relatives;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_Relatives(
    IN characteristicId INT UNSIGNED,
    IN parentCharacteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CALL Characteristics_Get_Children(characteristicId, userId, 1);
    CALL Characteristics_Get_Parents(parentCharacteristicId, userId);
END;;

DELIMITER ;

CALL Characteristics_Get_Relatives(15, 14, 1);
