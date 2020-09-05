<script>
  import Login from './Login.svelte'
  import { fetchPost } from './helpers.js'
  import { createEventDispatcher } from 'svelte'
  import { current_user_id, user_token, user_name } from './states'
  const dispatch = createEventDispatcher()

  export let loggedIn
  loggedIn = true

  // hacky way to handle these guys state but its just sample todos
  let todo1 = true
  let todoclassone = 'list-item-checked'
  let todo2 = false
  let todoclasstwo = 'list-item'
  let todo3 = false
  let todoclassthree = 'list-item'

  let login = true
  let email = ''
  let password = ''
  let confirmPass = ''
  let title = 'Sign in'
  function handleGuest() {
    dispatch('login-guest', { success: true })
  }

  async function loginUser() {
    const response = await fetchPost('/signin', {
      email: email,
      password: password
    })
    console.log('response', response)
    if (!response.success) {
      dispatch('display-error', response.message)
      return false
    }
    current_user_id.set(response.id)
    user_token.set(response.token)
    user_name.set(email.split('@')[0])
    // console.log($current_user_id, $user_token)
    dispatch('login-user', { success: response.success })
  }

  async function signUpUser() {
    if (password !== confirmPass) {
      dispatch('display-error', 'Passwords do not match')
      return false
    }
    const response = await fetchPost('/signup', {
      email: email,
      password: password
    })
    if (!response.success) {
      dispatch('display-error', response.message)
      return false
    }
    current_user_id.set(response.id)
    console.log('res token', response.token)
    user_token.set(response.token)
    dispatch('login-user', { success: response.success })
  }

  function handleLogin() {
    email = ''
    password = ''
    confirmPass = ''
    if (login == true) {
      title = 'Create Account'
      login = false
    } else {
      title = 'Sign in'
      login = true
    }
  }

  function handleSuccess() {
    if (loggedIn == false) {
      loggedIn = true
    }
  }

  const changeCol = num => {
    switch (num) {
      case 0:
        if (!todo1) {
          todo1 = true
          todoclassone = 'list-item-checked'
        } else {
          todo1 = false
          todoclassone = 'list-item'
        }
        break
      case 1:
        if (!todo2) {
          todo2 = true
          todoclasstwo = 'list-item-checked'
        } else {
          todo2 = false
          todoclasstwo = 'list-item'
        }
        break
      case 2:
        if (!todo3) {
          todo3 = true
          todoclassthree = 'list-item-checked'
        } else {
          todo3 = false
          todoclassthree = 'list-item'
        }
        break
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
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
    top: 0;
    left: 0;
  }

  .page-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 580px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 70%;
  }

  .center-box {
    width: 100%;
    text-align: center;
    padding: 0;
    margin: 0;
    font-weight: inherit;
    font-family: inherit;
    font-style: inherit;
    font-size: 100%;
  }

  .flex-center {
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
    outline: 0;
    justify-content: flex-start;
    align-items: center;
  }

  .main-box {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
  }
  .login-title {
    font-size: 28px;
    color: #fff;
    font-weight: 600;
    line-height: 32px;
    margin-bottom: 8px;
  }

  .secondary-title {
    color: #fff;
    font-size: 15px;
    line-height: 20px;
  }

  .form-box {
    width: 100%;
    text-align: left;
    margin-top: 20px;
  }

  .login-box {
    width: 100%;
    text-align: left;
  }
  .email-box {
    margin-bottom: 20px;
  }

  .email-title {
    color: #fff;
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 0;
  }

  .input-box {
    display: flex;
    flex-direction: column;
  }

  .email-input {
    padding: 10px;
    height: 40px;
    font-size: 16px;
    box-sizing: border-box;
    width: 100%;
    border-radius: 3px;
    color: #fff;
    background-color: var(--bggg-col);
    border: 1px solid #1c1b1f;
    transition: border-color 0.2s ease-in-out;
  }

  .email-input:focus {
    border-color: var(--tri-col);
  }

  .email-input::placeholder {
    color: var(--low-col);
  }

  .register {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-start;
  }
  .login-button {
    color: var(--bg-col);
    background-color: var(--tri-col);
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
    width: 100%;
    height: 44px;
    min-width: 130px;
    min-height: 44px;
    border: none;
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }

  .login-button:hover {
    background-color: var(--tri-hover);
    cursor: pointer;
  }

  .login-title {
    margin: 0, auto;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary-button {
    color: var(--tri-col);
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 0;
    vertical-align: bottom;
    padding: 0;
    width: auto;
    height: auto;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 500;
    user-select: none;
    cursor: pointer;
  }

  .secondary-button:hover {
    text-decoration: underline;
  }
  .secondary-button:focus {
    background: none;
  }

  /* When demo is working use this */
  /* .secondary-button-demo {
    color: #7b88a3;
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 0;
    vertical-align: bottom;
    padding: 0;
    width: auto;
    height: auto;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 500;
    user-select: none;
    cursor: pointer;
  }

  .secondary-button-demo:hover {
    text-decoration: underline;
  } */

  @media (min-width: 1000px) {
    .main-title {
      font-family: 'Montserrat', sans-serif;
      color: var(--tri-col);
      font-size: 115px;
      font-weight: 1000;
      margin-bottom: 75px;
    }
    .list-box {
      display: flex;
      flex-direction: column;
    }
    .bottom-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .title-box {
    width: 480px;
    padding: 32px;
    background-color: var(--bgg-col);
    border-radius: 5px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    /* text-transform: uppercase */
  }
  }

  @media (max-width: 1000px) {
    .main-title {
      font-family: 'Montserrat', sans-serif;
      color: var(--tri-col);
      font-size: 85px;
      font-weight: 1000;
      margin-bottom: 75px;
    }

    .list-box {
      display: none;
    }

    .bottom-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .title-box {
    width: 480px;
    padding: 32px;
    background-color: var(--bgg-col);
    border-radius: 5px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    /* text-transform: uppercase */
  }
  }

  @media (max-width: 700px) {
    .main-title {
      font-family: 'Montserrat', sans-serif;
      color: var(--tri-col);
      font-size: 85px;
      font-weight: 1000;
      margin-bottom: 75px;
      text-align: center;
    }

    .list-box {
      display: none;
    }

    .bottom-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .title-box {
    width: 480px;
    padding: 32px;
    background-color: var(--bgg-col);
    border-radius: 5px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    /* text-transform: uppercase */
  }
  }

  @media (max-width: 500px) {
    .main-title {
      font-family: 'Montserrat', sans-serif;
      color: var(--tri-col);
      font-size: 85px;
      font-weight: 1000;
      margin-bottom: 75px;
      text-align: center;
    }

    .list-box {
      display: none;
    }

    .bottom-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .title-box {
    width: auto;
    padding: 32px;
    background-color: var(--bgg-col);
    border-radius: 5px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    /* text-transform: uppercase */
  }
  }
  .list-item {
    margin: 10px 0;
    width: 300px;
    height: 20px;
    color: white;
    /* text-transform: uppercase; */
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    line-height: 20px;
    font-weight: 300;
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
  .list-item-checked {
    margin: 10px 0;
    width: 300px;
    height: 20px;
    color: var(--bggg-col);
    /* text-transform: uppercase; */
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    line-height: 20px;
    font-weight: 300;
    background-color: var(--tri-col);
    border-radius: 3px;
    border: 1px solid var(--bgg-col);
    display: block;
    position: relative;
    cursor: pointer;
    padding-left: 50px;
    padding-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .list-item input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  .list-item-checked input {
    display: none;
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

  .list-item-checked input ~ .checkmark:after {
    display: block;
  }

  .list-item-checked .checkmark:after {
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
  .list-item:hover input ~ .checkmark {
    background-color: var(--bg-hover);
  }

  .box {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
    rel="stylesheet" />
</svelte:head>
<body>
  <div class="page-wrapper">
    <div class="title-wrapper">
      <div class="main-title">Calendar To-Do</div>
      <div class="bottom-wrapper">
        <div class="title-box">
          <div class="center-box">
            <div class="flex-center">
              <div class="main-box">
                <div class="login-title">{title}</div>
                <!-- <div class="secondary-title">Sign in to view your to-do's!</div> -->
                <form class="form-box">
                  <div class="email-box">
                    <h5 class="email-title">Email</h5>
                    <div class="input-box">
                      <input
                        id="username"
                        class="email-input"
                        type="email"
                        placeholder="Enter your email"
                        on:input={event => (email = event.target.value)}
                        value={email} />
                    </div>
                  </div>
                  <div class="email-box">
                    <h5 class="email-title">Password</h5>
                    <div class="input-box">
                      <input
                        id="password"
                        class="email-input"
                        type="password"
                        placeholder="Enter your password"
                        on:input={event => (password = event.target.value)}
                        value={password} />
                    </div>
                  </div>
                  {#if !login}
                    <div class="email-box">
                      <h5 class="email-title">Confirm Password</h5>
                      <div class="input-box">
                        <input
                          id="confirm"
                          class="email-input"
                          type="password"
                          placeholder="Confirm your password"
                          on:input={event => (confirmPass = event.target.value)}
                          value={confirmPass} />
                      </div>
                    </div>
                  {/if}
                </form>
                <div class="login-box">
                  {#if login}
                    <div>
                      <button
                        type="submit"
                        class="login-button"
                        on:click={loginUser}>
                        <div class="button-title">Log in</div>
                      </button>
                    </div>
                    <div class="register">
                      <span class="secondary-title">
                        Don't have an account?
                      </span>
                      <button class="secondary-button" on:click={handleLogin}>
                        <div class="button-title">Sign Up</div>
                      </button>
                      <!-- Need to add a demo route later on so people can test it out -->
                      <!-- <button class="secondary-button-demo" on:click={handleLogin}>
                  <div </div>class="button-title">Demo</div>
                </button> -->
                    </div>
                  {:else}
                    <button
                      type="submit"
                      class="login-button"
                      on:click={signUpUser}>
                      <div class="button-title">Create account</div>
                    </button>
                    <div class="register">
                      <span class="secondary-title">
                        Already have an account?
                      </span>
                      <button class="secondary-button" on:click={handleLogin}>
                        <div class="button-title">Sign In</div>
                      </button>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
            <!-- </div> -->

          </div>
        </div>
        <div class="list-box">
          <label id="todo-1" class={todoclassone}>
            Pick a Date
            <input type="checkbox" on:change={() => changeCol(0)} />
            <span class="checkmark" />
          </label>
          <label
            id="todo-2"
            class={todoclasstwo}
            on:change={() => changeCol(1)}>
            Make a List
            <input type="checkbox" />
            <span class="checkmark" />
          </label>
          <label
            id="todo-3"
            class={todoclassthree}
            on:change={() => changeCol(2)}>
            Finish Tasks
            <input type="checkbox" />
            <span class="checkmark" />
          </label>
        </div>
      </div>
    </div>
  </div>
</body>
