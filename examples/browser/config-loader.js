let jaaqConfig = null;

async function loadConfig() {
  if (jaaqConfig) {
    return jaaqConfig;
  }

  try {
    const response = await fetch('./config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    jaaqConfig = await response.json();
    return jaaqConfig;
  } catch (error) {
    console.error('Error loading config:', error);
    throw error;
  }
}

function getConfig() {
  if (!jaaqConfig) {
    throw new Error('Config not loaded. Call loadConfig() first.');
  }
  return jaaqConfig;
}

window.jaaqConfigLoader = {
  loadConfig,
  getConfig,
};
