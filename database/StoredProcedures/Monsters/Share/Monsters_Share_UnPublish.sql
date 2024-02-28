DROP PROCEDURE IF EXISTS Monsters_Share_UnPublish;

DELIMITER ;;
CREATE PROCEDURE Monsters_Share_UnPublish(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userMonsterId INT UNSIGNED;

    SET userMonsterId = (SELECT id FROM monsters WHERE user_id = userId AND id = monsterId);
    IF userMonsterId IS NOT NULL THEN
        DELETE FROM monsters_public WHERE monster_id = userMonsterId;
        DELETE FROM monsters_private WHERE monster_id = userMonsterId;
    END IF;
END;;

DELIMITER ;

# CALL Creatures_Share_UnPublish(253, 12);
