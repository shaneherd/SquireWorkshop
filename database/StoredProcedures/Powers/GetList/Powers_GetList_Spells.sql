DROP PROCEDURE IF EXISTS Powers_GetList_Spells;

DELIMITER ;;
CREATE PROCEDURE Powers_GetList_Spells(
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
    IN offset INT UNSIGNED,
    IN pageSize INT UNSIGNED,
    IN listSource TINYINT UNSIGNED
)
BEGIN
    DECLARE powerTypeId TINYINT UNSIGNED;
    SET powerTypeId = 1;

    CREATE TEMPORARY TABLE IF NOT EXISTS applicable_conditions
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_spells
    (
        id INT UNSIGNED NOT NULL,
        level TINYINT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_list
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

    INSERT INTO temp_spells (id, level)
    SELECT p.id, s.level
    FROM temp_list up
        JOIN powers p ON p.id = up.id
            AND p.power_type_id = powerTypeId
        JOIN spells s ON s.power_id = p.id
        LEFT JOIN characteristic_spell_configurations csc ON csc.spell_id = s.power_id
        LEFT JOIN characteristics c ON c.id = csc.characteristic_id
    WHERE (search IS NULL OR search = '' OR search = '%%' OR p.name LIKE search)
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
        AND (characteristicId IS NULL OR (csc.characteristic_id IN (SELECT id FROM temp_characteristics) AND (csc.user_id = userId OR csc.user_id = c.user_id)))
    GROUP BY p.id, p.name
    ORDER BY p.name
    LIMIT offset, pageSize;

    SELECT p.id AS spell_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author, ts.level AS spell_level
    FROM temp_spells ts
        JOIN powers p ON p.id = ts.id;

    DROP TEMPORARY TABLE IF EXISTS temp_list;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_spells;
END;;

DELIMITER ;

# CALL Powers_GetList_Spells(1, null, null, null, null, null, null, null, null, null, null, null, null, 0, 1000, 1);

