import PangeaResponse from "../response.js";
import BaseService from "./base.js";
import PangeaConfig from "../config.js";
import { Intel } from "../types.js";

/**
 * FileIntelService class provides methods for interacting with the File Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *   FILE_INTEL_CONFIG_ID - Configuration ID which can be found on the Pangea
 *     User Console at [https://console.pangea.cloud/service/file-intel](https://console.pangea.cloud/service/file-intel)
 *
 * Examples:
 *    import { PangeaConfig, FileIntelService } from "node-pangea";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const configId = process.env.FILE_INTEL_CONFIG_ID;
 *    const config = new PangeaConfig({ domain, configId });
 *
 *    const fileIntel = new FileIntelService(token, config);
 *    const options = { provider: "reversinglabs", verbose: true };
 *
 *    const response = await fileIntel.lookup("142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e", "sha256", options);
 */
export class FileIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("file-intel", token, config);
    this.configIdHeaderName = "X-Pangea-File-Intel-Config-ID";
    this.apiVersion = "v1";
    this.init();
  }

  /**
   * @summary Lookup
   * @description Retrieve file reputation from a provider, using the file's hash.
   * @param {String} fileHash - Hash of the file to be looked up
   * @param {String} hashType - Type of hash, can be "sha256", "sha" or "md5"
   * @param {Object} [options] - An object of optional parameters
   *   - @param {String} [provider] - Provider of the reputation information. ("reversinglabs" or "crowdstrike").
   *     Default provider defined by the configuration.
   *   - @param {Boolean} [verbose=false] - Echo back the parameters of the API in the response.
   *   - @param {Boolean} [raw=false] - Return additional details from the provider.
   * @returns {Promise} - A promise representing an async call to the check endpoint
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * const options = { provider: "reversinglabs" };
   * const response = await fileIntel.lookup("142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e", "sha256", options);
   */
  lookup(
    fileHash: string,
    hashType: string,
    options: Intel.Options = {}
  ): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.FileParams = {
      hash: fileHash,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("lookup", data);
  }
}

/**
 * IPIntelService class provides methods for interacting with the IP Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/ip-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *   IP_INTEL_CONFIG_ID - Configuration ID which can be found on the Pangea
 *     User Console at [https://console.pangea.cloud/service/ip-intel](https://console.pangea.cloud/service/ip-intel)
 *
 * Examples:
 *    import { PangeaConfig, IPIntelService } from "node-pangea";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const configId = process.env.URL_INTEL_CONFIG_ID;
 *    const config = new PangeaConfig({ domain, configId });
 *
 *    const ipIntel = new IPIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await ipIntel.lookup("93.231.182.110", options);
 */
export class IPIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("ip-intel", token, config);
    this.configIdHeaderName = "X-Pangea-Ip-Intel-Config-ID";
    this.apiVersion = "v1";
    this.init();
  }

  /**
   * @summary Lookup
   * @description Retrieve IP address reputation from a provider.
   * @param {String} ip - Geolocate this IP and check the corresponding country against.
   * @param {Object} [options] - An object of optional parameters
   *   - @param {String} [provider] - Provider of the reputation information. ("reversinglabs" or "crowdstrike").
   *     Default provider defined by the configuration.
   *   - @param {Boolean} [verbose=false] - Echo back the parameters of the API in the response.
   *   - @param {Boolean} [raw=false] - Return additional details from the provider.
   * @returns {Promise} - A promise representing an async call to the check endpoint.
   * @example
   * const options = { provider: "reversinglabs" };
   * const response = await ipIntel.lookup("1.1.1.1", options);
   */
  lookup(ip: string, options: Intel.Options = {}): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.IPParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("lookup", data);
  }
}

/**
 * URLIntelService class provides methods for interacting with the URL Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *   URL_INTEL_CONFIG_ID - Configuration ID which can be found on the Pangea
 *     User Console at [https://console.pangea.cloud/service/url-intel](https://console.pangea.cloud/service/url-intel)
 *
 * Examples:
 *    import { PangeaConfig, URLIntelService } from "node-pangea";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const configId = process.env.URL_INTEL_CONFIG_ID;
 *    const config = new PangeaConfig({ domain, configId });
 *
 *    const urlIntel = new URLIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await urlIntel.lookup("http://113.235.101.11:54384", options);
 */
export class URLIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("url-intel", token, config);
    this.configIdHeaderName = "X-Pangea-Url-Intel-Config-ID";
    this.apiVersion = "v1";
    this.init();
  }

  /**
   * @summary Lookup
   * @description Retrieve URL address reputation from a provider.
   * @param {String} url - Geolocate this IP and check the corresponding country against
   *   the enabled embargo lists.
   * @param {Object} [options] - An object of optional parameters.
   *   - @param {String} [provider] - Provider of the reputation information. ("reversinglabs" or "crowdstrike").
   *     Default provider defined by the configuration.
   *   - @param {Boolean} [verbose=false] - Echo back the parameters of the API in the response.
   *   - @param {Boolean} [raw=false] - Return additional details from the provider.
   * @returns {Promise} - A promise representing an async call to the check endpoint.
   * @example
   * const options = { provider: "reversinglabs" };
   * const response = await urlIntel.lookup("http://113.235.101.11:54384, options);
   */
  lookup(url: string, options: Intel.Options = {}): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.URLParams = {
      url,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("lookup", data);
  }
}

/**
 * DomainIntelService class provides methods for interacting with the Domain Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/domain-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *   DOMAIN_INTEL_CONFIG_ID - Configuration ID which can be found on the Pangea
 *     User Console at [https://console.pangea.cloud/service/domain-intel](https://console.pangea.cloud/service/domain-intel)
 *
 * Examples:
 *  import { PangeaConfig, DomainIntelService } from "node-pangea";
 *
 *  const domain = process.env.PANGEA_DOMAIN;
 *  const token = process.env.PANGEA_TOKEN;
 *  const configId = process.env.DOMAIN_INTEL_CONFIG_ID;
 *  const config = new PangeaConfig({ domain, configId });
 *
 *  const domainIntel = new DomainIntelService(token, config);
 *  const options = { provider: "crowdstrike", verbose: true };
 *
 *  const response = await domainIntel.lookup("teoghehofuuxo", options);
 */
export class DomainIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("domain-intel", token, config);
    this.configIdHeaderName = "X-Pangea-Domain-Intel-Config-ID";
    this.apiVersion = "v1";
    this.init();
  }

  /**
   * @summary Lookup
   * @description Retrieve Domain reputation from a provider.
   * @param {String} domain - Domain address to be looked up.
   * @param {Object} [options] - An object of optional parameters.
   *   - @param {String} [provider] - Provider of the reputation information. ("reversinglabs" or "crowdstrike").
   *     Default provider defined by the configuration.
   *   - @param {Boolean} [verbose=false] - Echo back the parameters of the API in the response.
   *   - @param {Boolean} [raw=false] - Return additional details from the provider.
   * @returns {Promise} - A promise representing an async call to the check endpoint.
   * @example
   * const response = await domainIntel.loookup("google.com")
   */
  lookup(domain: string, options: Intel.Options = {}): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.DomainParams = {
      domain,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("lookup", data);
  }
}
