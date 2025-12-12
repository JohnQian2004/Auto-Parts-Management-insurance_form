package com.xoftex.parthub.payload.request;

import java.util.ArrayList;
import java.util.List;

public class EstimateRequest {

    public long vehicleId;
    // public int year;
    // public String make;
    // public String model;
    public List<Integer> images = new ArrayList<Integer>();
    public String workRequest;

}
