/**
 * 🦎 Geckotail - API wrapper for GeckoTerminal v2 API service
 * 
 * Please feel free to report any bugs or suggest improvements trough pull requests.
 * 
 *      - Github page: https://github.com/xooolod/Geckotail
 *      - Docs: coming soon...
 *      - Usage: comming soon... 
 */

const axios = require('axios');

class GeckoTail {
    constructor(baseURL = 'https://api.geckoterminal.com/api/v2') {
        this.api = axios.create({ baseURL });
    }

    /**
     * Sends a query to GeckoTerminal API with specified link
     * @param {String} queryURL URL of the query
     * @returns {JSON} response
     */
    async executeQuery(queryURL) {
        try {
            const response = await this.api.get(queryURL);
            console.log(`Query successful at ${queryURL}:`, response.status);
            return response.data;
        } catch (error) {
            console.error(`Error executing query at ${queryURL}:`, error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Checks if provided value has the correct type and is not null or undefined
     * @param {any} value - The value to be validated.
     * @param {string} type - The expected type of the value.
     * @param {string} errorMessage - Error message to throw if validation fails.
     */

    isValidType(value, type, errorMessage) {
        if (typeof value !== type || value === null || value === undefined || (type === 'string' && value.trim() === '')) {
            throw new Error(errorMessage);
        }
    }


    /**
     * Checks if page provided has valid value.
     * 
     * @param {Number} page Page value
     */

    isPageValid(page) {
        if (!Number.isInteger(page) || page < 1) {
            throw new Error("Error: page must be a positive integer.");
        }
    }

    /**
     * Checks if provided trade volume has valid value
     * @param {Number} volume Trade volume value
     */

    isTradeVolumeValid(volume) {
        if (typeof volume !== 'number' || volume < 0) {
            throw new Error("Error: volume must be a non-negative number.");
        }
    }

    /**
     * Checks if provided array is valid
     * @param {Array} array Provided array
     * @param {Error} errorMessage Error message thrown out in console in case if array is invalid for some reason 
     */

    isArrayValid(array, errorMessage) {
        if (!Array.isArray(array) || array.length === 0) {
            throw new Error(errorMessage);
        }
    }

    /**
     * Checks if include value is valid
     * @param {String} include Include value
     * @param {Array} allowedIncludes Array of allowed includes 
     */

    isIncludeValid(include, allowedIncludes) {
        if (!allowedIncludes.includes(include)) {
            throw new Error(`Error: Invalid include parameter "${include}".`);
        }
    }



    /**
     * Turns array to a string. GeckoTerminal accepts a list of addresses separated by a coma, 
     * so we have to turn incoming arrays to strings which will satisfy this requirement.
     * 
     * @param {Array} array Incoming array 
     * @returns {String} String with array values separated by a coma
     */

    arrayToString(array) {
        return array.join(",");
    }

    /**
     * Gets USD prices of multiple tokens on a network
     * 
     * @param {String} network Network id (example: "eth", "ton")
     * @param {Array} addressesArray List of token addresses
     * @returns {JSON} Current USD prices of multiple tokens on a network
     */

    async getMultiplePrices(network, addressesArray) {
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isArrayValid(addressesArray, "Addresses must be a non-empty array.");
        const addresses = this.arrayToString(addressesArray);
        return this.executeQuery(`/simple/networks/${network}/${addresses}`);
    }

    /**
     * Gets list of networks on GeckoTerminal
     * 
     * @param {Number} page Page through results
     * @returns {JSON} list of networks on GeckoTerminal
     */

    async getNetworks(page = 1) {
        this.isPageValid(page);
        return this.executeQuery(`/networks?page=${page}`);
    }

    /**
     * Gets list of supported dexes on a network
     * 
     * @param {String} network Network id (example: "eth", "ton") 
     * @param {Number}  page Page through results
     * @returns {JSON} List of supported dexes on a network
     */

    async getDexes(network, page = 1) {
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isPageValid(page);
        return this.executeQuery(`/networks/${network}/dexes?page=${page}`);
    }

    /**
     * Gets trending pools across all networks
     * 
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex, network. 
     * @param {Number} page Page through results 
     * @returns {JSON} List of trending pools across all networks
     */

    async getTrendingPools(include = "", page = 1) {
        const allowedIncludes = ["base_token", "quote_token", "dex", "network"];
        this.isPageValid(page);
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/networks/trending_pools?page=${page}&include=${include}`);
    }

    /**
     * Gets trending pools on a specified network 
     * 
     * @param {String} network Network id (example: "eth", "ton") 
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @param {Number} page Page through results 
     * @returns {JSON} List of trending pools on a specified network
     */

    async getNetworkTrendingPools(network, include = "", page = 1) {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isPageValid(page);
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/networks/${network}/trending_pools?page=${page}&include=${include}`);
    }

    /**
     * Gets specific pool on a network
     * 
     * @param {String} network Network id (example: "eth", "ton")
     * @param {String} address Pool address
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @returns {JSON} Specific pool on a network
     */

    async getNetworkPool(network, address, include = "") {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isValidType(address, 'string', "Address must be a valid string.");
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/networks/${network}/pools/${address}?include=${include}`);
    }

    /**
     * Gets multiple pools on a network
     * 
     * @param {String} network Network id (example: "eth", "ton")
     * @param {Array} Array of pool addresses
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @returns {JSON} Pools on a network
     */

    async getMultipleNetworkPools(network, addressesArray, include = "") {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isArrayValid(addressesArray, "Addresses must be a non-empty array.");
        if (include) this.isIncludeValid(include, allowedIncludes);
        const addresses = this.arrayToString(addressesArray);
        return this.executeQuery(`/networks/${network}/pools/multi/${addresses}?include=${include}`);
    }

    /**
     * Gets pools on a network with most amount of transactions past 24h
     * 
     * @param {String} network Network id (example: "eth", "ton")
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @param {Number} page Page through results
    * @returns {JSON} Pools with most amount of transactions past 24h
     */

    async getTopTransactionsNetworkPools(network, include = "", page = 1) {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isPageValid(page);
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/networks/${network}/pools?sort=h24_tx_count_desc&include=${include}&page=${page}`);
    }

    /**
     * Gets pools on a network with most amount of trading volume past 24h
     * 
     * @param {String} network Network id (example: "eth", "ton")
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @param {Number} page Page through results
    * @returns {JSON} Pools with most amount of trading volume past 24h
     */

    async getTopVolumeNetworkPools(network, include = "", page = 1) {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isPageValid(page);
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/networks/${network}/pools?sort=h24_volume_usd_desc&include=${include}&page=${page}`);
    }

    /**
     * Gets a list of latest pools on GeckoTerminal
     * 
     * @param {String} network Network id (example: "eth", "ton") 
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @param {Number} page Page through results 
     * @returns {JSON} Newest (latest) pools on a specified network
     */

    async getNetworkLatestPools(network, include = "", page = 1) {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isPageValid(page);
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/networks/${network}/new_pools?include=${include}&page=${page}`);
    }

