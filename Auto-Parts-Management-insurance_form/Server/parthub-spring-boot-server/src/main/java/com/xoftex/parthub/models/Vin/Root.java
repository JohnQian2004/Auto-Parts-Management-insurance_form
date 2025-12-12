package com.xoftex.parthub.models.Vin;

import java.util.ArrayList;

// import com.fasterxml.jackson.databind.ObjectMapper; // version 2.11.1
// import com.fasterxml.jackson.annotation.JsonProperty; // version 2.11.1
/* ObjectMapper om = new ObjectMapper();
Root root = om.readValue(myJsonString, Root.class);
 */

public class Root {
    public Make make;
    public Model model;
    public Engine engine;
    public Transmission transmission;
    public String drivenWheels;
    public String numOfDoors;
    public ArrayList<Option> options;
    public ArrayList<Color> colors;
    public Price price;
    public Categories categories;
    public String squishVin;
    public ArrayList<Year> years;
    public String matchingType;
    public Mpg mpg;
}
