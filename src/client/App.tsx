import React, { useEffect, useState } from "react";
import "./App.css";

interface FormField {
  type: string;
  name: string;
  label: string;
  order: number;
  options?: { value: string; label: string; subOptions?: { value: string; label: string }[] }[];
}

interface FormSections {
  [key: string]: FormField[];
}

function App() {
  const [formSections, setFormSections] = useState<FormSections>({});
  const [formValues, setFormValues] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    fetch("/back")
      .then(response => response.json())
      .then(data => setFormSections(data))
      .catch(error => console.error("Err:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormValues(prevFormValues => {
        const updatedFormValues = { ...prevFormValues };
        const currentValues = updatedFormValues[name] ? [...updatedFormValues[name]] : [];
        if (checked && !currentValues.includes(value)) {
          currentValues.push(value);
        } else if (!checked) {
          const index = currentValues.indexOf(value);
          if (index !== -1) {
            currentValues.splice(index, 1);
          }
        }
        updatedFormValues[name] = currentValues;
        return updatedFormValues;
      });
    } else {
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        [name]: [value],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Выбранные ответы:", formValues);
    fetch('/back', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    })
    .then(response => response.json())
    .then(data => console.log('Успех:', data))
    .catch(error => console.error('Ошибка:', error));
  };

  return (
    <div className="app">
      <h1>Динамическая форма</h1>
      <form className="form" onSubmit={handleSubmit}>
        {Object.keys(formSections).map(sectionName => (
          <div key={sectionName}>
            <h2>{sectionName}</h2>
            {formSections[sectionName].sort((a, b) => a.order - b.order).map((field, index) => (
              <div className="prod" key={index}>
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === 'radio-group' || field.type === 'checkbox' ? (
                  field.options?.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type={field.type === 'radio-group' ? 'radio' : 'checkbox'}
                        id={`${field.name}-${option.value}`}
                        name={field.name}
                        value={option.value}
                        checked={Array.isArray(formValues[field.name]) ? formValues[field.name].includes(option.value) : false}
                        onChange={handleChange}
                      />
                      <label htmlFor={`${field.name}-${option.value}`}>{option.label}</label>
                      {option.subOptions && formValues[field.name]?.includes(option.value) && (
                        <div>
                          {option.subOptions.map((subOption, subOptionIndex) => (
                            <div key={subOptionIndex}>
                              <input
                                type={field.type === 'radio-group' ? 'radio' : 'checkbox'}
                                id={`${field.name}-${option.value}-${subOption.value}`}
                                name={`${field.name}-${option.value}`}
                                value={subOption.value}
                                checked={Array.isArray(formValues[`${field.name}-${option.value}`]) ? formValues[`${field.name}-${option.value}`].includes(subOption.value) : false}
                                onChange={handleChange}
                              />
                              <label htmlFor={`${field.name}-${option.value}-${subOption.value}`}>{subOption.label}</label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formValues[field.name]?.[0] || ""}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <button className="btn">Submit</button>
      </form>
    </div>
  );
}

export default App;
