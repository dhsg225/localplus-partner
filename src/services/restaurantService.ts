// Mock restaurant service for partner app
export const restaurantService = {
  async getBusinessesForSignup() {
    // Mock businesses for signup
    return [
      { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Shannon\'s Coastal Kitchen' },
      { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Local Bistro' }
    ];
  },

  async getRestaurants() {
    // Mock restaurants
    return [
      { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Shannon\'s Coastal Kitchen' }
    ];
  }
};
