/**
 * Serialize a form into an object
 * @param form The form to serialize
 * @returns An object of type T from the form
 */
export function serializeForm<T extends object>(form: HTMLFormElement) {
  const children = Array.from(form.children);
  children.pop(); // remove submit button

  return children.reduce((acc, child) => {
    // Find inputs and selects
    const elements = child.querySelectorAll('input, select') as NodeListOf<HTMLInputElement | HTMLSelectElement>;
    if (!elements) {
      console.warn('serializeForm: element is null', {child});
      return acc;
    }

    for (const element of Array.from(elements)) {
      const name = element.getAttribute('name');
      if (!name) {
        console.error('serializeForm: name attribute is required', {element});
        throw new Error('name attribute is required');
      }
  
      const value = element.value;
      if (value === null) console.warn(`${name}.value returned null`, {element});
      
      acc[name] = value;
    }
    
    return acc;
  }, {} as Record<string, any>) as T;
}