
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
	 * @param 0.controllerPath (string)
	 */
	constructor( { routes, controllerPath, }, )
	{
		this.#controllerPath=controllerPath;
		
		this.#routes= routes;
	}
}
