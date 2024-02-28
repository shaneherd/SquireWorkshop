DROP PROCEDURE IF EXISTS Creatures_Get_MissingSpells;

DELIMITER ;;
CREATE PROCEDURE `Creatures_Get_MissingSpells`(
    IN creatureId INT UNSIGNED,
    IN assignedCharacteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN search VARCHAR(50),
    IN spellSchoolId INT UNSIGNED,
    IN isRitual BIT,
    IN spellLevel TINYINT UNSIGNED,
    IN isVerbal BIT,
    IN isSomatic BIT,
    IN isMaterial BIT,
    IN isInstantaneous BIT,
    IN isConcentration BIT,
    IN isAreaOfEffect BIT,
    IN areaOfEffectId INT UNSIGNED,
    IN characteristicId INT UNSIGNED,
    IN tagArray VARCHAR(100),

    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN powerInnate BIT
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

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_spells
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
            FROM characteristics c
            WHERE user_id = userId AND id = characteristicId

            UNION ALL

            SELECT parent_characteristic_id
            FROM characteristics c
                JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = c.id AND c.id = characteristicId

            UNION ALL

            SELECT c2.parent_characteristic_id
            FROM parents p
                JOIN characteristics AS c2 ON p.parent_characteristic_id = c2.id AND c2.parent_characteristic_id IS NOT NULL
                JOIN characteristics uc2 ON uc2.user_id = userId AND uc2.id = c2.id

            UNION ALL

            SELECT c2.parent_characteristic_id
            FROM parents p
                JOIN characteristics AS c2 ON p.parent_characteristic_id = c2.id AND c2.parent_characteristic_id IS NOT NULL
                JOIN characteristics_shared uc2 ON uc2.user_id = userId AND uc2.characteristic_id = c2.id
        )
        SELECT parent_characteristic_id FROM parents WHERE parent_characteristic_id IS NOT NULl;
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

    INSERT INTO temp_spells
    SELECT p.id
    FROM user_list up
        JOIN powers p ON p.id = up.id
        JOIN spells s ON s.power_id = p.id
        LEFT JOIN characteristic_spell_configurations csc ON csc.spell_id = s.power_id
        LEFT JOIN characteristics c ON c.id = csc.characteristic_id
        LEFT JOIN creature_power_tags tags ON tags.power_id = p.id
    WHERE p.id NOT IN (
            SELECT cp.power_id
            FROM creature_spells cs
                JOIN creature_powers cp ON cs.creature_power_id = cp.id
            WHERE cp.creature_id = characterId
              AND (
                  (assignedCharacteristicId IS NULL && cp.assigned_characteristic_id IS NULL)
                      OR cp.assigned_characteristic_id = assignedCharacteristicId)
              AND cs.innate = powerInnate
        )
        AND (search IS NULL OR search = '' OR search = '%%' OR p.name LIKE search)
        AND (characteristicId IS NULL OR (csc.characteristic_id IN (SELECT id FROM temp_characteristics) AND (csc.user_id = userId OR csc.user_id = c.user_id)))
        AND (spellSchoolId IS NULL OR s.spell_school_id = spellSchoolId)
        AND (isRitual IS NULL OR s.ritual = isRitual)
        AND (spellLevel IS NULL OR s.level = spellLevel)
        AND (isVerbal IS NULL OR s.verbal = isVerbal)
        AND (isSomatic IS NULL OR s.somatic = isSomatic)
        AND (isMaterial IS NULL OR s.material = isMaterial)
        AND (isInstantaneous IS NULL OR s.instantaneous = isInstantaneous)
        AND (isConcentration IS NULL OR s.concentration = isConcentration)
        AND (isAreaOfEffect IS NULL
                 OR (isAreaOfEffect = 1 AND p.area_of_effect_id IS NOT NULL AND (areaOfEffectId IS NULL OR p.area_of_effect_id = areaOfEffectId))
                 OR (isAreaOfEffect = 0 AND p.area_of_effect_id IS NULL))
        AND (tagArray IS NULL OR tags.creature_tag_id IN (SELECT id FROM temp_tags))
    GROUP BY p.id, p.name
    ORDER BY p.name
    LIMIT offset, pageSize;

    # Spells
    SELECT p.id AS spell_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author, s.level AS spell_level
    FROM temp_spells ts
        JOIN powers p ON p.id = ts.id
        JOIN spells s ON s.power_id = p.id
        LEFT JOIN characteristic_spell_configurations csc ON csc.spell_id = s.power_id
    GROUP BY p.id;

    # Tags
    SELECT p.power_id, t.id, t.power_type_id, t.title, t.color
    FROM creature_power_tags p
        JOIN creature_tags t ON p.creature_tag_id = t.id
    WHERE p.creature_id = characterId and p.power_id IN (SELECT id FROM temp_spells);
    
    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_spells;
    DROP TEMPORARY TABLE IF EXISTS user_list;
    DROP TEMPORARY TABLE IF EXISTS temp_tags;
END;;

DELIMITER ;

# CALL Creatures_Get_MissingSpells(3, 13, 1, 'test', null, null, null, null, null, null, null, null, null, null, null, null, 0, 1000);

