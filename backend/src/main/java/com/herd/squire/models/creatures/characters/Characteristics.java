package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.ListObject;

public class Characteristics {
    private String height;
    private String eyes;
    private String hair;
    private String skin;
    private Gender gender;
    private int age;
    private double weight;
    private ListObject deity;

    public Characteristics() {}

    public Characteristics(String height, String eyes, String hair, String skin, Gender gender, int age, double weight,
                           ListObject deity) {
        this.height = height;
        this.eyes = eyes;
        this.hair = hair;
        this.skin = skin;
        this.gender = gender;
        this.age = age;
        this.weight = weight;
        this.deity = deity;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getEyes() {
        return eyes;
    }

    public void setEyes(String eyes) {
        this.eyes = eyes;
    }

    public String getHair() {
        return hair;
    }

    public void setHair(String hair) {
        this.hair = hair;
    }

    public String getSkin() {
        return skin;
    }

    public void setSkin(String skin) {
        this.skin = skin;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public ListObject getDeity() {
        return deity;
    }

    public void setDeity(ListObject deity) {
        this.deity = deity;
    }
}
