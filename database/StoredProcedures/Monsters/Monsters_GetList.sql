DROP PROCEDURE IF EXISTS Monsters_GetList;

DELIMITER ;;
CREATE PROCEDURE Monsters_GetList(
    IN userId MEDIUMINT UNSIGNED,
    IN search VARCHAR(45),

    IN monsterTypeId TINYINT UNSIGNED,
    IN challengeRatingId TINYINT UNSIGNED,
    IN alignmentId INT UNSIGNED,
    IN isSpellcaster BIT,
    IN isLegendary BIT,
    IN isFlying BIT,
    IN isSwimming BIT,

    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_flying
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_swimming
    (
        id INT UNSIGNED NOT NULL
    );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM monsters WHERE user_id = userId
        UNION
        SELECT monster_id FROM monsters_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list SELECT monster_id FROM monsters_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT monster_id FROM monsters_private WHERE user_id = userId;
    END IF;

    IF isFlying IS NOT NULL THEN
        INSERT INTO temp_flying (id)
        SELECT m.id FROM monsters m JOIN monster_speeds ms ON ms.monster_id = m.id
        WHERE ms.speed_id = 5 AND ms.value > 0;
    END IF;

    IF isSwimming IS NOT NULL THEN
        INSERT INTO temp_swimming (id)
        SELECT m.id FROM monsters m JOIN monster_speeds ms ON ms.monster_id = m.id
        WHERE ms.speed_id = 4 AND ms.value > 0;
    END IF;

    SELECT m.id, name, sid, m.user_id = userId AS is_author, m.challenge_rating_id
    FROM temp_list uc
        JOIN monsters m ON m.id = uc.id
        LEFT JOIN temp_flying f ON m.id = f.id
        LEFT JOIN temp_swimming s ON m.id = s.id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
      AND (monsterTypeId IS NULL OR m.monster_type_id = monsterTypeId)
      AND (challengeRatingId IS NULL OR m.challenge_rating_id = challengeRatingId)
      AND (alignmentId IS NULL OR m.alignment_id = alignmentId)
      AND (isSpellcaster IS NULL OR m.spellcaster = isSpellcaster)
      AND (isLegendary IS NULL OR (isLegendary = 0 AND m.legendary_points = 0) OR (isLegendary = 1 AND m.legendary_points != 0))
      AND (isFlying IS NULL OR (isFlying = 0 AND f.id IS NULL) OR (isFlying = 1 AND f.id IS NOT NULL))
      AND (isSwimming IS NULL OR (isSwimming = 0 AND s.id IS NULL) OR (isSwimming = 1 AND s.id IS NOT NULL))
    ORDER BY name
    LIMIT offset, pageSize;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
    DROP TEMPORARY TABLE IF EXISTS temp_flying;
    DROP TEMPORARY TABLE IF EXISTS temp_swimming;
END;;

DELIMITER ;

