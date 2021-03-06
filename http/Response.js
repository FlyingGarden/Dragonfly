import '../utils/better-js.js';
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
	 * @type <{Uint8Array}|{Reader}>
	 */
	#body;
	
	/**
	 * Construct a response (server-side)
	 * 
	 * @param 0.body     <(string)|{Uint8Array}|{Reader}>
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
			this.#headers.set( 'Content-Length', `${this.#body.length}`, );
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
	 * @return <{Uint8Array}|{Reader}>
	 */
	get body()
	{
		return this.#body;
	}
	
	/**
	 * Construct a HTML response
	 * 
	 * @param body       (string)
	 * @param 1.?status  (number)
	 * @param 1.?headers {}
	 * 
	 * @return {Response}
	 */
	static newHTML( body, { status=200, headers={}, }={}, )
	{
		return new this( { status, body, headers:{
			'Content-Type': 'text/html;charset=utf-8',
			...headers,
		}, }, );
	}
	
	/**
	 * Construct a JSON response
	 * 
	 * @param body       (string)  JSON string
	 *                   <mixed>   something will be JSON.stringified
	 * @param 1.?status  (number)
	 * @param 1.?headers {}
	 * 
	 * @return {Response}
	 */
	static newJSON( body=null, { status=200, headers={}, }={}, )
	{
		if(!( typeof body === 'string' && isJson( body, ) ))
			body= JSON.stringify( body, );
		
		return new this( { status, body, headers:{
			'Content-Type': 'application/json',
			...headers,
		}, }, );
	}
	
	/**
	 * Construct a redirect response
	 * 
	 * @param location   (string)  location URL
	 *                   <mixed>   something will be JSON.stringified
	 * @param 1.?status  (number)
	 * @param 1.?headers {}
	 * 
	 * @return {Response}
	 */
	static redirect( location, { status=301, headers={}, }={}, )
	{
		return new this( { status, headers:{
			'Location': location,
			...headers,
		}, }, );
	}
}

/**
 * Check whether a string is a JSON string
 * 
 * @param string (string)
 * 
 * @return (boolean)
 */
function isJson( string, )
{
	try
	{
		return JSON.parse( string, ()=> true, );
	}
	catch( e )
	{
		return false;
	}
}
