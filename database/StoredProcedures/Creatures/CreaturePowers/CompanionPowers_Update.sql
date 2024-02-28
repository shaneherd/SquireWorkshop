DROP PROCEDURE IF EXISTS CompanionPowers_Update;

DELIMITER ;;
CREATE PROCEDURE CompanionPowers_Update(
    IN creatureId INT UNSIGNED,
    IN monsterPowerId INT UNSIGNED,
    IN monsterPowerTypeId TINYINT UNSIGNED,
    IN usesRemaining TINYINT UNSIGNED,
    IN isActive BIT,
    IN activeTargetCreatureId INT UNSIGNED
)
BEGIN
    DECLARE creaturePowerId INT UNSIGNED;
    SET creaturePowerId = (SELECT id FROM monster_power_states WHERE creature_id = creatureId AND monster_power_id = monsterPowerId);

    IF creaturePowerId IS NOT NULL THEN
        UPDATE monster_power_states
        SET active = isActive, active_target_creature_id = activeTargetCreatureId, uses_remaining = usesRemaining
        WHERE id = creaturePowerId;
    ELSE
        INSERT INTO monster_power_states (creature_id, monster_power_id, monster_power_type_id, uses_remaining, active, active_target_creature_id)
         VALUES (creatureId, monsterPowerId, monsterPowerTypeId, usesRemaining, isActive, activeTargetCreatureId);
    END IF;
END;;

DELIMITER ;

# CALL CompanionPowers_Update(1);
