<script>
  import Home from './Home.svelte'
  import Login from './Login.svelte'
  import Error from './Error.svelte'

  let loggedIn = false
  let errorMessage
  let errorShow

  function displayError(event) {
    errorMessage = event.detail
    errorShow = true
  }
</script>

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
