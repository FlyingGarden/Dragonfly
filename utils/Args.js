import './better-js.js';

export default class Args
{
	/**
	 * @type (string)
	 */
	#command;
	
	/**
	 * @type [](string)
	 */
	#args;
	
	/**
	 * @type [](string)
	 */
	#params= [];
	
	/**
	 * @type { (string):<(string)|(boolean)>, }
	 */
	#options= {};
	
	/**
	 * @param command (string)
	 * @param ...args (string)
	 */
	constructor( command, ...args )
	{
		this.#command= command;
		this.#args= args;
		
		for( const arg of args )
		{
			if( arg.startsWith( '--' ) )
			{
				const [ option, ...rest ]= arg.slice( 2, ).split( '=', );
				
				this.#options[option]= rest.length? rest.join( '=', ): true;
			}
			else
			if( arg.startsWith( '-', ) )
			{
				const options= arg.slice( 1, ).split( '', );
				
				for( const option of options )
					this.#options[option]= true;
			}
			else
				this.#params.push( arg, );
		}
	}
	
	/**
	 * @return (string)
	 */
	get command()
	{
		return this.#command;
	}
	
	/**
	 * @return [](string)
	 */
	get args()
	{
		return [ ...this.#args, ];
	}
	
	/**
	 * @return [](string)
	 */
	get params()
	{
		return [ ...this.#params, ];
	}
	
	/**
	 * @return [](string)
	 */
	get options()
	{
		return { ...this.#options, };
	}
	
	/**
	 * check whether the argument bag has the given option.
	 * 
	 * @param ...options [](string)  option name, must without '-' or '--'
	 */
	hasOption( ...options )
	{
		return options.some( option=> this.#options.hasOwnProperty( option, ), );
	}
	
	/**
	 * check whether the argument bag has the given option.
	 * 
	 * @param option (string)     option name, must without '-' or '--'
	 * @param deflt  (string)     default value
	 *               =>(string)   default value
	 */
	getOption( option, deflt=undefined, )
	{
		return (
			this.hasOption( option, )? this.#options[option]: 
			deflt instanceof Function? deflt(): deflt
		);
	}
	
}
