/**
 * Serialize a form into an object
 * @param form The form to serialize
 * @returns An object of type T from the form
 */
export function serializeForm<T extends object>(form: HTMLFormElement) {
  const children = Array.from(form.children);
  children.pop(); // remove submit button

  const formData = children.reduce((acc, child) => {
    // Find inputs and selects
    const elements = Array.from(child.querySelectorAll('input, select') as NodeListOf<HTMLInputElement | HTMLSelectElement>);
    if (['INPUT', 'SELECT'].includes(child.tagName)) elements.push(child as HTMLInputElement | HTMLSelectElement);

    for (const element of Array.from(elements)) {
      const name = element.getAttribute('name');
      if (!name) {
        console.error('serializeForm: name attribute is required', { element });
        throw new Error('name attribute is required');
      }

      const value = element.value;
      if (value === null) console.warn(`${name}.value returned null`, { element });

      console.log(`[FormUtil]`, { name, value });
      acc[name] = !Number.isNaN(parseInt(value)) ? parseInt(value) : value;
    }

    return acc;
  }, {} as Record<string, any>) as T;

  return formData;
}