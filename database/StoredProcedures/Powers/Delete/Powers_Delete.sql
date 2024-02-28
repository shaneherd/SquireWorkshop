DROP PROCEDURE IF EXISTS Powers_Delete;

DELIMITER ;;
CREATE PROCEDURE Powers_Delete(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE powerTypeId TINYINT UNSIGNED;

    SET powerTypeId = (SELECT power_type_id FROM powers WHERE id = powerId);

    IF powerTypeId = 1 THEN
        CALL Powers_Delete_Spell(powerId, userId);
    ELSEIF powerTypeId = 2 THEN
        CALL Powers_Delete_Feature(powerId, userId);
    END IF;
END;;

DELIMITER ;

# CALL Powers_Delete(265, 1, 0, 0);
