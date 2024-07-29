/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
/* eslint-disable arrow-parens */
import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { concat, find, isString } from "lodash";
import { css, StyleSheet } from "aphrodite/no-important";
import {
  OutsideClickHandler,
  styles,
  FormError,
  Icon,
  Body,
} from "@sweeten/oreo";
import Loader from "./loader";

const { colors, zIndexes, center } = styles;

const OnEnter = (cb) => ({
  onKeyDown: (evt) => {
    if (evt.key === "Enter") {
      cb(evt);
    }
  },
  tabIndex: "0",
});

const border = `1px solid ${colors.grey20}`;

const borderStyle = {
  border,
  borderRadius: 8,
};

const focusStyle = {
  borderColor: colors.blueDark,
  outline: "none",
};

export const defaultStyle = {
  height: 48,
  boxSizing: "border-box",
  paddingLeft: 16,
  paddingRight: 16,
  ":active": focusStyle,
  ":focus": focusStyle,
  ...borderStyle,
};

export const disabledStyle = {
  backgroundColor: colors.grey10,
  ":hover": {
    cursor: "not-allowed",
  },
  ":active": {
    border,
  },
  ":focus": {
    border,
  },
};

export const errorStyle = {
  borderColor: colors.redError,
};

const BaseStyles = StyleSheet.create({
  defaultStyle,
  disabledStyle,
  errorStyle,
  focusStyle,
  flexWrapper: {
    ...center("vertical"),
    justifyContent: "space-between",
  },
});

const InputContainer = (props) => {
  const {
    aphStyle,
    hasFocus,
    hasError,
    children,
    disabled,
    ...passThroughProps
  } = props;
  const shouldHaveErrorStyle = hasError && BaseStyles.errorStyle;
  const shouldHaveFocusStyle = hasFocus && BaseStyles.focusStyle;
  const shouldBeDisabled = disabled && BaseStyles.disabledStyle;
  const combinedStyles = concat(
    BaseStyles.defaultStyle,
    BaseStyles.flexWrapper,
    shouldHaveErrorStyle,
    shouldHaveFocusStyle,
    shouldBeDisabled,
    aphStyle
  );

  return (
    <div className={css(combinedStyles)} {...passThroughProps}>
      {children}
    </div>
  );
};

const DisplayValueStyle = StyleSheet.create({
  overflowText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  placeholderActive: { color: colors.grey50 },
  placeholder: { color: colors.grey40 },
});

const DisplayValue = (props) => {
  const {
    isExpanded,
    items,
    placeholder,
    value,
    customDisplayValue,
    dataTest,
  } = props;
  const selectedItem = find(items, (item) => item.value === value);
  const label = selectedItem && selectedItem.label;
  const placeholderStyle = isExpanded
    ? DisplayValueStyle.placeholderActive
    : DisplayValueStyle.placeholder;

  if (customDisplayValue) {
    return (
      <Body
        aphStyle={DisplayValueStyle.overflowText}
        tag="span"
        dataTest={dataTest}
      >
        {customDisplayValue}
      </Body>
    );
  }

  if (label) {
    return (
      <Body
        aphStyle={DisplayValueStyle.overflowText}
        tag="span"
        dataTest={dataTest}
      >
        {label}
      </Body>
    );
  }
  return (
    <Body
      aphStyle={[placeholderStyle, DisplayValueStyle.overflowText]}
      tag="span"
      dataTest={dataTest}
    >
      {placeholder}
    </Body>
  );
};

const MenuStyle = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    left: 0,
    backgroundColor: colors.white,
    zIndex: zIndexes.dropdown,
    marginTop: 4,
    maxHeight: 216,
    boxSizing: "border-box",
    paddingTop: 16,
    paddingBottom: 16,
    overflowY: "auto",
    ...borderStyle,
  },
});

const Menu = ({ children, menuRef }) => (
  <div className={css(MenuStyle.container)} ref={menuRef}>
    {children}
  </div>
);

Menu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  menuRef: PropTypes.object,
};

