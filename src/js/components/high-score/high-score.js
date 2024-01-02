/**
 * The quiz application web component module.
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
    width: 600px;
    max-width:500px;
    margin: 100px auto;
    background-color: lightseagreen;
    padding: 30px;
    overflow: hidden;   
  }

  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    color: chocolate;
  }

  h2 {
    color: yellow;
  }

  #button {
    margin-top: 20px;
  }
  </style>

  <div class="box">
      <h1>High score</h1>
      <h2>The top five with the highest scores are:</h2>
      <ol id="showscore"></ol>
      <button id="button" >Play again!</button>
  </div>
`

customElements.define('high-score',

  /**
   * Represents a quiz-application element.
   */
  class extends HTMLElement {
     /**
      * ...
      *
      * @type {*}
      */
     #playAgain

     /**
      * ...
      *
      * @type {*}
      */
     #showScore

     /**
      * Creates an instance of the current type.
      */
     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

       this.#playAgain = this.shadowRoot.querySelector('#button')
       this.#showScore = this.shadowRoot.querySelector('#showscore')
     }

     /**
      * Called after the element is inserted into the DOM.
      */
     connectedCallback () {
       const highScore = JSON.parse(localStorage.getItem('highscore'))

       const frag = document.createDocumentFragment()

       for (const key in highScore) {
         const li = document.createElement('li')

         li.textContent = `Player: ${highScore[key].name} (${highScore[key].time} seconds)`
         frag.appendChild(li)
       }
       this.#showScore.appendChild(frag)

       this.#playAgain.addEventListener('click', () => {
         this.#submitPlayAgain()
       })
     }

     /**
      * Handles play again data.
      *
      *@type {*}
      */
     async #submitPlayAgain () {
       this.dispatchEvent(new window.CustomEvent('play-again', { bubbles: true }))
     }
  }
)
