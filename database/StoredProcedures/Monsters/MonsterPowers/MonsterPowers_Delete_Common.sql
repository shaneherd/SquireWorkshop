DROP PROCEDURE IF EXISTS MonsterPowers_Delete_Common;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Delete_Common(
    IN monsterPowerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE l FROM monster_power_limited_uses l JOIN monster_powers p ON p.id = l.monster_power_id WHERE l.monster_power_id = monsterPowerId AND p.user_id = userId;
    DELETE m FROM monster_power_modifiers m JOIN monster_powers p ON p.id = m.monster_power_id WHERE m.monster_power_id = monsterPowerId AND p.user_id = userId;
    DELETE bmp FROM battle_monster_powers bmp JOIN monster_powers p ON p.id = bmp.monster_power_id WHERE bmp.monster_power_id = monsterPowerId AND p.user_id = userId;
    DELETE s FROM monster_power_states s JOIN monster_powers p ON p.id = s.monster_power_id WHERE s.monster_power_id = monsterPowerId AND p.user_id = userId;
END;;

DELIMITER ;

