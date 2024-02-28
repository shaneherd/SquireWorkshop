DROP PROCEDURE IF EXISTS Creatures_Delete_Common;

DELIMITER ;;
CREATE PROCEDURE Creatures_Delete_Common(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE cap FROM creatures c JOIN creature_attribute_profs cap ON cap.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cip FROM creatures c JOIN creature_item_profs cip ON cip.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE csc FROM creatures c JOIN creature_spell_configurations csc ON csc.creature_id = c.id WHERE c.id = creatureId AND (c.user_id = userId OR csc.user_id = userId);
	UPDATE creature_powers cp JOIN creatures c ON c.id = cp.creature_id SET active_target_creature_id = NULL WHERE active_target_creature_id = creatureId AND c.user_id = userId;
    DELETE cas FROM creatures c JOIN creature_active_spells cas ON cas.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_powers cp ON cp.creature_id = c.id JOIN creature_spells cs ON cs.creature_power_id = cp.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE css FROM creatures c JOIN creature_spell_slots css ON css.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cdm FROM creatures c JOIN creature_damage_modifiers cdm ON cdm.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cci FROM creatures c JOIN creature_condition_immunities cci ON cci.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cc FROM creatures c JOIN creature_conditions cc ON cc.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_senses cs ON cs.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cp FROM creatures c JOIN creature_powers cp ON cp.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    UPDATE creature_items ci JOIN creatures c ON c.id = ci.creature_id SET container_id = NULL WHERE creature_id = creatureId AND c.user_id = userId;
    DELETE cis FROM creatures c JOIN creature_items ci ON ci.creature_id = c.id JOIN creature_item_spells cis ON cis.creature_item_id = ci.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE ci FROM creatures c JOIN creature_items ci ON ci.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cai FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN chained_action_items cai ON cai.chained_action_id = ca.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cha FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN chained_actions cha ON cha.creature_action_id = ca.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cap FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN creature_action_powers cap ON cap.creature_action_id = ca.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cai FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN creature_action_items cai ON cai.creature_action_id = ca.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE ca FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id  WHERE c.id = creatureId AND c.user_id = userId;
    DELETE chd FROM creatures c JOIN creature_hit_dice chd ON chd.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cw FROM creatures c JOIN creature_wealth cw ON cw.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE ch FROM creatures c JOIN creature_health ch ON ch.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE ac FROM creatures c JOIN creature_ac_abilities ac ON ac.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cas FROM creatures c JOIN creature_ability_scores cas ON cas.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cf FROM creatures c JOIN creature_stored_filters cf ON cf.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_stored_sorts cs ON cs.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_spellcasting cs ON cs.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE cpt FROM creatures c JOIN creature_power_tags cpt ON cpt.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
    DELETE ct FROM creatures c JOIN creature_tags ct ON ct.creature_id = c.id WHERE c.id = creatureId AND c.user_id = userId;
	DELETE rdr FROM roll_dice_results rdr JOIN roll_results rr on rdr.roll_result_id = rr.id JOIN rolls r ON r.id = rr.roll_id JOIN creatures c ON c.id = r.creature_id WHERE r.creature_id = creatureId AND c.user_id = userId;
    DELETE rr FROM roll_results rr JOIN rolls r ON r.id = rr.roll_id JOIN creatures c ON c.id = r.creature_id WHERE r.creature_id = creatureId AND c.user_id = userId;
    UPDATE rolls r JOIN creatures c ON c.id = r.creature_id SET parent_roll_id = NULL WHERE creature_id = creatureId AND c.user_id = userId;
    DELETE r FROM rolls r JOIN creatures c ON c.id = r.creature_id WHERE creature_id = creatureId AND c.user_id = userId;
    DELETE d FROM creatures c JOIN encounter_creatures ec ON c.id = ec.creature_id AND c.id = creatureId JOIN encounter_creature_conditions bcc ON bcc.encounter_creature_id = ec.id JOIN encounter_creature_condition_damages d ON d.encounter_creature_condition_id = bcc.id WHERE c.user_id = userId;
    DELETE bcc FROM creatures c JOIN encounter_creatures ec ON c.id = ec.creature_id AND c.id = creatureId JOIN encounter_creature_conditions bcc ON bcc.encounter_creature_id = ec.id WHERE c.user_id = userId;
END;;

DELIMITER ;

