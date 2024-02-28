DROP PROCEDURE IF EXISTS CreaturePowers_Spells_Update;

DELIMITER ;;
CREATE PROCEDURE CreaturePowers_Spells_Update(
    IN creaturePowerId INT UNSIGNED,
    IN isActive BIT,
    IN activeTargetCreatureId INT UNSIGNED,
    IN usesRemaining TINYINT UNSIGNED,
    IN isPrepared BIT,
    IN isConcentrating BIT,
    IN activeLevel TINYINT UNSIGNED
)
BEGIN
    CALL CreaturePowers_Update(creaturePowerId, isActive, activeTargetCreatureId, usesRemaining);

    UPDATE creature_spells
    SET
        prepared = isPrepared,
        concentrating = isConcentrating,
        active_level = activeLevel
    WHERE creature_power_id = creaturePowerId;
END;;

DELIMITER ;

# CALL CreaturePowers_Spells_Update(1);