const itemHighlightedStyle = {
  backgroundColor: colors.grey10,
  outline: "none",
};
const ItemStyle = StyleSheet.create({
  default: {
    ...center("vertical"),
    padding: 16,
    lineHeight: 1,
    minHeight: 46,
    cursor: "pointer",
    userSelect: "none",
    ":hover": itemHighlightedStyle,
    ":active": itemHighlightedStyle,
    ":focus": itemHighlightedStyle,
    boxSizing: "border-box",
  },
  disabled: {
    color: colors.grey40,
    ":hover": {
      backgroundColor: colors.white,
      cursor: "not-allowed",
    },
  },
  selected: {
    backgroundColor: colors.grey20,
  },
});

const matchCase = (text, pattern) => {
  let result = "";

  for (let i = 0; i < text.length; i += 1) {
    const c = text.charAt(i);
    const p = pattern.charCodeAt(i);

    if (p >= 65 && p < 65 + 26) {
      result += c.toUpperCase();
    } else {
      result += c.toLowerCase();
    }
  }

  return result;
};

const Item = ({
  item,
  isSelected,
  onClick,
  searchProps: { hasSearch, inputValue, inputChangeCb },
  keyExtractor,
  hasMultiselect,
  "data-test": dataTest,
}) => {
  const shouldBeActive = isSelected && ItemStyle.selected;
  const shouldBeDisabled = item.disabled && ItemStyle.disabled;
  const onItemClick = item.disabled
    ? null
    : () => {
        if (!hasMultiselect) {
          inputChangeCb(item.label);
        }
        onClick(item.value);
      };

  const trimmedInput =
    inputValue && typeof inputValue === "string" ? inputValue.trim() : "";
  const regex = new RegExp(trimmedInput, "ig");
  const boldenedStringEle = (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html:
          typeof item.label === "string"
            ? item.label.replace(
                regex,
                (match) => `<b>${matchCase(match, match)}</b>`
              )
            : item.label,
      }}
    />
  );
  const labelObject =
    hasSearch && !hasMultiselect ? boldenedStringEle : item.label;

  return (
    <Body
      aphStyle={[ItemStyle.default, shouldBeActive, shouldBeDisabled]}
      key={item.value}
      onClick={onItemClick}
      tag="div"
      {...OnEnter(onItemClick)}
      data-test={dataTest}
      style={{ fontSize: 14, fontWeight: 400 }}
    >
      {labelObject}
    </Body>
  );
};

const SelectorStyle = StyleSheet.create({
  container: {
    cursor: "pointer",
    lineHeight: 1,
    userSelect: "none",
  },
  alignmentGroup: {
    ...center("vertical"),
    height: "100%",
    whiteSpace: "nowrap",
  },
  input: {
    width: "100%",
    borderTopStyle: "hidden",
    borderLeftStyle: "hidden",
    borderRightStyle: "hidden",
    borderBottomStyle: "hidden",
    backgroundColor: "transparent",
    outline: "none",
  },
});
const Selector = (props) => {
  const {
    beforeElement,
    afterElement,
    aphStyle,
    disabled,
    error,
    isExpanded,
    name,
    onClick,
    placeholder,
    searchProps: { hasInput, hasSearch, inputValue, inputChangeCb },
    hideChevron,
    searchInputAphStyle,
    onChange,
    value,
    "data-test": dataTest,
  } = props;
  const onEnterProps = disabled || hasSearch ? {} : OnEnter(onClick);

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  };

  return (
    <InputContainer
      aphStyle={concat(SelectorStyle.container, aphStyle, searchInputAphStyle)}
      disabled={disabled}
      hasError={!!error}
      hasFocus={isExpanded}
      onClick={onClick}
      {...onEnterProps}
    >
      {hasSearch || hasInput ? (
        <React.Fragment>
          {beforeElement && (
            <div style={{ marginRight: 16 }}>{beforeElement}</div>
          )}
          <input
            autoComplete="off"
            name={name}
            disabled={disabled}
            className={css(SelectorStyle.alignmentGroup, SelectorStyle.input)}
            onChange={(e) => inputChangeCb(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            onBlur={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ cursor: disabled ? "not-allowed" : "auto" }}
            type="text"
            value={inputValue}
            data-test={dataTest}
          />
        </React.Fragment>
      ) : (
        <div
          className={css(SelectorStyle.alignmentGroup)}
          style={{ overflow: "hidden" }}
        >
          {beforeElement && (
            <div style={{ marginRight: 16 }}>{beforeElement}</div>
          )}
          <DisplayValue {...props} data-test={dataTest} />
        </div>
      )}
      <div className={css(SelectorStyle.alignmentGroup)}>
        {afterElement && (
          <div style={{ marginRight: 16, marginLeft: 16 }}>{afterElement}</div>
        )}
        {!hideChevron && (
          <Icon name={isExpanded ? "chevron-up" : "chevron-down"} />
        )}
      </div>
    </InputContainer>
  );
};

