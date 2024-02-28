DROP PROCEDURE IF EXISTS Creatures_Get_MissingFeatures;

DELIMITER ;;
CREATE PROCEDURE `Creatures_Get_MissingFeatures`(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN search VARCHAR(50),
    IN isPassive BIT,
    IN isFeat BIT,
    IN characteristicTypeId TINYINT UNSIGNED,
    IN characteristicId INT UNSIGNED,
    IN includeChildren BIT,
    IN characterLevelId INT UNSIGNED,
    IN isRanged BIT,
    IN isAreaOfEffect BIT,
    IN areaOfEffectId INT UNSIGNED,
    IN tagArray VARCHAR(100),

    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS user_list
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_features
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_tags
    (
        id INT UNSIGNED NOT NULL
    );

    IF characteristicId IS NOT NULL THEN
        INSERT INTO temp_characteristics (id) VALUES (characteristicId);

        INSERT INTO temp_characteristics (id)
        WITH RECURSIVE parents (parent_characteristic_id) AS
        (
            SELECT parent_characteristic_id
            FROM characteristics
            WHERE id = characteristicId

            UNION ALL

            SELECT c2.parent_characteristic_id
            FROM parents p
                JOIN characteristics AS c2 ON p.parent_characteristic_id = c2.id AND c2.parent_characteristic_id IS NOT NULL
        )
        SELECT parent_characteristic_id FROM parents WHERE parent_characteristic_id IS NOT NULl;

        IF includeChildren THEN
            INSERT INTO temp_characteristics (id)
            WITH RECURSIVE children (id) AS
            (
               SELECT id
               FROM characteristics
               WHERE parent_characteristic_id = characteristicId

               UNION ALL

               SELECT c2.id
               FROM children c
                        JOIN characteristics AS c2 ON c.id = c2.parent_characteristic_id
            )
            SELECT id FROM children;
        END IF;
    END IF;

    IF tagArray IS NOT NULL THEN
        SET @sql = CONCAT('INSERT INTO temp_tags (id) SELECT id FROM creature_tags WHERE id IN (', tagArray, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    INSERT INTO user_list
    SELECT id FROM powers WHERE user_id = userId
    UNION
    SELECT power_id FROM powers_shared WHERE user_id = userId;

    INSERT INTO temp_features
    SELECT p.id
    FROM user_list up
        JOIN powers p ON up.id = p.id
        JOIN features f ON f.power_id = p.id
        LEFT JOIN creature_power_tags tags ON tags.power_id = p.id
    WHERE p.id NOT IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId)
        AND (search IS NULL OR search = '' OR search = '%%' OR p.name LIKE search)
        AND (isPassive IS NULL OR f.passive = isPassive)
        AND (isFeat IS NULL
                 OR (isFeat = 1 AND f.characteristic_type_id IS NULL)
                 OR (isFeat = 0 AND f.characteristic_type_id IS NOT NULL AND (
                     characteristicTypeId IS NULL OR (
                         f.characteristic_type_id = characteristicTypeId AND (
                             characteristicId IS NULL OR f.characteristic_id IN (SELECT id FROM temp_characteristics)
                            )
                         )
                     )
                 )
            )
        AND (characterLevelId IS NULL OR f.character_level_id = characterLevelId)
        AND (isRanged IS NULL
                 OR (isRanged = 1 AND p.range_type = 5)
                 OR (isRanged = 0 AND p.range_type != 5))
        AND (isAreaOfEffect IS NULL
                 OR (isAreaOfEffect = 1 AND p.area_of_effect_id IS NOT NULL AND (areaOfEffectId IS NULL OR p.area_of_effect_id = areaOfEffectId))
                 OR (isAreaOfEffect = 0 AND p.area_of_effect_id IS NULL))
        AND (tagArray IS NULL OR tags.creature_tag_id IN (SELECT id FROM temp_tags))
    GROUP BY p.id, p.name
    ORDER BY p.name
    LIMIT offset, pageSize;

    # Features
    SELECT p.id AS feature_id, p.name AS feature_name, p.sid as feature_sid, p.user_id = userId AS feature_is_author,
           f.characteristic_type_id, c.id AS characteristic_id, c.name AS characteristic_name, c.sid AS characteristic_sid, c.user_id = userId AS characteristic_is_author, f.passive
    FROM temp_features tf
        JOIN powers p ON p.id = tf.id
        JOIN features f ON f.power_id = p.id
        LEFT JOIN characteristics c ON c.id = f.characteristic_id
    GROUP BY p.id;

    # Tags
    SELECT p.power_id, t.id, t.power_type_id, t.title, t.color
    FROM creature_power_tags p
        JOIN creature_tags t ON p.creature_tag_id = t.id
    WHERE p.creature_id = characterId and p.power_id IN (SELECT id FROM temp_features);

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_features;
    DROP TEMPORARY TABLE IF EXISTS user_list;
    DROP TEMPORARY TABLE IF EXISTS temp_tags;
END;;

DELIMITER ;

# CALL Creatures_Get_MissingFeatures(1, 1, '', null, 0, 1, 45, 1, null, null, null, null, '11,12', 0, 1000);