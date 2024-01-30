export const formatName = (name: string) => ['s', 'z', 'x'].includes(name[name.length - 1]) ? `${name}'` : `${name}s`;