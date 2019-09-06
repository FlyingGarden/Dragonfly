Dragonfly
================================

A light HTTP server on Deno

## Basic Usage

```javascript
import App from 'https://dragonfly.fenz.land/App.js';

const app= new App();

app.listenHTTP( '0.0.0.0:8192', );
```

### with Routing

```javascript
import App from 'https://dragonfly.fenz.land/App.js';
import Router from 'https://dragonfly.fenz.land/routing/Router.js';

const router= new Router( {
	routes: [
		{
			path: '/',
			method: 'GET',
			accept: 'text/html',
			controller: ()=>'<!DOCTYPE html><h1>Hello World<h1>',
		},
	],
}, );

const app= new App( { router, }, );

app.listenHTTP( '0.0.0.0:8192', );
```

### with Controller

`/path-to/controller/main.js`
```javascript

export default function index()
{
	return 'Home Page';
}

export function hello()
{
	return 'Hello!';
}
```

```javascript
const router= new Router( {
	controllerPath: '/path-to/controller',
	routes: [
		{
			path: '/',
			controller: '/main.js',
		},
		{
			path: '/hello',
			controller: '/main.js#hello',
		},
	],
}, );
```


## CLI server

If you just need a http file server. You can just run: 
```bash
> deno --allow-net --allow-read https://dragonfly.fenz.land/cli.js
```

Or you can install the CLI server with: 
```bash
> deno install dragonfly https://dragonfly.fenz.land/cli.js --allow-net --allow-read
```

Then you can just run: 

Or you can install the CLI server with: 
```bash
> dragonfly
```

```bash
> dragonfly --host=0.0.0.0:8192
```

```bash
> dragonfly --root=/path-to/your/web-root
```
