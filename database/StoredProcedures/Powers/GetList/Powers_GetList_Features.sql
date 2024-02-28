DROP PROCEDURE IF EXISTS Powers_GetList_Features;

DELIMITER ;;
CREATE PROCEDURE Powers_GetList_Features(
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
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE powerTypeId TINYINT UNSIGNED;
    SET powerTypeId = 2;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL
    );

    IF listSource = 1 THEN
        INSERT INTO temp_list
        SELECT id FROM powers WHERE user_id = userId
        UNION
        SELECT power_id FROM powers_shared WHERE user_id = userId;
    ELSEIF listSource = 2 THEN
        INSERT INTO temp_list SELECT power_id FROM powers_public;
    ELSEIF listSource = 3 THEN
        INSERT INTO temp_list SELECT power_id FROM powers_private WHERE user_id = userId;
    END IF;

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

    SELECT p.id, p.name, p.sid, p.user_id = userId AS is_author
    FROM temp_list up
        JOIN powers p ON p.id = up.id
            AND p.power_type_id = powerTypeId
        JOIN features f ON f.power_id = p.id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR name LIKE search)
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
    ORDER BY p.name
    LIMIT offset, pageSize;

    # todo - verify that a group by p.id isn't needed

    DROP TEMPORARY TABLE IF EXISTS temp_list;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
END;;

DELIMITER ;

# CALL Powers_GetList_Features(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

