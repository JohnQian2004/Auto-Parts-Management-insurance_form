export const environment = {
  production: true,
  apiUrl: '/api',
  stripe: {
    publishableKey: 'pk_live_your_live_key_here', // Replace with actual live key
    enabled: true
  },
  payment: {
    testMode: false,
    enableMockPayments: false,
    enableRealStripeAPI: true
  }
}; 