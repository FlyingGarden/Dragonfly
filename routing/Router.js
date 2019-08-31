import * as Path from '../utils/path.js';

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
		
		this.#routes= routes;
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
