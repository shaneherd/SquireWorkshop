DROP PROCEDURE IF EXISTS Monsters_Share_Public;

DELIMITER ;;
CREATE PROCEDURE Monsters_Share_Public(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userMonsterId INT UNSIGNED;

    SET userMonsterId = (SELECT id FROM monsters WHERE user_id = userId AND id = monsterId);
    IF userMonsterId IS NOT NULL THEN
        INSERT IGNORE INTO monsters_public (monster_id) VALUES (userMonsterId);
    END IF;
END;;

DELIMITER ;

# CALL Creatures_Share_Public(253, 12);
