DROP PROCEDURE IF EXISTS CreaturePowers_Update;

DELIMITER ;;
CREATE PROCEDURE CreaturePowers_Update(
    IN creaturePowerId INT UNSIGNED,
    IN isActive BIT,
    IN activeTargetCreatureId INT UNSIGNED,
    IN usesRemaining TINYINT UNSIGNED
)
BEGIN
    UPDATE creature_powers
    SET
        active = isActive,
        active_target_creature_id = activeTargetCreatureId,
        uses_remaining = usesRemaining
    WHERE id = creaturePowerId;
END;;

DELIMITER ;

# CALL CreaturePowers_Update(1);
