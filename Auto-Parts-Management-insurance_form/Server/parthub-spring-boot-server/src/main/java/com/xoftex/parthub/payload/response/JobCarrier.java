package com.xoftex.parthub.payload.response;
import com.xoftex.parthub.models.Vehicle;

import java.util.ArrayList;
import java.util.List;

public class JobCarrier {
    public Long employeeId;
    public List<Vehicle> vehicles = new ArrayList<Vehicle>();
}
