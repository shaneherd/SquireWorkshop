package com.herd.squire.models.paddle;

public class PaddlePayment {
    private long id;
    private long subscription_id;
    private double amount;
    private String currency;
    private String payout_date;
    private int is_paid;
    private boolean is_one_off_charge;
    private String receipt_url;

    public PaddlePayment() { }

    public PaddlePayment(long id, long subscription_id, double amount, String currency, String payout_date, int is_paid,
                         boolean is_one_off_charge, String receipt_url) {
        this.id = id;
        this.subscription_id = subscription_id;
        this.amount = amount;
        this.currency = currency;
        this.payout_date = payout_date;
        this.is_paid = is_paid;
        this.is_one_off_charge = is_one_off_charge;
        this.receipt_url = receipt_url;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getSubscription_id() {
        return subscription_id;
    }

    public void setSubscription_id(long subscription_id) {
        this.subscription_id = subscription_id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPayout_date() {
        return payout_date;
    }

    public void setPayout_date(String payout_date) {
        this.payout_date = payout_date;
    }

    public int getIs_paid() {
        return is_paid;
    }

    public void setIs_paid(int is_paid) {
        this.is_paid = is_paid;
    }

    public boolean getIs_one_off_charge() {
        return is_one_off_charge;
    }

    public void setIs_one_off_charge(boolean is_one_off_charge) {
        this.is_one_off_charge = is_one_off_charge;
    }

    public String getReceipt_url() {
        return receipt_url;
    }

    public void setReceipt_url(String receipt_url) {
        this.receipt_url = receipt_url;
    }
}
