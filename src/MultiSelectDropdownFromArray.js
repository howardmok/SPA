import { Form } from "react-bootstrap";
import SingleSelectDropdown from "./SingleSelectDropdown";

const checkAllActive = (itemsArr) => {
  return itemsArr.every((item) => item.checked === true);
};

const MultiSelectDropdown = ({
  itemsArr,
  setItemsArr,
  allItemsVal = "All items",
  placeholder = "Select multiple items...",
  customDisplayValue,
  onChange,
  aphStyle,
  disabled,
}) => {
  return (
    <SingleSelectDropdown
      disabled={disabled}
      placeholder={placeholder}
      onChange={(option, idx) => {
        if (option === allItemsVal) {
          if (checkAllActive(itemsArr)) {
            itemsArr.forEach((item) => {
              item.checked = false;
            });
          } else {
            itemsArr.forEach((item) => {
              item.checked = true;
            });
          }
        } else {
          const updatedItem = itemsArr.find(
            (item) => item.displayedValue === option
          );

          updatedItem.checked = !updatedItem.checked;
        }

        if (onChange) {
          onChange(option, idx);
        }

        if (setItemsArr) {
          setItemsArr([...itemsArr]);
        }
      }}
      items={[
        ...(itemsArr.length > 1
          ? [
            {
              label: (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Check checked={checkAllActive(itemsArr)} />
                  {allItemsVal}
                </div>
              ),
              value: allItemsVal,
            },
          ]
          : []),
        ...itemsArr.map((item) => {
          return {
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Check checked={item.checked === true} />
                {item.displayedValue}
              </div>
            ),
            value: item.displayedValue,
          };
        }),
      ]}
      style={{ width: "100%", backgroundColor: "white" }}
      hasMultiselect
      customDisplayValue={
        customDisplayValue ||
        itemsArr.filter((item) => item.checked === true).join(", ")
      }
      hasSearch
      useValueForSearch
      aphStyle={aphStyle}
    />
  );
};

export default MultiSelectDropdown;
