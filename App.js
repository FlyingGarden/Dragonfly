import * as Path from './utils/path.js';

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
