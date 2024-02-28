package com.herd.squire.utilities;

import com.herd.squire.services.SubscriptionService;

import java.io.IOException;

public class SquireKeyGenerator {
    public static void main(String[] args) {
        String count = args[0];
        String credits = args[1];
        System.out.println("count: " + count + " credits: " + credits);

        try {
            new SubscriptionService().generateKeys(Integer.parseInt(count), Integer.parseInt(credits));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
