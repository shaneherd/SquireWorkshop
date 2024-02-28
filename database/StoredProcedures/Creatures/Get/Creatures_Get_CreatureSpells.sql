DROP PROCEDURE IF EXISTS Creatures_Get_CreatureSpells;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_CreatureSpells(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN search VARCHAR(50),
    IN isActive BIT,
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

    IN orderBy VARCHAR(100),
    IN orderByAscending BIT,
    IN innate BIT
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    DECLARE characterUserId MEDIUMINT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF characterId IS NULL THEN
        SET characterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;
    SET characterUserId = (SELECT user_id FROM creatures WHERE id = characterId);

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
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
            WHERE user_id = characterUserId AND id = characteristicId

            UNION ALL

            SELECT parent_characteristic_id
            FROM characteristics c
                JOIN characteristics_shared uc ON uc.user_id = characterUserId AND uc.characteristic_id = c.id AND c.id = characteristicId

            UNION ALL

            SELECT c2.parent_characteristic_id
            FROM parents p
                JOIN characteristics AS c2 ON p.parent_characteristic_id = c2.id AND c2.parent_characteristic_id IS NOT NULL
                JOIN characteristics uc2 ON uc2.user_id = characterUserId AND uc2.id = c2.id

            UNION ALL

            SELECT c2.parent_characteristic_id
            FROM parents p
                JOIN characteristics AS c2 ON p.parent_characteristic_id = c2.id AND c2.parent_characteristic_id IS NOT NULL
                JOIN characteristics_shared uc2 ON uc2.user_id = characterUserId AND uc2.characteristic_id = c2.id
        )
        SELECT parent_characteristic_id FROM parents WHERE parent_characteristic_id IS NOT NULl;
    END IF;

    IF tagArray IS NOT NULL THEN
        SET @sql = CONCAT('INSERT INTO temp_tags (id) SELECT id FROM creature_tags WHERE id IN (', tagArray, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    IF orderBy IS NULL THEN
        SET orderBy = 'name';
    END IF;

    IF orderByAscending IS NULL THEN
        SET orderByAscending = 1;
    END IF;

    # Get All Powers
    SELECT cp.id AS creature_power_id, cp.power_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author,
           c.characteristic_type_id, cp.assigned_characteristic_id, cs.prepared, cp.active,
           cp.active_target_creature_id, cs.concentrating, cs.active_level, cp.uses_remaining,
           s.level,p.recharge_on_short_rest, p.recharge_on_long_rest, p.extra_modifiers,
           p.modifiers_num_levels_above_base, p.modifier_advancement, s.casting_time_unit,
           cs.innate, cs.innate_slot, cs.innate_max_uses
    FROM creature_spells cs
        JOIN creature_powers cp ON cs.creature_power_id = cp.id
        JOIN powers p ON cp.power_id = p.id
        JOIN spells s ON s.power_id = p.id
        LEFT JOIN characteristics c ON c.id = cp.assigned_characteristic_id
    WHERE cp.creature_id = characterId AND cs.innate = innate
    ORDER BY
        (CASE WHEN orderBy = 'name' AND orderByAscending = 1 THEN p.name END),
        (CASE WHEN orderBy = 'name' AND orderByAscending = 0 THEN p.name END) DESC,
        (CASE WHEN orderBy = 'level' AND orderByAscending = 1 THEN s.level END),
        (CASE WHEN orderBy = 'level' AND orderByAscending = 0 THEN s.level END) DESC;

    # Get Filtered
    SELECT DISTINCT(cp.power_id)
    FROM creature_powers cp
        JOIN creature_spells cs ON cs.creature_power_id = cp.id
        JOIN spells s ON s.power_id = cp.power_id
        JOIN powers p ON p.id = s.power_id
        LEFT JOIN characteristic_spell_configurations csc ON csc.spell_id = s.power_id
        LEFT JOIN characteristics c ON c.id = csc.characteristic_id
        LEFT JOIN creature_power_tags tags ON tags.power_id = p.id
    WHERE cp.creature_id = characterId
        AND cs.innate = innate
        AND (search IS NULL OR search = '' OR search = '%%' OR p.name LIKE search)
        AND (characteristicId IS NULL OR (csc.characteristic_id IN (SELECT id FROM temp_characteristics) AND (csc.user_id = characterUserId OR csc.user_id = c.user_id)))
        AND (isActive IS NULL OR cp.active = isActive)
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
        AND (tagArray IS NULL OR tags.creature_tag_id IN (SELECT id FROM temp_tags));

    # Tags
    SELECT p.power_id, t.id, t.power_type_id, t.title, t.color
    FROM creature_power_tags p
             JOIN creature_tags t ON p.creature_tag_id = t.id
    WHERE p.creature_id = characterId and p.power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 1);

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
    WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 1)
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
    WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 1)
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
    WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId AND power_type_id = 1)
        AND character_advancement = 0
        AND extra = 1;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_tags;
END;;

DELIMITER ;

# CALL Creatures_Get_CreatureSpells(1, 1, null, null, null, null,
#     null, null, null, null, null, null, null,
#     null, null,null,'level',0);

