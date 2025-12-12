package com.xoftex.parthub.models;

import java.util.Date;

public class SearchCarrier {

    public int type;

    public int year;
    public String make;
    public String model;
    public String color;

    public int location;
    
    public String partName;

    public String partNumber;
    public String zipcode;

    public int pageNumber;
    public int pageSize;

    public int companyId;
    public int userId;
    public boolean archived = false;

    public int status;

    public int mode;

    public boolean published;

    public boolean withFitment;

    public String lastName;
   

    public String serviceName;
    public long serviceTypeId;
    
    public boolean viewed;

    public Date date;
}
