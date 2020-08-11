<script>
import Login from './Login.svelte';
import { fetchPost } from './helpers.js'
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

export let loggedIn;
loggedIn = true;

let login = true;
let email = "";
let password = "";
let confirmPass = "";

function handleGuest(){
    dispatch('login-guest', {success:true});
  }

async function loginUser() {
    const response = await fetchPost(
        "/login", {email: email, password: password}
    );
    if (!response.success) {
        dispatch("display-error", response.message);
        return false;
    }
    dispatch("login-user", response);
}

  async function signUpUser() {
    if (password !== confirmPass) {
      dispatch("display-error", "Passwords do not match");
      return false;
    }
    const response = await fetchPost(
      "/signup", {email: email, password: password}
    );
    if (!response.success) {
      dispatch("display-error", response.message);
      return false;
    }
    errorShow = false;
    dispatch("login-user", response);
  }

function handleLogin() {
    if (login == true){
    login = false;
    }
    else login = true;
}

function handleSuccess(){
    if (loggedIn == false){
        loggedIn = true;
    }
}
</script>



<body>
    <main>
        <h1>To-Do Calendar</h1>
    </main>
    <form>
        
		<h2>Username</h2>
        <input
            class='longer'
            type='email'
            placeholder='Enter your email'
            on:input={event => email = event.target.value}
            value={email}
        />
        <h2>Password</h2>
        <input
            class='longer'
            type='password'
            placeholder='Enter your password'
            on:input={event => password = event.target.value}
            value={password}
        />
        {#if !login}
        <h2>Confirm Password</h2>
        <input
            class='longer'
            type='password'
            placeholder='Confirm your password'
            on:input={event => confirmPass = event.target.value}
            value={confirmPass}
        />
        {/if}
	</form>
    {#if login}
    <button 
    type="submit"
    on:click={loginUser}>
		Sign in
	</button>
    <button on:click={handleLogin}>
        Don't have an account yet?
    </button>
    {:else}
    <button 
    type="submit"
    on:click={signUpUser}
    >
		Create account
	</button>
    <button on:click={handleLogin}>
        Already have an account? Sign in
    </button>
    {/if}
    <button on:click={handleGuest}>Use as Guest</button>
</body>



