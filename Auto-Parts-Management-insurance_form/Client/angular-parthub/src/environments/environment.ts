export const environment = {
  production: false,
  development: true,
  apiUrl: 'http://baycounter.com:8443',
  stripe: {
    publishableKey: 'pk_test_51RrflYP4h6MOSVxDENdMiwOSbNudvzG8PlrrhslZjfbg9qPvb8YkzVR42ro5bQ8nXUnnbuPQpSlI43SHBuKhiCS000VgCDGNrC',
    enabled: true
  },
  payment: {
    testMode: true,
    enableMockPayments: false,
    enableRealStripeAPI: true
  }
};