DROP PROCEDURE IF EXISTS BattleCreatures_Delete;

DELIMITER ;;
CREATE PROCEDURE BattleCreatures_Delete(
    IN encounterCreatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE creatureTypeId TINYINT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE creatureId INT UNSIGNED;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT -1 AS result;
        END;

    START TRANSACTION;

    SELECT creature_id, encounter_creature_type_id, user_id = userId
    INTO creatureId, creatureTypeId, isOwner
    FROM encounter_creatures ec JOIN encounters e ON e.id = ec.encounter_id
    WHERE user_id in (0, userId) AND ec.id = encounterCreatureId;

    IF isOwner THEN
        IF creatureTypeId = 2 THEN -- MONSTER
            CALL Creatures_Delete_BattleMonster(creatureId, userId);
        ELSE
            DELETE d FROM encounter_creature_condition_damages d JOIN encounter_creature_conditions c ON c.id = d.encounter_creature_condition_id WHERE c.encounter_creature_id = encounterCreatureId;
            DELETE FROM encounter_creature_conditions WHERE encounter_creature_id = encounterCreatureId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

