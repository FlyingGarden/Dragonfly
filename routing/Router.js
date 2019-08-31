import * as Path from '../utils/path.js';
import Route from './Route.js';

export default class Router
{
	/**
	 * @type (string)
	 */
	#controllerPath;
	
	/**
	 * @type []{Route}
	 */
	#routes;
	
	/**
	 * Consturct a router
	 * 
	 * @param 0.routes          {}[]
	 * @param 0.?controllerPath (string)
	 */
	constructor( { routes, controllerPath=defaultControllerPath(), }, )
	{
		this.#controllerPath=controllerPath;
		
		this.#routes= routes.map( meta=> {
			if( typeof meta.controller === 'string' )
				meta.controller= controllerPath + meta.controller;
			
			const route= new Route( meta, );
			
			return route;
		}, );
	}
}

/**
 * Generate the default web root
 * 
 * @return (string)
 */
function defaultControllerPath()
{
	const file= Path.traceBack( 2, );
	
	return `${Path.dirname( file, )}/controllers`;
}
