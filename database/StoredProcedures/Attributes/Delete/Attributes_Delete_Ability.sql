DROP PROCEDURE IF EXISTS Attributes_Delete_Ability;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_Ability(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE isOwner BIT;
    DECLARE abilityId INT UNSIGNED;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO abilityId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF abilityId IS NOT NULL THEN
        UPDATE ammos a JOIN items i ON i.id = a.item_id SET attack_ability_modifier_id = NULL WHERE attack_ability_modifier_id = abilityId AND i.user_id = userId;
        UPDATE armors a JOIN items i ON i.id = a.item_id SET ability_modifier_id = NULL WHERE ability_modifier_id = abilityId AND i.user_id = userId;
        UPDATE character_ability_scores_to_increase asi JOIN creatures c ON c.id = asi.character_id SET ability_id = NULL WHERE ability_id = abilityId AND c.user_id = userId; # this should throw an exception if a match is found
        UPDATE character_chosen_classes ccc JOIN creatures c ON c.id = ccc.character_id SET spellcasting_ability_id = NULL WHERE spellcasting_ability_id = abilityId AND c.user_id = userId;
        UPDATE characteristics SET spellcasting_ability_id = NULL WHERE spellcasting_ability_id = abilityId AND user_id = userId;
        UPDATE characters ch JOIN creatures c ON c.id = ch.creature_id SET background_spellcasting_ability_id = NULL WHERE background_spellcasting_ability_id = abilityId AND c.user_id = userId;
        UPDATE characters ch JOIN creatures c ON c.id = ch.creature_id SET race_spellcasting_ability_id = NULL WHERE race_spellcasting_ability_id = abilityId AND c.user_id = userId;
        UPDATE classes cl JOIN characteristics c ON c.id = cl.characteristic_id SET hp_at_first_ability_modifier_id = NULL WHERE hp_at_first_ability_modifier_id = abilityId AND c.user_id = userId;
        UPDATE classes cl JOIN characteristics c ON c.id = cl.characteristic_id SET hp_gain_ability_modifier_id = NULL WHERE hp_gain_ability_modifier_id = abilityId AND c.user_id = userId;
        UPDATE classes cl JOIN characteristics c ON c.id = cl.characteristic_id SET prepare_ability_modifier_id = NULL WHERE prepare_ability_modifier_id = abilityId AND c.user_id = userId;
        UPDATE creature_ability_scores cas JOIN creatures c ON c.id = cas.creature_id SET ability_id = NULL WHERE ability_id = abilityId AND c.user_id = userId; # this should throw an exception if a match is found
        UPDATE monster_ability_scores mas JOIN monsters m ON m.id = mas.monster_id SET ability_id = NULL WHERE ability_id = abilityId AND m.user_id = userId; # this should throw an exception if a match is found
        DELETE ac FROM creature_ac_abilities ac JOIN attributes a ON a.id = ac.ability_id WHERE ability_id = abilityId AND a.user_id = userId;
        UPDATE creatures SET spellcasting_ability_id = NULL WHERE spellcasting_ability_id = abilityId AND user_id = userId;
        UPDATE creatures SET innate_spellcasting_ability_id = NULL WHERE innate_spellcasting_ability_id = abilityId AND user_id = userId;
        UPDATE features f JOIN powers p ON p.id = f.power_id SET save_ability_modifier_id = NULL WHERE save_ability_modifier_id = abilityId AND p.user_id = userId;
        UPDATE item_damages d JOIN items i ON i.id = d.item_id SET ability_modifier_id = NULL WHERE ability_modifier_id = abilityId AND i.user_id = userId;
        UPDATE monster_action_damages mad JOIN monster_actions ma ON ma.monster_power_id = mad.monster_action_id JOIN monster_powers mp ON mp.id = ma.monster_power_id JOIN creatures c ON c.id = mp.monster_id SET ability_modifier_id = NULL WHERE ability_modifier_id = abilityId AND c.user_id = userId;
        UPDATE monster_actions ma JOIN monster_powers mp ON mp.id = ma.monster_power_id JOIN monsters c ON c.id = mp.monster_id SET attack_ability_modifier_id = NULL WHERE attack_ability_modifier_id = abilityId AND c.user_id = userId;
        UPDATE monster_actions ma JOIN monster_powers mp ON mp.id = ma.monster_power_id JOIN monsters c ON c.id = mp.monster_id SET save_ability_modifier_id = NULL WHERE save_ability_modifier_id = abilityId AND c.user_id = userId;
        UPDATE monster_actions ma JOIN monster_powers mp ON mp.id = ma.monster_power_id JOIN monsters c ON c.id = mp.monster_id SET save_type_id = NULL WHERE save_type_id = abilityId AND c.user_id = userId;
        UPDATE monsters SET spellcasting_ability_id = NULL WHERE spellcasting_ability_id = abilityId AND user_id = userId;
        UPDATE monsters SET innate_spellcasting_ability_id = NULL WHERE innate_spellcasting_ability_id = abilityId AND user_id = userId;
        UPDATE monsters SET hit_dice_ability_modifier_id = NULL WHERE hit_dice_ability_modifier_id = abilityId AND user_id = userId;
        UPDATE power_damages d JOIN powers p ON p.id = d.power_id SET ability_modifier_id = NULL WHERE ability_modifier_id = abilityId AND p.user_id = userId;
        UPDATE power_modifiers d JOIN powers p ON p.id = d.power_id SET ability_modifier_id = NULL WHERE ability_modifier_id = abilityId AND p.user_id = userId;
        UPDATE power_limited_uses l JOIN powers p ON p.id = l.power_id SET ability_modifier_id = NULL WHERE ability_modifier_id = abilityId AND p.user_id = userId;
        UPDATE monster_innate_spells mis JOIN monsters m ON m.id = mis.monster_id SET mis.ability_modifier_id = NULL WHERE mis.ability_modifier_id = abilityId AND m.user_id = userId;
        UPDATE powers SET save_type_id = NULL WHERE save_type_id = abilityId AND user_id = userId;
        UPDATE skills s JOIN attributes a ON a.id = s.attribute_id SET ability_id = NULL WHERE ability_id = abilityId AND a.user_id = userId;
        UPDATE encounter_creature_conditions cc JOIN attributes a ON a.id = cc.save_type SET save_type = NULL WHERE save_type = abilityId AND a.user_id = userId;
        UPDATE encounter_creature_condition_damages d JOIN attributes a ON a.id = d.ability_modifier_id SET ability_modifier_id = NULL WHERE ability_modifier_id = abilityId AND a.user_id = userId;
        CALL Attributes_Delete_Common(abilityId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE ab FROM abilities ab JOIN attributes a ON a.id = ab.attribute_id WHERE attribute_id = abilityId AND a.user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = abilityId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = abilityId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

