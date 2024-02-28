DROP PROCEDURE IF EXISTS Powers_InUse;

DELIMITER ;;
CREATE PROCEDURE Powers_InUse(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE powerTypeId TINYINT UNSIGNED;
    SET powerTypeId = (SELECT power_type_id FROM powers WHERE id = powerId);

    IF powerTypeId = 1 THEN
        CALL Powers_InUse_Spell(powerId, userId);
    ELSEIF powerTypeId = 2 THEN
        CALL Powers_InUse_Feature(powerId, userId);
    END IF;
END;;

DELIMITER ;

CALL Powers_InUse(1, 1);
