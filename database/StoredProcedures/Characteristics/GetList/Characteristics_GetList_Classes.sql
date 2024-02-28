DROP PROCEDURE IF EXISTS Characteristics_GetList_Classes;

DELIMITER ;;
CREATE PROCEDURE Characteristics_GetList_Classes(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN includeChildren BIT,
    IN authorOnly BIT,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CALL Characteristics_GetList(userId, search, offset, pageSize, includeChildren, authorOnly, 1, listSource);
END;;

DELIMITER ;

# CALL Characteristics_GetList_Classes(1, null, 0, 1000, 1, 1, 1);

