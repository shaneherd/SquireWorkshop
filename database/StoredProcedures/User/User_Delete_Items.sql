DROP PROCEDURE IF EXISTS User_Delete_Items;

DELIMITER ;;
CREATE PROCEDURE User_Delete_Items(
	IN userId INT UNSIGNED
) 
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    # Published Content
    UPDATE attributes SET published_parent_id = NULL WHERE published_parent_id IN (SELECT * FROM (SELECT id FROM attributes WHERE user_id = userId) AS a);
    UPDATE characteristics SET published_parent_id = NULL WHERE published_parent_id IN (SELECT * FROM (SELECT id FROM characteristics WHERE user_id = userId) AS a);
    UPDATE creatures SET published_parent_id = NULL WHERE published_parent_id IN (SELECT * FROM (SELECT id FROM creatures WHERE user_id = userId) AS a);
    UPDATE items SET published_parent_id = NULL WHERE published_parent_id IN (SELECT * FROM (SELECT id FROM items WHERE user_id = userId) AS a);
    UPDATE powers SET published_parent_id = NULL WHERE published_parent_id IN (SELECT * FROM (SELECT id FROM powers WHERE user_id = userId) AS a);

    DELETE ap FROM attributes_public ap JOIN attributes a ON a.id = ap.attribute_id WHERE a.user_id = userId;
    DELETE cp FROM characteristics_public cp JOIN characteristics c ON c.id = cp.characteristic_id WHERE c.user_id = userId;
    DELETE cp FROM creatures_public cp JOIN creatures c ON c.id = cp.creature_id WHERE c.user_id = userId;
    DELETE ip FROM items_public ip JOIN items i ON i.id = ip.item_id WHERE i.user_id = userId;
    DELETE pp FROM powers_public pp JOIN powers p ON p.id = pp.power_id WHERE p.user_id = userId;
    DELETE mp FROM monsters_public mp JOIN monsters m ON m.id = mp.monster_id WHERE m.user_id = userId;
    DELETE mpp FROM monster_powers_public mpp JOIN monster_powers mp ON mp.id = mpp.monster_power_id JOIN monsters m ON m.id = mp.monster_id WHERE m.user_id = userId;

    DELETE ap FROM attributes_private ap JOIN attributes a ON a.id = ap.attribute_id WHERE a.user_id = userId;
    DELETE cp FROM characteristics_private cp JOIN characteristics c ON c.id = cp.characteristic_id WHERE c.user_id = userId;
    DELETE cp FROM creatures_private cp JOIN creatures c ON c.id = cp.creature_id WHERE c.user_id = userId;
    DELETE ip FROM items_private ip JOIN items i ON i.id = ip.item_id WHERE i.user_id = userId;
    DELETE pp FROM powers_private pp JOIN powers p ON p.id = pp.power_id WHERE p.user_id = userId;
    DELETE mp FROM monsters_private mp JOIN monsters m ON m.id = mp.monster_id WHERE m.user_id = userId;
    DELETE mpp FROM monster_powers_private mpp JOIN monster_powers mp ON mp.id = mpp.monster_power_id JOIN monsters m ON m.id = mp.monster_id WHERE m.user_id = userId;

    DELETE FROM attributes_private WHERE user_id = userId;
    DELETE FROM characteristics_private WHERE user_id = userId;
    DELETE FROM creatures_private WHERE user_id = userId;
    DELETE FROM items_private WHERE user_id = userId;
    DELETE FROM powers_private WHERE user_id = userId;
    DELETE FROM monsters_private WHERE user_id = userId;
    DELETE FROM monster_powers_private WHERE user_id = userId;

    DELETE FROM attributes_shared WHERE user_id = userId;
    DELETE FROM characteristics_shared WHERE user_id = userId;
    DELETE FROM creatures_shared WHERE user_id = userId;
    DELETE FROM items_shared WHERE user_id = userId;
    DELETE FROM powers_shared WHERE user_id = userId;
    DELETE FROM monsters_shared WHERE user_id = userId;
    DELETE FROM monster_powers_shared WHERE user_id = userId;

    # Non-published Content

    # encounters
    DELETE ec FROM creatures c JOIN campaign_characters cc ON c.id = cc.creature_id JOIN encounter_characters ec ON cc.id = ec.campaign_character_id WHERE c.user_id = userId;
    DELETE cc FROM creatures c JOIN campaign_characters cc ON c.id = cc.creature_id WHERE c.user_id = userId;
    DELETE c FROM encounter_characters c JOIN encounter_creatures ec ON ec.id = c.encounter_creature_id JOIN encounters e ON e.id = ec.encounter_id WHERE e.user_id = userId;
    DELETE m FROM encounter_monsters m JOIN encounter_monster_groups g ON g.id = m.encounter_monster_group_id JOIN encounters e ON e.id = g.encounter_id WHERE e.user_id = userId;
    DELETE g FROM encounter_monster_groups g JOIN encounters e ON e.id = g.encounter_id WHERE e.user_id = userId;
    DELETE d FROM encounter_creature_condition_damages d JOIN encounter_creature_conditions c ON c.id = d.encounter_creature_condition_id JOIN encounter_creatures ec ON c.encounter_creature_id = ec.id JOIN encounters e ON ec.encounter_id = e.id WHERE e.user_id = userId;
    DELETE c FROM encounter_creature_conditions c JOIN encounter_creatures ec ON c.encounter_creature_id = ec.id JOIN encounters e ON ec.encounter_id = e.id WHERE e.user_id = userId;
    DELETE ec FROM encounter_creatures ec JOIN encounters e ON ec.encounter_id = e.id WHERE e.user_id = userId;
    DELETE eccd FROM creatures c JOIN encounter_creatures ec ON c.id = ec.creature_id JOIN encounter_creature_conditions ecc ON ec.id = ecc.encounter_creature_id JOIN encounter_creature_condition_damages eccd ON ecc.id = eccd.encounter_creature_condition_id WHERE c.user_id = userId;
    DELETE ecc FROM creatures c JOIN encounter_creatures ec ON c.id = ec.creature_id JOIN encounter_creature_conditions ecc ON ec.id = ecc.encounter_creature_id WHERE c.user_id = userId;
    DELETE ec FROM creatures c JOIN encounter_creatures ec ON c.id = ec.creature_id WHERE c.user_id = userId;
    DELETE FROM encounters WHERE user_id = userId;

    # campaigns
    DELETE cc FROM campaign_characters cc JOIN campaigns c ON c.id = cc.campaign_id WHERE c.user_id = userId;
    DELETE s FROM campaign_setting_values s JOIN campaigns c ON c.id = s.campaign_id WHERE c.user_id = userId;
    DELETE FROM campaigns WHERE user_id = userId;

    # battle_monsters
    DELETE s FROM battle_monster_setting_values s JOIN creatures c ON c.id = s.battle_monster_id WHERE c.user_id = userId;
    DELETE p FROM battle_monster_powers p JOIN creatures c ON c.id = p.battle_monster_id WHERE c.user_id = userId;
    DELETE bm FROM battle_monsters bm JOIN creatures c ON c.id = bm.creature_id WHERE c.user_id = userId;

    # monsters
    DELETE mf FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_features mf ON mf.monster_power_id = mp.id WHERE m.user_id = userId;
    DELETE mad FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_actions ma ON ma.monster_power_id = mp.id JOIN monster_action_damages mad ON mad.monster_action_id = ma.monster_power_id WHERE m.user_id = userId;
    DELETE ma FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_actions ma ON ma.monster_power_id = mp.id WHERE m.user_id = userId;
    DELETE ml FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_power_limited_uses ml ON ml.monster_power_id = mp.id WHERE m.user_id = userId;
    DELETE mps FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_power_states mps ON mps.monster_power_id = mp.id WHERE m.user_id = userId;
    DELETE mp FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id WHERE m.user_id = userId;
    DELETE ms FROM monster_speeds ms JOIN monsters m ON ms.monster_id = m.id WHERE m.user_id = userId;
    DELETE mci FROM monsters m JOIN monster_condition_immunities mci ON mci.monster_id = m.id WHERE m.user_id = userId;
    DELETE ms FROM monsters m JOIN monster_senses ms ON ms.monster_id = m.id WHERE m.user_id = userId;
    DELETE mdm FROM monsters m JOIN monster_damage_modifiers mdm ON mdm.monster_id = m.id WHERE m.user_id = userId;
    DELETE map FROM monsters m JOIN monster_attribute_profs map ON map.monster_id = m.id WHERE m.user_id = userId;
    DELETE mip FROM monsters m JOIN monster_item_profs mip ON mip.monster_id = m.id WHERE m.user_id = userId;
    DELETE mss FROM monsters m JOIN monster_spell_slots mss ON mss.monster_id = m.id WHERE m.user_id = userId;
    DELETE mas FROM monsters m JOIN monster_ability_scores mas ON mas.monster_id = m.id WHERE m.user_id = userId;
    DELETE ms FROM monsters m JOIN monster_spells ms ON ms.monster_id = m.id WHERE m.user_id = userId;
    DELETE mis FROM monsters m JOIN monster_innate_spells mis ON mis.monster_id = m.id WHERE m.user_id = userId;
    DELETE mi FROM monsters m JOIN monster_items mi ON mi.monster_id = m.id WHERE m.user_id = userId;
    DELETE FROM monsters WHERE user_id = userId;

    # characters
    DELETE cc FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_companions cc ON cc.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE cv FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_validation_ignored_powers cv ON cv.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE cv FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_validation cv ON cv.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE cbt FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_background_traits cbt ON cbt.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE csv FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_setting_values csv ON csv.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE chgr FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_chosen_classes ccc ON ccc.character_id = ch.creature_id JOIN character_health_gain_results chgr ON chgr.chosen_class_id = ccc.id WHERE c.user_id = userId;
    DELETE ccc FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_chosen_classes ccc ON ccc.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE casi FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_ability_scores_to_increase casi ON casi.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE cp FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_pages cp ON cp.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE n FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_notes n ON n.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE n FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_note_categories n ON n.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE ccs FROM creatures c JOIN characters ch ON ch.creature_id = c.id JOIN character_characteristic_spellcasting ccs ON ccs.character_id = ch.creature_id WHERE c.user_id = userId;
    DELETE ch FROM creatures c JOIN characters ch ON ch.creature_id = c.id WHERE c.user_id = userId;

    # companions
    DELETE csm FROM creatures c JOIN companions co ON co.creature_id = c.id AND c.user_id = userId JOIN companion_score_modifiers csm ON csm.companion_id = co.creature_id;
    DELETE mps FROM creatures c JOIN companions co ON co.creature_id = c.id AND c.user_id = userId JOIN monster_power_states mps ON mps.creature_id = co.creature_id;
    DELETE co FROM creatures c JOIN companions co ON co.creature_id = c.id WHERE c.user_id = userId;

    # creatures
    DELETE cap FROM creatures c JOIN creature_attribute_profs cap ON cap.creature_id = c.id WHERE c.user_id = userId;
    DELETE cip FROM creatures c JOIN creature_item_profs cip ON cip.creature_id = c.id WHERE c.user_id = userId;
    DELETE csc FROM creatures c JOIN creature_spell_configurations csc ON csc.creature_id = c.id WHERE (c.user_id = userId OR csc.user_id = userId);
    UPDATE creature_powers SET active_target_creature_id = NULL WHERE active_target_creature_id IN (SELECT id FROM creatures WHERE user_id = userId);
    DELETE cs FROM creatures c JOIN creature_powers cp ON cp.creature_id = c.id JOIN creature_spells cs ON cs.creature_power_id = cp.id WHERE c.user_id = userId;
    DELETE css FROM creatures c JOIN creature_spell_slots css ON css.creature_id = c.id WHERE c.user_id = userId;
    DELETE cdm FROM creatures c JOIN creature_damage_modifiers cdm ON cdm.creature_id = c.id WHERE c.user_id = userId;
    DELETE cci FROM creatures c JOIN creature_condition_immunities cci ON cci.creature_id = c.id WHERE c.user_id = userId;
    DELETE cc FROM creatures c JOIN creature_conditions cc ON cc.creature_id = c.id WHERE c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_senses cs ON cs.creature_id = c.id WHERE c.user_id = userId;
    DELETE cp FROM creatures c JOIN creature_powers cp ON cp.creature_id = c.id WHERE c.user_id = userId;
    DELETE cis FROM creatures c JOIN creature_items ci ON ci.creature_id = c.id JOIN creature_item_spells cis ON ci.id = cis.creature_item_id WHERE c.user_id = userId;
    DELETE cis FROM powers p JOIN spells s ON p.id = s.power_id JOIN creature_item_spells cis ON s.power_id = cis.spell_id WHERE p.user_id = userId;
    UPDATE creature_items ci JOIN creatures c ON ci.creature_id = c.id SET ci.container_id = NULL where c.user_id = userId;
    DELETE ci FROM creatures c JOIN creature_items ci ON ci.creature_id = c.id WHERE c.user_id = userId;
    DELETE cap FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN creature_action_powers cap ON cap.creature_action_id = ca.id WHERE c.user_id = userId;
    DELETE cai FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN creature_action_items cai ON cai.creature_action_id = ca.id WHERE c.user_id = userId;
    DELETE cai FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN chained_actions cha ON cha.creature_action_id = ca.id JOIN chained_action_items cai ON cai.chained_action_id = ca.id WHERE c.user_id = userId;
    DELETE ca FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id JOIN chained_actions cha ON cha.creature_action_id = ca.id WHERE c.user_id = userId;
    DELETE ca FROM creatures c JOIN creature_actions ca ON ca.creature_id = c.id  WHERE c.user_id = userId;
    DELETE chd FROM creatures c JOIN creature_hit_dice chd ON chd.creature_id = c.id WHERE c.user_id = userId;
    DELETE cw FROM creatures c JOIN creature_wealth cw ON cw.creature_id = c.id WHERE c.user_id = userId;
    DELETE ch FROM creatures c JOIN creature_health ch ON ch.creature_id = c.id WHERE c.user_id = userId;
    DELETE cas FROM creatures c JOIN creature_ability_scores cas ON cas.creature_id = c.id WHERE c.user_id = userId;
    DELETE cf FROM creatures c JOIN creature_stored_filters cf ON cf.creature_id = c.id WHERE c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_stored_sorts cs ON cs.creature_id = c.id WHERE c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_spellcasting cs ON cs.creature_id = c.id WHERE c.user_id = userId;
    DELETE cpt FROM creatures c JOIN creature_power_tags cpt ON cpt.creature_id = c.id WHERE c.user_id = userId;
    DELETE ct FROM creatures c JOIN creature_tags ct ON ct.creature_id = c.id WHERE c.user_id = userId;
    DELETE caa FROM creatures c JOIN creature_ac_abilities caa ON caa.creature_id = c.id WHERE c.user_id = userId;
    DELETE rdr FROM roll_dice_results rdr JOIN roll_results rr on rdr.roll_result_id = rr.id JOIN rolls r ON r.id = rr.roll_id JOIN creatures c ON r.creature_id = c.id WHERE c.user_id = userId;
    DELETE rr FROM roll_results rr JOIN rolls r ON r.id = rr.roll_id JOIN creatures c ON r.creature_id = c.id WHERE c.user_id = userId;
    UPDATE rolls r JOIN creatures c ON r.creature_id = c.id SET r.parent_roll_id = NULL where c.user_id = userId;
    DELETE r FROM rolls r JOIN creatures c ON r.creature_id = c.id WHERE c.user_id = userId;
    DELETE FROM creatures WHERE user_id = userId;

    # features
    DELETE f FROM powers p JOIN features f ON p.id = f.power_id WHERE p.user_id = userId;

    # characteristics
    # characteristic profs
    DELETE cp FROM characteristics c JOIN characteristic_attribute_modifiers cp ON c.id = cp.characteristic_id WHERE c.user_id = userId;
    DELETE cp FROM characteristics c JOIN characteristic_attribute_profs cp ON c.id = cp.characteristic_id WHERE c.user_id = userId;
    DELETE cp FROM characteristics c JOIN characteristic_choice_profs cp ON c.id = cp.characteristic_id WHERE c.user_id = userId;
    DELETE cp FROM characteristics c JOIN characteristic_item_profs cp ON c.id = cp.characteristic_id WHERE c.user_id = userId;
    DELETE csc FROM characteristics c JOIN characteristic_spell_configurations csc ON c.id = csc.characteristic_id WHERE (c.user_id = userId OR csc.user_id = userId);

    DELETE cse FROM characteristics c JOIN characteristic_starting_equipments cse ON c.id = cse.characteristic_id WHERE c.user_id = userId;

    DELETE cdm FROM characteristics c JOIN characteristic_damage_modifiers cdm ON c.id = cdm.characteristic_id WHERE c.user_id = userId;
    DELETE cs FROM characteristics c JOIN characteristic_senses cs ON c.id = cs.characteristic_id WHERE c.user_id = userId;
    DELETE cci FROM characteristics c JOIN characteristic_condition_immunities cci ON c.id = cci.characteristic_id WHERE c.user_id = userId;

    # backgrounds
    DELETE bt FROM characteristics c JOIN backgrounds b ON c.id = b.characteristic_id JOIN background_traits bt ON bt.background_id = c.id WHERE c.user_id = userId;
    DELETE b FROM characteristics c JOIN backgrounds b ON c.id = b.characteristic_id WHERE c.user_id = userId;

    # class
    DELETE casi FROM characteristics c JOIN classes cl ON c.id = cl.characteristic_id JOIN class_ability_score_increases casi ON casi.class_id = c.id WHERE c.user_id = userId;
    DELETE csap FROM characteristics c JOIN classes cl ON c.id = cl.characteristic_id JOIN class_secondary_attribute_profs csap ON csap.class_id = c.id WHERE c.user_id = userId;
    DELETE csip FROM characteristics c JOIN classes cl ON c.id = cl.characteristic_id JOIN class_secondary_item_profs csip ON csip.class_id = c.id WHERE c.user_id = userId;
    DELETE cscp FROM characteristics c JOIN classes cl ON c.id = cl.characteristic_id JOIN class_secondary_choice_profs cscp ON cscp.class_id = c.id WHERE c.user_id = userId;
    DELETE miac FROM characteristics c JOIN classes cl ON c.id = cl.characteristic_id JOIN magical_item_attunement_classes miac ON cl.characteristic_id = miac.class_id WHERE c.user_id = userId;
    DELETE cl FROM characteristics c JOIN classes cl ON c.id = cl.characteristic_id WHERE c.user_id = userId;

    # race
    DELETE rs FROM characteristics c JOIN races r ON c.id = r.characteristic_id JOIN race_speeds rs ON rs.race_id = c.id WHERE c.user_id = userId;
    DELETE r FROM characteristics c JOIN races r ON c.id = r.characteristic_id WHERE c.user_id = userId;

    UPDATE characteristics SET parent_characteristic_id = NULL WHERE user_id = userId;
    DELETE FROM characteristics WHERE user_id = userId;

    # itmes
    DELETE pi FROM items i JOIN pack_items pi ON pi.pack_id = i.id WHERE i.user_id = userId;
    DELETE pi FROM items i JOIN pack_items pi ON pi.item_id = i.id WHERE i.user_id = userId;
    DELETE p FROM items i JOIN packs p ON i.id = p.item_id WHERE i.user_id = userId; -- must be before all other items
    DELETE miaa FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_attunement_alignments miaa ON mi.item_id = miaa.magical_item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE miac FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_attunement_classes miac ON mi.item_id = miac.magical_item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE miar FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_attunement_races miar ON mi.item_id = miar.magical_item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE mitc FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_tables mit ON mi.item_id = mit.magical_item_id JOIN magical_item_table_cells mitc ON mitc.table_id = mit.id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE mit FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_tables mit ON mi.item_id = mit.magical_item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE mis FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_spells mis ON mi.item_id = mis.magical_item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE miai FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_applicable_items miai ON mi.item_id = miai.magical_item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE miai FROM items i JOIN magical_items mi ON i.id = mi.item_id JOIN magical_item_applicable_spells miai ON mi.item_id = miai.magical_item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE mi FROM items i JOIN magical_items mi ON i.id = mi.item_id WHERE i.user_id = userId; -- must be before all other items and after packs
    DELETE a FROM items i JOIN armors a ON i.id = a.item_id WHERE i.user_id = userId;
    DELETE g FROM items i JOIN gears g ON i.id = g.item_id WHERE i.user_id = userId;
    DELETE m FROM items i JOIN mounts m ON i.id = m.item_id WHERE i.user_id = userId;
    DELETE t FROM items i JOIN tools t ON i.id = t.item_id WHERE i.user_id = userId;
    DELETE t FROM items i JOIN treasures t ON i.id = t.item_id WHERE i.user_id = userId;
    DELETE v FROM items i JOIN vehicles v ON i.id = v.item_id WHERE i.user_id = userId;
    DELETE wwp FROM items i JOIN weapon_weapon_properties wwp ON wwp.weapon_id = i.id WHERE i.user_id = userId;
    DELETE w FROM items i JOIN weapons w ON i.id = w.item_id WHERE i.user_id = userId;
    DELETE a FROM items i JOIN ammos a ON i.id = a.item_id WHERE i.user_id = userId; -- must be after weapons
    DELETE d FROM items i JOIN item_damages d ON d.item_id = i.id WHERE i.user_id = userId;
    DELETE FROM items WHERE user_id = userId;

    # spells
    DELETE s FROM powers p JOIN spells s ON p.id = s.power_id WHERE p.user_id = userId;

    # powers
    DELETE plu FROM powers p JOIN power_limited_uses plu ON plu.power_id = p.id WHERE p.user_id = userId;
    DELETE pm FROM powers p JOIN power_modifiers pm ON pm.power_id = p.id WHERE p.user_id = userId;
    DELETE d FROM powers p JOIN power_damages d ON d.power_id = p.id WHERE p.user_id = userId;
    DELETE FROM powers WHERE user_id = userId;

    # attributes
    DELETE at FROM attributes a JOIN armor_types at ON a.id = at.attribute_id WHERE a.user_id = userId;
    DELETE ctss FROM attributes a JOIN caster_types ct ON a.id = ct.attribute_id JOIN caster_type_spell_slots ctss on ctss.caster_type_id = ct.attribute_id WHERE a.user_id = userId;
    DELETE ct FROM attributes a JOIN caster_types ct ON a.id = ct.attribute_id WHERE a.user_id = userId;
    DELETE cc FROM attributes a JOIN conditions c ON a.id = c.attribute_id JOIN connecting_conditions cc ON cc.parent_condition_id = a.id WHERE a.user_id = userId;
    DELETE cc FROM attributes a JOIN conditions c ON a.id = c.attribute_id JOIN connecting_conditions cc ON cc.child_condition_id = a.id WHERE a.user_id = userId;
    DELETE c FROM attributes a JOIN conditions c ON a.id = c.attribute_id WHERE a.user_id = userId;
    DELETE dt FROM attributes a JOIN damage_types dt ON a.id = dt.attribute_id WHERE a.user_id = userId;
    DELETE d FROM attributes a JOIN deities d ON a.id = d.attribute_id WHERE a.user_id = userId;
    DELETE dc FROM attributes a JOIN deity_categories dc ON a.id = dc.attribute_id WHERE a.user_id = userId;
    DELETE al FROM attributes a JOIN alignments al ON a.id = al.attribute_id WHERE a.user_id = userId; -- must be after deities
    DELETE l FROM attributes a JOIN languages l ON a.id = l.attribute_id WHERE a.user_id = userId;
    DELETE s FROM attributes a JOIN skills s ON a.id = s.attribute_id WHERE a.user_id = userId;
    DELETE tc FROM attributes a JOIN tool_categories tc ON a.id = tc.attribute_id WHERE a.user_id = userId;
    DELETE wp FROM attributes a JOIN weapon_properties wp ON a.id = wp.attribute_id WHERE a.user_id = userId;
    DELETE wt FROM attributes a JOIN weapon_types wt ON a.id = wt.attribute_id WHERE a.user_id = userId;
    DELETE aoe FROM attributes a JOIN area_of_effects aoe ON a.id = aoe.attribute_id WHERE a.user_id = userId;
    DELETE ab FROM attributes a JOIN abilities ab ON a.id = ab.attribute_id WHERE a.user_id = userId;
    DELETE s FROM attributes a JOIN spell_schools s ON a.id = s.attribute_id WHERE a.user_id = userId;
    DELETE ma FROM attributes a JOIN misc_attributes ma ON a.id = ma.attribute_id WHERE a.user_id = userId;
    DELETE cl FROM attributes a JOIN character_levels cl ON a.id = cl.attribute_id WHERE a.user_id = userId;
    DELETE FROM attributes WHERE user_id = userId;

    COMMIT;
END;;

DELIMITER ;

