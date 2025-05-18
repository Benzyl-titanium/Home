// Define the default location of webservices

function getDefaultServicesPrefix() {
    // Point to your new local Flask server
    var servername = "https://smiles.benzyl-titanium.top"; 
    var webapp = ""; // Our Flask app doesn't have a sub-path like "/rest-v1" for the base
    return servername + webapp;
}

function getDefaultServices() {
    var base = getDefaultServicesPrefix();
    var services = {
        // You can keep existing services if you might use them with another backend later,
        // or remove them if you only want the SMILES service for now.
        // For this example, I'll comment out the old ones and add the new one.

        // "clean2dws": base + "/rest-v1/util/convert/clean",
        // "molconvertws": base + "/rest-v1/util/calculate/molExport",
        // "stereoinfows": base + "/rest-v1/util/calculate/cipStereoInfo",
        // "aromatizews": base + "/rest-v1/util/calculate/molExport",

        // New service for SMILES processing
        // The path matches the @app.route in your Flask app
        "processsmilesws": base + "/smiles/process" 
    };
    return services;
}