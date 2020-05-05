<script>
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Datepicker from '../Components/Datepicker.svelte';
	import { formatDate } from 'timeUtils';
	let formattedSelected;
	let selected;
	const[send, receive] = crossfade({
		duration: d => Math.sqrt(d*200),
		fallback(node, params){
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '': style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t};
				`
			};
		}
	});

	let uid = 1;

	let todos = [
		{ id: uid++, date_id: '05/05/2020', done: false, description: 'sample incomplete task'},
		{ id: uid++, date_id: '05/05/2020', done: true, description: 'sample complete task'},
		{ id: uid++, date_id: '05/06/2020', done: false, description: ' may 6 placeholder task'},
		{ id: uid++, date_id: '05/05/2020', done: false, description: 'another placeholder task'},
		{ id: uid++, date_id: '05/05/2020', done: false, description: 'another placeholder task'},
		{ id: uid++, date_id: '05/07/2020', done: false, description: 'may 7 placeholder task'},
		{ id: uid++, date_id: '05/07/2020', done: true, description: 'may 7 placeholder task'},
		{ id: uid++, date_id: '05/08/2020', done: false, description: 'may 8 placeholder task'},
		{ id: uid++, date_id: '05/08/2020', done: true, description: 'may 8 placeholder task'},
		{ id: uid++, date_id: '05/09/2020', done: false, description: 'may 9 placeholder task'},
		{ id: uid++, date_id: '05/09/2020', done: true, description: 'may 9 placeholder task'},

	];

	function add(input){
		const todo = {
			id: uid++,
			date_id: formattedSelected,
			done: false,
			description: input.value
		};

		todos = [todo, ...todos];
		input.value = '';
	}

	function remove(todo){
		todos = todos.filter(t => t!== todo);
	}

	function mark(todo, done) {
		todo.done = done;
		remove(todo);
		todos = todos.concat(todo);
	}

	//  Testing a function
	//  function convertDate(formattedSelected){
	// 	var date_ss = formattedSelected;
	// 	var splitted = date_ss.split("/")
	// 	var newDate = new Date();
	// 	newDate.setDate(splitted[0]);
	// 	newDate.setMonth(splitted[1]);
	// 	newDate.setYear(splitted[2]);
	// 	{console.log(newDate), ''}
	// 	return newDate;
	// }
	// alert(typeof {formattedSelected});
</script>
<main>
<h1>Daily To-Do</h1>
</main>
<div class='board'>
	<input
		placeholder='what needs to be done this day?'
		on:keydown={e => e.key === 'Enter' && add(e.target)}
	>

	<div class='left'>
		<h2>todo</h2>
		{#each todos.filter(t => !t.done && formattedSelected == t.date_id) as todo (todo.id)}
			<label
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
				animate:flip="{{duration: 200}}"
			>
				<input type=checkbox on:change={() => mark(todo, true)}>
				{todo.description}
				<button on:click="{() => remove(todo)}">remove</button>
			</label>
		{/each}
	</div>
	<div class='right'>
	<h2>done</h2>
	{#each todos.filter(t => t.done && formattedSelected == t.date_id) as todo (todo.id)}
		<label
			class='done'
			in:receive="{{key: todo.id}}"
			out:send="{{key: todo.id}}"
			animate:flip="{{duration: 200}}"
		>
			<input type=checkbox checked={true} on:change={() => mark(todo, false)}>
			{todo.description}
			<button on:click={()=> remove(todo)}>remove</button>
		</label>
	{/each}
	</div>
</div>
<Datepicker bind:formattedSelected/>


<div class='dp'>
	{formattedSelected}
</div>



<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 1em;
		max-width: 16em;
		margin: 0 auto;
		position: absolute;
		top: 15%;
		left: 5%;
		overflow-wrap: break-word;
	}

	.board > input {
		font-size: 1.1em;
		grid-column: 1/3;
		border-radius: 5px;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
		user-select: none;
		margin-right: 210px;
	}
	label {
		position: relative;
		line-height: 1.2;
		padding: 0.5em 2.5em 0.5em 2em;
		margin: 0 0 0.5em 0;
		border-radius: 5px;
		user-select: none;
		border: 1px solid hsl(240, 8%, 70%);
		background-color:hsl(240, 8%, 93%);
		color: #333;
		min-width: 200px;
		max-width: 200px;
		overflow-wrap: break-word;
	}

	input[type="checkbox"] {
		position: absolute;
		left: 0.5em;
		top: 0.6em;
		margin: 0;
	}

	.done {
		border: 1px solid hsl(240, 8%, 90%);
		background-color:hsl(240, 8%, 98%);
	}

	button {
		position: absolute;
		top: 0;
		right: 0.2em;
		width: 2em;
		height: 100%;
		background: no-repeat 50% 50% url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M17,7H14.5L13.5,6H10.5L9.5,7H7V9H17V7M9,18H15A1,1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
		background-size: 1.4em 1.4em;
		border: none;
		opacity: 0;
		transition: opacity 0.2s;
		text-indent: -9999px;
		cursor: pointer;
	}

	label:hover button {
		opacity: 1;
	}
	.dp{
		position: absolute;
		top:10%;
		left: 300px;
	}
</style>