package com.herd.squire.models.items;

public class CostUnit {
    private String id;
    private String name;
    private String abbreviation;
    private String conversionUnitId;
    private int conversionAmount;
    private double weight;

    public CostUnit() {}

    public CostUnit(String id, String name, String abbreviation, String conversionUnitId, int conversionAmount, double weight) {
        this.id = id;
        this.name = name;
        this.abbreviation = abbreviation;
        this.conversionUnitId = conversionUnitId;
        this.conversionAmount = conversionAmount;
        this.weight = weight;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getConversionUnitId() {
        return conversionUnitId;
    }

    public void setConversionUnitId(String conversionUnitId) {
        this.conversionUnitId = conversionUnitId;
    }

    public int getConversionAmount() {
        return conversionAmount;
    }

    public void setConversionAmount(int conversionAmount) {
        this.conversionAmount = conversionAmount;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}
