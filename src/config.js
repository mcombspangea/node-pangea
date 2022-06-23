class PangeaConfig {
  constructor(options) {
    const defaultOptions = {
      baseDomain: "pangea.cloud",
      environment: "production",
      configId: "",
      requestRetries: 3,
      requestTimeout: 5000,
      asyncEnabled: true,
      asyncRetries: 4,
      apiVersion: 'v1'
    };

    this.options = {
      ...defaultOptions,
      ...options
    }

    // create getters for defaultOptions keys
    Object.keys(defaultOptions).forEach(prop => {
      Object.defineProperty(this, prop, {
        get: function () {
          return this.options[prop];
        },
      })
    })
  }
}

module.exports = PangeaConfig;