package com.xoftex.parthub.payload.response;

import com.xoftex.parthub.models.InsuranceClaim;
import com.xoftex.parthub.models.InsuranceDocument;
import com.xoftex.parthub.models.Vehicle;

import java.util.ArrayList;
import java.util.List;

public class InsuranceClaimViewResponse {
    public Vehicle vehicle;
    public List<InsuranceClaim> insuranceClaims = new ArrayList<InsuranceClaim>();
    public List<InsuranceDocument> documents = new ArrayList<InsuranceDocument>();
}
