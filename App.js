import * as HttpServer from './utils/http-server.js';
import * as Path from './utils/path.js';
import Request from './http/Request.js';

/**
 * main Application class of Dragonfly
 */
export default class App
{
	/**
	 * @type {Router}
	 */
	#router;
	
	/**
	 * @type (string)
	 */
	#webRoot;
	
	/**
	 * Construct app
	 * 
	 * @param 0.router  {Router}
	 * @param 0.webRoot (string)
	 */
	constructor( { router, webRoot=defaultWebRoot(), }, )
	{
		this.#router= router;
		this.#webRoot= webRoot;
	}
	
	/**
	 * Listen a host with HTTP
	 * 
	 * @param host (string)
	 * 
	 * @return ~<void>
	 */
	async listenHTTP( host, { concurrency=1024, }={}, )
	{
		let listening= 0;
		
		const listen= async ( server, )=> {
			++listening;
			
			const { value, done, }= await server.next();
			
			--listening;
			
			if( done )
				return;
			
			handle( value, );
		};
		
		const handle= async ( denoRequest, )=> {
			const request= new Request( denoRequest, );
			
			const route= this.#router.dispatch( request, );
			
			if( route )
			{
				const response= await route.run( { request, app:this, }, );
				
				denoRequest.respond( response, );
			}
		};
		
		const server= HttpServer.serve( host, )[Symbol.asyncIterator]();
		
		while( true )
		{
			if( listening < concurrency )
				listen( server, );
			else
				await timeout();
		}
	}
}

/**
 * Generate the default web root
 * 
 * @return (string)
 */
function defaultWebRoot()
{
	const file= Path.traceBack( 2, );
	
	return Path.dirname( file, ).replace( /^file:\/\//, '', ).replace( /\/([A-Z]:\/)/, '$1', );
}
