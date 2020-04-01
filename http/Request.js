import '../utils/better-js.js';
import Query from './Query.js';
import { AcceptArray, } from './accept.js';
import { decode, } from '../utils/text-encoder.js';

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
	 * @type {AcceptArray}
	 */
	#accept;
	
	/**
	 * @type {Uint8Array}
	 */
	#body;
	
	/**
	 * @type (string)
	 */
	#contentType;
	
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
		
		this.#accept= new AcceptArray( this.#headers.get( 'Accept', ) || '*/*', path, );
		
		this.#contentType= this.#headers.get( 'Content-Type', ) || 'application/octet-stream';
		
		return (async ()=> {
			this.#body= await Deno.readAll( denoRequest.body, );
			
			return this;
		})();
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
	
	/**
	 * @return {AcceptArray}
	 */
	get accept()
	{
		return this.#accept;
	}
	
	/**
	 * @return {Uint8Array}
	 */
	get body()
	{
		return this.#body;
	}
	
	/**
	 * @return (string)
	 */
	get text()
	{
		return decode( this.#body, );
	}
	
	/**
	 * @return <{Uint8Array}|(string)|{Query}|mixed>
	 */
	get contentType()
	{
		return this.#contentType;
	}
	
	/**
	 * @return {AcceptArray}
	 */
	get content()
	{
		if( this.#contentType === 'application/octet-stream' )
			return this.#body;
		
		const content= decode( this.#body, );
		
		switch( this.#contentType )
		{
			default:
				return content;
			
			case 'application/json':
				return JSON.parse( content, );
			
			case 'application/x-www-form-urlencoded':
				return new Query( content, );
		}
	}
}
