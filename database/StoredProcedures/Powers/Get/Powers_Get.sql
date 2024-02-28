DROP PROCEDURE IF EXISTS Powers_Get;

DELIMITER ;;
CREATE PROCEDURE Powers_Get(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE powerTypeId TINYINT UNSIGNED;
    SET powerTypeId = (SELECT power_type_id FROM powers WHERE id = powerId);
    SELECT powerTypeId AS power_type_id;

    IF powerTypeId = 1 THEN
        CALL Powers_Get_Spell(powerId, userId);
    ELSEIF powerTypeId = 2 THEN
        CALL Powers_Get_Feature(powerId, userId);
    END IF;
END;;

DELIMITER ;

CALL Powers_Get(1, 1);
