DROP PROCEDURE IF EXISTS Creatures_Get_BattleMonsterActions;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_BattleMonsterActions(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE battleMonsterId INT UNSIGNED;
    SET battleMonsterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF battleMonsterId IS NULL THEN
        SET battleMonsterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    SELECT b.id, b.monster_power_id, mp.name, b.active, b.active_target_creature_id, b.uses_remaining,
           l.quantity, l.limited_use_type_id, ma.legendary_cost
    FROM battle_monster_powers b
        JOIN monster_powers mp ON mp.id = b.monster_power_id
        JOIN monster_actions ma ON mp.id = ma.monster_power_id
        LEFT JOIN monster_power_limited_uses l ON l.monster_power_id = mp.id
    WHERE b.battle_monster_id = battleMonsterId
    ORDER BY mp.name;

    # Get All Powers
#     SELECT cp.id AS creature_power_id, p.id AS feature_id, p.name AS feature_name, p.sid as feature_sid, p.user_id = userId AS feature_is_author,
#            f.characteristic_type_id, c.id AS characteristic_id, c.name AS characteristic_name,
#            c.sid AS characteristic_sid, c.user_id = userId AS characteristic_is_author,
#            cp.active, cp.active_target_creature_id, cp.uses_remaining, f.passive,
#            p.recharge_on_short_rest, p.recharge_on_long_rest, p.modifier_advancement, p.extra_modifiers,
#            p.modifiers_num_levels_above_base, f.action_id
#     FROM creature_powers cp
#         JOIN features f ON f.power_id = cp.power_id
#         JOIN powers p ON p.id = f.power_id
#         LEFT JOIN characteristics c ON f.characteristic_id = c.id
#     WHERE cp.creature_id = battleMonsterId
#     ORDER BY name;

    # Limited Uses
#     SELECT p.power_id, p.limited_use_type_id, p.level_id, a.name AS level_name, a.sid AS level_sid, a.user_id = userId AS level_is_author, p.quantity, p.ability_modifier_id, p.dice_size_id
#     FROM power_limited_uses p
#         LEFT JOIN attributes a ON p.level_id = a.id
#     WHERE p.power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = battleMonsterId AND power_type_id = 2);

    # Modifiers - Base
#     SELECT power_id, modifier_category_id, modifier_sub_category_id, characteristic_dependant, attribute_id,
#            a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
#            a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
#            value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage, extra, character_advancement,
#            character_level_id, al.name AS character_level_name, al.sid AS character_level_sid, al.user_id = userId AS character_level_is_author,
#            pm.use_level, pm.use_half_level, pm.ability_modifier_id, ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
#     FROM power_modifiers pm
#         JOIN attributes a ON pm.attribute_id = a.id
#         LEFT JOIN attributes al ON character_level_id = al.id
#         LEFT JOIN attributes ab ON ability_modifier_id = ab.id
#     WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = battleMonsterId AND power_type_id = 2)
#         AND character_advancement = 0
#         AND extra = 0;

    # Modifiers - Advancement
#     SELECT power_id, modifier_category_id, modifier_sub_category_id, characteristic_dependant, attribute_id,
#            a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
#            a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
#            value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage, extra, character_advancement,
#            character_level_id, al.name AS character_level_name, al.sid AS character_level_sid, al.user_id = userId AS character_level_is_author,
#            pm.use_level, pm.use_half_level, pm.ability_modifier_id, ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
#     FROM power_modifiers pm
#         JOIN attributes a ON pm.attribute_id = a.id
#         LEFT JOIN attributes al ON character_level_id = al.id
#         LEFT JOIN attributes ab ON ability_modifier_id = ab.id
#     WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = battleMonsterId AND power_type_id = 2)
#         AND character_advancement = 1
#         AND extra = 0;

    # Modifiers - Extra
#     SELECT power_id, modifier_category_id, modifier_sub_category_id, characteristic_dependant, attribute_id,
#            a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
#            a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
#            value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage, extra, character_advancement,
#            character_level_id, al.name AS character_level_name, al.sid AS character_level_sid, al.user_id = userId AS character_level_is_author,
#            pm.use_level, pm.use_half_level, pm.ability_modifier_id, ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
#     FROM power_modifiers pm
#         JOIN attributes a ON pm.attribute_id = a.id
#         LEFT JOIN attributes al ON character_level_id = al.id
#         LEFT JOIN attributes ab ON ability_modifier_id = ab.id
#     WHERE power_id IN (SELECT power_id FROM creature_powers WHERE creature_id = battleMonsterId AND power_type_id = 2)
#         AND character_advancement = 0
#         AND extra = 1;
END;;

DELIMITER ;

