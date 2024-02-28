DROP PROCEDURE IF EXISTS Creatures_Get;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE creatureTypeId TINYINT UNSIGNED;
    SET creatureTypeId = (SELECT creature_type_id FROM creatures WHERE id = creatureId);
    SELECT creatureTypeId AS creature_type_id;

    IF creatureTypeId = 1 THEN
        CALL Creatures_Get_Character(creatureId, userId);
    ELSEIF creatureTypeId = 2 THEN
        CALL Creatures_Get_Monster(creatureId, userId);
    ELSEIF creatureTypeId = 5 THEN
        CALL Creatures_Get_Companion(creatureId, userId);
    END IF;
END;;

DELIMITER ;

