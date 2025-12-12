package com.xoftex.parthub.models;

import java.util.List;

public class DayDataCarrier {
    private String dayName;  // e.g., "Monday"
    private String date;     // e.g., "0610" (Jun.10)
    private List<Payment> data;

    // Constructor
    public DayDataCarrier(String dayName, String date, List<Payment> data) {
        this.dayName = dayName;
        this.date = date;
        this.data = data;
    }

    // Getters and Setters
    public String getDayName() {
        return dayName;
    }

    public void setDayName(String dayName) {
        this.dayName = dayName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<Payment> getData() {
        return data;
    }

    public void setData(List<Payment> data) {
        this.data = data;
    }
}
