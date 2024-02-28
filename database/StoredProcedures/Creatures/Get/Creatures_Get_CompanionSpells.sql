DROP PROCEDURE IF EXISTS Creatures_Get_CompanionSpells;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_CompanionSpells(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE companionId INT UNSIGNED;
    DECLARE monsterId INT UNSIGNED;

    SET companionId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF companionId IS NULL THEN
        SET companionId = (SELECT c.companion_id
                           FROM character_companions c
                                    JOIN campaign_characters cc ON cc.creature_id = c.character_id AND c.companion_id = creatureId
                                    JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                           LIMIT 1);
    END IF;
    SET monsterId = (SELECT monster_id FROM companions WHERE creature_id = companionId);

    # Spells
    SELECT cp.id AS creature_power_id, ms.spell_id AS power_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author,
           cp.assigned_characteristic_id, cs.prepared, cp.active,
           cp.active_target_creature_id, cs.concentrating, cs.active_level, cp.uses_remaining,
           s.level, p.recharge_on_short_rest, p.recharge_on_long_rest, p.extra_modifiers,
           p.modifiers_num_levels_above_base, p.modifier_advancement, s.casting_time_unit
    FROM monster_spells ms
        JOIN powers p ON ms.spell_id = p.id
        JOIN spells s ON s.power_id = p.id
        LEFT JOIN creature_powers cp ON cp.creature_id = companionId AND cp.power_id = ms.spell_id
        LEFT JOIN creature_spells cs ON cs.creature_power_id = cp.id
    WHERE ms.monster_id = monsterId
    ORDER BY p.name;

    # Innate Spells
    SELECT cp.id AS creature_power_id, ms.spell_id AS power_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author,
           cp.assigned_characteristic_id, cs.prepared, cp.active,
           cp.active_target_creature_id, cs.concentrating, ms.slot AS active_level, cp.uses_remaining,
           s.level, p.recharge_on_short_rest, p.recharge_on_long_rest, p.extra_modifiers,
           p.modifiers_num_levels_above_base, p.modifier_advancement, s.casting_time_unit,
           ms.limited_use_type_id, ms.quantity, ms.ability_modifier_id, ms.dice_size_id, ms.slot
    FROM monster_innate_spells ms
        JOIN powers p ON ms.spell_id = p.id
        JOIN spells s ON s.power_id = p.id
        LEFT JOIN creature_powers cp ON cp.creature_id = companionId AND cp.power_id = ms.spell_id
        LEFT JOIN creature_spells cs ON cs.creature_power_id = cp.id
    WHERE ms.monster_id = monsterId
    ORDER BY p.name;
END;;

DELIMITER ;

