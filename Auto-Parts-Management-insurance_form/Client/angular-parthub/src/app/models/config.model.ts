
export class Config {

    market_only: boolean = false;

    //baseUrl: any = "http://localhost:8080/api";

    // baseUrl: any = "https://localhost:8444/api";
    // websoketAddress: any = "wss://localhost:8443/ws/notes"

    baseUrl: any = "https://50.76.0.89:8444/api";
    websoketAddress: any = "wss:/50.76.0.89:8445/ws/notes";

    // baseUrl: any = "https://50.76.0.85:8444/api";
    // websoketAddress: any = "wss:/50.76.0.85:8445/ws/notes";

    // baseUrl: any = "https://baycounter.com:8443/api";
    // websoketAddress: any = "wss:/baycounter.com:8443/ws/notes";

    domainName = "BayCounter.com";
    //domainName = "PartsLinks.com";
    //domainSlogan = "Auto parts market, buy, sell new and used auto parts";
    domainSlogan = "Auto Repair & Collision Shop Management Platform";
    ogUrl: any = "https://www.baycounter.com";
    ogTitle: any = "BayCounter.com: Auto Repair & Collision Shop Management Platform";
    siteTitle: any = "BayCounter.com: Auto Repair & Collision Shop Management Platform";
    twitterSite: any = "BayCounter.com: Auto Repair & Collision Shop Management Platform";

    // baseUrl: any = "https://partslinks.com:8443/api";
    // websoketAddress: any = "wss:/partslinks.com:8443/ws/notes"

    // ogUrl: any = "https://www.Partslinks.com";
    // ogTitle: any = "Partslinks.com: Auto parts market";
    // siteTitle: any = "Partslinks.com: Auto parts market";
    // baseUrl: any = "https://partslinks.com:8443/api";
    // websoketAddress: any = "wss:/partslinks.com:8443/ws/notes"

    // baseUrl: any = "https://baycounter.com:8443/api";
    // websoketAddress: any = "wss:/baycounter.com:8443/ws/notes"





    // baseUrl: any = "https://50.76.0.83:8443/api";
    // websoketAddress: any = "wss:/50.76.0.83:8443/ws/notes"

    // baseUrl: any = "https://partslinks.com:8443/api";
    // websoketAddress: any = "wss:/partslinks.com:8443/ws/notes"


    // baseUrl: any = "https://50.186.250.250:8443/api";
    // websoketAddress: any = "wss://50.186.250.250:8443/ws/notes"

    // baseUrl: any = "https://parthut.com:8443/api";
    // websoketAddress: any = "wss://parthut.com:8443/ws/notes"

    noMainPageToken: any = "b8d4e64f-061e-40b2-824f-4107a58b91ab";

    consoleLog = true;
    //baseUrl: any = "http://50.186.250.250:8080/api";
    //baseUrl: any = "http://50.186.250.251:8080/api";
    //baseUrl: any = "https://parthut.com:8443/api";
    //baseUrl: any = "https://parthut.com:8444/api";
    //baseUrl: any = "https://50.186.250.250:8443/api";
    //baseUrl: any = "https://parthut.com:8443/api";
    //baseUrl: any = "https://parthut.com:8444/api";
    //baseUrlQR: any = "http://localhost:8501/?vid=";
    //baseUrlQR: any = "http://50.186.250.250:8501/?vid=";
    baseUrlQR: any = "http://parthut.com:8501/?vid=";

