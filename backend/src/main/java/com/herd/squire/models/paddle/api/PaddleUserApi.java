package com.herd.squire.models.paddle.api;

public class PaddleUserApi {
    private long subscription_id;
    private long plan_id;
    private long user_id;
    private String user_email;
    private boolean marketing_consent;
    private String update_url;
    private String cancel_url;
    private String state;
    private String signup_date;
    private int quantity;
    private PaddlePaymentApi last_payment;
    private PaddlePaymentInformationApi payment_information;
    private PaddlePaymentApi next_payment;

    public PaddleUserApi() {}

    public PaddleUserApi(long subscription_id, long plan_id, long user_id, String user_email, boolean marketing_consent,
                         String update_url, String cancel_url, String state, String signup_date, int quantity,
                         PaddlePaymentApi last_payment, PaddlePaymentInformationApi payment_information,
                         PaddlePaymentApi next_payment) {
        this.subscription_id = subscription_id;
        this.plan_id = plan_id;
        this.user_id = user_id;
        this.user_email = user_email;
        this.marketing_consent = marketing_consent;
        this.update_url = update_url;
        this.cancel_url = cancel_url;
        this.state = state;
        this.signup_date = signup_date;
        this.quantity = quantity;
        this.last_payment = last_payment;
        this.payment_information = payment_information;
        this.next_payment = next_payment;
    }

    public long getSubscription_id() {
        return subscription_id;
    }

    public void setSubscription_id(long subscription_id) {
        this.subscription_id = subscription_id;
    }

    public long getPlan_id() {
        return plan_id;
    }

    public void setPlan_id(long plan_id) {
        this.plan_id = plan_id;
    }

    public long getUser_id() {
        return user_id;
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    public String getUser_email() {
        return user_email;
    }

    public void setUser_email(String user_email) {
        this.user_email = user_email;
    }

    public boolean isMarketing_consent() {
        return marketing_consent;
    }

    public void setMarketing_consent(boolean marketing_consent) {
        this.marketing_consent = marketing_consent;
    }

    public String getUpdate_url() {
        return update_url;
    }

    public void setUpdate_url(String update_url) {
        this.update_url = update_url;
    }

    public String getCancel_url() {
        return cancel_url;
    }

    public void setCancel_url(String cancel_url) {
        this.cancel_url = cancel_url;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getSignup_date() {
        return signup_date;
    }

    public void setSignup_date(String signup_date) {
        this.signup_date = signup_date;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public PaddlePaymentApi getLast_payment() {
        return last_payment;
    }

    public void setLast_payment(PaddlePaymentApi last_payment) {
        this.last_payment = last_payment;
    }

    public PaddlePaymentInformationApi getPayment_information() {
        return payment_information;
    }

    public void setPayment_information(PaddlePaymentInformationApi payment_information) {
        this.payment_information = payment_information;
    }

    public PaddlePaymentApi getNext_payment() {
        return next_payment;
    }

    public void setNext_payment(PaddlePaymentApi next_payment) {
        this.next_payment = next_payment;
    }
}
