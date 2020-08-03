const initConfiguration = async () => {
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  const response = await fetch(`${publicUrl.origin}/configuration.json`);
  const configuration = await response.json();
  window.localStorage.setItem(
    'AUTHENTICATION_MODE',
    configuration.AUTHENTICATION_MODE,
  );
  window.localStorage.setItem('PEARL_JAM_HOST', configuration.PEARL_JAM_HOST);
  window.localStorage.setItem('PEARL_JAM_PORT', configuration.PEARL_JAM_PORT);
};

export default initConfiguration;
