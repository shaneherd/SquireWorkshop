DROP PROCEDURE IF EXISTS BattleMonster_Settings_Update;

DELIMITER ;;
CREATE PROCEDURE BattleMonster_Settings_Update(
    IN battleMonsterId INT UNSIGNED,
    IN settingId TINYINT UNSIGNED,
    IN settingValue TINYINT UNSIGNED
)
BEGIN
    REPLACE INTO battle_monster_setting_values (battle_monster_id, character_setting_id, value) VALUES
    (battleMonsterId, settingId, settingValue);
END;;

DELIMITER ;

