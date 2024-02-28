DROP PROCEDURE IF EXISTS Characteristics_GetList_Races;

DELIMITER ;;
CREATE PROCEDURE Characteristics_GetList_Races(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN includeChildren BIT,
    IN authorOnly BIT,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CALL Characteristics_GetList(userId, search, offset, pageSize, includeChildren, authorOnly, 2, listSource);
END;;

DELIMITER ;

# CALL Characteristics_GetList_Races(1, null, 0, 1000, 1, 0, 1);

