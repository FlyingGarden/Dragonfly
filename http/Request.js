import Query from './Query.js';

export default class Request
{
	/**
	 * @type (string)
	 */
	#url;
	
	/**
	 * @type (string)
	 */
	#path;
	
	/**
	 * @type {Query}
	 */
	#query;
	
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
		
		const [ path, query='', ]= this.#url.split( '?', );
		
		this.#path= path;
		this.#query= new Query( query, );
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
	get path()
	{
		return this.#path;
	}
	
	/**
	 * @return {Query}
	 */
	get query()
	{
		return this.#query;
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
