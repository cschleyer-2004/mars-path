// Temporary demonstration data.
// Eventually, this will come from our Spring Boot API.

const locationList = document.getElementById("locationList");
const searchInput = document.getElementById("searchInput");

let locations = [];
let startLocation = null;
let endLocation = null;

// Render the location list.

function renderLocations(data) {

    locationList.innerHTML = "";

    data.forEach(location => {

        const element = document.createElement("div");

        element.className = "location";

        element.innerHTML = `
            <h3>${location.name}</h3>
            <p>${location.region}</p>
        `;

        element.addEventListener("click", () => {
            selectLocation(location);
        });

        locationList.appendChild(element);
    });
}

// Display selected location.

function selectLocation(location) {

    document.getElementById("locationName").textContent =
        location.name;

    document.getElementById("locationRegion").textContent =
        location.region;

    document.getElementById("locationStatus").textContent =
        location.status;

    document.getElementById("locationDescription").textContent =
        location.description;

    document.getElementById("locationInterest").textContent =
        location.interest;
	
	document.getElementById("mapMarker").textContent =
	    "● " + location.name;

	document.getElementById("terrainType").textContent =
	    location.terrainType;

	document.getElementById("scienceValue").textContent =
	    location.scienceValue;

	document.getElementById("radiationRisk").textContent =
	    location.radiationRisk;

	document.getElementById("recommendedTransport").textContent =
	    location.recommendedTransport;

	document.getElementById("dataSource").textContent =
	    location.dataSource;

	document.getElementById("sourceResolution").textContent =
	    location.sourceResolution;	
		
    const mapImage =
        document.getElementById("marsMap");
	
    if (location.mapFile) {
        mapImage.src = location.mapFile;
    }

	console.log(location);
    fetchLocationFromBackend(location.slug);
}

// Search locations.

searchInput.addEventListener("input", event => {

    const query = event.target.value.toLowerCase();

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(query)
    );

    renderLocations(filteredLocations);
});


// convert distance from degrees to km

const MARS_RADIUS_KM = 3389.5;

function calculateDistanceKm(start, end) {

    const lat1 =
        start.latitude * Math.PI / 180;

    const lat2 =
        end.latitude * Math.PI / 180;

    const dLat =
        (end.latitude - start.latitude)
        * Math.PI / 180;

    const dLon =
        (end.longitude - start.longitude)
        * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)
        +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return MARS_RADIUS_KM * c;
}

function calculateRoute() {

    const routeInfo =
        document.getElementById("routeInfo");

    if (!startLocation || !endLocation) {

        routeInfo.textContent =
            "Please select a start and destination.";

        return;
    }

    const dx =
        endLocation.longitude -
        startLocation.longitude;

    const dy =
        endLocation.latitude -
        startLocation.latitude;

    const distance = calculateDistanceKm(
		startLocation,
		endLocation
	);

	routeInfo.innerHTML = `
	    <strong>Route:</strong>
	    ${startLocation.name} → ${endLocation.name}
	    <br><br>

	    <strong>Estimated Distance:</strong>
	    ${distance.toFixed(0)} km
	    <br><br>

		`;
}

// REST API integration.

async function fetchLocationFromBackend(slug) {

    const apiStatus = document.getElementById("apiStatus");

    try {

        const response = await fetch(
            `/api/v1/mars/locations/${slug}`
        );

        if (!response.ok) {
            throw new Error("Backend endpoint unavailable");
        }

        const data = await response.json();

        // Update the interface with backend data.
        // We will align these fields with our Java DTO later.

		document.getElementById("locationName").textContent =
		    data.name;

		document.getElementById("locationRegion").textContent =
		    data.region;

		document.getElementById("locationStatus").textContent =
		    data.status;

		document.getElementById("locationDescription").textContent =
		    data.description;

		document.getElementById("locationInterest").textContent =
		    data.interest;

		if (data.mapFile) {
		    document.getElementById("marsMap").src =
		        data.mapFile;
		}

        apiStatus.textContent = "Connected to Spring Boot API.";

    } catch (error) {

        apiStatus.textContent =
            "Using demonstration data. Spring Boot API not connected yet.";

        console.log("Backend connection:", error.message);
    }
}

// zoom in and out

const marsMap =
    document.getElementById("marsMap");

const zoomInBtn =
    document.getElementById("zoomIn");

const zoomOutBtn =
    document.getElementById("zoomOut");
let zoomLevel = 1;

function updateZoom() {
    marsMap.style.transform =
        `scale(${zoomLevel})`;
}
	if (zoomInBtn) {
	    zoomInBtn.addEventListener("click", () => {
	        zoomLevel = Math.min(zoomLevel + 0.2, 5);
	        updateZoom();
	    });
	}

	if (zoomOutBtn) {
	    zoomOutBtn.addEventListener("click", () => {
	        zoomLevel = Math.max(zoomLevel - 0.2, 1);
	        updateZoom();
	    });
	}
// Initial page setup.


async function loadLocations(){
	const response = await fetch("/api/v1/mars/locations");
	locations = await response.json();
	
	renderLocations(locations)
	populateRouteSelectors();

	if (locations.length > 0){
		selectLocation(locations[0]);
	}
	
	
}

loadLocations();


//Select routes
function populateRouteSelectors() {

    const start =
        document.getElementById("startLocationSelect");

    const end =
        document.getElementById("endLocationSelect");

    locations.forEach(location => {

        const option1 =
            new Option(location.name, location.slug);

        const option2 =
            new Option(location.name, location.slug);

        start.add(option1);
        end.add(option2);
    });
}

document
    .getElementById("planRoute")
    .addEventListener("click", () => {

        const startSlug =
            document.getElementById(
                "startLocationSelect"
            ).value;

        const endSlug =
            document.getElementById(
                "endLocationSelect"
            ).value;

        startLocation =
            locations.find(
                l => l.slug === startSlug
            );

        endLocation =
            locations.find(
                l => l.slug === endSlug
            );
		
		document.getElementById("terrainType").textContent =
		    endLocation.terrainType;

		document.getElementById("scienceValue").textContent =
		    endLocation.scienceValue;

		document.getElementById("radiationRisk").textContent =
		    endLocation.radiationRisk;

		document.getElementById("recommendedTransport").textContent =
		    endLocation.recommendedTransport;

		document.getElementById("dataSource").textContent =
		    endLocation.dataSource;

		document.getElementById("sourceResolution").textContent =
		    endLocation.sourceResolution;
			
		selectLocation(endLocation);
		
        calculateRoute();
});
