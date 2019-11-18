import { decode, } from './text-encoder.js';
export { exists as file_exists, } from 'https://deno.land/std@v0.24.0/fs/exists.ts';

/**
 * Check whether a file is a file (not directory or symbol link).
 * 
 * @param path (string)
 * 
 * @return ~(boolean)
 */
export async function is_file( path, )
{
	return (await Deno.stat( path, )).isFile();
}

/**
 * Get file length or say size.
 * 
 * @param path (string)
 * 
 * @return ~(number)
 */
export async function file_length( path, )
{
	return (await Deno.stat( path, )).len;
}

/**
 * Read file and return content.
 * 
 * @param path (string)
 * 
 * @return ~(string)
 */
export async function read_file( path, { asText=true, }={}, )
{
	const $array= await Deno.readFile( path, );
	
	if( asText )
		return decode( $array, );
	else
		return $array;
}

/**
 * Open file and return reader.
 * 
 * @param path (string)
 * 
 * @return ~{Reader}
 */
export async function open_file( path, )
{
	return Deno.open( path, );
}