    /**
     * Gets a list of newest (latest) pools across all networks on GeckoTerminal
     * 
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @param {Number} page Page through results
     * @returns {JSON} Newest (latest) pools across all networks on GeckoTerminal
     */

    async getLatestPools(include = "", page = 1) {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        this.isPageValid(page);
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/networks/new_pools?include=${include}&page=${page}`);
    }

    /**
     * Gets token info on a specified network
     * 
     * @param {String} network Network id (example: "eth", "ton") 
     * @param {Array} addressesArray Array of tokens addresses 
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: top_pools.
     * @returns {JSON} Token (or tokens) info on a specified network.
     */

    async getTokenInfo(network, addressesArray, include = "") {
        const allowedIncludes = ["top_pools"];
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isArrayValid(addressesArray, "Addresses must be a non-empty array.");
        if (include) this.isIncludeValid(include, allowedIncludes);
        const addresses = this.arrayToString(addressesArray);
        const endpoint = addressesArray.length === 1 
            ? `/networks/${network}/tokens/${addresses}?include=${include}`
            : `/networks/${network}/tokens/multi/${addresses}?include=${include}`;
        return this.executeQuery(endpoint);
    }

    /**
     * Gets pool info on a specified network.
     * 
     * @param {String} network Network id (example: "eth", "ton") 
     * @param {String} poolAddress Pool address.
     * @returns {JSON} Pool info
     */

    async getPoolInfo(network, poolAddress) {
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isValidType(poolAddress, 'string', "Pool address must be a valid string.");
        return this.executeQuery(`/networks/${network}/pools/${poolAddress}/info`);
    }

    /**
     * Gets 100 tokens info across all networks ordered by most recently updated
     * @param {String} network Network id (example: "eth", "ton") 
     * @param {String} include Optional. Attributes for related resources to include, which will be returned under the top-level "included" key. Available includes for this method: base_token, quote_token, dex.
     * @returns {JSON} 100 tokens info across all networks ordered by most recently updated
     */

    async getRecentTokens(network = "", include = "") {
        const allowedIncludes = ["base_token", "quote_token", "dex"];
        if (network) this.isValidType(network, 'string', "Network must be a valid string.");
        if (include) this.isIncludeValid(include, allowedIncludes);
        return this.executeQuery(`/tokens/info_recently_updated?network=${network}&include=${include}`);
    }

    /**
     * Gets last 300 trades in past 24 hours from a pool
     * 
     * @param {String} network Network id (example: "eth", "ton")
     * @param {String} poolAddress Pool address
     * @param {Number} tradeVolume Optional. Sorts results by trade volume. (Example: if set to 10000, only trades with trade volume more than 10k will be displayed)
     * @returns {JSON} Last 300 trades in past 24 hours from a pool.
     */

    async getTrades(network, poolAddress, tradeVolume = 0) {
        this.isValidType(network, 'string', "Network must be a valid string.");
        this.isValidType(poolAddress, 'string', "Pool address must be a valid string.");
        this.isTradeVolumeValid(tradeVolume);
        return this.executeQuery(`/networks/${network}/pools/${poolAddress}/trades?trade_volume_in_usd_greater_than=${tradeVolume}`);
    }
}

module.exports = GeckoTail;
