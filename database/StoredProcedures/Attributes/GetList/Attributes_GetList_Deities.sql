DROP PROCEDURE IF EXISTS Attributes_GetList_Deities;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_Deities(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CALL Attributes_GetList(userId, search, offset, pageSize, 16, null, null, listSource);
END;;

DELIMITER ;

# CALL Attributes_GetList_Deities(1, null, 0, 1000, 1);
