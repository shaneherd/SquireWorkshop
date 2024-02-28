DROP PROCEDURE IF EXISTS Monster_MonsterPowers_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Monster_MonsterPowers_GetAddToMyStuffDetails(
    IN authorMonsterId INT UNSIGNED,
    IN authorUserId MEDIUMINT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_powers
    SELECT id
    FROM monster_powers
    WHERE monster_id = authorMonsterId AND user_id IN (0, authorUserId);

    SELECT tp.id AS author_power_id, 2 AS author_monster_power_type_id, p.id AS existing_power_id, p.monster_power_type_id AS existing_monster_power_type_id
    FROM temp_powers tp
        LEFT JOIN monster_powers p ON p.published_parent_id = tp.id AND p.user_id = userId;

    SELECT id
    FROM monster_powers
    WHERE user_id = userId AND (published_parent_id IS NULL OR published_parent_id NOT IN (SELECT id FROM temp_powers));

    DROP TEMPORARY TABLE IF EXISTS temp_powers;
END;;

DELIMITER ;

# CALL MonsterPowers_GetAddToMyStuffDetails(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

