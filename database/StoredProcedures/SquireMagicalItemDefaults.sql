DROP PROCEDURE IF EXISTS SquireMagicalItemDefaults;

DELIMITER ;;
CREATE PROCEDURE SquireMagicalItemDefaults(
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SET @ppId = (SELECT id FROM cost_units WHERE abbreviation = 'PP');
	SET @gpId = (SELECT id FROM cost_units WHERE abbreviation = 'GP');
	SET @epId = (SELECT id FROM cost_units WHERE abbreviation = 'EP');
	SET @spId = (SELECT id FROM cost_units WHERE abbreviation = 'SP');
	SET @cpId = (SELECT id FROM cost_units WHERE abbreviation = 'CP');

	SET @handSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'HAND');
	SET @bodySlotId = (SELECT id FROM equipment_slot_types WHERE name = 'BODY');
	SET @backSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'BACK');
	SET @neckSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'NECK');
	SET @glovesSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'GLOVES');
	SET @fingerSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'FINGER');
	SET @headSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'HEAD');
	SET @waistSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'WAIST');
	SET @feetSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'FEET');
	SET @mountSlotId = (SELECT id FROM equipment_slot_types WHERE name = 'MOUNT');

	SET @armorTypeId = (SELECT id FROM attribute_types WHERE name = 'ARMOR_TYPE');
	SET @damageTypeId = (SELECT id FROM attribute_types WHERE name = 'DAMAGE_TYPE');
	SET @alignmentId = (SELECT id FROM attribute_types WHERE name = 'ALIGNMENT');
	
	SET @spellPowerId = (SELECT id FROM power_types WHERE name = 'SPELL');

	SET @weaponId = (SELECT id FROM item_types WHERE name = 'WEAPON');
    SET @armorId = (SELECT id FROM item_types WHERE name = 'ARMOR');
    SET @ammoId = (SELECT id FROM item_types WHERE name = 'AMMO');
    SET @magicalItemId = (SELECT id FROM item_types WHERE name = 'MAGICAL_ITEM');

	SET @lightArmorId = (SELECT id FROM attributes WHERE name = 'Light' AND user_id = userId AND attribute_type_id = @armorTypeId);
	SET @mediumArmorId = (SELECT id FROM attributes WHERE name = 'Medium' AND user_id = userId AND attribute_type_id = @armorTypeId);
	SET @heavyArmorId = (SELECT id FROM attributes WHERE name = 'Heavy' AND user_id = userId AND attribute_type_id = @armorTypeId);
	SET @shieldArmorId = (SELECT id FROM attributes WHERE name = 'Shield' AND user_id = userId AND attribute_type_id = @armorTypeId);

	SET @StuddedLeatherId = (SELECT id FROM items WHERE name = 'Studded Leather' AND user_id = userId AND item_type_id = @armorId);
	SET @ChainShirtId = (SELECT id FROM items WHERE name = 'Chain Shirt' AND user_id = userId AND item_type_id = @armorId);
	SET @ScaleMailId = (SELECT id FROM items WHERE name = 'Scale Mail' AND user_id = userId AND item_type_id = @armorId);
	SET @PlateId = (SELECT id FROM items WHERE name = 'Plate' AND user_id = userId AND item_type_id = @armorId);

	SET @simple = (SELECT id FROM attributes WHERE name = 'Simple' AND user_id = userId AND attribute_type_id = @weaponTypeId);
	SET @martial = (SELECT id FROM attributes WHERE name = 'Martial' AND user_id = userId AND attribute_type_id = @weaponTypeId);

	SET @ArrowId = (SELECT id FROM items WHERE name = 'Arrow' AND user_id = userId AND item_type_id = @ammoId);

	SET @daggerId = (SELECT id FROM items WHERE name = 'Dagger' AND user_id = userId AND item_type_id = @weaponId);
	SET @handaxeId = (SELECT id FROM items WHERE name = 'Handaxe' AND user_id = userId AND item_type_id = @weaponId);
	SET @javelinId = (SELECT id FROM items WHERE name = 'Javelin' AND user_id = userId AND item_type_id = @weaponId);
	SET @maceId = (SELECT id FROM items WHERE name = 'Mace' AND user_id = userId AND item_type_id = @weaponId);
	SET @sickleId = (SELECT id FROM items WHERE name = 'Sickle' AND user_id = userId AND item_type_id = @weaponId);
	SET @battleaxeId = (SELECT id FROM items WHERE name = 'Battleaxe' AND user_id = userId AND item_type_id = @weaponId);
	SET @glaiveId = (SELECT id FROM items WHERE name = 'Glaive' AND user_id = userId AND item_type_id = @weaponId);
	SET @greataxeId = (SELECT id FROM items WHERE name = 'Greateaxe' AND user_id = userId AND item_type_id = @weaponId);
	SET @greatswordId = (SELECT id FROM items WHERE name = 'Greatsword' AND user_id = userId AND item_type_id = @weaponId);
	SET @halberdId = (SELECT id FROM items WHERE name = 'Halberd' AND user_id = userId AND item_type_id = @weaponId);
	SET @longswordId = (SELECT id FROM items WHERE name = 'Longsword' AND user_id = userId AND item_type_id = @weaponId);
	SET @maulId = (SELECT id FROM items WHERE name = 'Maul' AND user_id = userId AND item_type_id = @weaponId);
	SET @rapierId = (SELECT id FROM items WHERE name = 'Rapier' AND user_id = userId AND item_type_id = @weaponId);
	SET @scimitarId = (SELECT id FROM items WHERE name = 'Scimitar' AND user_id = userId AND item_type_id = @weaponId);
	SET @shortswordId = (SELECT id FROM items WHERE name = 'Shortsword' AND user_id = userId AND item_type_id = @weaponId);
	SET @tridentId = (SELECT id FROM items WHERE name = 'Trident' AND user_id = userId AND item_type_id = @weaponId);
	SET @warHammerId = (SELECT id FROM items WHERE name = 'Warhammer' AND user_id = userId AND item_type_id = @weaponId);
	SET @whipId = (SELECT id FROM items WHERE name = 'Whip' AND user_id = userId AND item_type_id = @weaponId);
	SET @longBowId = (SELECT id FROM items WHERE name = 'Longbow' AND user_id = userId AND item_type_id = @weaponId);

	SET @AnimalFriendshipId = (SELECT id FROM powers WHERE name = 'Animal Friendship' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @AnimalMessengerId = (SELECT id FROM powers WHERE name = 'Animal Messenger' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ArcaneLockId = (SELECT id FROM powers WHERE name = 'Arcane Lock' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @AwakenId = (SELECT id FROM powers WHERE name = 'Awaken' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @BarkskinId = (SELECT id FROM powers WHERE name = 'Barkskin' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @BlessId = (SELECT id FROM powers WHERE name = 'Bless' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @BrandingSmiteId = (SELECT id FROM powers WHERE name = 'Branding Smite' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @BurningHandsId = (SELECT id FROM powers WHERE name = 'Burning Hands' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ChainLightningId = (SELECT id FROM powers WHERE name = 'Chain Lightning' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @CharmPersonId = (SELECT id FROM powers WHERE name = 'Charm Person' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ClairvoyanceId = (SELECT id FROM powers WHERE name = 'Clairvoyance' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @CommandId = (SELECT id FROM powers WHERE name = 'Command' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ComprehendLanguagesId = (SELECT id FROM powers WHERE name = 'Comprehend Languages' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ConeOfColdId = (SELECT id FROM powers WHERE name = 'Cone of Cold' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ConjureElementalId = (SELECT id FROM powers WHERE name = 'Conjure Elemental' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ControlWaterId = (SELECT id FROM powers WHERE name = 'Control Water' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @CreateOrDestroyWaterId = (SELECT id FROM powers WHERE name = 'Create or Destroy Water' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @CureWoundsId = (SELECT id FROM powers WHERE name = 'Cure Wounds' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DancingLightsId = (SELECT id FROM powers WHERE name = 'Dancing Lights' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DarknessId = (SELECT id FROM powers WHERE name = 'Darkness' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DaylightId = (SELECT id FROM powers WHERE name = 'Daylight' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DetectEvilAndGoodId = (SELECT id FROM powers WHERE name = 'Detect Evil and Good' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DetectMagicId = (SELECT id FROM powers WHERE name = 'Detect Magic' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DetectPoisonAndDiseaseId = (SELECT id FROM powers WHERE name = 'Detect Poison and Disease' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DetectThoughtsId = (SELECT id FROM powers WHERE name = 'Detect Thoughts' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DimensionDoorId = (SELECT id FROM powers WHERE name = 'Dimension Door' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DisguiseSelfId = (SELECT id FROM powers WHERE name = 'Disguise Self' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DispelMagicId = (SELECT id FROM powers WHERE name = 'Dispel Magic' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DominateBeastId = (SELECT id FROM powers WHERE name = 'Dominate Beast' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @DominateMonsterId = (SELECT id FROM powers WHERE name = 'Dominate Monster' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @EnlargeReduceId = (SELECT id FROM powers WHERE name = 'Enlarge/Reduce' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @EtherealnessId = (SELECT id FROM powers WHERE name = 'Etherealness' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @FaerieFireId = (SELECT id FROM powers WHERE name = 'Faerie Fire' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @FearId = (SELECT id FROM powers WHERE name = 'Fear' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @FireballId = (SELECT id FROM powers WHERE name = 'Fireball' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @FlamingSphereId = (SELECT id FROM powers WHERE name = 'Flaming Sphere' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @FreedomOfMovementId = (SELECT id FROM powers WHERE name = 'Freedom of Movement' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @GaseousFormId = (SELECT id FROM powers WHERE name = 'Gaseous Form' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @GateId = (SELECT id FROM powers WHERE name = 'Gate' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @GiantInsectId = (SELECT id FROM powers WHERE name = 'Giant Insect' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @GlobeOfInvulnerabilityId = (SELECT id FROM powers WHERE name = 'Globe of Invulnerability' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @GreaseId = (SELECT id FROM powers WHERE name = 'Grease' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @GreaterRestorationId = (SELECT id FROM powers WHERE name = 'Greater Restoration' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @GustOfWindId = (SELECT id FROM powers WHERE name = 'Gust of Wind' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @HasteId = (SELECT id FROM powers WHERE name = 'Haste' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @HoldMonsterId = (SELECT id FROM powers WHERE name = 'Hold Monster' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @HoldPersonId = (SELECT id FROM powers WHERE name = 'Hold Person' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @IceStormId = (SELECT id FROM powers WHERE name = 'Ice Storm' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @InsectPlagueId = (SELECT id FROM powers WHERE name = 'Insect Plague' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @InvisibilityId = (SELECT id FROM powers WHERE name = 'Invisibility' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @JumpId = (SELECT id FROM powers WHERE name = 'Jump' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @KnockId = (SELECT id FROM powers WHERE name = 'Knock' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @LesserRestorationId = (SELECT id FROM powers WHERE name = 'Lesser Restoration' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @LevitateId = (SELECT id FROM powers WHERE name = 'Levitate' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @LightId = (SELECT id FROM powers WHERE name = 'Light' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @LightningBoltId = (SELECT id FROM powers WHERE name = 'Lightning Bolt' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @LocateAnimalsOrPlantsId = (SELECT id FROM powers WHERE name = 'Locate Animals or Plants' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @MageHandId = (SELECT id FROM powers WHERE name = 'Mage Hand' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @MagicMissileId = (SELECT id FROM powers WHERE name = 'Magic Missile' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @MassCureWoundsId = (SELECT id FROM powers WHERE name = 'Mass Cure Wounds' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @PassWithoutTraceId = (SELECT id FROM powers WHERE name = 'Pass without Trace' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @PasswallId = (SELECT id FROM powers WHERE name = 'Passwall' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @PlanarAllyId = (SELECT id FROM powers WHERE name = 'Planar Ally' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @PlaneShiftId = (SELECT id FROM powers WHERE name = 'Plane Shift' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @PolymorphId = (SELECT id FROM powers WHERE name = 'Polymorph' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @PrismaticSprayId = (SELECT id FROM powers WHERE name = 'Prismatic Spray' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ProtectionFromEvilAndGoodId = (SELECT id FROM powers WHERE name = 'Protection from Evil and Good' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @RayOfEnfeeblementId = (SELECT id FROM powers WHERE name = 'Ray of Enfeeblement' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ScorchingRayId = (SELECT id FROM powers WHERE name = 'Scorching Ray' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @ScryingId = (SELECT id FROM powers WHERE name = 'Scrying' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @SeeInvisibilityId = (SELECT id FROM powers WHERE name = 'See Invisibility' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @SlowId = (SELECT id FROM powers WHERE name = 'Slow' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @SpeakWithAnimalsId = (SELECT id FROM powers WHERE name = 'Speak with Animals' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @SpeakWithPlantsId = (SELECT id FROM powers WHERE name = 'Speak with Plants' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @StinkingCloudId = (SELECT id FROM powers WHERE name = 'Stinking Cloud' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @StoneShapeId = (SELECT id FROM powers WHERE name = 'Stone Shape' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @StoneskinId = (SELECT id FROM powers WHERE name = 'Stoneskin' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @SuggestionId = (SELECT id FROM powers WHERE name = 'Suggestion' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @TelekinesisId = (SELECT id FROM powers WHERE name = 'Telekinesis' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @TeleportId = (SELECT id FROM powers WHERE name = 'Teleport' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WallOfFireId = (SELECT id FROM powers WHERE name = 'Wall of Fire' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WallOfForceId = (SELECT id FROM powers WHERE name = 'Wall of Force' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WallOfIceId = (SELECT id FROM powers WHERE name = 'Wall of Ice' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WallOfStoneId = (SELECT id FROM powers WHERE name = 'Wall of Stone' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WallOfThornsId = (SELECT id FROM powers WHERE name = 'Wall of Thorns' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WebId = (SELECT id FROM powers WHERE name = 'Web' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WindWalkId = (SELECT id FROM powers WHERE name = 'Wind Walk' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WindWallId = (SELECT id FROM powers WHERE name = 'Wind Wall' AND user_id = userId AND power_type_id = @spellPowerId);
	SET @WishId = (SELECT id FROM powers WHERE name = 'Wish' AND user_id = userId AND power_type_id = @spellPowerId);

	SET @coldDamageTypeId = (SELECT id FROM attributes WHERE name = 'Cold' AND user_id = userId AND attribute_type_id = @damageTypeId);

	SET @commonRarityId = (SELECT id FROM rarities WHERE name = 'COMMON');
	SET @uncommonRarityId = (SELECT id FROM rarities WHERE name = 'UNCOMMON');
	SET @rareRarityId = (SELECT id FROM rarities WHERE name = 'RARE');
	SET @veryRareRarityId = (SELECT id FROM rarities WHERE name = 'VERY_RARE');
	SET @legendaryRarityId = (SELECT id FROM rarities WHERE name = 'LEGENDARY');

	SET @magicalArmorTypeId = (SELECT id FROM magical_item_types WHERE name = 'ARMOR');
	SET @magicalPotionTypeId = (SELECT id FROM magical_item_types WHERE name = 'POTION');
	SET @magicalRingTypeId = (SELECT id FROM magical_item_types WHERE name = 'RING');
	SET @magicalRodTypeId = (SELECT id FROM magical_item_types WHERE name = 'ROD');
	SET @magicalScrollTypeId = (SELECT id FROM magical_item_types WHERE name = 'SCROLL');
	SET @magicalStaffTypeId = (SELECT id FROM magical_item_types WHERE name = 'STAFF');
	SET @magicalWandTypeId = (SELECT id FROM magical_item_types WHERE name = 'WAND');
	SET @magicalWeaponTypeId = (SELECT id FROM magical_item_types WHERE name = 'WEAPON');
	SET @magicalWondrousTypeId = (SELECT id FROM magical_item_types WHERE name = 'WONDROUS');
	SET @magicalAmmoTypeId = (SELECT id FROM magical_item_types WHERE name = 'AMMO');

	SET @attunementTypeAnyId = (SELECT id FROM magical_item_attunement_types WHERE name = 'ANY');
	SET @attunementTypeCasterId = (SELECT id FROM magical_item_attunement_types WHERE name = 'CASTER');
	SET @attunementTypeClassId = (SELECT id FROM magical_item_attunement_types WHERE name = 'CLASS');
	SET @attunementTypeAlignmentId = (SELECT id FROM magical_item_attunement_types WHERE name = 'ALIGNMENT');
	SET @attunementTypeRaceId = (SELECT id FROM magical_item_attunement_types WHERE name = 'RACE');

	SET @fireDamageTypeId = (SELECT id FROM attributes WHERE name = 'Fire' AND user_id = userId AND attribute_type_id = @damageTypeId);
	SET @forceDamageTypeId = (SELECT id FROM attributes WHERE name = 'Force' AND user_id = userId AND attribute_type_id = @damageTypeId);
	SET @piercingDamageTypeId = (SELECT id FROM attributes WHERE name = 'Piercing' AND user_id = userId AND attribute_type_id = @damageTypeId);
	SET @poisonDamageTypeId = (SELECT id FROM attributes WHERE name = 'Poison' AND user_id = userId AND attribute_type_id = @damageTypeId);
	SET @thunderDamageTypeId = (SELECT id FROM attributes WHERE name = 'Thunder' AND user_id = userId AND attribute_type_id = @damageTypeId);

	SET @dexId = (SELECT id FROM attributes WHERE name = 'Dexterity' AND user_id = userId AND attribute_type_id = @abilityTypeId);
	SET @conId = (SELECT id FROM attributes WHERE name = 'Constitution' AND user_id = userId AND attribute_type_id = @abilityTypeId);
	SET @wisId = (SELECT id FROM attributes WHERE name = 'Wisdom' AND user_id = userId AND attribute_type_id = @abilityTypeId);

	SET @bardId = (SELECT id FROM characteristics WHERE name = 'Bard' AND user_id = userId AND characteristic_type_id = @classId );
	SET @clericId = (SELECT id FROM characteristics WHERE name = 'Cleric' AND user_id = userId AND characteristic_type_id = @classId );
	SET @druidId = (SELECT id FROM characteristics WHERE name = 'Druid' AND user_id = userId AND characteristic_type_id = @classId );
	SET @paladinId = (SELECT id FROM characteristics WHERE name = 'Paladin' AND user_id = userId AND characteristic_type_id = @classId );
	SET @sorcererId = (SELECT id FROM characteristics WHERE name = 'Sorcerer' AND user_id = userId AND characteristic_type_id = @classId );
	SET @warlockId = (SELECT id FROM characteristics WHERE name = 'Warlock' AND user_id = userId AND characteristic_type_id = @classId );
	SET @wizardId = (SELECT id FROM characteristics WHERE name = 'Wizard' AND user_id = userId AND characteristic_type_id = @classId );

	SET @LawfulGoodAlignmentId = (SELECT id FROM attributes WHERE name = 'Lawful Good' AND user_id = userId AND attribute_type_id = @alignmentId);
	SET @NeutralGoodAlignmentId = (SELECT id FROM attributes WHERE name = 'Neutral Good' AND user_id = userId AND attribute_type_id = @alignmentId);
	SET @ChaoticGoodAlignmentId = (SELECT id FROM attributes WHERE name = 'Chaotic Good' AND user_id = userId AND attribute_type_id = @alignmentId);
	SET @LawfulEvilAlignmentId = (SELECT id FROM attributes WHERE name = 'Lawful Evil' AND user_id = userId AND attribute_type_id = @alignmentId);
	SET @NeutralEvilAlignmentId = (SELECT id FROM attributes WHERE name = 'Neutral Evil' AND user_id = userId AND attribute_type_id = @alignmentId);
	SET @ChaoticEvilAlignmentId = (SELECT id FROM attributes WHERE name = 'Chaotic Evil' AND user_id = userId AND attribute_type_id = @alignmentId);

	SET @raceId = (SELECT id FROM characteristic_types WHERE name = 'RACE');
	SET @dwarfId = (SELECT id FROM characteristics WHERE name = 'Dwarf' AND user_id = userId AND characteristic_type_id = @raceId);

	INSERT INTO items (name, item_type_id, description, expendable, equippable, slot, container, ignore_weight, cost, cost_unit, weight, user_id, sid) VALUES
	('Adamantine Armor', @magicalItemId, 'This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you''re wearing it, any critical hit against you becomes a normal hit.', 0, 1, @bodySlotId, 0, 0, 101, @gpId, 0.0, userId, 1),
	('Animated Shield', @magicalItemId, 'While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shiled remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 2),
	('+1 Armor', @magicalItemId, 'You have a +1 bonus to AC while wearing this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 3),
	('+2 Armor', @magicalItemId, 'You have a +2 bonus to AC while wearing this armor.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 4),
	('+3 Armor', @magicalItemId, 'You have a +3 bonus to AC while wearing this armor.', 0, 1, @bodySlotId, 0, 0, 50001, @gpId, 0.0, userId, 5),
	('Armor of Invulnerability', @magicalItemId, 'You have resistance to non-magical damage while you wear this armor. Additionally, you can use an action to make yourself immune to non-magical damage for 10 minutes or until you are no longer wearing the armor. Once this special action is used, it can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 50001, @gpId, 0.0, userId, 6),
	('Armor of Resistance - Acid', @magicalItemId, 'You have resistance to acid damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 7),
	('Armor of Resistance - Cold', @magicalItemId, 'You have resistance to cold damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 8),
	('Armor of Resistance - Fire', @magicalItemId, 'You have resistance to fire damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 9),
	('Armor of Resistance - Force', @magicalItemId, 'You have resistance to force damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 10),
	('Armor of Resistance - Lightning', @magicalItemId, 'You have resistance to lightning damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 11),
	('Armor of Resistance - Necrotic', @magicalItemId, 'You have resistance to necrotic damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 12),
	('Armor of Resistance - Poison', @magicalItemId, 'You have resistance to poison damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 13),
	('Armor of Resistance - Psychic', @magicalItemId, 'You have resistance to psychic damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 14),
	('Armor of Resistance - Radiant', @magicalItemId, 'You have resistance to radiant damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 15),
	('Armor of Resistance - Thunder', @magicalItemId, 'You have resistance to thunder damage while you wear this armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 16),
	('Armor of Vulnerability', @magicalItemId, 'While wearing this armor, you have resistance to one of the following damage types: bludgeoning, piercing, or slashing. The GM chooses the type or determines it randomly.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 17),
	('Arrow-Catching Shield', @magicalItemId, 'You gain a +2 bonus to AC against ranged attacks while you wield this shield. This bonus is in addition to the shield’s normal bonus to AC. In addition, whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 18),
	('Demon Armor', @magicalItemId, 'While wearing this armor, you gain a +1 bonus to AC, and you can understand and speak Abyssal. In addition, the armor’s clawed gauntlets turn unarmed strikes with your hands into magic weapons that deal slashing damage, with a +1 bonus to attack rolls and damage rolls and a damage die of 1d8.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 19),
	('Dragon Scale Mail - Black (Acid)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Acid damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Black dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 20),
	('Dragon Scale Mail - Blue (Lightning)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Lightning damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Blue dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 21),
	('Dragon Scale Mail - Brass (Fire)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Fire damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Brass dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 22),
	('Dragon Scale Mail - Bronze (Lightning)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Lightning damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Bronze dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 23),
	('Dragon Scale Mail - Copper (Acid)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Acid damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Copper dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 24),
	('Dragon Scale Mail - Gold (Fire)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Fire damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Gold dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 25),
	('Dragon Scale Mail - Green (Poison)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Poison damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Green dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 26),
	('Dragon Scale Mail - Red (Fire)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Fire damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Red dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 27),
	('Dragon Scale Mail - Silver (Cold)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Cold damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest Silver dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 28),
	('Dragon Scale Mail - White (Cold)', @magicalItemId, 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.\n\nWhile wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to Cold damage.\n\nAdditionally, you can focus your senses as an action to magically discern the distance and direction to the closest White dragon within 30 miles of you. This special action can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 29),
	('Dwarven Plate', @magicalItemId, 'While wearing this armor, you gain a +2 bonus to AC.  In addition, if an effect moves you against your will along the ground, you can use your reaction to reduce the distance you are moved by up to 10 feet.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 30),
	('Elven Chain', @magicalItemId, 'You gain a +1 bonus to AC while you wear this armor.  You are considered proficient with this armor even if you lack proficiency with medium armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 31),
	('Glamoured Studded Leather', @magicalItemId, 'While wearing this armor, you gain a +1 bonus to AC.  You can also use a bonus action to speak the armor’s command word and cause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You decide what it looks like, including color, style, and accessories, but the armor retains its normal bulk and weight. The illusory appearance lasts until you use this property again or remove the armor.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 32),
	('Mithral Armor', @magicalItemId, 'Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn’t.', 0, 1, @bodySlotId, 0, 0, 101, @gpId, 0.0, userId, 33),
	('Plate Armor of Etherealness', @magicalItemId, 'While you’re wearing this armor, you can speak its command word as an action to gain the effect of the etherealness spell, which last for 10 minutes or until you remove the armor or use an action to speak the command word again. This property of the armor can’t be used again until the next dawn.', 0, 1, @bodySlotId, 0, 0, 50001, @gpId, 0.0, userId, 34),
	('+1 Shield', @magicalItemId, 'While holding this shield, you have a bonus to AC determined by the shield’s rarity. This bonus is in addition to the shield’s normal bonus to AC.', 0, 1, @bodySlotId, 0, 0, 101, @gpId, 0.0, userId, 35),
	('+2 Shield', @magicalItemId, 'While holding this shield, you have a bonus to AC determined by the shield’s rarity. This bonus is in addition to the shield’s normal bonus to AC.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 36),
	('+3 Shield', @magicalItemId, 'While holding this shield, you have a bonus to AC determined by the shield’s rarity. This bonus is in addition to the shield’s normal bonus to AC.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 37),
	('Shield of Missile Attraction', @magicalItemId, 'While holding this shield, you have resistance to damage from ranged weapon attacks.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 38),
	('Spellguard Shield', @magicalItemId, 'While holding this shield, you have advantage on saving throws against spells and other magical effects, and spell attacks have disadvantage against you.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 39),
	('Oil of Etherealness', @magicalItemId, 'Beads of this cloudy gray oil form on the outside of its container and quickly evaporate. The oil can cover a Medium or smaller creature, along with the equipment it’s wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the etherealness spell for 1 hour.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 40),
	('Oil of Sharpness', @magicalItemId, 'This clear, gelatinous oil sparkles with tiny, ultrathin silver shards. The oil can coat one slashing or piercing weapon or up to 5 pieces of slashing or piercing ammunition. Applying the oil takes 1 minute. For 1 hour, the coated item is magical and has a +3 bonus to attack and damage rolls.', 1, 0, NULL, 0, 0, 2500, @gpId, 0.0, userId, 41),
	('Oil of Slipperiness', @magicalItemId, 'This sticky black unguent is thick and heavy in the container, but it flows quickly when poured. The oil can cover a Medium or smaller creature, along with the equipment it''s wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the freedom of movement spell for 8 hours.\n\nAlternatively, the oil can be poured on the ground as an action, where it covers a 10-foot square, duplicating the effect of the grease spell in that area for 8 hours.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 42),
	('Philter of Love', @magicalItemId, 'The next time you see a creature within 10 minutes after drinking this philter, you become charmed by that creature for 1 hour. If the creature is of a species and gender you are normally attracted to, you regard it as your true love while you are charmed.  This potion’s rose-hued, effervescent liquid contains one easy-to-miss bubble shaped like a heart.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 43),
	('Potion of Animal Friendship', @magicalItemId, 'When you drink this potion, you can cast the animal friendship spell (save DC 13) for 1 hour at will. Agitating this muddy liquid brings little bits into view: a fish scale, a hummingbird tongue, a cat claw, or a squirrel hair.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 44),
	('Potion of Clairvoyance', @magicalItemId, 'When you drink this potion, you gain the effect of the clairvoyance spell. An eyeball bobs in this yellowish liquid but vanishes when the potion is opened.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 45),
	('Potion of Climbing', @magicalItemId, 'When you drink this potion, you gain a climbing speed equal to your walking speed for 1 hour.  During this time, you have advantage on Strength (Athletics) checks you make to climb. The potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors.', 1, 0, NULL, 0, 0, 25, @gpId, 0.0, userId, 46),
	('Potion of Diminution', @magicalItemId, 'When you drink this potion, you gain the “reduce”  effect of the enlarge/reduce spell for 1d4 hours (no concentration required). The red in the potion’s liquid continuously contracts to a tiny bead and then expands to color the clear liquid around it. Shaking the bottle fails to interrupt this process.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 47),
	('Potion of Flying', @magicalItemId, 'When you drink this potion, you gain a flying speed equal to your walking speed for 1 hour and can hover. If you’re in the air when the potion wears off, you fall unless you have some other means of staying aloft. This potion’s clear liquid floats at the top of its container and has cloudy white impurities drifting in it.', 1, 0, NULL, 0, 0, 2500, @gpId, 0.0, userId, 48),
	('Potion of Gaseous Form', @magicalItemId, 'When you drink this potion, you gain the effect of the gaseous form spell for 1 hour (no concentration required) or until you end the effect as a bonus action. This potion’s container seems to hold fog that moves and pours like water.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 49),
	('Potion of Giant Strength - Hill Giant', @magicalItemId, 'When you drink this potion, your Strength score changes to 21 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.\n\nThis potion’s transparent liquid has floating in it a sliver of fingernail from a Hill Giant.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 50),
	('Potion of Giant Strength - Frost Giant', @magicalItemId, 'When you drink this potion, your Strength score changes to 23 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.\n\nThis potion’s transparent liquid has floating in it a sliver of fingernail from a Frost Giant.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 51),
	('Potion of Giant Strength - Stone Giant', @magicalItemId, 'When you drink this potion, your Strength score changes to 23 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.\n\nThis potion’s transparent liquid has floating in it a sliver of fingernail from a Stone Giant.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 51),
	('Potion of Giant Strength - Fire Giant', @magicalItemId, 'When you drink this potion, your Strength score changes to 25 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.\n\nThis potion’s transparent liquid has floating in it a sliver of fingernail from a Fire Giant.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 52),
	('Potion of Giant Strength - Cloud Giant', @magicalItemId, 'When you drink this potion, your Strength score changes to 27 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.\n\nThis potion’s transparent liquid has floating in it a sliver of fingernail from a Cloud Giant.', 1, 0, NULL, 0, 0, 2500, @gpId, 0.0, userId, 53),
	('Potion of Giant Strength - Storm Giant', @magicalItemId, 'When you drink this potion, your Strength score changes to 29 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.\n\nThis potion’s transparent liquid has floating in it a sliver of fingernail from a Storm Giant.', 1, 0, NULL, 0, 0, 25000, @gpId, 0.0, userId, 54),
	('Potion of Growth', @magicalItemId, 'When you drink this potion, you gain the “enlarge”  effect of the enlarge/reduce spell for 1d4 hours (no concentration required). The red in the potion’s liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts.  Shaking the bottle fails to interrupt this process.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 55),
	('Potion of Healing', @magicalItemId, 'You regain hit points when you drink this potion. The potion''s red liquid glimmers when agitated.\n\nHP Regained: 2d4 + 2.', 1, 0, NULL, 0, 0, 25, @gpId, 0.0, userId, 56),
	('Potion of Greater Healing', @magicalItemId, 'You regain hit points when you drink this potion. The potion''s red liquid glimmers when agitated.\n\nHP Regained: 4d4 + 4.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 57),
	('Potion of Superior Healing', @magicalItemId, 'You regain hit points when you drink this potion. The potion''s red liquid glimmers when agitated.\n\nHP Regained: 8d4 + 8.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 58),
	('Potion of Supreme Healing', @magicalItemId, 'You regain hit points when you drink this potion. The potion''s red liquid glimmers when agitated.\n\nHP Regained: 10d4 + 20.', 1, 0, NULL, 0, 0, 2500, @gpId, 0.0, userId, 59),
	('Potion of Heroism', @magicalItemId, 'For 1 hour after drinking it, you gain 10 temporary hit points that last for 1 hour. For the same duration, you are under the effect of the bless spell (no concentration required). This blue potion bubbles and steams as if boiling.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 60),
	('Potion of Invisibility', @magicalItemId, 'This potion’s container looks empty but feels as though it holds liquid. When you drink it, you become invisible for 1 hour. Anything you wear or carry is invisible with you. The effect ends early if you attack or cast a spell.', 1, 0, NULL, 0, 0, 2500, @gpId, 0.0, userId, 61),
	('Potion of Mind Reading', @magicalItemId, 'When you drink this potion, you gain the effect of the detect thoughts spell (save DC 13). The potion’s dense, purple liquid has an ovoid cloud of pink floating in it.', 1, 0, NULL, 0, 0, 250, @gpId, 0.0, userId, 62),
	('Potion of Poison', @magicalItemId, 'This concoction looks, smells, and tastes like a potion of healing or other beneficial potion. However, it is actually poison masked by illusion magic. An identify spell reveals its true nature.\n\nIf you drink it, you take 3d6 poison damage, and you must succeed on a DC 13 Constitution saving throw or be poisoned. At the start of each of your turns while you are poisoned in this way, you take 3d6 poison damage. At the end of each of your turns, you can repeat the saving throw. On a successful save, the poison damage you take on your subsequent turns decreases by 1d6. The poison ends when the damage decreases to 0.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 63),
	('Potion of Resistance - Acid', @magicalItemId, 'When you drink this potion, you gain resistance to Acid for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 64),
	('Potion of Resistance - Cold', @magicalItemId, 'When you drink this potion, you gain resistance to Cold for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 65),
	('Potion of Resistance - Fire', @magicalItemId, 'When you drink this potion, you gain resistance to Fire for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 66),
	('Potion of Resistance - Force', @magicalItemId, 'When you drink this potion, you gain resistance to Force for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 67),
	('Potion of Resistance - Lightning', @magicalItemId, 'When you drink this potion, you gain resistance to Lightning for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 68),
	('Potion of Resistance - Necrotic', @magicalItemId, 'When you drink this potion, you gain resistance to Necrotic for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 69),
	('Potion of Resistance - Poison', @magicalItemId, 'When you drink this potion, you gain resistance to Poison for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 70),
	('Potion of Resistance - Psychic', @magicalItemId, 'When you drink this potion, you gain resistance to Psychic for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 71),
	('Potion of Resistance - Radiant', @magicalItemId, 'When you drink this potion, you gain resistance to Radiant for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 72),
	('Potion of Resistance - Thunder', @magicalItemId, 'When you drink this potion, you gain resistance to Thunder for 1 hour.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 73),
	('Potion of Speed', @magicalItemId, 'When you drink this potion, you gain the effect of the haste spell for 1 minute (no concentration required).  The potion’s yellow fluid is streaked with black and swirls on its own.', 1, 0, NULL, 0, 0, 2500, @gpId, 0.0, userId, 74),
	('Potion of Water Breathing', @magicalItemId, 'You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 75),
	('Ring of Animal Influence', @magicalItemId, 'This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can use an action to expend 1 of its charges to cast of of the following spells:\n\n•Animal Friendship (save DC 13)\n•Fear (save DC 13), targeting only beasts that have an Intelligence of 3 or lower\n•Speak with Animals', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 76),
	('Ring of Djinni Summoning', @magicalItemId, 'While wearing this ring, you can speak its command word as an action to summon a particular djinni from the Elemental Plane of Air. The djinni appears in an unoccupied space you choose within 120 feet of you. It remains as long as you concentrate (as if concentrating on a spell), to a maximum of 1 hour, or until it drops to 0 hit points. It then returns to its home plane.\n\nWhile summoned, the djinni is friendly to you and your companions. It obeys any commands you give it, no matter what language you use. If you fail to command it, the djinni defends itself against attackers but takes no other actions. After the djinni departs, it can’t be summoned again for 24 hours, and the ring becomes non-magical if the djinni dies.', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 77),
	('Ring of Air Elemental Command', @magicalItemId, 'This ring is linked to one of the four Elemental Planes. The GM chooses or randomly determines the linked plane.\n\nWhile wearing this ring, you have advantage on attack rolls against elementals from the linked plane, and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the linked plane. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17.\n\nYou can expend 2 of the ring’s charges to cast dominate monster on an air elemental. In addition, when you fall, you descend 60 feet per round and take no damage from falling. You can also speak and understand Auran.\n\nIf you help slay an air elemental while attuned to the ring, you gain access to the following additional properties:\n• You have resistance to lightning damage.\n• You have a flying speed equal to your walking speed and can hover.\n• You can cast the following spells from the ring, expending the necessary number of charges: chain lightning (3 charges), gust of wind (2 charges), or wind wall (1 charge).', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 78),
	('Ring of Earth Elemental Command', @magicalItemId, 'This ring is linked to one of the four Elemental Planes. The GM chooses or randomly determines the linked plane.\n\nWhile wearing this ring, you have advantage on attack rolls against elementals from the linked plane, and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the linked plane. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17.\n\nYou can expend 2 of the ring’s charges to cast dominate monster on an earth elemental. In addition, you can move in difficult terrain that is composed of rubble, rocks, or dirt as if it were normal terrain. You can also speak and understand Terran.\n\nIf you help slay an earth elemental while attuned to the ring, you gain access to the following additional properties:\n• You have resistance to acid damage.\n• You can move through solid earth or rock as if those areas were difficult terrain. If you end your turn there, you are shunted out to the nearest unoccupied space you last occupied.\n• You can cast the following spells from the ring, expending the necessary number of charges: stone shape (2 charges), stoneskin (3 charges), or wall of stone (3 charges).', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 79),
	('Ring of Fire Elemental Command', @magicalItemId, 'This ring is linked to one of the four Elemental Planes. The GM chooses or randomly determines the linked plane.\n\nWhile wearing this ring, you have advantage on attack rolls against elementals from the linked plane, and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the linked plane. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17.\n\nYou can expend 2 of the ring’s charges to cast dominate monster on a fire elemental. In addition, you have resistance to fire damage. You can also speak and understand Ignan.\n\nIf you help slay a fire elemental while attuned to the ring, you gain access to the following additional properties:\n• You are immune to fire damage.\n• You can cast the following spells from the ring, expending the necessary number of charges:  burning hands (1 charge), fireball (2 charges), and wall of fire (3 charges).', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 80),
	('Ring of Water Elemental Command', @magicalItemId, 'This ring is linked to one of the four Elemental Planes. The GM chooses or randomly determines the linked plane.\n\nWhile wearing this ring, you have advantage on attack rolls against elementals from the linked plane, and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the linked plane. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17.\n\nYou can expend 2 of the ring’s charges to cast dominate monster on a water elemental. In addition, you can stand on and walk across liquid surfaces as if they were solid ground. You can also speak and understand Aquan.\n\nIf you help slay a water elemental while attuned to the ring, you gain access to the following additional properties:\n• You can breathe underwater and have a swimming speed equal to your walking speed.\n• You can cast the following spells from the ring, expending the necessary number of charges:  create or destroy water (1 charge), control water (3 charges), ice storm (2 charges), or wall of ice (3 charges).', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 81),
	('Ring of Evasion', @magicalItemId, 'This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing it, you can use your reaction to expend 1 of its charges to succeed on that saving throw instead.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 82),
	('Ring of Feather Falling', @magicalItemId, 'When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 83),
	('Ring of Free Action', @magicalItemId, 'While you wear this ring, difficult terrain doesn’t cost you extra movement. In addition, magic can neither reduce your speed nor cause you to be paralyzed or restrained.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 84),
	('Ring of Invisibility', @magicalItemId, 'While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed, until you attack or cast a spell, or until you use a bonus action to become visible again.', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 85),
	('Ring of Jumping', @magicalItemId, 'While wearing this ring, you can cast the jump spell from it as a bonus action at will, but can target only yourself when you do so.', 0, 1, @fingerSlotId, 0, 0, 101, @gpId, 0.0, userId, 86),
	('Ring of Mind Shielding', @magicalItemId, 'While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it.\n\nYou can use an action to cause the ring to become invisible until you use another action to make it visible, until you remove the ring, or until you die.\n\nIf you die while wearing the ring, your soul enters it, unless it already houses a soul. You can remain in the ring or depart for the afterlife. As long as your soul is in the ring, you can telepathically communicate with any creature wearing it. A wearer can’t prevent this telepathic communication.', 0, 1, @fingerSlotId, 0, 0, 101, @gpId, 0.0, userId, 87),
	('Ring of Protection', @magicalItemId, 'You gain a +1 bonus to AC and saving throws while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 88),
	('Ring of Regeneration', @magicalItemId, 'While wearing this ring, you regain 1d6 hit points every 10 minutes, provided that you have at least 1 hit point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 hit point the whole time.', 0, 1, @fingerSlotId, 0, 0, 5001, @gpId, 0.0, userId, 89),
	('Ring of Resistance - Acid (Pearl)', @magicalItemId, 'You have resistance to Acid damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 90),
	('Ring of Resistance - Cold (Tourmaline)', @magicalItemId, 'You have resistance to Cold damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 91),
	('Ring of Resistance - Fire (Garnet)', @magicalItemId, 'You have resistance to Fire damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 92),
	('Ring of Resistance - Force (Sapphire)', @magicalItemId, 'You have resistance to Force damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 93),
	('Ring of Resistance - Lightning (Citrine)', @magicalItemId, 'You have resistance to Lightning damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 94),
	('Ring of Resistance - Necrotic (Jet)', @magicalItemId, 'You have resistance to Necrotic damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 95),
	('Ring of Resistance - Poison (Amethyst)', @magicalItemId, 'You have resistance to Poison damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 96),
	('Ring of Resistance - Psychic (Jade)', @magicalItemId, 'You have resistance to Psychic damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 97),
	('Ring of Resistance - Radiant (Topaz)', @magicalItemId, 'You have resistance to Radiant damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 98),
	('Ring of Resistance - Thunder (Spinel)', @magicalItemId, 'You have resistance to Thunder damage while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 99),
	('Ring of Shooting Stars', @magicalItemId, 'While wearing this ring in dim light or darkness, you can cast dancing lights and light from the ring at will.  Casting either spell from the ring requires an action.\n\nThe ring has 6 charges for the following other properties. The ring regains 1d6 expended charges daily at dawn.\n\n• Faerie Fire. You can expend 1 charge as an action to cast faerie fire from the ring.\n\n• Ball Lightning. You can expend 2 charges as an action to create one to four 3-foot-diameter spheres of lightning. The more spheres you create, the less powerful each sphere is individually.\n\nEach sphere appears in an unoccupied space you can see within 120 feet of you. The spheres last as long as you concentrate (as if concentrating on a spell), up to 1 minute. Each sphere sheds dim light in a 30-foot radius.\n\nAs a bonus action, you can move each sphere up to 30 feet, but no farther than 120 feet away from you.  When a creature other than you comes within 5 feet of a sphere, the sphere discharges lightning at that creature and disappears. That creature must make a DC 15 Dexterity saving throw. On a failed save, the creature takes lightning damage based on the number of spheres you created.\n\n• Shooting Stars. You can expend 1 to 3 charges as an action. For every charge you expend, you launch a glowing mote of light from the ring at a point you can see within 60 feet of you. Each creature within a 15-foot cube originating from that point is showered in sparks and must make a DC 15 Dexterity saving throw, taking 5d4 fire damage on a failed save, or half as much damage on a successful one.\n\n(Requires attunement outdoors at night)', 0, 1, @fingerSlotId, 0, 0, 5001, @gpId, 0.0, userId, 100),
	('Ring of Spell Storing', @magicalItemId, 'This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. When found, it contains 1d6 - 1 levels of stored spells chosen by the GM.\n\nAny creature can cast a spell of 1st through 5th level into the ring by touching the ring as the spell is cast. The spell has no effect, other than to be stored in the ring. If the ring can''t hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses.\n\nWhile wearing the ring, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster, but is otherwise treated as if you cast the spell. The spell cast from the ring is no longer stored in it, freeing up space.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 101),
	('Ring of Spell Turning', @magicalItemId, 'While wearing this ring, you have advantage on saving throws against any spell that targets only you (not in an area of effect). In addition, if you roll a 20 for the save and the spell is 7th level or lower, the spell has no effect on you and instead targets the caster, using the slot level, spell save DC, attack bonus, and spellcasting ability of the caster.', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 102),
	('Ring of Swimming', @magicalItemId, 'You have a swimming speed of 40 feet while wearing this ring.', 0, 1, @fingerSlotId, 0, 0, 101, @gpId, 0.0, userId, 103),
	('Ring of Telekinesis', @magicalItemId, 'While wearing this ring, you can cast the telekinesis spell at will, but you can target only objects that aren’t being worn or carried.', 0, 1, @fingerSlotId, 0, 0, 5001, @gpId, 0.0, userId, 104),
	('Ring of the Ram', @magicalItemId, 'This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can use an action to expend 1 to 3 of its charges to attack one creature you can see within 60 feet of you.  The ring produces a spectral ram’s head and makes its attack roll with a +7 bonus. On a hit, for each charge you spend, the target takes 2d10 force damage and is pushed 5 feet away from you.\n\nAlternatively, you can expend 1 to 3 of the ring’s charges as an action to try to break an object you can see within 60 feet of you that isn’t being worn or carried. The ring makes a Strength check with a +5 bonus for each charge you spend.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 105),
	('Ring of Three Wishes', @magicalItemId, 'While wearing this ring, you can use an action to expend 1 of its 3 charges to cast the wish spell from it. The ring becomes non-magical when you use the last charge.', 0, 1, @fingerSlotId, 0, 0, 50001, @gpId, 0.0, userId, 106),
	('Ring of Warmth', @magicalItemId, 'While wearing this ring, you have resistance to cold damage. In addition, you and everything you wear and carry are unharmed by temperatures as low as −50 degrees Fahrenheit.', 0, 1, @fingerSlotId, 0, 0, 101, @gpId, 0.0, userId, 107),
	('Ring of Water Walking', @magicalItemId, 'While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground.', 0, 1, @fingerSlotId, 0, 0, 101, @gpId, 0.0, userId, 108),
	('Ring of X-ray Vision', @magicalItemId, 'While wearing this ring, you can use an action to speak its command word. When you do so, you can see into and through solid matter for 1 minute. This vision has a radius of 30 feet. To you, solid objects within that radius appear transparent and don’t prevent light from passing through them. The vision can penetrate 1 foot of stone, 1 inch of common metal, or up to 3 feet of wood or dirt. Thicker substances block the vision, as does a thin sheet of lead.\n\nWhenever you use the ring again before taking a long rest, you must succeed on a DC 15 Constitution saving throw or gain one level of exhaustion.', 0, 1, @fingerSlotId, 0, 0, 501, @gpId, 0.0, userId, 109),
	('Immovable Rod', @magicalItemId, 'This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn’t move, even if it is defying gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall. A creature can use an action to make a DC 30 Strength check, moving the fixed rod up to 10 feet on a success.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 110),
	('Rod of Absorption', @magicalItemId, 'While holding this rod, you can use your reaction to absorb a spell that is targeting only you and not with an area of effect. The absorbed spell''s effect is canceled, and the spell''s energy - not the spell itself - is stored in the rod. The energy has the same level as the spell when it was cast. The rod can absorb 50 levels of energy over the course of its existence. Once the rod absorbs 50 levels of energy, it can''t absorb more. If you are targeted by a spell that the rod can''t store, the rod has no effect on that spell.\n\nWhen you become attuned to the rod, you know how many levels of energy the rod has absorbed over the course of its existence, and how many levels of spell energy it currently has stored.\n\nIf you are a spellcaster holding the rod, you can convert energy stored in it into spell slots to cast spells you have prepared or know. You can create spell slots only of a level equal to or lower than your own spell slots, up to a maximum of 5th level. You use the stored levels in place of your slots, but otherwise cast the spll as normal. For example, you can use 3 levels stored in the rod as a 3rd-level spell slot.\n\nA newly found rod has 1d10 levels of spell energy stored in it already. A rod that can no longer absorb spell energy and has no energy remaining becomes non-magical.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 111),
	('Rod of Alertness', @magicalItemId, 'This rod has a flanged head and the following properties.\n\n• Alertness. While holding the rod, you have advantage on Wisdom (Perception) checks and on rolls for initiative.\n\n• Spells. While holding the rod, you can use an action to cast one of the following spells from it:  detect evil and good, detect magic, detect poison and disease, or see invisibility.\n\n• Protective Aura. As an action, you can plant the haft end of the rod in the ground, whereupon the rod’s head sheds bright light in a 60-foot radius and dim light for an additional 60 feet. While in that bright light, you and any creature that is friendly to you gain a +1 bonus to AC and saving throws and can sense the location of any invisible hostile creature that is also in the bright light.\n\nThe rod’s head stops glowing and the effect ends after 10 minutes, or when a creature uses an action to pull the rod from the ground. This property can’t be used again until the next dawn.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 112),
	('Rod of Lordly Might', @magicalItemId, 'This rod has a flanged head, and it functions as a magic mace that grants a +3 bonus to attack and damage rolls made with it. The rod has properties associated with six different buttons that are set in a row along the haft. It has three other properties as well, detailed below.\n\n• Six Buttons. You can press one of the rod’s six buttons as a bonus action. A button’s effect lasts until you push a different button or until you push the same button again, which causes the rod to revert to its normal form.\n\nIf you press button 1, the rod becomes a flame tongue, as a fiery blade sprouts from the end opposite the rod’s flanged head.\n\nIf you press button 2, the rod’s flanged head folds down and two crescent-shaped blades spring out, transforming the rod into a magic battleaxe that grants a +3 bonus to attack and damage rolls made with it.\n\nIf you press button 3, the rod’s flanged head folds down, a spear point springs from the rod’s tip, and the rod’s handle lengthens into a 6-foot haft, transforming the rod into a magic spear that grants a +3 bonus to attack and damage rolls made with it.\n\nIf you press button 4, the rod transforms into a climbing pole up to 50 feet long, as you specify. In surfaces as hard as granite, a spike at the bottom and three hooks at the top anchor the pole. Horizontal bars 3 inches long fold out from the sides, 1 foot apart, forming a ladder. The pole can bear up to 4,000 pounds. More weight or lack of solid anchoring causes the rod to revert to its normal form.\n\nIf you press button 5, the rod transforms into a handheld battering ram and grants its user a +10 bonus to Strength checks made to break through doors, barricades, and other barriers.\n\nIf you press button 6, the rod assumes or remains in its normal form and indicates magnetic north.  (Nothing happens if this function of the rod is used in a location that has no magnetic north.) The rod also gives you knowledge of your approximate depth beneath the ground or your height above it.\n\n• Drain Life. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Constitution saving throw. On a failure, the target takes an extra 4d6 necrotic damage, and you regain a number of hit points equal to half that necrotic damage. This property can’t be used again until the next dawn.\n\n• Paralyze. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Strength saving throw. On a failure, the target is paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on a success. This property can’t be used again until the next dawn.\n\n• Terrify. While holding the rod, you can use an action to force each creature you can see within 30 feet of you to make a DC 17 Wisdom saving throw.  On a failure, a target is frightened of you for 1 minute. A frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. This property can’t be used again until the next dawn.', 0, 1, @handSlotId, 0, 0, 50001, @gpId, 0.0, userId, 113),
	('Rod of Rulership', @magicalItemId, 'You can use an action to present the rod and command obedience from each creature of your choice that you can see within 120 feet of you. Each target must succeed on a DC 15 Wisdom saving throw or be charmed by you for 8 hours. While charmed in this way, the creature regards you as its trusted leader. If harmed by you or your companions, or commanded to do something contrary to its nature, a target ceases to be charmed in this way.  The rod can’t be used again until the next dawn.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 114),
	('Rod of Security', @magicalItemId, 'While holding this rod, you can use an action to activate it. The rod then instantly transports you and up to 199 other willing creatures you can see to a paradise that exists in an extraplanar space. You choose the form that the paradise takes. It could be a tranquil garden, lovely glade, cheery tavern, immense palace, tropical island, fantastic carnival, or whatever else you can imagine. Regardless of its nature, the paradise contains enough water and food to sustain its visitors. Everything else that can be interacted with inside the extraplanar space can exist only there. For example, a flower picked from a garden in the paradise disappears if it is taken outside the extraplanar space.\n\nFor each hour spent in the paradise, a visitor regains hit points as if it had spent 1 Hit Die. Also, creatures don’t age while in the paradise, although time passes normally. Visitors can remain in the paradise for up to 200 days divided by the number of creatures present (round down).\n\nWhen the time runs out or you use an action to end it, all visitors reappear in the location they occupied when you activated the rod, or an unoccupied space nearest that location. The rod can’t be used again until ten days have passed.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 115),
	('Spell Scroll', @magicalItemId, 'A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class''s spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll in unintelligible. Casting the spell by reading the scroll requires the spell''s normal casting time. Once the spell is cast, the words on the scroll fade, and it crumnles to dust. If the casting is interrupted, the scroll is not lost.\n\nIf the spell is on your class''s spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell''s level. On a failed check, the spell disappears from the scroll with no effect.\n\nThe level of the spell on the scroll determines the spell''s saving throw DC and attack bonus, as well as the scroll''s rarity.\n\nA wizard spell on a spell scroll can be copied just as spells in spellbooks can be copied. When a spell is copied from a spell scroll, the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell''s level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the spell scroll is destroyed.', 1, 0, NULL, 0, 0, 25, @gpId, 0.0, userId, 116),
	('Staff of Charming', @magicalItemId, 'While holding this staff, you can use an action to expend 1 of its 10 charges to cast charm person, command, or comprehend languages from it using your spell save DC. The staff can also be used as a magic quarterstaff.\n\nIf you are holding the staff and fail a saving throw against an enchantment spell that targets only you, you can turn your failed save into a successful one. You can’t use this property of the staff again until the next dawn. If you succeed on a save against an enchantment spell that targets only you, with or without the staff’s intervention, you can use your reaction to expend 1 charge from the staff and turn the spell back on its caster as if you had cast the spell.\n\nThe staff regains 1d8 + 2 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff becomes a non-magical quarterstaff.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 117),
	('Staff of Fire', @magicalItemId, 'You have resistance to fire damage while you hold this staff.\n\nThe staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC: burning hands (1 charge), fireball (3 charges), or wall of fire (4 charges).\n\nThe staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff blackens, crumbles into cinders, and is destroyed.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 118),
	('Staff of Frost', @magicalItemId, 'You have resistance to cold damage while you hold this staff.\n\nThe staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC: cone of cold (5 charges), fog cloud (1 charge), ice storm (4 charges), or wall of ice (4 charges).\n\nThe staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff turns to water and is destroyed.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 119),
	('Staff of Healing', @magicalItemId, 'This staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC and spellcasting ability modifier: cure wounds (1 charge per spell level, up to 4th), lesser restoration (2 charges), or mass cure wounds (5 charges).\n\nThe staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff vanishes in a flash of light, lost forever.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 120),
	('Staff of Power', @magicalItemId, 'This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls.\n\nThe staff has 20 charges for the following properties. The staff regains 2d8 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff retains its +2 bonus to attack and damage rolls but loses all other properties. On a 20, the staff regains 1d8 + 2 charges.\n\n• Power Strike. When you hit with a melee attack using the staff, you can expend 1 charge to deal an extra 1d6 force damage to the target.\n\n• Spells. While holding this staff, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC and spell attack bonus: cone of cold (5 charges), fireball (5th-level version, 5 charges), globe of invulnerability (6 charges), hold monster (5 charges), levitate (2 charges), lightning bolt (5th-level version, 5 charges), magic missile (1 charge), ray of enfeeblement (1 charge), or wall of force (5 charges).\n\n• Retributive Strike. You can use an action to break the staff over your knee or against a solid surface, performing a retributive strike. The staff is destroyed and releases its remaining magic in an explosion that expands to fill a 30-foot-radius sphere centered on it.\n\nYou have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion.  If you fail to avoid the effect, you take force damage equal to 16 × the number of charges in the staff.  Every other creature in the area must make a DC 17 Dexterity saving throw. On a failed save, a creature takes an amount of damage based on how far away it is from the point of origin, as shown in the following table. On a successful save, a creature takes half as much damage.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 121),
	('Staff of Striking', @magicalItemId, 'This staff can be wielded as a magic quarterstaff that grants a +3 bonus to attack and damage rolls made with it.\n\nThe staff has 10 charges. When you hit with a melee attack using it, you can expend up to 3 of its charges. For each charge you expend, the target takes an extra 1d6 force damage. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff becomes a non-magical quarterstaff.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 122),
	('Staff of Swarming Insects', @magicalItemId, 'This staff has 10 charges and regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, a swarm of insects consumes and destroys the staff, then disperses.\n\n• Spells. While holding the staff, you can use an action to expend some of its charges to cast one of the following spells from it, using your spell save DC: giant insect (4 charges) or insect plague (5 charges).\n\n• Insect Cloud. While holding the staff, you can use an action and expend 1 charge to cause a swarm of harmless flying insects to spread out in a 30-foot radius from you. The insects remain for 10 minutes, making the area heavily obscured for creatures other than you. The swarm moves with you, remaining centered on you. A wind of at least 10 miles per hour disperses the swarm and ends the effect.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 123),
	('Staff of the Magi', @magicalItemId, 'This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While you hold it, you gain a +2 bonus to spell attack rolls.\n\nThe staff has 50 charges for the following properties. It regains 4d6 + 2 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 20, the staff regains 1d12 + 1 charges.\n\n• Spell Absorption. While holding the staff, you have advantage on saving throws against spells. In addition, you can use your reaction when another creature casts a spell that targets only you. If you do, the staff absorbs the magic of the spell, canceling its effect and gaining a number of charges equal to the absorbed spell’s level. However, if doing so brings the staff’s total number of charges above 50, the staff explodes as if you activated its retributive strike (see below).\n\n• Spells. While holding the staff, you can use an action to expend some of its charges to cast one of the following spells from it, using your spell save DC and spellcasting ability: conjure elemental (7 charges), dispel magic (3 charges), fireball (7th-level version, 7 charges), flaming sphere (2 charges), ice storm (4 charges), invisibility (2 charges), knock (2 charges), lightning bolt (7th-level version, 7 charges), passwall (5 charges), plane shift (7 charges), telekinesis (5 charges), wall of fire (4 charges), or web (2 charges). You can also use an action to cast one of the following spells from the staff without using any charges: arcane lock, detect magic, enlarge/reduce, light, mage hand, or protection from evil and good.\n\n• Retributive Strike. You can use an action to break the staff over your knee or against a solid surface, performing a retributive strike. The staff is destroyed and releases its remaining magic in an explosion that expands to fill a 30-foot-radius sphere centered on it.\n\nYou have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion.  If you fail to avoid the effect, you take force damage equal to 16 × the number of charges in the staff. Every other creature in the area must make a DC 17 Dexterity saving throw. On a failed save, a creature takes an amount of damage based on how far away it is from the point of origin, as shown in the following table. On a successful save, a creature takes half as much damage.', 0, 1, @handSlotId, 0, 0, 50001, @gpId, 0.0, userId, 124),
	('Staff of the Python', @magicalItemId, 'You can use an action to speak this staff’s command word and throw the staff on the ground within 10 feet of you. The staff becomes a giant constrictor snake under your control and acts on its own initiative count. By using a bonus action to speak the command word again, you return the staff to its normal form in a space formerly occupied by the snake.\n\nOn your turn, you can mentally command the snake if it is within 60 feet of you and you aren’t incapacitated. You decide what action the snake takes and where it moves during its next turn, or you can issue it a general command, such as to attack your enemies or guard a location.\n\nIf the snake is reduced to 0 hit points, it dies and reverts to its staff form. The staff then shatters and is destroyed. If the snake reverts to staff form before losing all its hit points, it regains all of them.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 125),
	('Staff of the Woodlands', @magicalItemId, 'This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While holding it, you have a +2 bonus to spell attack rolls.\n\nThe staff has 10 charges for the following properties. It regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff loses its properties and becomes a non-magical quarterstaff.\n\n• Spells. You can use an action to expend 1 or more of the staff’s charges to cast one of the following spells from it, using your spell save DC: animal friendship (1 charge), awaken (5 charges), barkskin (2 charges), locate animals or plants (2 charges), speak with animals (1 charge), speak with plants (3 charges), or wall of thorns (6 charges).\n\nYou can also use an action to cast the pass without trace spell from the staff without using any charges.\n\n• Tree Form. You can use an action to plant one end of the staff in fertile earth and expend 1 charge to transform the staff into a healthy tree. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius. The tree appears ordinary but radiates a faint aura of transmutation magic if targeted by detect magic. While touching the tree and using another action to speak its command word, you return the staff to its normal form. Any creature in the tree falls when it reverts to a staff.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 126),
	('Staff of Thunder and Lightning', @magicalItemId, 'This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. It also has the following additional properties. When one of these properties is used, it can’t be used again until the next dawn.\n\n• Lightning. When you hit with a melee attack using the staff, you can cause the target to take an extra 2d6 lightning damage.\n\n• Thunder. When you hit with a melee attack using the staff, you can cause the staff to emit a crack of thunder, audible out to 300 feet. The target you hit must succeed on a DC 17 Constitution saving throw or become stunned until the end of your next turn.\n\n• Lightning Strike. You can use an action to cause a bolt of lightning to leap from the staff’s tip in a line that is 5 feet wide and 120 feet long. Each creature in that line must make a DC 17 Dexterity saving throw, taking 9d6 lightning damage on a failed save, or half as much damage on a successful one.\n\n• Thunderclap. You can use an action to cause the staff to issue a deafening thunderclap, audible out to 600 feet. Each creature within 60 feet of you (not including you) must make a DC 17 Constitution saving throw. On a failed save, a creature takes 2d6 thunder damage and becomes deafened for 1 minute.  On a successful save, a creature takes half damage and isn’t deafened.\n\n• Thunder and Lightning. You can use an action to use the Lightning Strike and Thunderclap properties at the same time. Doing so doesn’t expend the daily use of those properties, only the use of this one.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 127),
	('Staff of Withering', @magicalItemId, 'This staff has 3 charges and regains 1d3 expended charges daily at dawn.\n\nThe staff can be wielded as a magic quarterstaff. On a hit, it deals damage as a normal quarterstaff, and you can expend 1 charge to deal an extra 2d10 necrotic damage to the target. In addition, the target must succeed on a DC 15 Constitution saving throw or have disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 128),
	('Wand of Binding', @magicalItemId, 'This wand has 7 charges for the following properties. It regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.\n\n• Spells. While holding the wand, you can use an action to expend some of its charges to cast one of the following spells (save DC 17): hold monster (5 charges) or hold person (2 charges).\n\n• Assisted Escape. While holding the wand, you can use your reaction to expend 1 charge and gain advantage on a saving throw you make to avoid being paralyzed or restrained, or you can expend 1 charge and gain advantage on any check you make to escape a grapple.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 129),
	('Wand of Enemy Detection', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action and expend 1 charge to speak its command word. For the next minute, you know the direction of the nearest creature hostile to you within 60 feet, but not its distance from you. The wand can sense the presence of hostile creatures that are ethereal, invisible, disguised, or hidden, as well as those in plain sight. The effect ends if you stop holding the wand.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 130),
	('Wand of Fear', @magicalItemId, 'This wand has 7 charges for the following properties. It regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.\n\n• Command. While holding the wand, you can use an action to expend 1 charge and command another creature to flee or grovel, as with the command spell (save DC 15).\n\n• Cone of Fear. While holding the wand, you can use an action to expend 2 charges, causing the wand’s tip to emit a 60-foot cone of amber light. Each creature in the cone must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute. While it is frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has nowhere it can move, the creature can use the Dodge action. At the end of each of its turns, a creature can repeat the saving throw, ending the effect on itself on a success.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 131),
	('Wand of Fireballs', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the fireball spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell.  You can increase the spell slot level by one for each additional charge you expend.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 132),
	('Wand of Lightning Bolts', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the lightning bolt spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 133),
	('Wand of Magic Detection', @magicalItemId, 'This wand has 3 charges. While holding it, you can expend 1 charge as an action to cast the detect magic spell from it. The wand regains 1d3 expended charges daily at dawn.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 134),
	('Wand of Magic Missiles', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the magic missile spell from it. For 1 charge, you can cast the 1st-level version of the spell. You can increase the spell slot level by one for each additional charge you expend.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand''s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 135),
	('Wand of Paralysis', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cause a thin blue ray to streak from the tip toward a creature you can see within 60 feet of you. The target must succeed on a DC 15 Constitution saving throw or be paralyzed for 1 minute. At the end of each of the target’s turns, it can repeat the saving throw, ending the effect on itself on a success.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 136),
	('Wand of Polymorph', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the polymorph spell (save DC 15) from it.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 137),
	('Wand of Secrets', @magicalItemId, 'The wand has 3 charges. While holding it, you can use an action to expend 1 of its charges, and if a secret door or trap is within 30 feet of you, the wand pulses and points at the one nearest to you. The wand regains 1d3 expended charges daily at dawn.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 138),
	('+1 Wand of the War Mage', @magicalItemId, 'While holding this wand, you gain a +1 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 139),
	('+2 Wand of the War Mage', @magicalItemId, 'While holding this wand, you gain a +2 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 140),
	('+3 Wand of the War Mage', @magicalItemId, 'While holding this wand, you gain a +3 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 141),
	('Wand of Web', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the web spell (save DC 15) from it.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 142),
	('Wand of Wonder', @magicalItemId, 'This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges and choose a target within 120 feet of you. The target can be a creature, an object, or a point in space. Roll d100 and consult the following table to discover what happens.\n\nIf the effect causes you to cast a spell from the wand, the spell’s save DC is 15. If the spell normally has a range expressed in feet, its range becomes 120 feet if it isn’t already.\n\nIf an effect covers an area, you must center the spell on and include the target. If an effect has multiple possible subjects, the GM randomly determines which ones are affected.\n\nThe wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into dust and is destroyed.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 143),
	('+1 Ammunition', @magicalItemId, 'You have a +1 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.', 0, 0, null, 0, 0, 50, @gpId, 0.0, userId, 144),
	('+2 Ammunition', @magicalItemId, 'You have a +2 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.', 0, 0, null, 0, 0, 250, @gpId, 0.0, userId, 145),
	('+3 Ammunition', @magicalItemId, 'You have a +3 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.', 0, 0, null, 0, 0, 2500, @gpId, 0.0, userId, 146),
	('Arrow of Slaying', @magicalItemId, 'An arrow of slaying is a magic weapon meant to slay a particular kind of creature. Some are more focused than others; for example, there are both arrows of dragon slaying and arrows of blue dragon slaying. If a creature belonging to the type, race, or group associated with an arrow of slaying takes damage from the arrow, the creature must make a DC 17 Constitution saving throw, taking an extra 6d10 piercing damage on a failed save, or half as much extra damage on a successful one.\n\nOnce an arrow of slaying deals its extra damage to a creature, it becomes a non-magical arrow.\n\nOther types of magic ammunition of this kind exist, such as bolts of slaying meant for a crossbow, though arrows are most common.', 0, 0, null, 0, 0, 2500, @gpId, 0.0, userId, 147),
	('Berserker Axe', @magicalItemId, 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. In addition, while you are attuned to this weapon, your hit point maximum increases by 1 for each level you have attained.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 148),
	('Dagger of Venom', @magicalItemId, 'You gain a +1 bonus to attack and damage rolls made with this magic weapon.\n\nYou can use an action to cause thick, black poison to coat the blade. The poison remains for 1 minute or until an attack using this weapon hits a creature.  That creature must succeed on a DC 15 Constitution saving throw or take 2d10 poison damage and become poisoned for 1 minute. The dagger can’t be used this way again until the next dawn.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 149),
	('Dancing Sword', @magicalItemId, 'You can use a bonus action to toss this magic sword into the air and speak the command word. When you do so, the sword begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of it. The sword uses your attack roll and ability score modifier to damage rolls.\n\nWhile the sword hovers, you can use a bonus action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same bonus action, you can cause the sword to attack one creature within 5 feet of it.\n\nAfter the hovering sword attacks for the fourth time, it flies up to 30 feet and tries to return to your hand. If you have no hand free, it falls to the ground at your feet. If the sword has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or move more than 30 feet away from it.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 150),
	('Defender', @magicalItemId, 'You gain a +3 bonus to attack and damage rolls made with this magic weapon.\n\nThe first time you attack with the sword on each of your turns, you can transfer some or all of the sword’s bonus to your Armor Class, instead of using the bonus on any attacks that turn. For example, you could reduce the bonus to your attack and damage rolls to +1 and gain a +2 bonus to AC. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the sword to gain a bonus to AC from it.', 0, 1, @handSlotId, 0, 0, 50001, @gpId, 0.0, userId, 151),
	('Dragon Slayer', @magicalItemId, 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. When you hit a dragon with this weapon, the dragon takes an extra 3d6 damage of the weapon’s type. For the purpose of this weapon, “dragon” refers to any creature with the dragon type, including dragon turtles and wyverns.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 152),
	('Dwarven Thrower', @magicalItemId, 'You gain a +3 bonus to attack and damage rolls made with this magic weapon. It has the thrown property with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 damage or, if the target is a giant, 2d8 damage. Immediately after the attack, the weapon flies back to your hand.\n\n(Requires Dwarf)', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 153),
	('Flame Tongue', @magicalItemId, 'You can use a bonus action to speak this magic sword’s command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet.  While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits. The flames last until you use a bonus action to speak the command word again or until you drop or sheathe the sword.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 154),
	('Frost Brand', @magicalItemId, 'When you hit with an attack using this magic sword, the target takes an extra 1d6 cold damage. In addition, while you hold the sword, you have resistance to fire damage.\n\nIn freezing temperatures, the blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.\n\nWhen you draw this weapon, you can extinguish all non-magical flames within 30 feet of you. This property can be used no more than once per hour.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 155),
	('Giant Slayer', @magicalItemId, 'You gain a +1 bonus to attack and damage rolls made with this magic weapon.\n\nWhen you hit a giant with it, the giant takes an extra 2d6 damage of the weapon’s type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, “giant” refers to any creature with the giant type, including ettins and trolls.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 156),
	('Hammer of Thunderbolts', @magicalItemId, 'You gain a +1 bonus to attack and damage rolls made with this magic weapon.\n\nGiant’s Bane (Requires Attunement). You must be wearing a belt of giant strength (any variety) and gauntlets of ogre power to attune to this weapon. The attunement ends if you take off either of those items.  While you are attuned to this weapon and holding it, your Strength score increases by 4 and can exceed 20, but not 30. When you roll a 20 on an attack roll made with this weapon against a giant, the giant must succeed on a DC 17 Constitution saving throw or die.\n\nThe hammer also has 5 charges. While attuned to it, you can expend 1 charge and make a ranged weapon attack with the hammer, hurling it as if it had the thrown property with a normal range of 20 feet and a long range of 60 feet. If the attack hits, the hammer unleashes a thunderclap audible out to 300 feet. The target and every creature within 30 feet of it must succeed on a DC 17 Constitution saving throw or be stunned until the end of your next turn.  The hammer regains 1d4 + 1 expended charges daily at dawn.', 0, 1, @handSlotId, 0, 0, 50001, @gpId, 0.0, userId, 157),
	('Holy Avenger', @magicalItemId, 'You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a fiend or an undead with it, that creature takes an extra 2d10 radiant damage.\n\nWhile you hold the drawn sword, it creates an aura in a 10-foot radius around you. You and all creatures friendly to you in the aura have advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the paladin class, the radius of the aura increases to 30 feet.', 0, 1, @handSlotId, 0, 0, 50001, @gpId, 0.0, userId, 158),
	('Javelin of Lightning', @magicalItemId, 'This javelin is a magic weapon. When you hurl it and speak its command word, it transforms into a bolt of lightning, forming a line 5 feet wide that extends out from you to a target within 120 feet. Each creature in the line excluding you and the target must make a DC 13 Dexterity saving throw, taking 4d6 lightning damage on a failed save and half as much damage on a successful one. The lightning bolt turns back into a javelin when it reaches te target. Make a ranged weapon attack against the target. On a hit, the target takes damage from the javelin plus 4d6 lightning damage.\n\nThe javelin''s property can''t be used again until the next dawn. In the meantime, the javelin can still be used as a magic weapon.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 159),
	('Luck Blade', @magicalItemId, 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. While the sword is on your person, you also gain a +1 bonus to saving throws.\n\n• Luck. If the sword is on your person, you can call on its luck (no action required) to reroll one attack roll, ability check, or saving throw you dislike. You must use the second roll. This property can’t be used again until the next dawn.\n\n• Wish. The sword has 1d4 – 1 charges. While holding it, you can use an action to expend 1 charge and cast the wish spell from it. This property can’t be used again until the next dawn. The sword loses this property if it has no charges.', 0, 1, @handSlotId, 0, 0, 50001, @gpId, 0.0, userId, 160),
	('Mace of Disruption', @magicalItemId, 'When you hit a fiend or an undead with this magic weapon, that creature takes an extra 2d6 radiant damage. If the target has 25 hit points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed. On a successful save, the creature becomes frightened of you until the end of your next turn.\n\nWhile you hold this weapon, it sheds bright light in a 20-foot radius and dim light for an additional 20 feet.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 161),
	('Mace of Smiting', @magicalItemId, 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. The bonus increases to +3 when you use the mace to attack a construct.\n\nWhen you roll a 20 on an attack roll made with this weapon, the target takes an extra 2d6 bludgeoning damage, or 4d6 bludgeoning damage if it’s a construct. If a construct has 25 hit points or fewer after taking this damage, it is destroyed.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 162),
	('Mace of Terror', @magicalItemId, 'This magic weapon has 3 charges. While holding it, you can use an action and expend 1 charge to release a wave of terror. Each creature of your choice in a 30-foot radius extending from you must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute. While it is frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has nowhere it can move, the creature can use the Dodge action. At the end of each of its turns, a creature can repeat the saving throw, ending the effect on itself on a success.\n\nThe mace regains 1d3 expended charges daily at dawn.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 163),
	('Nine Lives Stealer', @magicalItemId, 'You gain a +2 bonus to attack and damage rolls made with this magic weapon.\n\nThe sword has 1d8 + 1 charges. If you score a critical hit against a creature that has fewer than 100 hit points, it must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body (a construct or an undead is immune). The sword loses 1 charge if the creature is slain. When the sword has no charges remaining, it loses this property.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 164),
	('Oathbow', @magicalItemId, 'When you nock an arrow on this bow, it whispers in Elvish, “Swift defeat to my enemies.” When you use this weapon to make a ranged attack, you can, as a command phrase, say, “Swift death to you who have wronged me.” The target of your attack becomes your sworn enemy until it dies or until dawn seven days later. You can have only one such sworn enemy at a time. When your sworn enemy dies, you can choose a new one after the next dawn.\n\nWhen you make a ranged attack roll with this weapon against your sworn enemy, you have advantage on the roll. In addition, your target gains no benefit from cover, other than total cover, and you suffer no disadvantage due to long range. If the attack hits, your sworn enemy takes an extra 3d6 piercing damage. While your sworn enemy lives, you have disadvantage on attack rolls with all other weapons.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 165),
	('Scimitar of Speed', @magicalItemId, 'You gain a +2 bonus to attack and damage rolls made with this magic weapon. In addition, you can make on attack with it as a bonus action on each of your turns.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 166),
	('Sun Blade', @magicalItemId, 'This item appears to be a longsword hilt. While grasping the hilt, you can use a bonus action to cause a blade of pure radiance to spring into existence, or make the blade disappear. While the blade exists, this magic longsword has the finesse property. If you are proficient with shortswords or longswords, you are proficient with the sun blade.\n\nYou gain a +2 bonus to attack and damage rolls with this weapon which deals radiant damage instead of slashing damage. When you hit an undead with it, that target takes an extra 1d8 radiant damage.\n\nThe sword''s luminous blade emits bright light in a 15-foot radius and dim light for an additional 15 feet. The light is sunlight. While the blade persists, you can use an action to expand or reduce its radius of bight and dim light by 5 feet each, to a maximum of 30 feet each or a minimum of 10 feet each.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 167),
	('Sword of Life Stealing', @magicalItemId, 'When you attack a creature with this magic weapon and roll a 20 on the attack roll, that target takes an extra 3d6 necrotic damage, provided that the target isn’t a construct or an undead. You gain temporary hit points equal to the extra damage dealt.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 168),
	('Sword of Sharpness', @magicalItemId, 'When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target.\n\nWhen you attack a creature with this weapon and roll a 20 on the attack roll, that target takes an extra 4d6 slashing damage. Then roll another d20. If you roll a 20, you lop off one of the target’s limbs, with the effect of such loss determined by the GM. If the creature has no limb to sever, you lop off a portion of its body instead.\n\nIn addition, you can speak the sword’s command word to cause the blade to shed bright light in a 10- foot radius and dim light for an additional 10 feet. Speaking the command word again or sheathing the sword puts out the light.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 169),
	('Sword of Wounding', @magicalItemId, 'Hit points lost to this weapon’s damage can be regained only through a short or long rest, rather than by regeneration, magic, or any other means.\n\nOnce per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. At the start of each of the wounded creature’s turns, it takes 1d4 necrotic damage for each time you’ve wounded it, and it can then make a DC 15 Constitution saving throw, ending the effect of all such wounds on itself on a success. Alternatively, the wounded creature, or a creature within 5 feet of it, can use an action to make a DC 15 Wisdom (Medicine) check, ending the effect of such wounds on it on a success.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 170),
	('Trident of Fish Command', @magicalItemId, 'This trident is a magic weapon. It has 3 charges.  While you carry it, you can use an action and expend 1 charge to cast dominate beast (save DC 15) from it on a beast that has an innate swimming speed. The trident regains 1d3 expended charges daily at dawn.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 171),
	('Vicious Weapon', @magicalItemId, 'When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon’s type.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 172),
	('+1 Weapon', @magicalItemId, 'You have a +1 bonus to attack and damage rolls made with this magic weapon.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 173),
	('+2 Weapon', @magicalItemId, 'You have a +2 bonus to attack and damage rolls made with this magic weapon.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 0.0, userId, 174),
	('+3 Weapon', @magicalItemId, 'You have a +3 bonus to attack and damage rolls made with this magic weapon.', 0, 1, @handSlotId, 0, 0, 5001, @gpId, 0.0, userId, 175),
	('Vopal Sword', @magicalItemId, 'You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores resistance to slashing damage.\n\nWhen you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you cut off one of the creature’s heads. The creature dies if it can’t survive without the lost head. A creature is immune to this effect if it is immune to slashing damage, doesn’t have or need a head, has legendary actions, or the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 6d8 slashing damage from the hit.', 0, 1, @handSlotId, 0, 0, 50001, @gpId, 0.0, userId, 176),
	('Amulet of Health', @magicalItemId, 'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.', 0, 1, @neckSlotId, 0, 0, 501, @gpId, 0.0, userId, 177),
	('Amulet of Proof against Detection and Location', @magicalItemId, 'While wearing this amulet, your are hidden from divination magic. You can''t be targeted by such magic or perceived through magical scrying sensors.', 0, 1, @neckSlotId, 0, 0, 101, @gpId, 0.0, userId, 178),
	('Amulet of the Planes', @magicalItemId, 'While wearing this amulet, you can use an action to name a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the plane shift spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination. Roll a d100. On a 1–60, you travel to a random location on the plane you named. On a 61–100, you travel to a randomly determined plane of existence.', 0, 1, @neckSlotId, 0, 0, 5001, @gpId, 0.0, userId, 179),
	('Apparatus of the Crab', @magicalItemId, 'This item first appears to be a Large sealed iron barrel weighing 500 pounds. the barrel has a hidden catch, which can be found with a successful DC 20 Intelligence (Investigation) check. Releasing the catch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move either up or down. When certain levers are used, the apparatus transforms to resemble a giant lobster.\n\nThe Apparatus of the Crab is a Large object with the following statistics:\nArmor Class: 20\nHit Points: 200\nSpeed: 30 ft., swim 20 ft. (or 0 ft. for both if the legs and tail aren''t extended)\nDamage Immunities: poison, psychic\n\nTo be used as a vehicle, the apparatus requires one pilot. While the apparatus''s hatch is closed, the compartment is airtight and watertight. The compartment holds enough air for 10 hours or breathing, divided by the number of breathing creatures inside.\n\nThe appratus floats on water. It can also go underwater to a depth of 900 feet. Below that, the vehicle takes 2d6 bludgeoning damage per minute from pressure. A creature in the compartment can use an action to move as many as two of the apparatus''s levers up or down. After each use, a lever goes back to its neutral position. Each lever, from left to right functions a shown in the Apparatus of the Crab Levers table.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 180),
	('Bag of Beans', @magicalItemId, 'Inside this heavy cloth bag are 3d4 dry beans. The bag weighs 1/2 pound plus 1/4 pound for each bean it contains.\n\nIf you dump the bag’s contents out on the ground, they explode in a 10-foot radius, extending from the beans. Each creature in the area, including you, must make a DC 15 Dexterity saving throw, taking 5d4 fire damage on a failed save, or half as much damage on a successful one. The fire ignites flammable objects in the area that aren’t being worn or carried.\n\nIf you remove a bean from the bag, plant it in dirt or sand, and then water it, the bean produces an effect 1 minute later from the ground where it was planted. The GM can choose an effect from the following table, determine it randomly, or create an effect.', 0, 0, NULL, 0, 0, 501, @gpId, 0.5, userId, 181),
	('Bag of Devouring', @magicalItemId, 'This bag superficially resembles a bag of holding but is a feeding orifice for a gigantic extradimensional creature. Turning the bag inside out closes the orifice.\n\nThe extradimensional creature attached to the bag can sense whatever is placed inside the bag. Animal or vegetable matter placed wholly in the bag is devoured and lost forever. When part of a living creature is placed in the bag, as happens when someone reaches inside it, there is a 50 percent chance that the creature is pulled inside the bag. A creature inside the bag can use its action to try to escape with a successful DC 15 Strength check.  Another creature can use its action to reach into the bag to pull a creature out, doing so with a successful DC 20 Strength check (provided it isn’t pulled inside the bag first). Any creature that starts its turn inside the bag is devoured, its body destroyed.\n\nInanimate objects can be stored in the bag, which can hold a cubic foot of such material. However, once each day, the bag swallows any objects inside it and spits them out into another plane of existence. The GM determines the time and plane. If the bag is pierced or torn, it is destroyed, and anything contained within it is transported to a random location on the Astral Plane.', 0, 0, NULL, 1, 0, 5001, @gpId, 0.0, userId, 182),
	('Bag of Holding', @magicalItemId, 'This bag has an interior space considerable larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item from the bag requires an action.\n\nIf the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside the bag can survive up to a number of minutes equal to 10 divided by the number of creatures (minimum of 1 minute), after which they begin to suffocate.\n\nPlacing a bag of holding inside an extradimensional space created by a handy haversack, portable hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is a one-way only and can''t be reopened.', 0, 0, NULL, 1, 1, 101, @gpId, 15.0, userId, 183),
	('Bag of Tricks - Gray', @magicalItemId, 'This ordinary bag, made from gray, rust, or tan cloth, appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. The bag weighs 1/2 pound.\n\nYou can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling a d8 and consulting the table that corresponds to the bag’s color. The creature vanishes at the next dawn or when it is reduced to 0 hit points.\n\nThe creature is friendly to you and your companions, and it acts on your turn. You can use a bonus action to command how the creature moves and what action it takes on its next turn, or to give it general orders, such as to attack your enemies. In the absence of such orders, the creature acts in a fashion appropriate to its nature.\n\nOnce three fuzzy objects have been pulled from the bag, the bag can’t be used again until the next dawn.', 0, 0, NULL, 0, 0, 101, @gpId, 0.5, userId, 184),
	('Bag of Tricks - Rust', @magicalItemId, 'This ordinary bag, made from gray, rust, or tan cloth, appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. The bag weighs 1/2 pound.\n\nYou can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling a d8 and consulting the table that corresponds to the bag’s color. The creature vanishes at the next dawn or when it is reduced to 0 hit points.\n\nThe creature is friendly to you and your companions, and it acts on your turn. You can use a bonus action to command how the creature moves and what action it takes on its next turn, or to give it general orders, such as to attack your enemies. In the absence of such orders, the creature acts in a fashion appropriate to its nature.\n\nOnce three fuzzy objects have been pulled from the bag, the bag can’t be used again until the next dawn.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 185),
	('Bag of Tricks - Tan', @magicalItemId, 'This ordinary bag, made from gray, rust, or tan cloth, appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. The bag weighs 1/2 pound.\n\nYou can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling a d8 and consulting the table that corresponds to the bag’s color. The creature vanishes at the next dawn or when it is reduced to 0 hit points.\n\nThe creature is friendly to you and your companions, and it acts on your turn. You can use a bonus action to command how the creature moves and what action it takes on its next turn, or to give it general orders, such as to attack your enemies. In the absence of such orders, the creature acts in a fashion appropriate to its nature.\n\nOnce three fuzzy objects have been pulled from the bag, the bag can’t be used again until the next dawn.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 186),
	('Bead of Force', @magicalItemId, 'This small black sphere measures 3/4 of an inch in diameter and weighs an ounce. Typically, 1d4 + 4 beads of force are found together.\n\nYou can use an action to throw the bead up to 60 feet. The bead explodes on impact and is destroyed.  Each creature within a 10-foot radius of where the bead landed must succeed on a DC 15 Dexterity saving throw or take 5d4 force damage. A sphere of transparent force then encloses the area for 1 minute. Any creature that failed the save and is completely within the area is trapped inside this sphere. Creatures that succeeded on the save, or are partially within the area, are pushed away from the center of the sphere until they are no longer inside it.  Only breathable air can pass through the sphere’s wall. No attack or other effect can.\n\nAn enclosed creature can use its action to push against the sphere’s wall, moving the sphere up to half the creature’s walking speed. The sphere can be picked up, and its magic causes it to weigh only 1 pound, regardless of the weight of creatures inside.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 187),
	('Belt of Dwarvenkind', @magicalItemId, 'While wearing this belt, you gain the following benefits:\n• Your Constitution score increases by 2, to a maximum of 20.\n• You have advantage on Charisma (Persuasion)  checks made to interact with dwarves.\n\nIn addition, while attuned to the belt, you have a 50 percent chance each day at dawn of growing a full beard if you’re capable of growing one, or a visibly thicker beard if you already have one.\n\nIf you aren’t a dwarf, you gain the following additional benefits while wearing the belt:\n• You have advantage on saving throws against poison, and you have resistance against poison damage.\n• You have darkvision out to a range of 60 feet.\n• You can speak, read, and write Dwarvish.', 0, 1, @waistSlotId, 0, 0, 501, @gpId, 0.0, userId, 188),
	('Belt of Giant Strength - Hill Giant', @magicalItemId, 'While wearing this belt, your Strength score changes to a score of 21. If your Strength is already equal to or greater than the belt’s score, the item has no effect on you.', 0, 1, @waistSlotId, 0, 0, 501, @gpId, 0.0, userId, 189),
	('Belt of Giant Strength - Stone Giant', @magicalItemId, 'While wearing this belt, your Strength score changes to a score of 23. If your Strength is already equal to or greater than the belt’s score, the item has no effect on you.', 0, 1, @waistSlotId, 0, 0, 5001, @gpId, 0.0, userId, 190),
	('Belt of Giant Strength - Frost Giant', @magicalItemId, 'While wearing this belt, your Strength score changes to a score of 23. If your Strength is already equal to or greater than the belt’s score, the item has no effect on you.', 0, 1, @waistSlotId, 0, 0, 5001, @gpId, 0.0, userId, 190),
	('Belt of Giant Strength - Fire Giant', @magicalItemId, 'While wearing this belt, your Strength score changes to a score of 25. If your Strength is already equal to or greater than the belt’s score, the item has no effect on you.', 0, 1, @waistSlotId, 0, 0, 5001, @gpId, 0.0, userId, 191),
	('Belt of Giant Strength - Cloud Giant', @magicalItemId, 'While wearing this belt, your Strength score changes to a score of 27. If your Strength is already equal to or greater than the belt’s score, the item has no effect on you.', 0, 1, @waistSlotId, 0, 0, 50001, @gpId, 0.0, userId, 192),
	('Belt of Giant Strength - Storm Giant', @magicalItemId, 'While wearing this belt, your Strength score changes to a score 29. If your Strength is already equal to or greater than the belt’s score, the item has no effect on you.', 0, 1, @waistSlotId, 0, 0, 50001, @gpId, 0.0, userId, 193),
	('Boots of Elvenkind', @magicalItemId, 'While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently.', 0, 1, @feetSlotId, 0, 0, 101, @gpId, 0.0, userId, 194),
	('Boots of Levitation', @magicalItemId, 'While you wear these boots, you can use an action to cast the levitate spell on yourself at will.', 0, 1, @feetSlotId, 0, 0, 501, @gpId, 0.0, userId, 195),
	('Boots of Speed', @magicalItemId, 'While you wear these boots, you can use a bonus action and click the boots'' heels together. If you do, the boots double your walking speed, and any creature that makes an opportunity attack against you has disadvantage on the attack roll. If you click your heels together again, you end the effect.\n\nWhen the boots'' property has been used for a total of 10 minutes, the magic ceases to function until you finish a long rest.', 0, 1, @feetSlotId, 0, 0, 501, @gpId, 0.0, userId, 196),
	('Boots of Striding and Springing', @magicalItemId, 'While you wear these boots, your walking speed becomes 30 feet, unless your walking speed is higher, and your speed isn’t reduced if you are encumbered or wearing heavy armor. In addition, you can jump three times the normal distance, though you can’t jump farther than your remaining movement would allow.', 0, 1, @feetSlotId, 0, 0, 101, @gpId, 0.0, userId, 197),
	('Boots of the Winterlands', @magicalItemId, 'These furred boots are snug and feel quite warm.  While you wear them, you gain the following benefits:\n• You have resistance to cold damage.\n• You ignore difficult terrain created by ice or snow.\n• You can tolerate temperatures as low as −50 degrees Fahrenheit without any additional protection. If you wear heavy clothes, you can tolerate temperatures as low as −100 degrees Fahrenheit.', 0, 1, @feetSlotId, 0, 0, 101, @gpId, 0.0, userId, 198),
	('Bowl of Command Water Elementals', @magicalItemId, 'While this bowl is filled with water, you can use an action to speak the bowl’s command word and summon a water elemental, as if you had cast the conjure elemental spell. The bowl can’t be used this way again until the next dawn.\n\nThe bowl is about 1 foot in diameter and half as deep. It weighs 3 pounds and holds about 3 gallons', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 199),
	('Bracers of Archery', @magicalItemId, 'While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.', 0, 1, @glovesSlotId, 0, 0, 101, @gpId, 0.0, userId, 200),
	('Bracers of Defense', @magicalItemId, 'While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield.', 0, 1, @glovesSlotId, 0, 0, 501, @gpId, 0.0, userId, 201),
	('Brazier of Commanding Fire Elementals', @magicalItemId, 'While a fire burns in this brass brazier, you can use an action to speak the brazier’s command word and summon a fire elemental, as if you had cast the conjure elemental spell. The brazier can’t be used this way again until the next dawn.\n\nThe brazier weighs 5 pounds.', 0, 0, NULL, 0, 0, 501, @gpId, 5.0, userId, 202),
	('Brooch of Shielding', @magicalItemId, 'While wearing this brooch, you have resistance to force damage, and you have immunity to damage from the magic missile spell.', 0, 1, @neckSlotId, 0, 0, 101, @gpId, 0.0, userId, 203),
	('Broom of Flying', @magicalItemId, 'This wooden broom, which weighs 3 pounds, functions like a mundane broom until you stand astride it and speak its command word. It then hovers beneath you and can be ridden in the air. It has a flying speed of 50 feet. It can carry up to 400 pounds, but its flying speed becomes 30 feet while carrying over 200 pounds. The broom stops hovering when you land.\n\nYou can send the broom to travel alone to a destination within 1 mile of you if you speak the command word, name the location, and are familiar with that place. The broom comes back to you when you speak another command word, provided that the broom is still within 1 mile of you.', 0, 0, NULL, 0, 0, 101, @gpId, 3.0, userId, 204),
	('Candle of Invocation', @magicalItemId, 'This slender taper is dedicated to a deity and shares that deity’s alignment. The candle’s alignment can be detected with the detect evil and good spell. The GM chooses the god and associated alignment or determines the alignment randomly.\n\nThe candle’s magic is activated when the candle is lit, which requires an action. After burning for 4 hours, the candle is destroyed. You can snuff it out early for use at a later time. Deduct the time it burned in increments of 1 minute from the candle’s total burn time. While lit, the candle sheds dim light in a 30-foot radius. Any creature within that light whose alignment matches that of the candle makes attack rolls, saving throws, and ability checks with advantage. In addition, a cleric or druid in the light whose alignment matches the candle’s can cast 1st-level spells he or she has prepared without expending spell slots, though the spell’s effect is as if cast with a 1st-level slot.\n\nAlternatively, when you light the candle for the first time, you can cast the gate spell with it. Doing so destroys the candle.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 205),
	('Cape of the Mountebank', @magicalItemId, 'This cape smells faintly of brimstone. While wearing it, you can use it to cast the dimension door spell as an action. This property of the cape can’t be used again until the next dawn.\n\nWhen you disappear, you leave behind a cloud of smoke, and you appear in a similar cloud of smoke at your destination. The smoke lightly obscures the space you left and the space you appear in, and it dissipates at the end of your next turn. A light or stronger wind disperses the smoke.', 0, 1, @backSlotId, 0, 0, 501, @gpId, 0.0, userId, 206),
	('Carpet of Flying - Small', @magicalItemId, 'You can speak the carpet’s command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it.\n\nA carpet can carry up to twice the weight shown below, but it flies at half speed if it carries more than its normal capacity.\n\nSize: 3ft. x 5ft.\nCapacity: 200 lb.\nFlying Speed: 80 feet', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 207),
	('Carpet of Flying - Medium', @magicalItemId, 'You can speak the carpet’s command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it.\n\nA carpet can carry up to twice the weight shown below, but it flies at half speed if it carries more than its normal capacity.\n\nSize: 4ft. x 6ft.\nCapacity: 400 lb.\nFlying Speed: 60 feet', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 208),
	('Carpet of Flying - Large', @magicalItemId, 'You can speak the carpet’s command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it.\n\nA carpet can carry up to twice the weight shown below, but it flies at half speed if it carries more than its normal capacity.\n\nSize: 5ft. x 7ft.\nCapacity: 600 lb.\nFlying Speed: 40 feet', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 209),
	('Carpet of Flying - Extra Large', @magicalItemId, 'You can speak the carpet’s command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it.\n\nA carpet can carry up to twice the weight shown below, but it flies at half speed if it carries more than its normal capacity.\n\nSize: 6ft. x 9ft.\nCapacity: 800 lb.\nFlying Speed: 30 feet', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 210),
	('Censer of Controlling Air Elementals', @magicalItemId, 'While incense is burning in this censer, you can use an action to speak the censer’s command word and summon an air elemental, as if you had cast the conjure elemental spell. The censer can’t be used this way again until the next dawn.\n\nThis 6-inch-wide, 1-foot-high vessel resembles a chalice with a decorated lid. It weighs 1 pound.', 0, 0, NULL, 0, 0, 501, @gpId, 1.0, userId, 211),
	('Chime of Opening', @magicalItemId, 'This hollow metal tube measures about 1 foot long and weighs 1 pound. You can strike it as an action, pointing it at an object within 120 feet of you that can be opened, such as a door, lid, or lock. The chime issues a clear tone, and one lock or latch on the object opens unless the sound can’t reach the object.  If no locks or latches remain, the object itself opens.\n\nThe chime can be used ten times. After the tenth time, it cracks and becomes useless.', 0, 0, NULL, 0, 0, 501, @gpId, 1.0, userId, 212),
	('Circlet of Blasting', @magicalItemId, 'While wearing this circlet, you can use an action to cast the scorching ray spell with it. When you make the spell’s attacks, you do so with an attack bonus of +5. The circlet can’t be used this way again until the next dawn.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 213),
	('Cloak of Arachnida', @magicalItemId, 'This fine garment is made of black silk interwoven with faint silvery threads. While wearing it, you gain the following benefits:\n• You have resistance to poison damage.\n• You have a climbing speed equal to your walking speed.\n• You can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free.\n• You can’t be caught in webs of any sort and can move through webs as if they were difficult terrain.\n• You can use an action to cast the web spell (save DC 13). The web created by the spell fills twice its normal area. Once used, this property of the cloak can’t be used again until the next dawn.', 0, 1, @backSlotId, 0, 0, 5001, @gpId, 0.0, userId, 214),
	('Cloak of Displacement', @magicalItemId, 'While you wear this cloak, it projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while you are incapacitated, restrained, or otherwise unable to move.', 0, 1, @backSlotId, 0, 0, 501, @gpId, 0.0, userId, 215),
	('Cloak of Elvenkind', @magicalItemId, 'While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak’s color shifts to camouflage you. Pulling the hood up or down requires an action.', 0, 1, @backSlotId, 0, 0, 101, @gpId, 0.0, userId, 216),
	('Cloak of Protection', @magicalItemId, 'You gain a +1 bonus to AC and saving throws while you wear this cloak.', 0, 1, @backSlotId, 0, 0, 101, @gpId, 0.0, userId, 217),
	('Cloak of the Bat', @magicalItemId, 'While wearing this cloak, you have advantage on Dexterity (Stealth) checks. In an area of dim light or darkness, you can grip the edges of the cloak with both hands and use it to fly at a speed of 40 feet. If you ever fail to grip the cloak’s edges while flying in this way, or if you are no longer in dim light or darkness, you lose this flying speed.\n\nWhile wearing the cloak in an area of dim light or darkness, you can use your action to cast polymorph on yourself, transforming into a bat. While you are in the form of the bat, you retain your Intelligence, Wisdom, and Charisma scores. The cloak can’t be used this way again until the next dawn.', 0, 1, @backSlotId, 0, 0, 501, @gpId, 0.0, userId, 218),
	('Cloak of the Manta Ray', @magicalItemId, 'While wearing this cloak with its hood up, you can breathe underwater, and you have a swimming speed of 60 feet. Pulling the hood up or down requires an action.', 0, 1, @backSlotId, 0, 0, 101, @gpId, 0.0, userId, 219),
	('Crystal Ball', @magicalItemId, 'The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 220),
	('Crystal Ball of Mind Reading', @magicalItemId, 'The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.\n\nYou can use an action to cast the detect thoughts spell (save DC 17)  while you are scrying with the crystal ball, targeting creatures you can see within 30 feet of the spell’s sensor. You don’t need to concentrate on this detect thoughts to maintain it during its duration, but it ends if scrying ends.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 221),
	('Crystal Ball of Telepathy', @magicalItemId, 'The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.\n\nWhile scrying with the crystal ball, you can communicate telepathically with creatures you can see within 30 feet of the spell’s sensor. You can also use an action to cast the suggestion spell (save DC 17) through the sensor on one of those creatures. You don’t need to concentrate on this suggestion to maintain it during its duration, but it ends if scrying ends. Once used, the suggestion power of the crystal ball can’t be used again until the next dawn.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 222),
	('Crystal Ball of True Seeing', @magicalItemId, 'The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.\n\nWhile scrying with the crystal ball, you have truesight with a radius of 120 feet centered on the spell’s sensor.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 223),
	('Cube of Force', @magicalItemId, 'This cube is about an inch across. Each face has a distinct marking on it that can be pressed. The cube starts with 36 charges, and it regains 1d20 expended charges daily at dawn.\n\nYou can use an action to press one of the cube’s faces, expending a number of charges based on the chosen face, as shown in the Cube of Force Faces table. Each face has a different effect. If the cube has insufficient charges remaining, nothing happens.  Otherwise, a barrier of invisible force springs into existence, forming a cube 15 feet on a side. The barrier is centered on you, moves with you, and lasts for 1 minute, until you use an action to press the cube’s sixth face, or the cube runs out of charges.  You can change the barrier’s effect by pressing a different face of the cube and expending the requisite number of charges, resetting the duration.\n\nIf your movement causes the barrier to come into contact with a solid object that can’t pass through the cube, you can’t move any closer to that object as long as the barrier remains.\n\nThe cube loses charges when the barrier is targeted by certain spells or comes into contact with certain spell or magic item effects, as shown in the table below.\n\nSpell or Item | Charges Lost\nDisintegrate | 1d12\nHorn of Blasting | 1d10\nPasswall | 1d6\nPrismatic Spray | 1d20\nWall of Fire | 1d4', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 224),
	('Cubic Gate', @magicalItemId, 'This cube is 3 inches across and radiates palpable magical energy. The six sides of the cube are each keyed to a different plane of existence, one of which is the Material Plane. The other sides are linked to planes determined by the GM.\n\nYou can use an action to press one side of the cube to cast the gate spell with it, opening a portal to the plane keyed to that side. Alternatively, if you use an action to press one side twice, you can cast the plane shift spell (save DC 17) with the cube and transport the targets to the plane keyed to that side.\n\nThe cube has 3 charges. Each use of the cube expends 1 charge. The cube regains 1d3 expended charges daily at dawn.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 225),
	('Decanter of Endless Water', @magicalItemId, 'This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds.\n\nYou can use an action to remove the stopper and speak one of three command words, whereupon an amount of fresh water or salt water (your choice)  pours out of the flask. The water stops pouring out at the start of your next turn. Choose from the following options:\n• “Stream” produces 1 gallon of water.\n• “Fountain” produces 5 gallons of water.\n• “Geyser” produces 30 gallons of water that gushes forth in a geyser 30 feet long and 1 foot wide. As a bonus action while holding the decanter, you can aim the geyser at a creature you can see within 30 feet of you. The target must succeed on a DC 13 Strength saving throw or take 1d4 bludgeoning damage and fall prone. Instead of a creature, you can target an object that isn’t being worn or carried and that weighs no more than 200 pounds.  The object is either knocked over or pushed up to 15 feet away from you.', 0, 0, NULL, 0, 0, 101, @gpId, 2.0, userId, 226),
	('Deck of Illusions', @magicalItemId, 'This box contains a set of parchment cards. A full deck has 34 cards. A deck found as treasure is usually missing 1d20 − 1 cards.\n\nThe magic of the deck functions only if cards are drawn at random (you can use an altered deck of playing cards to simulate the deck). You can use an action to draw a card at random from the deck and throw it to the ground at a point within 30 feet of you.\n\nAn illusion of one or more creatures forms over the thrown card and remains until dispelled. An illusory creature appears real, of the appropriate size, and behaves as if it were a real creature except that it can do no harm. While you are within 120 feet of the illusory creature and can see it, you can use an action to move it magically anywhere within 30 feet of its card. Any physical interaction with the illusory creature reveals it to be an illusion, because objects pass through it. Someone who uses an action to visually inspect the creature identifies it as illusory with a successful DC 15 Intelligence (Investigation)  check. The creature then appears translucent.\n\nThe illusion lasts until its card is moved or the illusion is dispelled. When the illusion ends, the image on its card disappears, and that card can’t be used again.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 227),
	('Deck of Many Things', @magicalItemId, 'Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Most (75 percent) of these decks have only thirteen cards, but the rest have twenty-two.\n\nBefore you draw a card, you must declare how many cards you intend to draw and then draw them randomly (you can use an altered deck of playing cards to simulate the deck). Any cards drawn in excess of this number have no effect. Otherwise, as soon as you draw a card from the deck, its magic takes effect. You must draw each card no more than 1 hour after the previous draw. If you fail to draw the chosen number, the remaining number of cards fly from the deck on their own and take effect all at once.\n\nOnce a card is drawn, it fades from existence.  Unless the card is the Fool or the Jester, the card reappears in the deck, making it possible to draw the same card twice.\n\n• Balance. Your mind suffers a wrenching alteration, causing your alignment to change. Lawful becomes chaotic, good becomes evil, and vice versa. If you are true neutral or unaligned, this card has no effect on you.\n\n• Comet. If you single-handedly defeat the next hostile monster or group of monsters you encounter, you gain experience points enough to gain one level.  Otherwise, this card has no effect.\n\n• Donjon. You disappear and become entombed in a state of suspended animation in an extradimensional sphere. Everything you were wearing and carrying stays behind in the space you occupied when you disappeared. You remain imprisoned until you are found and removed from the sphere. You can’t be located by any divination magic, but a wish spell can reveal the location of your prison. You draw no more cards.\n\n• Euryale. The card’s medusa-like visage curses you.  You take a −2 penalty on saving throws while cursed in this way. Only a god or the magic of The Fates card can end this curse.\n\n• The Fates. Reality’s fabric unravels and spins anew, allowing you to avoid or erase one event as if it never happened. You can use the card’s magic as soon as you draw the card or at any other time before you die.\n\n• Flames. A powerful devil becomes your enemy.  The devil seeks your ruin and plagues your life, savoring your suffering before attempting to slay you. This enmity lasts until either you or the devil dies.\n\n• Fool. You lose 10,000 XP, discard this card, and draw from the deck again, counting both draws as one of your declared draws. If losing that much XP would cause you to lose a level, you instead lose an amount that leaves you with just enough XP to keep your level.\n\n• Gem. Twenty-five pieces of jewelry worth 2,000 gp each or fifty gems worth 1,000 gp each appear at your feet.\n\n• Idiot. Permanently reduce your Intelligence by 1d4 + 1 (to a minimum score of 1). You can draw one additional card beyond your declared draws.\n\n• Jester. You gain 10,000 XP, or you can draw two additional cards beyond your declared draws.\n\n• Key. A rare or rarer magic weapon with which you are proficient appears in your hands. The GM chooses the weapon.\n\n• Knight. You gain the service of a 4th-level fighter who appears in a space you choose within 30 feet of you. The fighter is of the same race as you and serves you loyally until death, believing the fates have drawn him or her to you. You control this character.\n\n• Moon. You are granted the ability to cast the wish spell 1d3 times.\n\n• Rogue. A nonplayer character of the GM’s choice becomes hostile toward you. The identity of your new enemy isn’t known until the NPC or someone else reveals it. Nothing less than a wish spell or divine intervention can end the NPC’s hostility toward you.\n\n• Ruin. All forms of wealth that you carry or own, other than magic items, are lost to you. Portable property vanishes. Businesses, buildings, and land you own are lost in a way that alters reality the least.  Any documentation that proves you should own something lost to this card also disappears.\n\n• Skull. You summon an avatar of death — a ghostly humanoid skeleton clad in a tattered black robe and carrying a spectral scythe. It appears in a space of the GM’s choice within 10 feet of you and attacks you, warning all others that you must win the battle alone.  The avatar fights until you die or it drops to 0 hit points, whereupon it disappears. If anyone tries to help you, the helper summons its own avatar of death. A creature slain by an avatar of death can’t be restored to life.\n\nAvatar of Death\nMedium undead, neutral evil\nArmor Class: 20\nHit Points: half the hit point maximum of its summoner\nSpeed: 60 tf., fly 60 ft. (hover)\nStr: 16 (+3)\nDex: 16 (+3)\nCon: 16 (+3)\nInt: 16 (+3)\nWis: 16 (+3)\nCha: 16 (+3)\nDamage Immunities: necrotic, poison\nCondition Immunities: charmed, frightened, paralyzed, petrified, poisoned, unconscious\nSenses: Darkvision 60 ft., Truesight 60 ft., Passive Perception 13\nLanguages: all languages known to its summoner\nChallenge: - (0 XP)\nIncorporeal Movement: The avatar can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\nTurning Immunity: The avatar is immune to features that turn undead.\nReaping Scythe:  The avatar sweeps its spectral scythe through a creature within 5 feet of it, dealing 7 (1d8 + 3) slashing damage plus 4 (1d8) necrotic damage.\n\n• Star. Increase one of your ability scores by 2. The score can exceed 20 but can’t exceed 24.\n\n• Sun. You gain 50,000 XP, and a wondrous item(which the GM determines randomly) appears in your hands.\n\n• Talons. Every magic item you wear or carry disintegrates. Artifacts in your possession aren’t destroyed but do vanish.\n\n• Throne. You gain proficiency in the Persuasion skill, and you double your proficiency bonus on checks made with that skill. In addition, you gain rightful ownership of a small keep somewhere in the world. However, the keep is currently in the hands of monsters, which you must clear out before you can claim the keep as yours.\n\n• Vizier. At any time you choose within one year of drawing this card, you can ask a question inmeditation and mentally receive a truthful answer to that question. Besides information, the answer helps you solve a puzzling problem or other dilemma. In other words, the knowledge comes with wisdom on how to apply it.\n\n• The Void. This black card spells disaster. Your soul is drawn from your body and contained in an object in a place of the GM’s choice. One or more powerful beings guard the place. While your soul is trapped in this way, your body is incapacitated. A wish spell can’t restore your soul, but the spell reveals the location of the object that holds it. You draw no morecards.\n\n*Found only in a deck with twenty-two cards', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 228),
	('Dimensional Shackles', @magicalItemId, 'You can use an action to place these shackles on an incapacitated creature. The shackles adjust to fit a creature of Small to Large size. In addition to serving as mundane manacles, the shackles prevent a creature bound by them from using any method of extradimensional movement, including teleportation or travel to a different plane of existence. They don’t prevent the creature from passing through an interdimensional portal.\n\nYou and any creature you designate when you use the shackles can use an action to remove them. Once every 30 days, the bound creature can make a DC 30 Strength (Athletics) check. On a success, the creature breaks free and destroys the shackles.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 229),
	('Dust of Disappearance', @magicalItemId, 'Found in a small packet, this powder resembles very fine sand. There is enough of it for one use. When you use an action to throw the dust into the air, you and each creature and object within 10 feet of you become invisible for 2d4 minutes. The duration is the same for all subjects, and the dust is consumed when its magic takes effect. If a creature affected by the dust attacks or casts a spell, the invisibility ends for that creature.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 230),
	('Dust of Dryness', @magicalItemId, 'This small packet contains 1d6 + 4 pinches of dust.  You can use an action to sprinkle a pinch of it over water. The dust turns a cube of water 15 feet on a side into one marble-sized pellet, which floats or rests near where the dust was sprinkled. The pellet’s weight is negligible.\n\nSomeone can use an action to smash the pellet against a hard surface, causing the pellet to shatter and release the water the dust absorbed. Doing so ends that pellet’s magic.\n\nAn elemental composed mostly of water that is exposed to a pinch of the dust must make a DC 13 Constitution saving throw, taking 10d6 necrotic damage on a failed save, or half as much damage on a successful one.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 231),
	('Dust of Sneezing and Choking', @magicalItemId, 'Found in a small container, this powder resembles very fine sand. It appears to be dust of disappearance, and an identify spell reveals it to be such. There is enough of it for one use.\n\nWhen you use an action to throw a handful of the dust into the air, you and each creature that needs to breathe within 30 feet of you must succeed on a DC 15 Constitution saving throw or become unable to breathe, while sneezing uncontrollably. A creature affected in this way is incapacitated and suffocating.  As long as it is conscious, a creature can repeat the saving throw at the end of each of its turns, ending the effect on it on a success. The lesser restoration spell can also end the effect on a creature.', 1, 0, NULL, 0, 0, 50, @gpId, 0.0, userId, 232),
	('Efficient Quiver', @magicalItemId, 'Each of the quiver''s three compartments connects to an extradimensional space that allows the quiver to hold numerous items while never weighing more than 2 pounds. The shortest compartment can hold up to sixty arrows, bolts, or similar objects. The midsize compartment holds up to eighteen javelins or similar objects. The longest compartment holds up to six long objects, such as bows, quarterstaffs, or spears.\n\nYou can draw any item the quiver contains as if doing so from a regular quiver or scabbard.', 0, 0, NULL, 1, 1, 101, @gpId, 2.0, userId, 233),
	('Efreeti Bottle', @magicalItemId, 'This painted brass bottle weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke flows out of the bottle. At the end of your turn, the smoke disappears with a flash of harmless fire, and an efreeti appears in an unoccupied space within 30 feet of you.\n\nThe first time the bottle is opened, the GM rolls to determine what happens.', 0, 0, NULL, 0, 0, 5001, @gpId, 1.0, userId, 234),
	('Elemental Gem - Blue Sapphire', @magicalItemId, 'This gem contains a mote of elemental energy. When you use an action to break the gem, an elemental is summoned as if you had cast the conjure elemental spell, and the gem’s magic is lost. The type of gem determines the elemental summoned by the spell.\n\nSummoned Elemental - Air Elemental', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 235),
	('Elemental Gem - Yellow Diamond', @magicalItemId, 'This gem contains a mote of elemental energy. When you use an action to break the gem, an elemental is summoned as if you had cast the conjure elemental spell, and the gem’s magic is lost. The type of gem determines the elemental summoned by the spell.\n\nSummoned Elemental - Earth Elemental', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 236),
	('Elemental Gem - Red Corundum', @magicalItemId, 'This gem contains a mote of elemental energy. When you use an action to break the gem, an elemental is summoned as if you had cast the conjure elemental spell, and the gem’s magic is lost. The type of gem determines the elemental summoned by the spell.\n\nSummoned Elemental - Fire Elemental', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 237),
	('Elemental Gem - Emerald', @magicalItemId, 'This gem contains a mote of elemental energy. When you use an action to break the gem, an elemental is summoned as if you had cast the conjure elemental spell, and the gem’s magic is lost. The type of gem determines the elemental summoned by the spell.\n\nSummoned Elemental - Water Elemental', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 238),
	('Eversmoking Bottle', @magicalItemId, 'Smoke leaks from the lead-stoppered mouth of this brass bottle, which weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke pours out in a 60-foot radius from the bottle.  The cloud’s area is heavily obscured. Each minute the bottle remains open and within the cloud, the radius increases by 10 feet until it reaches its maximum radius of 120 feet.\n\nThe cloud persists as long as the bottle is open.  Closing the bottle requires you to speak its command word as an action. Once the bottle is closed, the cloud disperses after 10 minutes. A moderate wind (11 to 20 miles per hour) can also disperse the smoke after 1 minute, and a strong wind (21 or more miles per hour) can do so after 1 round.', 0, 0, NULL, 0, 0, 101, @gpId, 1.0, userId, 239),
	('Eyes of Charming', @magicalItemId, 'These crystal lenses fit over the eyes. They have 3 charges. While wearing them, you can expend 1 charge as an action to cast the charm person spell (save DC 13) on a humanoid within 30 feet of you, provided that you and the target can see each other.  The lenses regain all expended charges daily at dawn.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 240),
	('Eyes of Minute Seeing', @magicalItemId, 'These crystal lenses fit over the eyes. While wearing them, you can see much better than normal out to a range of 1 foot. You have advantage on Intelligence (Investigation) checks that rely on sight while searching an area or studying an object within that range.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 241),
	('Eyes of the Eagle', @magicalItemId, 'These crystal lenses fit over the eyes. While wearing them, you have advantage on Wisdom (Perception)  checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 242),
	('Feather Token - Anchor', @magicalItemId, 'This tiny object looks like a feather. Different types of feather tokens exist, each with a different singleuse effect. The GM chooses the kind of token or determines it randomly.\n\nYou can use an action to touch the token to a boat or ship. For the next 24 hours, the vessel can’t be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 243),
	('Feather Token - Bird', @magicalItemId, 'This tiny object looks like a feather. Different types of feather tokens exist, each with a different singleuse effect. The GM chooses the kind of token or determines it randomly.\n\nYou can use an action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a roc, but it obeys your simple commands and can’t attack. It can carry up to 500 pounds while flying at its maximum speed (16 miles an hour for a maximum of 144 miles per day, with a one-hour rest for every 3 hours of flying), or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 hit points. You can dismiss the bird as an action.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 244),
	('Feather Token - Fan', @magicalItemId, 'This tiny object looks like a feather. Different types of feather tokens exist, each with a different singleuse effect. The GM chooses the kind of token or determines it randomly.\n\nIf you are on a boat or ship, you can use an action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a wind strong enough to fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as an action.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 245),
	('Feather Token - Swan Boat', @magicalItemId, 'This tiny object looks like a feather. Different types of feather tokens exist, each with a different singleuse effect. The GM chooses the kind of token or determines it randomly.\n\nYou can use an action to touch the token to a body of water at least 60 feet in diameter.  The token disappears, and a 50-foot-long, 20-footwide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can use an action while on the boat to command it to move or to turn up to 90 degrees. The boat can carry up to thirty-two Medium or smaller creatures. A Large creature counts as four Medium creatures, while a Huge creature counts as nine. The boat remains for 24 hours and then disappears. You can dismiss the boat as an action.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 246),
	('Feather Token - Tree', @magicalItemId, 'This tiny object looks like a feather. Different types of feather tokens exist, each with a different singleuse effect. The GM chooses the kind of token or determines it randomly.\n\nYou must be outdoors to use this token. You can use an action to touch it to an unoccupied space on the ground. The token disappears, and in its place a non-magical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 247),
	('Feather Token - Whip', @magicalItemId, 'This tiny object looks like a feather. Different types of feather tokens exist, each with a different singleuse effect. The GM chooses the kind of token or determines it randomly.\n\nYou can use an action to throw the token to a point within 10 feet of you. The token disappears, and a floating whip takes its place. You can then use a bonus action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 force damage.\n\nAs a bonus action on your turn, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of it. The whip disappears after 1 hour, when you use an action to dismiss it, or when you are incapacitated or die.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 248),
	('Figurine of Wondrous Power - Bronze Griffon', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThis bronze statuette is of a griffon rampant. It can become a griffon for up to 6 hours. Once it has been used, it can’t be used again until 5 days have passed.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 249),
	('Figurine of Wondrous Power - Ebony Fly', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThis ebony statuette is carved in the likeness of a horsefly. It can become a giant fly for up to 12 hours and can be ridden as a mount.  Once it has been used, it can’t be used again until 2 days have passed.\n\nGiant Fly\nLarge beast, unaligned\nArmor Class: 11\nHit Points: 19 (3d10 + 3)\nSpeed: 30 ft., fly 60 ft.\nStr: 14 (+2)\nDex: 13 (+1)\nCon: 13 (+1)\nInt: 2 (-4)\nWis: 10 (+0)\nCha: 3 (-4)\nSenses: Darkvision 60 ft., Passive Perception 10\nLanguages: none', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 250),
	('Figurine of Wondrous Power - Golden Lions', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThese gold statuettes of lions are always created in pairs. You can use one figurine or both simultaneously. Each can become a lion for up to 1 hour. Once a lion has been used, it can’t be used again until 7 days have passed.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 251),
	('Figurine of Wondrous Power - Ivory Goats', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThese ivory statuettes of goats are always created in sets of three. Each goat looks unique and functions differently from the others. Their properties are as follows:\n• The goat of traveling can become a Large goat with the same statistics as a riding horse. It has 24 charges, and each hour or portion thereof it spends in beast form costs 1 charge. While it has charges, you can use it as often as you wish. When it runs out of charges, it reverts to a figurine and can’t be used again until 7 days have passed, when it regains all its charges.\n• The goat of travail becomes a giant goat for up to 3 hours. Once it has been used, it can’t be used again until 30 days have passed.\n• The goat of terror becomes a giant goat for up to 3 hours. The goat can’t attack, but you can remove its horns and use them as weapons. One horn becomes a +1 lance, and the other becomes a +2 longsword. Removing a horn requires an action, and the weapons disappear and the horns return when the goat reverts to figurine form. In addition, the goat radiates a 30-foot-radius aura of terror while you are riding it. Any creature hostile to you that starts its turn in the aura must succeed on a DC 15 Wisdom saving throw or be frightened of the goat for 1 minute, or until the goat reverts to figurine form. The frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Once it successfully saves against the effect, a creature is immune to the goat’s aura for the next 24 hours. Once the figurine has been used, it can’t be used again until 15 days have passed.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 252),
	('Figurine of Wondrous Power - Marble Elephant', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThis marble statuette is about 4 inches high and long. It can become an elephant for up to 24 hours. Once it has been used, it can’t be used again until 7 days have passed.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 253),
	('Figurine of Wondrous Power - Obsidian Steed', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThis polished obsidian horse can become a nightmare for up to 24 hours. The nightmare fights only to defend itself. Once it has been used, it can’t be used again until 5 days have passed. If you have a good alignment, the figurine has a 10 percent chance each time you use it to ignore your orders, including a command to revert to figurine form. If you mount the nightmare while it is ignoring your orders, you and the nightmare are instantly transported to a random location on the plane of Hades, where the nightmare reverts to figurine form.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 254),
	('Figurine of Wondrous Power - Onyx Dog', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThis onyx statuette of a dog can become a mastiff for up to 6 hours. The mastiff has an Intelligence of 8 and can speak Common. It also has darkvision out to a range of 60 feet and can see invisible creatures and objects within that range. Once it has been used, it can’t be used again until 7 days have passed.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 255),
	('Figurine of Wondrous Power - Serpentine Owl', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThis serpentine statuette of an owl can become a giant owl for up to 8 hours. Once it has been used, it can’t be used again until 2 days have passed. The owl can telepathically communicate with you at any range if you and it are on the same plane of existence.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 256),
	('Figurine of Wondrous Power - Silver Raven', @magicalItemId, 'A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn’t enough space for the creature, the figurine doesn’t become a creature.\n\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\n\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it.  When the creature becomes a figurine again, its property can’t be used again until a certain amount of time has passed, as specified in the figurine’s description.\n\nThis silver statuette of a raven can become a raven for up to 12 hours. Once it has been used, it can’t be used again until 2 days have passed. While in raven form, the figurine allows you to cast the animal messenger spell on it at will.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 257),
	('Folding Boat', @magicalItemId, 'This object appears as a wooden box that measures 12 inches long, 6 inches wide, and 6 inches deep. It weighs 4 pounds and floats. It can be opened to store items inside. This item also has three command words, each requiring you to use an action to speak it.\n\nOne command word causes the box to unfold into a boat 10 feet long, 4 feet wide, and 2 feet deep. The boat has one pair of oars, an anchor, a mast, and a lateen sail. The boat can hold up to four Medium creatures comfortably.\n\nThe second command word causes the box to unfold into a ship 24 feet long, 8 feet wide, and 6 feet deep. The ship has a deck, rowing seats, five sets of oars, a steering oar, an anchor, a deck cabin, and a mast with a square sail. The ship can hold fifteen Medium creatures comfortably.\n\nWhen the box becomes a vessel, its weight becomes that of a normal vessel its size, and anything that was stored in the box remains in the boat.\n\nThe third command word causes the folding boat to fold back into a box, provided that no creatures are aboard. Any objects in the vessel that can’t fit inside the box remain outside the box as it folds. Any objects in the vessel that can fit inside the box do so.', 0, 0, NULL, 0, 0, 501, @gpId, 4.0, userId, 258),
	('Gauntlets of Ogre Power', @magicalItemId, 'Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher.', 0, 1, @glovesSlotId, 0, 0, 101, @gpId, 0.0, userId, 259),
	('Gem of Brightness', @magicalItemId, 'This prism has 50 charges. While you are holding it, you can use an action to speak one of three command words to cause one of the following effects:\n• The first command word causes the gem to shed bright light in a 30-foot radius and dim light for an additional 30 feet. This effect doesn’t expend a charge. It lasts until you use a bonus action to repeat the command word or until you use another function of the gem.\n• The second command word expends 1 charge and causes the gem to fire a brilliant beam of light at one creature you can see within 60 feet of you. The creature must succeed on a DC 15 Constitution saving throw or become blinded for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n• The third command word expends 5 charges and causes the gem to flare with blinding light in a 30- foot cone originating from it. Each creature in the cone must make a saving throw as if struck by the beam created with the second command word.\n\nWhen all of the gem’s charges are expended, the gem becomes a non-magical jewel worth 50 gp.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 260),
	('Gem of Seeing', @magicalItemId, 'This gem has 3 charges. As an action, you can speak the gem’s command word and expend 1 charge. For the next 10 minutes, you have truesight out to 120 feet when you peer through the gem.\n\nThe gem regains 1d3 expended charges daily at dawn.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 261),
	('Gloves of Missile Snaring', @magicalItemId, 'These gloves seem to almost meld into your hands when you don them. When a ranged weapon attack hits you while you’re wearing them, you can use your reaction to reduce the damage by 1d10 + your Dexterity modifier, provided that you have a free hand. If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in that hand.', 0, 1, @glovesSlotId, 0, 0, 101, @gpId, 0.0, userId, 262),
	('Gloves of Swimming and Climbing', @magicalItemId, 'While wearing these gloves, climbing and swimming don’t cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim.', 0, 1, @glovesSlotId, 0, 0, 101, @gpId, 0.0, userId, 263),
	('Goggles of Night', @magicalItemId, 'While wearing these dark lenses, you have darkvision out to a range of 60 feet. If you already have darkvision, wearing the goggles increases its range by 60 feet.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 264),
	('Handy Haversack', @magicalItemId, 'This backpack has a central pouch and two side pouches, each of which is an extradimensional space.  Each side pouch can hold up to 20 pounds of material, not exceeding a volume of 2 cubic feet. The large central pouch can hold up to 8 cubic feet or 80 pounds of material. The backpack always weighs 5 pounds, regardless of its contents.\n\nPlacing an object in the haversack follows the normal rules for interacting with objects. Retrieving an item from the haversack requires you to use an action. When you reach into the haversack for a specific item, the item is always magically on top.\n\nThe haversack has a few limitations. If it is overloaded, or if a sharp object pierces it or tears it, the haversack ruptures and is destroyed. If the haversack is destroyed, its contents are lost forever, although an artifact always turns up again somewhere. If the haversack is turned inside out, its contents spill forth, unharmed, and the haversack must be put right before it can be used again. If a breathing creature is placed within the haversack, the creature can survive for up to 10 minutes, after which time it begins to suffocate.\n\nPlacing the haversack inside an extradimensional space created by a bag of holding, portable hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can’t be reopened.', 0, 0, NULL, 1, 1, 501, @gpId, 5.0, userId, 265),
	('Hat of Disguise', @magicalItemId, 'While wearing this hat, you can use an action to cast the disguise self spell from it at will. The spell ends if the hat is removed.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 266),
	('Headband of Intellect', @magicalItemId, 'Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 267),
	('Helm of Brilliance', @magicalItemId, 'This dazzling helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. Any gem pried from the helm crumbles to dust. When all the gems are removed or destroyed, the helm loses its magic.\n\nYou gain the following benefits while wearing it:\n• You can use an action to cast one of the following spells (save DC 18), using one of the helm’s gems of the specified type as a component: daylight (opal), fireball (fire opal), prismatic spray (diamond), or wall of fire (ruby). The gem is destroyed when the spell is cast and disappears from the helm.\n• As long as it has at least one diamond, the helm emits dim light in a 30-foot radius when at least one undead is within that area. Any undead that starts its turn in that area takes 1d6 radiant damage.\n• As long as the helm has at least one ruby, you have resistance to fire damage.\n• As long as the helm has at least one fire opal, you can use an action and speak a command word to cause one weapon you are holding to burst into flames. The flames emit bright light in a 10-foot radius and dim light for an additional 10 feet. The flames are harmless to you and the weapon. When you hit with an attack using the blazing weapon, the target takes an extra 1d6 fire damage. The flames last until you use a bonus action to speak the command word again or until you drop or stow the weapon.\n\nRoll a d20 if you are wearing the helm and take fire damage as a result of failing a saving throw against a spell. On a roll of 1, the helm emits beams of light from its remaining gems. Each creature within 60 feet of the helm other than you must succeed on a DC 17 Dexterity saving throw or be struck by a beam, taking radiant damage equal to the number of gems in the helm. The helm and its gems are then destroyed.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 268),
	('Helm of Comprehending Languages', @magicalItemId, 'While wearing this helm, you can use an action to cast the comprehend languages spell from it at will.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 269),
	('Helm of Telepathy', @magicalItemId, 'While wearing this helm, you can use an action to cast the detect thoughts spell (save DC 13) from it. As long as you maintain concentration on the spell, you can use a bonus action to send a telepathic message to a creature you are focused on. It can reply — using a bonus action to do so — while your focus on it continues.\n\nWhile focusing on a creature with detect thoughts, you can use an action to cast the suggestion spell (save DC 13) from the helm on that creature. Once used, the suggestion property can’t be used again until the next dawn.', 0, 1, @headSlotId, 0, 0, 101, @gpId, 0.0, userId, 270),
	('Helm of Teleportation', @magicalItemId, 'This helm has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the teleport spell from it. The helm regains 1d3 expended charges daily at dawn.', 0, 1, @headSlotId, 0, 0, 501, @gpId, 0.0, userId, 271),
	('Horn of Blasting', @magicalItemId, 'You can use an action to speak the horn’s command word and then blow the horn, which emits a thunderous blast in a 30-foot cone that is audible 600 feet away. Each creature in the cone must make a DC 15 Constitution saving throw. On a failed save, a creature takes 5d6 thunder damage and is deafened for 1 minute. On a successful save, a creature takes half as much damage and isn’t deafened. Creatures and objects made of glass or crystal have disadvantage on the saving throw and take 10d6 thunder damage instead of 5d6.\n\nEach use of the horn’s magic has a 20 percent chance of causing the horn to explode. The explosion deals 10d6 fire damage to the blower and destroys the horn.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 272),
	('Horn of Valhalla - Silver', @magicalItemId, 'You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can’t be used again until 7 days have passed.\n\nFour types of horn of Valhalla are known to exist, each made of a different metal. The horn’s type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn’s type or determines it randomly.\n\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you.  If you meet the requirement, they are friendly to you and your companions and follow your commands.\n\nBerserkers Summoned: 2d4 + 2', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 273),
	('Horn of Valhalla - Brass', @magicalItemId, 'You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can’t be used again until 7 days have passed.\n\nFour types of horn of Valhalla are known to exist, each made of a different metal. The horn’s type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn’s type or determines it randomly.\n\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you.  If you meet the requirement, they are friendly to you and your companions and follow your commands.\n\nBerserkers Summoned: 3d4 + 3\nRequirement - Proficiency with all simple weapons', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 274),
	('Horn of Valhalla - Bronze', @magicalItemId, 'You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can’t be used again until 7 days have passed.\n\nFour types of horn of Valhalla are known to exist, each made of a different metal. The horn’s type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn’s type or determines it randomly.\n\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you.  If you meet the requirement, they are friendly to you and your companions and follow your commands.\n\nBerserkers Summoned: 4d4 + 4\nRequirement - Proficiency with all medium armor', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 275),
	('Horn of Valhalla - Iron', @magicalItemId, 'You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can’t be used again until 7 days have passed.\n\nFour types of horn of Valhalla are known to exist, each made of a different metal. The horn’s type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn’s type or determines it randomly.\n\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you.  If you meet the requirement, they are friendly to you and your companions and follow your commands.\n\nBerserkers Summoned: 5d4 + 5\nRequirement - Proficiency with all martial weapons', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 276),
	('Horseshoes of a Zephyr', @magicalItemId, 'These iron horseshoes come in a set of four. While all four shoes are affixed to the hooves of a horse or similar creature, they allow the creature to move normally while floating 4 inches above the ground.  This effect means the creature can cross or stand above nonsolid or unstable surfaces, such as water or lava. The creature leaves no tracks and ignores difficult terrain. In addition, the creature can move at normal speed for up to 12 hours a day without suffering exhaustion from a forced march.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 277),
	('Horseshoes of Speed', @magicalItemId, 'These iron horseshoes come in a set of four. While all four shoes are affixed to the hooves of a horse or similar creature, they increase the creature’s walking speed by 30 feet.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 278),
	('Instant Fortress', @magicalItemId, 'You can use an action to place this 1-inch metal cube on the ground and speak its command word. The cube rapidly grows into a fortress that remains until you use an action to speak the command word that dismisses it, which works only if the fortress is empty.\n\nThe fortress is a square tower, 20 feet on a side and 30 feet high, with arrow slits on all sides and a battlement atop it. Its interior is divided into two floors, with a ladder running along one wall to connect them. The ladder ends at a trapdoor leading to the roof. When activated, the tower has a small door on the side facing you. The door opens only at your command, which you can speak as a bonus action. It is immune to the knock spell and similar magic, such as that of a chime of opening.\n\nEach creature in the area where the fortress appears must make a DC 15 Dexterity saving throw, taking 10d10 bludgeoning damage on a failed save, or half as much damage on a successful one. In either case, the creature is pushed to an unoccupied space outside but next to the fortress. Objects in the area that aren’t being worn or carried take this damage and are pushed automatically.\n\nThe tower is made of adamantine, and its magic prevents it from being tipped over. The roof, the door, and the walls each have 100 hit points, immunity to damage from non-magical weapons excluding siege weapons, and resistance to all other damage. Only a wish spell can repair the fortress (this use of the spell counts as replicating a spell of 8th level or lower). Each casting of wish causes the roof, the door, or one wall to regain 50 hit points.', 0, 0, NULL, 0, 0, 501, @gpId, 0.0, userId, 279),
	('Ioun Stone - Absorption', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nWhile this pale lavender ellipsoid orbits your head, you can use your reaction to cancel a spell of 4th level or lower cast by a creature you can see and targeting only you.\n\nOnce the stone has canceled 20 levels of spells, it burns out and turns dull gray, losing its magic. If you are targeted by a spell whose level is higher than the number of spell levels the stone has left, the stone can’t cancel it.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 280),
	('Ioun Stone - Agility', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYour Dexterity score increases by 2, to a maximum of 20, while this deep red sphere orbits your head.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 281),
	('Ioun Stone - Awareness', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYou can’t be surprised while this dark blue rhomboid orbits your head.', 0, 1, @headSlotId, 0, 0, 501, @gpId, 0.0, userId, 282),
	('Ioun Stone - Fortitude', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYour Constitution score increases by 2, to a maximum of 20, while this pink rhomboid orbits your head.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 283),
	('Ioun Stone - Greater Absorption', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on som worlds.  Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nWhile this marbled lavender and green ellipsoid orbits your head, you can use your reaction to cancel a spell of 8th level or lower cast by a creature you can see and targeting only you.\n\nOnce the stone has canceled 50 levels of spells, it burns out and turns dull gray, losing its magic. If you are targeted by a spell whose level is higher than the number of spell levels the stone has left, the stone can’t cancel it.', 0, 1, @headSlotId, 0, 0, 50001, @gpId, 0.0, userId, 284),
	('Ioun Stone - Insight', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYour Wisdom score increases by 2, to a maximum of 20, while this incandescent blue sphere orbits your head.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 285),
	('Ioun Stone - Intellect', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYour Intelligence score increases by 2, to a maximum of 20, while this marbled scarlet and blue sphere orbits your head.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 286),
	('Ioun Stone - Leadership', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYour Charisma score increases by 2, to a maximum of 20, while this marbled pink and green sphere orbits your head.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 287),
	('Ioun Stone - Mastery', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYour proficiency bonus increases by 1 while this pale green prism orbits your head.', 0, 1, @headSlotId, 0, 0, 50001, @gpId, 0.0, userId, 288),
	('Ioun Stone - Protection', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYou gain a +1 bonus to AC while this dusty rose prism orbits your head.', 0, 1, @headSlotId, 0, 0, 501, @gpId, 0.0, userId, 289),
	('Ioun Stone - Regeneration', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYou regain 15 hit points at the end of each hour this pearly white spindle orbits your head, provided that you have at least 1 hit point.', 0, 1, @headSlotId, 0, 0, 50001, @gpId, 0.0, userId, 290),
	('Ioun Stone - Reserve', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nThis vibrant purple prism stores spells cast into it, holding them until you use them.  The stone can store up to 3 levels worth of spells at a time. When found, it contains 1d4 − 1 levels of stored spells chosen by the GM.\n\nAny creature can cast a spell of 1st through 3rd level into the stone by touching it as the spell is cast.  The spell has no effect, other than to be stored in the stone. If the stone can’t hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses.\n\nWhile this stone orbits your head, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster, but is otherwise treated as if you cast the spell. The spell cast from the stone is no longer stored in it, freeing up space.', 0, 1, @headSlotId, 0, 0, 501, @gpId, 0.0, userId, 291),
	('Ioun Stone - Strength', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYour Strength score increases by 2, to a maximum of 20, while this pale blue rhomboid orbits your head.', 0, 1, @headSlotId, 0, 0, 5001, @gpId, 0.0, userId, 292),
	('Ioun Stone - Sustenance', @magicalItemId, 'An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\n\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\n\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\n\nYou don’t need to eat or drink while this clear spindle orbits your head.', 0, 1, @headSlotId, 0, 0, 501, @gpId, 0.0, userId, 293),
	('Iron Bands of Binding', @magicalItemId, 'This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can use an action to speak the command word and throw the sphere at a Huge or smaller creature you can see within 60 feet of you. As the sphere moves through the air, it opens into a tangle of metal bands.\n\nMake a ranged attack roll with an attack bonus equal to your Dexterity modifier plus your proficiency bonus. On a hit, the target is restrained until you take a bonus action to speak the command word again to release it. Doing so, or missing with the attack, causes the bands to contract and become a sphere once more.\n\nA creature, including the one restrained, can use an action to make a DC 20 Strength check to break the iron bands. On a success, the item is destroyed, and the restrained creature is freed. If the check fails, any further attempts made by that creature automatically fail until 24 hours have elapsed.\n\nOnce the bands are used, they can’t be used again until the next dawn.', 0, 1, @handSlotId, 0, 0, 501, @gpId, 1.0, userId, 294),
	('Iron Flask', @magicalItemId, 'This iron bottle has a brass stopper. You can use an action to speak the flask’s command word, targeting a creature that you can see within 60 feet of you. If the target is native to a plane of existence other than the one you’re on, the target must succeed on a DC 17 Wisdom saving throw or be trapped in the flask.  If the target has been trapped by the flask before, it has advantage on the saving throw. Once trapped, a creature remains in the flask until released. The flask can hold only one creature at a time. A creature trapped in the flask doesn’t need to breathe, eat, or drink and doesn’t age.\n\nYou can use an action to remove the flask’s stopper and release the creature the flask contains.  The creature is friendly to you and your companions for 1 hour and obeys your commands for that duration. If you give no commands or give it a command that is likely to result in its death, it defends itself but otherwise takes no actions. At the end of the duration, the creature acts in accordance with its normal disposition and alignment.\n\nAn identify spell reveals that a creature is inside the flask, but the only way to determine the type of creature is to open the flask. A newly discovered bottle might already contain a creature chosen by the GM or determined randomly,', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 295),
	('Lantern of Revealing', @magicalItemId, 'While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding bright light in a 30-foot radius and dim light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern’s bright light. You can use an action to lower the hood, reducing the light to dim light in a 5- foot radius.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 296),
	('Mantle of Spell Resistance', @magicalItemId, 'You have advantage on saving throws against spells while you wear this cloak.', 0, 1, @backSlotId, 0, 0, 501, @gpId, 0.0, userId, 297),
	('Manual of Bodily Health', @magicalItemId, 'This book contains health and diet tips, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book’s contents and practicing its guidelines, your Constitution score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 298),
	('Manual of Gainful Exercise', @magicalItemId, 'This book describes fitness exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book’s contents and practicing its guidelines, your Strength score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 299),
	('Manual of Golems', @magicalItemId, 'This tome contains information and incantations necessary to make a particular type of golem. The GM chooses the type or determines it randomly. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can’t use a manual of golems and attempts to read it takes 6d6 psychic damage.\n\nTo create a golem, you must spend the time shown on the table, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay the specified cost to purchase supplies.\n\nOnce you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual are sprinkled on it. It is under your control, and it understands and obeys your spoken commands.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 300),
	('Manual of Quickness of Action', @magicalItemId, 'This book contains coordination and balance exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book’s contents and practicing its guidelines, your Dexterity score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 301),
	('Marvelous Pigments', @magicalItemId, 'Typically found in 1d4 pots inside a fine wooden box with a brush (weighing 1 pound in total), these pigments allow you to create three-dimensional objects by painting them in two dimensions. The paint flows from the brush to form the desired object as you concentrate on its image.\n\nEach pot of paint is sufficient to cover 1,000 square feet of a surface, which lets you create inanimate objects or terrain features—such as a door, a pit, flowers, trees, cells, rooms, or weapons— that are up to 10,000 cubic feet. It takes 10 minutes to cover 100 square feet.\n\nWhen you complete the painting, the object or terrain feature depicted becomes a real, non-magical object. Thus, painting a door on a wall creates an actual door that can be opened to whatever is beyond. Painting a pit on a floor creates a real pit, and its depth counts against the total area of objects you create.\n\nNothing created by the pigments can have a value greater than 25 gp. If you paint an object of greater value (such as a diamond or a pile of gold), the object looks authentic, but close inspection reveals it is made from paste, bone, or some other worthless material.\n\nIf you paint a form of energy such as fire or lightning, the energy appears but dissipates as soon as you complete the painting, doing no harm to anything. ', 0, 0, NULL, 0, 0, 5001, @gpId, 1.0, userId, 302),
	('Medallion of Thoughts', @magicalItemId, 'The medallion has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the detect thoughts spell (save DC 13) from it. The medallion regains 1d3 expended charges daily at dawn.', 0, 1, @neckSlotId, 0, 0, 101, @gpId, 0.0, userId, 303),
	('Mirror of Life Trapping', @magicalItemId, 'When this 4-foot-tall mirror is viewed indirectly, its surface shows faint images of creatures. The mirror weighs 50 pounds, and it has AC 11, 10 hit points, and vulnerability to bludgeoning damage. It shatters and is destroyed when reduced to 0 hit points.\n\nIf the mirror is hanging on a vertical surface and you are within 5 feet of it, you can use an action to speak its command word and activate it. It remains activated until you use an action to speak the command word again.\n\nAny creature other than you that sees its reflection in the activated mirror while within 30 feet of it must succeed on a DC 15 Charisma saving throw or be trapped, along with anything it is wearing or carrying, in one of the mirror’s twelve extradimensional cells. This saving throw is made with advantage if the creature knows the mirror’s nature, and constructs succeed on the saving throw automatically.\n\nAn extradimensional cell is an infinite expanse filled with thick fog that reduces visibility to 10 feet.  Creatures trapped in the mirror’s cells don’t age, and they don’t need to eat, drink, or sleep. A creature trapped within a cell can escape using magic that permits planar travel. Otherwise, the creature is confined to the cell until freed.\n\nIf the mirror traps a creature but its twelve extradimensional cells are already occupied, the mirror frees one trapped creature at random to accommodate the new prisoner. A freed creature appears in an unoccupied space within sight of the mirror but facing away from it. If the mirror is shattered, all creatures it contains are freed and appear in unoccupied spaces near it.\n\nWhile within 5 feet of the mirror, you can use an action to speak the name of one creature trapped in it or call out a particular cell by number. The creature named or contained in the named cell appears as an image on the mirror’s surface. You and the creature can then communicate normally.\n\nIn a similar way, you can use an action to speak a second command word and free one creature trapped in the mirror. The freed creature appears, along with its possessions, in the unoccupied space nearest to the mirror and facing away from it.', 0, 0, NULL, 0, 0, 5001, @gpId, 50.0, userId, 304),
	('Necklace of Adaptation', @magicalItemId, 'While wearing this necklace, you can breathe normally in any environment, and you have advantage on saving throws made against harmful gases and vapors (such as cloudkill and stinking cloud effects, inhaled poisons, and the breath weapons of some dragons).', 0, 1, @neckSlotId, 0, 0, 101, @gpId, 0.0, userId, 305),
	('Necklace of Fireballs', @magicalItemId, 'This necklace has 1d6 + 3 beads hanging from it. You can use an action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a 3rd level fireball spell (save DC 15).\n\nYou can hurl multiple beads, or even the whole necklace, as one action. When you do so, increase the level of the fireball by 1 for each bead beyond the first.', 0, 1, @neckSlotId, 0, 0, 501, @gpId, 0.0, userId, 306),
	('Necklace of Prayer Beads', @magicalItemId, 'This necklace has 1d4 + 2 magic beads made from aquamarine, black pearl, or topaz. It also has many non-magical beads made from stones such as amber, bloodstone, citrine, coral, jade, pearl, or quartz. If a magic bead is removed from the necklace, that bead loses its magic.\n\nSix types of magic beads exist. The GM decides the type of each bead on the necklace or determines it randomly. A necklace can have more than one bead of the same type. To use one, you must be wearing the necklace. Each bead contains a spell that you can cast from it as a bonus action (using your spell save DC if a save is necessary). Once a magic bead’s spell is cast, that bead can’t be used again until the next dawn.', 0, 1, @neckSlotId, 0, 0, 501, @gpId, 0.0, userId, 307),
	('Pearl of Power', @magicalItemId, 'While this pearl is on your person, you can use an action to speak its command word and regain one expended spell slot. If the expended slot was of 4th level or higher, the new slot is 3rd level. Once you use the pearl, it canʼt be used again until the next dawn.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 308),
	('Periapt of Health', @magicalItemId, 'You are immune to contracting any disease while you wear this pendant. If you are already infected with a disease, the effects of the disease are suppressed you while you wear the pendant.', 0, 1, @neckSlotId, 0, 0, 101, @gpId, 0.0, userId, 309),
	('Periapt of Proof against Poison', @magicalItemId, 'This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, poisons have no effect on you. You are immune to the poisoned condition and have immunity to poison damage.', 0, 1, @neckSlotId, 0, 0, 501, @gpId, 0.0, userId, 310),
	('Periapt of Wound Closure', @magicalItemId, 'While you wear this pendant, you stabilize whenever you are dying at the start of your turn. In addition, whenever you roll a Hit Die to regain hit points, double the number of hit points it restores.', 0, 1, @neckSlotId, 0, 0, 101, @gpId, 0.0, userId, 311),
	('Pipes of Haunting', @magicalItemId, 'You must be proficient with wind instruments to use these pipes. They have 3 charges. You can use an action to play them and expend 1 charge to create an eerie, spellbinding tune. Each creature within 30 feet of you that hears you play must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute. If you wish, all creatures in the area that aren’t hostile toward you automatically succeed on the saving throw. A creature that fails the saving throw can repeat it at the end of each of its turns, ending the effect on itself on a success. A creature that succeeds on its saving throw is immune to the effect of these pipes for 24 hours. The pipes regain 1d3 expended charges daily at dawn. ', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 312),
	('Pipes of the Sewers', @magicalItemId, 'You must be proficient with wind instruments to use these pipes. While you are attuned to the pipes, ordinary rats and giant rats are indifferent toward you and will not attack you unless you threaten or harm them.\n\nThe pipes have 3 charges. If you play the pipes as an action, you can use a bonus action to expend 1 to 3 charges, calling forth one swarm of rats with each expended charge, provided that enough rats are within half a mile of you to be called in this fashion (as determined by the GM). If there aren’t enough rats to form a swarm, the charge is wasted. Called swarms move toward the music by the shortest available route but aren’t under your control otherwise. The pipes regain 1d3 expended charges daily at dawn.\n\nWhenever a swarm of rats that isn’t under another creature’s control comes within 30 feet of you while you are playing the pipes, you can make a Charisma check contested by the swarm’s Wisdom check. If you lose the contest, the swarm behaves as it normally would and can’t be swayed by the pipes’  music for the next 24 hours. If you win the contest, the swarm is swayed by the pipes’ music and becomes friendly to you and your companions for as long as you continue to play the pipes each round as an action. A friendly swarm obeys your commands. If you issue no commands to a friendly swarm, it defends itself but otherwise takes no actions. If a friendly swarm starts its turn and can’t hear the pipes’ music, your control over that swarm ends, and the swarm behaves as it normally would and can’t be swayed by the pipes’ music for the next 24 hours.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 313),
	('Portable Hole', @magicalItemId, 'This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.\n\nYou can use an action to unfold a portable hole and place it on or against a solid surface, whereupon the portable hole creates an extradimensional hole 10 feet deep. The cylindrical space within the hole exists on a different plane, so it can’t be used to create open passages. Any creature inside an open portable hole can exit the hole by climbing out of it.\n\nYou can use an action to close a portable hole by taking hold of the edges of the cloth and folding it up.  Folding the cloth closes the hole, and any creatures or objects within remain in the extradimensional space. No matter what’s in it, the hole weighs next to nothing.\n\nIf the hole is folded up, a creature within the hole’s extradimensional space can use an action to make a DC 10 Strength check. On a successful check, the creature forces its way out and appears within 5 feet of the portable hole or the creature carrying it. A breathing creature within a closed portable hole can survive for up to 10 minutes, after which time it begins to suffocate.\n\nPlacing a portable hole inside an extradimensional space created by a bag of holding, handy haversack, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can’t be reopened.', 0, 0, NULL, 1, 1, 501, @gpId, 0.0, userId, 314),
	('Restorative Ointment', @magicalItemId, 'This glass jar, 3 inches in diameter, contains 1d4 + 1 doses of a thick mixture that smells faintly of aloe. The jar and its contents weigh 1/2 pound.\n\nAs an action, one dose of the ointment can be swallowed or applied to the skin. The creature that receives it regains 2d8 + 2 hit points, ceases to be poisoned, and is cured of any disease.', 0, 0, NULL, 0, 0, 101, @gpId, 0.5, userId, 315),
	('Robe of Eyes', @magicalItemId, 'This robe is adorned with eyelike patterns. While you wear the robe, you gain the following benefits:\n• The robe lets you see in all directions, and you have advantage on Wisdom (Perception) checks that rely on sight.\n• You have darkvision out to a range of 120 feet.\n• You can see invisible creatures and objects, as well as see into the Ethereal Plane, out to a range of 120 feet.\n\nThe eyes on the robe can’t be closed or averted.  Although you can close or avert your own eyes, you are never considered to be doing so while wearing this robe.\n\nA light spell cast on the robe or a daylight spell cast within 5 feet of the robe causes you to be blinded for 1 minute. At the end of each of your turns, you can make a Constitution saving throw (DC 11 for light or DC 15 for daylight), ending the blindness on a success.', 0, 1, @bodySlotId, 0, 0, 501, @gpId, 0.0, userId, 316),
	('Robe of Scintillating Colors', @magicalItemId, 'This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it, you can use an action and expend 1 charge to cause the garment to display a shifting pattern of dazzling hues until the end of your next turn. During this time, the robe sheds bright light in a 30-foot radius and dim light for an additional 30 feet. Creatures that can see you have disadvantage on attack rolls against you. In addition, any creature in the bright light that can see you when the robe’s power is activated must succeed on a DC 15 Wisdom saving throw or become stunned until the effect ends.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 317),
	('Robe of Stars', @magicalItemId, 'This black or dark blue robe is embroidered with small white or silver stars. You gain a +1 bonus to saving throws while you wear it.\n\nSix stars, located on the robe’s upper front portion, are particularly large. While wearing this robe, you can use an action to pull off one of the stars and use it to cast magic missile as a 5th-level spell. Daily at dusk, 1d6 removed stars reappear on the robe.\n\nWhile you wear the robe, you can use an action to enter the Astral Plane along with everything you are wearing and carrying. You remain there until you use an action to return to the plane you were on. You reappear in the last space you occupied, or if that space is occupied, the nearest unoccupied space.', 0, 1, @bodySlotId, 0, 0, 5001, @gpId, 0.0, userId, 318),
	('Robe of the Archmagi', @magicalItemId, 'This elegant garment is made from exquisite cloth of white, gray, or black and adorned with silvery runes.  The robe’s color corresponds to the alignment for which the item was created. A white robe was made for good, gray for neutral, and black for evil. You can’t attune to a robe of the archmagi that doesn’t correspond to your alignment.\n\nYou gain these benefits while wearing the robe:\n• If you aren’t wearing armor, your base Armor Class is 15 + your Dexterity modifier.\n• You have advantage on saving throws against spells and other magical effects.\n• Your spell save DC and spell attack bonus each increase by 2.', 0, 1, @bodySlotId, 0, 0, 50001, @gpId, 0.0, userId, 319),
	('Robe of Useful Items', @magicalItemId, 'This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can use an action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment.\n\nThe robe has two of each of the following patches:\n• Dagger\n• Bullseye lantern (filled and lit)\n• Steel mirror\n• 10-foot pole\n• Hempen rope (50 feet, coiled)\n• Sack\n\nIn addition, the robe has 4d4 other patches. The GM chooses the patches or determines them randomly.', 0, 1, @bodySlotId, 0, 0, 101, @gpId, 0.0, userId, 320),
	('Rope of Climbing', @magicalItemId, 'This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. If you hold one end of the rope and use an action to speak the command word, the rope animates. As a bonus action, you can command the other end to move toward a destination you choose. That end moves 10 feet on your turn when you first command it and 10 feet on each of your turns until reaching the destination, up to its maximum length away, or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to know or unknot itself, or to coil itself for carrying.\n\nIf you tell the rope to knot, large knots appear at 1-foot intervals along the rope. While knotted the rope shortens to a 50-foot length and grants advantage on checks made to climb it.\n\nThe rope has AC 20 and 20 hit points. It regains 1 hit point every 5 minutes as long as it has at least 1 hit point. If the rope drops to 0 hit points, it is destroyed.', 0, 0, NULL, 0, 0, 101, @gpId, 3.0, userId, 321),
	('Rope of Entanglement', @magicalItemId, 'This rope is 30 feet long and weighs 3 pounds. If you hold one end of the rope and use an action to speak its command word, the other end darts forward to entangle a creature you can see within 20 feet of you.  The target must succeed on a DC 15 Dexterity saving throw or become restrained.\n\nYou can release the creature by using a bonus action to speak a second command word. A target restrained by the rope can use an action to make a DC 15 Strength or Dexterity check (target’s choice).  On a success, the creature is no longer restrained by the rope.\n\nThe rope has AC 20 and 20 hit points. It regains 1 hit point every 5 minutes as long as it has at least 1 hit point. If the rope drops to 0 hit points, it is destroyed.', 0, 0, NULL, 0, 0, 501, @gpId, 3.0, userId, 322),
	('Scarab of Protection', @magicalItemId, 'If you hold this beetle-shaped medallion in your hand for 1 round, an inscription appears on its surface revealing its magical nature. It provides two benefits while it is on your person:\n• You have advantage on saving throws against spells.\n• The scarab has 12 charges. If you fail a saving throw against a necromancy spell or a harmful effect originating from an undead creature, you can use your reaction to expend 1 charge and turn the failed save into a successful one. The scarab crumbles into powder and is destroyed when its last charge is expended.', 0, 1, @neckSlotId, 0, 0, 50001, @gpId, 0.0, userId, 323),
	('Slippers of Spider Climbing', @magicalItemId, 'While you wear these light shoes, you can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free. You have a climbing speed equal to your walking speed. However, the slippers don’t allow you to move this way on a slippery surface, such as one covered by ice or oil.', 0, 1, @feetSlotId, 0, 0, 101, @gpId, 0.0, userId, 324),
	('Soverign Glue', @magicalItemId, 'This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It must be stored in a jar or flask that has been coated inside with oil of slipperiness. When found, a container contains 1d6 + 1 ounces.\n\nOne ounce of the glue can cover a 1-foot square surface. The glue takes 1 minute to set. Once it has done so, the bond it creates can be broken only by the application of universal solvent or oil of etherealness, or with a wish spell.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 325),
	('Sphere of Annihilation', @magicalItemId, 'This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it.\n\nThe sphere obliterates all matter it passes through and all matter that passes through it. Artifacts are the exception. Unless an artifact is susceptible to damage from a sphere of annihilation, it passes through the sphere unscathed. Anything else that touches the sphere but isn’t wholly engulfed and obliterated by it takes 4d10 force damage.\n\nThe sphere is stationary until someone controls it. If you are within 60 feet of an uncontrolled sphere, you can use an action to make a DC 25 Intelligence (Arcana) check. On a success, the sphere levitates in one direction of your choice, up to a number of feet equal to 5 × your Intelligence modifier (minimum 5 feet). On a failure, the sphere moves 10 feet toward you. A creature whose space the sphere enters must succeed on a DC 13 Dexterity saving throw or be touched by it, taking 4d10 force damage.\n\nIf you attempt to control a sphere that is under another creature’s control, you make an Intelligence (Arcana) check contested by the other creature’s Intelligence (Arcana) check. The winner of the contest gains control of the sphere and can levitate it as normal.\n\nIf the sphere comes into contact with a planar portal, such as that created by the gate spell, or an extradimensional space, such as that within a portable hole, the GM determines randomly what happens, using the following table.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 326),
	('Stone of Controlling Earth Elementals', @magicalItemId, 'If the stone is touching the ground, you can use an action to speak its command word and summon an earth elemental, as if you had cast the conjure elemental spell. The stone can’t be used this way again until the next dawn. The stone weighs 5 pounds.', 0, 0, NULL, 0, 0, 501, @gpId, 5.0, userId, 327),
	('Stone of Good Luck (Luckstone)', @magicalItemId, 'While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws.', 0, 0, NULL, 0, 0, 101, @gpId, 0.0, userId, 328),
	('Talisman of Pure Good', @magicalItemId, 'This talisman is a mighty symbol of goodness. A creature that is neither good nor evil in alignment takes 6d6 radiant damage upon touching the talisman. An evil creature takes 8d6 radiant damage upon touching the talisman. Either sort of creature takes the damage again each time it ends its turn holding or carrying the talisman.\n\nIf you are a good cleric or paladin, you can use the talisman as a holy symbol, and you gain a +2 bonus to spell attack rolls while you wear or hold it.\n\nThe talisman has 7 charges. If you are wearing or holding it, you can use an action to expend 1 charge from it and choose one creature you can see on the ground within 120 feet of you. If the target is of evil alignment, a flaming fissure opens under it. The target must succeed on a DC 20 Dexterity saving throw or fall into the fissure and be destroyed, leaving no remains. The fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman disperses into motes of golden light and is destroyed.', 0, 1, @neckSlotId, 0, 0, 50001, @gpId, 0.0, userId, 329),
	('Talisman of the Sphere', @magicalItemId, 'When you make an Intelligence (Arcana) check to control a sphere of annihilation while you are holding this talisman, you double your proficiency bonus on the check. In addition, when you start your turn with control over a sphere of annihilation, you can use an action to levitate it 10 feet plus a number of additional feet equal to 10 × your Intelligence modifier.', 0, 1, @neckSlotId, 0, 0, 50001, @gpId, 0.0, userId, 330),
	('Talisman of Ultimate Evil', @magicalItemId, 'This item symbolizes unrepentant evil. A creature that is neither good nor evil in alignment takes 6d6 necrotic damage upon touching the talisman. A good creature takes 8d6 necrotic damage upon touching the talisman. Either sort of creature takes the damage again each time it ends its turn holding or carrying the talisman.\n\nIf you are an evil cleric or paladin, you can use the talisman as a holy symbol, and you gain a +2 bonus to spell attack rolls while you wear or hold it.\n\nThe talisman has 6 charges. If you are wearing or holding it, you can use an action to expend 1 charge from the talisman and choose one creature you can see on the ground within 120 feet of you. If the target is of good alignment, a flaming fissure opens under it. The target must succeed on a DC 20 Dexterity saving throw or fall into the fissure and be destroyed, leaving no remains. The fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman dissolves into foul-smelling slime and is destroyed.', 0, 1, @neckSlotId, 0, 0, 50001, @gpId, 0.0, userId, 331),
	('Tome of Clear Thought', @magicalItemId, 'This book contains memory and logic exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book’s contents and practicing its guidelines, your Intelligence score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 332),
	('Tome of Leadership and Influence', @magicalItemId, 'This book contains guidelines for influencing and charming others, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book’s contents and practicing its guidelines, your Charisma score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 333),
	('Tome of Understanding', @magicalItemId, 'This book contains intuition and insight exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book’s contents and practicing its guidelines, your Wisdom score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century', 0, 0, NULL, 0, 0, 5001, @gpId, 0.0, userId, 334),
	('Universal Solvent', @magicalItemId, 'This tube holds milky liquid with a strong alcohol smell. You can use an action to pour the contents of the tube onto a surface within reach. The liquid instantly dissolves up to 1 square foot of adhesive it touches, including sovereign glue.', 1, 0, NULL, 0, 0, 25000, @gpId, 0.0, userId, 335),
	('Well of Many Worlds', @magicalItemId, 'This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.\n\nYou can use an action to unfold and place the well of many worlds on a solid surface, whereupon it creates a two-way portal to another world or plane of existence. Each time the item opens a portal, the GM decides where it leads. You can use an action to close an open portal by taking hold of the edges of the cloth and folding it up. Once well of many worlds has opened a portal, it can’t do so again for 1d8 hours.', 0, 0, NULL, 0, 0, 50001, @gpId, 0.0, userId, 336),
	('Wind Fan', @magicalItemId, 'While holding this fan, you can use an action to cast the gust of wind spell (save DC 13) from it. Once used, the fan shouldn’t be used again until the next dawn.  Each time it is used again before then, it has a cumulative 20 percent chance of not working and tearing into useless, non-magical tatters.', 0, 1, @handSlotId, 0, 0, 101, @gpId, 0.0, userId, 337),
	('Winged Boots', @magicalItemId, 'While you wear these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours, all at once or in several shorter flights, each one using a minimum of 1 minute from the duration. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land.\n\nThe boots regain 2 hours of flying capability for every 12 hours they aren’t in use.', 0, 1, @feetSlotId, 0, 0, 101, @gpId, 0.0, userId, 338),
	('Wings of Flying', @magicalItemId, 'While wearing this cloak, you can use an action to speak its command word. This turns the cloak into a pair of bat wings or bird wings on your back for 1 hour or until you repeat the command word as an action. The wings give you a flying speed of 60 feet. When they disappear, you can’t use them again for 1d12 hours.', 0, 1, @backSlotId, 0, 0, 501, @gpId, 0.0, userId, 339);

	SET @AdamantineArmorId = (SELECT id FROM items WHERE name = 'Adamantine Armor' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @AnimatedShieldId = (SELECT id FROM items WHERE name = 'Animated Shield' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus1ArmorId = (SELECT id FROM items WHERE name = '+1 Armor' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus2ArmorId = (SELECT id FROM items WHERE name = '+2 Armor' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus3ArmorId = (SELECT id FROM items WHERE name = '+3 Armor' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfInvulnerabilityId = (SELECT id FROM items WHERE name = 'Armor of Invulnerability' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceAcidId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Acid' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceColdId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Cold' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceFireId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Fire' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceForceId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Force' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceLightningId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Lightning' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceNecroticId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Necrotic' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistancePoisonId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Poison' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistancePsychicId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Psychic' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceRadiantId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Radiant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfResistanceThunderId = (SELECT id FROM items WHERE name = 'Armor of Resistance - Thunder' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArmorOfVulnerabilityId = (SELECT id FROM items WHERE name = 'Armor of Vulnerability' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArrowCatchingShieldId = (SELECT id FROM items WHERE name = 'Arrow-Catching Shield' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DemonArmorId = (SELECT id FROM items WHERE name = 'Demon Armor' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailBlackAcidId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Black (Acid)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailBlueLightningId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Blue (Lightning)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailBrassFireId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Brass (Fire)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailBronzeLightningId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Bronze (Lightning)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailCopperAcidId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Copper (Acid)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailGoldFireId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Gold (Fire)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailGreenPoisonId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Green (Poison)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailRedFireId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Red (Fire)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailSilverColdId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - Silver (Cold)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonScaleMailWhiteColdId = (SELECT id FROM items WHERE name = 'Dragon Scale Mail - White (Cold)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DwarvenPlateId = (SELECT id FROM items WHERE name = 'Dwarven Plate' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ElvenChainId = (SELECT id FROM items WHERE name = 'Elven Chain' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GlamouredStuddedLeatherId = (SELECT id FROM items WHERE name = 'Glamoured Studded Leather' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MithralArmorId = (SELECT id FROM items WHERE name = 'Mithral Armor' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PlateArmorOfEtherealnessId = (SELECT id FROM items WHERE name = 'Plate Armor of Etherealness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus1ShieldId = (SELECT id FROM items WHERE name = '+1 Shield' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus2ShieldId = (SELECT id FROM items WHERE name = '+2 Shield' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus3ShieldId = (SELECT id FROM items WHERE name = '+3 Shield' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ShieldOfMissileAttractionId = (SELECT id FROM items WHERE name = 'Shield of Missile Attraction' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SpellguardShieldId = (SELECT id FROM items WHERE name = 'Spellguard Shield' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @OilOfEtherealnessId = (SELECT id FROM items WHERE name = 'Oil of Etherealness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @OilOfSharpnessId = (SELECT id FROM items WHERE name = 'Oil of Sharpness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @OilOfSlipperinessId = (SELECT id FROM items WHERE name = 'Oil of Slipperiness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PhilterOfLoveId = (SELECT id FROM items WHERE name = 'Philter of Love' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfAnimalFriendshipId = (SELECT id FROM items WHERE name = 'Potion of Animal Friendship' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfClairvoyanceId = (SELECT id FROM items WHERE name = 'Potion of Clairvoyance' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfClimbingId = (SELECT id FROM items WHERE name = 'Potion of Climbing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfDiminutionId = (SELECT id FROM items WHERE name = 'Potion of Diminution' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfFlyingId = (SELECT id FROM items WHERE name = 'Potion of Flying' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGaseousFormId = (SELECT id FROM items WHERE name = 'Potion of Gaseous Form' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGiantStrengthHillGiantId = (SELECT id FROM items WHERE name = 'Potion of Giant Strength - Hill Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGiantStrengthFrostGiantId = (SELECT id FROM items WHERE name = 'Potion of Giant Strength - Frost Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGiantStrengthStoneGiantId = (SELECT id FROM items WHERE name = 'Potion of Giant Strength - Stone Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGiantStrengthFireGiantId = (SELECT id FROM items WHERE name = 'Potion of Giant Strength - Fire Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGiantStrengthCloudGiantId = (SELECT id FROM items WHERE name = 'Potion of Giant Strength - Cloud Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGiantStrengthStormGiantId = (SELECT id FROM items WHERE name = 'Potion of Giant Strength - Storm Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGrowthId = (SELECT id FROM items WHERE name = 'Potion of Growth' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfHealingId = (SELECT id FROM items WHERE name = 'Potion of Healing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfGreaterHealingId = (SELECT id FROM items WHERE name = 'Potion of Greater Healing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfSuperiorHealingId = (SELECT id FROM items WHERE name = 'Potion of Superior Healing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfSupremeHealingId = (SELECT id FROM items WHERE name = 'Potion of Supreme Healing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfHeroismId = (SELECT id FROM items WHERE name = 'Potion of Heroism' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfInvisibilityId = (SELECT id FROM items WHERE name = 'Potion of Invisibility' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfMindReadingId = (SELECT id FROM items WHERE name = 'Potion of Mind Reading' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfPoisonId = (SELECT id FROM items WHERE name = 'Potion of Poison' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceAcidId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Acid' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceColdId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Cold' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceFireId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Fire' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceForceId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Force' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceLightningId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Lightning' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceNecroticId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Necrotic' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistancePoisonId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Poison' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistancePsychicId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Psychic' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceRadiantId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Radiant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfResistanceThunderId = (SELECT id FROM items WHERE name = 'Potion of Resistance - Thunder' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfSpeedId = (SELECT id FROM items WHERE name = 'Potion of Speed' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PotionOfWaterBreathingId = (SELECT id FROM items WHERE name = 'Potion of Water Breathing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfAnimalInfluenceId = (SELECT id FROM items WHERE name = 'Ring of Animal Influence' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfDjinniSummoningId = (SELECT id FROM items WHERE name = 'Ring of Djinni Summoning' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfAirElementalCommandId = (SELECT id FROM items WHERE name = 'Ring of Air Elemental Command' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfEarthElementalCommandId = (SELECT id FROM items WHERE name = 'Ring of Earth Elemental Command' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfFireElementalCommandId = (SELECT id FROM items WHERE name = 'Ring of Fire Elemental Command' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfWaterElementalCommandId = (SELECT id FROM items WHERE name = 'Ring of Water Elemental Command' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfEvasionId = (SELECT id FROM items WHERE name = 'Ring of Evasion' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfFeatherFallingId = (SELECT id FROM items WHERE name = 'Ring of Feather Falling' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfFreeActionId = (SELECT id FROM items WHERE name = 'Ring of Free Action' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfInvisibilityId = (SELECT id FROM items WHERE name = 'Ring of Invisibility' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfJumpingId = (SELECT id FROM items WHERE name = 'Ring of Jumping' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfMindShieldingId = (SELECT id FROM items WHERE name = 'Ring of Mind Shielding' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfProtectionId = (SELECT id FROM items WHERE name = 'Ring of Protection' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfRegenerationId = (SELECT id FROM items WHERE name = 'Ring of Regeneration' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceAcidPearlId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Acid (Pearl)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceColdTourmalineId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Cold (Tourmaline)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceFireGarnetId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Fire (Garnet)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceForceSapphireId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Force (Sapphire)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceLightningCitrineId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Lightning (Citrine)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceNecroticJetId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Necrotic (Jet)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistancePoisonAmethystId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Poison (Amethyst)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistancePsychicJadeId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Psychic (Jade)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceRadiantTopazId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Radiant (Topaz)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfResistanceThunderSpinelId = (SELECT id FROM items WHERE name = 'Ring of Resistance - Thunder (Spinel)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfShootingStarsId = (SELECT id FROM items WHERE name = 'Ring of Shooting Stars' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfSpellStoringId = (SELECT id FROM items WHERE name = 'Ring of Spell Storing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfSpellTurningId = (SELECT id FROM items WHERE name = 'Ring of Spell Turning' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfSwimmingId = (SELECT id FROM items WHERE name = 'Ring of Swimming' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfTelekinesisId = (SELECT id FROM items WHERE name = 'Ring of Telekinesis' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfTheRamId = (SELECT id FROM items WHERE name = 'Ring of the Ram' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfThreeWishesId = (SELECT id FROM items WHERE name = 'Ring of Three Wishes' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfWarmthId = (SELECT id FROM items WHERE name = 'Ring of Warmth' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfWaterWalkingId = (SELECT id FROM items WHERE name = 'Ring of Water Walking' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RingOfXrayVisionId = (SELECT id FROM items WHERE name = 'Ring of X-ray Vision' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ImmovableRodId = (SELECT id FROM items WHERE name = 'Immovable Rod' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RodOfAbsorptionId = (SELECT id FROM items WHERE name = 'Rod of Absorption' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RodOfAlertnessId = (SELECT id FROM items WHERE name = 'Rod of Alertness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RodOfLordlyMightId = (SELECT id FROM items WHERE name = 'Rod of Lordly Might' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RodOfRulershipId = (SELECT id FROM items WHERE name = 'Rod of Rulership' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RodOfSecurityId = (SELECT id FROM items WHERE name = 'Rod of Security' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SpellScrollId = (SELECT id FROM items WHERE name = 'Spell Scroll' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfCharmingId = (SELECT id FROM items WHERE name = 'Staff of Charming' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfFireId = (SELECT id FROM items WHERE name = 'Staff of Fire' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfFrostId = (SELECT id FROM items WHERE name = 'Staff of Frost' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfHealingId = (SELECT id FROM items WHERE name = 'Staff of Healing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfPowerId = (SELECT id FROM items WHERE name = 'Staff of Power' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfStrikingId = (SELECT id FROM items WHERE name = 'Staff of Striking' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfSwarmingInsectsId = (SELECT id FROM items WHERE name = 'Staff of Swarming Insects' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfTheMagiId = (SELECT id FROM items WHERE name = 'Staff of the Magi' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfThePythonId = (SELECT id FROM items WHERE name = 'Staff of the Python' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfTheWoodlandsId = (SELECT id FROM items WHERE name = 'Staff of the Woodlands' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfThunderAndLightningId = (SELECT id FROM items WHERE name = 'Staff of Thunder and Lightning' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StaffOfWitheringId = (SELECT id FROM items WHERE name = 'Staff of Withering' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfBindingId = (SELECT id FROM items WHERE name = 'Wand of Binding' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfEnemyDetectionId = (SELECT id FROM items WHERE name = 'Wand of Enemy Detection' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfFearId = (SELECT id FROM items WHERE name = 'Wand of Fear' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfFireballsId = (SELECT id FROM items WHERE name = 'Wand of Fireballs' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfLightningBoltsId = (SELECT id FROM items WHERE name = 'Wand of Lightning Bolts' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfMagicDetectionId = (SELECT id FROM items WHERE name = 'Wand of Magic Detection' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfMagicMissilesId = (SELECT id FROM items WHERE name = 'Wand of Magic Missiles' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfParalysisId = (SELECT id FROM items WHERE name = 'Wand of Paralysis' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfPolymorphId = (SELECT id FROM items WHERE name = 'Wand of Polymorph' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfSecretsId = (SELECT id FROM items WHERE name = 'Wand of Secrets' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus1WandOfTheWarMageId = (SELECT id FROM items WHERE name = '+1 Wand of the War Mage' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus2WandOfTheWarMageId = (SELECT id FROM items WHERE name = '+2 Wand of the War Mage' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus3WandOfTheWarMageId = (SELECT id FROM items WHERE name = '+3 Wand of the War Mage' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfWebId = (SELECT id FROM items WHERE name = 'Wand of Web' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WandOfWonderId = (SELECT id FROM items WHERE name = 'Wand of Wonder' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus1AmmunitionId = (SELECT id FROM items WHERE name = '+1 Ammunition' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus2AmmunitionId = (SELECT id FROM items WHERE name = '+2 Ammunition' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus3AmmunitionId = (SELECT id FROM items WHERE name = '+3 Ammunition' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ArrowOfSlayingId = (SELECT id FROM items WHERE name = 'Arrow of Slaying' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BerserkerAxeId = (SELECT id FROM items WHERE name = 'Berserker Axe' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DaggerOfVenomId = (SELECT id FROM items WHERE name = 'Dagger of Venom' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DancingSwordId = (SELECT id FROM items WHERE name = 'Dancing Sword' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DefenderId = (SELECT id FROM items WHERE name = 'Defender' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DragonSlayerId = (SELECT id FROM items WHERE name = 'Dragon Slayer' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DwarvenThrowerId = (SELECT id FROM items WHERE name = 'Dwarven Thrower' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FlameTongueId = (SELECT id FROM items WHERE name = 'Flame Tongue' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FrostBrandId = (SELECT id FROM items WHERE name = 'Frost Brand' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GiantSlayerId = (SELECT id FROM items WHERE name = 'Giant Slayer' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HammerOfThunderboltsId = (SELECT id FROM items WHERE name = 'Hammer of Thunderbolts' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HolyAvengerId = (SELECT id FROM items WHERE name = 'Holy Avenger' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @JavelinOfLightningId = (SELECT id FROM items WHERE name = 'Javelin of Lightning' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @LuckBladeId = (SELECT id FROM items WHERE name = 'Luck Blade' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MaceOfDisruptionId = (SELECT id FROM items WHERE name = 'Mace of Disruption' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MaceOfSmitingId = (SELECT id FROM items WHERE name = 'Mace of Smiting' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MaceOfTerrorId = (SELECT id FROM items WHERE name = 'Mace of Terror' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @NineLivesStealerId = (SELECT id FROM items WHERE name = 'Nine Lives Stealer' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @OathbowId = (SELECT id FROM items WHERE name = 'Oathbow' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ScimitarOfSpeedId = (SELECT id FROM items WHERE name = 'Scimitar of Speed' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SunBladeId = (SELECT id FROM items WHERE name = 'Sun Blade' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SwordOfLifeStealingId = (SELECT id FROM items WHERE name = 'Sword of Life Stealing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SwordOfSharpnessId = (SELECT id FROM items WHERE name = 'Sword of Sharpness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SwordOfWoundingId = (SELECT id FROM items WHERE name = 'Sword of Wounding' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @TridentOfFishCommandId = (SELECT id FROM items WHERE name = 'Trident of Fish Command' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ViciousWeaponId = (SELECT id FROM items WHERE name = 'Vicious Weapon' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus1WeaponId = (SELECT id FROM items WHERE name = '+1 Weapon' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus2WeaponId = (SELECT id FROM items WHERE name = '+2 Weapon' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @Plus3WeaponId = (SELECT id FROM items WHERE name = '+3 Weapon' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @VopalSwordId = (SELECT id FROM items WHERE name = 'Vopal Sword' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @AmuletOfHealthId = (SELECT id FROM items WHERE name = 'Amulet of Health' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @AmuletOfProofAgainstDetectionAndLocationId = (SELECT id FROM items WHERE name = 'Amulet of Proof against Detection and Location' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @AmuletOfThePlanesId = (SELECT id FROM items WHERE name = 'Amulet of the Planes' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ApparatusOfTheCrabId = (SELECT id FROM items WHERE name = 'Apparatus of the Crab' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BagOfBeansId = (SELECT id FROM items WHERE name = 'Bag of Beans' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BagOfDevouringId = (SELECT id FROM items WHERE name = 'Bag of Devouring' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BagOfHoldingId = (SELECT id FROM items WHERE name = 'Bag of Holding' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BagOfTricksGrayId = (SELECT id FROM items WHERE name = 'Bag of Tricks - Gray' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BagOfTricksRustId = (SELECT id FROM items WHERE name = 'Bag of Tricks - Rust' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BagOfTricksTanId = (SELECT id FROM items WHERE name = 'Bag of Tricks - Tan' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeadOfForceId = (SELECT id FROM items WHERE name = 'Bead of Force' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeltOfDwarvenkindId = (SELECT id FROM items WHERE name = 'Belt of Dwarvenkind' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeltOfGiantStrengthHillGiantId = (SELECT id FROM items WHERE name = 'Belt of Giant Strength - Hill Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeltOfGiantStrengthStoneGiantId = (SELECT id FROM items WHERE name = 'Belt of Giant Strength - Stone Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeltOfGiantStrengthFrostGiantId = (SELECT id FROM items WHERE name = 'Belt of Giant Strength - Frost Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeltOfGiantStrengthFireGiantId = (SELECT id FROM items WHERE name = 'Belt of Giant Strength - Fire Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeltOfGiantStrengthCloudGiantId = (SELECT id FROM items WHERE name = 'Belt of Giant Strength - Cloud Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BeltOfGiantStrengthStormGiantId = (SELECT id FROM items WHERE name = 'Belt of Giant Strength - Storm Giant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BootsOfElvenkindId = (SELECT id FROM items WHERE name = 'Boots of Elvenkind' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BootsOfLevitationId = (SELECT id FROM items WHERE name = 'Boots of Levitation' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BootsOfSpeedId = (SELECT id FROM items WHERE name = 'Boots of Speed' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BootsOfStridingAndSpringingId = (SELECT id FROM items WHERE name = 'Boots of Striding and Springing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BootsOfTheWinterlandsId = (SELECT id FROM items WHERE name = 'Boots of the Winterlands' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BowlOfCommandWaterElementalsId = (SELECT id FROM items WHERE name = 'Bowl of Command Water Elementals' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BracersOfArcheryId = (SELECT id FROM items WHERE name = 'Bracers of Archery' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BracersOfDefenseId = (SELECT id FROM items WHERE name = 'Bracers of Defense' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BrazierOfCommandingFireElementalsId = (SELECT id FROM items WHERE name = 'Brazier of Commanding Fire Elementals' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BroochOfShieldingId = (SELECT id FROM items WHERE name = 'Brooch of Shielding' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @BroomOfFlyingId = (SELECT id FROM items WHERE name = 'Broom of Flying' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CandleOfInvocationId = (SELECT id FROM items WHERE name = 'Candle of Invocation' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CapeOfTheMountebankId = (SELECT id FROM items WHERE name = 'Cape of the Mountebank' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CarpetOfFlyingSmallId = (SELECT id FROM items WHERE name = 'Carpet of Flying - Small' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CarpetOfFlyingMediumId = (SELECT id FROM items WHERE name = 'Carpet of Flying - Medium' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CarpetOfFlyingLargeId = (SELECT id FROM items WHERE name = 'Carpet of Flying - Large' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CarpetOfFlyingExtraLargeId = (SELECT id FROM items WHERE name = 'Carpet of Flying - Extra Large' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CenserOfControllingAirElementalsId = (SELECT id FROM items WHERE name = 'Censer of Controlling Air Elementals' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ChimeOfOpeningId = (SELECT id FROM items WHERE name = 'Chime of Opening' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CircletOfBlastingId = (SELECT id FROM items WHERE name = 'Circlet of Blasting' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CloakOfArachnidaId = (SELECT id FROM items WHERE name = 'Cloak of Arachnida' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CloakOfDisplacementId = (SELECT id FROM items WHERE name = 'Cloak of Displacement' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CloakOfElvenkindId = (SELECT id FROM items WHERE name = 'Cloak of Elvenkind' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CloakOfProtectionId = (SELECT id FROM items WHERE name = 'Cloak of Protection' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CloakOfTheBatId = (SELECT id FROM items WHERE name = 'Cloak of the Bat' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CloakOfTheMantaRayId = (SELECT id FROM items WHERE name = 'Cloak of the Manta Ray' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CrystalBallId = (SELECT id FROM items WHERE name = 'Crystal Ball' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CrystalBallOfMindReadingId = (SELECT id FROM items WHERE name = 'Crystal Ball of Mind Reading' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CrystalBallOfTelepathyId = (SELECT id FROM items WHERE name = 'Crystal Ball of Telepathy' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CrystalBallOfTrueSeeingId = (SELECT id FROM items WHERE name = 'Crystal Ball of True Seeing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CubeOfForceId = (SELECT id FROM items WHERE name = 'Cube of Force' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @CubicGateId = (SELECT id FROM items WHERE name = 'Cubic Gate' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DecanterOfEndlessWaterId = (SELECT id FROM items WHERE name = 'Decanter of Endless Water' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DeckOfIllusionsId = (SELECT id FROM items WHERE name = 'Deck of Illusions' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DeckOfManyThingsId = (SELECT id FROM items WHERE name = 'Deck of Many Things' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DimensionalShacklesId = (SELECT id FROM items WHERE name = 'Dimensional Shackles' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DustOfDisappearanceId = (SELECT id FROM items WHERE name = 'Dust of Disappearance' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DustOfDrynessId = (SELECT id FROM items WHERE name = 'Dust of Dryness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @DustOfSneezingAndChokingId = (SELECT id FROM items WHERE name = 'Dust of Sneezing and Choking' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @EfficientQuiverId = (SELECT id FROM items WHERE name = 'Efficient Quiver' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @EfreetiBottleId = (SELECT id FROM items WHERE name = 'Efreeti Bottle' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ElementalGemBlueSapphireId = (SELECT id FROM items WHERE name = 'Elemental Gem - Blue Sapphire' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ElementalGemYellowDiamondId = (SELECT id FROM items WHERE name = 'Elemental Gem - Yellow Diamond' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ElementalGemRedCorundumId = (SELECT id FROM items WHERE name = 'Elemental Gem - Red Corundum' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ElementalGemEmeraldId = (SELECT id FROM items WHERE name = 'Elemental Gem - Emerald' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @EversmokingBottleId = (SELECT id FROM items WHERE name = 'Eversmoking Bottle' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @EyesOfCharmingId = (SELECT id FROM items WHERE name = 'Eyes of Charming' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @EyesOfMinuteSeeingId = (SELECT id FROM items WHERE name = 'Eyes of Minute Seeing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @EyesOfTheEagleId = (SELECT id FROM items WHERE name = 'Eyes of the Eagle' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FeatherTokenAnchorId = (SELECT id FROM items WHERE name = 'Feather Token - Anchor' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FeatherTokenBirdId = (SELECT id FROM items WHERE name = 'Feather Token - Bird' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FeatherTokenFanId = (SELECT id FROM items WHERE name = 'Feather Token - Fan' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FeatherTokenSwanBoatId = (SELECT id FROM items WHERE name = 'Feather Token - Swan Boat' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FeatherTokenTreeId = (SELECT id FROM items WHERE name = 'Feather Token - Tree' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FeatherTokenWhipId = (SELECT id FROM items WHERE name = 'Feather Token - Whip' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerBronzeGriffonId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Bronze Griffon' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerEbonyFlyId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Ebony Fly' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerGoldenLionsId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Golden Lions' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerIvoryGoatsId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Ivory Goats' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerMarbleElephantId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Marble Elephant' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerObsidianSteedId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Obsidian Steed' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerOnyxDogId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Onyx Dog' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerSerpentineOwlId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Serpentine Owl' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FigurineOfWondrousPowerSilverRavenId = (SELECT id FROM items WHERE name = 'Figurine of Wondrous Power - Silver Raven' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @FoldingBoatId = (SELECT id FROM items WHERE name = 'Folding Boat' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GauntletsOfOgrePowerId = (SELECT id FROM items WHERE name = 'Gauntlets of Ogre Power' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GemOfBrightnessId = (SELECT id FROM items WHERE name = 'Gem of Brightness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GemOfSeeingId = (SELECT id FROM items WHERE name = 'Gem of Seeing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GlovesOfMissileSnaringId = (SELECT id FROM items WHERE name = 'Gloves of Missile Snaring' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GlovesOfSwimmingAndClimbingId = (SELECT id FROM items WHERE name = 'Gloves of Swimming and Climbing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @GogglesOfNightId = (SELECT id FROM items WHERE name = 'Goggles of Night' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HandyHaversackId = (SELECT id FROM items WHERE name = 'Handy Haversack' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HatOfDisguiseId = (SELECT id FROM items WHERE name = 'Hat of Disguise' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HeadbandOfIntellectId = (SELECT id FROM items WHERE name = 'Headband of Intellect' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HelmOfBrillianceId = (SELECT id FROM items WHERE name = 'Helm of Brilliance' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HelmOfComprehendingLanguagesId = (SELECT id FROM items WHERE name = 'Helm of Comprehending Languages' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HelmOfTelepathyId = (SELECT id FROM items WHERE name = 'Helm of Telepathy' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HelmOfTeleportationId = (SELECT id FROM items WHERE name = 'Helm of Teleportation' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HornOfBlastingId = (SELECT id FROM items WHERE name = 'Horn of Blasting' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HornOfValhallaSilverId = (SELECT id FROM items WHERE name = 'Horn of Valhalla - Silver' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HornOfValhallaBrassId = (SELECT id FROM items WHERE name = 'Horn of Valhalla - Brass' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HornOfValhallaBronzeId = (SELECT id FROM items WHERE name = 'Horn of Valhalla - Bronze' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HornOfValhallaIronId = (SELECT id FROM items WHERE name = 'Horn of Valhalla - Iron' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HorseshoesOfAZephyrId = (SELECT id FROM items WHERE name = 'Horseshoes of a Zephyr' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @HorseshoesOfSpeedId = (SELECT id FROM items WHERE name = 'Horseshoes of Speed' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @InstantFortressId = (SELECT id FROM items WHERE name = 'Instant Fortress' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneAbsorptionId = (SELECT id FROM items WHERE name = 'Ioun Stone - Absorption' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneAgilityId = (SELECT id FROM items WHERE name = 'Ioun Stone - Agility' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneAwarenessId = (SELECT id FROM items WHERE name = 'Ioun Stone - Awareness' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneFortitudeId = (SELECT id FROM items WHERE name = 'Ioun Stone - Fortitude' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneGreaterAbsorptionId = (SELECT id FROM items WHERE name = 'Ioun Stone - Greater Absorption' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneInsightId = (SELECT id FROM items WHERE name = 'Ioun Stone - Insight' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneIntellectId = (SELECT id FROM items WHERE name = 'Ioun Stone - Intellect' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneLeadershipId = (SELECT id FROM items WHERE name = 'Ioun Stone - Leadership' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneMasteryId = (SELECT id FROM items WHERE name = 'Ioun Stone - Mastery' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneProtectionId = (SELECT id FROM items WHERE name = 'Ioun Stone - Protection' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneRegenerationId = (SELECT id FROM items WHERE name = 'Ioun Stone - Regeneration' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneReserveId = (SELECT id FROM items WHERE name = 'Ioun Stone - Reserve' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneStrengthId = (SELECT id FROM items WHERE name = 'Ioun Stone - Strength' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IounStoneSustenanceId = (SELECT id FROM items WHERE name = 'Ioun Stone - Sustenance' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IronBandsOfBindingId = (SELECT id FROM items WHERE name = 'Iron Bands of Binding' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @IronFlaskId = (SELECT id FROM items WHERE name = 'Iron Flask' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @LanternOfRevealingId = (SELECT id FROM items WHERE name = 'Lantern of Revealing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MantleOfSpellResistanceId = (SELECT id FROM items WHERE name = 'Mantle of Spell Resistance' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ManualOfBodilyHealthId = (SELECT id FROM items WHERE name = 'Manual of Bodily Health' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ManualOfGainfulExerciseId = (SELECT id FROM items WHERE name = 'Manual of Gainful Exercise' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ManualOfGolemsId = (SELECT id FROM items WHERE name = 'Manual of Golems' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ManualOfQuicknessOfActionId = (SELECT id FROM items WHERE name = 'Manual of Quickness of Action' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MarvelousPigmentsId = (SELECT id FROM items WHERE name = 'Marvelous Pigments' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MedallionOfThoughtsId = (SELECT id FROM items WHERE name = 'Medallion of Thoughts' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @MirrorOfLifeTrappingId = (SELECT id FROM items WHERE name = 'Mirror of Life Trapping' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @NecklaceOfAdaptationId = (SELECT id FROM items WHERE name = 'Necklace of Adaptation' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @NecklaceOfFireballsId = (SELECT id FROM items WHERE name = 'Necklace of Fireballs' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @NecklaceOfPrayerBeadsId = (SELECT id FROM items WHERE name = 'Necklace of Prayer Beads' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PearlOfPowerId = (SELECT id FROM items WHERE name = 'Pearl of Power' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PeriaptOfHealthId = (SELECT id FROM items WHERE name = 'Periapt of Health' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PeriaptOfProofAgainstPoisonId = (SELECT id FROM items WHERE name = 'Periapt of Proof against Poison' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PeriaptOfWoundClosureId = (SELECT id FROM items WHERE name = 'Periapt of Wound Closure' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PipesOfHauntingId = (SELECT id FROM items WHERE name = 'Pipes of Haunting' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PipesOfTheSewersId = (SELECT id FROM items WHERE name = 'Pipes of the Sewers' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @PortableHoleId = (SELECT id FROM items WHERE name = 'Portable Hole' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RestorativeOintmentId = (SELECT id FROM items WHERE name = 'Restorative Ointment' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RobeOfEyesId = (SELECT id FROM items WHERE name = 'Robe of Eyes' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RobeOfScintillatingColorsId = (SELECT id FROM items WHERE name = 'Robe of Scintillating Colors' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RobeOfStarsId = (SELECT id FROM items WHERE name = 'Robe of Stars' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RobeOfTheArchmagiId = (SELECT id FROM items WHERE name = 'Robe of the Archmagi' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RobeOfUsefulItemsId = (SELECT id FROM items WHERE name = 'Robe of Useful Items' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RopeOfClimbingId = (SELECT id FROM items WHERE name = 'Rope of Climbing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @RopeOfEntanglementId = (SELECT id FROM items WHERE name = 'Rope of Entanglement' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @ScarabOfProtectionId = (SELECT id FROM items WHERE name = 'Scarab of Protection' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SlippersOfSpiderClimbingId = (SELECT id FROM items WHERE name = 'Slippers of Spider Climbing' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SoverignGlueId = (SELECT id FROM items WHERE name = 'Soverign Glue' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @SphereOfAnnihilationId = (SELECT id FROM items WHERE name = 'Sphere of Annihilation' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StoneOfControllingEarthElementalsId = (SELECT id FROM items WHERE name = 'Stone of Controlling Earth Elementals' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @StoneOfGoodLuckLuckstoneId = (SELECT id FROM items WHERE name = 'Stone of Good Luck (Luckstone)' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @TalismanOfPureGoodId = (SELECT id FROM items WHERE name = 'Talisman of Pure Good' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @TalismanOfTheSphereId = (SELECT id FROM items WHERE name = 'Talisman of the Sphere' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @TalismanOfUltimateEvilId = (SELECT id FROM items WHERE name = 'Talisman of Ultimate Evil' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @TomeOfClearThoughtId = (SELECT id FROM items WHERE name = 'Tome of Clear Thought' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @TomeOfLeadershipAndInfluenceId = (SELECT id FROM items WHERE name = 'Tome of Leadership and Influence' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @TomeOfUnderstandingId = (SELECT id FROM items WHERE name = 'Tome of Understanding' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @UniversalSolventId = (SELECT id FROM items WHERE name = 'Universal Solvent' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WellOfManyWorldsId = (SELECT id FROM items WHERE name = 'Well of Many Worlds' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WindFanId = (SELECT id FROM items WHERE name = 'Wind Fan' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WingedBootsId = (SELECT id FROM items WHERE name = 'Winged Boots' AND user_id = userId AND item_type_id = @magicalItemId);
	SET @WingsOfFlyingId = (SELECT id FROM items WHERE name = 'Wings of Flying' AND user_id = userId AND item_type_id = @magicalItemId);

	INSERT INTO magical_items (item_id, magical_item_type_id, rarity_id, requires_attunement, curse_effect, max_charges, rechargeable, recharge_num_dice, recharge_dice_size_id, recharge_misc_mod, chance_of_destruction, is_vehicle, attack_mod, ac_mod, additional_spells, additional_spells_remove_on_casting, attack_type_id, temporary_hp, save_type_id, half_on_save, recharge_on_long_rest, spell_attack_calculation_type_id, spell_attack_modifier, spell_save_dc, magical_item_attunement_type_id) VALUES
	(@AdamantineArmorId, @magicalArmorTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@AnimatedShieldId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus1ArmorId, @magicalArmorTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus2ArmorId, @magicalArmorTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 2, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus3ArmorId, @magicalArmorTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 3, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfInvulnerabilityId, @magicalArmorTypeId, @legendaryRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceAcidId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceColdId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceFireId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceForceId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceLightningId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceNecroticId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistancePoisonId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistancePsychicId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceRadiantId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfResistanceThunderId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArmorOfVulnerabilityId, @magicalArmorTypeId, @rareRarityId, 1, 'This armor is cursed, a fact that is revealed only when an identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by the remove curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have vulnerability to two of the three damage types associated with the armor (not the one to which it grants resistance).', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArrowCatchingShieldId, @magicalArmorTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DemonArmorId, @magicalArmorTypeId, @rareRarityId, 1, 'Once you don this cursed armor, you can’t doff it unless you are targeted by the remove curse spell or similar magic. While wearing the armor, you have disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.', 0, 0, 0, @d1Id, 0, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailBlackAcidId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailBlueLightningId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailBrassFireId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailBronzeLightningId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailCopperAcidId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailGoldFireId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailGreenPoisonId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailRedFireId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailSilverColdId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DragonScaleMailWhiteColdId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DwarvenPlateId, @magicalArmorTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 2, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ElvenChainId, @magicalArmorTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@GlamouredStuddedLeatherId, @magicalArmorTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@MithralArmorId, @magicalArmorTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PlateArmorOfEtherealnessId, @magicalArmorTypeId, @legendaryRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@Plus1ShieldId, @magicalArmorTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 1, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus2ShieldId, @magicalArmorTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 2, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus3ShieldId, @magicalArmorTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 3, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ShieldOfMissileAttractionId, @magicalArmorTypeId, @rareRarityId, 1, 'This shield is cursed. Attuning to it curses you until you are targeted by the remove curse spell or similar magic. Removing the shield fails to end the curse on you. Whenever a ranged weapon attack is made against a target within 10 feet of you, the curse causes you to become the target instead.', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SpellguardShieldId, @magicalArmorTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@OilOfEtherealnessId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@OilOfSharpnessId, @magicalPotionTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@OilOfSlipperinessId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PhilterOfLoveId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfAnimalFriendshipId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 3, 0, 13, @attunementTypeAnyId),
	(@PotionOfClairvoyanceId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfClimbingId, @magicalPotionTypeId, @commonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfDiminutionId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfFlyingId, @magicalPotionTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGaseousFormId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGiantStrengthHillGiantId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGiantStrengthFrostGiantId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGiantStrengthStoneGiantId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGiantStrengthFireGiantId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGiantStrengthCloudGiantId, @magicalPotionTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGiantStrengthStormGiantId, @magicalPotionTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGrowthId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfHealingId, @magicalPotionTypeId, @commonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 3, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfGreaterHealingId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 3, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfSuperiorHealingId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 3, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfSupremeHealingId, @magicalPotionTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 3, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfHeroismId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 3, 1, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfInvisibilityId, @magicalPotionTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfMindReadingId, @magicalPotionTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 3, 0, 13, @attunementTypeAnyId),
	(@PotionOfPoisonId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 13, 0, 0, 0, 2, 0, @conId, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceAcidId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceColdId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceFireId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceForceId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceLightningId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceNecroticId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistancePoisonId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistancePsychicId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceRadiantId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfResistanceThunderId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfSpeedId, @magicalPotionTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PotionOfWaterBreathingId, @magicalPotionTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfAnimalInfluenceId, @magicalRingTypeId, @rareRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 13, @attunementTypeAnyId),
	(@RingOfDjinniSummoningId, @magicalRingTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfAirElementalCommandId, @magicalRingTypeId, @legendaryRarityId, 1, '', 5, 1, 1, @d4Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 17, @attunementTypeAnyId),
	(@RingOfEarthElementalCommandId, @magicalRingTypeId, @legendaryRarityId, 1, '', 5, 1, 1, @d4Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 17, @attunementTypeAnyId),
	(@RingOfFireElementalCommandId, @magicalRingTypeId, @legendaryRarityId, 1, '', 5, 1, 1, @d4Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 17, @attunementTypeAnyId),
	(@RingOfWaterElementalCommandId, @magicalRingTypeId, @legendaryRarityId, 1, '', 5, 1, 1, @d4Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 17, @attunementTypeAnyId),
	(@RingOfEvasionId, @magicalRingTypeId, @rareRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfFeatherFallingId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfFreeActionId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfInvisibilityId, @magicalRingTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfJumpingId, @magicalRingTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfMindShieldingId, @magicalRingTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfProtectionId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfRegenerationId, @magicalRingTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 3, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceAcidPearlId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceColdTourmalineId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceFireGarnetId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceForceSapphireId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceLightningCitrineId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceNecroticJetId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistancePoisonAmethystId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistancePsychicJadeId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceRadiantTopazId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfResistanceThunderSpinelId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfShootingStarsId, @magicalRingTypeId, @veryRareRarityId, 1, '', 6, 1, 1, @d6Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfSpellStoringId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 1, 1, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfSpellTurningId, @magicalRingTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfSwimmingId, @magicalRingTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfTelekinesisId, @magicalRingTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfTheRamId, @magicalRingTypeId, @rareRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfThreeWishesId, @magicalRingTypeId, @legendaryRarityId, 0, '', 3, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfWarmthId, @magicalRingTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfWaterWalkingId, @magicalRingTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RingOfXrayVisionId, @magicalRingTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ImmovableRodId, @magicalRodTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RodOfAbsorptionId, @magicalRodTypeId, @veryRareRarityId, 1, '', 50, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RodOfAlertnessId, @magicalRodTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@RodOfLordlyMightId, @magicalRodTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RodOfRulershipId, @magicalRodTypeId, @rareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@RodOfSecurityId, @magicalRodTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SpellScrollId, @magicalScrollTypeId, @commonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 1, 0, 4, 0, NULL, 0, 0, 1, 0, 0, @attunementTypeAnyId),
	(@StaffOfCharmingId, @magicalStaffTypeId, @rareRarityId, 1, '', 10, 1, 1, @d8Id, 2, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfFireId, @magicalStaffTypeId, @veryRareRarityId, 1, '', 10, 1, 1, @d6Id, 4, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfFrostId, @magicalStaffTypeId, @veryRareRarityId, 1, '', 10, 1, 1, @d6Id, 4, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfHealingId, @magicalStaffTypeId, @rareRarityId, 1, '', 10, 1, 1, @d6Id, 4, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfPowerId, @magicalStaffTypeId, @veryRareRarityId, 1, '', 20, 1, 2, @d8Id, 4, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfStrikingId, @magicalStaffTypeId, @veryRareRarityId, 1, '', 10, 1, 1, @d6Id, 4, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@StaffOfSwarmingInsectsId, @magicalStaffTypeId, @rareRarityId, 1, '', 10, 1, 1, @d6Id, 4, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfTheMagiId, @magicalStaffTypeId, @legendaryRarityId, 1, '', 50, 1, 4, @d6Id, 2, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfThePythonId, @magicalStaffTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeClassId),
	(@StaffOfTheWoodlandsId, @magicalStaffTypeId, @rareRarityId, 1, '', 10, 1, 1, @d6Id, 4, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 2, 0, 0, @attunementTypeClassId),
	(@StaffOfThunderAndLightningId, @magicalStaffTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@StaffOfWitheringId, @magicalStaffTypeId, @rareRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeClassId),
	(@WandOfBindingId, @magicalWandTypeId, @rareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 17, @attunementTypeCasterId),
	(@WandOfEnemyDetectionId, @magicalWandTypeId, @rareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@WandOfFearId, @magicalWandTypeId, @rareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 15, @attunementTypeAnyId),
	(@WandOfFireballsId, @magicalWandTypeId, @rareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 15, @attunementTypeCasterId),
	(@WandOfLightningBoltsId, @magicalWandTypeId, @rareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 15, @attunementTypeCasterId),
	(@WandOfMagicDetectionId, @magicalWandTypeId, @uncommonRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@WandOfMagicMissilesId, @magicalWandTypeId, @uncommonRarityId, 0, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@WandOfParalysisId, @magicalWandTypeId, @rareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeCasterId),
	(@WandOfPolymorphId, @magicalWandTypeId, @veryRareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 15, @attunementTypeCasterId),
	(@WandOfSecretsId, @magicalWandTypeId, @uncommonRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@Plus1WandOfTheWarMageId, @magicalWandTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeCasterId),
	(@Plus2WandOfTheWarMageId, @magicalWandTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeCasterId),
	(@Plus3WandOfTheWarMageId, @magicalWandTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeCasterId),
	(@WandOfWebId, @magicalWandTypeId, @uncommonRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 15, @attunementTypeCasterId),
	(@WandOfWonderId, @magicalWandTypeId, @rareRarityId, 1, '', 7, 1, 1, @d6Id, 1, 1, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 15, @attunementTypeCasterId),
	(@Plus1AmmunitionId, @magicalAmmoTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus2AmmunitionId, @magicalAmmoTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 2, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus3AmmunitionId, @magicalAmmoTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 3, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ArrowOfSlayingId, @magicalAmmoTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BerserkerAxeId, @magicalWeaponTypeId, @rareRarityId, 1, 'This axe is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the axe, keeping it within reach at all times. You also have disadvantage on attack rolls with weapons other than this one, unless no foe is within 60 feet of you that you can see or hear.\n\nWhenever a hostile creature damages you while the axe is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk. While berserk, you must use your action each round to attack the creature nearest to you with the axe. If you can make extra attacks as part of the Attack action, you use those extra attacks, moving to attack the next nearest creature after you fell your current target. If you have multiple possible targets, you attack one at random. You are berserk until you start your turn with no creatures within 60 feet of you that you can see or hear.', 0, 0, 0, @d1Id, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DaggerOfVenomId, @magicalWeaponTypeId, @rareRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@DancingSwordId, @magicalWeaponTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DefenderId, @magicalWeaponTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 3, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DragonSlayerId, @magicalWeaponTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DwarvenThrowerId, @magicalWeaponTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 3, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeRaceId),
	(@FlameTongueId, @magicalWeaponTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FrostBrandId, @magicalWeaponTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@GiantSlayerId, @magicalWeaponTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HammerOfThunderboltsId, @magicalWeaponTypeId, @legendaryRarityId, 1, '', 5, 1, 1, @d4Id, 1, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@HolyAvengerId, @magicalWeaponTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 3, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeClassId),
	(@JavelinOfLightningId, @magicalWeaponTypeId, @uncommonRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@LuckBladeId, @magicalWeaponTypeId, @legendaryRarityId, 1, '', 3, 0, 0, @d1Id, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@MaceOfDisruptionId, @magicalWeaponTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@MaceOfSmitingId, @magicalWeaponTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@MaceOfTerrorId, @magicalWeaponTypeId, @rareRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@NineLivesStealerId, @magicalWeaponTypeId, @veryRareRarityId, 1, '', 9, 0, 0, @d1Id, 0, 0, 0, 2, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@OathbowId, @magicalWeaponTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ScimitarOfSpeedId, @magicalWeaponTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 2, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SunBladeId, @magicalWeaponTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 2, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SwordOfLifeStealingId, @magicalWeaponTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SwordOfSharpnessId, @magicalWeaponTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SwordOfWoundingId, @magicalWeaponTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@TridentOfFishCommandId, @magicalWeaponTypeId, @uncommonRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 1, 3, 0, 15, @attunementTypeAnyId),
	(@ViciousWeaponId, @magicalWeaponTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus1WeaponId, @magicalWeaponTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus2WeaponId, @magicalWeaponTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 2, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@Plus3WeaponId, @magicalWeaponTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 3, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@VopalSwordId, @magicalWeaponTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 3, 0, 0, 0, 1, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@AmuletOfHealthId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@AmuletOfProofAgainstDetectionAndLocationId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@AmuletOfThePlanesId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ApparatusOfTheCrabId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BagOfBeansId, @magicalWondrousTypeId, @rareRarityId, 0, '', 12, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BagOfDevouringId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BagOfHoldingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BagOfTricksGrayId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@BagOfTricksRustId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@BagOfTricksTanId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@BeadOfForceId, @magicalWondrousTypeId, @rareRarityId, 0, '', 8, 0, 0, @d1Id, 0, 0, 0, 15, 0, 0, 0, 2, 0, @dexId, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BeltOfDwarvenkindId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BeltOfGiantStrengthHillGiantId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BeltOfGiantStrengthStoneGiantId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BeltOfGiantStrengthFrostGiantId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BeltOfGiantStrengthFireGiantId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BeltOfGiantStrengthCloudGiantId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BeltOfGiantStrengthStormGiantId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BootsOfElvenkindId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BootsOfLevitationId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BootsOfSpeedId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BootsOfStridingAndSpringingId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BootsOfTheWinterlandsId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BowlOfCommandWaterElementalsId, @magicalWondrousTypeId, @rareRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@BracersOfArcheryId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BracersOfDefenseId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BrazierOfCommandingFireElementalsId, @magicalWondrousTypeId, @rareRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@BroochOfShieldingId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@BroomOfFlyingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 1, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CandleOfInvocationId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 240, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CapeOfTheMountebankId, @magicalWondrousTypeId, @rareRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@CarpetOfFlyingSmallId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 1, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CarpetOfFlyingMediumId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 1, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CarpetOfFlyingLargeId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 1, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CarpetOfFlyingExtraLargeId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 1, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CenserOfControllingAirElementalsId, @magicalWondrousTypeId, @rareRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@ChimeOfOpeningId, @magicalWondrousTypeId, @rareRarityId, 0, '', 10, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CircletOfBlastingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 5, 0, @attunementTypeAnyId),
	(@CloakOfArachnidaId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 2, 0, NULL, 0, 1, 3, 0, 13, @attunementTypeAnyId),
	(@CloakOfDisplacementId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CloakOfElvenkindId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CloakOfProtectionId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CloakOfTheBatId, @magicalWondrousTypeId, @rareRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@CloakOfTheMantaRayId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@CrystalBallId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 3, 0, 17, @attunementTypeAnyId),
	(@CrystalBallOfMindReadingId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 3, 0, 17, @attunementTypeAnyId),
	(@CrystalBallOfTelepathyId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 17, @attunementTypeAnyId),
	(@CrystalBallOfTrueSeeingId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 3, 0, 17, @attunementTypeAnyId),
	(@CubeOfForceId, @magicalWondrousTypeId, @rareRarityId, 1, '', 36, 1, 1, @d20Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@CubicGateId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 17, @attunementTypeAnyId),
	(@DecanterOfEndlessWaterId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DeckOfIllusionsId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 34, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DeckOfManyThingsId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DimensionalShacklesId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DustOfDisappearanceId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DustOfDrynessId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 10, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@DustOfSneezingAndChokingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@EfficientQuiverId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@EfreetiBottleId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ElementalGemBlueSapphireId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ElementalGemYellowDiamondId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ElementalGemRedCorundumId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ElementalGemEmeraldId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@EversmokingBottleId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@EyesOfCharmingId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 3, 1, 0, @d1Id, 3, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 3, 0, 13, @attunementTypeAnyId),
	(@EyesOfMinuteSeeingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@EyesOfTheEagleId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FeatherTokenAnchorId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FeatherTokenBirdId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FeatherTokenFanId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FeatherTokenSwanBoatId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FeatherTokenTreeId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FeatherTokenWhipId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerBronzeGriffonId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerEbonyFlyId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerGoldenLionsId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerIvoryGoatsId, @magicalWondrousTypeId, @rareRarityId, 0, '', 24, 1, 0, @d1Id, 24, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerMarbleElephantId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerObsidianSteedId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerOnyxDogId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerSerpentineOwlId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FigurineOfWondrousPowerSilverRavenId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@FoldingBoatId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 1, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@GauntletsOfOgrePowerId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@GemOfBrightnessId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 50, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@GemOfSeeingId, @magicalWondrousTypeId, @rareRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@GlovesOfMissileSnaringId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@GlovesOfSwimmingAndClimbingId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@GogglesOfNightId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HandyHaversackId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HatOfDisguiseId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HeadbandOfIntellectId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HelmOfBrillianceId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 100, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HelmOfComprehendingLanguagesId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HelmOfTelepathyId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@HelmOfTeleportationId, @magicalWondrousTypeId, @rareRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@HornOfBlastingId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 15, 0, 0, 0, 2, 0, @conId, 1, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HornOfValhallaSilverId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HornOfValhallaBrassId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HornOfValhallaBronzeId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HornOfValhallaIronId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HorseshoesOfAZephyrId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@HorseshoesOfSpeedId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@InstantFortressId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneAbsorptionId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 20, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneAgilityId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneAwarenessId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneFortitudeId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneGreaterAbsorptionId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 50, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneInsightId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneIntellectId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneLeadershipId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneMasteryId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneProtectionId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneRegenerationId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneReserveId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 1, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneStrengthId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IounStoneSustenanceId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@IronBandsOfBindingId, @magicalWondrousTypeId, @rareRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@IronFlaskId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@LanternOfRevealingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@MantleOfSpellResistanceId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ManualOfBodilyHealthId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ManualOfGainfulExerciseId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ManualOfGolemsId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ManualOfQuicknessOfActionId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@MarvelousPigmentsId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 4, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@MedallionOfThoughtsId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 3, 1, 1, @d1Id, 3, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@MirrorOfLifeTrappingId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@NecklaceOfAdaptationId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@NecklaceOfFireballsId, @magicalWondrousTypeId, @rareRarityId, 0, '', 9, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 3, 0, 15, @attunementTypeAnyId),
	(@NecklaceOfPrayerBeadsId, @magicalWondrousTypeId, @rareRarityId, 1, '', 6, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 2, 0, 0, @attunementTypeClassId),
	(@PearlOfPowerId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeCasterId),
	(@PeriaptOfHealthId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PeriaptOfProofAgainstPoisonId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PeriaptOfWoundClosureId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@PipesOfHauntingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 3, 1, 1, @d3Id, 0, 0, 0, 15, 0, 0, 0, 2, 0, @wisId, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@PipesOfTheSewersId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@PortableHoleId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RestorativeOintmentId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 5, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 3, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RobeOfEyesId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RobeOfScintillatingColorsId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 3, 1, 1, @d3Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@RobeOfStarsId, @magicalWondrousTypeId, @veryRareRarityId, 1, '', 6, 1, 1, @d6Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@RobeOfTheArchmagiId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeClassId),
	(@RobeOfUsefulItemsId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 28, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RopeOfClimbingId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@RopeOfEntanglementId, @magicalWondrousTypeId, @rareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@ScarabOfProtectionId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 12, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SlippersOfSpiderClimbingId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SoverignGlueId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 7, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@SphereOfAnnihilationId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@StoneOfControllingEarthElementalsId, @magicalWondrousTypeId, @rareRarityId, 0, '', 1, 1, 0, @d1Id, 1, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 1, 4, 0, 0, @attunementTypeAnyId),
	(@StoneOfGoodLuckLuckstoneId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@TalismanOfPureGoodId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 7, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAlignmentId),
	(@TalismanOfTheSphereId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@TalismanOfUltimateEvilId, @magicalWondrousTypeId, @legendaryRarityId, 1, '', 6, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAlignmentId),
	(@TomeOfClearThoughtId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@TomeOfLeadershipAndInfluenceId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@TomeOfUnderstandingId, @magicalWondrousTypeId, @veryRareRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@UniversalSolventId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@WellOfManyWorldsId, @magicalWondrousTypeId, @legendaryRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@WindFanId, @magicalWondrousTypeId, @uncommonRarityId, 0, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 3, 0, 13, @attunementTypeAnyId),
	(@WingedBootsId, @magicalWondrousTypeId, @uncommonRarityId, 1, '', 240, 1, 0, @d1Id, 120, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId),
	(@WingsOfFlyingId, @magicalWondrousTypeId, @rareRarityId, 1, '', 0, 0, 0, @d1Id, 0, 0, 0, 0, 0, 0, 0, 4, 0, NULL, 0, 0, 4, 0, 0, @attunementTypeAnyId);

	INSERT INTO `item_damages` (`item_id`, `num_dice`, `dice_size`, `ability_modifier_id`, `misc_mod`, `damage_type_id`, `versatile`) VALUES
	(@Plus1AmmunitionId, 0, @d1Id, NULL, 1, NULL, 0),
	(@Plus2AmmunitionId, 0, @d1Id, NULL, 2, NULL, 0),
	(@Plus3AmmunitionId, 0, @d1Id, NULL, 3, NULL, 0),
	(@BerserkerAxeId, 0, @d1Id, NULL, 1, NULL, 0),
	(@DaggerOfVenomId, 0, @d1Id, NULL, 1, NULL, 0),
	(@DefenderId, 0, @d1Id, NULL, 3, NULL, 0),
	(@DragonSlayerId, 0, @d1Id, NULL, 1, NULL, 0),
	(@DwarvenThrowerId, 0, @d1Id, NULL, 3, NULL, 0),
	(@DwarvenThrowerId, 1, @d8Id, NULL, 0, NULL, 0),
	(@FrostBrandId, 1, @d6Id, NULL, 0, @coldDamageTypeId, 0),
	(@GiantSlayerId, 0, @d1Id, NULL, 1, NULL, 0),
	(@HammerOfThunderboltsId, 0, @d1Id, NULL, 1, NULL, 0),
	(@HolyAvengerId, 0, @d1Id, NULL, 3, NULL, 0),
	(@LuckBladeId, 0, @d1Id, NULL, 1, NULL, 0),
	(@MaceOfSmitingId, 0, @d1Id, NULL, 1, NULL, 0),
	(@NineLivesStealerId, 0, @d1Id, NULL, 2, NULL, 0),
	(@ScimitarOfSpeedId, 0, @d1Id, NULL, 2, NULL, 0),
	(@SunBladeId, 0, @d1Id, NULL, 2, NULL, 0),
	(@Plus1WeaponId, 0, @d1Id, NULL, 1, NULL, 0),
	(@Plus2WeaponId, 0, @d1Id, NULL, 2, NULL, 0),
	(@Plus3WeaponId, 0, @d1Id, NULL, 3, NULL, 0),
	(@VopalSwordId, 0, @d1Id, NULL, 3, NULL, 0),
	(@ArrowOfSlayingId, 6, @d10Id, NULL, 0, @piercingDamageTypeId, 0),
	(@BeadOfForceId, 5, @d4Id, NULL, 0, @forceDamageTypeId, 0),
	(@FlameTongueId, 2, @d6Id, NULL, 0, @fireDamageTypeId, 0),
	(@HornOfBlastingId, 5, @d6Id, NULL, 0, @thunderDamageTypeId, 0),
	(@PotionOfPoisonId, 3, @d6Id, NULL, 0, @poisonDamageTypeId, 0),
	(@RestorativeOintmentId, 2, @d8Id, NULL, 2, NULL, 0),
	(@PotionOfHealingId, 2, @d4Id, NULL, 2, NULL, 0),
	(@PotionOfGreaterHealingId, 4, @d4Id, NULL, 4, NULL, 0),
	(@PotionOfSuperiorHealingId, 8, @d4Id, NULL, 8, NULL, 0),
	(@PotionOfSupremeHealingId, 10, @d4Id, NULL, 20, NULL, 0),
	(@RingOfRegenerationId, 1, @d6Id, NULL, 0, NULL, 0),
	(@PotionOfHeroismId, 0, @d1Id, NULL, 10, NULL, 0);

	INSERT INTO `magical_item_spells` (`magical_item_id`, `spell_id`, `stored_level`, `charges`, `allow_casting_at_higher_level`, `charges_per_level_above_stored_level`, max_level, remove_on_casting, override_spell_attack_calculation, spell_attack_modifier, spell_save_dc) VALUES
	(@PlateArmorOfEtherealnessId, @EtherealnessId, 7, 1, 0, 0, 7, 0, 0, 0, 0),
	(@OilOfEtherealnessId, @EtherealnessId, 7, 0, 0, 0, 7, 0, 0, 0, 0),
	(@OilOfSlipperinessId, @FreedomOfMovementId, 4, 0, 0, 0, 4, 0, 0, 0, 0),
	(@OilOfSlipperinessId, @GreaseId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@PotionOfAnimalFriendshipId, @AnimalFriendshipId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@PotionOfClairvoyanceId, @ClairvoyanceId, 3, 0, 0, 0, 3, 0, 0, 0, 0),
	(@PotionOfDiminutionId, @EnlargeReduceId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@PotionOfGaseousFormId, @GaseousFormId, 3, 0, 0, 0, 3, 0, 0, 0, 0),
	(@PotionOfGrowthId, @EnlargeReduceId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@PotionOfHeroismId, @BlessId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@PotionOfMindReadingId, @DetectThoughtsId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@PotionOfSpeedId, @HasteId, 3, 0, 0, 0, 3, 0, 0, 0, 0),
	(@RingOfAnimalInfluenceId, @AnimalFriendshipId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@RingOfAnimalInfluenceId, @FearId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@RingOfAnimalInfluenceId, @SpeakWithAnimalsId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@RingOfAirElementalCommandId, @DominateMonsterId, 8, 2, 0, 0, 8, 0, 0, 0, 0),
	(@RingOfAirElementalCommandId, @ChainLightningId, 6, 3, 0, 0, 6, 0, 0, 0, 0),
	(@RingOfAirElementalCommandId, @GustOfWindId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@RingOfAirElementalCommandId, @WindWallId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@RingOfEarthElementalCommandId, @DominateMonsterId, 8, 2, 0, 0, 8, 0, 0, 0, 0),
	(@RingOfEarthElementalCommandId, @StoneShapeId, 4, 2, 0, 0, 4, 0, 0, 0, 0),
	(@RingOfEarthElementalCommandId, @StoneskinId, 4, 3, 0, 0, 4, 0, 0, 0, 0),
	(@RingOfEarthElementalCommandId, @WallOfStoneId, 5, 3, 0, 0, 5, 0, 0, 0, 0),
	(@RingOfFireElementalCommandId, @DominateMonsterId, 8, 2, 0, 0, 8, 0, 0, 0, 0),
	(@RingOfFireElementalCommandId, @BurningHandsId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@RingOfFireElementalCommandId, @FireballId, 3, 2, 0, 0, 3, 0, 0, 0, 0),
	(@RingOfFireElementalCommandId, @WallOfFireId, 4, 3, 0, 0, 4, 0, 0, 0, 0),
	(@RingOfWaterElementalCommandId, @DominateMonsterId, 8, 2, 0, 0, 8, 0, 0, 0, 0),
	(@RingOfWaterElementalCommandId, @CreateOrDestroyWaterId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@RingOfWaterElementalCommandId, @ControlWaterId, 4, 3, 0, 0, 4, 0, 0, 0, 0),
	(@RingOfWaterElementalCommandId, @IceStormId, 4, 2, 0, 0, 4, 0, 0, 0, 0),
	(@RingOfWaterElementalCommandId, @WallOfIceId, 6, 3, 0, 0, 6, 0, 0, 0, 0),
	(@RingOfJumpingId, @JumpId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@RingOfShootingStarsId, @FaerieFireId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@RingOfShootingStarsId, @DancingLightsId, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(@RingOfShootingStarsId, @LightId, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(@RingOfTelekinesisId, @TelekinesisId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@RingOfThreeWishesId, @WishId, 9, 1, 0, 0, 9, 0, 0, 0, 0),
	(@RodOfAlertnessId, @DetectEvilAndGoodId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@RodOfAlertnessId, @DetectMagicId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@RodOfAlertnessId, @DetectPoisonAndDiseaseId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@RodOfAlertnessId, @SeeInvisibilityId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfCharmingId, @CharmPersonId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfCharmingId, @CommandId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfCharmingId, @ComprehendLanguagesId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfFireId, @BurningHandsId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfFireId, @FireballId, 3, 3, 0, 0, 3, 0, 0, 0, 0),
	(@StaffOfFireId, @WallOfFireId, 4, 4, 0, 0, 4, 0, 0, 0, 0),
	(@StaffOfFrostId, @ConeOfColdId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfFrostId, @FogCloudId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfFrostId, @IceStormId, 4, 4, 0, 0, 4, 0, 0, 0, 0),
	(@StaffOfFrostId, @WallOfIceId, 6, 4, 0, 0, 6, 0, 0, 0, 0),
	(@StaffOfHealingId, @CureWoundsId, 1, 1, 1, 1, 4, 0, 0, 0, 0),
	(@StaffOfHealingId, @LesserRestorationId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfHealingId, @MassCureWoundsId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfPowerId, @ConeOfColdId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfPowerId, @FireballId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfPowerId, @GlobeOfInvulnerabilityId, 6, 6, 0, 0, 6, 0, 0, 0, 0),
	(@StaffOfPowerId, @HoldMonsterId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfPowerId, @LevitateId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfPowerId, @LightningBoltId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfPowerId, @MagicMissileId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfPowerId, @RayOfEnfeeblementId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfPowerId, @WallOfForceId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfSwarmingInsectsId, @GiantInsectId, 4, 4, 0, 0, 4, 0, 0, 0, 0),
	(@StaffOfSwarmingInsectsId, @InsectPlagueId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @ConjureElementalId, 5, 7, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @DispelMagicId, 3, 3, 0, 0, 3, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @FireballId, 7, 7, 0, 0, 7, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @FlamingSphereId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @IceStormId, 4, 4, 0, 0, 4, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @InvisibilityId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @KnockId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @LightningBoltId, 7, 7, 0, 0, 7, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @PasswallId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @PlaneShiftId, 7, 7, 0, 0, 7, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @TelekinesisId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @WallOfFireId, 4, 4, 0, 0, 4, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @WebId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @ArcaneLockId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @DetectMagicId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @EnlargeReduceId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @LightId, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @MageHandId, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(@StaffOfTheMagiId, @ProtectionFromEvilAndGoodId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @AnimalFriendshipId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @AwakenId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @BarkskinId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @LocateAnimalsOrPlantsId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @SpeakWithAnimalsId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @SpeakWithPlantsId, 3, 3, 0, 0, 3, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @WallOfThornsId, 6, 6, 0, 0, 6, 0, 0, 0, 0),
	(@StaffOfTheWoodlandsId, @PassWithoutTraceId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@WandOfBindingId, @HoldMonsterId, 5, 5, 0, 0, 5, 0, 0, 0, 0),
	(@WandOfBindingId, @HoldPersonId, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	(@WandOfFearId, @CommandId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@WandOfFireballsId, @FireballId, 3, 1, 1, 1, 9, 0, 0, 0, 0),
	(@WandOfLightningBoltsId, @LightningBoltId, 3, 1, 1, 1, 9, 0, 0, 0, 0),
	(@WandOfMagicDetectionId, @DetectMagicId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@WandOfMagicMissilesId, @MagicMissileId, 1, 1, 1, 1, 9, 0, 0, 0, 0),
	(@WandOfPolymorphId, @PolymorphId, 4, 1, 0, 0, 4, 0, 0, 0, 0),
	(@WandOfWebId, @WebId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@WandOfWonderId, @SlowId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@WandOfWonderId, @FaerieFireId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@WandOfWonderId, @GustOfWindId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@WandOfWonderId, @DetectThoughtsId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@WandOfWonderId, @StinkingCloudId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@WandOfWonderId, @LightningBoltId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@WandOfWonderId, @EnlargeReduceId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@WandOfWonderId, @DarknessId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@WandOfWonderId, @FireballId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@WandOfWonderId, @InvisibilityId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@TridentOfFishCommandId, @DominateBeastId, 4, 1, 0, 0, 4, 0, 0, 0, 0),
	(@AmuletOfThePlanesId, @PlaneShiftId, 7, 0, 0, 0, 7, 0, 0, 0, 0),
	(@BootsOfLevitationId, @LevitateId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@BowlOfCommandWaterElementalsId, @ConjureElementalId, 5, 1, 0, 0, 5, 0, 0, 0, 0),
	(@BrazierOfCommandingFireElementalsId, @ConjureElementalId, 5, 1, 0, 0, 5, 0, 0, 0, 0),
	(@CandleOfInvocationId, @GateId, 9, 240, 0, 0, 9, 0, 0, 0, 0),
	(@CapeOfTheMountebankId, @DimensionDoorId, 4, 1, 0, 0, 4, 0, 0, 0, 0),
	(@CenserOfControllingAirElementalsId, @ConjureElementalId, 5, 1, 0, 0, 5, 0, 0, 0, 0),
	(@CircletOfBlastingId, @ScorchingRayId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@CloakOfArachnidaId, @WebId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@CloakOfTheBatId, @PolymorphId, 4, 1, 0, 0, 4, 0, 0, 0, 0),
	(@CrystalBallId, @ScryingId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@CrystalBallOfMindReadingId, @ScryingId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@CrystalBallOfMindReadingId, @DetectThoughtsId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@CrystalBallOfTelepathyId, @ScryingId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@CrystalBallOfTelepathyId, @SuggestionId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@CrystalBallOfTrueSeeingId, @ScryingId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@CubicGateId, @GateId, 9, 1, 0, 0, 9, 0, 0, 0, 0),
	(@CubicGateId, @PlaneShiftId, 7, 1, 0, 0, 7, 0, 0, 0, 0),
	(@DeckOfManyThingsId, @WishId, 9, 0, 0, 0, 9, 0, 0, 0, 0),
	(@EfreetiBottleId, @WishId, 9, 0, 0, 0, 9, 0, 0, 0, 0),
	(@ElementalGemBlueSapphireId, @ConjureElementalId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@ElementalGemYellowDiamondId, @ConjureElementalId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@ElementalGemRedCorundumId, @ConjureElementalId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@ElementalGemEmeraldId, @ConjureElementalId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@EyesOfCharmingId, @CharmPersonId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@FigurineOfWondrousPowerSilverRavenId, @AnimalMessengerId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@HatOfDisguiseId, @DisguiseSelfId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@HelmOfBrillianceId, @DaylightId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@HelmOfBrillianceId, @FireballId, 3, 1, 0, 0, 3, 0, 0, 0, 0),
	(@HelmOfBrillianceId, @PrismaticSprayId, 7, 1, 0, 0, 7, 0, 0, 0, 0),
	(@HelmOfBrillianceId, @WallOfFireId, 4, 1, 0, 0, 4, 0, 0, 0, 0),
	(@HelmOfComprehendingLanguagesId, @ComprehendLanguagesId, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	(@HelmOfTelepathyId, @DetectThoughtsId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@HelmOfTelepathyId, @SuggestionId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@HelmOfTeleportationId, @TeleportId, 7, 1, 0, 0, 7, 0, 0, 0, 0),
	(@MedallionOfThoughtsId, @DetectThoughtsId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@NecklaceOfFireballsId, @FireballId, 3, 1, 1, 1, 9, 0, 0, 0, 0),
	(@NecklaceOfPrayerBeadsId, @BlessId, 1, 1, 0, 0, 1, 0, 0, 0, 0),
	(@NecklaceOfPrayerBeadsId, @CureWoundsId, 2, 1, 0, 0, 1, 0, 0, 0, 0),
	(@NecklaceOfPrayerBeadsId, @LesserRestorationId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@NecklaceOfPrayerBeadsId, @GreaterRestorationId, 5, 1, 0, 0, 5, 0, 0, 0, 0),
	(@NecklaceOfPrayerBeadsId, @BrandingSmiteId, 2, 1, 0, 0, 2, 0, 0, 0, 0),
	(@NecklaceOfPrayerBeadsId, @PlanarAllyId, 6, 1, 0, 0, 6, 0, 0, 0, 0),
	(@NecklaceOfPrayerBeadsId, @WindWalkId, 6, 1, 0, 0, 6, 0, 0, 0, 0),
	(@RobeOfStarsId, @MagicMissileId, 5, 0, 0, 0, 5, 0, 0, 0, 0),
	(@StoneOfControllingEarthElementalsId, @ConjureElementalId, 5, 1, 0, 0, 5, 0, 0, 0, 0),
	(@WindFanId, @GustOfWindId, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	(@LuckBladeId, @WishId, 9, 1, 0, 0, 9, 0, 0, 0, 0);

	INSERT INTO magical_item_applicable_spells (magical_item_id, applicability_type_id, spell_id, filters) VALUES
	(@SpellScrollId, 2, NULL, '');

	INSERT INTO magical_item_applicable_items (magical_item_id, applicability_type_id, item_id, filters) VALUES
	(@AdamantineArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@AdamantineArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@AnimatedShieldId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=43'),
	(@Plus1ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@Plus1ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@Plus1ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@Plus2ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@Plus2ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@Plus2ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@Plus3ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@Plus3ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@Plus3ArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfInvulnerabilityId, 1, @PlateId, ''),
	(@ArmorOfResistanceAcidId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceAcidId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceAcidId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistanceColdId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceColdId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceColdId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistanceFireId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceFireId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceFireId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistanceForceId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceForceId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceForceId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistanceLightningId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceLightningId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceLightningId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistanceNecroticId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceNecroticId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceNecroticId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistancePoisonId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistancePoisonId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistancePoisonId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistancePsychicId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistancePsychicId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistancePsychicId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistanceRadiantId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceRadiantId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceRadiantId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfResistanceThunderId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=40'),
	(@ArmorOfResistanceThunderId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@ArmorOfResistanceThunderId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@ArmorOfVulnerabilityId, 1, @PlateId, ''),
	(@ArrowCatchingShieldId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=43'),
	(@DemonArmorId, 1, @PlateId, ''),
	(@DragonScaleMailBlackAcidId, 1, @ScaleMailId, ''),
	(@DragonScaleMailBlueLightningId, 1, @ScaleMailId, ''),
	(@DragonScaleMailBrassFireId, 1, @ScaleMailId, ''),
	(@DragonScaleMailBronzeLightningId, 1, @ScaleMailId, ''),
	(@DragonScaleMailCopperAcidId, 1, @ScaleMailId, ''),
	(@DragonScaleMailGoldFireId, 1, @ScaleMailId, ''),
	(@DragonScaleMailGreenPoisonId, 1, @ScaleMailId, ''),
	(@DragonScaleMailRedFireId, 1, @ScaleMailId, ''),
	(@DragonScaleMailSilverColdId, 1, @ScaleMailId, ''),
	(@DragonScaleMailWhiteColdId, 1, @ScaleMailId, ''),
	(@DwarvenPlateId, 1, @PlateId, ''),
	(@ElvenChainId, 1, @ChainShirtId, ''),
	(@GlamouredStuddedLeatherId, 1, @StuddedLeatherId, ''),
	(@MithralArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=41'),
	(@MithralArmorId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=42'),
	(@PlateArmorOfEtherealnessId, 1, @PlateId, ''),
	(@Plus1ShieldId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=43'),
	(@Plus2ShieldId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=43'),
	(@Plus3ShieldId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=43'),
	(@ShieldOfMissileAttractionId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=43'),
	(@SpellguardShieldId, 2, null, 'ITEM_TYPE=ARMOR|ARMOR_CATEGORY=43'),
	(@Plus1AmmunitionId, 2, null, 'ITEM_TYPE=AMMO'),
	(@Plus2AmmunitionId, 2, null, 'ITEM_TYPE=AMMO'),
	(@Plus3AmmunitionId, 2, null, 'ITEM_TYPE=AMMO'),
	(@ArrowOfSlayingId, 1, @ArrowId, ''),
	(@BerserkerAxeId, 1, @handaxeId, ''),
	(@BerserkerAxeId, 1, @battleaxeId, ''),
	(@BerserkerAxeId, 1, @greataxeId, ''),
	(@DaggerOfVenomId, 1, @daggerId, ''),
	(@DancingSwordId, 1, @greatswordId, ''),
	(@DancingSwordId, 1, @longswordId, ''),
	(@DancingSwordId, 1, @rapierId, ''),
	(@DancingSwordId, 1, @scimitarId, ''),
	(@DancingSwordId, 1, @shortswordId, ''),
	(@DefenderId, 1, @greatswordId, ''),
	(@DefenderId, 1, @longswordId, ''),
	(@DefenderId, 1, @rapierId, ''),
	(@DefenderId, 1, @scimitarId, ''),
	(@DefenderId, 1, @shortswordId, ''),
	(@DragonSlayerId, 1, @greatswordId, ''),
	(@DragonSlayerId, 1, @longswordId, ''),
	(@DragonSlayerId, 1, @rapierId, ''),
	(@DragonSlayerId, 1, @scimitarId, ''),
	(@DragonSlayerId, 1, @shortswordId, ''),
	(@DwarvenThrowerId, 1, @warHammerId, ''),
	(@FlameTongueId, 1, @greatswordId, ''),
	(@FlameTongueId, 1, @longswordId, ''),
	(@FlameTongueId, 1, @rapierId, ''),
	(@FlameTongueId, 1, @scimitarId, ''),
	(@FlameTongueId, 1, @shortswordId, ''),
	(@FrostBrandId, 1, @greatswordId, ''),
	(@FrostBrandId, 1, @longswordId, ''),
	(@FrostBrandId, 1, @rapierId, ''),
	(@FrostBrandId, 1, @scimitarId, ''),
	(@FrostBrandId, 1, @shortswordId, ''),
	(@GiantSlayerId, 1, @handaxeId, ''),
	(@GiantSlayerId, 1, @battleaxeId, ''),
	(@GiantSlayerId, 1, @greataxeId, ''),
	(@GiantSlayerId, 1, @greatswordId, ''),
	(@GiantSlayerId, 1, @longswordId, ''),
	(@GiantSlayerId, 1, @rapierId, ''),
	(@GiantSlayerId, 1, @scimitarId, ''),
	(@GiantSlayerId, 1, @shortswordId, ''),
	(@HammerOfThunderboltsId, 1, @maulId, ''),
	(@HolyAvengerId, 1, @greatswordId, ''),
	(@HolyAvengerId, 1, @longswordId, ''),
	(@HolyAvengerId, 1, @rapierId, ''),
	(@HolyAvengerId, 1, @scimitarId, ''),
	(@HolyAvengerId, 1, @shortswordId, ''),
	(@JavelinOfLightningId, 1, @javelinId, ''),
	(@LuckBladeId, 1, @greatswordId, ''),
	(@LuckBladeId, 1, @longswordId, ''),
	(@LuckBladeId, 1, @rapierId, ''),
	(@LuckBladeId, 1, @scimitarId, ''),
	(@LuckBladeId, 1, @shortswordId, ''),
	(@MaceOfDisruptionId, 1, @maceId, ''),
	(@MaceOfSmitingId, 1, @maceId, ''),
	(@MaceOfTerrorId, 1, @maceId, ''),
	(@NineLivesStealerId, 1, @greatswordId, ''),
	(@NineLivesStealerId, 1, @longswordId, ''),
	(@NineLivesStealerId, 1, @rapierId, ''),
	(@NineLivesStealerId, 1, @scimitarId, ''),
	(@NineLivesStealerId, 1, @shortswordId, ''),
	(@OathbowId, 1, @longBowId, ''),
	(@ScimitarOfSpeedId, 1, @scimitarId, ''),
	(@SunBladeId, 1, @longswordId, ''),
	(@SwordOfLifeStealingId, 1, @greatswordId, ''),
	(@SwordOfLifeStealingId, 1, @longswordId, ''),
	(@SwordOfLifeStealingId, 1, @rapierId, ''),
	(@SwordOfLifeStealingId, 1, @scimitarId, ''),
	(@SwordOfLifeStealingId, 1, @shortswordId, ''),
	(@SwordOfSharpnessId, 1, @handaxeId, ''),
	(@SwordOfSharpnessId, 1, @sickleId, ''),
	(@SwordOfSharpnessId, 1, @battleaxeId, ''),
	(@SwordOfSharpnessId, 1, @glaiveId, ''),
	(@SwordOfSharpnessId, 1, @greataxeId, ''),
	(@SwordOfSharpnessId, 1, @greatswordId, ''),
	(@SwordOfSharpnessId, 1, @halberdId, ''),
	(@SwordOfSharpnessId, 1, @longswordId, ''),
	(@SwordOfSharpnessId, 1, @scimitarId, ''),
	(@SwordOfSharpnessId, 1, @whipId, ''),
	(@SwordOfWoundingId, 1, @greatswordId, ''),
	(@SwordOfWoundingId, 1, @longswordId, ''),
	(@SwordOfWoundingId, 1, @rapierId, ''),
	(@SwordOfWoundingId, 1, @scimitarId, ''),
	(@SwordOfWoundingId, 1, @shortswordId, ''),
	(@TridentOfFishCommandId, 1, @tridentId, ''),
	(@ViciousWeaponId, 2, null, 'ITEM_TYPE=WEAPON'),
	(@Plus1WeaponId, 2, null, 'ITEM_TYPE=WEAPON'),
	(@Plus2WeaponId, 2, null, 'ITEM_TYPE=WEAPON'),
	(@Plus3WeaponId, 2, null, 'ITEM_TYPE=WEAPON'),
	(@VopalSwordId, 1, @handaxeId, ''),
	(@VopalSwordId, 1, @sickleId, ''),
	(@VopalSwordId, 1, @battleaxeId, ''),
	(@VopalSwordId, 1, @glaiveId, ''),
	(@VopalSwordId, 1, @greataxeId, ''),
	(@VopalSwordId, 1, @greatswordId, ''),
	(@VopalSwordId, 1, @halberdId, ''),
	(@VopalSwordId, 1, @longswordId, ''),
	(@VopalSwordId, 1, @scimitarId, ''),
	(@VopalSwordId, 1, @whipId, '');

	INSERT INTO `magical_item_attunement_races` (`magical_item_id`, `race_id`) VALUES
	(@DwarvenThrowerId, @dwarfId);

	INSERT INTO `magical_item_attunement_classes` (`magical_item_id`, `class_id`) VALUES
	(@HolyAvengerId, @paladinId),
	(@NecklaceOfPrayerBeadsId, @clericId),
	(@NecklaceOfPrayerBeadsId, @druidId),
	(@NecklaceOfPrayerBeadsId, @paladinId),
	(@RobeOfTheArchmagiId, @sorcererId),
	(@RobeOfTheArchmagiId, @warlockId),
	(@RobeOfTheArchmagiId, @wizardId),
	(@StaffOfCharmingId, @bardId),
	(@StaffOfCharmingId, @clericId),
	(@StaffOfCharmingId, @druidId),
	(@StaffOfCharmingId, @sorcererId),
	(@StaffOfCharmingId, @warlockId),
	(@StaffOfCharmingId, @wizardId),
	(@StaffOfFireId, @druidId),
	(@StaffOfFireId, @sorcererId),
	(@StaffOfFireId, @warlockId),
	(@StaffOfFireId, @wizardId),
	(@StaffOfFrostId, @druidId),
	(@StaffOfFrostId, @sorcererId),
	(@StaffOfFrostId, @warlockId),
	(@StaffOfFrostId, @wizardId),
	(@StaffOfHealingId, @bardId),
	(@StaffOfHealingId, @clericId),
	(@StaffOfHealingId, @druidId),
	(@StaffOfPowerId, @sorcererId),
	(@StaffOfPowerId, @warlockId),
	(@StaffOfPowerId, @wizardId),
	(@StaffOfSwarmingInsectsId, @bardId),
	(@StaffOfSwarmingInsectsId, @clericId),
	(@StaffOfSwarmingInsectsId, @druidId),
	(@StaffOfSwarmingInsectsId, @sorcererId),
	(@StaffOfSwarmingInsectsId, @warlockId),
	(@StaffOfSwarmingInsectsId, @wizardId),
	(@StaffOfTheMagiId, @sorcererId),
	(@StaffOfTheMagiId, @warlockId),
	(@StaffOfTheMagiId, @wizardId),
	(@StaffOfThePythonId, @clericId),
	(@StaffOfThePythonId, @druidId),
	(@StaffOfThePythonId, @warlockId),
	(@StaffOfTheWoodlandsId, @druidId),
	(@StaffOfWitheringId, @clericId),
	(@StaffOfWitheringId, @druidId),
	(@StaffOfWitheringId, @warlockId);

	INSERT INTO `magical_item_attunement_alignments` (`magical_item_id`, `alignment_id`) VALUES
	(@TalismanOfPureGoodId, @LawfulGoodAlignmentId),
	(@TalismanOfPureGoodId, @NeutralGoodAlignmentId),
	(@TalismanOfPureGoodId, @ChaoticGoodAlignmentId),
	(@TalismanOfUltimateEvilId, @LawfulEvilAlignmentId),
	(@TalismanOfUltimateEvilId, @NeutralEvilAlignmentId),
	(@TalismanOfUltimateEvilId, @ChaoticEvilAlignmentId);


	INSERT INTO magical_item_tables (magical_item_id, name) VALUES
	(@RingOfShootingStarsId, ''),
	(@StaffOfPowerId, ''),
	(@StaffOfTheMagiId, ''),
	(@WandOfWonderId, ''),
	(@ApparatusOfTheCrabId, ''),
	(@BagOfBeansId, ''),
	(@BagOfTricksGrayId, ''),
	(@BagOfTricksRustId, ''),
	(@BagOfTricksTanId, ''),
	(@CandleOfInvocationId, ''),
	(@CubeOfForceId, ''),
	(@DeckOfIllusionsId, ''),
	(@DeckOfManyThingsId, ''),
	(@EfreetiBottleId, ''),
	(@IronFlaskId, ''),
	(@ManualOfGolemsId, ''),
	(@NecklaceOfPrayerBeadsId, ''),
	(@RobeOfUsefulItemsId, ''),
	(@SphereOfAnnihilationId, '');

	SET @RingOfShootingStarsTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @RingOfShootingStarsId LIMIT 1);
	SET @StaffOfPowerTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @StaffOfPowerId LIMIT 1);
	SET @StaffOfTheMagiTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @StaffOfTheMagiId LIMIT 1);
	SET @WandOfWonderTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @WandOfWonderId LIMIT 1);
	SET @ApparatusOfTheCrabTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @ApparatusOfTheCrabId LIMIT 1);
	SET @BagOfBeansTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @BagOfBeansId LIMIT 1);
	SET @BagOfTricksGrayTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @BagOfTricksGrayId LIMIT 1);
	SET @BagOfTricksRustTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @BagOfTricksRustId LIMIT 1);
	SET @BagOfTricksTanTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @BagOfTricksTanId LIMIT 1);
	SET @CandleOfInvocationTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @CandleOfInvocationId LIMIT 1);
	SET @CubeOfForceTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @CubeOfForceId LIMIT 1);
	SET @DeckOfIllusionsTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @DeckOfIllusionsId LIMIT 1);
	SET @DeckOfManyThingsTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @DeckOfManyThingsId LIMIT 1);
	SET @EfreetiBottleTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @EfreetiBottleId LIMIT 1);
	SET @IronFlaskTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @IronFlaskId LIMIT 1);
	SET @ManualOfGolemsTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @ManualOfGolemsId LIMIT 1);
	SET @NecklaceOfPrayerBeadsTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @NecklaceOfPrayerBeadsId LIMIT 1);
	SET @RobeOfUsefulItemsTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @RobeOfUsefulItemsId LIMIT 1);
	SET @SphereOfAnnihilationTableId = (SELECT id FROM magical_item_tables WHERE magical_item_id = @SphereOfAnnihilationId LIMIT 1);

	INSERT INTO magical_item_table_cells (table_id, `row_number`, column_number, value) VALUES
	(@RingOfShootingStarsTableId, 0, 0, 'Spheres'),
	(@RingOfShootingStarsTableId, 0, 1, 'Lightning Damage'),
	(@RingOfShootingStarsTableId, 1, 0, '4'),
	(@RingOfShootingStarsTableId, 1, 1, '2d4'),
	(@RingOfShootingStarsTableId, 2, 0, '3'),
	(@RingOfShootingStarsTableId, 2, 1, '2d6'),
	(@RingOfShootingStarsTableId, 3, 0, '2'),
	(@RingOfShootingStarsTableId, 3, 1, '5d4'),
	(@RingOfShootingStarsTableId, 4, 0, '1'),
	(@RingOfShootingStarsTableId, 4, 1, '4d12'),
	(@StaffOfPowerTableId, 0, 0, 'Distance from Origin'),
	(@StaffOfPowerTableId, 0, 1, 'Damage'),
	(@StaffOfPowerTableId, 1, 0, '10 ft. away or closer'),
	(@StaffOfPowerTableId, 1, 1, '8 x the number of charges in the staff'),
	(@StaffOfPowerTableId, 2, 0, '11 to 20 ft. away'),
	(@StaffOfPowerTableId, 2, 1, '6 x the number of charges in the staff'),
	(@StaffOfPowerTableId, 3, 0, '21 to 30 ft. away'),
	(@StaffOfPowerTableId, 3, 1, '4 x the number of charges in the staff'),
	(@StaffOfTheMagiTableId, 0, 0, 'Distance from Origin'),
	(@StaffOfTheMagiTableId, 0, 1, 'Damage'),
	(@StaffOfTheMagiTableId, 1, 0, '10 ft. away or closer'),
	(@StaffOfTheMagiTableId, 1, 1, '8 x the number of charges in the staff'),
	(@StaffOfTheMagiTableId, 2, 0, '11 to 20 ft. away'),
	(@StaffOfTheMagiTableId, 2, 1, '6 x the number of charges in the staff'),
	(@StaffOfTheMagiTableId, 3, 0, '21 to 30 ft. away'),
	(@StaffOfTheMagiTableId, 3, 1, '4 x the number of charges in the staff'),
	(@WandOfWonderTableId, 0, 0, 'd100'),
	(@WandOfWonderTableId, 0, 1, 'Effect'),
	(@WandOfWonderTableId, 1, 0, '01-05'),
	(@WandOfWonderTableId, 1, 1, 'You cast slow.'),
	(@WandOfWonderTableId, 2, 0, '06-10'),
	(@WandOfWonderTableId, 2, 1, 'You cast faerie fire.'),
	(@WandOfWonderTableId, 3, 0, '11-15'),
	(@WandOfWonderTableId, 3, 1, 'You are stunned until the start of your net turn, believing something awesome just happened.'),
	(@WandOfWonderTableId, 4, 0, '16-20'),
	(@WandOfWonderTableId, 4, 1, 'You cst gust of wind.'),
	(@WandOfWonderTableId, 5, 0, '21-25'),
	(@WandOfWonderTableId, 5, 1, 'You cast detect thoughts on the target you chose. If you didn''t target a creature, you instead take 1d6 psychic damage.'),
	(@WandOfWonderTableId, 6, 0, '26-30'),
	(@WandOfWonderTableId, 6, 1, 'You cast stinking cloud.'),
	(@WandOfWonderTableId, 7, 0, '31-33'),
	(@WandOfWonderTableId, 7, 1, 'Heavy rain falls in a 60-foot radius centered on the target. The are becomes lightly obscured. The rain falls until the start of your next turn.'),
	(@WandOfWonderTableId, 8, 0, '34-36'),
	(@WandOfWonderTableId, 8, 1, 'An animal appears in the unoccupied space nearest the target. The animal isn''t under your control and acts as it normally would. Roll a d100 to determine which animal appears. On a 01-25, a rhinoceros appears; on a 26-50, an elephant appears; and on a 51-100, a rat appears.'),
	(@WandOfWonderTableId, 9, 0, '37-46'),
	(@WandOfWonderTableId, 9, 1, 'You cast lightning bolt.'),
	(@WandOfWonderTableId, 10, 0, '47-49'),
	(@WandOfWonderTableId, 10, 1, 'A cloud of 600 oversized butterflies fills a 30-foot radius centered on the target. The area becomes heavily obscured. The butterflies remain for 10 minutes.'),
	(@WandOfWonderTableId, 11, 0, '50-53'),
	(@WandOfWonderTableId, 11, 1, 'You enlarge the target as if you had cast enlarge/reduce. If the target can''t be affected by that spell, or if you didn''t target a creature, you become the target.'),
	(@WandOfWonderTableId, 12, 0, '54-58'),
	(@WandOfWonderTableId, 12, 1, 'You cast darkness.'),
	(@WandOfWonderTableId, 13, 0, '59-62'),
	(@WandOfWonderTableId, 13, 1, 'Grass grows on the ground in a 60-foot radius centered on the target. If grass is already there, it grows to ten times its normal size and remains overgrown for 1 minute.'),
	(@WandOfWonderTableId, 14, 0, '63-65'),
	(@WandOfWonderTableId, 14, 1, 'An object of the GM''s choice disappears into the Ethereal Plane. The object must be neither worn nor carried, withing 120 feet of the target, and no larger than 10 feet in any dimension.'),
	(@WandOfWonderTableId, 15, 0, '66-69'),
	(@WandOfWonderTableId, 15, 1, 'You shrink yourself as if you ahd cast enlarge/reduce on yourself.'),
	(@WandOfWonderTableId, 16, 0, '70-79'),
	(@WandOfWonderTableId, 16, 1, 'You cast fireball.'),
	(@WandOfWonderTableId, 17, 0, '80-84'),
	(@WandOfWonderTableId, 17, 1, 'You cast invisibility on yourself.'),
	(@WandOfWonderTableId, 18, 0, '85-87'),
	(@WandOfWonderTableId, 18, 1, 'Leaves grow from the target. If you choose a point in space as the target, leaves sprout from the creature nearest to that point. Unless they are picked off, the leaves turn brown and fall off after 24 hours.'),
	(@WandOfWonderTableId, 19, 0, '88-90'),
	(@WandOfWonderTableId, 19, 1, 'A stream of 1d4 x 10 gems, each worth 1 gp, shoots from the wand''s tip in a line 30 feet long and 5 feet wide. Each gem deals 1 bludgeoning damage, and the total damage of the gems is divided equally among all creatures in the line.'),
	(@WandOfWonderTableId, 20, 0, '91-95'),
	(@WandOfWonderTableId, 20, 1, 'A burst of colorful shimmering light extends from you in a 30-foot radius. You and each creature in the area that can see must succeed on a DC 15 Constitution saving throw or become blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.'),
	(@WandOfWonderTableId, 21, 0, '96-67'),
	(@WandOfWonderTableId, 21, 1, 'The target''s skin turns bright blue for 1d10 days. If you chose a point in space, the creature nearest to that point is affected.'),
	(@WandOfWonderTableId, 22, 0, '98-00'),
	(@WandOfWonderTableId, 22, 1, 'If you targeted a creature, it must make a DC 15 Constitution saving throw. If you didn''t target a creature, you become the target and must make the saving throw. If the saving throw fails by 5 or more, the target is instantly petrified. On any other failed save, the target is restrained and begins to turn to stone. Whiel restrained in this way, the target must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success. The petrification lasts until the target is freed by the greater restoration spell or similar magic.'),
	(@ApparatusOfTheCrabTableId, 0, 0, 'Lever'),
	(@ApparatusOfTheCrabTableId, 0, 1, 'Up'),
	(@ApparatusOfTheCrabTableId, 0, 2, 'Down'),
	(@ApparatusOfTheCrabTableId, 1, 0, '1'),
	(@ApparatusOfTheCrabTableId, 1, 1, 'Legs and tail extend, allowing the apparatus to walk and swim'),
	(@ApparatusOfTheCrabTableId, 1, 2, 'Legs and tail retract, reducing the apparatus''s speed to 0 and making it unable to benefit from bonuses to speed'),
	(@ApparatusOfTheCrabTableId, 2, 0, '2'),
	(@ApparatusOfTheCrabTableId, 2, 1, 'Forward window shutter opens'),
	(@ApparatusOfTheCrabTableId, 2, 2, 'Forward window shutter closes'),
	(@ApparatusOfTheCrabTableId, 3, 0, '3'),
	(@ApparatusOfTheCrabTableId, 3, 1, 'Side window shutters open (two per side)'),
	(@ApparatusOfTheCrabTableId, 3, 2, 'Side window shutters close (two per side)'),
	(@ApparatusOfTheCrabTableId, 4, 0, '4'),
	(@ApparatusOfTheCrabTableId, 4, 1, 'Two claws extend from the front sides of the apparatus'),
	(@ApparatusOfTheCrabTableId, 4, 2, 'The claws retract'),
	(@ApparatusOfTheCrabTableId, 5, 0, '5'),
	(@ApparatusOfTheCrabTableId, 5, 1, 'Each extended claw makes the following melee weapon attack: +8 to hit, reach 5 ft., one target. Hit: 7 (2d6) bludgeoning damage.'),
	(@ApparatusOfTheCrabTableId, 5, 2, 'Each extended claw makes the following melee weapon attack: +8 to hit, reach 5 ft, one target. Hit: The target is grappeled (escape DC 15)'),
	(@ApparatusOfTheCrabTableId, 6, 0, '6'),
	(@ApparatusOfTheCrabTableId, 6, 1, 'The apparatus walks or swims forward'),
	(@ApparatusOfTheCrabTableId, 6, 2, 'The apparatus walks or swims backward'),
	(@ApparatusOfTheCrabTableId, 7, 0, '7'),
	(@ApparatusOfTheCrabTableId, 7, 1, 'The apparatus turns 90 degrees left.'),
	(@ApparatusOfTheCrabTableId, 7, 2, 'The apparatus turns 90 degrees right.'),
	(@ApparatusOfTheCrabTableId, 8, 0, '8'),
	(@ApparatusOfTheCrabTableId, 8, 1, 'Eyelike fixtures emit bright light in a 30-foot radius and dim light for an additional 30 feet.'),
	(@ApparatusOfTheCrabTableId, 8, 2, 'The light turns off.'),
	(@ApparatusOfTheCrabTableId, 9, 0, '9'),
	(@ApparatusOfTheCrabTableId, 9, 1, 'The apparatus sinks as much as 20 feet in liquid.'),
	(@ApparatusOfTheCrabTableId, 9, 2, 'The apparatus rises up to 20 feet in liquid.'),
	(@ApparatusOfTheCrabTableId, 10, 0, '10'),
	(@ApparatusOfTheCrabTableId, 10, 1, 'The rear hatch unseals and opens.'),
	(@ApparatusOfTheCrabTableId, 10, 2, 'The rear hatch closes and seals.'),
	(@BagOfBeansTableId, 0, 0, 'd100'),
	(@BagOfBeansTableId, 0, 1, 'Effect'),
	(@BagOfBeansTableId, 1, 0, '01'),
	(@BagOfBeansTableId, 1, 1, '5d4 toadstools sprout. If a creature eats a toadstool, roll any die. On an odd roll, the eater must succeed on a DC 15 Constitution saving throw or take 5d6 poison damage and become poisoned for 1 hour. On an even roll, the eater gains 5d6 temporary hit points for 1 hour.'),
	(@BagOfBeansTableId, 2, 0, '02-10'),
	(@BagOfBeansTableId, 2, 1, 'A geyser erupts and spouts water, beer, berry juice, tea, vinegar, wine, or oil (GM’s choice) 30 feet into the air for 1d12 rounds.'),
	(@BagOfBeansTableId, 3, 0, '11-20'),
	(@BagOfBeansTableId, 3, 1, 'A treant sprouts. There’s a 50 percent chance that the treant is chaotic evil and attacks.'),
	(@BagOfBeansTableId, 4, 0, '21-30'),
	(@BagOfBeansTableId, 4, 1, 'An animate, immobile stone statue in your likeness rises. It makes verbal threats against you. If you leave it and others come near, it describes you as the most heinous of villains and directs the newcomers to find and attack you. If you are on the same plane of existence as the statue, it knows where you are. The statue becomes inanimate after 24 hours.'),
	(@BagOfBeansTableId, 5, 0, '31-40'),
	(@BagOfBeansTableId, 5, 1, 'A campfire with blue flames springs forth and burns for 24 hours (or until it is extinguished).'),
	(@BagOfBeansTableId, 6, 0, '41-50'),
	(@BagOfBeansTableId, 6, 1, '1d6 + 6 shriekers sprout'),
	(@BagOfBeansTableId, 7, 0, '51-60'),
	(@BagOfBeansTableId, 7, 1, '1d4 + 8 bright pink toads crawl forth. Whenever a toad is touched, it transforms into a Large or smaller monster of the GM’s choice. The monster remains for 1 minute, then disappears in a puff of bright pink smoke.'),
	(@BagOfBeansTableId, 8, 0, '61-70'),
	(@BagOfBeansTableId, 8, 1, 'A hungry bulette burrows up and attacks.'),
	(@BagOfBeansTableId, 9, 0, '71-80'),
	(@BagOfBeansTableId, 9, 1, 'A fruit tree grows. It has 1d10 + 20 fruit, 1d8 of which act as randomly determined magic potions, while one acts as an ingested poison of the GM’s choice. The tree vanishes after 1 hour. Picked fruit remains, retaining any magic for 30 days.'),
	(@BagOfBeansTableId, 10, 0, '81-90'),
	(@BagOfBeansTableId, 10, 1, 'A nest of 1d4 + 3 eggs springs up. Any creature that eats an egg must make a DC 20 Constitution saving throw. On a successful save, a creature permanently increases its lowest ability score by 1, randomly choosing among equally low scores. On a failed save, the creature takes 10d6 force damage from an internal magical explosion.'),
	(@BagOfBeansTableId, 11, 0, '91-99'),
	(@BagOfBeansTableId, 11, 1, 'A pyramid with a 60-foot-square base bursts upward. Inside is a sarcophagus containing a mummy lord. The pyramid is treated as the mummy lord’s lair, and its sarcophagus contains treasure of the GM’s choice.'),
	(@BagOfBeansTableId, 12, 0, '00'),
	(@BagOfBeansTableId, 12, 1, 'A giant beanstalk sprouts, growing to a height of the GM’s choice. The top leads where the GM chooses, such as to a great view, a cloud giant’s castle, or a different plane of existence.'),
	(@BagOfTricksGrayTableId, 0, 0, 'd8'),
	(@BagOfTricksGrayTableId, 0, 1, 'Creature'),
	(@BagOfTricksGrayTableId, 1, 0, '1'),
	(@BagOfTricksGrayTableId, 1, 1, 'Weasel'),
	(@BagOfTricksGrayTableId, 2, 0, '2'),
	(@BagOfTricksGrayTableId, 2, 1, 'Giant Rat'),
	(@BagOfTricksGrayTableId, 3, 0, '3'),
	(@BagOfTricksGrayTableId, 3, 1, 'Badger'),
	(@BagOfTricksGrayTableId, 4, 0, '4'),
	(@BagOfTricksGrayTableId, 4, 1, 'Boar'),
	(@BagOfTricksGrayTableId, 5, 0, '5'),
	(@BagOfTricksGrayTableId, 5, 1, 'Panther'),
	(@BagOfTricksGrayTableId, 6, 0, '6'),
	(@BagOfTricksGrayTableId, 6, 1, 'Giant Badger'),
	(@BagOfTricksGrayTableId, 7, 0, '7'),
	(@BagOfTricksGrayTableId, 7, 1, 'Dire Wolf'),
	(@BagOfTricksGrayTableId, 8, 0, '8'),
	(@BagOfTricksGrayTableId, 8, 1, 'Giant Elk'),
	(@BagOfTricksRustTableId, 0, 0, 'd8'),
	(@BagOfTricksRustTableId, 0, 1, 'Creature'),
	(@BagOfTricksRustTableId, 1, 0, '1'),
	(@BagOfTricksRustTableId, 1, 1, 'Rat'),
	(@BagOfTricksRustTableId, 2, 0, '2'),
	(@BagOfTricksRustTableId, 2, 1, 'Owl'),
	(@BagOfTricksRustTableId, 3, 0, '3'),
	(@BagOfTricksRustTableId, 3, 1, 'Mastiff'),
	(@BagOfTricksRustTableId, 4, 0, '4'),
	(@BagOfTricksRustTableId, 4, 1, 'Goat'),
	(@BagOfTricksRustTableId, 5, 0, '5'),
	(@BagOfTricksRustTableId, 5, 1, 'Giant Goat'),
	(@BagOfTricksRustTableId, 6, 0, '6'),
	(@BagOfTricksRustTableId, 6, 1, 'Giant Boar'),
	(@BagOfTricksRustTableId, 7, 0, '7'),
	(@BagOfTricksRustTableId, 7, 1, 'Lion'),
	(@BagOfTricksRustTableId, 8, 0, '8'),
	(@BagOfTricksRustTableId, 8, 1, 'Brown Bear'),
	(@BagOfTricksTanTableId, 0, 0, 'd8'),
	(@BagOfTricksTanTableId, 0, 1, 'Creature'),
	(@BagOfTricksTanTableId, 1, 0, '1'),
	(@BagOfTricksTanTableId, 1, 1, 'Jackal'),
	(@BagOfTricksTanTableId, 2, 0, '2'),
	(@BagOfTricksTanTableId, 2, 1, 'Ape'),
	(@BagOfTricksTanTableId, 3, 0, '3'),
	(@BagOfTricksTanTableId, 3, 1, 'Baboon'),
	(@BagOfTricksTanTableId, 4, 0, '4'),
	(@BagOfTricksTanTableId, 4, 1, 'Axe Beak'),
	(@BagOfTricksTanTableId, 5, 0, '5'),
	(@BagOfTricksTanTableId, 5, 1, 'Black Bear'),
	(@BagOfTricksTanTableId, 6, 0, '6'),
	(@BagOfTricksTanTableId, 6, 1, 'Giant Weasel'),
	(@BagOfTricksTanTableId, 7, 0, '7'),
	(@BagOfTricksTanTableId, 7, 1, 'Giant Hyena'),
	(@BagOfTricksTanTableId, 8, 0, '8'),
	(@BagOfTricksTanTableId, 8, 1, 'Tiger'),
	(@CandleOfInvocationTableId, 0, 0, 'd20'),
	(@CandleOfInvocationTableId, 0, 1, 'Alignment'),
	(@CandleOfInvocationTableId, 1, 0, '1-2'),
	(@CandleOfInvocationTableId, 1, 1, 'Chaotic Evil'),
	(@CandleOfInvocationTableId, 2, 0, '3-4'),
	(@CandleOfInvocationTableId, 2, 1, 'Chaotic Neutral'),
	(@CandleOfInvocationTableId, 3, 0, '5-7'),
	(@CandleOfInvocationTableId, 3, 1, 'Chaotic Good'),
	(@CandleOfInvocationTableId, 4, 0, '8-9'),
	(@CandleOfInvocationTableId, 4, 1, 'Neutral Evil'),
	(@CandleOfInvocationTableId, 5, 0, '10-11'),
	(@CandleOfInvocationTableId, 5, 1, 'Neutral'),
	(@CandleOfInvocationTableId, 6, 0, '12-13'),
	(@CandleOfInvocationTableId, 6, 1, 'Neutral Good'),
	(@CandleOfInvocationTableId, 7, 0, '14-15'),
	(@CandleOfInvocationTableId, 7, 1, 'Lawful Evil'),
	(@CandleOfInvocationTableId, 8, 0, '16-17'),
	(@CandleOfInvocationTableId, 8, 1, 'Lawful Neutral'),
	(@CandleOfInvocationTableId, 9, 0, '18-20'),
	(@CandleOfInvocationTableId, 9, 1, 'Lawful Good'),
	(@CubeOfForceTableId, 0, 0, 'Face'),
	(@CubeOfForceTableId, 0, 1, 'Charges'),
	(@CubeOfForceTableId, 0, 2, 'Effect'),
	(@CubeOfForceTableId, 1, 0, '1'),
	(@CubeOfForceTableId, 1, 1, '1'),
	(@CubeOfForceTableId, 1, 2, 'Gases, wind, and fog can’t pass through the barrier.'),
	(@CubeOfForceTableId, 2, 0, '2'),
	(@CubeOfForceTableId, 2, 1, '2'),
	(@CubeOfForceTableId, 2, 2, 'Nonliving matter can’t pass through the barrier. Walls, floors, and ceilings can pass through at your discretion.'),
	(@CubeOfForceTableId, 3, 0, '3'),
	(@CubeOfForceTableId, 3, 1, '3'),
	(@CubeOfForceTableId, 3, 2, 'Living matter can’t pass through the barrier.'),
	(@CubeOfForceTableId, 4, 0, '4'),
	(@CubeOfForceTableId, 4, 1, '4'),
	(@CubeOfForceTableId, 4, 2, 'Spell effects can’t pass through the barrier.'),
	(@CubeOfForceTableId, 5, 0, '5'),
	(@CubeOfForceTableId, 5, 1, '5'),
	(@CubeOfForceTableId, 5, 2, 'Nothing can pass through the barrier. Walls, floors, and ceilings can pass through at your discretion.'),
	(@CubeOfForceTableId, 6, 0, '6'),
	(@CubeOfForceTableId, 6, 1, '0'),
	(@CubeOfForceTableId, 6, 2, 'The barrier deactivates.'),
	(@DeckOfIllusionsTableId, 0, 0, 'Playing Card'),
	(@DeckOfIllusionsTableId, 0, 1, 'Illusion'),
	(@DeckOfIllusionsTableId, 1, 0, 'Ace of Hearts'),
	(@DeckOfIllusionsTableId, 1, 1, 'Red Dragon'),
	(@DeckOfIllusionsTableId, 2, 0, 'King of Hearts'),
	(@DeckOfIllusionsTableId, 2, 1, 'Knight and four Guards'),
	(@DeckOfIllusionsTableId, 3, 0, 'Queen of Hearts'),
	(@DeckOfIllusionsTableId, 3, 1, 'Succubus or Incubus'),
	(@DeckOfIllusionsTableId, 4, 0, 'Jack of Hearts'),
	(@DeckOfIllusionsTableId, 4, 1, 'Druid'),
	(@DeckOfIllusionsTableId, 5, 0, 'Ten of Hearts'),
	(@DeckOfIllusionsTableId, 5, 1, 'Cloud Giant'),
	(@DeckOfIllusionsTableId, 6, 0, 'Nine of Hearts'),
	(@DeckOfIllusionsTableId, 6, 1, 'Ettin'),
	(@DeckOfIllusionsTableId, 7, 0, 'Eight of Hearts'),
	(@DeckOfIllusionsTableId, 7, 1, 'Bugbear'),
	(@DeckOfIllusionsTableId, 8, 0, 'Two of Hearts'),
	(@DeckOfIllusionsTableId, 8, 1, 'Gobln'),
	(@DeckOfIllusionsTableId, 9, 0, 'Ace of Diamonds'),
	(@DeckOfIllusionsTableId, 9, 1, 'Beholder'),
	(@DeckOfIllusionsTableId, 10, 0, 'King of Diamonds'),
	(@DeckOfIllusionsTableId, 10, 1, 'Archmage and mage apprentice'),
	(@DeckOfIllusionsTableId, 11, 0, 'Queen of Diamonds'),
	(@DeckOfIllusionsTableId, 11, 1, 'Night Hag'),
	(@DeckOfIllusionsTableId, 12, 0, 'Jack of Diamonds'),
	(@DeckOfIllusionsTableId, 12, 1, 'Assassin'),
	(@DeckOfIllusionsTableId, 13, 0, 'Ten of Diamonds'),
	(@DeckOfIllusionsTableId, 13, 1, 'Fire Giant'),
	(@DeckOfIllusionsTableId, 14, 0, 'Nine of Diamonds'),
	(@DeckOfIllusionsTableId, 14, 1, 'Ogre Mage'),
	(@DeckOfIllusionsTableId, 15, 0, 'Eight of Diamonds'),
	(@DeckOfIllusionsTableId, 15, 1, 'Gnoll'),
	(@DeckOfIllusionsTableId, 16, 0, 'Two of Diamonds'),
	(@DeckOfIllusionsTableId, 16, 1, 'Kobold'),
	(@DeckOfIllusionsTableId, 17, 0, 'Ace of Spades'),
	(@DeckOfIllusionsTableId, 17, 1, 'Lich'),
	(@DeckOfIllusionsTableId, 18, 0, 'King of Spades'),
	(@DeckOfIllusionsTableId, 18, 1, 'Priest and two acolytes'),
	(@DeckOfIllusionsTableId, 19, 0, 'Queen of Spades'),
	(@DeckOfIllusionsTableId, 19, 1, 'Medusa'),
	(@DeckOfIllusionsTableId, 20, 0, 'Jack of Spades'),
	(@DeckOfIllusionsTableId, 20, 1, 'Veteran'),
	(@DeckOfIllusionsTableId, 21, 0, 'Ten of Spades'),
	(@DeckOfIllusionsTableId, 21, 1, 'Frost Giant'),
	(@DeckOfIllusionsTableId, 22, 0, 'Nine of Spades'),
	(@DeckOfIllusionsTableId, 22, 1, 'Troll'),
	(@DeckOfIllusionsTableId, 23, 0, 'Eight of Spades'),
	(@DeckOfIllusionsTableId, 23, 1, 'Hobgoblin'),
	(@DeckOfIllusionsTableId, 24, 0, 'Two of Spades'),
	(@DeckOfIllusionsTableId, 24, 1, 'Goblin'),
	(@DeckOfIllusionsTableId, 25, 0, 'Ace of Clubs'),
	(@DeckOfIllusionsTableId, 25, 1, 'Iron Golem'),
	(@DeckOfIllusionsTableId, 26, 0, 'King of Clubs'),
	(@DeckOfIllusionsTableId, 26, 1, 'Bandit captin and three bandits'),
	(@DeckOfIllusionsTableId, 27, 0, 'Queen of Clubs'),
	(@DeckOfIllusionsTableId, 27, 1, 'Erinyes'),
	(@DeckOfIllusionsTableId, 28, 0, 'Jack of Clubs'),
	(@DeckOfIllusionsTableId, 28, 1, 'Berserker'),
	(@DeckOfIllusionsTableId, 29, 0, 'Ten of Clubs'),
	(@DeckOfIllusionsTableId, 29, 1, 'Hill Giant'),
	(@DeckOfIllusionsTableId, 30, 0, 'Nine of Clubs'),
	(@DeckOfIllusionsTableId, 30, 1, 'Ogre'),
	(@DeckOfIllusionsTableId, 31, 0, 'Eight of Clubs'),
	(@DeckOfIllusionsTableId, 31, 1, 'Orc'),
	(@DeckOfIllusionsTableId, 32, 0, 'Two of Clubs'),
	(@DeckOfIllusionsTableId, 32, 1, 'Kobold'),
	(@DeckOfIllusionsTableId, 33, 0, 'Jockers (2)'),
	(@DeckOfIllusionsTableId, 33, 1, 'You (the deck''s owner)'),
	(@DeckOfManyThingsTableId, 0, 0, 'Playing Card'),
	(@DeckOfManyThingsTableId, 0, 1, 'Card'),
	(@DeckOfManyThingsTableId, 1, 0, 'Ace of Diamonds'),
	(@DeckOfManyThingsTableId, 1, 1, 'Vizier*'),
	(@DeckOfManyThingsTableId, 2, 0, 'King of Diamonds'),
	(@DeckOfManyThingsTableId, 2, 1, 'Sun'),
	(@DeckOfManyThingsTableId, 3, 0, 'Queen of Diamonds'),
	(@DeckOfManyThingsTableId, 3, 1, 'Moon'),
	(@DeckOfManyThingsTableId, 4, 0, 'Jack of Diamonds'),
	(@DeckOfManyThingsTableId, 4, 1, 'Star'),
	(@DeckOfManyThingsTableId, 5, 0, 'Two of Diamonds'),
	(@DeckOfManyThingsTableId, 5, 1, 'Comet*'),
	(@DeckOfManyThingsTableId, 6, 0, 'Ace of Hearts'),
	(@DeckOfManyThingsTableId, 6, 1, 'The Fates*'),
	(@DeckOfManyThingsTableId, 7, 0, 'King of Hearts'),
	(@DeckOfManyThingsTableId, 7, 1, 'Throne'),
	(@DeckOfManyThingsTableId, 8, 0, 'Queen of Hearts'),
	(@DeckOfManyThingsTableId, 8, 1, 'Key'),
	(@DeckOfManyThingsTableId, 9, 0, 'Jack of Hearts'),
	(@DeckOfManyThingsTableId, 9, 1, 'Kinght'),
	(@DeckOfManyThingsTableId, 10, 0, 'Two of Hearts'),
	(@DeckOfManyThingsTableId, 10, 1, 'Gem*'),
	(@DeckOfManyThingsTableId, 11, 0, 'Ace of Clubs'),
	(@DeckOfManyThingsTableId, 11, 1, 'Talons*'),
	(@DeckOfManyThingsTableId, 12, 0, 'King of Clubs'),
	(@DeckOfManyThingsTableId, 12, 1, 'The Void'),
	(@DeckOfManyThingsTableId, 13, 0, 'Queen of Clubs'),
	(@DeckOfManyThingsTableId, 13, 1, 'Flames'),
	(@DeckOfManyThingsTableId, 14, 0, 'Jack of Clubs'),
	(@DeckOfManyThingsTableId, 14, 1, 'Skull'),
	(@DeckOfManyThingsTableId, 15, 0, 'Two of Clubs'),
	(@DeckOfManyThingsTableId, 15, 1, 'Idiot*'),
	(@DeckOfManyThingsTableId, 16, 0, 'Ace of Spades'),
	(@DeckOfManyThingsTableId, 16, 1, 'Donjon*'),
	(@DeckOfManyThingsTableId, 17, 0, 'King of Spades'),
	(@DeckOfManyThingsTableId, 17, 1, 'Ruin'),
	(@DeckOfManyThingsTableId, 18, 0, 'Queen of Spades'),
	(@DeckOfManyThingsTableId, 18, 1, 'Eurayle'),
	(@DeckOfManyThingsTableId, 19, 0, 'Jack of Spades'),
	(@DeckOfManyThingsTableId, 19, 1, 'Rogue'),
	(@DeckOfManyThingsTableId, 20, 0, 'Two of Spades'),
	(@DeckOfManyThingsTableId, 20, 1, 'Balance*'),
	(@DeckOfManyThingsTableId, 21, 0, 'Joker (with TM)'),
	(@DeckOfManyThingsTableId, 21, 1, 'Fool*'),
	(@DeckOfManyThingsTableId, 22, 0, 'Joker (without TM)'),
	(@DeckOfManyThingsTableId, 22, 1, 'Jester'),
	(@EfreetiBottleTableId, 0, 0, 'd100'),
	(@EfreetiBottleTableId, 0, 1, 'Effect'),
	(@EfreetiBottleTableId, 1, 0, '01-10'),
	(@EfreetiBottleTableId, 1, 1, 'The efreeti attacks you. After fighting for 5 rounds, the efreeti disappears, and the bottle loses its magic.'),
	(@EfreetiBottleTableId, 2, 0, '11-90'),
	(@EfreetiBottleTableId, 2, 1, 'The efreeti serves you for 1 hour, doing as you command. Then the efreeti returns to the bottle, and a new stopper contains it. The stopper can’t be removed for 24 hours. The next two times the bottle is opened, the same effect occurs. If the bottle is opened a fourth time, the efreeti escapes and disappears, and the bottle loses its magic.'),
	(@EfreetiBottleTableId, 3, 0, '91-00'),
	(@EfreetiBottleTableId, 3, 1, 'The efreeti can cast the wish spell three times for you. It disappears when it grants the final wish or after 1 hour, and the bottle loses its magic.'),
	(@IronFlaskTableId, 0, 0, 'd100'),
	(@IronFlaskTableId, 0, 1, 'Contents'),
	(@IronFlaskTableId, 1, 0, '1-50'),
	(@IronFlaskTableId, 1, 1, 'Empty'),
	(@IronFlaskTableId, 2, 0, '51-54'),
	(@IronFlaskTableId, 2, 1, 'Demon (type 1)'),
	(@IronFlaskTableId, 3, 0, '55-58'),
	(@IronFlaskTableId, 3, 1, 'Demon (type 2)'),
	(@IronFlaskTableId, 4, 0, '59-62'),
	(@IronFlaskTableId, 4, 1, 'Demon (type 3)'),
	(@IronFlaskTableId, 5, 0, '63-64'),
	(@IronFlaskTableId, 5, 1, 'Demon (type 4)'),
	(@IronFlaskTableId, 6, 0, '65'),
	(@IronFlaskTableId, 6, 1, 'Demon (type 5)'),
	(@IronFlaskTableId, 7, 0, '66'),
	(@IronFlaskTableId, 7, 1, 'Demon (type 6)'),
	(@IronFlaskTableId, 8, 0, '67'),
	(@IronFlaskTableId, 8, 1, 'Deva'),
	(@IronFlaskTableId, 9, 0, '68-69'),
	(@IronFlaskTableId, 9, 1, 'Devil (greater)'),
	(@IronFlaskTableId, 10, 0, '70-73'),
	(@IronFlaskTableId, 10, 1, 'Devil (lesser)'),
	(@IronFlaskTableId, 11, 0, '74-75'),
	(@IronFlaskTableId, 11, 1, 'Djinni'),
	(@IronFlaskTableId, 12, 0, '76-77'),
	(@IronFlaskTableId, 12, 1, 'Efreeti'),
	(@IronFlaskTableId, 13, 0, '78-83'),
	(@IronFlaskTableId, 13, 1, 'Elemental (any)'),
	(@IronFlaskTableId, 14, 0, '84-86'),
	(@IronFlaskTableId, 14, 1, 'Invisible Stalker'),
	(@IronFlaskTableId, 15, 0, '87-90'),
	(@IronFlaskTableId, 15, 1, 'Night Hag'),
	(@IronFlaskTableId, 16, 0, '91'),
	(@IronFlaskTableId, 16, 1, 'Planetar'),
	(@IronFlaskTableId, 17, 0, '92-95'),
	(@IronFlaskTableId, 17, 1, 'Salamander'),
	(@IronFlaskTableId, 18, 0, '96'),
	(@IronFlaskTableId, 18, 1, 'Solar'),
	(@IronFlaskTableId, 19, 0, '97-99'),
	(@IronFlaskTableId, 19, 1, 'Succubus/Incubus'),
	(@IronFlaskTableId, 20, 0, '00'),
	(@IronFlaskTableId, 20, 1, 'Xorn'),
	(@ManualOfGolemsTableId, 0, 0, 'd20'),
	(@ManualOfGolemsTableId, 0, 1, 'Golem'),
	(@ManualOfGolemsTableId, 0, 2, 'Time'),
	(@ManualOfGolemsTableId, 0, 3, 'Cost'),
	(@ManualOfGolemsTableId, 1, 0, '1-5'),
	(@ManualOfGolemsTableId, 1, 1, 'Clay'),
	(@ManualOfGolemsTableId, 1, 2, '30 days'),
	(@ManualOfGolemsTableId, 1, 3, '65,000 gp'),
	(@ManualOfGolemsTableId, 2, 0, '6-17'),
	(@ManualOfGolemsTableId, 2, 1, 'Flesh'),
	(@ManualOfGolemsTableId, 2, 2, '60 days'),
	(@ManualOfGolemsTableId, 2, 3, '50,000 gp'),
	(@ManualOfGolemsTableId, 3, 0, '18'),
	(@ManualOfGolemsTableId, 3, 1, 'Iron'),
	(@ManualOfGolemsTableId, 3, 2, '120 days'),
	(@ManualOfGolemsTableId, 3, 3, '100,000 gp'),
	(@ManualOfGolemsTableId, 4, 0, '19-20'),
	(@ManualOfGolemsTableId, 4, 1, 'Stone'),
	(@ManualOfGolemsTableId, 4, 2, '90 days'),
	(@ManualOfGolemsTableId, 4, 3, '80,000 gp'),
	(@NecklaceOfPrayerBeadsTableId, 0, 0, 'd20'),
	(@NecklaceOfPrayerBeadsTableId, 0, 1, 'Bead of...'),
	(@NecklaceOfPrayerBeadsTableId, 0, 2, 'Spell'),
	(@NecklaceOfPrayerBeadsTableId, 1, 0, '1-6'),
	(@NecklaceOfPrayerBeadsTableId, 1, 1, 'Blessing'),
	(@NecklaceOfPrayerBeadsTableId, 1, 2, 'Bless'),
	(@NecklaceOfPrayerBeadsTableId, 2, 0, '7-12'),
	(@NecklaceOfPrayerBeadsTableId, 2, 1, 'Curing'),
	(@NecklaceOfPrayerBeadsTableId, 2, 2, 'Cure Wounds (2nd level) or Lesser Restoration'),
	(@NecklaceOfPrayerBeadsTableId, 3, 0, '13-16'),
	(@NecklaceOfPrayerBeadsTableId, 3, 1, 'Favor'),
	(@NecklaceOfPrayerBeadsTableId, 3, 2, 'Greater Restoration'),
	(@NecklaceOfPrayerBeadsTableId, 4, 0, '17-18'),
	(@NecklaceOfPrayerBeadsTableId, 4, 1, 'Smiting'),
	(@NecklaceOfPrayerBeadsTableId, 4, 2, 'Branding Smite'),
	(@NecklaceOfPrayerBeadsTableId, 5, 0, '19'),
	(@NecklaceOfPrayerBeadsTableId, 5, 1, 'Summons'),
	(@NecklaceOfPrayerBeadsTableId, 5, 2, 'Planar Ally'),
	(@NecklaceOfPrayerBeadsTableId, 6, 0, '20'),
	(@NecklaceOfPrayerBeadsTableId, 6, 1, 'Wind Walking'),
	(@NecklaceOfPrayerBeadsTableId, 6, 2, 'Wind Walk'),
	(@RobeOfUsefulItemsTableId, 0, 0, 'd100'),
	(@RobeOfUsefulItemsTableId, 0, 1, 'Patch'),
	(@RobeOfUsefulItemsTableId, 1, 0, '01-08'),
	(@RobeOfUsefulItemsTableId, 1, 1, 'Bag of 100 gp'),
	(@RobeOfUsefulItemsTableId, 2, 0, '09-15'),
	(@RobeOfUsefulItemsTableId, 2, 1, 'Silver coffer (1 foot long, 6 inches wide and deep) worth 500 gp'),
	(@RobeOfUsefulItemsTableId, 3, 0, '16-22'),
	(@RobeOfUsefulItemsTableId, 3, 1, 'Iron door (up to 10 feet wide and 10 feet high, barred on one side of your choice), which you can place in an opening you can reach; it conforms to fit the opening, attaching and hinging itself'),
	(@RobeOfUsefulItemsTableId, 4, 0, '23-30'),
	(@RobeOfUsefulItemsTableId, 4, 1, '10 gems worth 100 gp each'),
	(@RobeOfUsefulItemsTableId, 5, 0, '31-44'),
	(@RobeOfUsefulItemsTableId, 5, 1, 'Wooden ladder (24 feet long)'),
	(@RobeOfUsefulItemsTableId, 6, 0, '45-51'),
	(@RobeOfUsefulItemsTableId, 6, 1, 'A riding horse with saddle bags'),
	(@RobeOfUsefulItemsTableId, 7, 0, '52-59'),
	(@RobeOfUsefulItemsTableId, 7, 1, 'Pit (a cube 10 feet on a side), which you can place on the ground within 10 feet of you'),
	(@RobeOfUsefulItemsTableId, 8, 0, '60-68'),
	(@RobeOfUsefulItemsTableId, 8, 1, '4 potions of healing'),
	(@RobeOfUsefulItemsTableId, 9, 0, '69-75'),
	(@RobeOfUsefulItemsTableId, 9, 1, 'Rowboat (12 feet long)'),
	(@RobeOfUsefulItemsTableId, 10, 0, '76-83'),
	(@RobeOfUsefulItemsTableId, 10, 1, 'Spell scroll containing one spell of 1st to 3rd level'),
	(@RobeOfUsefulItemsTableId, 11, 0, '84-90'),
	(@RobeOfUsefulItemsTableId, 11, 1, '2 mastiffs'),
	(@RobeOfUsefulItemsTableId, 12, 0, '91-96'),
	(@RobeOfUsefulItemsTableId, 12, 1, 'Window (2 feet by 4 feet, up to 2 feet deep), which you can place on a vertical surface you can reach'),
	(@RobeOfUsefulItemsTableId, 13, 0, '97-00'),
	(@RobeOfUsefulItemsTableId, 13, 1, 'Portable ram'),
	(@SphereOfAnnihilationTableId, 0, 0, 'd100'),
	(@SphereOfAnnihilationTableId, 0, 1, 'Result'),
	(@SphereOfAnnihilationTableId, 1, 0, '01-50'),
	(@SphereOfAnnihilationTableId, 1, 1, 'The sphere is destroyed.'),
	(@SphereOfAnnihilationTableId, 2, 0, '51-85'),
	(@SphereOfAnnihilationTableId, 2, 1, 'The sphere moves through the portal or into the extradimensional space.'),
	(@SphereOfAnnihilationTableId, 3, 0, '86-00'),
	(@SphereOfAnnihilationTableId, 3, 1, 'A spatial rift sends each creature and object within 180 feet of the sphere, including the sphere, to a random plane of existence.');
END;;

DELIMITER ;

CALL EmptyDB();
CALL Squire_Defaults(0);
CALL SquireMagicalItemDefaults(0);
CALL User_Defaults(1);
