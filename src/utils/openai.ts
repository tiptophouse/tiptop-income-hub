
// Mock implementation of OpenAI API integration
// In a real app, this would connect to a backend API

/**
 * Get property insights for a given address
 */
export const getPropertyInsights = async (address: string): Promise<string> => {
  console.log('Fetching insights for address:', address);
  
  // In a real implementation, this would call an API
  // For demo, we'll return mock data based on the address
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate some insights based on the address
  const containsApartment = /apartment|apt|unit|flat|condo/i.test(address);
  const containsRural = /rural|farm|ranch|estate|acres/i.test(address);
  const containsCommercial = /commercial|office|building|plaza|mall/i.test(address);
  
  if (containsApartment) {
    return `
# Apartment Monetization Analysis

This ${Math.floor(Math.random() * 500 + 800)} sq ft apartment has several monetization opportunities:

## Primary Assets:
- **Internet Bandwidth**: Share excess bandwidth for up to $120/month
- **Storage Space**: Unused closet or garage space can earn $50-80/month
- **Parking Space**: Your dedicated spot can be rented when not in use

Based on comparable properties in your area, this apartment has an estimated passive income potential of $200-350 per month.
    `;
  } else if (containsRural) {
    return `
# Rural Property Monetization Analysis

Your property has exceptional monetization potential due to its size and location:

## Primary Assets:
- **Solar Potential**: Your rooftop and land are ideal for solar installation (Est. $200-400/month)
- **Garden Space**: Garden sharing or community farming opportunities
- **Storage Space**: Barn or outbuilding rental potential ($150-300/month)

Conservative estimates suggest a monthly passive income of $400-700 is achievable with minimal investment.
    `;
  } else if (containsCommercial) {
    return `
# Commercial Property Monetization Analysis

This commercial property has untapped monetization channels:

## Primary Assets:
- **Roof Space**: Ideal for telecom equipment installation (Est. $500-1000/month)
- **Parking Facilities**: Off-hours parking rental potential
- **Internet Infrastructure**: Bandwidth sharing and edge computing opportunities

Potential monthly revenue of $800-1500 based on similar commercial properties in your region.
    `;
  } else {
    // Default residential property
    return `
# Residential Property Monetization Analysis

Based on our assessment, your property has several monetization opportunities:

## Primary Assets:
- **Rooftop Solar**: Your roof has approximately ${Math.floor(Math.random() * 400 + 600)} sq ft of usable space for solar panels
- **Internet Bandwidth**: Current usage patterns suggest 60-70% of your bandwidth is unused
- **Driveway/Parking**: 1-2 parking spaces available for hourly/daily rental
- **Garden Space**: ${Math.floor(Math.random() * 200 + 100)} sq ft available for community garden sharing

## Potential Monthly Income:
- Solar: $100-150
- Bandwidth sharing: $80-120
- Parking: $70-200
- Garden/storage: $50-100

Total potential monthly passive income: $300-570
    `;
  }
};
