DROP PROCEDURE IF EXISTS Character_Settings_Update;

DELIMITER ;;
CREATE PROCEDURE Character_Settings_Update(
    IN characterId INT UNSIGNED,
    IN settingId TINYINT UNSIGNED,
    IN settingValue TINYINT UNSIGNED
)
BEGIN
    REPLACE INTO character_setting_values (character_id, character_setting_id, value) VALUES
    (characterId, settingId, settingValue);
END;;

DELIMITER ;

# CALL Character_Settings_Update(1, 2, 0);
