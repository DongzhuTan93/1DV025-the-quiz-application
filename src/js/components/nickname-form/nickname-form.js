/**
 * The nicknames web component module.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .container {
      position: relative;
      width: auto;
      margin: 100px auto;
      background-color: lightseagreen;
      padding: 10px;
      overflow: hidden;
    
    }

    h2 {
      color: yellow;
    }

    .box {
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    #enter {
      height: 25px;
      background: #fff;
      border: 1px solid transparent;
      box-shadow: 0 2px 5px 1px rgb(64 60 67 / 16%);
      border-radius: 24px;
      width: 200px;
      text-align: center;
      margin-bottom: 20px;
    }


  </style>

  <div class="box">
      <h2>Please write down your nickname here:</h2>
      <input type="name" id="enter" placeholder="A nickname" autofocus />
      <button id="button" >Start</button>

      </div>
    </div>
  </div>
`
customElements.define('nickname-form',

  /**
   * Represents a nickname-form element.
   */
  class extends HTMLElement {
     /**
      * The users input nickname.
      */
     #inputName

     /**
      * The button under the input box.
      */
     #startButton

     /**
      * The button under the input box.
      */
     #enterButton

     /**
      * Creates an instance of the current type.
      */
     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

       // Get the bulletin board element in the shadow root.
       this.#inputName = this.shadowRoot.querySelector('input')
       this.#startButton = this.shadowRoot.querySelector('#button')
       this.#enterButton = this.shadowRoot.querySelector('#enter')
     }

     /**
      * Called after the element is inserted into the DOM.
      */
     connectedCallback () {
       this.#enterButton.addEventListener('keyup', (event) => {
         event.preventDefault()
         if (event.keyCode === 13) {
           this.#startButton.click()
         }
       })
       // I got inspiration here: https://www.youtube.com/watch?v=WRnVR3hi4Xc

       this.#startButton.addEventListener('click', (event) => {
         this.#submitName(event)
       })
     }

     /**
      * Called after the element has been removed from the DOM.
      */
     disconnectedCallback () {
       this.#startButton.removeEventListener('click', () => {
         this.#submitName()
       })
     }

     /**
      * Handles input nickname.
      *
      *@type {*}
      */
     async #submitName () {
       this.dispatchEvent(new window.CustomEvent('enter-nickname', { bubbles: true, detail: this.#inputName.value }))
     }
  }
)
