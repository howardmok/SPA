import { Form } from "react-bootstrap";
import SingleSelectDropdown from "./SingleSelectDropdown";

const checkAllActive = (itemObj) =>
  Object.values(itemObj).every((itemVal) => itemVal.checked === true);

/* itemsObj should be an object mapping the values to an object, which contains
// properties like checked, displayedValue, etc
// Example: itemsObj = { item_1: { checked: true, displayedValue: "Item 1", {...props} }, ... }
*/
const MultiSelectDropdown = ({
  itemsObj,
  setItemsObj,
  allItemsVal = "All items",
  placeholder = "Select multiple items...",
  customDisplayValue,
  onChange,
  aphStyle,
  hasSearch,
  disabled,
  includeSelectAll = true,
}) => {
  let items = [];
  if (includeSelectAll) {
    items.push({
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form.Check checked={checkAllActive(itemsObj)} />
          {allItemsVal}
        </div>
      ),
      value: allItemsVal,
    });
  }

  items = [
    ...items,
    ...Object.entries(itemsObj).map(([itemVal, itemObj]) => ({
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form.Check checked={itemObj.checked === true} />
          {itemObj.displayedValue}
        </div>
      ),
      value: itemVal,
    })),
  ];

  return (
    <SingleSelectDropdown
      placeholder={placeholder}
      onChange={(item, idx) => {
        if (item === allItemsVal) {
          if (checkAllActive(itemsObj)) {
            Object.keys(itemsObj).forEach((item) => {
              itemsObj[item].checked = false;
            });
          } else {
            Object.keys(itemsObj).forEach((item) => {
              itemsObj[item].checked = true;
            });
          }
        } else {
          itemsObj[item].checked = !itemsObj[item].checked;
        }
        if (onChange) {
          onChange(item, idx);
        }
        setItemsObj({ ...itemsObj });
      }}
      items={items}
      style={{ backgroundColor: "white" }}
      hasMultiselect
      customDisplayValue={
        customDisplayValue ||
        Object.keys(itemsObj)
          .filter((item) => itemsObj[item].checked === true)
          .join(", ")
      }
      hasSearch={hasSearch}
      useValueForSearch
      aphStyle={aphStyle}
      disabled={disabled}
    />
  );
};

export default MultiSelectDropdown;
