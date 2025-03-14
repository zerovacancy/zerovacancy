/**
 * Location data and utilities
 */

// Location suggestion interface
export interface LocationSuggestion {
  id: string;
  city: string;
  state: string;
  fullName: string;
  population: number;
}

/**
 * Filter locations based on search query
 */
export function filterLocations(
  locations: LocationSuggestion[],
  searchQuery: string,
  limit: number = 10
): LocationSuggestion[] {
  if (!searchQuery) return [];
  
  const normalizedQuery = searchQuery.toLowerCase().trim();
  
  // If query is too short, don't show any results
  if (normalizedQuery.length < 2) return [];
  
  // First match by city name starting with the query
  const startingMatches = locations.filter(loc => 
    loc.city.toLowerCase().startsWith(normalizedQuery) ||
    loc.fullName.toLowerCase().startsWith(normalizedQuery)
  );
  
  // Then match by contains
  const containingMatches = locations.filter(loc => 
    !startingMatches.includes(loc) && (
      loc.city.toLowerCase().includes(normalizedQuery) ||
      loc.fullName.toLowerCase().includes(normalizedQuery)
    )
  );
  
  // Combine results, prioritizing exact matches and those starting with the query
  const allMatches = [
    ...startingMatches.sort((a, b) => b.population - a.population),
    ...containingMatches.sort((a, b) => b.population - a.population)
  ];
  
  // Return limited results
  return allMatches.slice(0, limit);
}

/**
 * Major US locations for location selector
 */
export const majorUSLocations: LocationSuggestion[] = [
  {
    id: "nyc",
    city: "New York",
    state: "NY",
    fullName: "New York, NY",
    population: 8804190
  },
  {
    id: "la",
    city: "Los Angeles",
    state: "CA",
    fullName: "Los Angeles, CA",
    population: 3898747
  },
  {
    id: "chicago",
    city: "Chicago",
    state: "IL",
    fullName: "Chicago, IL",
    population: 2746388
  },
  {
    id: "houston",
    city: "Houston",
    state: "TX",
    fullName: "Houston, TX",
    population: 2304580
  },
  {
    id: "phoenix",
    city: "Phoenix",
    state: "AZ",
    fullName: "Phoenix, AZ",
    population: 1608139
  },
  {
    id: "philly",
    city: "Philadelphia",
    state: "PA",
    fullName: "Philadelphia, PA",
    population: 1603797
  },
  {
    id: "san_antonio",
    city: "San Antonio",
    state: "TX",
    fullName: "San Antonio, TX",
    population: 1434625
  },
  {
    id: "san_diego",
    city: "San Diego",
    state: "CA",
    fullName: "San Diego, CA",
    population: 1386932
  },
  {
    id: "dallas",
    city: "Dallas",
    state: "TX",
    fullName: "Dallas, TX",
    population: 1304379
  },
  {
    id: "sf",
    city: "San Francisco",
    state: "CA",
    fullName: "San Francisco, CA",
    population: 873965
  },
  {
    id: "austin",
    city: "Austin",
    state: "TX",
    fullName: "Austin, TX",
    population: 964254
  },
  {
    id: "seattle",
    city: "Seattle",
    state: "WA",
    fullName: "Seattle, WA",
    population: 733919
  },
  {
    id: "denver",
    city: "Denver",
    state: "CO",
    fullName: "Denver, CO",
    population: 715522
  },
  {
    id: "boston",
    city: "Boston",
    state: "MA",
    fullName: "Boston, MA",
    population: 675647
  },
  {
    id: "miami",
    city: "Miami",
    state: "FL",
    fullName: "Miami, FL",
    population: 442241
  },
  {
    id: "atlanta",
    city: "Atlanta",
    state: "GA",
    fullName: "Atlanta, GA",
    population: 498715
  },
  {
    id: "nashville",
    city: "Nashville",
    state: "TN",
    fullName: "Nashville, TN",
    population: 689447
  },
  {
    id: "portland",
    city: "Portland",
    state: "OR",
    fullName: "Portland, OR",
    population: 652503
  },
  {
    id: "vegas",
    city: "Las Vegas",
    state: "NV",
    fullName: "Las Vegas, NV",
    population: 641903
  },
  {
    id: "charlotte",
    city: "Charlotte",
    state: "NC",
    fullName: "Charlotte, NC",
    population: 874579
  }
];