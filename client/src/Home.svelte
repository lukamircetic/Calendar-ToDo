<script>
  import { onMount } from 'svelte'
  import { quintOut } from 'svelte/easing'
  import { crossfade } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import Datepicker from '../Components/Datepicker.svelte'
  import { formatDate } from 'timeUtils'
  import { fetchPost, fetchGet, fetchDelete, fetchUpdate } from './helpers.js'
  import { current_user_id } from './states.js'
  let formattedSelected
  let selected
  let lists = {}
  let mounted = false
  let todos = []
  let currentList

  //todos: store the incoming items, sort by list, and display -- done
  // remove items, mark as complete, etc --- done

  //TODO - need to figure out how to not post an empty list
  //on mount I get all the user's lists from the db and assign them to lists param
  onMount(async () => {
    const response = await fetchGet('api/list')
    console.log('list response', response)
    lists = { ...response.data }
    mounted = true
    const items = await fetchGet('api/item')
    todos = items.data
    console.log('alltodos;', todos)
  })

  //Todo list styles... basically taken from the svelte tutorial
  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
    fallback(node, params) {
      const style = getComputedStyle(node)
      const transform = style.transform === 'none' ? '' : style.transform

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t};
				`
      }
    }
  })

  // Here i check if the date has been posted as a list yet, if not I add it
  // Also here I will assign the current list id to the variable, kill two birds with one stone i guess
  $: if (formattedSelected != undefined && mounted == true) {
    let exists = false
    for (const [key, value] of Object.entries(lists)) {
      if (value.name === `${formattedSelected}`) {
        currentList = value
        exists = true
        break
      }
    }
    if (!exists) {
      createList(formattedSelected)
    }
  }

  // Post a new list to db. Param is the date which will be the name of the list
  async function createList(datename) {
    const response = await fetchPost(`/api/list`, {
      name: `${formattedSelected}`,
      description: `${formattedSelected} list`
    })
    if (!response) {
      // TODO add a better error message here
      console.log("Couldn't create list")
    }
    let list = response.data
    lists = { ...lists, list }
  }
  // Add an item to db
  async function addItem(item) {
    const response = await fetchPost('/api/item', {
      name: item.name,
      status: item.status,
      due: item.date,
      list: item.list._id
    })
    if (!response) {
      console.log("Couldn't add item")
    }
    let addedItem = response.data
    todos = [...todos, addedItem]
    console.log('allTodos with new item', todos)
  }

  async function removeItem(todo) {
    const response = await fetchDelete(`/api/item/${todo._id}`)
    if (!response) {
      console.log('Could not delete item')
    }
    todos = todos.filter(t => t !== todo)
  }

  async function updateItem(todo) {
    const response = await fetchUpdate(`/api/item/${todo._id}`, {
      status: todo.status,
    })
    if(!response){
      console.log('Could not update item')
    }
  }
  // add an item to a list (date)
  function add(input) {
    const todo = {
      name: input.value,
      status: 'active',
      due: new Date(formattedSelected),
      list: currentList
    }
    addItem(todo)
    input.value = ''
  }

  function remove(todo) {
    todos = todos.filter(t => t !== todo)
  }

  function mark(todo, done) {
    todo.status = done
    updateItem(todo)
    remove(todo)
    todos = todos.concat(todo)
  }
</script>

<style>
  :root {
    --bg-col: #6d6a75;
    --hl-col: #9b1d20;
    --text-col: #fff;
    --accent-col: #bfbdc1;
    --sec-col: #586994;
  }

  body {
    background-color: var(--accent-col);
    border: none;
    width: 101%;
    height: 101%;
    position: absolute;
    margin-left: -25px;
    margin-top: -10px;

    padding: 0;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 100%;
    margin: 0 auto;
    line-height: 50%;
  }
  h1 {
    color: var(--sec-col);
    text-transform: uppercase;
    font-size: 100px;
    font-weight: 200;
    font-family: 'Manrope';
  }
  .board {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em;
    max-width: 45em;
    max-height: 50%;
    margin: 0 auto;
    position: absolute;
    top: 300px;
    left: 50%;
    margin-left: -600px;

    overflow-y: auto;
    overflow-x: hidden;
  }

  .board > input {
    font-family: 'Manrope';
    font-size: 1.1em;
    grid-column: 1/3;
    border-radius: 5px;
  }

  h2 {
    font-size: 2em;
    font-weight: 200;
    user-select: none;
    margin-right: 210px;
    font-family: 'Manrope';
    color: var(--sec-col);
  }
  label {
    position: relative;
    line-height: 1.2;
    padding: 0.5em 2.5em 0.5em 2em;
    margin: 0 0 0.5em 0;
    border-radius: 5px;
    user-select: none;
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(240, 8%, 93%);
    color: #333;
    min-width: 200px;
    max-width: 200px;
    overflow-wrap: break-word;
    font-family: 'Manrope';
  }

  input[type='checkbox'] {
    position: absolute;
    left: 0.5em;
    top: 0.6em;
    margin: 0;
    background-color: var(--accent-col);
  }

  .done {
    border: 1px solid hsl(240, 8%, 90%);
    background-color: hsl(240, 8%, 98%);
  }

  button {
    position: absolute;
    top: 0;
    right: 0.2em;
    width: 2em;
    height: 100%;
    background: no-repeat 50% 50%
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M17,7H14.5L13.5,6H10.5L9.5,7H7V9H17V7M9,18H15A1,1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
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
  .dp {
    font-family: 'Manrope';
    font-weight: 600;
    font-size: 70px;
    position: absolute;
    top: 180px;
    left: 50%;
    margin-left: -600px;
    color: var(--sec-col);
  }
</style>

<body>
  <main>
    <h1>To-Do Calendar</h1>
  </main>
  <div class="box">
    <div class="board">
      <input
        placeholder="What needs to be done this day?"
        on:keydown={e => e.key === 'Enter' && add(e.target)} />
      <div class="left">
        <h2>todo</h2>
        {#each todos.filter(t => t.status === 'active' && currentList._id === t.list) as todo (todo._id)}
          <label
            in:receive={{ key: todo._id }}
            out:send={{ key: todo._id }}
            animate:flip={{ duration: 200 }}>
            <input type="checkbox" on:change={() => mark(todo, 'complete')} />
            {todo.name}
            <button on:click={() => removeItem(todo)}>remove</button>
          </label>
        {/each}
      </div>
      <div class="right">
        <h2>done</h2>
        {#each todos.filter(t => t.status == 'complete' && currentList._id == t.list) as todo (todo._id)}
          <label
            class="done"
            in:receive={{ key: todo._id }}
            out:send={{ key: todo._id }}
            animate:flip={{ duration: 200 }}>
            <input
              type="checkbox"
              checked={true}
              on:change={() => mark(todo, 'active')} />
            {todo.name}
            <button on:click={() => removeItem(todo)}>remove</button>
          </label>
        {/each}
      </div>
    </div>
    <Datepicker bind:formattedSelected class="calendar" />
  </div>
  <div class="dp">{formattedSelected}</div>
</body>
