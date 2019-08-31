
export default class Request
{
	/**
	 * @type (string)
	 */
	#url;
	
	/**
	 * @type (string)
	 */
	#method;
	
	/**
	 * @type {Headers}
	 */
	#headers;
	
	/**
	 * Construct a HTTP request (server-side)
	 * 
	 * @param denoRequest ServerRequest
	 */
	constructor( denoRequest, )
	{
		this.#url= denoRequest.url;
		this.#method= denoRequest.method;
		this.#headers= denoRequest.headers;
	}
	
	/**
	 * @return (string)
	 */
	get url()
	{
		return this.#url;
	}
	
	/**
	 * @return (string)
	 */
	get method()
	{
		return this.#method;
	}
	
	/**
	 * @return {Headers}
	 */
	get headers()
	{
		return this.#headers;
	}
}
