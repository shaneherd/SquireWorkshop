DROP PROCEDURE IF EXISTS BattleMonster_Settings_Get;

DELIMITER ;;
CREATE PROCEDURE BattleMonster_Settings_Get(
    IN battleMonsterId INT UNSIGNED
)
BEGIN
    SELECT
        character_setting_category_id,
        character_setting_id,
        value
    FROM battle_monster_setting_values csv
    JOIN character_settings cs on csv.character_setting_id = cs.id
    WHERE battle_monster_id = battleMonsterId;

    SELECT speed_to_display FROM encounter_creatures WHERE creature_id = battleMonsterId;

#     SELECT `character_page_type_id`, `order`, `visible` FROM character_pages WHERE character_id = battleMonsterId ORDER BY `order`;
END;;

DELIMITER ;

