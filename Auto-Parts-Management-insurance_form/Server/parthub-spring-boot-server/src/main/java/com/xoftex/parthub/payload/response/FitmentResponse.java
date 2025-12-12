package com.xoftex.parthub.payload.response;
import com.xoftex.parthub.models.Fitment;
 

import java.util.ArrayList;
import java.util.List;

public class FitmentResponse {
    public String message;
    public List<Fitment> data = new ArrayList<Fitment>();
}
