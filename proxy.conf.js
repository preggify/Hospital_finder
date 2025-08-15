const PROXY_CONFIG = [
  {
    context: [
      '/preggify/v1/hospitals/hospitals/listhospital',
      '/preggify/v1/hospitals/hospitals/search_hospital',
      '/preggify/v1/hospitals/hospitals/addhospital',
      '/preggify/v1/hospitals/hospitals',
    ],
    target: 'https://www.preggifyapiservice.preggify.com', // Preggify API URL
    secure: true,
    changeOrigin: true
  }
]

module.exports = PROXY_CONFIG;
