DROP PROCEDURE IF EXISTS CreatureActions_Favorites_Reset;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Favorites_Reset(
    IN creatureId INT UNSIGNED
)
BEGIN
    UPDATE creature_actions
    SET favorite = 0, favorite_order = 0
    WHERE creature_id = creatureId;
END;;

DELIMITER ;

# CALL CreatureActions_Favorites_Reset(1);
