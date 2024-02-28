DROP PROCEDURE IF EXISTS Monsters_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Monsters_GetAddToMyStuffDetails(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN checkRights BIT
)
BEGIN
    DECLARE authorMonsterId INT UNSIGNED;
    DECLARE existingMonsterId INT UNSIGNED;
    DECLARE authorUserId MEDIUMINT UNSIGNED;

    IF checkRights = 0 THEN
        SET authorMonsterId = monsterId;
    ELSE
        SET authorMonsterId = (SELECT published_parent_id FROM monsters WHERE user_id = userId AND id = monsterId);
        IF authorMonsterId IS NULL THEN
            SET authorMonsterId = (SELECT monster_id FROM monsters_public WHERE monster_id = monsterId);
        END IF;
        IF authorMonsterId IS NULL THEN
            SET authorMonsterId = (SELECT monster_id FROM monsters_private WHERE user_id = userId AND monster_id = monsterId);
        END IF;
    END IF;

    SELECT user_id
    INTO authorUserId
    FROM monsters WHERE id = authorMonsterId;

    SELECT id
    INTO existingMonsterId
    FROM monsters WHERE published_parent_id = authorMonsterId AND user_id = userId;

    SELECT authorMonsterId AS author_monster_id,
           authorUserId AS author_user_id,
           existingMonsterId AS existing_monster_id;
END;;

DELIMITER ;

# CALL Monsters_GetAddToMyStuffDetails(253, 12);
