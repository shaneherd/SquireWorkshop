DROP PROCEDURE IF EXISTS Creatures_Get_CreatureFeatures;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_CreatureFeatures(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN search VARCHAR(50),
    IN isActive BIT,
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

    IN orderBy VARCHAR(100),
    IN orderByAscending BIT
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF characterId IS NULL THEN
        SET characterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_tags
    (
        id INT UNSIGNED NOT NULL
    );

    IF orderBy IS NULL THEN
        SET orderBy = 'name';
    END IF;

    IF orderByAscending IS NULL THEN
        SET orderByAscending = 1;
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

    IF tagArray IS NOT NULL THEN
        SET @sql = CONCAT('INSERT INTO temp_tags (id) SELECT id FROM creature_tags WHERE id IN (', tagArray, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    # Get All Powers
    SELECT cp.id AS creature_power_id, p.id AS feature_id, p.name AS feature_name, p.sid as feature_sid, p.user_id = userId AS feature_is_author,
           f.characteristic_type_id, c.id AS characteristic_id, c.name AS characteristic_name,
           c.sid AS characteristic_sid, c.user_id = userId AS characteristic_is_author,
           cp.active, cp.active_target_creature_id, cp.uses_remaining, f.passive,
           p.recharge_on_short_rest, p.recharge_on_long_rest, p.modifier_advancement, p.extra_modifiers,
           p.modifiers_num_levels_above_base, f.action_id
    FROM creature_powers cp
        JOIN features f ON f.power_id = cp.power_id
        JOIN powers p ON p.id = f.power_id
        LEFT JOIN characteristics c ON f.characteristic_id = c.id
    WHERE cp.creature_id = characterId
    ORDER BY
        (CASE WHEN orderBy = 'name' AND orderByAscending = 1 THEN p.name END),
        (CASE WHEN orderBy = 'name' AND orderByAscending = 0 THEN p.name END) DESC,
        (CASE WHEN orderBy = 'level' AND orderByAscending = 1 THEN f.character_level_id END),
        (CASE WHEN orderBy = 'level' AND orderByAscending = 0 THEN f.character_level_id END) DESC,
        (CASE WHEN orderBy = 'category' AND orderByAscending = 1 THEN c.name END),
        (CASE WHEN orderBy = 'category' AND orderByAscending = 0 THEN c.name END) DESC;

    # Get Filtered
    SELECT DISTINCT(cp.power_id)
    FROM creature_powers cp
        JOIN features f ON f.power_id = cp.power_id
        JOIN powers p ON p.id = f.power_id
        LEFT JOIN creature_power_tags tags ON tags.power_id = p.id
    WHERE cp.creature_id = characterId
        AND (search IS NULL OR search = '' OR search = '%%' OR p.name LIKE search)
        AND (isActive IS NULL OR cp.active = isActive)
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
        AND (tagArray IS NULL OR tags.creature_tag_id IN (SELECT id FROM temp_tags));

    # Tags
    SELECT p.power_id, t.id, t.power_type_id, t.title, t.color
    FROM creature_power_tags p
        JOIN creature_tags t ON p.creature_tag_id = t.id
    WHERE p.creature_id = characterId and p.power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 2);

    # Limited Uses
    SELECT p.power_id, p.limited_use_type_id, p.level_id, a.name AS level_name, a.sid AS level_sid, a.user_id = userId AS level_is_author, p.quantity, p.ability_modifier_id, p.dice_size_id
    FROM power_limited_uses p
        LEFT JOIN attributes a ON p.level_id = a.id
    WHERE p.power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 2);

    # Modifiers - Base
    SELECT power_id, modifier_category_id, modifier_sub_category_id, characteristic_dependant, attribute_id,
           a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
           a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
           value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage, extra, character_advancement,
           character_level_id, al.name AS character_level_name, al.sid AS character_level_sid, al.user_id = userId AS character_level_is_author,
           pm.use_level, pm.use_half_level, pm.ability_modifier_id, ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
    FROM power_modifiers pm
        JOIN attributes a ON pm.attribute_id = a.id
        LEFT JOIN attributes al ON character_level_id = al.id
        LEFT JOIN attributes ab ON ability_modifier_id = ab.id
    WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 2)
        AND character_advancement = 0
        AND extra = 0;

    # Modifiers - Advancement
    SELECT power_id, modifier_category_id, modifier_sub_category_id, characteristic_dependant, attribute_id,
           a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
           a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
           value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage, extra, character_advancement,
           character_level_id, al.name AS character_level_name, al.sid AS character_level_sid, al.user_id = userId AS character_level_is_author,
           pm.use_level, pm.use_half_level, pm.ability_modifier_id, ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
    FROM power_modifiers pm
        JOIN attributes a ON pm.attribute_id = a.id
        LEFT JOIN attributes al ON character_level_id = al.id
        LEFT JOIN attributes ab ON ability_modifier_id = ab.id
    WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 2)
        AND character_advancement = 1
        AND extra = 0;

    # Modifiers - Extra
    SELECT power_id, modifier_category_id, modifier_sub_category_id, characteristic_dependant, attribute_id,
           a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
           a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
           value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage, extra, character_advancement,
           character_level_id, al.name AS character_level_name, al.sid AS character_level_sid, al.user_id = userId AS character_level_is_author,
           pm.use_level, pm.use_half_level, pm.ability_modifier_id, ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
    FROM power_modifiers pm
        JOIN attributes a ON pm.attribute_id = a.id
        LEFT JOIN attributes al ON character_level_id = al.id
        LEFT JOIN attributes ab ON ability_modifier_id = ab.id
    WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 2)
        AND character_advancement = 0
        AND extra = 1;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_tags;
END;;

DELIMITER ;

# CALL Creatures_Get_CreatureFeatures(1, 1, null, null, null, null, null, null, null, null, null, null, null, '11', null, null);
