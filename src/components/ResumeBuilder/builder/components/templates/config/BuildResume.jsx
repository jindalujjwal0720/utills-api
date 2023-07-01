import React, { useEffect, useRef, useState } from "react";
import styles from "./Config.module.css";
import { useResume } from "../../context/Resume";
import { AiOutlineDelete } from "react-icons/ai";
// import { FiArrowUp } from "react-icons/fi";

const BuildResume = ({ config }) => {
  const { values, get } = useResume();

  return (
    <div className={styles.build}>
      <div className={styles.header}>
        <Input
          type="title"
          name="resume name"
          placeholder="Untitled"
          defaultValue={values.name}
          inputKey="name"
        />
        <div className={styles.language}>
          {config.language === "en" ? "English" : "Unknown"}
        </div>
      </div>
      <div className={styles.sections}>
        {config.sections.map((section, index) => {
          if (section.type === "static") {
            return (
              <StaticSection
                key={index}
                name={section.name}
                fields={section.fields}
                sectionKey={section.key}
                desc={section.description}
                section={get(section.key)}
                displayKey={section.displayKey}
              />
            );
          } else if (section.type === "dynamic") {
            return (
              <DynamicSection
                key={index}
                name={section.name}
                fields={section.fields}
                sectionKey={section.key}
                section={get(section.key)}
                desc={section.description}
                displayKey={section.displayKey}
              />
            );
          } else if (section.type === "list-string") {
            return (
              <DynamicListString
                key={index}
                name={section.name}
                sectionKey={section.key}
                section={get(section.key)}
                desc={section.description}
                displayKey={section.displayKey}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

const StaticSection = ({ name, fields, desc, section }) => {
  return (
    <div className={styles.section}>
      <h2>{name}</h2>
      {desc && <p>{desc}</p>}
      <div className={styles.section_fields}>
        {fields.map((field, index) => (
          <Input
            key={index}
            type={field.type}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            options={field.options}
            fields={field.fields}
            inputKey={field.key}
            defaultValue={field.defaultValue}
            value={section[field.key.split(".").pop()]}
            displayKey={field.displayKey}
          />
        ))}
      </div>
    </div>
  );
};

const DynamicSection = ({
  name,
  fields,
  sectionKey,
  section,
  desc,
  displayKey,
}) => {
  const { handleResumeChange } = useResume();
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (!section) return;
    sectionRefs.current = sectionRefs.current.slice(0, section?.length);
  }, [section]);

  const handleElementAdd = (e) => {
    e.stopPropagation();
    const newElement = {};
    fields.forEach((field) => {
      if (field.type === "text" || field.type === "textarea") {
        newElement[field.name] = "";
      }
    });
    handleResumeChange(sectionKey, [...section, newElement]);
  };

  const handleElementDelete = (e, index) => {
    e.stopPropagation();
    const element = sectionRefs.current[index];
    element.classList.add(styles.slidefadeout);
    setTimeout(() => {
      handleResumeChange(sectionKey, [
        ...section.slice(0, index),
        ...section.slice(index + 1),
      ]);
    }, 480);
  };

  return (
    <div className={styles.section}>
      <h2>{name}</h2>
      {desc && <p>{desc}</p>}
      <div className={styles.section_elements}>
        {section.map((element, _index) => (
          <details
            ref={(el) => (sectionRefs.current[_index] = el)}
            key={_index}
            className={styles.section_fields}
          >
            <summary>
              {element[displayKey] || "Untitled"}
              <div className={styles.section_element_actions}>
                <button onClick={(e) => handleElementDelete(e, _index)}>
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            </summary>
            {fields?.map((field, index) => (
              <Input
                key={index}
                type={field.type}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                value={element[field.name]}
                defaultValue={element[field.name] || field.defaultValue}
                inputKey={`${sectionKey}.${_index}.${field.key}`}
                options={field.options}
                fields={field.fields}
                displayKey={field.displayKey}
              />
            ))}
          </details>
        ))}
      </div>
      <div className={styles.section_actions}>
        <button onClick={handleElementAdd}>+ Add {name}</button>
      </div>
    </div>
  );
};

const Input = ({
  type,
  label,
  name,
  placeholder,
  defaultValue,
  value,
  fields,
  inputKey,
  options,
  displayKey,
}) => {
  const { handleResumeChange, handlePhoto, setLoading } = useResume();

  const handleInputChange = async (e) => {
    if (type === "image") {
      const photo = await handlePhoto(e);
      handleResumeChange(inputKey, photo);
    } else if (
      type === "text" ||
      type === "textarea" ||
      type === "title" ||
      type === "dropdown"
    ) {
      handleResumeChange(inputKey, e.target.value);
    }
  };

  const handleInputChangeWithDebounce = (e) => {
    setLoading(true);
    const debounceId = setTimeout(() => {
      clearTimeout(debounceId);
      handleInputChange(e);
    }, 1000);
  };

  switch (type) {
    case "title":
      return (
        <div className={styles.input_text}>
          <input
            className={styles.input_title}
            name={name}
            type="text"
            id={name}
            placeholder={placeholder}
            defaultValue={value || defaultValue}
            onChange={(e) => {
              handleInputChangeWithDebounce(e);
            }}
          />
        </div>
      );
    case "text":
      return (
        <div className={styles.input_text}>
          <label htmlFor={name}>{label}</label>
          <input
            name={name}
            type="text"
            id={name}
            placeholder={placeholder}
            defaultValue={value || defaultValue}
            onChange={(e) => {
              handleInputChangeWithDebounce(e);
            }}
          />
        </div>
      );
    case "textarea":
      return (
        <div className={styles.input_textarea}>
          <label htmlFor={name}>{label}</label>
          <textarea
            name={name}
            id={name}
            placeholder={placeholder}
            defaultValue={value || defaultValue}
            onChange={(e) => {
              handleInputChangeWithDebounce(e);
            }}
          />
        </div>
      );
    case "image":
      return (
        <div className={styles.input_image}>
          <label htmlFor={name}>
            <img src={value} alt="" />
            {label}
          </label>
          <input
            name={name}
            id={name}
            type="file"
            accept="image/*"
            placeholder={placeholder}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
      );
    case "dropdown":
      return (
        <div className={styles.input_dropdown}>
          <label htmlFor={name}>{label}</label>
          <select
            name={name}
            id={name}
            onChange={(e) => {
              handleInputChange(e);
            }}
            defaultValue={value || defaultValue}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    case "list-string":
      return (
        <DynamicListString
          name={label}
          desc={placeholder}
          sectionKey={inputKey}
          section={value}
          displayKey={displayKey}
        />
      );
    case "list":
      return (
        <DynamicList
          name={label}
          desc={placeholder}
          sectionKey={inputKey}
          section={value}
          fields={fields}
          displayKey={displayKey}
        />
      );
  }
};

// function useForceUpdate() {
//   const [value, setValue] = useState(0); // integer state
//   return () => setValue((value) => value + 1); // update state to force render
//   // A function that increment 👆🏻 the previous state like here
//   // is better than directly setting `setValue(value + 1)`
// }

const DynamicListString = ({ name, sectionKey, section, desc, displayKey }) => {
  const { handleResumeChange, setLoading } = useResume();
  const itemRefs = useRef([]);
  // const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (!section) return;
    itemRefs.current = itemRefs.current.slice(0, section?.length);
  }, [section]);

  const handleAdd = (e) => {
    e.stopPropagation();
    handleResumeChange(sectionKey, [...(section || []), ""]);
  };

  const handleDelete = (e, index) => {
    e.stopPropagation();
    const element = itemRefs.current[index];
    element.classList.add(styles.slidefadeout);
    setTimeout(() => {
      handleResumeChange(sectionKey, [
        ...section.slice(0, index),
        ...section.slice(index + 1),
      ]);
    }, 480);
  };

  const handleInputChange = (e, index) => {
    e.stopPropagation();
    handleResumeChange(`${sectionKey}.${index}`, e.target.value);
  };

  const handleInputChangeWithDebounce = (e, index) => {
    e.stopPropagation();
    setLoading(true);
    const debounceId = setTimeout(() => {
      clearTimeout(debounceId);
      handleInputChange(e, index);
    }, 1000);
  };

  // const handleMoveUp = (e, index) => {
  //   e.stopPropagation();
  //   if (index === 0) return;
  //   // swap with previous element
  //   const newSection = [...section];
  //   const temp = newSection[index - 1];
  //   newSection[index - 1] = newSection[index];
  //   newSection[index] = temp;
  //   handleResumeChange(sectionKey, newSection);
  //   forceUpdate();
  // };

  return (
    <div className={styles.input_list}>
      <label htmlFor={name} className={styles.input_list_label}>
        {name}
      </label>
      {desc && <p>{desc}</p>}
      <div className={styles.input_list_elements}>
        {section?.map((element, index) => (
          <div
            ref={(el) => (itemRefs.current[index] = el)}
            key={index}
            className={styles.input_list_String_element}
          >
            {/* <span
              className={styles.slide_up_icon}
              onClick={(e) => handleMoveUp(e, index)}
            >
              <FiArrowUp size={18} />
            </span> */}
            <input
              type="text"
              defaultValue={element}
              onChange={(e) => {
                handleInputChangeWithDebounce(e, index);
              }}
            />
            <button onClick={(e) => handleDelete(e, index)}>
              <AiOutlineDelete size={20} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.section_actions}>
        <button onClick={handleAdd}>+ Add {name}</button>
      </div>
    </div>
  );
};

const DynamicList = ({
  name,
  sectionKey,
  section,
  desc,
  fields,
  displayKey,
}) => {
  const { handleResumeChange } = useResume();
  const itemRefs = useRef([]);

  const handleAdd = (e) => {
    e.stopPropagation();
    const newElement = {};
    fields.forEach((field) => {
      if (field.type === "text" || field.type === "textarea") {
        newElement[field.name] = "";
      } else if (field.type === "dropdown") {
        newElement[field.name] = field.placeholder || "";
      } else if (field.type === "list-string") {
        newElement[field.name] = [];
      }
    });
    handleResumeChange(sectionKey, [...(section || []), newElement]);
  };

  const handleDelete = (e, index) => {
    e.stopPropagation();
    const element = itemRefs.current[index];
    element.classList.add(styles.slidefadeout);
    setTimeout(() => {
      handleResumeChange(sectionKey, [
        ...section.slice(0, index),
        ...section.slice(index + 1),
      ]);
    }, 480);
  };

  return (
    <div className={styles.input_list}>
      <label htmlFor={name} className={styles.input_list_label}>
        {name}
      </label>
      {desc && <p>{desc}</p>}
      <div className={styles.input_list_elements}>
        {section?.map((element, _index) => (
          <details
            ref={(el) => (itemRefs.current[_index] = el)}
            key={_index}
            className={styles.input_list_element}
          >
            <summary>
              {element[displayKey] || "Untitled"}
              <button onClick={(e) => handleDelete(e, _index)}>
                <AiOutlineDelete size={20} />
              </button>
            </summary>
            {fields.map((field, index) => (
              <Input
                key={index}
                type={field.type}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                value={element[field.name]}
                defaultValue={element[field.name]}
                inputKey={`${sectionKey}.${_index}.${field.key}`}
                options={field.options}
                fields={field.fields}
              />
            ))}
          </details>
        ))}
      </div>
      <div className={styles.section_actions}>
        <button onClick={handleAdd}>+ Add {name}</button>
      </div>
    </div>
  );
};

export default BuildResume;
