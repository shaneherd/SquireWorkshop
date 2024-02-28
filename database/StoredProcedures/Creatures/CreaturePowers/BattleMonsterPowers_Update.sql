DROP PROCEDURE IF EXISTS BattleMonsterPowers_Update;

DELIMITER ;;
CREATE PROCEDURE BattleMonsterPowers_Update(
    IN creaturePowerId INT UNSIGNED,
    IN isActive BIT,
    IN activeTargetCreatureId INT UNSIGNED,
    IN usesRemaining TINYINT UNSIGNED
)
BEGIN
    UPDATE battle_monster_powers
    SET
        active = isActive,
        active_target_creature_id = activeTargetCreatureId,
        uses_remaining = usesRemaining
    WHERE id = creaturePowerId;
END;;

DELIMITER ;

