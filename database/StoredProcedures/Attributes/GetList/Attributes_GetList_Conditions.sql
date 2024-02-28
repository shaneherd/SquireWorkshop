DROP PROCEDURE IF EXISTS Attributes_GetList_Conditions;

DELIMITER ;;
CREATE PROCEDURE Attributes_GetList_Conditions(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN orderByAscending BIT,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CALL Attributes_GetList(userId, search, offset, pageSize, 4, 'name', orderByAscending, listSource);
END;;

DELIMITER ;

# CALL Attributes_GetList_Conditions(1, null, 0, 1000, 0, 1);
