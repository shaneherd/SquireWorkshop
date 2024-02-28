DROP PROCEDURE IF EXISTS SquireMonsterUpdates;

DELIMITER ;;
CREATE PROCEDURE SquireMonsterUpdates(
    IN userId INT
)
BEGIN
    SET @LichParalyzingTouchId = (SELECT id FROM monster_powers WHERE user_id = userId AND sid = 837);
    SET @damageTypeId = (SELECT id FROM attribute_types WHERE name = 'DAMAGE_TYPE');
    SET @coldDamageTypeId = (SELECT id FROM attributes WHERE name = 'Cold' AND user_id = userId AND attribute_type_id = @damageTypeId);
    SET @d6Id = (SELECT id FROM dice_sizes WHERE value = 6);

    SET @abilityTypeId = (SELECT id FROM attribute_types WHERE name = 'ABILITY');
    SET @chaId = (SELECT id FROM attributes WHERE name = 'Charisma' AND user_id = userId AND attribute_type_id = @abilityTypeId);
    SET @ammoId = (SELECT id FROM item_types WHERE name = 'AMMO');
    SET @DrowId = (SELECT id FROM monsters WHERE user_id = userId AND sid = 91);
    SET @ArrowId = (SELECT id FROM items WHERE name = 'Arrow' AND user_id = userId AND item_type_id = @ammoId);
    SET @CrossbowBoltId = (SELECT id FROM items WHERE name = 'Crossbow Bolt' AND user_id = userId AND item_type_id = @ammoId);

    SET @PitFiendId = (SELECT id FROM monsters WHERE user_id = userId AND sid = 38);

    INSERT INTO monster_actions (monster_power_id, action_type_id, legendary_cost, weapon_range_type_id, reach, normal_range, long_range, ammo_id, attack_type_id, temporary_hp, attack_mod, attack_ability_modifier_id, save_type_id, save_proficiency_modifier, save_ability_modifier_id, half_on_save, description) VALUES
    (@LichParalyzingTouchId, 1, 0, 1, 5, 0, 0, null, 1, 0, 12, null, null, 0, null, 0, 'The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.');

    INSERT INTO monster_action_damages (monster_action_id, num_dice, dice_size, ability_modifier_id, misc_mod, damage_type_id, healing) VALUES
    (@LichParalyzingTouchId, 3, @d6Id, null, 0, @coldDamageTypeId, 0);

    DELETE FROM monster_action_damages where monster_action_id = (SELECT id FROM monster_powers WHERE user_id = userId AND sid = 839);

    UPDATE monsters SET innate_spellcasting_ability_id = @chaId WHERE id = @DrowId;
    UPDATE monsters SET innate_spellcasting_ability_id = @chaId WHERE id = @PitFiendId;
    UPDATE monster_items SET item_id = @CrossbowBoltId WHERE monster_id = @DrowId AND item_id = @ArrowId;
END;;

DELIMITER ;

CALL SquireMonsterUpdates(0);