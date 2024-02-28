DROP PROCEDURE IF EXISTS Characteristics_ConditionImmunities;

DELIMITER ;;
CREATE PROCEDURE Characteristics_ConditionImmunities(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT a.id, a.name, a.sid, a.user_id = userId AS is_author
    FROM characteristic_condition_immunities cci
        JOIN attributes a ON cci.condition_id = a.id
    WHERE cci.characteristic_id = characteristicId;
END;;

DELIMITER ;

CALL Characteristics_ConditionImmunities(2, 1);