    optionsMinWidth = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]; //px

    optionsColumnInfo = [
        {
            id: 0, sequenceNumber: 0, enabled: true, name: 'id', comments: "Image", header: "Image",
            width: 100, tooltip: "Arravial Date", fieldName: "id", collection: false, color: "black"
        },
        {
            id: 0, sequenceNumber: 1, enabled: true, name: 'year', comments: "year", header: "Year",
            width: 50, tooltip: "Year", fieldName: "year", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 2, enabled: true, name: 'make', comments: "make", header: "Make",
            width: 50, tooltip: "Make", fieldName: "make", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 3, enabled: true, name: 'model', comments: "model", header: "Model",
            width: 100, tooltip: "Model", fieldName: "model", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 4, enabled: true, name: 'color', comments: "color", header: "Color",
            width: 100, tooltip: "Color", fieldName: "color", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 5, enabled: true, name: 'customer', comments: "customer info", header: "Customer",
            width: 100, tooltip: "Customer Last Name", fieldName: "customer", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 6, enabled: true, name: 'phone', comments: "customer phone", header: "Phone",
            width: 100, tooltip: "Customer phone", fieldName: "phone", collection: false, color: "black"
        },


        {
            id: 0, sequenceNumber: 7, enabled: true, name: 'price', comments: "price", header: "Estimate",
            width: 100, tooltip: "Estimates(wiwth supplement)", fieldName: "price", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 8, enabled: true, name: 'job type', comments: "job type", header: "Job Type",
            width: 100, tooltip: "Job Type", fieldName: "jobRequestType", collection: true, color: "black"
        },


        {
            id: 0, sequenceNumber: 9, enabled: true, name: 'status', comments: "status", header: "Status",
            width: 100, tooltip: "Status", fieldName: "status", collection: true, color: "black"
        },

        {
            id: 0, sequenceNumber: 10, enabled: true, name: 'assigned', comments: "assigned to", header: "Assigned To",
            width: 100, tooltip: "Assigned To", fieldName: "assignedTo", collection: true, color: "black"
        },


        {
            id: 0, sequenceNumber: 11, enabled: true, name: 'paid', comments: "paid/not paid", header: "$",
            width: 50, tooltip: "paid/not paid", fieldName: "paid", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 12, enabled: true, name: 'createdAt', comments: "Arrival Date", header: "Arrival",
            width: 100, tooltip: "Arrival Date", fieldName: "createdAt", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 13, enabled: false, name: 'updatedAt', comments: "Last Update Date", header: "Last Update",
            width: 100, tooltip: "Last Update Date", fieldName: "updatedAt", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 14, enabled: false, name: 'lastUpdateObjectName', comments: "Last Update Info", header: "Last Update Info",
            width: 100, tooltip: "Last Update Info", fieldName: "lastUpdateObjectName", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 15, enabled: false, name: 'targetDateCountDown', comments: "target date count down", header: "Due Day",
            width: 100, tooltip: "Count Down", fieldName: "targetDateCountDown", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 16, enabled: false, name: 'rentalCountDown', comments: "rental date count down", header: "Rental",
            width: 100, tooltip: "Rental Count Down", fieldName: "rentalCountDown", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 17, enabled: true, name: 'Parking location', comments: "parking location", header: "Parking",
            width: 100, tooltip: "Parking Location", fieldName: "location", collection: true, color: "black"
        },

        {
            id: 0, sequenceNumber: 18, enabled: true, name: 'key location', comments: "key location", header: "Key Location",
            width: 100, tooltip: "Key Location", fieldName: "keyLocation", collection: true, color: "black"
        },


        {
            id: 0, sequenceNumber: 19, enabled: false, name: 'approval status', comments: "approval status", header: "Approval",
            width: 100, tooltip: "Approval Status", fieldName: "approvalStatus", collection: true, color: "black"
        },

        {
            id: 0, sequenceNumber: 20, enabled: false, name: 'vin', comments: "VIN", header: "VIN",
            width: 100, tooltip: "VIN", fieldName: "vin", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 21, enabled: false, name: 'insurance Company', comments: "insurance company", header: "Insurance",
            width: 100, tooltip: "Insurance Company", fieldName: "insuranceCompany", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 22, enabled: false, name: 'vip', comments: "vip", header: "VIP",
            width: 100, tooltip: "VIP", fieldName: "vip", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 23, enabled: false, name: 'loanerCarName', comments: "Rental Company Name", header: "Rental Com.",
            width: 100, tooltip: "Rental Company Name", fieldName: "loanerCarName", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 24, enabled: false, name: 'daysInShop', comments: "days in shop", header: "DIS",
            width: 100, tooltip: "Days In Shop", fieldName: "daysInShop", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 25, enabled: false, name: 'comments', comments: "notes", header: "Notes",
            width: 100, tooltip: "Notes", fieldName: "comments", collection: false, color: "black"
        },

        {
            id: 0, sequenceNumber: 26, enabled: true, name: 'serviceManager', comments: "service manager", header: "SM",
            width: 100, tooltip: "Service Manager", fieldName: "serviceManager", collection: true, color: "black"
        },

    ];
    optionsMake = [
        "not selected",
        "Acura", "Alfa Romeo", "Audi",
        "Bentley", "BMW", "Bugatti", "Buick",
        "Cadillac", "Chevrolet", "Chrysler", "Citroën",
        "Dacia", "Daewoo", "Dodge",
        "Ferrari", "Fiat", "Ford",
        "Genesis", "Geo", "GMC",
        "Honda", "Hummer", "Hyundai",
        "Infiniti", "Isuzu",
        "Jaguar", "Jeep",
        "Kia",
        "Land Rover", "Lamborghini", "Lexus", "Lincoln", "Lotus",
        "Maserati", "Mazda", "Mclaren", "Mercedes-Benz", "Mercury", "Mini", "Mitsubishi",
        "Nissan",
        "Oldsmobile", "Opel",
        "Peugeot", "Plymouth", "Pontiac", "Porsche",
        "Ram", "Renault", "Rolls Royce",
        "Saab", "Saturn", "Scion", "Seat", "Škoda", "Smart", "Subaru", "Suzuki",
        "Tesla", "Toyota",
        "Volkswagen", "Volvo"
    ];

    optionsStates = [
        {
            "name": "Alabama",
            "code": "AL"
        },
        {
            "name": "Alaska",
            "code": "AK"
        },
        {
            "name": "American Samoa",
            "code": "AS"
        },
        {
            "name": "Arizona",
            "code": "AZ"
        },
        {
            "name": "Arkansas",
            "code": "AR"
        },
        {
            "name": "California",
            "code": "CA"
        },
        {
            "name": "Colorado",
            "code": "CO"
        },
        {
            "name": "Connecticut",
            "code": "CT"
        },
        {
            "name": "Delaware",
            "code": "DE"
        },
        {
            "name": "District Of Columbia",
            "code": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "code": "FM"
        },
        {
            "name": "Florida",
            "code": "FL"
        },
        {
            "name": "Georgia",
            "code": "GA"
        },
        {
            "name": "Guam",
            "code": "GU"
        },
        {
            "name": "Hawaii",
            "code": "HI"
        },
        {
            "name": "Idaho",
            "code": "ID"
        },
        {
            "name": "Illinois",
            "code": "IL"
        },
        {
            "name": "Indiana",
            "code": "IN"
        },
        {
            "name": "Iowa",
            "code": "IA"
        },
        {
            "name": "Kansas",
            "code": "KS"
        },
        {
            "name": "Kentucky",
            "code": "KY"
        },
        {
            "name": "Louisiana",
            "code": "LA"
        },
        {
            "name": "Maine",
            "code": "ME"
        },
        {
            "name": "Marshall Islands",
            "code": "MH"
        },
        {
            "name": "Maryland",
            "code": "MD"
        },
        {
            "name": "Massachusetts",
            "code": "MA"
        },
        {
            "name": "Michigan",
            "code": "MI"
        },
        {
            "name": "Minnesota",
            "code": "MN"
        },
        {
            "name": "Mississippi",
            "code": "MS"
        },
        {
            "name": "Missouri",
            "code": "MO"
        },
        {
            "name": "Montana",
            "code": "MT"
        },
        {
            "name": "Nebraska",
            "code": "NE"
        },
        {
            "name": "Nevada",
            "code": "NV"
        },
        {
            "name": "New Hampshire",
            "code": "NH"
        },
        {
            "name": "New Jersey",
            "code": "NJ"
        },
        {
            "name": "New Mexico",
            "code": "NM"
        },
        {
            "name": "New York",
            "code": "NY"
        },
        {
            "name": "North Carolina",
            "code": "NC"
        },
        {
            "name": "North Dakota",
            "code": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "code": "MP"
        },
        {
            "name": "Ohio",
            "code": "OH"
        },
        {
            "name": "Oklahoma",
            "code": "OK"
        },
        {
            "name": "Oregon",
            "code": "OR"
        },
        {
            "name": "Palau",
            "code": "PW"
        },
        {
            "name": "Pennsylvania",
            "code": "PA"
        },
        {
            "name": "Puerto Rico",
            "code": "PR"
        },
        {
            "name": "Rhode Island",
            "code": "RI"
        },
        {
            "name": "South Carolina",
            "code": "SC"
        },
        {
            "name": "South Dakota",
            "code": "SD"
        },
        {
            "name": "Tennessee",
            "code": "TN"
        },
        {
            "name": "Texas",
            "code": "TX"
        },
        {
            "name": "Utah",
            "code": "UT"
        },
        {
            "name": "Vermont",
            "code": "VT"
        },
        {
            "name": "Virgin Islands",
            "code": "VI"
        },
        {
            "name": "Virginia",
            "code": "VA"
        },
        {
            "name": "Washington",
            "code": "WA"
        },
        {
            "name": "West Virginia",
            "code": "WV"
        },
        {
            "name": "Wisconsin",
            "code": "WI"
        },
        {
            "name": "Wyoming",
            "code": "WY"
        }
    ];
    optionsAutoparts = [
        "A Pillar",
        "A Pillar Trim",
        "A/C Bracket",
        "A/C Compressor",
        "A/C Compressor Clutch Only",
        "A/C Condenser",
        "A/C Condenser Fan",
        "A/C Control Computer",
        "A/C Evaporator",
        "A/C Evaporator Housing only",
        "A/C Heater Control (see also Radio or TV Screen)",
        "A/C Hose",
        "A/C Wiring Harness",
        "Accelerator Cable",
        "Accelerator Parts",
        "Adaptive Cruise Projector",
        "Air Bag",
        "Air Bag Clockspring",
        "Air Bag Ctrl Module",
        "Air Box/Air Cleaner",
        "Air Cond./Heater Vents",
        "Air Flow Meter",
        "Air Pump",
        "Air Ride Compressor",
        "Air Shutter",
        "Air Tube/Resonator",
        "Alternator",
        "Alternator Bracket",
        "Amplifier/Radio",
        "Antenna",
        "Anti-Lock Brake Computer",
        "Anti-Lock Brake Pump",
        "Armrest",
        "Ash Tray/Lighter",
        "Audiovisual (A/V) (see also TV Screen)",
        "Automatic Headlight Dimmer",
        "Auto. Trans. Cooler",
        "Axle Actuator (4WD)",
        "Axle Assy Fr (4WD w. Housing)",
        "Axle Assy Rear (w. Housing)",
        "Axle Beam Front (2WD, incl I Beam Susp)",
        "Axle Beam Rear (FWD)",
        "Axle Flange",
        "Axle Housing Only",
        "Axle Shaft",
        "B Pillar Trim",
        "Back Door (above rear bumper)",
        "Back Door Glass",
        "Back Door Handle, Inside",
        "Back Door Handle, Outside",
        "Back Door Hinge",
        "Back Door Moulding",
        "Back Door Shell",
        "Back Door Trim Panel",
        "Back Glass",
        "Back Glass Regulator",
        "Back Glass Shock",
        "Backing Plate, Front",
        "Backing Plate, Rear",
        "Backup Camera",
        "Backup Light",
        "Battery",
        "Battery Cable",
        "Battery Terminal",
        "Battery Tray",
        "Bed, Pickup",
        "Bed Floor (Pickup)",
        "Bed Front Panel (Pickup)",
        "Bed Liner",
        "Bed Side, Pickup",
        "Bell Housing",
        "Belt Tensioner",
        "Blind Spot Camera",
        "Blower Motor",
        "Body Wiring Harness",
        "Brake Accessory",
        "Brake/Clutch Pedal",
        "Brake Booster",
        "Brake Proportioning Valve",
        "Brake Rotor/Drum, Front",
        "Brake Rotor/Drum, Rear",
        "Brake Shoes/Pads",
        "Brush Guard",
        "Bumper Assy (Front) includes cover",
        "Bumper Assy (Rear) includes cover",
        "Bumper Bracket (Misc)",
        "Bumper Cover (Front)",
        "Bumper Cover (Rear)",
        "Bumper End Cap",
        "Bumper Energy Absorber (Front)",
        "Bumper Energy Absorber (Rear)",
        "Bumper Face Bar (Front)",
        "Bumper Face Bar (Rear)",
        "Bumper Filler Panel",
        "Bumper Guard (Front)",
        "Bumper Guard (Rear)",
        "Bumper Impact Strip",
        "Bumper Reinforcement (Front)",
        "Bumper Reinforcement (Rear)",
        "Bumper Shock",
        "Bumper Step Pad",
        "C Pillar Trim",
        "Cab",
        "Cab Back Panel",
        "Cab Clip, no cowl",
        "Cab Corner",
        "Cabin Air Filter",
        "Cabin Fuse Box",
        "Caliper",
        "Camera Projector",
        "Camshaft",
        "Camshaft Housing",
        "Carburetor (see also Throttle Body)",
        "Cargo Cover/Shade",
        "Cargo Lamp",
        "Carpet",
        "Carrier (see also Differential)",
        "Carrier Case",
        "CD Player/Radio",
        "Center Cap (Wheel)",
        "Center Pillar",
        "Charging Port Door Assembly",
        "Chassis Control Computer (not Engine)",
        "Clock",
        "Clockspring (Air Bag)",
        "Clutch Cable",
        "Clutch Disc",
        "Clutch Fork",
        "Clutch Master Cylinder",
        "Coil/Air Spring",
        "Coil/Igniter",
        "Column Switch",
        "Computer Box Engine",
        "Computer Box Not Engine",
        "Condenser",
        "Condenser/Radiator mtd. Cooling Fan",
        "Connecting Rod, Engine",
        "Console, Front",
        "Console, Rear",
        "Control Arm, Front Lower",
        "Control Arm, Front Upper",
        "Control Arm, Rear Lower",
        "Control Arm, Rear Upper",
        "Convertible Top",
        "Convertible Top Boot",
        "Convertible Top Lift",
        "Convertible Top Motor",
        "Convertible Windscreen",
        "Coolant Pump",
        "Cooling Fan (Rad and Con mtd.)",
        "Core (Radiator) Support",
        "Cowl",
        "Cowl Vent Panel",
        "Crank Pulley (Harmonic Balancer)",
        "Crankshaft",
        "Cruise Control Computer",
        "Cruise Control Servo/Regulator",
        "Cruise Speed Controler",
        "Cylinder Head (Engine)",
        "D Pillar",
        "Dash/Interior/Seat Switch",
        "Dash Bezel (see also Instrument or Radio Bezel)",
        "Dash Pad",
        "Dash Panel",
        "Dash Wiring Harness",
        "Deck Lid",
        "Diesel Particulate Filter",
        "Differential Assembly (see also Carrier)",
        "Differential Case Only",
        "Differential Flange Only",
        "Distributor",
        "Door Back (door above rear bumper)",
        "Door Front",
        "Door Handle, Inside",
        "Door Handle, Outside",
        "Door Lock Striker",
        "Door Mirror Cover",
        "Door Outer Repair Panel, Back",
        "Door Outer Repair Panel, Front",
        "Door Outer Repair Panel, Rear",
        "Door Rear (side of vehicle)",
        "Door Shell, Back",
        "Door Shell, Front",
        "Door Shell, Rear",
        "Door Window Crank Handle",
        "Drag Link",
        "Drive-By-Wire",
        "Drive Shaft, Front",
        "Drive Shaft, Rear",
        "Driving Lamp Bezel",
        "EGR Valve",
        "Electric Door Motor (not Window)",
        "Electric Window Motor",
        "Electrical Part Misc",
        "Electronic Transmission Shifter",
        "Emblem",
        "Emergency Brake",
        "Engine",
        "Engine Block",
        "Engine Computer",
        "Engine Core",
        "Engine Cover",
        "Engine Cradle",
        "Engine Cylinder Head",
        "Engine Fuse Box",
        "Engine Mounts",
        "Engine Oil Pan",
        "Engine Wiring Harness",
        "Exhaust Assembly",
        "Exhaust Cross Pipe",
        "Exhaust Fluid Pump",
        "Exhaust Fluid Tank",
        "Exhaust Heat Shield",
        "Exhaust Lead Pipe",
        "Exhaust Manifold",
        "Exhaust Muffler",
        "Exhaust Pipe",
        "Exhaust Resonator",
        "Exhaust Tail Pipe",
        "Fan Blade",
        "Fan Clutch",
        "Fender",
        "Fender Extension/Flare",
        "Fender Inner Panel",
        "Fender Moulding",
        "Fender Skirt",
        "Fender/Wheelhouse Inner Liner",
        "Flex Plate",
        "Floor Mats",
        "Floor Pan",
        "Floor Shift Assembly",
        "Flywheel",
        "Fog Lamp",
        "Fog Lamp Bezel",
        "Fog Lamp Bracket",
        "Fog Lamp Rear",
        "Fog Lamp Switch",
        "Frame",
        "Frame Front Section Only",
        "Frame Horn",
        "Frame Upper &amp; Lower Rails",
        "Front Axle Assembly (4WD w Housing)",
        "Front Axle Beam (2WD, incl I Beam Susp)",
        "Front Axle Shaft",
        "Front Bumper Assembly (includes cover)",
        "Front Bumper Cover",
        "Front Bumper Face Bar",
        "Front Bumper Guard",
        "Front Bumper Reinforcement",
        "Front Console",
        "Front Door",
        "Front Door Glass",
        "Front Door Handle, Inside",
        "Front Door Handle, Outside",
        "Front Door Hinge",
        "Front Door Mirror",
        "Front Door Mirror Glass",
        "Front Door Moulding",
        "Front Door Regulator",
        "Front Door Shell",
        "Front Door Switch",
        "Front Door Trim Panel",
        "Front Door Vent Glass",
        "Front Door Vent Glass Regulator",
        "Front Door Window Motor",
        "Front Drive Shaft",
        "Front End Assembly (Nose)",
        "Front Seat Belt Assembly",
        "Front Valance",
        "Front Window Regulator",
        "Fuel Cap",
        "Fuel Cell",
        "Fuel Cooler",
        "Fuel Distributor (&amp; Misc. Injection)",
        "Fuel Filler Door",
        "Fuel Filler Neck",
        "Fuel Gauge",
        "Fuel Injector (&amp; Misc. Injection)",
        "Fuel Injector Pump",
        "Fuel Line",
        "Fuel Pump",
        "Fuel Rail (&amp; Misc. Injection)",
        "Fuel Tank",
        "Fuel Tank Sending Unit",
        "Fuse Box (Cabin)",
        "Fuse Box (Engine)",
        "Gas Cap",
        "Gas Tank",
        "Gate Interior Trim Panel",
        "Gate Window Regulator",
        "Gate/Lid",
        "Gauge (Misc)",
        "Generator",
        "Glass, Back",
        "Glass, Front Door",
        "Glass, Front Vent",
        "Glass, Quarter Window",
        "Glass, Rear Door",
        "Glass, Rear Vent",
        "Glass, Special (see also Sunroof/TTop)",
        "Glass, Windshield",
        "Glove Box",
        "GPS Screen (see also Radio or Heater/AC Control)",
        "Grille",
        "Grille Moulding",
        "Grille Surround",
        "Harmonic Balancer (Crank Pulley)",
        "Hatch/Trunk Lid",
        "Head (Cylinder)",
        "Header Panel",
        "Headlight Assembly",
        "Headlight Ballast",
        "Headlight Bracket",
        "Headlight Bucket",
        "Headlight Bulb",
        "Headlight Cover (Plastic)",
        "Headlight Door",
        "Headlight Housing",
        "Headlight Igniter",
        "Headlight Lens",
        "Headlight Motor",
        "Headlight Switch (Column Mounted)",
        "Headlight Switch (Dash Mounted)",
        "Headlight Switch (see also Column Switch)",
        "Headlight Washer Motor Only",
        "Headlight Wiper Motor Only",
        "Headliner",
        "Headrest",
        "Heads Up Display",
        "Heater Assy",
        "Heater Core",
        "Heater Motor",
        "Heater/AC Control (see also Radio or TV Screen)",
        "Hood",
        "Hood Hinge",
        "Hood Insulation Pad",
        "Hood Latch",
        "Hood Ornament",
        "Hood Prop",
        "Hood Scoop",
        "Hood Shock",
        "Horn",
        "Hub",
        "Hub Cap/Wheel Cover (display w image)",
        "Hub Cap/Wheel Cover (display w/o image)",
        "Hub, Lockout (4WD)",
        "HVAC Actuator",
        "Hybrid Converter/Inverter",
        "Idler Arm",
        "Ignition Module (see also Ignitor/Coil)",
        "Ignition Switch",
        "Ignitor/Coil",
        "Info Screen (see also Radio or Heater/AC Control)",
        "Information Label",
        "Inside Door Handle",
        "Instrument Cluster (see also Speedo)",
        "Instrument Cluster Bezel",
        "Instrument Face Plate",
        "Intake Manifold",
        "Intercooler",
        "Intercooler Pipe",
        "Interior Complete",
        "Interior Light",
        "Interior Trim Panel (Gate/Lid)",
        "Interior Trim Panel (Quarter)",
        "Interior Trim Panel, Door (Back)",
        "Interior Trim Panel, Door (Front)",
        "Interior Trim Panel, Door (Rear)",
        "Inverter Cooler",
        "Jack Assembly",
        "Keys/Latches and Locks",
        "Key Remote/Fob",
        "Kick Panel",
        "Knee Assembly (see also Strut Assy)",
        "Lamp Wiring Harness",
        "Latch, Front Door",
        "Latch, Rear Door",
        "Latch, Back Door",
        "Latches",
        "Leaf Spring, Front",
        "Leaf Spring, Rear",
        "License Lamp",
        "License Plate Bracket",
        "Lid/Gate",
        "Lid Interior Trim Panel",
        "Lock Actuator",
        "Lockout Hub, 4X4",
        "Locks",
        "Lug Wrench",
        "Luggage Rack",
        "Marker/Fog Light, Front",
        "Marker/Side Light, Rear",
        "Master Cylinder",
        "Mirror, Door",
        "Mirror, Rear View",
        "Misc. Electrical",
        "Moulding (Back Door)",
        "Moulding (Fender)",
        "Moulding (Front Door)",
        "Moulding (Lid/Hatch/Gate)",
        "Moulding (Quarter Panel/Bed Side)",
        "Moulding (Rear Door)",
        "Moulding (Rocker)",
        "Moulding (Windshield)",
        "Mouldings (Misc)",
        "Mud Flap",
        "Neutral Safety Switch",
        "Night Vision Camera",
        "Nose (Front End Assembly)",
        "Oil Cooler",
        "Oil Filter Adapter",
        "Oil Pan, Engine",
        "Oil Pan, Transmission",
        "Oil Pump, Engine",
        "Outside Door Handle",
        "Overdrive Unit (see also Transmission)",
        "Owners Manual",
        "Paddle Shifter",
        "Park/Fog Lamp Front",
        "Parcel Shelf",
        "Park Lamp Rear (Side)",
        "Parking Assist Camera",
        "Pickup Bed",
        "Pickup Bed Floor",
        "Pickup Bed Front Panel",
        "Pickup Bed Side",
        "Pickup Cap/Camper Shell",
        "Piston",
        "Pitman Arm",
        "Power Brake Booster",
        "Power Inverter (Hybrid)",
        "Power Steering Assy",
        "Power Steering Control Valve",
        "Power Steering Cooler",
        "Power Steering Motor",
        "Power Steering Pressure Cyl",
        "Power Steering Pressure Hose",
        "Power Steering Pump",
        "Power Steering Rack/Box/Gear",
        "Power Steering Reservoir",
        "Pressure Plate",
        "Push Rod (Engine)",
        "Quarter Interior Trim Panel",
        "Quarter Moulding",
        "Quarter Panel",
        "Quarter Panel Extension",
        "Quarter Repair Panel",
        "Quarter Window",
        "Quarter Window Motor",
        "Quarter Window Regulator",
        "Rack &amp; Pinion (Steering)",
        "Radiator",
        "Radiator/Condenser mtd. Cooling Fan",
        "Radiator Air Shutter",
        "Radiator Core Support",
        "Radiator Cover Baffle",
        "Radiator Fan Shroud",
        "Radiator Overflow Bottle",
        "Radio/CD (see also A/C Control or TV Screen)",
        "Radio Bezel Trim",
        "Radio Face Plate",
        "Radius Arm, Front",
        "Rag Joint (see also Steering Coupler)",
        "Rear Axle Assy (RWD)",
        "Rear Axle Beam (FWD)",
        "Rear Body Panel",
        "Rear Bumper Assembly (includes cover)",
        "Rear Bumper Cover",
        "Rear Bumper Face Bar",
        "Rear Bumper Guard",
        "Rear Bumper Reinforcement/Misc",
        "Rear Clip",
        "Rear Console",
        "Rear Crossmember",
        "Rear Door (side of vehicle)",
        "Rear Door Handle, Inside",
        "Rear Door Handle, Outside",
        "Rear Door Hinge",
        "Rear Door Moulding",
        "Rear Door Regulator",
        "Rear Door Shell",
        "Rear Door Switch",
        "Rear Door Trim Panel",
        "Rear Door Vent Glass",
        "Rear Door Vent Glass regulator",
        "Rear Door Window",
        "Rear Door Window Motor",
        "Rear Door Window Regulator",
        "Rear Drive Shaft",
        "Rear Finish Panel",
        "Rear Gate/Lid",
        "Rear Gate Window Motor",
        "Rear Knuckle/Stub Axle",
        "Rear Lower Valance",
        "Rear Seat Belt Assembly",
        "Rear Suspension (see also Control Arms)",
        "Rear Suspension Locating Arm",
        "Rear Suspension Trailing Arm",
        "Rear Window Defogger",
        "Rear Window Washer Motor",
        "Receiver Dryer",
        "Relay (Misc)",
        "Ring and Pinion Only",
        "Rocker Arm",
        "Rocker Moulding",
        "Rocker Panel (see also Center Pillar)",
        "Roll Bar",
        "Roll Bar Padding",
        "Roof",
        "Roof Glass Frame/Track",
        "Roof Panel (see also Sunroof)",
        "Roof Rack",
        "Running Boards",
        "Running Board Motor",
        "Seat, Back (3rd Row)",
        "Seat, Back (4th Row)",
        "Seat, Back (5th Row)",
        "Seat, Front",
        "Seat, Rear (2nd Row)",
        "Seat Belt, Front",
        "Seat Belt, Rear",
        "Seat Belt Motor",
        "Seat Belt Pretensioner",
        "Seat Belt Track (Electric)",
        "Seat Motor",
        "Seat Switch",
        "Seat Track, Front Only",
        "Sensor (Body, Misc)",
        "Sensor (Chassis, Misc)",
        "Sensor (Drivetrain, Misc)",
        "Shifter Assembly (Floor)",
        "Shifter Linkage",
        "Shock Absorber",
        "Shock Mount",
        "Sill Plate",
        "Skid Plate",
        "Slave Cylinder",
        "Smog Pump",
        "Spare Tire Carrier",
        "Spare Tire Cover",
        "Spare Tire Hoist",
        "Speaker",
        "Special Glass",
        "Speedometer (see also Instr. Cluster)",
        "Speedometer Cable",
        "Spindle",
        "Spoiler, Front",
        "Spoiler, Rear",
        "Spring Hanger",
        "Stabilizer Bar Only",
        "Starter",
        "Steering Column",
        "Steering Column Shaft",
        "Steering Coupler",
        "Steering Knuckle (see also Knee &amp; Strut)",
        "Steering Pump",
        "Steering Rack/Box/Gear",
        "Steering Wheel",
        "Strut (see also Knee Assy)",
        "Strut Tower Brace",
        "Sun Roof / T-Top",
        "Sun Roof Motor",
        "Sunvisor",
        "Supercharger/Turbocharger",
        "Tachometer",
        "Tail Light",
        "Tail Light Circuit Board",
        "Tail Light Lens",
        "Tailgate Cable",
        "Tailgate/Trunk Lid",
        "Tailgate Hinge",
        "Tailgate Lift Motor",
        "Thermostat Housing",
        "Third Brake Light",
        "Throttle Body/Throttle Valve Housing",
        "Throwout Bearing",
        "Tie Rod",
        "Timing Belt/Chain",
        "Timing Cover",
        "Timing Gears",
        "Tire",
        "Tire Sensor",
        "Tonneau Cover",
        "Torque Convertor",
        "Torsion Bar",
        "Tow Hook",
        "Track/Watts Linkage",
        "Trailer Brake Controller",
        "Trailer Hitch",
        "Trans OD Unit (see also Transmission)",
        "Transaxle Housing Only",
        "Transfer Case",
        "Transfer Case Adapter",
        "Transfer Case Core",
        "Transfer Case Electric Motor",
        "Transfer Case Switch",
        "Transmission",
        "Transmission Bellhousing Only",
        "Transmission Clutch Actuator",
        "Transmission Computer",
        "Transmission Core",
        "Transmission Crossmember",
        "Transmission Front Pump",
        "Transmission Mount",
        "Transmission Pan",
        "Transmission Torque Converter",
        "Transmission Valve Body",
        "Transmission Wiring Harness",
        "Trim Ring",
        "Trunk Lid Pull Down Motor",
        "Trunk Lid/Hatch",
        "Trunk Lid/Hatch Hinge",
        "Trunk Lid/Hatch Shock",
        "Trunk Lid/Tailgate Moulding",
        "TTop/Sunroof",
        "Turbo/Supercharger Core",
        "Turbocharger/Supercharger",
        "Turn Signal/Fog Lamp",
        "TV Screen (see also Radio or Heater/AC Control)",
        "Uniside",
        "Vacuum Pump",
        "Vacuum Storage Tank",
        "Valance, Front",
        "Valance, Rear",
        "Valve Cover",
        "Vapor Canister",
        "Voltage Regulator",
        "Washer Nozzle",
        "Water Pump",
        "Water Separator",
        "Weather Stripping",
        "Wheel (display w image)",
        "Wheel (display w/o image)",
        "Wheel Bearing",
        "Wheel Cover/Hubcap (display w image)",
        "Wheel Cover/Hubcap (display w/o image)",
        "Wheel Lug Nut",
        "Wheel Opening Moulding",
        "Wheelchair Lift",
        "Wheelchair Ramp",
        "Wheelhouse (Rear)",
        "Winch",
        "Window Motor",
        "Window Regulator (Front)",
        "Window Regulator (Rear)",
        "Window Shade",
        "Window Switch (Front Door)",
        "Window Switch (Rear Door)",
        "Window Washer Motor, Rear",
        "Windshield",
        "Windshield Frame",
        "Windshield Hinge",
        "Windshield Washer Motor (Front)",
        "Windshield Washer Reservoir",
        "Wiper Arm",
        "Wiper Linkage",
        "Wiper Motor, Front (Windshield)",
        "Wiper Motor, Rear",
        "Wiring Harness (Air Conditioning)",
        "Wiring Harness (Body)",
        "Wiring Harness (Dash)",
        "Wiring Harness (Engine)",
        "Wiring Harness (Lamp)",
        "Wiring Harness (Misc)",
        "Wiring Harness (Transmission)",
        "Yoke/U-Joint"
    ];

}