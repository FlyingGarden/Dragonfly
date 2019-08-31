import { encode, } from '../utils/text-encoder.js';

export default class Response
{
	/**
	 * @type (number)
	 */
	#status;
	
	/**
	 * @type {Headers}
	 */
	#headers;
	
	/**
	 * @type (string)
	 */
	#body;
	
	/**
	 * Construct a response (server-side)
	 * 
	 * @param 0.body     <mixed>
	 * @param 0.?status  (number)
	 * @param 0.?headers {}
	 */
	constructor( { body='', status=200, headers={}, }, )
	{
		this.#status= status;
		this.#headers= new Headers( headers, );
		
		if( typeof body === 'string' )
		{
			this.#body= encode( body, );
			this.#headers.set( 'Content-Length', this.#body.length, )
		}
		else
			this.#body= body;
	}
	
	/**
	 * @return (number)
	 */
	get status()
	{
		return this.#status;
	}
	
	/**
	 * @return {Headers}
	 */
	get headers()
	{
		return this.#headers;
	}
	
	/**
	 * @return (string)
	 */
	get body()
	{
		return this.#body;
	}
}
