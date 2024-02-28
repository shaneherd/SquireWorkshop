package com.herd.squire.models.paddle.api;

public class PaddlePaymentInformationApi {
    private String payment_method;
    private String card_type;
    private String last_four_digits;
    private String expiry_date;

    public PaddlePaymentInformationApi() { }

    public PaddlePaymentInformationApi(String payment_method, String card_type, String last_four_digits, String expiry_date) {
        this.payment_method = payment_method;
        this.card_type = card_type;
        this.last_four_digits = last_four_digits;
        this.expiry_date = expiry_date;
    }

    public String getPayment_method() {
        return payment_method;
    }

    public void setPayment_method(String payment_method) {
        this.payment_method = payment_method;
    }

    public String getCard_type() {
        return card_type;
    }

    public void setCard_type(String card_type) {
        this.card_type = card_type;
    }

    public String getLast_four_digits() {
        return last_four_digits;
    }

    public void setLast_four_digits(String last_four_digits) {
        this.last_four_digits = last_four_digits;
    }

    public String getExpiry_date() {
        return expiry_date;
    }

    public void setExpiry_date(String expiry_date) {
        this.expiry_date = expiry_date;
    }
}
