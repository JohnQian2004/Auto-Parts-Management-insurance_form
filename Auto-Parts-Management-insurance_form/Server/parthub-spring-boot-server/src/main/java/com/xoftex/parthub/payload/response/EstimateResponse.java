package com.xoftex.parthub.payload.response;

import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Claim;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.Receipt;

import java.util.ArrayList;
import java.util.List;

public class EstimateResponse {
    public String message;
    public List<Claim> estimates = new ArrayList<Claim>();
    // public List<Autopart> autoparts = new ArrayList<Autopart>();
    // public List<Job> jobs = new ArrayList<Job>();
    public List<Receipt> receipts = new ArrayList<Receipt>();
}
