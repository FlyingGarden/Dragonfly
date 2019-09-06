#!/usr/bin/env -S deno --allow-net --allow-read
import 'https://better-js.fenz.land/index.js';
import App from './App.js';
import Args from './utils/Args.js';

const args= new Args( ...Deno.args );

const webRoot= args.getOption( 'root', Deno.cwd(), );

const app= new App( { webRoot, }, );

const host= args.getOption( 'host', '0.0.0.0:2048', );

app.listenHTTP( host, );
