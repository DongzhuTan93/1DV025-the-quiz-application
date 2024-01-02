/**
 * The quiz question web component module.
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
    margin: 80px auto;
    background-color: lightseagreen;
    padding: 30px;
    overflow: hidden;
  
  }
   #radio {
    text-overflow: ellipsis;
    word-break: break-all;
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

  #radio {
    height: 30px;
    border-radius: 24px;
    width: 500px;
    text-align: center;
    margin-bottom: 20px;
  }

  .box {
    display: flex;
    align-items: center;
    flex-direction: column;

  }

  #text {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    margin-bottom: 20px;
    color:yellow;
  }
</style>

<div class="box">
    <div id="text"></div>
    <div id="radio"></div>
    <input type="answer" id="enter" autofocus></input>
    <div id="timer"></div>
    <div id="timer-container"></div>
  <button id="button" class="Submit-btn">Submit</button>
</div>
`
customElements.define('quiz-question',

  /**
   * Represents a quiz-question element.
   */
  class extends HTMLElement {
    /**
     * ...
     *
     * @type {*}
     */
     #quizAnswer

    /**
     * ...
     *
     * @type {*}
     */
    #submitButton

    /**
     * ...
     *
     * @type {*}
     */
     #nextQuestionUrl = 'https://courselab.lnu.se/quiz/question/1'

     /**
      * ...
      *
      * @type {*}
      */
     #nextAnswerUrl

     /**
      * ...
      *
      * @type {*}
      */
     #question

     /**
      * ...
      *
      * @type {*}
      */
     #radio

     /**
      * ...
      *
      * @type {*}
      */
     #response

     /**
      * ...
      *
      * @type {*}
      */
     timer

     /**
      * ...
      *
      * @type {*}
      */
     timeLeft = 20

     /**
      * ...
      *
      * @type {*}
      */
     totalTime = 0

     /**
      * Creates an instance of the current type.
      */
     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

       this.#quizAnswer = this.shadowRoot.querySelector('input')
       this.#submitButton = this.shadowRoot.querySelector('#button')
       this.#question = this.shadowRoot.querySelector('#text')
       this.#radio = this.shadowRoot.querySelector('#radio')
       this.timer = this.shadowRoot.querySelector('#timer')
       this.timerContainer = this.shadowRoot.querySelector('#timer-container')
       this.enter = this.shadowRoot.querySelector('#enter')
     }

     /**
      * Called after the element is inserted into the DOM.
      */
     connectedCallback () {
       this.#getQuestion()
       this.#countTotalTime()

       this.enter.addEventListener('keyup', (event) => {
         event.preventDefault()
         if (event.keyCode === 13) {
           this.#submitButton.click()
         }
       })

       this.#submitButton.addEventListener('click', () => {
         this.#submitQuestion()
       })
     }

     /**
      * Called after the element has been removed from the DOM.
      */
     disconnectedCallback () {
       this.#submitButton.removeEventListener('click', () => {
         this.#submitQuestion()
       })
     }

     /**
      * Fetch the questions from the server.
      */
     async #getQuestion () {
       this.#response = await window.fetch(this.#nextQuestionUrl)
       this.#response = await this.#response.json()

       this.#startTimer()

       this.#nextAnswerUrl = this.#response.nextURL
       this.#question.textContent = this.#response.question

       if (this.#response.alternatives) {
         this.#radio.style.display = 'block'
         this.#quizAnswer.style.display = 'none'

         const frag = document.createDocumentFragment()
         const alternatives = this.#response.alternatives

         for (const key in alternatives) {
           const value = alternatives[key]
           const li = document.createElement('input')

           li.setAttribute('type', 'radio')
           li.setAttribute('name', 'answer')
           li.setAttribute('value', value)
           li.setAttribute('id', key)

           const la = document.createElement('label')
           la.setAttribute('for', value)
           la.textContent = value

           frag.appendChild(li)
           frag.appendChild(la)
         }
         this.#radio.appendChild(frag)
       } else {
         this.#quizAnswer.style.display = 'block'
         this.#radio.style.display = 'none'
       }
       // I got inspiration here: https://gitlab.lnu.se/1dv025/student/dt222ha/exercises/exercise-tiny-tunes/-/blob/solution/src/js/index.js
     }

     /**
      * Post the answers to the server.
      *
      * @type {*}
      */
     async #submitQuestion () {
       if (this.#response.alternatives) {
         const radioInput = this.shadowRoot.querySelectorAll('input[type=radio]')
         const radiosAnswer = Array.from(radioInput)
         const checkRadio = radiosAnswer.filter((radio) => {
           return radio.checked
         })

         this.#response = await window.fetch(this.#nextAnswerUrl, {
           method: 'post',
           headers: {
             'content-type': 'application/json'
           },
           body: JSON.stringify({ answer: checkRadio[0].id })
         })
       } else {
         this.#response = await window.fetch(this.#nextAnswerUrl, {
           method: 'post',
           headers: {
             'content-type': 'application/json'
           },
           body: JSON.stringify({ answer: this.#quizAnswer.value })
         })
       }

       const status = this.#response.status
       this.#response = await this.#response.json()

       this.#nextQuestionUrl = this.#response.nextURL

       if (this.#response.nextURL) {
         this.#quizAnswer.value = ''
         while (this.#radio.firstChild) {
           this.#radio.removeChild(this.#radio.firstChild)
         }
         this.#getQuestion()
       } else {
         clearInterval(this.setTotalTime)
         if (status === 200) {
           this.#quizAnswer.style.display = 'none'
           this.#submitButton.style.display = 'none'
           this.#radio.style.display = 'none'
           this.timer.style.display = 'none'
           this.#question.textContent = 'Congratulations! You got all the questions right!'

           setTimeout(function () {
             this.dispatchEvent(new window.CustomEvent('game-over', { bubbles: true, detail: { totalTime: this.totalTime, won: true } }))
           }.bind(this), 1000)
         } else {
           this.#quizAnswer.style.display = 'none'
           this.#submitButton.style.display = 'none'
           this.#radio.style.display = 'none'
           this.timer.style.display = 'none'
           this.#question.textContent = 'Wrong answer! You lost!'

           setTimeout(function () {
             this.dispatchEvent(new window.CustomEvent('game-over', { bubbles: true, detail: { totalTime: this.totalTime, won: false } }))
           }.bind(this), 1000)
         }
       }
     }

     /**
      * A countdown timer with seconds.
      *
      * @type {*}
      */
     async #startTimer () {
       this.timer.textContent = `You have ${this.timeLeft} seconds left!`
       if (this.countdownTimer) {
         clearInterval(this.countdownTimer)
         if (this.#response.limit) {
           this.timeLeft = this.#response.limit
         } else {
           this.timeLeft = 20
         }
         this.timer.textContent = `You have ${this.timeLeft} seconds left!`
       }
       this.countdownTimer = setInterval(function () {
         if (this.timeLeft <= 0) {
           clearInterval(this.countdownTimer)

           this.#quizAnswer.style.display = 'none'
           this.#question.style.display = 'none'
           this.#submitButton.style.display = 'none'
           this.#radio.style.display = 'none'
           this.timer.textContent = 'Times up! '

           setTimeout(() => {
             this.dispatchEvent(new window.CustomEvent('game-over', { bubbles: true, detail: { time: this.totalTime, won: false } }))
           }, 1000)
         } else {
           this.timeLeft--
           this.timer.textContent = `You have ${this.timeLeft} seconds left!`
         }
       }.bind(this), 1000)

       // I got inspiration here: https://www.codegrepper.com/code-examples/javascript/javascript+timer+countdown+with+seconds
     }

     /**
      * A timer to calculate the total time of the quiz game.
      *
      * @type {*}
      */
     #countTotalTime () {
       this.setTotalTime = setInterval(function () {
         this.totalTime++
       }.bind(this), 1000)
     }
  }
)
