/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect, useRef } from "react";
import "./styles.css";

// keyCode constants
const BACKSPACE = 8;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const DELETE = 46;

const SingleInput = ({
  val,
  isActive,
  isAllowedToChange,
  onFocus,
  onInput,
  onKeyDown
}) => {
  const input = useRef(null);
  useEffect(() => {
    if (isActive) {
      input.current.focus();
    }
  }, [isActive]);
  return (
    <input
      css={{
        border: "none",
        margin: "1px",
        padding: "auto",
        textAlign: "center",
        borderBottom: "1px solid black",
        appearance: "none",
        ":focus": {
          outline: "none"
        },
        ":disabled": {
          background: "none",
          color: "black"
        }
      }}
      ref={input}
      type="text"
      disabled={!isAllowedToChange}
      autoFocus={isActive}
      size={1}
      value={val}
      minLength={1}
      maxLength={1}
      onFocus={onFocus}
      onInput={onInput}
      onKeyDown={onKeyDown}
      // to supress react warning
      onChange={() => {}}
    />
  );
};

export const PredefinedInputBox = ({
  inputMarkup,
  characterAllowedToChange,
  characterNotToShow,
  style,
  giveParentTheInputVal
}) => {
  const indexOfFirstAllowedToChangeCharacter = inputMarkup.indexOf(
    characterAllowedToChange
  );
  const [activeInput, setActiveInput] = useState(
    indexOfFirstAllowedToChangeCharacter
  );
  const [inputVal, setInputVal] = useState(inputMarkup.split(""));

  // update the parent after every inputValue change
  useEffect(() => {
    giveParentTheInputVal(inputVal.join(""));
  }, [inputVal, giveParentTheInputVal]);

  const focusNext = () => {
    let localActiveInput = activeInput;
    while (true) {
      if (inputMarkup[localActiveInput + 1] === characterAllowedToChange) {
        setActiveInput(localActiveInput + 1);
        return;
      }

      // increment step
      if (localActiveInput === inputVal.length - 1) {
        localActiveInput = -1;
      } else {
        localActiveInput++;
      }
    }
  };
  const focusPrev = () => {
    let localActiveInput = activeInput - 1;
    while (true) {
      if (inputMarkup[localActiveInput] === characterAllowedToChange) {
        setActiveInput(localActiveInput);
        return;
      }
      if (localActiveInput === 0) {
        localActiveInput = inputVal.length;
      } else {
        localActiveInput--;
      }
    }
  };
  const changeValueAtIndex = (value, index) => {
    let copyInputVal = inputVal;
    copyInputVal[index] = value;
    setInputVal(copyInputVal);
    giveParentTheInputVal(copyInputVal.join(""));
  };
  const handleOnInput = (e, index) => {
    e.preventDefault();
    changeValueAtIndex(e.target.value, index);
    focusNext();
  };

  // Handle cases of backspace, delete, left arrow, right arrow
  const handleOnKeyDown = (e, index) => {
    if (e.keyCode === BACKSPACE || e.key === "Backspace") {
      e.preventDefault();
      // if there is some value at the current index
      // delete it and focus on prev
      // otherwise delete prev and focus
      changeValueAtIndex(characterAllowedToChange, index);
      focusPrev();
    } else if (e.keyCode === DELETE || e.key === "Delete") {
      e.preventDefault();
      changeValueAtIndex(characterAllowedToChange, index);
      focusPrev();
    } else if (e.keyCode === LEFT_ARROW || e.key === "ArrowLeft") {
      e.preventDefault();
      focusPrev();
    } else if (e.keyCode === RIGHT_ARROW || e.key === "ArrowRight") {
      e.preventDefault();
      focusNext();
    }
  };

  return (
    <div css={style}>
      {inputVal.map((character, index) => {
        const isActive = activeInput === index;
        const isAllowedToChange =
          inputMarkup[index] === characterAllowedToChange;
        const isAllowedToShow = inputMarkup[index] !== characterNotToShow;
        return isAllowedToShow ? (
          <SingleInput
            key={index}
            val={character === characterAllowedToChange ? "" : character}
            isActive={isActive}
            isAllowedToChange={isAllowedToChange}
            onFocus={e => {
              setActiveInput(index);
              e.target.select();
            }}
            onInput={e => {
              handleOnInput(e, index);
            }}
            onKeyDown={e => {
              handleOnKeyDown(e, index);
            }}
          />
        ) : (
          <span key={index}> &nbsp; </span>
        );
      })}
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <PredefinedInputBox
        inputMarkup="__hello___"
        characterAllowedToChange="_"
        characterNotToShow=" "
        style={{
          border: "1px solid black",
          borderRadius: "13px",
          textAlign: "center",
          padding: "10px"
        }}
        giveParentTheInputVal={() => null}
      />
    </div>
  );
}
