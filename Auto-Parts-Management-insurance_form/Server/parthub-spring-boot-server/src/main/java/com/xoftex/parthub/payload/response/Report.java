package com.xoftex.parthub.payload.response;

import java.util.List;
import com.xoftex.parthub.models.GroupBy;

public class Report {

    public String label;
    public List<GroupBy> data;
    public Long counts;
}