const SingleSelectDropdown = (props) => {
  const {
    disabled,
    error,
    items,
    onChange,
    onChangeInput = () => {},
    onClick,
    style,
    value,
    hasSearch,
    hasInput,
    clearOnItemClick,
    loading,
    hasMultiselect,
    searchInputAphStyle,
    keyExtractor,
    useValueForSearch,
    "data-test": dataTest,
  } = props;
  const [isExpanded, toggleDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const stateRef = useRef(value);
  const itemsToUseRef = useRef(items);
  const menuRef = useRef();
  const enterRef = useRef();

  const inputChangeCb = (val) => {
    setInputValue(val);
    onChangeInput(val);
  };

  const isSameAsItem = items.some(
    (item) => item.label === inputValue && item.value === value
  );

  if (hasSearch && !isSameAsItem) {
    if (useValueForSearch) {
      itemsToUseRef.current = items.filter((item) =>
        item.value.toLowerCase().includes(inputValue.toLowerCase().trim())
      );
    } else {
      itemsToUseRef.current = items.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase().trim())
      );
    }
  } else {
    itemsToUseRef.current = items;
  }

  const onItemClick = (val) => {
    if (onClick) {
      onClick(val);
    } else if (onChange) {
      onChange(val);
    }
    stateRef.current = val;
    if (hasInput || hasSearch) {
      setInputValue(val);
    }
    if (!hasMultiselect) {
      toggleDropdown(false);
    }
    if (clearOnItemClick) {
      onChange("");
      inputChangeCb("");
    }
  };
  const onSelectorClick =
    disabled || (hasMultiselect && isExpanded)
      ? null
      : () => toggleDropdown(!isExpanded);

  const searchProps = {
    hasInput,
    hasSearch,
    inputValue,
    inputChangeCb,
  };

  const keyPress = useCallback((e) => {
    const currentIndex = itemsToUseRef.current.findIndex(
      (item) => item.value === stateRef.current
    );
    if (e.keyCode === 13 && itemsToUseRef.current.length === 1) {
      menuRef.current.children[0].focus();
      onItemClick(itemsToUseRef.current[0]);
      enterRef.current = true;
      inputChangeCb(itemsToUseRef.current[0].label);
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      if (currentIndex + 1 <= itemsToUseRef.current.length) {
        stateRef.current = itemsToUseRef.current[currentIndex + 1].value;
        menuRef.current.children[currentIndex + 1].focus();
      }
    }
    if (e.code === "ArrowUp") {
      e.preventDefault();
      if (currentIndex - 1 >= 0) {
        stateRef.current = itemsToUseRef.current[currentIndex - 1].value;
        menuRef.current.children[currentIndex - 1].focus();
      }
    }
  }, []);

  useEffect(() => {
    const itemToSet = items.find((item) => item.label === inputValue);
    if (enterRef.current && itemToSet) {
      onChange(itemToSet.value);
    } else {
      enterRef.current = false;
    }
  }, [inputValue]);

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("keydown", keyPress);
    } else {
      document.removeEventListener("keydown", keyPress);
    }
    return () => {
      window.removeEventListener("keydown", keyPress);
    };
  }, [isExpanded, keyPress]);

  useEffect(() => {
    if (!value) {
      inputChangeCb("");
    } else if (hasSearch) {
      const selectedItem = find(items, (item) => item.value === value);
      if (selectedItem) {
        if (useValueForSearch) {
          inputChangeCb(selectedItem.value);
        } else {
          inputChangeCb(selectedItem.label);
        }
      }
    }
  }, [value]);

  return (
    <div style={{ position: "relative", ...style }}>
      <OutsideClickHandler
        onOutsideClick={() => {
          toggleDropdown(false);
        }}
      >
        <Selector
          {...props}
          isExpanded={isExpanded}
          onClick={onSelectorClick}
          searchProps={searchProps}
          searchInputAphStyle={searchInputAphStyle}
          data-test={dataTest}
        />
        {isExpanded && (
          <Menu menuRef={menuRef}>
            {!loading &&
              itemsToUseRef.current.map((item, idx) => (
                <Item
                  key={keyExtractor ? keyExtractor(item.value) : item.value}
                  item={item}
                  onClick={onItemClick}
                  isSelected={item.value === value}
                  searchProps={searchProps}
                  hasMultiselect
                  data-test={`${dataTest}-item-${
                    keyExtractor ? keyExtractor(item.value) : item.value
                  }`}
                />
              ))}
            {!itemsToUseRef.current.length && !loading && (
              <Item
                key={1}
                item={{
                  label: "No Results Found",
                  value: 1,
                  disabled: true,
                }}
                searchProps={{}}
                hasMultiselect
              />
            )}
            {loading && (
              <Item
                key={1}
                item={{
                  label: <Loader />,
                  value: null,
                  disabled: true,
                }}
                searchProps={{}}
                hasMultiselect
              />
            )}
          </Menu>
        )}
      </OutsideClickHandler>

      {isString(error) && (
        <FormError style={{ color: "#dc3545", fontSize: 14 }}>
          {error}
        </FormError>
      )}
    </div>
  );
};

