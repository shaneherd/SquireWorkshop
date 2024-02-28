DROP PROCEDURE IF EXISTS Creatures_Delete;

DELIMITER ;;
CREATE PROCEDURE Creatures_Delete(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE creatureTypeId TINYINT UNSIGNED;

    SET creatureTypeId = (SELECT creature_type_id FROM creatures WHERE id = creatureId);

    IF creatureTypeId = 1 THEN
        CALL Creatures_Delete_Character(creatureId, userId);
    ELSEIF creatureTypeId = 2 THEN
        CALL Creatures_Delete_BattleMonster(creatureId, userId);
    ELSEIF creatureTypeId = 5 THEN
        CALL Creatures_Delete_Companion(creatureId, userId);
    END IF;
END;;

DELIMITER ;

