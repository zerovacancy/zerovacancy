
export interface LocationSuggestion {
  city: string;
  state: string;
  zip: string;
  type: 'city' | 'zip';
}

// Expanded list of major US cities
export const majorUSLocations: LocationSuggestion[] = [
  { city: "New York", state: "NY", zip: "10001", type: 'city' },
  { city: "Los Angeles", state: "CA", zip: "90001", type: 'city' },
  { city: "Chicago", state: "IL", zip: "60601", type: 'city' },
  { city: "Houston", state: "TX", zip: "77001", type: 'city' },
  { city: "Phoenix", state: "AZ", zip: "85001", type: 'city' },
  { city: "Philadelphia", state: "PA", zip: "19101", type: 'city' },
  { city: "San Antonio", state: "TX", zip: "78201", type: 'city' },
  { city: "San Diego", state: "CA", zip: "92101", type: 'city' },
  { city: "Dallas", state: "TX", zip: "75201", type: 'city' },
  { city: "San Jose", state: "CA", zip: "95101", type: 'city' },
  { city: "Austin", state: "TX", zip: "78701", type: 'city' },
  { city: "Jacksonville", state: "FL", zip: "32201", type: 'city' },
  { city: "Fort Worth", state: "TX", zip: "76101", type: 'city' },
  { city: "Columbus", state: "OH", zip: "43201", type: 'city' },
  { city: "San Francisco", state: "CA", zip: "94101", type: 'city' }
];

export interface GroupedSuggestions {
  cities: LocationSuggestion[];
  zipCodes: LocationSuggestion[];
}

export const filterLocations = (query: string): GroupedSuggestions => {
  const searchTerm = query.toLowerCase().trim();
  
  // Return empty groups if search term is less than 2 characters
  if (searchTerm.length < 2) {
    return { cities: [], zipCodes: [] };
  }

  const matchedLocations = majorUSLocations.filter(location => {
    const cityState = `${location.city}, ${location.state}`.toLowerCase();
    const cityMatch = location.city.toLowerCase().includes(searchTerm);
    const stateMatch = location.state.toLowerCase().includes(searchTerm);
    const zipMatch = location.zip.includes(searchTerm);
    
    return cityMatch || stateMatch || zipMatch;
  });

  // Group results by type
  const cities = matchedLocations
    .filter(loc => loc.type === 'city')
    .slice(0, 5);
  
  const zipCodes = matchedLocations
    .filter(loc => loc.type === 'zip' || loc.zip.includes(searchTerm))
    .slice(0, 3);

  return { cities, zipCodes };
};

