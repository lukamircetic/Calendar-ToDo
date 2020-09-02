import { writable } from 'svelte/store'

export let current_user_id = writable("");
export let user_token = writable("");
export let user_name = writable("");