package com.xoftex.parthub.models.RepairMenu;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class RepairMenuResponse {
    @SerializedName("repair_menu")
    public RepairMenu repairMenu;

    public static class RepairMenu {
        @SerializedName("repair_request")
        public String repairRequest;

        public List<Section> sections;
    }

    public static class Section {
        public String title;

        // For flexibility, use Object here and cast as needed
        public List<Object> items;
    }

    // Used for sections with standard repair tasks
    public static class RepairTask {
        public String description;
        public String details; // optional
        @SerializedName("labor_hours")
        public Double laborHours;
    }

    // Used for fluid section
    public static class FluidItem {
        public String type;
        public String spec;
        @SerializedName("quantity_quarts")
        public Double quantityQuarts;
        @SerializedName("quantity_gallons")
        public Double quantityGallons;
        @SerializedName("part_number")
        public String partNumber;
    }

    // Used for estimate summary section
    public static class EstimateItem {
        public String item;
        @SerializedName("estimated_cost_usd_fron")
        public Double estimatedCostUsdFrom;
        @SerializedName("estimated_cost_usd_to")
        public Double estimatedCostUsdTo;
    }
}
