const SafeCallback = async <T>(callback: () => Promise<T>): Promise<T | null> => {
  try {
    return await callback();
  } catch (err) {
    return null;
  }
};

export default SafeCallback;
