// Airport Database
// Contains coordinates and information for major airports worldwide

const airports = {
    japan: [
        { code: 'HND', name: 'Tokyo Haneda Airport', lat: 35.5494, lng: 139.7798 },
        { code: 'NRT', name: 'Tokyo Narita Airport', lat: 35.7647, lng: 140.3864 },
        { code: 'KIX', name: 'Osaka Kansai International Airport', lat: 34.4273, lng: 135.2444 },
        { code: 'ITM', name: 'Osaka Itami Airport', lat: 34.7855, lng: 135.4384 },
        { code: 'NGO', name: 'Nagoya Chubu Centrair Airport', lat: 34.8584, lng: 136.8054 },
        { code: 'FUK', name: 'Fukuoka Airport', lat: 33.5859, lng: 130.4511 },
        { code: 'CTS', name: 'Sapporo New Chitose Airport', lat: 42.7752, lng: 141.6920 },
        { code: 'OKA', name: 'Okinawa Naha Airport', lat: 26.1958, lng: 127.6458 },
        { code: 'UKB', name: 'Kobe Airport', lat: 34.6328, lng: 135.2239 },
        { code: 'SDJ', name: 'Sendai Airport', lat: 38.1397, lng: 140.9169 },
        { code: 'HIJ', name: 'Hiroshima Airport', lat: 34.4361, lng: 132.9194 }
    ],
    international: [
        { code: 'JFK', name: 'New York JFK Airport', lat: 40.6413, lng: -73.7781 },
        { code: 'LHR', name: 'London Heathrow Airport', lat: 51.4700, lng: -0.4543 },
        { code: 'CDG', name: 'Paris Charles de Gaulle Airport', lat: 49.0097, lng: 2.5479 },
        { code: 'FRA', name: 'Frankfurt Airport', lat: 50.0379, lng: 8.5622 },
        { code: 'DXB', name: 'Dubai International Airport', lat: 25.2532, lng: 55.3657 },
        { code: 'SIN', name: 'Singapore Changi Airport', lat: 1.3644, lng: 103.9915 },
        { code: 'HKG', name: 'Hong Kong International Airport', lat: 22.3080, lng: 113.9185 },
        { code: 'SYD', name: 'Sydney Airport', lat: -33.9461, lng: 151.1772 },
        { code: 'LAX', name: 'Los Angeles International Airport', lat: 34.0522, lng: -118.2437 },
        { code: 'SFO', name: 'San Francisco International Airport', lat: 37.6213, lng: -122.3790 },
        { code: 'FCO', name: 'Rome Fiumicino Airport', lat: 41.9742, lng: 12.2389 },
        { code: 'GRU', name: 'São Paulo Airport', lat: -23.4356, lng: -46.4731 },
        { code: 'DEL', name: 'Delhi Indira Gandhi Airport', lat: 28.4353, lng: 77.1115 }
    ]
};

// Function to populate airport selector dropdown
function populateAirportSelector(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '';

    // Add Japan airports
    const japanGroup = document.createElement('optgroup');
    japanGroup.label = 'Japan';
    airports.japan.forEach(airport => {
        const option = document.createElement('option');
        option.value = `${airport.lat},${airport.lng}`;
        option.textContent = `${airport.name} (${airport.code})`;
        japanGroup.appendChild(option);
    });
    selectElement.appendChild(japanGroup);

    // Add International airports
    const intlGroup = document.createElement('optgroup');
    intlGroup.label = 'International';
    airports.international.forEach(airport => {
        const option = document.createElement('option');
        option.value = `${airport.lat},${airport.lng}`;
        option.textContent = `${airport.name} (${airport.code})`;
        intlGroup.appendChild(option);
    });
    selectElement.appendChild(intlGroup);
}

// Function to get airport by code
function getAirportByCode(code) {
    const allAirports = [...airports.japan, ...airports.international];
    return allAirports.find(airport => airport.code === code);
}

// Function to search airports by name or code
function searchAirports(query) {
    const allAirports = [...airports.japan, ...airports.international];
    const lowerQuery = query.toLowerCase();
    return allAirports.filter(airport => 
        airport.code.toLowerCase().includes(lowerQuery) ||
        airport.name.toLowerCase().includes(lowerQuery)
    );
}
