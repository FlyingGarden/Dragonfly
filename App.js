import './utils/better-js.js';
import * as HttpServer from './utils/http-server.js';
import * as Path from './utils/path.js';
import { file_length, open_file, is_file, file_exists, } from './utils/fs.js';
import Router from './routing/Router.js';
import Request from './http/Request.js';
import Response from './http/Response.js';
import { ext2mime, } from './http/mime.js';
import notFound from './routing/not-found.js';

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
	constructor( { router=new Router(), webRoot=defaultWebRoot(), }={}, )
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
			
			this.handle( new Request( value, ), )
				.then( response=> value.respond( response, ), )
			;
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
	
	/**
	 * Handle a single deno request
	 * 
	 * @param denoRequest {Request}
	 * 
	 * @return ~{Response}
	 */
	async handle( request, )
	{
		const route= this.#router.dispatch( request, );
		
		if( route )
			return route.run( { request, app:this, }, );
		else
		if( await this.hasFile( request.path, ) )
			return makeFileResponse( this.localPath( request.path, ), );
		else
			return notFound( { request, app:this, }, );
	}
	
	/**
	 * Check whether a file exists in web root.
	 * 
	 * @param path (string)
	 * 
	 * @return ~(boolean)
	 */
	async hasFile( path, )
	{
		const localPath= this.localPath( path, );
		
		return (await file_exists( localPath, )) && (await is_file( localPath, ));
	}
	
	/**
	 * Transform url path into local path
	 */
	localPath( path, )
	{
		return `${this.#webRoot}${path}`;
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

/**
 * Make file response
 * 
 * @access private
 * 
 * @param path (string)
 * 
 * @return ~{Response}
 */
async function makeFileResponse( path, )
{
	const ext= (x=> x? x[0]: '')( path.match( /\.\w+$/, ), );
	const mime= ext2mime( ext, ) || 'text/plain';
	
	const $reader= open_file( path, );
	const $length= file_length( path, );
	
	return new Response( {
		body: await $reader,
		status: 200,
		headers: {
			'Content-Type': mime,
			'Content-Length': await $length,
			'Access-Control-Allow-Origin': '*',
		},
	}, );
}
