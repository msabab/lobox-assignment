import React, { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
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

const SelectDropdown = ({ name, optionsList }: SelectDropdownProps) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const jssClasses = useStyles();

  const handleSelectKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    switch (e.key) {
      case "ArrowUp":
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
        break;
      case "ArrowDown":
        if (isOptionsOpen) {
          setSelectedIndex(Math.min(selectedIndex + 1, optionsList.length - 1));
        } else {
          setIsOptionsOpen(true);
        }
        break;
      case "Escape":
        setIsOptionsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleListItemKeyDown: (
    index: number
  ) => React.KeyboardEventHandler<HTMLLIElement> = (index: number) => (e) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        setSelectedIndex(index);
        setIsOptionsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={jssClasses.container}
      ref={containerRef}
      onKeyDown={handleSelectKeyDown}
      onBlur={() => {
        // BEST PRACTICE: add useFocusWithin hook from react-aria package
        requestAnimationFrame(() => {
          // this condition checks and closes the menu only if the focused element is not inside select menu
          if (!containerRef.current?.contains(document.activeElement)) {
            setIsOptionsOpen(false);
          }
        });
      }}
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
      >
        {optionsList.map((option, index) => (
          <li
            key={option}
            id={option}
            role="option"
            aria-selected={selectedIndex == index}
            tabIndex={0}
            className={`${jssClasses.selectableOption}`}
            onKeyDown={handleListItemKeyDown(index)}
            onClick={() => {
              setSelectedIndex(index);
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
