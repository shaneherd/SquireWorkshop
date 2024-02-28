DROP PROCEDURE IF EXISTS CreaturePowers_Delete;

DELIMITER ;;
CREATE PROCEDURE CreaturePowers_Delete(
    IN creaturePowerId INT UNSIGNED
)
BEGIN
    DECLARE creatureId INT UNSIGNED;
    DECLARE powerId INT UNSIGNED;

    SELECT creature_id, power_id
    INTO creatureId, powerId
    FROM creature_powers
    WHERE id = creaturePowerId;

    DELETE FROM creature_spells
    WHERE creature_power_id = creaturePowerId;

    DELETE FROM creature_powers
    WHERE id = creaturePowerId;

    CALL CreatureActions_Powers_Delete(creatureId, powerId);
END;;

DELIMITER ;

# CALL CreaturePowers_Delete(1);
