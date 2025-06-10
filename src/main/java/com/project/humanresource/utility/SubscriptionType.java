package com.project.humanresource.utility;

public enum SubscriptionType {
    MONTHLY(1),
    YEARLY(12),
    QUARTERLY(3),
    HALFYEARLY(6),
    TRIAL(0);


    private final int months;
    SubscriptionType(int months) {
        this.months = months;
    }

    public int getMonths() {
        return months;
    }
}
