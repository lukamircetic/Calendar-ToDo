import App from './App.svelte';

import SvelteCalendar from 'svelte-calendar';
const app = new App({
	target: document.body,
	props: {
		name: 'Luka'
	}
});

export default app;