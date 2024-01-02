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
</style>

  <div class="box">
  <div class="container">
    <div class="quiz-application">
      <nickname-form></nickname-form>
  </div>
</div>
`

customElements.define('quiz-application',

  /**
   * Represents a quiz-application element.
   */
  class extends HTMLElement {
    /**
     * ...
     *
     * @type {*}
     */
    #quizApplication

    /**
     * The current player's nickname.
     *
     * @type {*}
     */
    #nickName

    /**
     * The current player's total time.
     *
     * @type {*}
     */
    #time

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#quizApplication = this.shadowRoot.querySelector('.quiz-application')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#quizApplication.addEventListener('enter-nickname', (event) => {
        this.#nickName = event.detail
        this.cleanComponent()
        this.#quizApplication.appendChild(document.createElement('quiz-question'))
      })
      this.#quizApplication.addEventListener('game-over', (event) => {
        if (event.detail.won === true) {
          this.#time = event.detail.totalTime
          this.resultStorage()
        }
        this.cleanComponent()
        this.#quizApplication.appendChild(document.createElement('high-score'))
      })
      this.#quizApplication.addEventListener('play-again', () => {
        this.cleanComponent()
        this.#quizApplication.appendChild(document.createElement('nickname-form'))
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.#quizApplication.removeEventListener('enter-nickname', () => {
      })
      this.#quizApplication.removeEventListener('game-over', () => {
      })
      this.#quizApplication.removeEventListener('play-again', () => {
      })
    }

    /**
     * Removed the old childs from quiz-application.
     *
     */
    cleanComponent () {
      while (this.#quizApplication.firstChild) {
        this.#quizApplication.removeChild(this.#quizApplication.firstChild)
      }
    }

    /**
     * Processing and storing data.
     *
     */
    resultStorage () {
      const highScore = JSON.parse(localStorage.getItem('highscore')) || []

      const score = {
        name: this.#nickName,
        time: this.#time
      }
      highScore.push(score)
      highScore.sort((a, b) => a.time - b.time)
      if (score.time > 1) {
        highScore.splice(5)
      }
      localStorage.setItem('highscore', JSON.stringify(highScore))

      // I got inspiration here: https://www.youtube.com/watch?v=jfOv18lCMmw
    }
  }
)
