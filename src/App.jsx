import { useReducer } from "react"
import DigitButton from './components/DigitButton'
import OperationButton from "./components/OperationButton"
import "./styles.css"

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      //after answer has been outputting it writes over the current Operand to start the next calculation
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      //if you accidently click the wrong operation it lets you change it 
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    //clears
    case ACTIONS.CLEAR:
      return {}
    //deleted the last pressed item
    case ACTIONS.DELETE_DIGIT:
      // if in the return clear, and deleted current operant 
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      //checks to see if there is a current operand
      if (state.currentOperand == null) return state
      //returns if there is only one thing pressed & resets it to 0 instead of empty string
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      //removes the last digit from current operand
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
      //
    case ACTIONS.EVALUATE:
      if (
        //make sure we got all the values we need
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        //do nothing when somethings missing example: 2+ __ : it wont do nothing
        return state
      }

      //
      return {
        ...state,
        //stops from adding random digits after the answer has been output 
        overwrite: true,
        // puts the answer where the current operand is 
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  //takes previous and parse it to a single digit
  const prev = parseFloat(previousOperand)
  //takes current and parse it to a single digit
  const current = parseFloat(currentOperand)
  //if its not a number for either prev or current then return a blank string bc its incomplete
  if (isNaN(prev) || isNaN(current)) return ""
  //starts at an empty string
  let computation = ""
  //logic for operands when pressed
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  //returns the operations in strings 
  return computation.toString()
}

//adds commas to whole integers  and make sure there is no fractions
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

//split it on the decimal (only using formating stuff before the decimal)
function formatOperand(operand) {
  //no operant pressed
  if (operand == null) return
  //taking operand and splitting it on decimal
  const [integer, decimal] = operand.split(".")
  //if no decimal is pressed it acts like a normal integer
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  //if not returning the integer and the deical format
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
        {/* Formats the formattted number inputted to JSX */}
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  )
}

export default App