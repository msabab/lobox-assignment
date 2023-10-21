import React, { useCallback, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { useCheckAfterFrame } from "./hooks/useCheckAfterFrame";
import ChevronDown from "./assets/ChevronDown";
import Check from "./assets/Check";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    width: "320px",
  },
  selectButton: {
    position: "relative",
    width: "100%",
    padding: "8px 8px",
    background: "white",
    textAlign: "left",
    borderRadius: "10px",
    border: "2px solid #0003",
    "&:hover": {
      borderColor: "#0005",
    },
    "&:focus, &:focus-within": {
      outline: "2px solid #1d4ed8",
    },
    "& .chevron-down": {
      position: "absolute",
      right: 8,
      color: "#0006",
      transition: "150ms",
    },
    "& .inverted": {
      transform: "scaleY(-1)",
    },
  },

  listBox: {
    position: "absolute",
    left: 0,
    right: 0,
    margin: "4px 0px 0px 0px",
    padding: "4px 4px",
    background: "white",
    color: "#0007",
    maxHeight: "200px",
    border: "2px solid #0003",
    borderRadius: "10px",
    overflowX: "hidden",
    overflowY: "auto",
    scrollBehavior: "smooth",
    listStyle: "none",
    fontWeight: "500",
    textAlign: "left",
  },
  selectableOption: {
    margin: "4px",
    padding: "6px 10px",
    borderRadius: "6px",
    "&[aria-selected='true']": {
      color: "#1d4ed8aa",
      background: "#1d4ed822",
    },
    "&:hover": {
      background: "#1d4ed811",
    },
    "&:focus": {
      background: "#1d4ed815",
    },
    "&:active": {
      background: "#1d4ed815",
    },
    "& .check": {
      position: "absolute",
      right: 16,
    },
  },
});

export interface SelectDropdownProps {
  name?: string;
  optionsList: string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
// Component that renders a Select with a dropdown menu
// Adheres to WAI-ARIA standards of combo-box with listbox dropdown
const SelectDropdown = ({ name, optionsList }: SelectDropdownProps) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const jssClasses = useStyles();

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const handleSelectKeyDown = useCallback<
    React.KeyboardEventHandler<HTMLDivElement>
  >(
    (e) => {
      switch (e.key) {
        case "ArrowUp":
          setHighlightedIndex(Math.max(highlightedIndex - 1, 0));
          break;
        case "ArrowDown":
          if (isOptionsOpen) {
            setHighlightedIndex(
              Math.min(highlightedIndex + 1, optionsList.length - 1)
            );
          } else {
            setIsOptionsOpen(true);
          }
          break;
        case "Escape":
          setHighlightedIndex(selectedIndex);
          setIsOptionsOpen(false);
          break;
        case "Enter":
          e.preventDefault();
          setSelectedIndex(highlightedIndex);
          setIsOptionsOpen(false);
          break;
        default:
          break;
      }
    },
    [highlightedIndex, selectedIndex, optionsList, isOptionsOpen]
  );

  const onContainerFocusOutside = useCheckAfterFrame(() => {
    // this condition checks and closes the menu only if the focused element is not inside select menu, contains is a dom method
    if (!containerRef.current?.contains(document.activeElement)) {
      setIsOptionsOpen(false);
    }
  });

  useEffect(() => {
    //scrolling to highlighted element by getting element from dom
    if (isOptionsOpen) {
      const element = document.getElementById(optionsList[highlightedIndex]);
      if (element) {
        element.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      }
    }
  }, [isOptionsOpen, highlightedIndex]);

  return (
    <div
      className={jssClasses.container}
      ref={containerRef}
      onKeyDown={handleSelectKeyDown}
      onBlur={onContainerFocusOutside}
    >
      <button
        type="button"
        role="combobox"
        aria-controls="listoptions"
        aria-expanded={isOptionsOpen}
        aria-haspopup="listbox"
        aria-label={name}
        aria-activedescendant={optionsList[selectedIndex]}
        tabIndex={0}
        onClick={() => setIsOptionsOpen((isOpen) => !isOpen)}
        className={jssClasses.selectButton}
      >
        {optionsList[selectedIndex]}
        <ChevronDown
          className={`chevron-down ${isOptionsOpen ? "inverted" : ""}`}
        />
      </button>
      <ul
        className={jssClasses.listBox}
        style={{
          display: isOptionsOpen ? "block" : "none",
        }}
        role="listbox"
        id="listoptions"
        aria-label={name}
        tabIndex={-1}
        ref={listRef}
      >
        {optionsList.map((option, index) => (
          <li
            key={option}
            id={option}
            role="option"
            aria-selected={selectedIndex == index}
            tabIndex={-1}
            className={`${jssClasses.selectableOption}`}
            style={{
              outline: highlightedIndex == index ? "2px solid #0004" : "",
            }}
            onClick={() => {
              setSelectedIndex(index);
              setHighlightedIndex(index);
              setIsOptionsOpen(false);
            }}
          >
            {option}
            {selectedIndex == index && <Check className="check" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectDropdown;
