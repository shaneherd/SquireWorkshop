package com.herd.squire.models.paddle;

public class PaddleProduct {
    private int id;
    private String name;
    private String description;
    private double price;
    private int credits;
    private long productId;
    private long subscriptionPlanId;

    public PaddleProduct(int id, String name, String description, double price, int credits,
                         long productId, long subscriptionPlanId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.credits = credits;
        this.productId = productId;
        this.subscriptionPlanId = subscriptionPlanId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public long getProductId() {
        return productId;
    }

    public void setProductId(long productId) {
        this.productId = productId;
    }

    public long getSubscriptionPlanId() {
        return subscriptionPlanId;
    }

    public void setSubscriptionPlanId(long subscriptionPlanId) {
        this.subscriptionPlanId = subscriptionPlanId;
    }
}
