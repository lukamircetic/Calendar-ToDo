<script>
  import { onMount } from 'svelte'
  import { quintOut } from 'svelte/easing'
  import { crossfade } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import Datepicker from '../Components/Datepicker.svelte'
  import { formatDate } from 'timeUtils'
  import { fetchPost, fetchGet, fetchDelete, fetchUpdate } from './helpers.js'
  import { current_user_id, user_name } from './states.js'
  let formattedSelected
  let selected
  let lists = {}
  let mounted = false
  let todos = []
  let currentList
  let currentStatement = ''

  // For the personal time statement at the top - in the future could change so when the user signs up that they input a name
  // but atm this is fine imo
  const timeStatement = () => {
    let d = new Date()
    let h = d.getHours()
    console.log('h', h)
    if (0 <= h && h < 12) {
      console.log(h)
      currentStatement = `Good morning, ${$user_name}`
    } else if (12 <= h && h < 18) {
      currentStatement = `Good afternoon, ${$user_name}`
    } else if (h >= 18) {
      currentStatement = `Good evening, ${$user_name}`
    }
  }
  $: console.log(currentStatement)
  timeStatement()
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
      status: todo.status
    })
    if (!response) {
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
    --prim-col: #464d77;
    --sec-col: #36827f;
    --tri-col: #f7d455;
    --tri-hover: #fcda61;
    --bg-col: #3a3a41;
    --bgg-col: #313036;
    --bggg-col: #2f2f33;
    --bg-hover: #42424b;
    --low-col: #7b88a3;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--bggg-col);
    position: absolute;
    overflow: auto;
    top: 0;
    left: 0;
  }

  .page-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 580px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  }

  .main-title {
    font-family: 'Montserrat', sans-serif;
    color: var(--tri-col);
    font-size: 60px;
    font-weight: 800;
    margin-top: 50px;
    margin-bottom: 35px;
  }

  @media (min-width: 1200px) {
    .date-wrapper {
      margin-top: 100px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
    }
    .todo-wrapper {
      width: 600px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .date-title {
      margin-right: 50px;
      width: 600px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  }
  @media (max-width: 1200px) {
    .date-title {
      margin-right: 50px;
      width: 600px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
    .date-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .date-title {
      margin-right: 50px;
      width: 600px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .todo-wrapper {
      width: 600px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .dp {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 75px;
    color: var(--tri-col);
    margin-bottom: 35px;
  }

  .board {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em;
    max-width: 45em;
    min-height: 400px;
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    align-content: flex-start;
  }

  .board > input {
    font-family: 'Roboto', sans-serif;
    max-width: 600px;
    max-height: 35px;
    font-size: 1.1em;
    grid-column: 1/3;
    border-radius: 5px;
    background-color: var(--bgg-col);
    color: white;
    border: 1px solid var(--tri-col);
  }
  .board > input::placeholder {
    color: var(--low-col);
  }
  .left {
    width: 50%;
  }

  .right {
    width: 50%;
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
    font-family: 'Roboto', sans-serif;
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
  .datepicker {
    width: 540px;
    height: 585px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .todo-title {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 25px;
    user-select: none;
    color: var(--tri-col);
  }

  /* Styles for items */
  .not-done {
    margin: 10px 0;
    width: 300px;
    color: white;
    /* text-transform: uppercase; */
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    overflow: auto;
    line-height: 20px;
    font-weight: 400;
    background-color: var(--bgg-col);
    border-radius: 3px;
    border: 1px solid var(--tri-col);
    display: block;
    position: relative;
    cursor: pointer;
    padding-left: 50px;
    padding-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .done {
    margin: 10px 0;
    width: 300px;
    color: var(--bggg-col);
    /* text-transform: uppercase; */
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
    background-color: var(--tri-col);
    border-radius: 3px;
    border: 1px solid black;
    display: block;
    position: relative;
    cursor: pointer;
    padding-left: 50px;
    padding-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .not-done input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  .done input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 7.5px;
    left: 5px;
    height: 25px;
    width: 25px;
    background-color: var(--bg-col);
    border-radius: 3px;
  }

  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  .done input ~ .checkmark:after {
    display: block;
  }

  .done .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid var(--tri-col);
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .not-done:hover input ~ .checkmark {
    background-color: var(--bg-hover);
  }
</style>

<link
  href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap"
  rel="stylesheet" />
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
  rel="stylesheet" />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
  rel="stylesheet" />
<body>
  <div class="page-wrapper">
    <div class="main-title">{currentStatement}</div>
    <div class="date-wrapper">
      <div class="date-title">
        <div class="dp">{formattedSelected}</div>
        <div class="board">
          <input
            placeholder="What needs to be done this day?"
            on:keydown={e => e.key === 'Enter' && add(e.target)} />
          <div class="todo-wrapper">
            <div class="left">
              <h2 class="todo-title">todo</h2>
              {#each todos.filter(t => t.status === 'active' && currentList._id === t.list) as todo (todo._id)}
                <label
                  class="not-done"
                  in:receive={{ key: todo._id }}
                  out:send={{ key: todo._id }}
                  animate:flip={{ duration: 200 }}>
                  {todo.name}
                  <input
                    type="checkbox"
                    on:change={() => mark(todo, 'complete')} />
                  <span class="checkmark" />
                  <button on:click={() => removeItem(todo)}>remove</button>
                </label>
              {/each}
            </div>
            <div class="right">
              <h2 class="todo-title">done</h2>
              {#each todos.filter(t => t.status == 'complete' && currentList._id == t.list) as todo (todo._id)}
                <label
                  class="done"
                  in:receive={{ key: todo._id }}
                  out:send={{ key: todo._id }}
                  animate:flip={{ duration: 200 }}>
                  {todo.name}
                  <input
                    type="checkbox"
                    checked={true}
                    on:change={() => mark(todo, 'active')} />
                  <span class="checkmark" />
                  <button on:click={() => removeItem(todo)}>remove</button>
                </label>
              {/each}
            </div>
          </div>
        </div>
      </div>
      <div class="datepicker">
        <Datepicker bind:formattedSelected class="calendar" />
      </div>
    </div>
  </div>
</body>
