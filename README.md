A simple react component which allows to get user input in a predefined format.
For example: as a fill in the blank

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
      
