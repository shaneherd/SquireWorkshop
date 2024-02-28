DROP PROCEDURE IF EXISTS BattleMonsterPowers_Add;

DELIMITER ;;
CREATE PROCEDURE BattleMonsterPowers_Add(
    IN battleMonsterId INT UNSIGNED,
    IN powerId INT UNSIGNED,
    IN usesRemaining TINYINT UNSIGNED
)
BEGIN
    DECLARE originalCreaturePowerId INT UNSIGNED;
    DECLARE newCreaturePowerId INT UNSIGNED;

    SET originalCreaturePowerId = (SELECT id FROM battle_monster_powers WHERE battle_monster_id = battleMonsterId AND monster_power_id = powerId);

    IF originalCreaturePowerId IS NULL THEN
        INSERT INTO battle_monster_powers (battle_monster_id, monster_power_id, uses_remaining) VALUES (battleMonsterId, powerId, usesRemaining);
        SET newCreaturePowerId = (SELECT LAST_INSERT_ID());
    END IF;
END;;

DELIMITER ;

