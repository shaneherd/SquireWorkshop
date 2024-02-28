DROP PROCEDURE IF EXISTS Attributes_GetList_DamageTypes;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_DamageTypes(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CALL Attributes_GetList(userId, search, offset, pageSize, 5, null, null, listSource);
END;;

DELIMITER ;

# CALL Attributes_GetList_DamageTypes(1, null, 0, 1000, 1);