const ItemType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  disabled: PropTypes.bool,
});

const sharedProps = {
  /** Element or string to render next to the left of the chevron */
  afterElement: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  /** Aphrodite style object, or array of objects, placed on the dropdown toggle */
  aphStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  /** Element or string to render to the left the display value/placeholder */
  beforeElement: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  /** Whether or not to clear the input after clicking an item */
  clearOnItemClick: PropTypes.bool,
  /** Whether or not the input is disabled */
  disabled: PropTypes.bool,
  /** If a boolean is passed in, only the error styling will be applied to the input.
   * If string is passed in, will display an error message under the input as well. */
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** Whether or not to enable the search feature */
  hasSearch: PropTypes.bool,
  /** Whether or not to hide the chevron */
  hideChevron: PropTypes.bool,
  /** The dropdown items to display */
  items: PropTypes.arrayOf(ItemType).isRequired,
  /** The function to call on selection of an option */
  onChange: PropTypes.func,
  /** The function to call on changing the input value (commonly for search) */
  onChangeInput: PropTypes.func,
  /** The text to display when nothing is selected */
  placeholder: PropTypes.string,
  /**  Inline JS style - placed on the div that wraps the selector, error and menu */
  style: PropTypes.object,
  /** The current selected value of the dropdown */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** A function to extract a key for each item for react */
  keyExtractor: PropTypes.func,
};

DisplayValue.propTypes = {
  isExpanded: PropTypes.bool,
  items: PropTypes.arrayOf(ItemType).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Item.propTypes = {
  item: ItemType,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  searchProps: PropTypes.object,
};

Selector.propTypes = {
  ...sharedProps,
  isExpanded: PropTypes.bool,
  onClick: PropTypes.func,
  searchProps: PropTypes.object,
};

SingleSelectDropdown.propTypes = sharedProps;
SingleSelectDropdown.defaultProps = {
  placeholder: "Select item",
};

export default SingleSelectDropdown;
