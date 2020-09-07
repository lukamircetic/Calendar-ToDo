<script>
  import { onMount } from 'svelte'
  import Home from './Home.svelte'
  import Login from './Login.svelte'
  import Error from './Error.svelte'

  let loggedIn = false
  let errorMessage
  let errorShow

  // onMount(async() => {
  //   const res = await fetch(
  //     "/checkLogin"
  //   );
  //   const response = await res.json();
  //   if (response.logged_in){
  //     loggedIn = true;
  //   }
  //   else{
  //     loggedIn = false;
  //   }
  // })
  // async function logoutUser() {
  //   loggedIn = false;
  //   const res = await fetch(`/logout`);
  //   const response = await res.json();
  // }
  function displayError(event) {
    errorMessage = event.detail
    errorShow = true
  }
</script>

<head>
  <title>📅 Calendar To-Do</title>
</head>
{#if loggedIn == false}
  <Login
    on:login-user={event => (loggedIn = event.detail.success)}
    on:display-error={displayError}
    on:login-guest={event => (loggedIn = event.detail.success)} />
{:else}
  <Home />
{/if}
<div />

<Error
  show={errorShow}
  message={errorMessage}
  on:close-error={() => (errorShow = false)} />
