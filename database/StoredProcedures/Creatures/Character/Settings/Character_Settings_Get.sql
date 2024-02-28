DROP PROCEDURE IF EXISTS Character_Settings_Get;

DELIMITER ;;
CREATE PROCEDURE Character_Settings_Get(
    IN characterId INT UNSIGNED
)
BEGIN
    SELECT
        character_setting_category_id,
        character_setting_id,
        value
    FROM character_setting_values csv
    JOIN character_settings cs on csv.character_setting_id = cs.id
    WHERE character_id = characterId;

    SELECT `character_page_type_id`, `order`, `visible` FROM character_pages WHERE character_id = characterId ORDER BY `order`;
END;;

DELIMITER ;

CALL Character_Settings_Get(1);
