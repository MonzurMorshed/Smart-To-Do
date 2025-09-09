import { useState } from 'react';
import Select from 'react-select'

const SelectInput = (props) => {

    const selectedOption = props.selectedOptions;
    const options = props.options;
    
    return (
        <Select
            value={selectedOption}
            onChange={(option) => props.setFilter(option.label)}
            options={options}
            className="w-full rounded-[30px]"
            classNamePrefix="select2"
            isSearchable
            styles={{
                control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "var(--border)",
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    padding: "2px",
                }),
                option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "var(--primary)" : "var(--card)",
                    color: isFocused ? "white" : "var(--text)",
                    cursor: "pointer",
                }),
                singleValue: (base) => ({
                    ...base,
                    color: "var(--text)"
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: "var(--card)",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                }),
            }}
        />
    )
}

export default SelectInput;