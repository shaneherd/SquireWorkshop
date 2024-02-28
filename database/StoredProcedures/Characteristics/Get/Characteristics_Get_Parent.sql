DROP PROCEDURE IF EXISTS Characteristics_Get_Parent;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_Parent(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characteristicTypeId TINYINT UNSIGNED;
    DECLARE parentId INT UNSIGNED;

    SELECT characteristic_type_id, parent_characteristic_id
    INTO characteristicTypeId, parentId
    FROM characteristics
    WHERE id = characteristicId;

    SELECT characteristicTypeId AS characteristic_type_id;

    IF characteristicTypeId = 1 THEN
        CALL Characteristics_Get_Class(parentId, userId);
    ELSEIF characteristicTypeId = 2 THEN
        CALL Characteristics_Get_Race(parentId, userId);
    ELSEIF characteristicTypeId = 3 THEN
        CALL Characteristics_Get_Background(parentId, userId);
    END IF;
END;;

DELIMITER ;

CALL Characteristics_Get_Parent(1, 1);
