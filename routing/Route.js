import Response from '../http/Response.js';

export default class Route
{
	/**
	 * @type (string)
	 */
	#path;
	
	/**
	 * @type (string)
	 */
	#method;
	
	/**
	 * @type (string)
	 */
	#accept;
	
	/**
	 * @type < (string) | { request:{Request}, Response:Response, args:{}, ... }=><{Response}|(string)> >
	 */
	#controller;
	
	/**
	 * @type < (string) | { next:=>, request:{Request}, Response:Response, args:{}, ... }=><{Response}> >
	 */
	#middlewares;
	
	/**
	 * Construct a route
	 * 
	 * @param 0.path       (string)       exact path pattern
	 *                     {RegExp}       regexp path pattern, named groups for route params
	 * @param 0.?method    (string)       HTTP method
	 * @param 0.?accept    {AcceptArray}  HTTP accept
	 * @param 0.controller (string)       controller module path [dynamic], [recommanded].
	 *                     {Function}     built-in controller, generally for simple controllers.
	 */
	constructor( { path, method='*', accept='*/*', controller, middlewares=[], }, )
	{
		this.#path= path;
		this.#method= method;
		this.#accept= accept;
		this.#controller= controller;
		this.#middlewares= middlewares;
	}
	
	/**
	 * Match the request for a match level.
	 * 
	 * @param request {Request}
	 * 
	 * @return (number)  match level
	 */
	match( request, )
	{
		let level= 1;
		
		// Path: strict string match is prior to regexp match.
		level*= (
			this.#path instanceof RegExp? 
			(this.#path.test( request.path, )? 1: 0): 
			(this.#path === request.path? 2: 0)
		);
		
		if( !level )
			return 0;
		
		// Method: strict match is prior to *.
		level*= this.#method === '*'? 1: request.method === this.#method? 2: 0;
		
		if( !level )
			return 0;
		
		// Accept: strict match is prior to *.
		level*= request.accept.match( this.#accept, );
		
		if( !level )
			return 0;
		
		return level;
	}
	
	/**
	 * Run the route.
	 * 
	 * @param 0.request {Request}
	 * @param 0...rest  {}
	 * 
	 * @return {Response}
	 */
	async run( { request, ...rest }, )
	{
		const args= request.path.matchGroup( this.#path, );
		
		const payload= { request, Response, args, ...rest, };
		
		try
		{
			const $controller= loadFunction( this.#controller, );
			const $middlewares= Promise.all( this.#middlewares.map( loadFunction, ), );
			
			const controller= await $controller;
			const middlewares= await $middlewares;
			
			const process= middlewares.reduceRight(
				( process, middleware, )=>
					async payload=> middleware( payload, process, )
				,
				wrapController( controller, this.#accept, ),
			);
			
			return process( payload, );
		}
		catch( e )
		{
			console.error( e, );
			
			return makeResponse( this.#accept, e, 500, );
		}
	}
}

function wrapController( controller, accept, )
{
	return async payload=> {
		const responded= await controller( payload, );
		
		if( responded instanceof Response )
			return responded;
		else
			return makeResponse( accept, responded, );
	}
}

function makeResponse( accept, responded, status=200, headers={}, )
{
	switch( accept )
	{
		default:
		case 'text/html':
			return Response.newHTML( `${responded}`, { status, headers, }, );
		break;
		
		case 'application/json':
			return new Response( {
				body: JSON.stringify( responded, ),
				status,
				headers: {
					...headers,
					'Content-Type': 'application/json',
				},
			}, );
		break;
		
		case 'text/javascript':
		case 'application/javascript':
			return new Response( {
				body: `${responded}`,
				status,
				headers: {
					...headers,
					'Content-Type': 'application/javascript',
				},
			}, );
		break;
	}
}

async function loadFunction( funcOrName, )
{
	if( funcOrName instanceof Function )
		return funcOrName;
	else
	if( funcOrName instanceof String )
	{
		const [ url, name='default', ]= funcOrName.split( '#', );
		
		const $module= import (url).catch( e=> {
			throw new Error( `There is something wrong on loading [${funcOrName}]:\n\n${e}`, );
		}, );
		
		const func= (await $module)[name];
		
		if(!( func instanceof Function ))
			throw new Error( `'${funcOrName}' is not a function`, );
		
		return func;
	}
	else
		throw new Error( `Invalid function ${funcOrName}`, );
}
