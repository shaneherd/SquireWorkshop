DROP PROCEDURE IF EXISTS Encounters_Get_BattleCreatures;

DELIMITER ;;
CREATE PROCEDURE Encounters_Get_BattleCreatures(
    IN encounterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE isOwner BIT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT -1 AS result;
        END;

    SET isOwner = (SELECT user_id = userId FROM encounters WHERE user_id in (0, userId) AND id = encounterId);

    IF isOwner THEN
        SELECT ec.id, ec.creature_id, c.name, ec.encounter_creature_type_id, m.monster_number, ec.initiative, ec.round_added,
               ec.speed_to_display, ec.action_readied, ec.surprised, ec.removed,
               g.id AS group_id, g.grouped_initiative
        FROM encounter_creatures ec
            JOIN creatures c ON c.id = ec.creature_id
            LEFT JOIN encounter_monsters m ON m.encounter_creature_id = ec.id
            LEFT JOIN encounter_monster_groups g ON g.id = m.encounter_monster_group_id
        WHERE ec.encounter_id = encounterId
        ORDER BY ec.`order`, m.monster_number;
        
        SELECT ec.id AS encounter_creature_id, ecc.id AS encounter_creature_condition_id, condition_id, c.name AS condition_name, c.sid AS condition_sid,
               ecc.name, ends_on_save, save_dc, s.id AS save_type_id, s.name AS save_type_name, s.sid AS save_type_sid,
               ends_on_rounds_count, num_rounds, round_started,
               ends_on_target_turn, target_encounter_creature_id, target_creature_turn_phase_id,
               on_going_damage
        FROM encounter_creature_conditions ecc
            JOIN encounter_creatures ec ON ec.id = ecc.encounter_creature_id
            LEFT JOIN attributes c ON c.id = ecc.condition_id
            LEFT JOIN attributes s ON s.id = ecc.save_type
        WHERE ec.encounter_id = encounterId;
        
        SELECT ec.id AS encounter_creature_id, ecc.id AS encounter_creature_condition_id, num_dice, dice_size_id, misc_modifier,
               ability_modifier_id, abilityModifier.name AS ability_modifier_name, abilityModifier.sid AS ability_modifier_sid,
               damage_type_id, dt.name AS damage_type_name, dt.sid AS damage_type_sid
        FROM encounter_creatures ec
            JOIN encounter_creature_conditions ecc ON ecc.encounter_creature_id = ec.id
            JOIN encounter_creature_condition_damages d ON d.encounter_creature_condition_id = ecc.id
            LEFT JOIN attributes abilityModifier ON abilityModifier.id = d.ability_modifier_id
            LEFT JOIN attributes dt ON dt.id = d.damage_type_id
        WHERE ec.encounter_id = encounterId;

    END IF;
END;;

DELIMITER ;

